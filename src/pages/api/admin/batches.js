import { getBatches, addBatch, generateBatchCodes } from '../../../lib/db';

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(getBatches());
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

    addBatch(newBatch);
    const codes = generateBatchCodes(batchId, qty);

    return res.status(201).json({
      batch: newBatch,
      generatedCodesCount: codes.length,
      sampleCodes: codes.slice(0, 5)
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
