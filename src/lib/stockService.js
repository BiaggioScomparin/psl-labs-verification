import { supabaseAdmin, isSupabaseAdminConfigured } from './supabaseAdmin.js';
import fs from 'fs';
import path from 'path';

const compoundsPath = path.join(process.cwd(), 'src', 'data', 'compounds.json');
function getCompoundsData() {
  try {
    if (fs.existsSync(compoundsPath)) {
      return JSON.parse(fs.readFileSync(compoundsPath, 'utf8'));
    }
  } catch (e) {
    console.warn("Error reading compounds.json:", e);
  }
  return [];
}

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

  // Fallback from db.json if available
  const db = getLocalDb();
  if (db.inventory && Array.isArray(db.inventory) && db.inventory.length > 0) {
    return db.inventory;
  }

  // Fallback from compounds.json
  const inventory = [];
  getCompoundsData().forEach(comp => {
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

export async function createInventoryItem(itemData) {
  if (!itemData || typeof itemData !== 'object') {
    throw new Error('Dados do item são obrigatórios');
  }

  const code = (itemData.code || '').trim().toUpperCase();
  if (!code) {
    throw new Error('Código (code) é obrigatório e único');
  }

  const name = (itemData.name || '').trim();
  if (!name) {
    throw new Error('Nome do peptídeo (name) é obrigatório');
  }

  const compound_id = (itemData.compound_id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).trim();
  const dosage = (itemData.dosage || '').trim() || '-';
  const category = (itemData.category || 'Peptídeos').trim();
  const stock_qty = parseInt(itemData.stock_qty ?? 0, 10) || 0;
  const min_stock = parseInt(itemData.min_stock ?? 5, 10) || 5;
  const is_ready_sp = itemData.is_ready_sp !== undefined
    ? Boolean(itemData.is_ready_sp)
    : stock_qty > 0;
  const unit_cost = parseFloat(itemData.unit_cost ?? 0) || 0;
  const price_b2c = parseFloat(itemData.price_b2c ?? 0) || 0;
  const price_b2b = parseFloat(itemData.price_b2b ?? 0) || 0;

  const newItem = {
    compound_id,
    code,
    name,
    dosage,
    category,
    stock_qty,
    min_stock,
    is_ready_sp,
    unit_cost,
    price_b2c,
    price_b2b,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  if (isSupabaseAdminConfigured) {
    const { data, error } = await supabaseAdmin
      .from('psl_inventory')
      .insert(newItem)
      .select()
      .single();

    if (error) {
      console.error("Supabase createInventoryItem error:", error);
      throw new Error(error.message || 'Erro ao criar item de estoque');
    }

    const db = getLocalDb();
    if (db.inventory) {
      db.inventory.push(data || newItem);
      saveLocalDb(db);
    }

    return data;
  }

  // Fallback to db.json
  const db = getLocalDb();
  db.inventory = db.inventory || [];
  const existingIdx = db.inventory.findIndex(i => i.code?.toUpperCase() === code);
  if (existingIdx >= 0) {
    throw new Error(`Item com código ${code} já existe`);
  }
  db.inventory.push(newItem);
  saveLocalDb(db);
  return newItem;
}

export async function updateInventoryItem(code, itemData) {
  const targetCode = String(code || '').trim().toUpperCase();
  if (!targetCode) {
    throw new Error('Código (code) é obrigatório');
  }

  const updateData = {
    updated_at: new Date().toISOString()
  };

  if (itemData.name !== undefined) updateData.name = String(itemData.name).trim();
  if (itemData.dosage !== undefined) updateData.dosage = String(itemData.dosage).trim();
  if (itemData.category !== undefined) updateData.category = String(itemData.category).trim();
  if (itemData.compound_id !== undefined) updateData.compound_id = String(itemData.compound_id).trim();

  const rawQty = itemData.stock_qty !== undefined ? itemData.stock_qty : itemData.qty;
  if (rawQty !== undefined) {
    updateData.stock_qty = parseInt(rawQty, 10) || 0;
  }

  if (itemData.min_stock !== undefined) {
    updateData.min_stock = parseInt(itemData.min_stock, 10) || 0;
  }

  if (itemData.is_ready_sp !== undefined) {
    updateData.is_ready_sp = Boolean(itemData.is_ready_sp);
  } else if (rawQty !== undefined) {
    updateData.is_ready_sp = (parseInt(rawQty, 10) > 0);
  }

  if (itemData.unit_cost !== undefined) {
    updateData.unit_cost = parseFloat(itemData.unit_cost) || 0;
  }
  if (itemData.price_b2c !== undefined) {
    updateData.price_b2c = parseFloat(itemData.price_b2c) || 0;
  }
  if (itemData.price_b2b !== undefined) {
    updateData.price_b2b = parseFloat(itemData.price_b2b) || 0;
  }

  if (isSupabaseAdminConfigured) {
    const { data, error } = await supabaseAdmin
      .from('psl_inventory')
      .update(updateData)
      .eq('code', targetCode)
      .select()
      .single();

    if (error) {
      console.error("Supabase updateInventoryItem error:", error);
      throw new Error(error.message || 'Erro ao atualizar item do estoque');
    }

    const db = getLocalDb();
    if (db.inventory) {
      const idx = db.inventory.findIndex(i => i.code?.toUpperCase() === targetCode);
      if (idx !== -1) {
        db.inventory[idx] = { ...db.inventory[idx], ...updateData };
        saveLocalDb(db);
      }
    }

    return data;
  }

  // Fallback db.json
  const db = getLocalDb();
  if (!db.inventory) {
    db.inventory = await getInventory();
  }
  const idx = db.inventory.findIndex(i => i.code?.toUpperCase() === targetCode);
  if (idx === -1) {
    throw new Error(`Item com código ${targetCode} não encontrado`);
  }
  db.inventory[idx] = { ...db.inventory[idx], ...updateData };
  saveLocalDb(db);
  return db.inventory[idx];
}

export async function deleteInventoryItem(code) {
  const targetCode = String(code || '').trim().toUpperCase();
  if (!targetCode) {
    throw new Error('Código (code) é obrigatório');
  }

  if (isSupabaseAdminConfigured) {
    const { data, error } = await supabaseAdmin
      .from('psl_inventory')
      .delete()
      .eq('code', targetCode)
      .select();

    if (error) {
      console.error("Supabase deleteInventoryItem error:", error);
      throw new Error(error.message || 'Erro ao excluir item do estoque');
    }

    const db = getLocalDb();
    if (db.inventory) {
      db.inventory = db.inventory.filter(i => i.code?.toUpperCase() !== targetCode);
      saveLocalDb(db);
    }

    return { success: true, deletedCode: targetCode, data };
  }

  const db = getLocalDb();
  if (db.inventory) {
    db.inventory = db.inventory.filter(i => i.code?.toUpperCase() !== targetCode);
    saveLocalDb(db);
  }
  return { success: true, deletedCode: targetCode };
}

export async function updateStockQty(code, qty, isReadySp) {
  return updateInventoryItem(code, {
    stock_qty: qty,
    is_ready_sp: isReadySp
  });
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
    id: sale.id || `VND-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
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

    if (error) {
      console.error("Supabase addSale error:", error);
      throw new Error(error.message || 'Erro ao registrar venda');
    }

    // Decrement stock for sold items
    if (Array.isArray(sale.items)) {
      for (const item of sale.items) {
        if (item.code && item.qty) {
          try {
            await supabaseAdmin.rpc('fn_decrement_stock', {
              p_code: item.code,
              p_qty: parseInt(item.qty, 10)
            });
          } catch (rpcErr) {
            console.warn("fn_decrement_stock warning:", rpcErr);
          }
        }
      }
    }

    const db = getLocalDb();
    if (db.sales) {
      db.sales.unshift(data || newSale);
      saveLocalDb(db);
    }

    return data;
  }

  const db = getLocalDb();
  db.sales = db.sales || [];
  db.sales.unshift(newSale);
  saveLocalDb(db);
  return newSale;
}

export async function updateSale(saleData) {
  const saleId = saleData.id;
  if (!saleId) {
    throw new Error('ID da venda é obrigatório');
  }

  // Fetch current sale to calculate profit if revenue/cost are omitted
  let existingSale = null;
  if (isSupabaseAdminConfigured) {
    const { data, error } = await supabaseAdmin
      .from('psl_sales')
      .select('*')
      .eq('id', saleId)
      .single();
    if (!error && data) {
      existingSale = data;
    }
  } else {
    const db = getLocalDb();
    existingSale = (db.sales || []).find(s => s.id === saleId);
  }

  const revenue = saleData.total_revenue !== undefined 
    ? (parseFloat(saleData.total_revenue) || 0) 
    : (existingSale ? parseFloat(existingSale.total_revenue) || 0 : 0);

  const cost = saleData.total_cost !== undefined 
    ? (parseFloat(saleData.total_cost) || 0) 
    : (existingSale ? parseFloat(existingSale.total_cost) || 0 : 0);

  const profit = revenue - cost;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

  const updateFields = {
    total_revenue: revenue,
    total_cost: cost,
    gross_profit: profit,
    margin_percent: Math.round(margin * 10) / 10
  };

  if (saleData.client_name !== undefined) updateFields.client_name = saleData.client_name;
  if (saleData.client_phone !== undefined) updateFields.client_phone = saleData.client_phone;
  if (saleData.items !== undefined) updateFields.items = saleData.items;
  if (saleData.delivery_method !== undefined) updateFields.delivery_method = saleData.delivery_method;
  if (saleData.status !== undefined) updateFields.status = saleData.status;
  if (saleData.date !== undefined) updateFields.date = saleData.date;
  if (saleData.order_id !== undefined) updateFields.order_id = saleData.order_id;

  if (isSupabaseAdminConfigured) {
    const { data, error } = await supabaseAdmin
      .from('psl_sales')
      .update(updateFields)
      .eq('id', saleId)
      .select()
      .single();

    if (error) {
      console.error("Supabase updateSale error:", error);
      throw new Error(error.message || 'Erro ao atualizar venda');
    }

    const db = getLocalDb();
    if (db.sales) {
      const idx = db.sales.findIndex(s => s.id === saleId);
      if (idx !== -1) {
        db.sales[idx] = { ...db.sales[idx], ...updateFields };
        saveLocalDb(db);
      }
    }

    return data;
  }

  const db = getLocalDb();
  db.sales = db.sales || [];
  const idx = db.sales.findIndex(s => s.id === saleId);
  if (idx === -1) {
    throw new Error(`Venda com ID ${saleId} não encontrada`);
  }
  db.sales[idx] = { ...db.sales[idx], ...updateFields };
  saveLocalDb(db);
  return db.sales[idx];
}

export async function deleteSale(saleId) {
  if (!saleId) {
    throw new Error('ID da venda é obrigatório');
  }

  if (isSupabaseAdminConfigured) {
    const { data, error } = await supabaseAdmin
      .from('psl_sales')
      .delete()
      .eq('id', saleId)
      .select();

    if (error) {
      console.error("Supabase deleteSale error:", error);
      throw new Error(error.message || 'Erro ao excluir venda');
    }

    const db = getLocalDb();
    if (db.sales) {
      db.sales = db.sales.filter(s => s.id !== saleId);
      saveLocalDb(db);
    }

    return { success: true, deletedId: saleId, data };
  }

  const db = getLocalDb();
  db.sales = (db.sales || []).filter(s => s.id !== saleId);
  saveLocalDb(db);
  return { success: true, deletedId: saleId };
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
