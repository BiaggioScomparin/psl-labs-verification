// scripts/migrate-dbjson-to-supabase.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load environment variables from .env.local if present
const envLocalPath = path.join(rootDir, '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://banco.goib.org';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 
                     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzkxMDU1Mzk4LCJleHAiOjE5NDg3MzUzOTh9.nAQCEyt0GxZ1VWY_U2dOQMbysmQxTBCWJJrclJ_I0Pw';

console.log(`Connecting to Supabase at: ${SUPABASE_URL}`);
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function runMigration() {
  const dbPath = path.join(rootDir, 'src', 'data', 'db.json');
  if (!fs.existsSync(dbPath)) {
    throw new Error(`db.json not found at ${dbPath}`);
  }

  const raw = fs.readFileSync(dbPath, 'utf8');
  const db = JSON.parse(raw);

  console.log('\n--- 1. MIGRATING PRODUCTS (psl_products) ---');
  const products = (db.products || []).map(p => ({
    id: p.id,
    name: p.name,
    chemical_name: p.chemicalName || p.chemical_name || null,
    category: p.category,
    concentration: p.concentration,
    purity: p.purity || '99.0% (HPLC)',
    presentation: p.presentation || 'Frasco Vial Liofilizado',
    image: p.image || null,
    description_py: p.description_py || null,
    description_pt: p.description_pt || null,
    storage_py: p.storage_py || null,
    storage_pt: p.storage_pt || null,
    active: typeof p.active === 'boolean' ? p.active : true,
    created_at: p.createdAt || p.created_at || new Date().toISOString(),
    updated_at: p.updatedAt || p.updated_at || new Date().toISOString()
  }));

  console.log(`Upserting ${products.length} products...`);
  const { data: prodData, error: prodErr } = await supabase
    .from('psl_products')
    .upsert(products, { onConflict: 'id' })
    .select();

  if (prodErr) {
    console.error('Error inserting products:', prodErr);
    throw prodErr;
  }
  console.log(`Successfully migrated ${prodData?.length || products.length} products.`);

  console.log('\n--- 2. MIGRATING BATCHES (psl_batches) ---');
  const batches = (db.batches || []).map(b => ({
    id: b.id,
    product_id: b.productId || b.product_id || null,
    batch_number: b.batchNumber || b.batch_number,
    mfg_date: b.mfgDate || b.mfg_date || null,
    exp_date: b.expDate || b.exp_date || null,
    quantity_labels: b.quantityLabels || b.quantity_labels || 0,
    created_at: b.createdAt || b.created_at || new Date().toISOString()
  }));

  console.log(`Upserting ${batches.length} batches...`);
  const { data: batchData, error: batchErr } = await supabase
    .from('psl_batches')
    .upsert(batches, { onConflict: 'id' })
    .select();

  if (batchErr) {
    console.error('Error inserting batches:', batchErr);
    throw batchErr;
  }
  console.log(`Successfully migrated ${batchData?.length || batches.length} batches.`);

  console.log('\n--- 3. MIGRATING CODES (psl_codes) ---');
  const rawCodes = db.codes || {};
  const codeList = Object.entries(rawCodes).map(([key, c]) => ({
    code: c.code || key,
    product_id: c.productId || c.product_id || null,
    batch_id: c.batchId || c.batch_id || null,
    batch_number: c.batchNumber || c.batch_number || null,
    mfg_date: c.mfgDate || c.mfg_date || null,
    exp_date: c.expDate || c.exp_date || null,
    scan_count: typeof c.scanCount === 'number' ? c.scanCount : (c.scan_count || 0),
    first_scanned_at: c.firstScannedAt || c.first_scanned_at || null,
    last_scanned_at: c.lastScannedAt || c.last_scanned_at || null,
    status: c.status || 'active',
    created_at: c.createdAt || c.created_at || new Date().toISOString()
  }));

  console.log(`Upserting ${codeList.length} codes in batches of 100...`);
  const chunkSize = 100;
  let totalCodesUpserted = 0;
  for (let i = 0; i < codeList.length; i += chunkSize) {
    const chunk = codeList.slice(i, i + chunkSize);
    const { error: codeErr } = await supabase
      .from('psl_codes')
      .upsert(chunk, { onConflict: 'code' });

    if (codeErr) {
      console.error(`Error inserting codes batch ${i} - ${i + chunk.length}:`, codeErr);
      throw codeErr;
    }
    totalCodesUpserted += chunk.length;
    process.stdout.write(`  Migrated ${totalCodesUpserted}/${codeList.length} codes...\r`);
  }
  console.log(`\nSuccessfully migrated all ${totalCodesUpserted} codes.`);

  console.log('\n--- 4. MIGRATING SCANS (psl_scans) ---');
  const scans = (db.scans || []).map(s => ({
    id: s.id,
    code: s.code || null,
    scanned_at: s.scannedAt || s.scanned_at || new Date().toISOString(),
    ip: s.ip || null,
    user_agent: s.userAgent || s.user_agent || null,
    is_alert: typeof s.isAlert === 'boolean' ? s.isAlert : (typeof s.is_alert === 'boolean' ? s.is_alert : false)
  }));

  console.log(`Upserting ${scans.length} scans...`);
  const { data: scanData, error: scanErr } = await supabase
    .from('psl_scans')
    .upsert(scans, { onConflict: 'id' })
    .select();

  if (scanErr) {
    console.error('Error inserting scans:', scanErr);
    throw scanErr;
  }
  console.log(`Successfully migrated ${scanData?.length || scans.length} scans.`);

  console.log('\n--- VERIFYING TABLE ROW COUNTS ---');
  const tables = ['psl_products', 'psl_batches', 'psl_codes', 'psl_scans'];
  const summary = {};

  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error(`Failed to count rows for ${table}:`, error);
      summary[table] = 'ERROR';
    } else {
      summary[table] = count;
      console.log(`  Table [${table}]: ${count} rows`);
    }
  }

  console.log('\n=== MIGRATION COMPLETE ===');
  console.log(JSON.stringify(summary, null, 2));
  return summary;
}

runMigration().catch(err => {
  console.error('\nFatal Migration Error:', err);
  process.exit(1);
});
