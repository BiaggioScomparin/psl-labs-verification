import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabaseAdmin } from '../src/lib/supabaseAdmin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function seed() {
  const db = JSON.parse(fs.readFileSync(path.join(rootDir, 'src', 'data', 'db.json'), 'utf8'));

  // 1. Seed products
  if (db.products && db.products.length > 0) {
    const productsData = db.products.map(p => ({
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
      active: p.active !== undefined ? p.active : true
    }));
    const { error: prodErr } = await supabaseAdmin.from('psl_products').upsert(productsData);
    if (prodErr) console.error('Error seeding products:', prodErr);
    else console.log('Products seeded:', productsData.length);
  }

  // 2. Seed batches
  if (db.batches && db.batches.length > 0) {
    const batchesData = db.batches.map(b => ({
      id: b.id,
      product_id: b.productId || b.product_id,
      batch_number: b.batchNumber || b.batch_number,
      mfg_date: b.mfgDate || b.mfg_date,
      exp_date: b.expDate || b.exp_date,
      quantity_labels: b.quantityLabels || b.quantity_labels || 65,
      created_at: b.createdAt || b.created_at || new Date().toISOString()
    }));
    const { error: batchErr } = await supabaseAdmin.from('psl_batches').upsert(batchesData);
    if (batchErr) console.error('Error seeding batches:', batchErr);
    else console.log('Batches seeded:', batchesData.length);
  }

  // 3. Seed codes
  if (db.codes && Object.keys(db.codes).length > 0) {
    const codesData = Object.values(db.codes).map(c => ({
      code: c.code,
      product_id: c.productId || c.product_id,
      batch_id: c.batchId || c.batch_id,
      batch_number: c.batchNumber || c.batch_number,
      mfg_date: c.mfgDate || c.mfg_date,
      exp_date: c.expDate || c.exp_date,
      scan_count: c.scanCount || c.scan_count || 0,
      first_scanned_at: c.firstScannedAt || c.first_scanned_at || null,
      last_scanned_at: c.lastScannedAt || c.last_scanned_at || null,
      status: c.status || 'active'
    }));
    for (let i = 0; i < codesData.length; i += 50) {
      const slice = codesData.slice(i, i + 50);
      const { error: codeErr } = await supabaseAdmin.from('psl_codes').upsert(slice);
      if (codeErr) console.error('Error seeding codes batch:', codeErr);
    }
    console.log('Codes seeded:', codesData.length);
  }

  // 4. Seed scans
  if (db.scans && db.scans.length > 0) {
    const scansData = db.scans.map(s => ({
      id: s.id,
      code: s.code,
      scanned_at: s.scannedAt || s.scanned_at || new Date().toISOString(),
      ip: s.ip || '127.0.0.1',
      user_agent: s.userAgent || s.user_agent || 'Unknown',
      is_alert: s.isAlert !== undefined ? s.isAlert : false
    }));
    const { error: scanErr } = await supabaseAdmin.from('psl_scans').upsert(scansData);
    if (scanErr) console.error('Error seeding scans:', scanErr);
    else console.log('Scans seeded:', scansData.length);
  }
}

seed().then(() => {
  console.log('Seed completed successfully!');
  process.exit(0);
}).catch(err => {
  console.error('Seed fatal error:', err);
  process.exit(1);
});
