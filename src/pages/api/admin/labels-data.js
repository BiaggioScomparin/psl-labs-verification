import QRCode from 'qrcode';
import { getDb, getProductById } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { batchId, baseUrl } = req.query;
  const db = getDb();

  let targetBatch = null;
  if (batchId) {
    targetBatch = db.batches.find(b => b.id === batchId);
  }
  if (!targetBatch && db.batches.length > 0) {
    targetBatch = db.batches[0]; // fallback to first batch
  }

  if (!targetBatch) {
    return res.status(404).json({ error: 'Nenhum lote cadastrado' });
  }

  const product = getProductById(targetBatch.productId) || {
    name: 'GHK CU 50 MG',
    concentration: '50 MG'
  };

  // Find all codes for this batch
  const batchCodes = Object.values(db.codes).filter(c => c.batchId === targetBatch.id);

  // If there are less than 65 codes, fill up to 65 for the standard A4351 sheet
  const countNeeded = Math.max(65, batchCodes.length);
  const labelsToRender = [];

  const hostUrl = baseUrl || (req.headers.host ? `https://${req.headers.host}` : 'https://psl-labs-verification.vercel.app');

  for (let i = 0; i < countNeeded; i++) {
    let item = batchCodes[i];
    if (!item) {
      // Temporary test code for preview if not in db
      const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
      item = {
        code: `GHK50-${rand}`,
        batchNumber: targetBatch.batchNumber,
        mfgDate: targetBatch.mfgDate,
        expDate: targetBatch.expDate
      };
    }

    const verifyUrl = `${hostUrl}/v/${item.code}`;
    
    // Generate QR code data URL (clean vector/PNG with quiet zone and pure black for fast camera detection)
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      margin: 2,
      width: 360,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    labelsToRender.push({
      code: item.code,
      verifyUrl,
      qrDataUrl,
      brand: 'PSL LABS',
      country: 'PARAGUAY',
      productName: product.name,
      batchNumber: item.batchNumber || targetBatch.batchNumber,
      mfgDate: item.mfgDate || targetBatch.mfgDate,
      expDate: item.expDate || targetBatch.expDate
    });
  }

  return res.status(200).json({
    batch: targetBatch,
    product: product,
    totalLabels: labelsToRender.length,
    labels: labelsToRender.slice(0, 65) // exact 1 sheet of Spiral A4351
  });
}
