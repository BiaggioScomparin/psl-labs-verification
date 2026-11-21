import productsHandler from '../src/pages/api/admin/products.js';
import statsHandler from '../src/pages/api/admin/stats.js';
import labelsHandler from '../src/pages/api/admin/labels-data.js';
import verifyHandler from '../src/pages/api/verify.js';
import { supabaseAdmin } from '../src/lib/supabaseAdmin.js';
import * as db from '../src/lib/db.js';

function createMockReqRes(method, query = {}, body = {}) {
  let statusCode = 200;
  let responseData = null;

  const req = {
    method,
    query,
    body,
    headers: {
      host: 'localhost:3000',
      'user-agent': 'PSL-Test-Agent/1.0',
      'x-forwarded-for': '186.200.10.5'
    },
    socket: { remoteAddress: '127.0.0.1' }
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

async function runTests() {
  console.log("=== INITIATING LIVE SUPABASE + API TEST SUITE ===\n");
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${message}`);
      failed++;
    }
  }

  const testId = `test-compound-${Date.now()}`;
  const testName = `Compound Test ${Date.now().toString().slice(-4)}`;

  try {
    // -------------------------------------------------------------------
    // 1. GET /api/admin/products
    // -------------------------------------------------------------------
    console.log("--- 1. Testing GET /api/admin/products ---");
    {
      const { req, res } = createMockReqRes('GET');
      await productsHandler(req, res);
      const data = res.getData();
      assert(res.getStatusCode() === 200, "Status is 200");
      assert(Array.isArray(data) && data.length > 0, `Returned ${data.length} products`);
    }

    // -------------------------------------------------------------------
    // 2. POST /api/admin/products (Create product)
    // -------------------------------------------------------------------
    console.log("\n--- 2. Testing POST /api/admin/products (Create) ---");
    {
      const { req, res } = createMockReqRes('POST', {}, {
        name: testName,
        chemicalName: "Test Peptide Derivative",
        category: "Metabolismo & Shape",
        concentration: "20 MG",
        purity: "99.8% (HPLC)",
        presentation: "Frasco Vial Liofilizado",
        description_py: "Descripcion PY de prueba automatizada.",
        description_pt: "Descricao PT de teste automatizado.",
        storage_py: "Conservar a 2-8C.",
        storage_pt: "Conservar de 2 a 8C."
      });
      await productsHandler(req, res);
      assert(res.getStatusCode() === 201, "Status is 201 Created");
      const created = res.getData();
      assert(created && created.name === testName, `Created product returned with name ${testName}`);

      // Verify directly in Supabase table psl_products
      const { data: dbRow, error } = await supabaseAdmin
        .from('psl_products')
        .select('*')
        .eq('id', created.id)
        .single();

      assert(!error && dbRow, `Found product ${created.id} directly in Supabase psl_products table`);
      assert(dbRow.chemical_name === "Test Peptide Derivative", "Database chemical_name snake_case matches");
      assert(dbRow.concentration === "20 MG", "Database concentration matches");
    }

    // -------------------------------------------------------------------
    // 3. PUT /api/admin/products (Update product)
    // -------------------------------------------------------------------
    console.log("\n--- 3. Testing PUT /api/admin/products (Update) ---");
    const generatedId = testName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    {
      const { req, res } = createMockReqRes('PUT', {}, {
        id: generatedId,
        name: testName + " UPDATED",
        chemicalName: "Updated Peptide Derivative",
        category: "Regeneração & Articulações",
        concentration: "30 MG",
        purity: "99.9% (HPLC)",
        presentation: "Frasco Vial Liofilizado",
        description_py: "Descripcion PY atualizada.",
        description_pt: "Descricao PT atualizada.",
        storage_py: "Conservar a 2-8C.",
        storage_pt: "Conservar de 2 a 8C."
      });
      await productsHandler(req, res);
      assert(res.getStatusCode() === 200, "Status is 200 OK");
      const updated = res.getData();
      assert(updated && updated.name === testName + " UPDATED", "Product name updated in response");

      // Verify directly in Supabase
      const { data: dbRow, error } = await supabaseAdmin
        .from('psl_products')
        .select('*')
        .eq('id', generatedId)
        .single();

      assert(!error && dbRow, `Verified product ${generatedId} updated in Supabase`);
      assert(dbRow.name === testName + " UPDATED", "Database row name updated");
      assert(dbRow.concentration === "30 MG", "Database row concentration is 30 MG");
    }

    // -------------------------------------------------------------------
    // 4. GET /api/admin/products (Confirm live update visible)
    // -------------------------------------------------------------------
    console.log("\n--- 4. Confirming Live Data from Supabase ---");
    {
      const products = await db.getProducts();
      const found = products.find(p => p.id === generatedId);
      assert(!!found, `Found newly created product ${generatedId} in live Supabase listing`);
      assert(found.name === testName + " UPDATED", "Live product reflects updated name");
    }

    // -------------------------------------------------------------------
    // 5. DELETE /api/admin/products (Delete product)
    // -------------------------------------------------------------------
    console.log("\n--- 5. Testing DELETE /api/admin/products ---");
    {
      const { req, res } = createMockReqRes('DELETE', { id: generatedId });
      await productsHandler(req, res);
      assert(res.getStatusCode() === 200, "Status is 200 OK");
      assert(res.getData().success === true, "Delete response success is true");

      // Verify directly in Supabase
      const { data: dbRow } = await supabaseAdmin
        .from('psl_products')
        .select('*')
        .eq('id', generatedId)
        .maybeSingle();

      assert(!dbRow, `Confirmed product ${generatedId} was removed from Supabase psl_products`);
    }

    // -------------------------------------------------------------------
    // 6. GET /api/admin/stats
    // -------------------------------------------------------------------
    console.log("\n--- 6. Testing GET /api/admin/stats ---");
    {
      const { req, res } = createMockReqRes('GET');
      await statsHandler(req, res);
      assert(res.getStatusCode() === 200, "Stats status 200");
      const stats = res.getData();
      assert(typeof stats.totalProducts === 'number' && stats.totalProducts > 0, `Stats totalProducts: ${stats.totalProducts}`);
      assert(typeof stats.totalCodes === 'number' && stats.totalCodes > 0, `Stats totalCodes: ${stats.totalCodes}`);
      assert(Array.isArray(stats.recentScans), `Stats recentScans length: ${stats.recentScans.length}`);
    }

    // -------------------------------------------------------------------
    // 7. GET /api/verify?code=PSL-8F92K1&peek=true
    // -------------------------------------------------------------------
    console.log("\n--- 7. Testing GET /api/verify (peek) ---");
    {
      const { req, res } = createMockReqRes('GET', { code: 'PSL-8F92K1', peek: 'true' });
      await verifyHandler(req, res);
      assert(res.getStatusCode() === 200, "Peek status 200");
      const peekData = res.getData();
      assert(peekData.found === true, "Code found");
      assert(peekData.code === 'PSL-8F92K1', "Code matches PSL-8F92K1");
      assert(peekData.product && peekData.product.name, `Peek product: ${peekData.product?.name}`);
    }

    // -------------------------------------------------------------------
    // 8. POST /api/verify (Live scan increment)
    // -------------------------------------------------------------------
    console.log("\n--- 8. Testing POST /api/verify (Register Scan) ---");
    {
      // First check current scan count
      const beforeCode = await db.getCode('PSL-8F92K1');
      const countBefore = beforeCode.scanCount || 0;

      const { req, res } = createMockReqRes('POST', {}, { code: 'PSL-8F92K1' });
      await verifyHandler(req, res);
      assert(res.getStatusCode() === 200, "Scan register status 200");
      const scanResult = res.getData();
      assert(scanResult.found === true, "Scan found is true");
      assert(scanResult.scanCount === countBefore + 1, `Scan count incremented from ${countBefore} to ${scanResult.scanCount}`);

      // Verify in Supabase
      const afterCode = await db.getCode('PSL-8F92K1');
      assert(afterCode.scanCount === countBefore + 1, "Supabase psl_codes scan_count verified");
    }

    // -------------------------------------------------------------------
    // 9. GET /api/admin/labels-data
    // -------------------------------------------------------------------
    console.log("\n--- 9. Testing GET /api/admin/labels-data ---");
    {
      const { req, res } = createMockReqRes('GET', { batchId: 'batch-ghk-2026-01' });
      await labelsHandler(req, res);
      assert(res.getStatusCode() === 200, "Labels status 200");
      const labelsData = res.getData();
      assert(labelsData.batch && labelsData.batch.id === 'batch-ghk-2026-01', "Correct batch returned");
      assert(labelsData.labels && labelsData.labels.length === 65, `Generated ${labelsData.labels.length} label QR codes`);
      assert(labelsData.labels[0].qrDataUrl.startsWith('data:image/png;base64,'), "Valid QR Data URL generated");
    }

  } catch (err) {
    console.error("Test execution error:", err);
    failed++;
  }

  console.log(`\n=== RESULTS: ${passed} PASSED, ${failed} FAILED ===\n`);
  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
