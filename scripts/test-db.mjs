import * as db from '../src/lib/db.js';

async function main() {
  console.log("Testing db.js...");

  const prods = await db.getProducts();
  console.log("Products count:", prods.length);
  console.log("Products names:", prods.map(p => p.name));

  const p1 = await db.getProductById('ghk-cu-50mg');
  console.log("ProductById ghk-cu-50mg:", p1?.name);

  const batches = await db.getBatches();
  console.log("Batches count:", batches.length);

  const code = await db.getCode('PSL-8F92K1');
  console.log("Code PSL-8F92K1:", code?.code, "product_id:", code?.productId);

  const stats = await db.getStats();
  console.log("Stats live:", stats);

  const labelsData = await db.getLabelsData('batch-ghk-2026-01');
  console.log("LabelsData batch:", labelsData?.batch?.batchNumber, "codes count:", labelsData?.codes?.length);
}

main().catch(console.error);
