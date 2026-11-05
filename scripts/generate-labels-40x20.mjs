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

// Load db.json
const dbPath = path.join(rootDir, 'src', 'data', 'db.json');
let db = { codes: {} };
if (fs.existsSync(dbPath)) {
  db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

const LOGO_DARK_BG = `<svg width="13" height="13" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle; flex-shrink:0;">
  <circle cx="32" cy="32" r="30" stroke="#38bdf8" stroke-width="2.5" />
  <circle cx="32" cy="32" r="26" stroke="#38bdf8" stroke-width="1.2" stroke-dasharray="1.5 2" />
  <circle cx="32" cy="32" r="18" fill="rgba(56,189,248,0.2)" />
  <line x1="32" y1="2" x2="32" y2="7" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" />
  <line x1="32" y1="57" x2="32" y2="62" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" />
  <line x1="2" y1="32" x2="7" y2="32" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" />
  <line x1="57" y1="32" x2="62" y2="32" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" />
  <polygon points="32,13 36.5,24 48,24.8 39.2,32.2 42,43.5 32,37.5 22,43.5 24.8,32.2 16,24.8 27.5,24" fill="#10b981" stroke="#0a0f18" stroke-width="1.2" stroke-linejoin="round" />
  <circle cx="32" cy="32" r="3" fill="#ffffff" />
</svg>`;

const LOGO_LIGHT_BG = `<svg width="13" height="13" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle; flex-shrink:0;">
  <circle cx="32" cy="32" r="30" stroke="#0284c7" stroke-width="2.5" />
  <circle cx="32" cy="32" r="26" stroke="#0284c7" stroke-width="1.2" stroke-dasharray="1.5 2" />
  <circle cx="32" cy="32" r="18" fill="rgba(2,132,199,0.12)" />
  <line x1="32" y1="2" x2="32" y2="7" stroke="#0284c7" stroke-width="2.5" stroke-linecap="round" />
  <line x1="32" y1="57" x2="32" y2="62" stroke="#0284c7" stroke-width="2.5" stroke-linecap="round" />
  <line x1="2" y1="32" x2="7" y2="32" stroke="#0284c7" stroke-width="2.5" stroke-linecap="round" />
  <line x1="57" y1="32" x2="62" y2="32" stroke="#0284c7" stroke-width="2.5" stroke-linecap="round" />
  <polygon points="32,13 36.5,24 48,24.8 39.2,32.2 42,43.5 32,37.5 22,43.5 24.8,32.2 16,24.8 27.5,24" fill="#059669" stroke="#ffffff" stroke-width="1.2" stroke-linejoin="round" />
  <circle cx="32" cy="32" r="3" fill="#ffffff" />
</svg>`;

function generateLabel40x20Html(code, qrDataUrl, isLight = false) {
  const bg = isLight ? '#ffffff' : '#0b1120';
  const textColor = isLight ? '#0f172a' : '#ffffff';
  const subTextColor = isLight ? '#475569' : '#94a3b8';
  const borderColor = isLight ? '#cbd5e1' : '#1e293b';
  const logo = isLight ? LOGO_LIGHT_BG : LOGO_DARK_BG;
  const brandAccent = isLight ? '#0284c7' : '#38bdf8';
  const badgeBg = isLight ? '#e0f2fe' : 'rgba(56, 189, 248, 0.15)';
  const badgeColor = isLight ? '#0369a1' : '#38bdf8';
  const borderPill = isLight ? 'rgba(2, 132, 199, 0.3)' : 'rgba(56, 189, 248, 0.4)';

  return `
    <div class="label-40x20 ${isLight ? 'light-mode' : 'dark-mode'}" style="
      width: 40mm;
      height: 20mm;
      background: ${bg};
      color: ${textColor};
      border: 0.8px solid ${borderColor};
      border-radius: 1.5mm;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: row;
      padding: 1.2mm 1.3mm;
      box-sizing: border-box;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    ">
      <!-- Top neon accent line -->
      <div style="position: absolute; top: 0; left: 0; width: 100%; height: 0.8mm; background: linear-gradient(90deg, #38bdf8 0%, #10b981 70%, #6366f1 100%);"></div>

      <!-- LEFT COLUMN: Product info (26mm) -->
      <div style="width: 25.5mm; display: flex; flex-direction: column; justify-content: space-between; z-index: 1;">
        
        <!-- Header -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 0.2mm;">
          <div style="display: flex; align-items: center; gap: 0.8mm;">
            ${logo}
            <span style="font-size: 1.8mm; font-weight: 800; letter-spacing: 0.2px; color: ${brandAccent}; line-height: 1;">PSL LABS</span>
          </div>
          <span style="font-size: 1.0mm; font-weight: 700; background: ${isLight ? '#f1f5f9' : '#1e293b'}; color: ${isLight ? '#334155' : '#94a3b8'}; padding: 0.2mm 0.7mm; border-radius: 0.5mm; border: 0.3px solid ${borderColor}; line-height: 1;">PY</span>
        </div>

        <!-- Product Name & Dose -->
        <div style="margin: 0.2mm 0;">
          <div style="display: flex; align-items: center; gap: 1.2mm; line-height: 1;">
            <span style="font-size: 3.0mm; font-weight: 900; letter-spacing: -0.2px; color: ${textColor}; white-space: nowrap;">GHK-Cu</span>
            <span style="font-size: 1.7mm; font-weight: 800; background: #0284c7; color: #ffffff; padding: 0.2mm 1mm; border-radius: 0.5mm; line-height: 1; white-space: nowrap;">50 MG</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.6mm; margin-top: 0.4mm;">
            <span style="font-size: 1.05mm; font-weight: 700; color: #38bdf8; text-transform: uppercase; white-space: nowrap;">COPPER TRIPEPTIDE-1</span>
            <span style="font-size: 0.85mm; font-weight: 700; background: rgba(16, 185, 129, 0.15); color: #10b981; border: 0.3px solid rgba(16, 185, 129, 0.4); padding: 0.1mm 0.4mm; border-radius: 0.4mm; white-space: nowrap;">>99.2%</span>
          </div>
        </div>

        <!-- Footer -->
        <div style="border-top: 0.3px solid ${borderColor}; padding-top: 0.3mm; display: flex; justify-content: space-between; font-size: 0.9mm; color: ${subTextColor}; font-weight: 600; line-height: 1;">
          <span>LOT: <strong style="color: ${brandAccent};">GHK50-2026-01</strong></span>
          <span>EXP: 11/2028</span>
        </div>

      </div>

      <!-- RIGHT COLUMN: QR Code (11.5mm) -->
      <div style="width: 11.5mm; margin-left: auto; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 1;">
        <div style="
          background: #ffffff;
          padding: 0.4mm;
          border-radius: 0.8mm;
          box-shadow: 0 1px 2px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          box-sizing: border-box;
          border: 0.4px solid #cbd5e1;
        ">
          <div style="font-size: 0.7mm; font-weight: 800; color: #0284c7; letter-spacing: 0.1px; text-transform: uppercase; line-height: 1; margin-bottom: 0.15mm;">
            VERIFICAR
          </div>
          <img src="${qrDataUrl}" style="width: 10.2mm; height: 10.2mm; display: block; image-rendering: pixelated;" alt="QR Code" />
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 0.85mm; font-weight: 800; color: #0f172a; margin-top: 0.25mm; letter-spacing: 0.1px; line-height: 1;">
            ${code}
          </div>
        </div>
      </div>

    </div>
  `;
}

async function run() {
  console.log("🚀 Iniciando geração do Gabarito e Amostra 40x20mm (Padrão Oficial Niimbot B1)...");

  const defaultCode = "GHK50-EO0HH";
  const verifyUrl = `https://psl-labs-verification.vercel.app/v/${defaultCode}`;

  const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
    margin: 1,
    width: 300,
    errorCorrectionLevel: 'M',
    color: { dark: '#000000', light: '#ffffff' }
  });

  // Pre-generate codes
  const sheetCodes = [];
  for (let i = 1; i <= 40; i++) {
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

  const sheetQrs = [];
  for (const c of sheetCodes) {
    const url = `https://psl-labs-verification.vercel.app/v/${c}`;
    const qr = await QRCode.toDataURL(url, {
      margin: 1,
      width: 250,
      errorCorrectionLevel: 'M',
      color: { dark: '#000000', light: '#ffffff' }
    });
    sheetQrs.push(qr);
  }

  // 1. Amostra Visual
  const sampleHtmlPath = path.join(rootDir, 'amostra_etiqueta_40x20mm_closeup.html');
  const samplePngPath = path.join(artifactsDir, 'amostra_etiqueta_40x20mm_ghk_cu.png');

  const sampleHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Amostra Oficial Niimbot B1 - 40x20mm</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', system-ui, sans-serif;
      background: #090d16;
      color: #f8fafc;
      padding: 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }
    .container { max-width: 950px; width: 100%; }
    .header { text-align: center; margin-bottom: 25px; }
    .badge-pill {
      display: inline-block;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.35);
      color: #10b981;
      font-size: 13px;
      font-weight: 700;
      padding: 6px 16px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 10px;
    }
    h1 { font-size: 28px; font-weight: 900; color: #ffffff; margin-bottom: 6px; }
    p.subtitle { font-size: 14px; color: #94a3b8; }

    .comparison-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 25px;
      margin-bottom: 30px;
    }
    .card {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 14px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
    }
    .card-title {
      font-size: 15px;
      font-weight: 700;
      margin-bottom: 4px;
      color: #f1f5f9;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .card-tag {
      font-size: 11px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 5px;
      text-transform: uppercase;
    }
    .tag-dark { background: #1e293b; color: #38bdf8; border: 1px solid #334155; }
    .tag-light { background: #10b981; color: #ffffff; }

    .zoom-stage {
      margin: 15px 0;
      height: 200px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at center, rgba(30, 41, 59, 0.5) 0%, transparent 70%);
      border-radius: 10px;
    }
    .zoom-inner {
      transform: scale(2.3);
      transform-origin: center center;
      box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.5);
      border-radius: 1.5mm;
    }

    .dimension-bar-w {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      margin-top: 10px;
      padding-top: 8px;
      border-top: 1px dashed #334155;
      font-size: 13px;
      font-weight: 700;
      color: #10b981;
    }

    .spec-table {
      width: 100%;
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 20px;
    }
    .spec-row {
      display: grid;
      grid-template-columns: 200px 1fr;
      padding: 12px 18px;
      border-bottom: 1px solid #1e293b;
      font-size: 13.5px;
    }
    .spec-row:last-child { border-bottom: none; }
    .spec-label { font-weight: 600; color: #94a3b8; }
    .spec-val { font-weight: 600; color: #f1f5f9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge-pill">Tamanho Oficial Mais Vendido da Niimbot B1</div>
      <h1>GHK-Cu 50 MG · Etiqueta 40 × 20 MM</h1>
      <p class="subtitle">Disponível em qualquer papelaria online com rolos prontos de 320 etiquetas</p>
    </div>

    <div class="comparison-grid">
      <!-- Dark Biotech -->
      <div class="card">
        <div class="card-title">
          <span>Dark Biotech</span>
          <span class="card-tag tag-dark">Para Jato/Laser</span>
        </div>
        <p style="font-size: 12px; color: #64748b;">Fundo escuro acetinado com gradiente neon</p>
        <div class="zoom-stage">
          <div class="zoom-inner">
            ${generateLabel40x20Html(defaultCode, qrDataUrl, false)}
          </div>
        </div>
        <div class="dimension-bar-w">
          <span>↔ Largura: 40 mm (151 px)</span>
          <span>↕ Altura: 20 mm (76 px)</span>
        </div>
      </div>

      <!-- White Biotech / Niimbot B1 Ready -->
      <div class="card">
        <div class="card-title">
          <span>Niimbot B1 Oficial (Térmica)</span>
          <span class="card-tag tag-light">Rolo Disponível</span>
        </div>
        <p style="font-size: 12px; color: #64748b;">Fundo branco ou transparente (Rolo oficial 40x20mm)</p>
        <div class="zoom-stage">
          <div class="zoom-inner">
            ${generateLabel40x20Html(defaultCode, qrDataUrl, true)}
          </div>
        </div>
        <div class="dimension-bar-w">
          <span>↔ Largura: 40 mm (151 px)</span>
          <span>↕ Altura: 20 mm (76 px)</span>
        </div>
      </div>
    </div>

    <div class="spec-table">
      <div class="spec-row">
        <div class="spec-label">Dimensões Exatas</div>
        <div class="spec-val"><strong style="color: #10b981;">40,0 mm de largura × 20,0 mm de altura</strong> (Mantém os 20 mm que ficaram excelentes no frasco)</div>
      </div>
      <div class="spec-row">
        <div class="spec-label">Disponibilidade no Mercado</div>
        <div class="spec-val">Pesquise por: <strong style="color: #38bdf8;">"Etiqueta Niimbot 40x20 B1"</strong> no Mercado Livre ou Shopee. Disponível em branco e transparente (320 etiquetas/rolo).</div>
      </div>
      <div class="spec-row">
        <div class="spec-label">Encaixe no Frasco</div>
        <div class="spec-val">Abraça o corpo de 3ml (circunferência de ~50mm) deixando uma <strong>janela traseira de 10mm</strong> para ver o nível do líquido/liofilizado.</div>
      </div>
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync(sampleHtmlPath, sampleHtml, 'utf8');

  // 2. Gabarito Folha A4 com 40 etiquetas (4 colunas x 10 linhas)
  const sheetHtmlPath = path.join(rootDir, 'etiquetas_ghk_cu_40x20mm_a4.html');
  const sheetPdfBrainPath = path.join(artifactsDir, 'etiquetas_ghk_cu_40x20mm_a4.pdf');
  const sheetPdfLocalPath = path.join(rootDir, 'etiquetas_ghk_cu_40x20mm_a4.pdf');
  const sheetPngPath = path.join(artifactsDir, 'preview_folha_etiquetas_40x20mm_a4.png');

  // 4 columns x 10 rows:
  // Width: 4 * 40 = 160mm. Gaps: 3 * 6mm = 18mm. Total = 178mm. Margins left/right: (210-178)/2 = 16mm.
  // Height: 10 * 20 = 200mm. Gaps: 9 * 5mm = 45mm. Total = 245mm. Margins top: 24mm, bottom: 28mm.

  let labelsGridHtml = '';
  for (let r = 0; r < 10; r++) {
    const isLightRow = r >= 5;
    for (let c = 0; c < 4; c++) {
      const idx = r * 4 + c;
      const code = sheetCodes[idx];
      const qr = sheetQrs[idx];
      const x = 16 + c * (40 + 6);
      const y = 24 + r * (20 + 5);

      const cropMarks = `
        <div style="position: absolute; left: ${x - 2.5}mm; top: ${y - 2.5}mm; width: 2.5mm; height: 2.5mm; border-right: 0.2mm solid #94a3b8; border-bottom: 0.2mm solid #94a3b8;"></div>
        <div style="position: absolute; left: ${x + 40}mm; top: ${y - 2.5}mm; width: 2.5mm; height: 2.5mm; border-left: 0.2mm solid #94a3b8; border-bottom: 0.2mm solid #94a3b8;"></div>
        <div style="position: absolute; left: ${x - 2.5}mm; top: ${y + 20}mm; width: 2.5mm; height: 2.5mm; border-right: 0.2mm solid #94a3b8; border-top: 0.2mm solid #94a3b8;"></div>
        <div style="position: absolute; left: ${x + 40}mm; top: ${y + 20}mm; width: 2.5mm; height: 2.5mm; border-left: 0.2mm solid #94a3b8; border-top: 0.2mm solid #94a3b8;"></div>
      `;

      labelsGridHtml += `
        ${cropMarks}
        <div style="position: absolute; left: ${x}mm; top: ${y}mm;">
          ${generateLabel40x20Html(code, qr, isLightRow)}
        </div>
      `;
    }
  }

  const sheetHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Gabarito Folha A4 - 40 Etiquetas 40x20mm - GHK-Cu 50mg</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@700;800&display=swap');
    @page { size: A4 portrait; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body {
      width: 210mm;
      min-height: 297mm;
      max-height: 297mm;
      margin: 0;
      padding: 0;
      background: #ffffff;
      font-family: 'Inter', system-ui, sans-serif;
      position: relative;
      overflow: hidden;
    }
    .sheet-header {
      position: absolute;
      top: 6mm;
      left: 16mm;
      right: 16mm;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-bottom: 0.4mm solid #0f172a;
      padding-bottom: 1.5mm;
    }
    .sheet-title { font-size: 3.2mm; font-weight: 900; color: #0f172a; letter-spacing: 0.2px; }
    .sheet-subtitle { font-size: 2.0mm; font-weight: 600; color: #475569; }
    .sheet-badge { background: #10b981; color: #ffffff; font-size: 1.9mm; font-weight: 800; padding: 0.8mm 2.2mm; border-radius: 1mm; text-transform: uppercase; }
    .section-divider {
      position: absolute;
      left: 16mm;
      right: 16mm;
      top: 147mm;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 3mm;
      font-size: 1.8mm;
      font-weight: 800;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .section-divider::before, .section-divider::after { content: ""; flex: 1; height: 0.3mm; background: #cbd5e1; }
    .sheet-footer {
      position: absolute;
      bottom: 5mm;
      left: 16mm;
      right: 16mm;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 0.3mm solid #e2e8f0;
      padding-top: 1.5mm;
      font-size: 1.8mm;
      color: #64748b;
    }
    .cal-ruler { display: flex; flex-direction: column; align-items: center; }
    .ruler-bar {
      width: 40mm;
      height: 2.2mm;
      border: 0.2mm solid #0f172a;
      border-top: none;
      position: relative;
      background: repeating-linear-gradient(90deg, #0f172a, #0f172a 0.2mm, transparent 0.2mm, transparent 5mm);
    }
    .ruler-text { font-size: 1.5mm; font-weight: 700; color: #0f172a; margin-top: 0.5mm; }
    .reg-mark { position: absolute; width: 6mm; height: 6mm; }
  </style>
</head>
<body>
  <div class="sheet-header">
    <div>
      <div class="sheet-title">PSL LABS · FOLHA DE TESTE A4 (ESCALA 1:1 - TAMANHO REAL)</div>
      <div class="sheet-subtitle">ETIQUETAS 40 × 20 MM · GHK-Cu 50 MG · 40 UNIDADES (PADRÃO OFICIAL NIIMBOT B1)</div>
    </div>
    <div class="sheet-badge">PADRÃO NIIMBOT B1: 40 × 20 MM</div>
  </div>

  <div class="reg-mark" style="top: 3mm; left: 3mm;">
    <svg width="22" height="22" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="none" stroke="#0f172a" stroke-width="0.8"/><line x1="12" y1="1" x2="12" y2="23" stroke="#0f172a" stroke-width="0.8"/><line x1="1" y1="12" x2="23" y2="12" stroke="#0f172a" stroke-width="0.8"/></svg>
  </div>
  <div class="reg-mark" style="top: 3mm; right: 3mm;">
    <svg width="22" height="22" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="none" stroke="#0f172a" stroke-width="0.8"/><line x1="12" y1="1" x2="12" y2="23" stroke="#0f172a" stroke-width="0.8"/><line x1="12" y1="12" x2="23" y2="12" stroke="#0f172a" stroke-width="0.8"/></svg>
  </div>

  <div class="section-divider">
    <span>Linhas 1 a 5: Dark Biotech &nbsp; | &nbsp; Linhas 6 a 10: White Biotech / Niimbot</span>
  </div>

  ${labelsGridHtml}

  <div class="sheet-footer">
    <div>
      <strong>Instruções de Teste:</strong> Imprimir em Escala 100% · Papel A4 Comum ou Adesivo · Recorte nas cantoneiras
    </div>
    <div class="cal-ruler">
      <div class="ruler-bar"></div>
      <div class="ruler-text">RÉGUA DE CONFERÊNCIA: EXATOS 40 MM</div>
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync(sheetHtmlPath, sheetHtml, 'utf8');

  // Screenshots and PDF
  console.log("📸 Gerando screenshot da amostra visual 40x20mm...");
  await runEdgeCommand([
    '--headless',
    '--disable-gpu',
    '--screenshot=' + samplePngPath,
    '--window-size=1080,950',
    '--hide-scrollbars',
    sampleHtmlPath
  ]);
  console.log(`✓ Screenshot da amostra salvo em: ${samplePngPath}`);

  console.log("📸 Gerando preview da folha A4 completa 40x20mm...");
  await runEdgeCommand([
    '--headless',
    '--disable-gpu',
    '--screenshot=' + sheetPngPath,
    '--window-size=1200,1697',
    '--hide-scrollbars',
    sheetHtmlPath
  ]);
  console.log(`✓ Preview da folha A4 salvo em: ${sheetPngPath}`);

  console.log("📄 Compilando PDF Vetorial 1:1 de 40x20mm...");
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
