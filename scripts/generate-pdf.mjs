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
const logosShowcaseHtmlPath = path.join(rootDir, 'logos_sugestoes_psl_labs.html');

// Load database to keep all codes synchronized
const dbPath = path.join(rootDir, 'src', 'data', 'db.json');
let db = { codes: {} };
if (fs.existsSync(dbPath)) {
  db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

// 4 VECTOR LOGO OPTIONS FOR PSL LABS
export const LOGO_SVG = {
  // Option 1: HexaShield Biotech (Hexagonal Peptide Ring + Security Shield + Green Atom)
  hexashield: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
    <path d="M12 2L3 7V12C3 17.5 6.8 21.7 12 23C17.2 21.7 21 17.5 21 12V7L12 2Z" fill="#0f172a" stroke="#1e3a8a" stroke-width="1.2"/>
    <path d="M12 6V18M7.5 9.5L16.5 14.5M16.5 9.5L7.5 14.5" stroke="#38bdf8" stroke-width="1.6" stroke-linecap="round"/>
    <circle cx="12" cy="12" r="2.8" fill="#10b981" stroke="#ffffff" stroke-width="0.8"/>
  </svg>`,

  // Option 2: BioHelix P (DNA Double Helix stylized as 'P')
  biohelix: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
    <circle cx="12" cy="12" r="10" fill="#0f172a" stroke="#2563eb" stroke-width="1.2"/>
    <path d="M8 18V6H13C15.2 6 17 7.5 17 9.5C17 11.5 15.2 13 13 13H8" stroke="#10b981" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="13" cy="9.5" r="1.5" fill="#ffffff"/>
    <path d="M7 14L10 11M9 17L12 14" stroke="#38bdf8" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,

  // Option 3: Flask & Molecular Star (Pharmaceutical Erlenmeyer Flask with Paraguay Molecular Star)
  labflask: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
    <path d="M9 2H15M10 2V7L4.5 17.5C3.8 18.8 4.7 20.5 6.2 20.5H17.8C19.3 20.5 20.2 18.8 19.5 17.5L14 7V2" stroke="#0f172a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="#1e3a8a"/>
    <path d="M6.5 15H17.5L18.5 18C18.8 18.8 18.2 19.5 17.4 19.5H6.6C5.8 19.5 5.2 18.8 5.5 18L6.5 15Z" fill="#10b981"/>
    <circle cx="12" cy="17" r="1.2" fill="#ffffff"/>
    <circle cx="15" cy="16.5" r="0.8" fill="#ffffff"/>
  </svg>`,

  // Option 4: Nordic Clinical Monogram
  monogram: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
    <rect x="2" y="2" width="20" height="20" rx="5" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/>
    <text x="12" y="16.5" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="9" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="-0.3">PSL</text>
  </svg>`
};

async function generate() {
  console.log("🎨 Redesenhando etiqueta Spiral A4351 com Logo vetorial, QR Code reduzido e UX de alta precisão...");

  const product = {
    brand: "PSL LABS",
    country: "PARAGUAY",
    name: "GHK CU",
    dosage: "50 MG",
    subname: "Copper Tripeptide-1 · >99% Pure",
    batch: "LOT-2026-01",
    mfg: "10/2026",
    exp: "10/2028",
    baseUrl: "https://psl-labs-verification.vercel.app"
  };

  const labels = [];

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

    // Vector QR code optimized for smaller size (9.8mm) with high contrast
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      margin: 0,
      width: 120,
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

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');

  // BUILD THE ENHANCED HIGH-PRECISION SPIRAL A4351 SHEET
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
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
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
      border: 0.15mm solid #e2e8f0;
      border-radius: 0.8mm;
      padding: 0.7mm 0.9mm;
      overflow: hidden;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
    }
    
    /* Top Brand & Origin Row */
    .top-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 4.2mm;
      border-bottom: 0.2mm solid #f1f5f9;
      padding-bottom: 0.3mm;
    }
    .brand-wrap {
      display: flex;
      align-items: center;
      gap: 0.8mm;
    }
    .brand-name {
      font-size: 6.6pt;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.2px;
      line-height: 1;
    }
    .brand-name span {
      color: #059669;
    }
    .country-pill {
      font-size: 4pt;
      font-weight: 800;
      color: #047857;
      background: #ecfdf5;
      border: 0.2mm solid #a7f3d0;
      padding: 0.1mm 0.8mm;
      border-radius: 0.5mm;
      letter-spacing: 0.1px;
    }

    /* Main Body Area (QR + Product Info) */
    .body-content {
      display: flex;
      align-items: center;
      height: 12.4mm;
      gap: 1.1mm;
    }
    
    /* Left: Reduced QR Code (9.8mm) */
    .qr-column {
      width: 10.2mm;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .qr-code-img {
      width: 9.8mm;
      height: 9.8mm;
      display: block;
      border-radius: 0.3mm;
    }
    .qr-serial-pill {
      font-size: 3.8pt;
      font-family: "Courier New", Courier, monospace;
      font-weight: 800;
      color: #0f172a;
      background: #f8fafc;
      border: 0.15mm solid #cbd5e1;
      border-radius: 0.3mm;
      padding: 0.1mm 0.4mm;
      margin-top: 0.25mm;
      letter-spacing: -0.2px;
      text-align: center;
      white-space: nowrap;
    }

    /* Right: Product & Batch Info */
    .info-column {
      flex: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
    }
    .product-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 0.2mm;
    }
    .product-title {
      font-size: 7.2pt;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.2px;
      line-height: 1;
    }
    .dosage-pill {
      font-size: 4.8pt;
      font-weight: 900;
      background: #1e3a8a;
      color: #ffffff;
      padding: 0.2mm 1.1mm;
      border-radius: 0.5mm;
      letter-spacing: 0.1px;
      line-height: 1.1;
    }
    .chemical-name {
      font-size: 3.4pt;
      color: #64748b;
      font-weight: 600;
      line-height: 1;
      margin-top: 0.2mm;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .batch-capsule {
      background: #f8fafc;
      border: 0.15mm solid #e2e8f0;
      border-radius: 0.5mm;
      padding: 0.3mm 0.6mm;
      margin-top: 0.2mm;
    }
    .batch-line {
      font-size: 3.8pt;
      font-weight: 700;
      color: #334155;
      line-height: 1.15;
    }
    .batch-line strong {
      color: #0f172a;
    }

    /* Bottom Security Footer */
    .security-bar {
      height: 3mm;
      background: linear-gradient(90deg, #f0fdf4 0%, #eff6ff 100%);
      border: 0.15mm solid #bbf7d0;
      border-radius: 0.4mm;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.6mm;
      padding: 0 0.4mm;
    }
    .security-bar svg {
      width: 2.2mm;
      height: 2.2mm;
      flex-shrink: 0;
    }
    .security-text {
      font-size: 3.3pt;
      font-weight: 800;
      color: #15803d;
      text-transform: uppercase;
      letter-spacing: 0.15px;
      white-space: nowrap;
    }
  </style>
</head>
<body>
  <div class="sheet">
    ${labels.map(lbl => `
      <div class="label">
        <!-- TOP HEADER: LOGO + PSL LABS + ORIGIN -->
        <div class="top-header">
          <div class="brand-wrap">
            ${LOGO_SVG.hexashield}
            <div class="brand-name">PSL <span>LABS</span></div>
          </div>
          <div class="country-pill">🇵🇾 PY · ASUNCIÓN</div>
        </div>

        <!-- MAIN BODY: REDUCED QR (9.8mm) + PRODUCT DATA -->
        <div class="body-content">
          <div class="qr-column">
            <img src="${lbl.qrDataUrl}" class="qr-code-img" alt="QR" />
            <div class="qr-serial-pill">${lbl.code}</div>
          </div>
          
          <div class="info-column">
            <div>
              <div class="product-row">
                <span class="product-title">${lbl.name}</span>
                <span class="dosage-pill">${lbl.dosage}</span>
              </div>
              <div class="chemical-name">${lbl.subname}</div>
            </div>

            <div class="batch-capsule">
              <div class="batch-line">LOTE: <strong>${lbl.batch}</strong></div>
              <div class="batch-line">FAB: <strong>${lbl.mfg}</strong> · VAL: <strong>${lbl.exp}</strong></div>
            </div>
          </div>
        </div>

        <!-- BOTTOM SECURITY STRIP -->
        <div class="security-bar">
          <svg viewBox="0 0 24 24" fill="none" stroke="#15803d" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="M9 12l2 2 4-4"/>
          </svg>
          <span class="security-text">ESCANEIE O QR CODE PARA VERIFICAR AUTENTICIDADE</span>
        </div>
      </div>
    `).join('')}
  </div>
</body>
</html>`;

  fs.writeFileSync(outputHtmlPath, html, 'utf8');
  console.log(`✓ Template HTML atualizado em: ${outputHtmlPath}`);

  // BUILD LOGOS SHOWCASE HTML FOR THE USER
  const showcaseHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>PSL LABS - Opções de Logotipo</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #090d16;
      color: #f1f5f9;
      padding: 40px 20px;
      margin: 0;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
    }
    h1 {
      font-size: 28px;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 8px;
    }
    p.lead {
      color: #94a3b8;
      font-size: 14px;
      margin-bottom: 30px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }
    .card {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 16px;
      padding: 24px;
      text-align: center;
      transition: all 0.2s;
    }
    .card:hover {
      border-color: #10b981;
      transform: translateY(-2px);
    }
    .card.selected {
      border: 2px solid #10b981;
      background: #11221f;
    }
    .icon-box {
      width: 64px;
      height: 64px;
      margin: 0 auto 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 14px;
      background: #0f172a;
      border: 1px solid #374151;
    }
    .icon-box svg {
      width: 36px;
      height: 36px;
    }
    .title {
      font-size: 16px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 6px;
    }
    .desc {
      font-size: 12px;
      color: #94a3b8;
      line-height: 1.4;
    }
    .badge {
      display: inline-block;
      background: #065f46;
      color: #34d399;
      font-size: 10px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 12px;
      margin-bottom: 12px;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Sugestões de Logotipo · PSL LABS 🇵🇾</h1>
    <p class="lead">Logotipos vetorizados de alta tecnologia, desenhados para máxima nitidez mesmo em etiquetas compactas de 38 × 21 mm.</p>

    <div class="grid">
      <!-- Option 1 -->
      <div class="card selected">
        <span class="badge">⭐ Aplicado na Etiqueta</span>
        <div class="icon-box">
          ${LOGO_SVG.hexashield.replace(/width="15"/g, 'width="36"').replace(/height="15"/g, 'height="36"')}
        </div>
        <div class="title">1. HexaShield Biotech</div>
        <div class="desc">Anel molecular hexagonal (estrutura de peptídeos) integrado a um escudo de segurança e átomo verde esmeralda.</div>
      </div>

      <!-- Option 2 -->
      <div class="card">
        <span class="badge" style="background:#1e3a8a; color:#93c5fd;">Biotecnologia</span>
        <div class="icon-box">
          ${LOGO_SVG.biohelix.replace(/width="15"/g, 'width="36"').replace(/height="15"/g, 'height="36"')}
        </div>
        <div class="title">2. BioHelix Nexus</div>
        <div class="desc">Hélice de DNA com curva formando a letra 'P'. Remete à síntese molecular e precisão genética.</div>
      </div>

      <!-- Option 3 -->
      <div class="card">
        <span class="badge" style="background:#4c1d95; color:#c4b5fd;">Farmacêutico</span>
        <div class="icon-box">
          ${LOGO_SVG.labflask.replace(/width="15"/g, 'width="36"').replace(/height="15"/g, 'height="36"')}
        </div>
        <div class="title">3. Paraguay Lab Flask</div>
        <div class="desc">Matraz Erlenmeyer farmacêutico com microesferas ativas de alta pureza e padrão internacional.</div>
      </div>

      <!-- Option 4 -->
      <div class="card">
        <span class="badge" style="background:#374151; color:#e5e7eb;">Minimalista</span>
        <div class="icon-box">
          ${LOGO_SVG.monogram.replace(/width="15"/g, 'width="36"').replace(/height="15"/g, 'height="36"')}
        </div>
        <div class="title">4. Nordic Monogram</div>
        <div class="desc">Cápsula geométrica suíça com a tipografia 'PSL' de altíssimo impacto e leitura ultrarrápida.</div>
      </div>
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync(logosShowcaseHtmlPath, showcaseHtml, 'utf8');
  console.log(`✓ Showcase de Logotipos gerado em: ${logosShowcaseHtmlPath}`);

  // COMPILE PDF WITH MICROSOFT EDGE
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
