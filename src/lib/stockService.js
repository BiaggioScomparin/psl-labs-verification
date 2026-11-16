import { supabaseAdmin, isSupabaseAdminConfigured } from './supabaseAdmin';
import compoundsData from '../data/compounds.json';
import fs from 'fs';
import path from 'path';

const localDbPath = path.join(process.cwd(), 'src', 'data', 'db.json');

function getLocalDb() {
  try {
    if (fs.existsSync(localDbPath)) {
      return JSON.parse(fs.readFileSync(localDbPath, 'utf8'));
    }
  } catch (e) {
    console.warn("Error reading local db.json:", e);
  }
  return { purchases: [], sales: [], losses: [], orders: [] };
}

function saveLocalDb(data) {
  try {
    fs.writeFileSync(localDbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.warn("Error writing local db.json:", e);
  }
}

// 1. INVENTORY (ESTOQUE)
export async function getInventory() {
  if (isSupabaseAdminConfigured) {
    const { data, error } = await supabaseAdmin
      .from('psl_inventory')
      .select('*')
      .order('name', { ascending: true });
    
    if (!error && data && data.length > 0) {
      return data;
    }
    console.warn("Supabase getInventory error, using fallback:", error);
  }

  // Fallback from compounds.json
  const inventory = [];
  compoundsData.forEach(comp => {
    comp.doses.forEach(dose => {
      const isCu50 = (dose.code === 'CU50' || comp.id === 'ghk-cu');
      inventory.push({
        compound_id: comp.id,
        code: dose.code,
        name: comp.name,
        dosage: dose.label,
        category: comp.line || 'Peptídeos',
        stock_qty: isCu50 ? 29 : 0,
        min_stock: 5,
        is_ready_sp: isCu50,
        unit_cost: dose.totalCostB2C || 0,
        price_b2c: dose.suggestedPriceB2C || 0,
        price_b2b: dose.b2bBoxPrice || 0
      });
    });
  });
  return inventory;
}

export async function updateStockQty(code, qty, isReadySp) {
  if (isSupabaseAdminConfigured) {
    const updateData = { 
      stock_qty: parseInt(qty, 10),
      updated_at: new Date().toISOString()
    };
    if (isReadySp !== undefined) {
      updateData.is_ready_sp = isReadySp;
    } else {
      updateData.is_ready_sp = (parseInt(qty, 10) > 0);
    }

    const { data, error } = await supabaseAdmin
      .from('psl_inventory')
      .update(updateData)
      .eq('code', code)
      .select()
      .single();

    if (!error) return data;
    console.error("Supabase updateStockQty error:", error);
  }

  return { code, stock_qty: qty, is_ready_sp: qty > 0 };
}

// 2. COMPRAS (PURCHASES)
export async function getPurchases() {
  if (isSupabaseAdminConfigured) {
    const { data, error } = await supabaseAdmin
      .from('psl_purchases')
      .select('*')
      .order('date', { ascending: false });
    if (!error && data) return data;
  }

  const db = getLocalDb();
  return db.purchases || [
    {
      id: "CMP-001",
      date: "2026-11-10",
      category: "peptide",
      compound_id: "ghk-cu",
      code: "CU50",
      name: "GHK-Cu",
      dosage: "50mg",
      qty: 40,
      unit_cost: 25.40,
      total_cost: 1016.00,
      supplier: "Fábrica Chinesa / SinoPept",
      notes: "Lote de 40 frascos registrado"
    }
  ];
}

export async function addPurchase(purchase) {
  const newPurchase = {
    id: purchase.id || `CMP-${String(Date.now()).slice(-4)}`,
    date: purchase.date || new Date().toISOString().split('T')[0],
    category: purchase.category || 'peptide',
    compound_id: purchase.compound_id || '',
    code: purchase.code || '',
    name: purchase.name,
    dosage: purchase.dosage || '',
    qty: parseInt(purchase.qty, 10),
    unit_cost: parseFloat(purchase.unit_cost) || 0,
    total_cost: (parseInt(purchase.qty, 10) * (parseFloat(purchase.unit_cost) || 0)),
    supplier: purchase.supplier || 'Fábrica Chinesa / SinoPept',
    notes: purchase.notes || ''
  };

  if (isSupabaseAdminConfigured) {
    const { data, error } = await supabaseAdmin
      .from('psl_purchases')
      .insert(newPurchase)
      .select()
      .single();
    if (!error) return data;
    console.error("Supabase addPurchase error:", error);
  }

  const db = getLocalDb();
  db.purchases = db.purchases || [];
  db.purchases.unshift(newPurchase);
  saveLocalDb(db);
  return newPurchase;
}

// 3. VENDAS (SALES)
export async function getSales() {
  if (isSupabaseAdminConfigured) {
    const { data, error } = await supabaseAdmin
      .from('psl_sales')
      .select('*')
      .order('date', { ascending: false });
    if (!error && data) return data;
  }

  const db = getLocalDb();
  return db.sales || [];
}

export async function addSale(sale) {
  const revenue = parseFloat(sale.total_revenue) || 0;
  const cost = parseFloat(sale.total_cost) || 0;
  const profit = revenue - cost;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

  const newSale = {
    id: sale.id || `VND-${String(Date.now()).slice(-4)}`,
    order_id: sale.order_id || null,
    date: sale.date || new Date().toISOString().split('T')[0],
    client_name: sale.client_name,
    client_phone: sale.client_phone || '',
    items: sale.items || [],
    total_revenue: revenue,
    total_cost: cost,
    gross_profit: profit,
    margin_percent: Math.round(margin * 10) / 10,
    delivery_method: sale.delivery_method || 'sedex',
    status: sale.status || 'completed'
  };

  if (isSupabaseAdminConfigured) {
    const { data, error } = await supabaseAdmin
      .from('psl_sales')
      .insert(newSale)
      .select()
      .single();
    
    // Decrement stock for sold items
    if (Array.isArray(sale.items)) {
      for (const item of sale.items) {
        if (item.code && item.qty) {
          await supabaseAdmin.rpc('fn_decrement_stock', {
            p_code: item.code,
            p_qty: item.qty
          }).catch(console.warn);
        }
      }
    }

    if (!error) return data;
    console.error("Supabase addSale error:", error);
  }

  const db = getLocalDb();
  db.sales = db.sales || [];
  db.sales.unshift(newSale);
  saveLocalDb(db);
  return newSale;
}

// 4. PERDAS (LOSSES)
export async function getLosses() {
  if (isSupabaseAdminConfigured) {
    const { data, error } = await supabaseAdmin
      .from('psl_losses')
      .select('*')
      .order('date', { ascending: false });
    if (!error && data) return data;
  }

  const db = getLocalDb();
  return db.losses || [
    {
      id: "PRD-001",
      date: "2026-11-11",
      category: "peptide",
      compound_id: "ghk-cu",
      code: "CU50",
      name: "GHK-Cu",
      dosage: "50mg",
      qty: 10,
      unit_cost: 25.40,
      loss_total: 254.00,
      reason: "Fornecedor não enviou",
      notes: "Faltaram 10 frascos na remessa do fornecedor"
    },
    {
      id: "PRD-002",
      date: "2026-11-12",
      category: "peptide",
      compound_id: "ghk-cu",
      code: "CU50",
      name: "GHK-Cu",
      dosage: "50mg",
      qty: 1,
      unit_cost: 25.40,
      loss_total: 25.40,
      reason: "Uso próprio",
      notes: "Retirado 1 frasco para protocolo pessoal"
    }
  ];
}

export async function addLoss(loss) {
  const qty = parseInt(loss.qty, 10);
  const unitCost = parseFloat(loss.unit_cost) || 0;
  const newLoss = {
    id: loss.id || `PRD-${String(Date.now()).slice(-4)}`,
    date: loss.date || new Date().toISOString().split('T')[0],
    category: loss.category || 'peptide',
    compound_id: loss.compound_id || '',
    code: loss.code || '',
    name: loss.name,
    dosage: loss.dosage || '',
    qty: qty,
    unit_cost: unitCost,
    loss_total: qty * unitCost,
    reason: loss.reason || 'Desconhecido',
    notes: loss.notes || ''
  };

  if (isSupabaseAdminConfigured) {
    const { data, error } = await supabaseAdmin
      .from('psl_losses')
      .insert(newLoss)
      .select()
      .single();
    if (!error) return data;
    console.error("Supabase addLoss error:", error);
  }

  const db = getLocalDb();
  db.losses = db.losses || [];
  db.losses.unshift(newLoss);
  saveLocalDb(db);
  return newLoss;
}

// 5. PEDIDOS (ORDERS)
export async function getOrders() {
  if (isSupabaseAdminConfigured) {
    const { data, error } = await supabaseAdmin
      .from('psl_orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) return data;
  }

  const db = getLocalDb();
  return db.orders || [];
}

export async function createOrder(order) {
  const newOrder = {
    id: order.id || `PED-${Math.floor(1000 + Math.random() * 9000)}`,
    client_name: order.client_name || 'Cliente WhatsApp',
    client_phone: order.client_phone || '',
    client_address: order.client_address || '',
    items: order.items || [],
    delivery_method: order.delivery_method || 'sedex',
    subtotal: parseFloat(order.subtotal) || 0,
    shipping_cost: parseFloat(order.shipping_cost) || 0,
    total: parseFloat(order.total) || 0,
    status: order.status || 'pending_pix',
    whatsapp_sent: true,
    created_at: new Date().toISOString()
  };

  if (isSupabaseAdminConfigured) {
    const { data, error } = await supabaseAdmin
      .from('psl_orders')
      .insert(newOrder)
      .select()
      .single();
    if (!error) return data;
    console.error("Supabase createOrder error:", error);
  }

  const db = getLocalDb();
  db.orders = db.orders || [];
  db.orders.unshift(newOrder);
  saveLocalDb(db);
  return newOrder;
}

// 6. DRE RESUMO CONSOLIDADO
export async function getDRESummary() {
  if (isSupabaseAdminConfigured) {
    const { data, error } = await supabaseAdmin
      .from('v_psl_dre')
      .select('*')
      .single();
    if (!error && data) return data;
  }

  // Calculate from local records
  const [purchases, sales, losses, inventory] = await Promise.all([
    getPurchases(),
    getSales(),
    getLosses(),
    getInventory()
  ]);

  const receita_bruta = sales.reduce((acc, s) => acc + (parseFloat(s.total_revenue) || 0), 0);
  const cmv = sales.reduce((acc, s) => acc + (parseFloat(s.total_cost) || 0), 0);
  const lucro_bruto = receita_bruta - cmv;
  const margem_bruta_percent = receita_bruta > 0 ? Math.round((lucro_bruto / receita_bruta) * 1000) / 10 : 0;
  const total_perdas = losses.reduce((acc, l) => acc + (parseFloat(l.loss_total) || 0), 0);
  const total_compras_investido = purchases.reduce((acc, p) => acc + (parseFloat(p.total_cost) || 0), 0);
  
  const estoque_valor_custo = inventory.reduce((acc, i) => acc + ((i.stock_qty || 0) * (parseFloat(i.unit_cost) || 0)), 0);
  const estoque_valor_venda = inventory.reduce((acc, i) => acc + ((i.stock_qty || 0) * (parseFloat(i.price_b2c) || 0)), 0);
  const total_frascos_estoque = inventory.reduce((acc, i) => acc + (i.stock_qty || 0), 0);

  return {
    receita_bruta,
    cmv,
    lucro_bruto,
    margem_bruta_percent,
    total_perdas,
    total_compras_investido,
    estoque_valor_custo,
    estoque_valor_venda,
    total_frascos_estoque,
    is_cloud_supabase: isSupabaseAdminConfigured
  };
}
