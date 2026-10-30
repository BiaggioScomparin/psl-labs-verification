import fs from 'fs';
import path from 'path';
import defaultDb from '../data/db.json';

const isVercel = process.env.VERCEL === '1';
const tmpDbPath = path.join('/tmp', 'psl-labs-db.json');
const localDbPath = path.join(process.cwd(), 'src', 'data', 'db.json');

// In-memory cache for fast response and serverless lifecycle
let memoryDb = null;

function loadDb() {
  if (memoryDb) return memoryDb;

  try {
    if (isVercel && fs.existsSync(tmpDbPath)) {
      const data = fs.readFileSync(tmpDbPath, 'utf8');
      memoryDb = JSON.parse(data);
      return memoryDb;
    } else if (!isVercel && fs.existsSync(localDbPath)) {
      const data = fs.readFileSync(localDbPath, 'utf8');
      memoryDb = JSON.parse(data);
      return memoryDb;
    }
  } catch (err) {
    console.warn("Could not read db from file, using fallback:", err.message);
  }

  // Deep clone defaultDb
  memoryDb = JSON.parse(JSON.stringify(defaultDb));
  return memoryDb;
}

function saveDb(data) {
  memoryDb = data;
  try {
    const json = JSON.stringify(data, null, 2);
    if (isVercel) {
      fs.writeFileSync(tmpDbPath, json, 'utf8');
    } else {
      fs.writeFileSync(localDbPath, json, 'utf8');
    }
  } catch (err) {
    console.warn("Could not write db to disk:", err.message);
  }
}

export function getDb() {
  return loadDb();
}

export function getProducts() {
  const db = loadDb();
  return db.products || [];
}

export function getProductById(id) {
  const db = loadDb();
  return db.products.find(p => p.id === id) || null;
}

export function addProduct(newProduct) {
  const db = loadDb();
  db.products = db.products || [];
  db.products.push(newProduct);
  saveDb(db);
  return newProduct;
}

export function getBatches() {
  const db = loadDb();
  return db.batches || [];
}

export function addBatch(newBatch) {
  const db = loadDb();
  db.batches = db.batches || [];
  db.batches.push(newBatch);
  saveDb(db);
  return newBatch;
}

export function getCode(codeStr) {
  const db = loadDb();
  const cleanCode = (codeStr || '').trim().toUpperCase();
  return db.codes[cleanCode] || null;
}

export function registerScan(codeStr, meta = {}) {
  const db = loadDb();
  const cleanCode = (codeStr || '').trim().toUpperCase();
  const record = db.codes[cleanCode];

  if (!record) {
    return { found: false };
  }

  const now = new Date().toISOString();
  record.scanCount = (record.scanCount || 0) + 1;
  
  if (!record.firstScannedAt) {
    record.firstScannedAt = now;
  }
  record.lastScannedAt = now;

  const isAlert = record.scanCount > 1;

  const scanEntry = {
    id: `scan-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    code: cleanCode,
    scannedAt: now,
    ip: meta.ip || '127.0.0.1',
    userAgent: meta.userAgent || 'Unknown',
    isAlert: isAlert
  };

  db.scans = db.scans || [];
  db.scans.unshift(scanEntry); // prepend latest
  if (db.scans.length > 500) db.scans.pop(); // keep last 500

  saveDb(db);

  const product = getProductById(record.productId);

  return {
    found: true,
    code: record.code,
    scanCount: record.scanCount,
    firstScannedAt: record.firstScannedAt,
    lastScannedAt: record.lastScannedAt,
    batchNumber: record.batchNumber,
    mfgDate: record.mfgDate,
    expDate: record.expDate,
    status: record.status,
    product: product
  };
}

export function generateBatchCodes(batchId, quantity = 65) {
  const db = loadDb();
  const batch = db.batches.find(b => b.id === batchId);
  if (!batch) throw new Error("Batch not found");

  const product = db.products.find(p => p.id === batch.productId);
  const prefix = product && product.name.includes("GHK") ? "GHK50" : "PSL";

  const generatedList = [];

  for (let i = 0; i < quantity; i++) {
    // Generate secure random alphanumeric code
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
    const fullCode = `${prefix}-${rand}`;

    db.codes[fullCode] = {
      code: fullCode,
      productId: batch.productId,
      batchId: batch.id,
      batchNumber: batch.batchNumber,
      mfgDate: batch.mfgDate,
      expDate: batch.expDate,
      scanCount: 0,
      firstScannedAt: null,
      lastScannedAt: null,
      status: "active"
    };

    generatedList.push(fullCode);
  }

  saveDb(db);
  return generatedList;
}

export function getStats() {
  const db = loadDb();
  const totalProducts = db.products.length;
  const totalBatches = db.batches.length;
  const totalCodes = Object.keys(db.codes).length;
  const totalScans = (db.scans || []).length;
  const alertScans = (db.scans || []).filter(s => s.isAlert).length;

  return {
    totalProducts,
    totalBatches,
    totalCodes,
    totalScans,
    alertScans,
    recentScans: (db.scans || []).slice(0, 30)
  };
}
