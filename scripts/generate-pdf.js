import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import QRCode from 'qrcode';
import { execFile } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const outputHtmlPath = path.join(rootDir, 'etiquetas_spiral_a4351.html');
const outputPdfPath = path.join(rootDir, 'etiquetas_spiral_a4351_ghk_cu_50mg.pdf');

// Load database to use real registered codes
const dbPath = path.join(rootDir, 'src', 'data', 'db.json');
let db = { codes: {} };
if (fs.existsSync(dbPath)) {
  db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

async function run() {
  console.log("Gerando 65 etiquetas com QR Code único para Spiral A4351...");

  const product = {
    brand: "PSL LABS",
    country: "PARAGUAY",
    name: "GHK CU 50 MG",
    batch: "LOT-2026-01",
    mfg: "10/2026",
    exp: "10/2028",
    baseUrl: "https://psl-labs.vercel.app"
  };

  const labels = [];

  for (let i = 1; i <= 65; i++) {
    // Generate a unique 5-character suffix
    const codeSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const code = `GHK50-${codeSuffix}`;
    const verifyUrl = `${product.baseUrl}/v/${code}`;

    // Also register in db.json so scanning it will work on the website!
    db.codes[code] = {
      code: code,
      productId: "ghk-cu-50mg",
      batchId: "batch-ghk-2026-01",
      batchNumber: product.batch,
      mfgDate: product.mfg,
      expDate: product.exp,
      scanCount: 0,
      firstScannedAt: null,
      lastScannedAt: null,
      status: "active"
    };

    // Vector/High-res data URL for QR Code
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      margin: 0,
      width: 140,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    });

    labels.push({
      code,
      qrDataUrl,
      ...product
    });
  }

  // Save updated database with the 65 generated codes
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
  console.log(`✓ 65 códigos únicos registrados no banco de dados`);

  // Build the pixel-perfect HTML for Spiral A4351
  // Spiral A4351 specifications:
  // Sheet size: A4 (210mm x 297mm)
  // Top & Bottom margin: 10.7mm
  // Left & Right margin: 4.5mm
  // Label width: 38.2mm, Label height: 21.2mm
  // Column pitch: 40.7mm (gap = 2.5mm)
  // Row pitch: 21.2mm (gap = 0mm)
  // 5 columns x 13 rows = 65 labels
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>PSL LABS - Etiquetas Spiral A4351 - GHK CU 50 MG</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      margin: 0;
      padding: 0;
      background-color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    .sheet {
      width: 210mm;
      height: 297mm;
      padding-top: 10.7mm;
      padding-bottom: 10.7mm;
      padding-left: 4.5mm;
      padding-right: 4.5mm;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(5, 38.2mm);
      grid-column-gap: 2.5mm;
      grid-template-rows: repeat(13, 21.2mm);
      grid-row-gap: 0mm;
      page-break-after: always;
    }
    .label {
      width: 38.2mm;
      height: 21.2mm;
      border: 0.1mm dotted #e2e8f0;
      display: flex;
      align-items: center;
      padding: 0.8mm;
      overflow: hidden;
      background: #ffffff;
    }
    .qr-col {
      width: 15.2mm;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .qr-img {
      width: 13.5mm;
      height: 13.5mm;
      display: block;
    }
    .qr-code-txt {
      font-size: 4.8pt;
      font-family: "Courier New", Courier, monospace;
      font-weight: 800;
      color: #0f172a;
      margin-top: 0.2mm;
      text-align: center;
      letter-spacing: -0.2px;
    }
    .info-col {
      width: 21.4mm;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding-left: 0.8mm;
      overflow: hidden;
    }
    .header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .brand-title {
      font-size: 6.8pt;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.2px;
      line-height: 1;
    }
    .brand-py {
      font-size: 4.5pt;
      font-weight: 800;
      color: #059669;
      line-height: 1;
    }
    .product-title {
      font-size: 6.2pt;
      font-weight: 800;
      color: #1e3a8a;
      line-height: 1.1;
      letter-spacing: -0.1px;
    }
    .batch-box {
      font-size: 4.1pt;
      color: #334155;
      line-height: 1.2;
      border-left: 0.3mm solid #cbd5e1;
      padding-left: 0.6mm;
    }
    .footer-action {
      font-size: 3.6pt;
      font-weight: 800;
      color: #2563eb;
      text-transform: uppercase;
      letter-spacing: -0.1px;
    }
  </style>
</head>
<body>
  <div class="sheet">
    ${labels.map(lbl => `
      <div class="label">
        <div class="qr-col">
          <img src="${lbl.qrDataUrl}" class="qr-img" alt="QR" />
          <div class="qr-code-txt">${lbl.code}</div>
        </div>
        <div class="info-col">
          <div class="header-row">
            <span class="brand-title">${lbl.brand}</span>
            <span class="brand-py">🇵🇾 PY</span>
          </div>
          <div class="product-title">${lbl.name}</div>
          <div class="batch-box">
            <div>LOT: ${lbl.batch}</div>
            <div>FAB: ${lbl.mfg} | VAL: ${lbl.exp}</div>
          </div>
          <div class="footer-action">VERIFICAR AUTENTICIDADE</div>
        </div>
      </div>
    `).join('')}
  </div>
</body>
</html>`;

  fs.writeFileSync(outputHtmlPath, html, 'utf8');
  console.log(`✓ Template HTML gerado em: ${outputHtmlPath}`);

  // Convert to high-precision PDF using Edge headless
  if (fs.existsSync(edgePath)) {
    console.log("Compilando PDF vetorial de alta resolução com Microsoft Edge...");
    const fileUri = `file:///${outputHtmlPath.replace(/\\/g, '/')}`;
    
    execFile(edgePath, [
      '--headless',
      '--disable-gpu',
      '--no-margins',
      `--print-to-pdf=${outputPdfPath}`,
      fileUri
    ], (err) => {
      if (err) {
        console.error("Aviso ao gerar PDF:", err.message);
      } else {
        console.log(`🎉 PDF oficial Spiral A4351 pronto para impressão em:\n${outputPdfPath}`);
      }
    });
  } else {
    console.log("Arquivo HTML gerado. Para imprimir, abra o arquivo no navegador e aperte Ctrl+P.");
  }
}

run().catch(console.error);
