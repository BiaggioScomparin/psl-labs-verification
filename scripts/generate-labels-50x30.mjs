import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import QRCode from 'qrcode';
import { execFile } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const artifactsDir = "C:\\Users\\biagg\\.gemini\\antigravity\\brain\\eecd8f48-bc30-44c6-9d0f-0a791a01c2f5";
const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

// Load or initialize db.json
const dbPath = path.join(rootDir, 'src', 'data', 'db.json');
let db = { codes: {} };
if (fs.existsSync(dbPath)) {
  db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

// HexaShield Vector Logos
const LOGO_DARK_BG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle; flex-shrink:0;">
  <path d="M12 2L3 7V12C3 17.5 6.8 21.7 12 23C17.2 21.7 21 17.5 21 12V7L12 2Z" fill="#0b1120" stroke="#38bdf8" stroke-width="1.6"/>
  <path d="M12 6V18M7.5 9.5L16.5 14.5M16.5 9.5L7.5 14.5" stroke="#0284c7" stroke-width="1.8" stroke-linecap="round"/>
  <circle cx="12" cy="12" r="3.2" fill="#10b981" stroke="#ffffff" stroke-width="0.9"/>
</svg>`;

const LOGO_LIGHT_BG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle; flex-shrink:0;">
  <path d="M12 2L3 7V12C3 17.5 6.8 21.7 12 23C17.2 21.7 21 17.5 21 12V7L12 2Z" fill="#ffffff" stroke="#0369a1" stroke-width="1.6"/>
  <path d="M12 6V18M7.5 9.5L16.5 14.5M16.5 9.5L7.5 14.5" stroke="#0284c7" stroke-width="1.8" stroke-linecap="round"/>
  <circle cx="12" cy="12" r="3.2" fill="#059669" stroke="#ffffff" stroke-width="0.9"/>
</svg>`;

// Function to generate the HTML for a single 50x30mm label
function generateLabelHtml(code, qrDataUrl, isLight = false) {
  const bg = isLight ? '#ffffff' : '#0b1120';
  const textColor = isLight ? '#0f172a' : '#ffffff';
  const subTextColor = isLight ? '#475569' : '#94a3b8';
  const borderColor = isLight ? '#e2e8f0' : '#1e293b';
  const logo = isLight ? LOGO_LIGHT_BG : LOGO_DARK_BG;
  const brandAccent = isLight ? '#0284c7' : '#38bdf8';
  const badgeBg = isLight ? '#e0f2fe' : 'rgba(56, 189, 248, 0.15)';
  const badgeColor = isLight ? '#0369a1' : '#38bdf8';
  const borderPill = isLight ? 'rgba(2, 132, 199, 0.3)' : 'rgba(56, 189, 248, 0.4)';

  return `
    <div class="label-50x30 ${isLight ? 'light-mode' : 'dark-mode'}" style="
      width: 50mm;
      height: 30mm;
      background: ${bg};
      color: ${textColor};
      border: 1px solid ${borderColor};
      border-radius: 2mm;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: row;
      padding: 1.8mm 2mm;
      box-sizing: border-box;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    ">
      <!-- Decorative biotech accent bar on top left -->
      <div style="position: absolute; top: 0; left: 0; width: 100%; height: 1.2mm; background: linear-gradient(90deg, #38bdf8 0%, #10b981 70%, #6366f1 100%);"></div>

      <!-- LEFT COLUMN: Product, Brand, Dosage & Specs (34mm) -->
      <div style="width: 33.5mm; display: flex; flex-direction: column; justify-content: space-between; z-index: 1;">
        
        <!-- Header: Logo + PSL LABS + PY -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 0.6mm;">
          <div style="display: flex; align-items: center; gap: 1.2mm;">
            ${logo}
            <div style="line-height: 1;">
              <div style="font-size: 2.2mm; font-weight: 800; letter-spacing: 0.3px; color: ${brandAccent};">PSL LABS</div>
              <div style="font-size: 1.1mm; font-weight: 600; letter-spacing: 0.4px; color: ${subTextColor}; text-transform: uppercase;">Paraguay Scientific</div>
            </div>
          </div>
          <span style="font-size: 1.3mm; font-weight: 700; background: ${isLight ? '#f1f5f9' : '#1e293b'}; color: ${isLight ? '#334155' : '#94a3b8'}; padding: 0.3mm 1mm; border-radius: 0.8mm; border: 0.5px solid ${borderColor};">PY</span>
        </div>

        <!-- Central Product Name & Badges -->
        <div style="margin: 0.8mm 0;">
          <div style="display: flex; align-items: baseline; gap: 1.5mm;">
            <div style="font-size: 3.8mm; font-weight: 900; letter-spacing: -0.2px; line-height: 1; color: ${textColor};">GHK-Cu</div>
            <div style="font-size: 2.0mm; font-weight: 800; background: #0284c7; color: #ffffff; padding: 0.3mm 1.2mm; border-radius: 0.8mm; line-height: 1;">50 MG</div>
          </div>
          <div style="font-size: 1.4mm; font-weight: 700; letter-spacing: 0.3px; color: #38bdf8; text-transform: uppercase; margin-top: 0.4mm;">
            Copper Tripeptide-1
          </div>
          <div style="display: flex; gap: 1mm; margin-top: 0.6mm;">
            <span style="font-size: 1.1mm; font-weight: 700; background: ${badgeBg}; color: ${badgeColor}; border: 0.4px solid ${borderPill}; padding: 0.2mm 0.8mm; border-radius: 0.6mm; text-transform: uppercase;">Liofilizado Estéril</span>
            <span style="font-size: 1.1mm; font-weight: 700; background: rgba(16, 185, 129, 0.15); color: #10b981; border: 0.4px solid rgba(16, 185, 129, 0.4); padding: 0.2mm 0.8mm; border-radius: 0.6mm;">HPLC >99.2%</span>
          </div>
        </div>

        <!-- Footer: Storage & Batch Info -->
        <div style="border-top: 0.4px solid ${borderColor}; padding-top: 0.6mm; display: flex; flex-direction: column; gap: 0.3mm;">
          <div style="font-size: 1.1mm; color: ${subTextColor}; font-weight: 500;">
            Conservar a 2°C - 8°C · Proteger de la luz
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 1.15mm; font-weight: 700; color: ${isLight ? '#1e293b' : '#cbd5e1'};">
            <span>LOT: <strong style="color: ${brandAccent};">GHK50-2026-01</strong></span>
            <span>VENC: 11/2028</span>
          </div>
        </div>

      </div>

      <!-- RIGHT COLUMN: QR Code Verification Container (14.5mm) -->
      <div style="width: 14.5mm; margin-left: auto; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 1;">
        <div style="
          background: #ffffff;
          padding: 0.8mm;
          border-radius: 1.2mm;
          box-shadow: 0 1px 3px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          box-sizing: border-box;
          border: 0.5px solid #cbd5e1;
        ">
          <div style="font-size: 0.95mm; font-weight: 800; color: #0284c7; letter-spacing: 0.2px; text-transform: uppercase; margin-bottom: 0.2mm; line-height: 1;">
            VERIFICAR
          </div>
          <img src="${qrDataUrl}" style="width: 12.5mm; height: 12.5mm; display: block; image-rendering: pixelated;" alt="QR Code" />
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 1.1mm; font-weight: 800; color: #0f172a; margin-top: 0.4mm; letter-spacing: 0.1px; line-height: 1;">
            ${code}
          </div>
          <div style="font-size: 0.85mm; color: #64748b; font-weight: 600; margin-top: 0.2mm; line-height: 1;">
            psl-labs.com
          </div>
        </div>
      </div>

    </div>
  `;
}

async function run() {
  console.log("🚀 Iniciando geração da Amostra Visual e Gabarito A4 (50x30mm) para GHK-Cu 50mg...");

  const defaultCode = "GHK50-EO0HH";
  const verifyUrl = `https://psl-labs-verification.vercel.app/v/${defaultCode}`;

  const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
    margin: 1,
    width: 400,
    errorCorrectionLevel: 'M',
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });

  // Ensure 24 unique codes exist in db.json for the full sheet
  const sheetCodes = [];
  for (let i = 1; i <= 24; i++) {
    const code = i === 1 ? defaultCode : `GHK50-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    sheetCodes.push(code);

    if (!db.codes[code]) {
      db.codes[code] = {
        code: code,
        productId: "ghk-cu-50mg",
        batchId: "batch-ghk-2026-01",
        batchNumber: "LOT-GHK50-2026-01",
        mfgDate: "11/2026",
        expDate: "11/2028",
        scanCount: 0,
        firstScannedAt: null,
        lastScannedAt: null,
        status: "active"
      };
    }
  }
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');

  // Pre-generate QR codes for each sheet label
  const sheetQrs = [];
  for (const c of sheetCodes) {
    const url = `https://psl-labs-verification.vercel.app/v/${c}`;
    const qr = await QRCode.toDataURL(url, {
      margin: 1,
      width: 300,
      errorCorrectionLevel: 'M',
      color: { dark: '#000000', light: '#ffffff' }
    });
    sheetQrs.push(qr);
  }

  // ==========================================
  // 1. GERAR HTML DE AMOSTRA VISUAL EM ALTA RESOLUÇÃO (Close-up comparativo)
  // ==========================================
  const sampleHtmlPath = path.join(rootDir, 'amostra_etiqueta_50x30mm_closeup.html');
  const samplePngPath = path.join(artifactsDir, 'amostra_etiqueta_50x30mm_ghk_cu.png');

  const sampleHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Amostra de Etiqueta 50x30mm - GHK-Cu 50mg</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', system-ui, sans-serif;
      background: #090d16;
      color: #f8fafc;
      padding: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }
    .container {
      max-width: 1000px;
      width: 100%;
    }
    .header {
      text-align: center;
      margin-bottom: 35px;
    }
    .badge-pill {
      display: inline-block;
      background: rgba(56, 189, 248, 0.15);
      border: 1px solid rgba(56, 189, 248, 0.35);
      color: #38bdf8;
      font-size: 13px;
      font-weight: 700;
      padding: 6px 16px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }
    h1 {
      font-size: 32px;
      font-weight: 900;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #ffffff 40%, #94a3b8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 8px;
    }
    p.subtitle {
      font-size: 15px;
      color: #94a3b8;
    }

    /* Comparison Grid */
    .comparison-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 40px;
    }
    .card {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 16px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
    }
    .card-title {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 6px;
      color: #f1f5f9;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .card-tag {
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 6px;
      text-transform: uppercase;
    }
    .tag-dark { background: #1e293b; color: #38bdf8; border: 1px solid #334155; }
    .tag-light { background: #f1f5f9; color: #0284c7; }

    /* Zoom container scaling the 50x30mm label by ~2.2x for comfortable visual inspection */
    .zoom-stage {
      margin: 15px 0 20px 0;
      position: relative;
      height: 300px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at center, rgba(30, 41, 59, 0.5) 0%, transparent 70%);
      border-radius: 12px;
    }
    .zoom-inner {
      transform: scale(2.1);
      transform-origin: center center;
      box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.5);
      border-radius: 2mm;
    }

    /* Measurement callouts */
    .dimension-bar-w {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      margin-top: 15px;
      padding-top: 10px;
      border-top: 1px dashed #334155;
      font-size: 13px;
      font-weight: 700;
      color: #38bdf8;
    }

    /* Spec feature table */
    .spec-table {
      width: 100%;
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 14px;
      overflow: hidden;
      margin-bottom: 30px;
    }
    .spec-row {
      display: grid;
      grid-template-columns: 200px 1fr;
      padding: 14px 20px;
      border-bottom: 1px solid #1e293b;
      font-size: 14px;
    }
    .spec-row:last-child { border-bottom: none; }
    .spec-label { font-weight: 600; color: #94a3b8; }
    .spec-val { font-weight: 600; color: #f1f5f9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge-pill">Amostra de Rótulo · Escala Proporcional Ampliada</div>
      <h1>GHK-Cu 50 MG · Etiqueta 50 × 30 MM</h1>
      <p class="subtitle">Identidade Oficial PSL LABS · QR Code Rastreador com Link Direto de Verificação</p>
    </div>

    <!-- Comparison of Dark and Light Versions -->
    <div class="comparison-grid">
      
      <!-- DARK BIOTECH (Option 1 - User Favorite) -->
      <div class="card">
        <div class="card-title">
          <span>Dark Biotech Edition</span>
          <span class="card-tag tag-dark">Oficial</span>
        </div>
        <p style="font-size: 12px; color: #64748b;">Fundo grafite profundo com detalhes em ciano e esmeralda</p>
        <div class="zoom-stage" style="height: 220px; display: flex; align-items: center; justify-content: center;">
          <div class="zoom-inner">
            ${generateLabelHtml(defaultCode, qrDataUrl, false)}
          </div>
        </div>
        <div class="dimension-bar-w">
          <span>↔ Largura: 50 mm (189 px)</span>
          <span>↕ Altura: 30 mm (113 px)</span>
        </div>
      </div>

      <!-- WHITE BIOTECH (Clinical Light Edition) -->
      <div class="card">
        <div class="card-title">
          <span>White Biotech Edition</span>
          <span class="card-tag tag-light">Clínica</span>
        </div>
        <p style="font-size: 12px; color: #64748b;">Fundo branco acetinado puro com tipografia escura de alto contraste</p>
        <div class="zoom-stage" style="height: 220px; display: flex; align-items: center; justify-content: center;">
          <div class="zoom-inner">
            ${generateLabelHtml(defaultCode, qrDataUrl, true)}
          </div>
        </div>
        <div class="dimension-bar-w">
          <span>↔ Largura: 50 mm (189 px)</span>
          <span>↕ Altura: 30 mm (113 px)</span>
        </div>
      </div>

    </div>

    <!-- Anatomical Breakdown -->
    <div class="spec-table">
      <div class="spec-row">
        <div class="spec-label">Dimensões Exatas</div>
        <div class="spec-val"><strong style="color: #38bdf8;">50,0 mm de largura × 30,0 mm de altura</strong> (Área total: 1.500 mm² · +85% de espaço frente ao modelo de 38x21mm)</div>
      </div>
      <div class="spec-row">
        <div class="spec-label">Encaixe no Frasco</div>
        <div class="spec-val">Abraça perfeitamente ampolas de 3 ml (circunferência ~50.2mm) e frascos de 5ml/10ml deixando janela de nível</div>
      </div>
      <div class="spec-row">
        <div class="spec-label">QR Code e Segurança</div>
        <div class="spec-val">QR Code ampliado para <strong>12.5 × 12.5 mm</strong> com caixa de proteção branca pura e zona silenciosa (leitura instantânea)</div>
      </div>
      <div class="spec-row">
        <div class="spec-label">Destino do QR Code</div>
        <div class="spec-val" style="color: #10b981;">https://psl-labs-verification.vercel.app/v/${defaultCode} (Atesta lote, autenticidade e monografia)</div>
      </div>
    </div>

  </div>
</body>
</html>`;

  fs.writeFileSync(sampleHtmlPath, sampleHtml, 'utf8');

  // ==========================================
  // 2. GERAR FOLHA A4 COMPLETA (Gabarito 1:1 com 24 etiquetas)
  // ==========================================
  const sheetHtmlPath = path.join(rootDir, 'etiquetas_ghk_cu_50x30mm_a4.html');
  const sheetPdfBrainPath = path.join(artifactsDir, 'etiquetas_ghk_cu_50x30mm_a4.pdf');
  const sheetPdfLocalPath = path.join(rootDir, 'etiquetas_ghk_cu_50x30mm_a4.pdf');
  const sheetPngPath = path.join(artifactsDir, 'preview_folha_etiquetas_50x30mm_a4.png');

  // Grid math: 3 columns x 8 rows = 24 labels
  // Left/Right margin: 20mm
  // Top margin: 15mm, Bottom: 14mm
  // Column gap: 10mm
  // Row gap: 4mm

  let labelsGridHtml = '';
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 3; c++) {
      const idx = r * 3 + c;
      const code = sheetCodes[idx];
      const qr = sheetQrs[idx];
      const x = 20 + c * (50 + 10);
      const y = 15 + r * (30 + 4);

      // Crop marks for cutting
      const cropMarks = `
        <!-- Crop Marks (Cantoneiras de corte) -->
        <div style="position: absolute; left: ${x - 3}mm; top: ${y - 3}mm; width: 3mm; height: 3mm; border-right: 0.2mm solid #cbd5e1; border-bottom: 0.2mm solid #cbd5e1;"></div>
        <div style="position: absolute; left: ${x + 50}mm; top: ${y - 3}mm; width: 3mm; height: 3mm; border-left: 0.2mm solid #cbd5e1; border-bottom: 0.2mm solid #cbd5e1;"></div>
        <div style="position: absolute; left: ${x - 3}mm; top: ${y + 30}mm; width: 3mm; height: 3mm; border-right: 0.2mm solid #cbd5e1; border-top: 0.2mm solid #cbd5e1;"></div>
        <div style="position: absolute; left: ${x + 50}mm; top: ${y + 30}mm; width: 3mm; height: 3mm; border-left: 0.2mm solid #cbd5e1; border-top: 0.2mm solid #cbd5e1;"></div>
      `;

      labelsGridHtml += `
        ${cropMarks}
        <div style="position: absolute; left: ${x}mm; top: ${y}mm;">
          ${generateLabelHtml(code, qr, false)}
        </div>
      `;
    }
  }

  const sheetHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Gabarito Folha A4 - 24 Etiquetas 50x30mm - GHK-Cu 50mg</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@700;800&display=swap');
    
    @page {
      size: A4 portrait;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      width: 210mm;
      min-height: 297mm;
      max-height: 297mm;
      margin: 0;
      padding: 0;
      background: #ffffff;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      position: relative;
      overflow: hidden;
    }

    /* Print sheet metadata header */
    .sheet-header {
      position: absolute;
      top: 5mm;
      left: 20mm;
      right: 20mm;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-bottom: 0.3mm solid #0f172a;
      padding-bottom: 1.5mm;
    }
    .sheet-title {
      font-size: 3.2mm;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: 0.2px;
    }
    .sheet-subtitle {
      font-size: 2.0mm;
      font-weight: 600;
      color: #475569;
    }
    .sheet-badge {
      background: #0284c7;
      color: #ffffff;
      font-size: 1.9mm;
      font-weight: 800;
      padding: 0.8mm 2.2mm;
      border-radius: 1mm;
      text-transform: uppercase;
    }

    /* Sheet footer */
    .sheet-footer {
      position: absolute;
      bottom: 4mm;
      left: 20mm;
      right: 20mm;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 0.3mm solid #e2e8f0;
      padding-top: 1.5mm;
      font-size: 1.8mm;
      color: #64748b;
    }

    /* 50mm Calibration Ruler */
    .cal-ruler {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .ruler-bar {
      width: 50mm;
      height: 2.2mm;
      border: 0.2mm solid #0f172a;
      border-top: none;
      position: relative;
      background: repeating-linear-gradient(90deg, #0f172a, #0f172a 0.2mm, transparent 0.2mm, transparent 5mm);
    }
    .ruler-text {
      font-size: 1.5mm;
      font-weight: 700;
      color: #0f172a;
      margin-top: 0.5mm;
    }

    /* Registration targets for print alignment */
    .reg-mark {
      position: absolute;
      width: 6mm;
      height: 6mm;
    }
  </style>
</head>
<body>

  <!-- Top Page Header -->
  <div class="sheet-header">
    <div>
      <div class="sheet-title">PSL LABS · FOLHA DE IMPRESSÃO A4 (ESCALA 1:1 - TAMANHO REAL)</div>
      <div class="sheet-subtitle">ETIQUETAS 50 × 30 MM · GHK-Cu 50 MG (COPPER TRIPEPTIDE-1) · 24 UNIDADES</div>
    </div>
    <div class="sheet-badge">24 ETIQUETAS · 3 COLUNAS × 8 LINHAS</div>
  </div>

  <!-- Registration Marks in corners -->
  <div class="reg-mark" style="top: 3mm; left: 3mm;">
    <svg width="22" height="22" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="none" stroke="#0f172a" stroke-width="0.8"/><line x1="12" y1="1" x2="12" y2="23" stroke="#0f172a" stroke-width="0.8"/><line x1="1" y1="12" x2="23" y2="12" stroke="#0f172a" stroke-width="0.8"/></svg>
  </div>
  <div class="reg-mark" style="top: 3mm; right: 3mm;">
    <svg width="22" height="22" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="none" stroke="#0f172a" stroke-width="0.8"/><line x1="12" y1="1" x2="12" y2="23" stroke="#0f172a" stroke-width="0.8"/><line x1="1" y1="12" x2="23" y2="12" stroke="#0f172a" stroke-width="0.8"/></svg>
  </div>

  <!-- The 24 Labels Grid -->
  ${labelsGridHtml}

  <!-- Bottom Page Footer with Calibration Ruler -->
  <div class="sheet-footer">
    <div>
      <strong>Instruções de Impressão:</strong> Escala 100% (Sem redimensionar) · Papel A4 Adesivo (Fosco ou Brilhante) · Margens 0 mm
    </div>
    <div class="cal-ruler">
      <div class="ruler-bar"></div>
      <div class="ruler-text">RÉGUA DE CONFERÊNCIA: EXATOS 50 MM</div>
    </div>
  </div>

</body>
</html>`;

  fs.writeFileSync(sheetHtmlPath, sheetHtml, 'utf8');
  console.log(`✓ HTMLs gerados com sucesso!`);

  // ==========================================
  // 3. RENDERIZAR SCREENSHOTS E COMPILAR PDF COM EDGE
  // ==========================================
  console.log("📸 Gerando screenshot da amostra visual ampliada...");
  await runEdgeCommand([
    '--headless',
    '--disable-gpu',
    '--screenshot=' + samplePngPath,
    '--window-size=1080,1050',
    '--hide-scrollbars',
    sampleHtmlPath
  ]);
  console.log(`✓ Screenshot da amostra salvo em: ${samplePngPath}`);

  console.log("📸 Gerando preview da folha A4 completa...");
  await runEdgeCommand([
    '--headless',
    '--disable-gpu',
    '--screenshot=' + sheetPngPath,
    '--window-size=1200,1697',
    '--hide-scrollbars',
    sheetHtmlPath
  ]);
  console.log(`✓ Preview da folha A4 salvo em: ${sheetPngPath}`);

  console.log("📄 Compilando PDF Vetorial de Impressão 1:1...");
  await runEdgeCommand([
    '--headless',
    '--disable-gpu',
    '--no-pdf-header-footer',
    '--print-to-pdf=' + sheetPdfBrainPath,
    sheetHtmlPath
  ]);
  fs.copyFileSync(sheetPdfBrainPath, sheetPdfLocalPath);
  console.log(`🎉 PDF Vetorial 1:1 gerado em: ${sheetPdfBrainPath}`);
}

function runEdgeCommand(args) {
  return new Promise((resolve, reject) => {
    execFile(edgePath, args, (err, stdout, stderr) => {
      if (err) return reject(err);
      resolve(stdout);
    });
  });
}

run().catch(console.error);
