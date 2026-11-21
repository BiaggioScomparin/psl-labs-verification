import { getBatches, addBatch, generateBatchCodes } from '../../../lib/db.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const batches = await getBatches();
    return res.status(200).json(batches);
  }

  if (req.method === 'POST') {
    const { productId, batchNumber, mfgDate, expDate, quantityLabels } = req.body;
    
    if (!productId || !batchNumber || !mfgDate || !expDate) {
      return res.status(400).json({ error: 'Todos os campos do lote são obrigatórios' });
    }

    const qty = parseInt(quantityLabels, 10) || 65; // default 65 (1 sheet Spiral A4351)
    const batchId = `batch-${batchNumber.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`;

    const newBatch = {
      id: batchId,
      productId,
      batchNumber,
      mfgDate,
      expDate,
      quantityLabels: qty,
      createdAt: new Date().toISOString()
    };

    const createdBatch = await addBatch(newBatch);
    const codes = await generateBatchCodes(batchId, qty);

    return res.status(201).json({
      batch: createdBatch,
      generatedCodesCount: codes.length,
      sampleCodes: codes.slice(0, 5)
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
