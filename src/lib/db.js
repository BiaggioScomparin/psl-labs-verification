import fs from 'fs';
import path from 'path';
import { supabaseAdmin, isSupabaseAdminConfigured } from './supabaseAdmin.js';

let defaultDb = null;
function getDefaultDb() {
  if (defaultDb) return defaultDb;
  try {
    const jsonPath = path.join(process.cwd(), 'src', 'data', 'db.json');
    if (fs.existsSync(jsonPath)) {
      defaultDb = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      return defaultDb;
    }
  } catch (err) {
    console.warn("Could not load default db.json:", err.message);
  }
  return { products: [], batches: [], codes: {}, scans: [] };
}

// In-memory fallback database
let memoryDb = null;

function loadFallbackDb() {
  if (memoryDb) return memoryDb;
  try {
    const isVercel = process.env.VERCEL === '1';
    const tmpDbPath = path.join('/tmp', 'psl-labs-db.json');
    const localDbPath = path.join(process.cwd(), 'src', 'data', 'db.json');

    if (isVercel && fs.existsSync(tmpDbPath)) {
      memoryDb = JSON.parse(fs.readFileSync(tmpDbPath, 'utf8'));
      return memoryDb;
    } else if (fs.existsSync(localDbPath)) {
      memoryDb = JSON.parse(fs.readFileSync(localDbPath, 'utf8'));
      return memoryDb;
    }
  } catch (err) {
    console.warn("Could not read fallback db from file:", err.message);
  }
  memoryDb = JSON.parse(JSON.stringify(getDefaultDb()));
  return memoryDb;
}

function saveFallbackDb(data) {
  memoryDb = data;
  try {
    const isVercel = process.env.VERCEL === '1';
    const tmpDbPath = path.join('/tmp', 'psl-labs-db.json');
    const localDbPath = path.join(process.cwd(), 'src', 'data', 'db.json');
    const json = JSON.stringify(data, null, 2);
    if (isVercel) {
      fs.writeFileSync(tmpDbPath, json, 'utf8');
    } else {
      fs.writeFileSync(localDbPath, json, 'utf8');
    }
  } catch (err) {
    console.warn("Could not write fallback db to disk:", err.message);
  }
}

// Helpers to map DB columns (snake_case) to JS camelCase while retaining both for compatibility
function mapProduct(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    chemicalName: row.chemical_name || row.chemicalName || row.name,
    chemical_name: row.chemical_name || row.chemicalName || row.name,
    category: row.category,
    concentration: row.concentration,
    purity: row.purity,
    presentation: row.presentation,
    image: row.image,
    description_py: row.description_py,
    description_pt: row.description_pt,
    storage_py: row.storage_py,
    storage_pt: row.storage_pt,
    active: row.active !== undefined ? row.active : true,
    createdAt: row.created_at,
    created_at: row.created_at,
    updatedAt: row.updated_at,
    updated_at: row.updated_at
  };
}

function toProductDbRow(p) {
  return {
    id: p.id,
    name: p.name,
    chemical_name: p.chemicalName || p.chemical_name || p.name,
    category: p.category,
    concentration: p.concentration,
    purity: p.purity,
    presentation: p.presentation,
    image: p.image,
    description_py: p.description_py,
    description_pt: p.description_pt,
    storage_py: p.storage_py,
    storage_pt: p.storage_pt,
    active: p.active !== undefined ? p.active : true,
    updated_at: new Date().toISOString()
  };
}

function mapBatch(row) {
  if (!row) return null;
  return {
    id: row.id,
    productId: row.product_id,
    product_id: row.product_id,
    batchNumber: row.batch_number,
    batch_number: row.batch_number,
    mfgDate: row.mfg_date,
    mfg_date: row.mfg_date,
    expDate: row.exp_date,
    exp_date: row.exp_date,
    quantityLabels: row.quantity_labels,
    quantity_labels: row.quantity_labels,
    createdAt: row.created_at,
    created_at: row.created_at
  };
}

function toBatchDbRow(b) {
  return {
    id: b.id,
    product_id: b.productId || b.product_id,
    batch_number: b.batchNumber || b.batch_number,
    mfg_date: b.mfgDate || b.mfg_date,
    exp_date: b.expDate || b.exp_date,
    quantity_labels: parseInt(b.quantityLabels || b.quantity_labels || 65, 10),
    created_at: b.createdAt || b.created_at || new Date().toISOString()
  };
}

function mapCode(row) {
  if (!row) return null;
  return {
    code: row.code,
    productId: row.product_id,
    product_id: row.product_id,
    batchId: row.batch_id,
    batch_id: row.batch_id,
    batchNumber: row.batch_number,
    batch_number: row.batch_number,
    mfgDate: row.mfg_date,
    mfg_date: row.mfg_date,
    expDate: row.exp_date,
    exp_date: row.exp_date,
    scanCount: row.scan_count || 0,
    scan_count: row.scan_count || 0,
    firstScannedAt: row.first_scanned_at,
    first_scanned_at: row.first_scanned_at,
    lastScannedAt: row.last_scanned_at,
    last_scanned_at: row.last_scanned_at,
    status: row.status || 'active',
    createdAt: row.created_at,
    created_at: row.created_at
  };
}

function mapScan(row) {
  if (!row) return null;
  return {
    id: row.id,
    code: row.code,
    scannedAt: row.scanned_at,
    scanned_at: row.scanned_at,
    ip: row.ip,
    userAgent: row.user_agent,
    user_agent: row.user_agent,
    isAlert: row.is_alert !== undefined ? row.is_alert : false,
    is_alert: row.is_alert !== undefined ? row.is_alert : false,
    createdAt: row.created_at,
    created_at: row.created_at
  };
}

export function getDb() {
  return loadFallbackDb();
}

export async function getProducts() {
  if (isSupabaseAdminConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('psl_products')
        .select('*')
        .order('name', { ascending: true });

      if (!error && data) {
        return data.map(mapProduct);
      }
      console.warn("Supabase getProducts error, falling back to local:", error?.message);
    } catch (err) {
      console.warn("Supabase getProducts exception, falling back to local:", err.message);
    }
  }

  const db = loadFallbackDb();
  return (db.products || []).map(p => ({
    ...p,
    chemicalName: p.chemicalName || p.chemical_name || p.name,
    chemical_name: p.chemicalName || p.chemical_name || p.name
  }));
}

export async function getProductById(id) {
  if (!id) return null;
  if (isSupabaseAdminConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('psl_products')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        return mapProduct(data);
      }
      if (error && error.code !== 'PGRST116') {
        console.warn("Supabase getProductById error:", error.message);
      }
    } catch (err) {
      console.warn("Supabase getProductById exception:", err.message);
    }
  }

  const db = loadFallbackDb();
  const p = (db.products || []).find(item => item.id === id);
  return p ? mapProduct(p) : null;
}

export async function addProduct(newProduct) {
  const row = toProductDbRow(newProduct);

  if (isSupabaseAdminConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('psl_products')
        .insert(row)
        .select()
        .single();

      if (!error && data) {
        return mapProduct(data);
      }
      console.error("Supabase addProduct error:", error?.message);
    } catch (err) {
      console.error("Supabase addProduct exception:", err.message);
    }
  }

  // Fallback to local db
  const db = loadFallbackDb();
  db.products = db.products || [];
  db.products.push(newProduct);
  saveFallbackDb(db);
  return mapProduct(newProduct);
}

export async function updateProduct(id, updatedFields) {
  if (!id) return null;

  const updatePayload = {};
  if (updatedFields.name !== undefined) updatePayload.name = updatedFields.name;
  if (updatedFields.chemicalName !== undefined || updatedFields.chemical_name !== undefined) {
    updatePayload.chemical_name = updatedFields.chemicalName !== undefined ? updatedFields.chemicalName : updatedFields.chemical_name;
  }
  if (updatedFields.category !== undefined) updatePayload.category = updatedFields.category;
  if (updatedFields.concentration !== undefined) updatePayload.concentration = updatedFields.concentration;
  if (updatedFields.purity !== undefined) updatePayload.purity = updatedFields.purity;
  if (updatedFields.presentation !== undefined) updatePayload.presentation = updatedFields.presentation;
  if (updatedFields.image !== undefined) updatePayload.image = updatedFields.image;
  if (updatedFields.description_py !== undefined) updatePayload.description_py = updatedFields.description_py;
  if (updatedFields.description_pt !== undefined) updatePayload.description_pt = updatedFields.description_pt;
  if (updatedFields.storage_py !== undefined) updatePayload.storage_py = updatedFields.storage_py;
  if (updatedFields.storage_pt !== undefined) updatePayload.storage_pt = updatedFields.storage_pt;
  if (updatedFields.active !== undefined) updatePayload.active = updatedFields.active;
  updatePayload.updated_at = new Date().toISOString();

  if (isSupabaseAdminConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('psl_products')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        return mapProduct(data);
      }
      console.error("Supabase updateProduct error:", error?.message);
    } catch (err) {
      console.error("Supabase updateProduct exception:", err.message);
    }
  }

  // Fallback to local db
  const db = loadFallbackDb();
  db.products = db.products || [];
  const index = db.products.findIndex(p => p.id === id);
  if (index === -1) return null;

  db.products[index] = {
    ...db.products[index],
    ...updatedFields,
    id
  };
  saveFallbackDb(db);
  return mapProduct(db.products[index]);
}

export async function deleteProduct(id) {
  if (!id) return null;

  if (isSupabaseAdminConfigured && supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin
        .from('psl_products')
        .delete()
        .eq('id', id);

      if (!error) {
        return { success: true, id };
      }
      console.error("Supabase deleteProduct error:", error?.message);
    } catch (err) {
      console.error("Supabase deleteProduct exception:", err.message);
    }
  }

  // Fallback to local db
  const db = loadFallbackDb();
  db.products = db.products || [];
  const index = db.products.findIndex(p => p.id === id);
  if (index === -1) return null;

  db.products.splice(index, 1);
  saveFallbackDb(db);
  return { success: true, id };
}

export async function getBatches() {
  if (isSupabaseAdminConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('psl_batches')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map(mapBatch);
      }
      console.warn("Supabase getBatches error:", error?.message);
    } catch (err) {
      console.warn("Supabase getBatches exception:", err.message);
    }
  }

  const db = loadFallbackDb();
  return (db.batches || []).map(mapBatch);
}

export async function getBatchById(id) {
  if (!id) return null;
  if (isSupabaseAdminConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('psl_batches')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        return mapBatch(data);
      }
    } catch (err) {
      console.warn("Supabase getBatchById exception:", err.message);
    }
  }

  const db = loadFallbackDb();
  const b = (db.batches || []).find(item => item.id === id);
  return b ? mapBatch(b) : null;
}

export async function addBatch(newBatch) {
  const row = toBatchDbRow(newBatch);

  if (isSupabaseAdminConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('psl_batches')
        .insert(row)
        .select()
        .single();

      if (!error && data) {
        return mapBatch(data);
      }
      console.error("Supabase addBatch error:", error?.message);
    } catch (err) {
      console.error("Supabase addBatch exception:", err.message);
    }
  }

  const db = loadFallbackDb();
  db.batches = db.batches || [];
  db.batches.push(newBatch);
  saveFallbackDb(db);
  return mapBatch(newBatch);
}

export async function getCode(codeStr) {
  const cleanCode = (codeStr || '').trim().toUpperCase();
  if (!cleanCode) return null;

  if (isSupabaseAdminConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('psl_codes')
        .select('*')
        .eq('code', cleanCode)
        .maybeSingle();

      if (!error && data) {
        return mapCode(data);
      }
      if (error && error.code !== 'PGRST116') {
        console.warn("Supabase getCode error:", error.message);
      }
    } catch (err) {
      console.warn("Supabase getCode exception:", err.message);
    }
  }

  const db = loadFallbackDb();
  const c = db.codes ? db.codes[cleanCode] : null;
  return c ? mapCode(c) : null;
}

export async function registerScan(codeStr, meta = {}) {
  const cleanCode = (codeStr || '').trim().toUpperCase();
  if (!cleanCode) return { found: false };

  const record = await getCode(cleanCode);
  if (!record) {
    return { found: false };
  }

  const now = new Date().toISOString();
  const scanCount = (record.scanCount || 0) + 1;
  const firstScannedAt = record.firstScannedAt || now;
  const lastScannedAt = now;
  const isAlert = scanCount > 1;

  const scanId = `scan-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
  const scanEntry = {
    id: scanId,
    code: cleanCode,
    scanned_at: now,
    ip: meta.ip || '127.0.0.1',
    user_agent: meta.userAgent || 'Unknown',
    is_alert: isAlert
  };

  if (isSupabaseAdminConfigured && supabaseAdmin) {
    try {
      // 1. Update psl_codes
      await supabaseAdmin
        .from('psl_codes')
        .update({
          scan_count: scanCount,
          first_scanned_at: firstScannedAt,
          last_scanned_at: lastScannedAt
        })
        .eq('code', cleanCode);

      // 2. Insert into psl_scans
      await supabaseAdmin
        .from('psl_scans')
        .insert(scanEntry);
    } catch (err) {
      console.error("Supabase registerScan exception:", err.message);
    }
  }

  // Update fallback memoryDb
  const db = loadFallbackDb();
  if (db.codes && db.codes[cleanCode]) {
    db.codes[cleanCode].scanCount = scanCount;
    if (!db.codes[cleanCode].firstScannedAt) {
      db.codes[cleanCode].firstScannedAt = firstScannedAt;
    }
    db.codes[cleanCode].lastScannedAt = lastScannedAt;
  }
  db.scans = db.scans || [];
  db.scans.unshift({
    id: scanId,
    code: cleanCode,
    scannedAt: now,
    ip: meta.ip || '127.0.0.1',
    userAgent: meta.userAgent || 'Unknown',
    isAlert: isAlert
  });
  if (db.scans.length > 500) db.scans.pop();
  saveFallbackDb(db);

  const product = await getProductById(record.productId);

  return {
    found: true,
    code: cleanCode,
    scanCount: scanCount,
    scan_count: scanCount,
    firstScannedAt: firstScannedAt,
    first_scanned_at: firstScannedAt,
    lastScannedAt: lastScannedAt,
    last_scanned_at: lastScannedAt,
    batchNumber: record.batchNumber,
    batch_number: record.batchNumber,
    mfgDate: record.mfgDate,
    mfg_date: record.mfgDate,
    expDate: record.expDate,
    exp_date: record.expDate,
    status: record.status,
    product: product
  };
}

export async function getScans(limit = 100) {
  if (isSupabaseAdminConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('psl_scans')
        .select('*')
        .order('scanned_at', { ascending: false })
        .limit(limit);

      if (!error && data) {
        return data.map(mapScan);
      }
      console.warn("Supabase getScans error:", error?.message);
    } catch (err) {
      console.warn("Supabase getScans exception:", err.message);
    }
  }

  const db = loadFallbackDb();
  return (db.scans || []).slice(0, limit).map(mapScan);
}

export async function getStats() {
  if (isSupabaseAdminConfigured && supabaseAdmin) {
    try {
      const [
        { count: totalProducts, error: prodErr },
        { count: totalBatches, error: batchErr },
        { count: totalCodes, error: codeErr },
        { count: totalScans, error: scanErr },
        { count: alertScans, error: alertErr },
        { data: recentScans, error: recentErr }
      ] = await Promise.all([
        supabaseAdmin.from('psl_products').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('psl_batches').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('psl_codes').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('psl_scans').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('psl_scans').select('*', { count: 'exact', head: true }).eq('is_alert', true),
        supabaseAdmin.from('psl_scans').select('*').order('scanned_at', { ascending: false }).limit(30)
      ]);

      if (!prodErr && !batchErr && !codeErr && !scanErr) {
        return {
          totalProducts: totalProducts || 0,
          totalBatches: totalBatches || 0,
          totalCodes: totalCodes || 0,
          totalScans: totalScans || 0,
          alertScans: alertScans || 0,
          recentScans: (recentScans || []).map(mapScan)
        };
      }
      console.warn("Supabase getStats count error, falling back to local");
    } catch (err) {
      console.warn("Supabase getStats exception:", err.message);
    }
  }

  const db = loadFallbackDb();
  const totalProducts = (db.products || []).length;
  const totalBatches = (db.batches || []).length;
  const totalCodes = Object.keys(db.codes || {}).length;
  const totalScans = (db.scans || []).length;
  const alertScans = (db.scans || []).filter(s => s.isAlert).length;

  return {
    totalProducts,
    totalBatches,
    totalCodes,
    totalScans,
    alertScans,
    recentScans: (db.scans || []).slice(0, 30).map(mapScan)
  };
}

export async function generateBatchCodes(batchId, quantity = 65) {
  const batch = await getBatchById(batchId);
  if (!batch) throw new Error("Batch not found: " + batchId);

  const product = await getProductById(batch.productId);
  const prefix = product && (product.name || '').includes("GHK") ? "GHK50" : "PSL";

  const generatedList = [];
  const recordsToInsert = [];

  for (let i = 0; i < quantity; i++) {
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
    const fullCode = `${prefix}-${rand}`;

    generatedList.push(fullCode);
    recordsToInsert.push({
      code: fullCode,
      product_id: batch.productId,
      batch_id: batch.id,
      batch_number: batch.batchNumber,
      mfg_date: batch.mfgDate,
      exp_date: batch.expDate,
      scan_count: 0,
      first_scanned_at: null,
      last_scanned_at: null,
      status: "active"
    });
  }

  if (isSupabaseAdminConfigured && supabaseAdmin) {
    try {
      for (let i = 0; i < recordsToInsert.length; i += 50) {
        const chunk = recordsToInsert.slice(i, i + 50);
        const { error } = await supabaseAdmin.from('psl_codes').insert(chunk);
        if (error) {
          console.error("Supabase generateBatchCodes insert error:", error);
        }
      }
    } catch (err) {
      console.error("Supabase generateBatchCodes exception:", err);
    }
  }

  // Update fallback memoryDb
  const db = loadFallbackDb();
  db.codes = db.codes || {};
  for (const item of recordsToInsert) {
    db.codes[item.code] = {
      code: item.code,
      productId: item.product_id,
      batchId: item.batch_id,
      batchNumber: item.batch_number,
      mfgDate: item.mfg_date,
      expDate: item.exp_date,
      scanCount: 0,
      firstScannedAt: null,
      lastScannedAt: null,
      status: "active"
    };
  }
  saveFallbackDb(db);

  return generatedList;
}

export async function getLabelsData(batchId) {
  let targetBatch = null;
  const batches = await getBatches();
  if (batchId) {
    targetBatch = batches.find(b => b.id === batchId) || null;
  }
  if (!targetBatch && batches.length > 0) {
    targetBatch = batches[0];
  }

  if (!targetBatch) {
    return null;
  }

  const product = (await getProductById(targetBatch.productId)) || {
    name: 'GHK CU 50 MG',
    concentration: '50 MG'
  };

  let batchCodes = [];
  if (isSupabaseAdminConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('psl_codes')
        .select('*')
        .eq('batch_id', targetBatch.id)
        .order('created_at', { ascending: true });

      if (!error && data) {
        batchCodes = data.map(mapCode);
      }
    } catch (err) {
      console.warn("Supabase getLabelsData codes error:", err.message);
    }
  }

  if (batchCodes.length === 0) {
    const db = loadFallbackDb();
    batchCodes = Object.values(db.codes || {}).filter(c => c.batchId === targetBatch.id).map(mapCode);
  }

  return {
    batch: targetBatch,
    product: product,
    codes: batchCodes
  };
}
