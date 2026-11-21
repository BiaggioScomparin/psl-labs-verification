// scripts/test-crud-live.mjs
import * as stockService from '../src/lib/stockService.js';
import inventoryHandler from '../src/pages/api/admin/inventory.js';
import vendasHandler from '../src/pages/api/admin/vendas.js';

function createMockRes() {
  return {
    statusCode: 200,
    headers: {},
    data: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.data = payload;
      return this;
    },
    setHeader(key, val) {
      this.headers[key] = val;
    }
  };
}

async function runTests() {
  console.log("=== INITIATING BACKEND CRUD TEST SUITE (LIVE VPS DATABASE) ===\n");
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

  // ==========================================
  // SECTION 1: stockService - Inventory CRUD
  // ==========================================
  console.log("--- 1. Testing stockService.js (Inventory CRUD) ---");
  const testCode = `TEST-PEP-${Date.now().toString().slice(-5)}`;

  try {
    // 1.1 Create Item
    console.log(`Creating inventory item: ${testCode}`);
    const created = await stockService.createInventoryItem({
      code: testCode,
      name: 'Peptídeo de Teste Automatizado',
      dosage: '10mg',
      category: 'Peptídeos & Longevidade',
      compound_id: 'test-peptide',
      stock_qty: 20,
      min_stock: 5,
      is_ready_sp: true,
      unit_cost: 35.50,
      price_b2c: 199.90,
      price_b2b: 140.00
    });
    assert(created && created.code === testCode, `Item ${testCode} created successfully`);
    assert(created.stock_qty === 20, `Stock qty is 20`);
    assert(Number(created.unit_cost) === 35.50, `Unit cost is 35.50`);

    // 1.2 Get Inventory
    const invList = await stockService.getInventory();
    const found = invList.find(i => i.code === testCode);
    assert(!!found, `Found newly created item ${testCode} in inventory list`);

    // 1.3 Update Item (Full update)
    console.log(`Updating inventory item: ${testCode}`);
    const updated = await stockService.updateInventoryItem(testCode, {
      name: 'Peptídeo de Teste Modificado',
      dosage: '25mg',
      price_b2c: 249.90,
      stock_qty: 35,
      min_stock: 8,
      is_ready_sp: true
    });
    assert(updated && updated.dosage === '25mg', `Updated dosage to 25mg`);
    assert(updated.stock_qty === 35, `Updated stock_qty to 35`);
    assert(Number(updated.price_b2c) === 249.90, `Updated price_b2c to 249.90`);

    // 1.4 Update Stock Qty (Legacy helper)
    const quickQty = await stockService.updateStockQty(testCode, 50, true);
    assert(quickQty.stock_qty === 50, `Legacy updateStockQty updated qty to 50`);

    // 1.5 Delete Item
    console.log(`Deleting inventory item: ${testCode}`);
    const delResult = await stockService.deleteInventoryItem(testCode);
    assert(delResult.success && delResult.deletedCode === testCode, `Item ${testCode} deleted successfully`);

    // Verify deletion
    const afterDelete = await stockService.getInventory();
    const stillExists = afterDelete.find(i => i.code === testCode);
    assert(!stillExists, `Confirmed item ${testCode} is no longer in inventory`);
  } catch (err) {
    console.error("Error in stockService inventory tests:", err);
    failed++;
  }

  // ==========================================
  // SECTION 2: stockService - Sales CRUD
  // ==========================================
  console.log("\n--- 2. Testing stockService.js (Sales CRUD) ---");
  const testSaleId = `VND-TEST-${Date.now().toString().slice(-5)}`;

  try {
    // 2.1 Add Sale
    console.log(`Adding test sale: ${testSaleId}`);
    const newSale = await stockService.addSale({
      id: testSaleId,
      client_name: 'Dr. Roberto Teste Live',
      client_phone: '+55 11 98888-7777',
      items: [
        { code: 'CU50', name: 'GHK-Cu', dosage: '50mg', qty: 2, unit_price: 269.00, unit_cost: 66.40 }
      ],
      total_revenue: 538.00,
      total_cost: 132.80,
      delivery_method: 'motoboy_sp',
      status: 'completed',
      date: '2026-11-20'
    });
    assert(newSale && newSale.id === testSaleId, `Sale ${testSaleId} registered`);
    assert(Number(newSale.total_revenue) === 538.00, `Revenue recorded: 538.00`);
    assert(Number(newSale.total_cost) === 132.80, `Cost recorded: 132.80`);
    assert(Number(newSale.gross_profit) === 405.20, `Gross profit calculated: 405.20`);
    assert(Number(newSale.margin_percent) > 0, `Margin calculated: ${newSale.margin_percent}%`);

    // 2.2 Get Sales
    const salesList = await stockService.getSales();
    const foundSale = salesList.find(s => s.id === testSaleId);
    assert(!!foundSale, `Found registered sale ${testSaleId} in sales list`);

    // 2.3 Update Sale
    console.log(`Updating sale: ${testSaleId}`);
    const updatedSale = await stockService.updateSale({
      id: testSaleId,
      client_name: 'Dr. Roberto Teste Modificado',
      total_revenue: 600.00,
      total_cost: 150.00,
      status: 'completed'
    });
    assert(updatedSale.client_name === 'Dr. Roberto Teste Modificado', `Client name updated`);
    assert(Number(updatedSale.total_revenue) === 600.00, `Updated revenue to 600.00`);
    assert(Number(updatedSale.total_cost) === 150.00, `Updated cost to 150.00`);
    assert(Number(updatedSale.gross_profit) === 450.00, `Recalculated gross profit: 450.00`);
    assert(Number(updatedSale.margin_percent) === 75.0, `Recalculated margin percent: 75.0%`);

    // 2.4 Delete Sale
    console.log(`Deleting sale: ${testSaleId}`);
    const delSaleResult = await stockService.deleteSale(testSaleId);
    assert(delSaleResult.success && delSaleResult.deletedId === testSaleId, `Sale ${testSaleId} deleted`);

    // Verify sale deletion
    const afterSaleDel = await stockService.getSales();
    const saleStillExists = afterSaleDel.find(s => s.id === testSaleId);
    assert(!saleStillExists, `Confirmed sale ${testSaleId} no longer in sales table`);
  } catch (err) {
    console.error("Error in stockService sales tests:", err);
    failed++;
  }

  // ==========================================
  // SECTION 3: API Endpoints Handler Tests
  // ==========================================
  console.log("\n--- 3. Testing API Handler /api/admin/inventory ---");
  const apiInvCode = `API-SKU-${Date.now().toString().slice(-5)}`;

  try {
    // 3.1 GET /api/admin/inventory
    const resGet = createMockRes();
    await inventoryHandler({ method: 'GET' }, resGet);
    assert(resGet.statusCode === 200 && Array.isArray(resGet.data), `GET returns 200 with inventory array (count: ${resGet.data.length})`);

    // 3.2 POST /api/admin/inventory
    const resPost = createMockRes();
    await inventoryHandler({
      method: 'POST',
      body: {
        code: apiInvCode,
        name: 'API Peptide Test',
        dosage: '5mg',
        category: 'Test Category',
        stock_qty: 12,
        min_stock: 4,
        is_ready_sp: true,
        unit_cost: 40.0,
        price_b2c: 220.0,
        price_b2b: 160.0
      }
    }, resPost);
    assert(resPost.statusCode === 201 && resPost.data.code === apiInvCode, `POST returns 201 with created item`);

    // 3.3 PUT /api/admin/inventory (legacy quick qty)
    const resPutLegacy = createMockRes();
    await inventoryHandler({
      method: 'PUT',
      body: {
        code: apiInvCode,
        qty: 18,
        is_ready_sp: true
      }
    }, resPutLegacy);
    assert(resPutLegacy.statusCode === 200 && resPutLegacy.data.stock_qty === 18, `PUT (legacy) returns 200 with qty 18`);

    // 3.4 PUT /api/admin/inventory (full update)
    const resPutFull = createMockRes();
    await inventoryHandler({
      method: 'PUT',
      body: {
        code: apiInvCode,
        name: 'API Peptide Test Renamed',
        dosage: '15mg',
        category: 'Metabolismo',
        unit_cost: 45.0,
        price_b2c: 280.0,
        price_b2b: 190.0,
        stock_qty: 25,
        min_stock: 6,
        is_ready_sp: true
      }
    }, resPutFull);
    assert(resPutFull.statusCode === 200 && resPutFull.data.dosage === '15mg' && resPutFull.data.stock_qty === 25, `PUT (full) returns 200 with updated fields`);

    // 3.5 DELETE /api/admin/inventory (via query or body)
    const resDel = createMockRes();
    await inventoryHandler({
      method: 'DELETE',
      query: { code: apiInvCode }
    }, resDel);
    assert(resDel.statusCode === 200 && resDel.data.success, `DELETE returns 200 for code ${apiInvCode}`);

    // 3.6 Edge cases & error handling
    const resPostNoCode = createMockRes();
    await inventoryHandler({ method: 'POST', body: {} }, resPostNoCode);
    assert(resPostNoCode.statusCode === 400, `POST without code returns 400`);

    const resPutNoCode = createMockRes();
    await inventoryHandler({ method: 'PUT', body: {} }, resPutNoCode);
    assert(resPutNoCode.statusCode === 400, `PUT without code returns 400`);

    const resDelNoCode = createMockRes();
    await inventoryHandler({ method: 'DELETE', query: {}, body: {} }, resDelNoCode);
    assert(resDelNoCode.statusCode === 400, `DELETE without code returns 400`);

    const resMethodNotAllowed = createMockRes();
    await inventoryHandler({ method: 'PATCH' }, resMethodNotAllowed);
    assert(resMethodNotAllowed.statusCode === 405, `PATCH returns 405 Method Not Allowed`);
  } catch (err) {
    console.error("Error in inventory API handler tests:", err);
    failed++;
  }

  console.log("\n--- 4. Testing API Handler /api/admin/vendas ---");
  const apiSaleId = `VND-API-${Date.now().toString().slice(-5)}`;

  try {
    // 4.1 GET /api/admin/vendas
    const resGetVnd = createMockRes();
    await vendasHandler({ method: 'GET' }, resGetVnd);
    assert(resGetVnd.statusCode === 200 && Array.isArray(resGetVnd.data), `GET returns 200 with sales array`);

    // 4.2 POST /api/admin/vendas
    const resPostVnd = createMockRes();
    await vendasHandler({
      method: 'POST',
      body: {
        id: apiSaleId,
        client_name: 'Dra. Camila API Test',
        client_phone: '+55 21 99999-0000',
        items: [{ code: 'CU50', name: 'GHK-Cu', qty: 1, unit_price: 300, unit_cost: 70 }],
        total_revenue: 300.0,
        total_cost: 70.0,
        delivery_method: 'sedex'
      }
    }, resPostVnd);
    assert(resPostVnd.statusCode === 201 && resPostVnd.data.id === apiSaleId, `POST returns 201 with created sale`);
    assert(Number(resPostVnd.data.gross_profit) === 230.0, `Calculated gross profit is 230.0`);

    // 4.3 PUT /api/admin/vendas
    const resPutVnd = createMockRes();
    await vendasHandler({
      method: 'PUT',
      body: {
        id: apiSaleId,
        client_name: 'Dra. Camila API Atualizada',
        total_revenue: 350.0,
        total_cost: 70.0,
        status: 'completed'
      }
    }, resPutVnd);
    assert(resPutVnd.statusCode === 200 && resPutVnd.data.client_name === 'Dra. Camila API Atualizada', `PUT returns 200 with updated sale`);
    assert(Number(resPutVnd.data.gross_profit) === 280.0, `Recalculated gross profit is 280.0`);
    assert(Number(resPutVnd.data.margin_percent) === 80.0, `Recalculated margin percent is 80.0%`);

    // 4.4 DELETE /api/admin/vendas
    const resDelVnd = createMockRes();
    await vendasHandler({
      method: 'DELETE',
      query: { id: apiSaleId }
    }, resDelVnd);
    assert(resDelVnd.statusCode === 200 && resDelVnd.data.success, `DELETE returns 200 for sale ${apiSaleId}`);

    // 4.5 Edge cases & error handling for vendas
    const resPostNoClient = createMockRes();
    await vendasHandler({ method: 'POST', body: { total_revenue: 100 } }, resPostNoClient);
    assert(resPostNoClient.statusCode === 400, `POST without client_name returns 400`);

    const resPutNoId = createMockRes();
    await vendasHandler({ method: 'PUT', body: { client_name: 'Nobody' } }, resPutNoId);
    assert(resPutNoId.statusCode === 400, `PUT without id returns 400`);

    const resDelNoId = createMockRes();
    await vendasHandler({ method: 'DELETE', query: {}, body: {} }, resDelNoId);
    assert(resDelNoId.statusCode === 400, `DELETE without id returns 400`);

    const resVndMethodNotAllowed = createMockRes();
    await vendasHandler({ method: 'OPTIONS' }, resVndMethodNotAllowed);
    assert(resVndMethodNotAllowed.statusCode === 405, `OPTIONS returns 405 Method Not Allowed`);
  } catch (err) {
    console.error("Error in vendas API handler tests:", err);
    failed++;
  }

  console.log("\n==========================================");
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==========================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(e => {
  console.error("Unhandled test suite error:", e);
  process.exit(1);
});
