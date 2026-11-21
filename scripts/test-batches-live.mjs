import batchesHandler from '../src/pages/api/admin/batches.js';
import { supabaseAdmin } from '../src/lib/supabaseAdmin.js';
import * as db from '../src/lib/db.js';

function createMockReqRes(method, query = {}, body = {}) {
  let statusCode = 200;
  let responseData = null;

  const req = {
    method,
    query,
    body,
    headers: { host: 'localhost:3000' }
  };

  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      responseData = data;
      return this;
    },
    getStatusCode: () => statusCode,
    getData: () => responseData
  };

  return { req, res };
}

async function testBatches() {
  console.log("=== TESTING BATCHES API & CODE GENERATION ===");

  // 1. GET batches
  const { req: getReq, res: getRes } = createMockReqRes('GET');
  await batchesHandler(getReq, getRes);
  console.log("Batches count:", getRes.getData().length);

  // 2. POST create batch
  const testBatchNum = `LOT-TEST-${Date.now().toString().slice(-4)}`;
  const { req: postReq, res: postRes } = createMockReqRes('POST', {}, {
    productId: 'ghk-cu-50mg',
    batchNumber: testBatchNum,
    mfgDate: '11/2026',
    expDate: '11/2028',
    quantityLabels: 5
  });
  await batchesHandler(postReq, postRes);
  const data = postRes.getData();
  console.log("Created batch status:", postRes.getStatusCode(), "Batch ID:", data.batch.id);
  console.log("Generated codes count:", data.generatedCodesCount, "Sample:", data.sampleCodes);

  // 3. Verify in Supabase psl_codes
  const { data: codes, error } = await supabaseAdmin
    .from('psl_codes')
    .select('*')
    .eq('batch_id', data.batch.id);

  console.log("Supabase psl_codes for new batch:", codes?.length, "error:", error?.message);

  // Clean up test batch and codes
  await supabaseAdmin.from('psl_codes').delete().eq('batch_id', data.batch.id);
  await supabaseAdmin.from('psl_batches').delete().eq('id', data.batch.id);
  console.log("Cleaned up test batch and codes.");
}

testBatches().catch(console.error);
