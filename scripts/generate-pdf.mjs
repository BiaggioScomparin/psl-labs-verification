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

// Load database to maintain registered codes
const dbPath = path.join(rootDir, 'src', 'data', 'db.json');
let db = { codes: {} };
if (fs.existsSync(dbPath)) {
  db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

// HexaShield Biotech Vector Logo (Compact & Crisp)
const LOGO_HEXASHIELD = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle; flex-shrink:0;">
  <path d="M12 2L3 7V12C3 17.5 6.8 21.7 12 23C17.2 21.7 21 17.5 21 12V7L12 2Z" fill="#0f172a" stroke="#1e3a8a" stroke-width="1.2"/>
  <path d="M12 6V18M7.5 9.5L16.5 14.5M16.5 9.5L7.5 14.5" stroke="#38bdf8" stroke-width="1.6" stroke-linecap="round"/>
  <circle cx="12" cy="12" r="2.8" fill="#10b981" stroke="#ffffff" stroke-width="0.8"/>
</svg>`;

async function generate() {
  console.log("📐 Gerando Gabarito Perfeito Spiral A4351 com layout limpo e margem de segurança...");

  const product = {
    brand: "PSL LABS",
    name: "GHK CU 50 MG",
    batch: "LOT-2026-01",
    mfg: "10/26",
    exp: "10/28",
    baseUrl: "https://psl-labs-verification.vercel.app"
  };

  const labels = [];

  // Generate 65 unique labels (exact 1 sheet Spiral A4351)
  for (let i = 1; i <= 65; i++) {
    const codeSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const code = `GHK50-${codeSuffix}`;
    const verifyUrl = `${product.baseUrl}/v/${code}`;

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

    // Generate high-contrast, clean 10mm vector QR code
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      margin: 0,
      width: 110,
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

  // Update db.json
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');

  // BUILD THE ROCK-SOLID SPIRAL A4351 HTML TEMPLATE
  // Dimensions specifications:
  // Sheet: A4 (210mm x 297mm)
  // Margem Superior: 10.7mm
  // Margem Inferior: 10.7mm
  // Margem Esquerda: 4.5mm
  // Margem Direita: 4.5mm
  // 5 colunas de 38.2mm com gap horizontal de 2.5mm:
  // 4.5 + (5 * 38.2) + (4 * 2.5) + 4.5 = 4.5 + 191 + 10 + 4.5 = 210.0mm (Exato!)
  // 13 linhas de 21.2mm sem gap vertical:
  // 10.7 + (13 * 21.2) + 10.7 = 10.7 + 275.6 + 10.7 = 297.0mm (Exato!)
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>PSL LABS - Gabarito Limpo Spiral A4351</title>
  <style>
    @page {
      size: 210mm 297mm;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    html, body {
      width: 210mm;
      height: 297mm;
      background: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      overflow: hidden;
    }
    
    /* GABARITO DA FOLHA A4 */
    .sheet-grid {
      width: 210mm;
      height: 297mm;
      padding-top: 10.7mm;
      padding-bottom: 10.7mm;
      padding-left: 4.5mm;
      padding-right: 4.5mm;
      display: grid;
      grid-template-columns: 38.2mm 2.5mm 38.2mm 2.5mm 38.2mm 2.5mm 38.2mm 2.5mm 38.2mm;
      grid-template-rows: repeat(13, 21.2mm);
      page-break-after: always;
    }

    /* ESPAÇO ENTRE AS COLUNAS (2.5mm) */
    .gap-col {
      width: 2.5mm;
      height: 21.2mm;
    }

    /* ETIQUETA UNITÁRIA (38.2mm x 21.2mm) */
    .label-cell {
      width: 38.2mm;
      height: 21.2mm;
      max-height: 21.2mm;
      overflow: hidden;
      /* Margem de respiro interna de segurança: 1.2mm vertical, 1.4mm horizontal */
      padding: 1.2mm 1.4mm;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #ffffff;
      /* Linha pontilhada ultra suave de calibragem (quase invisível) */
      border: 0.05mm dotted #e2e8f0;
    }

    /* COLUNA DA ESQUERDA: QR CODE (10mm) + CÓDIGO UNITÁRIO */
    .col-qr {
      width: 11.2mm;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .qr-img {
      width: 9.8mm;
      height: 9.8mm;
      display: block;
    }
    .serial-text {
      font-size: 3.8pt;
      font-family: "Courier New", Courier, monospace;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.2px;
      margin-top: 0.3mm;
      text-align: center;
      white-space: nowrap;
    }

    /* COLUNA DA DIREITA: LOGO + GHK CU 50 MG + LOTE/VAL */
    .col-info {
      width: 23.2mm;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding-left: 0.8mm;
      overflow: hidden;
      text-align: left;
    }

    /* Linha 1: Logo + PSL LABS + Bandeira */
    .row-brand {
      display: flex;
      align-items: center;
      gap: 0.6mm;
      line-height: 1;
    }
    .brand-title {
      font-size: 6.2pt;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.2px;
    }
    .brand-title span {
      color: #059669;
    }
    .tag-origin {
      font-size: 3.8pt;
      font-weight: 800;
      color: #047857;
      margin-left: auto;
    }

    /* Linha 2: Nome do Produto em Destaque */
    .row-product {
      font-size: 7.2pt;
      font-weight: 900;
      color: #1e3a8a;
      letter-spacing: -0.3px;
      line-height: 1.1;
      margin-top: 0.2mm;
    }

    /* Linha 3: Informações do Lote e Validade */
    .row-meta {
      font-size: 4pt;
      font-weight: 600;
      color: #334155;
      line-height: 1.25;
      margin-top: 0.2mm;
    }
    .row-meta strong {
      color: #0f172a;
      font-weight: 800;
    }

    /* Linha 4: Chamada de Autenticidade */
    .row-security {
      font-size: 3.4pt;
      font-weight: 800;
      color: #059669;
      text-transform: uppercase;
      letter-spacing: 0.1px;
      line-height: 1;
    }
  </style>
</head>
<body>
  <div class="sheet-grid">
    ${(() => {
      let cells = '';
      for (let row = 0; row < 13; row++) {
        for (let col = 0; col < 5; col++) {
          const idx = row * 5 + col;
          const lbl = labels[idx];
          cells += `
            <div class="label-cell">
              <!-- LADO ESQUERDO: QR CODE + CÓDIGO -->
              <div class="col-qr">
                <img src="${lbl.qrDataUrl}" class="qr-img" alt="QR" />
                <div class="serial-text">${lbl.code}</div>
              </div>

              <!-- LADO DIREITO: INFORMAÇÕES DO PRODUTO -->
              <div class="col-info">
                <div class="row-brand">
                  ${LOGO_HEXASHIELD}
                  <span class="brand-title">PSL <span>LABS</span></span>
                  <span class="tag-origin">🇵🇾 PY</span>
                </div>

                <div class="row-product">${lbl.name}</div>

                <div class="row-meta">
                  <div>LOTE: <strong>${lbl.batch}</strong></div>
                  <div>FAB: <strong>${lbl.mfg}</strong> · VAL: <strong>${lbl.exp}</strong></div>
                </div>

                <div class="row-security">✓ Verifique Autenticidade</div>
              </div>
            </div>
          `;

          // Add horizontal gap column (2.5mm) after columns 0, 1, 2, 3
          if (col < 4) {
            cells += `<div class="gap-col"></div>`;
          }
        }
      }
      return cells;
    })()}
  </div>
</body>
</html>`;

  fs.writeFileSync(outputHtmlPath, html, 'utf8');
  console.log(`✓ HTML atualizado em: ${outputHtmlPath}`);

  // COMPILE WITH EDGE HEADLESS TO PDF
  if (fs.existsSync(edgePath)) {
    console.log("Compilando novo PDF vetorial com Microsoft Edge...");
    const fileUri = `file:///${outputHtmlPath.replace(/\\/g, '/')}`;

    execFile(edgePath, [
      '--headless',
      '--disable-gpu',
      '--no-margins',
      `--print-to-pdf=${outputPdfPath}`,
      fileUri
    ], (err) => {
      if (err) {
        console.error("Erro ao gerar PDF:", err.message);
      } else {
        console.log(`🎉 NOVO PDF gerado com sucesso em:\n${outputPdfPath}`);
      }
    });
  }
}

generate().catch(console.error);
