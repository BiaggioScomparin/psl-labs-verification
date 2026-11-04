import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import QRCode from 'qrcode';
import { execFile } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const artifactDir = path.join('C:', 'Users', 'biagg', '.gemini', 'antigravity', 'brain', 'eecd8f48-bc30-44c6-9d0f-0a791a01c2f5');
const outputHtmlPath = path.join(rootDir, 'caixa_ghk_cu_impressao_a4.html');
const outputPdfPath = path.join(artifactDir, 'caixa_ghk_cu_50mg_impressao_a4.pdf');
const outputProjectPdfPath = path.join(rootDir, 'caixa_ghk_cu_50mg_impressao_a4.pdf');

async function main() {
  console.log("⚡ Gerando gabarito vetorial de impressão em PDF para a Caixa GHK-Cu 50 MG...");

  // Ultra-crisp QR Code (Pure black on white for camera verification)
  const qrDataUrl = await QRCode.toDataURL("https://psl-labs-verification.vercel.app/v/GHK50-PACK1", {
    margin: 1,
    width: 360,
    errorCorrectionLevel: 'M',
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });

  // EXACT MILLIMETER SPECIFICATIONS:
  // Sheet: A4 (210mm x 297mm)
  // Box closed: 32mm width x 32mm depth x 70mm height
  // Total dieline flat: 143mm width x 162mm height
  // Centered on page:
  // X offset = (210 - 143) / 2 = 33.5mm
  // Y offset = 64mm (leaves 64mm top, 71mm bottom for annotations & ruler)

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>PSL LABS - Gabarito de Impressão Caixa GHK-Cu 50 MG</title>
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
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      overflow: hidden;
      color: #0f172a;
    }

    .page {
      width: 210mm;
      height: 297mm;
      position: relative;
      background: #ffffff;
      padding: 10mm;
    }

    /* HEADER TÉCNICO */
    .tech-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 0.4mm solid #0f172a;
      padding-bottom: 2mm;
      margin-bottom: 4mm;
    }
    .brand-col h1 {
      font-size: 13pt;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.3px;
      line-height: 1.1;
    }
    .brand-col h1 span { color: #0284c7; }
    .brand-col p {
      font-size: 7pt;
      color: #64748b;
      font-weight: 700;
      letter-spacing: 0.5px;
      margin-top: 0.5mm;
    }

    .meta-col {
      text-align: right;
      font-size: 6.8pt;
      color: #334155;
      line-height: 1.35;
    }
    .meta-col strong { color: #000000; }
    .scale-badge {
      display: inline-block;
      background: #0f172a;
      color: #38bdf8;
      font-weight: 900;
      font-size: 6.8pt;
      padding: 0.8mm 2.2mm;
      border-radius: 1mm;
      margin-bottom: 0.8mm;
    }

    /* TARGET REGISTRATION MARKS (CRUZETAS DE REGISTRO) */
    .reg-mark {
      position: absolute;
      width: 6mm;
      height: 6mm;
    }
    .reg-mark svg { width: 100%; height: 100%; display: block; }
    .reg-top-left { top: 6mm; left: 6mm; }
    .reg-top-right { top: 6mm; right: 6mm; }
    .reg-bot-left { bottom: 6mm; left: 6mm; }
    .reg-bot-right { bottom: 6mm; right: 6mm; }

    /* SVG DIELINE WORKSPACE (1:1 MM SCALE) */
    .dieline-wrap {
      width: 190mm;
      height: 195mm;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    /* FOOTER TÉCNICO & RÉGUA DE PRECISÃO */
    .tech-footer {
      position: absolute;
      bottom: 8mm;
      left: 10mm;
      right: 10mm;
      border-top: 0.3mm solid #cbd5e1;
      padding-top: 2.5mm;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .specs-box {
      font-size: 6.5pt;
      color: #475569;
      line-height: 1.4;
      max-width: 95mm;
    }
    .specs-box strong { color: #0f172a; }

    .legend-box {
      font-size: 6.5pt;
      color: #334155;
      line-height: 1.4;
    }
    .legend-row {
      display: flex;
      align-items: center;
      gap: 1.5mm;
      margin-bottom: 0.6mm;
    }
    .line-cut-sample {
      width: 5mm;
      height: 0.4mm;
      background: #ef4444;
    }
    .line-fold-sample {
      width: 5mm;
      height: 0.4mm;
      border-top: 0.4mm dashed #0284c7;
    }

    /* CALIBRATION RULER (50 MM EXACT) */
    .ruler-box {
      text-align: right;
    }
    .ruler-label {
      font-size: 6pt;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 0.8mm;
    }
    .ruler-svg {
      width: 50mm;
      height: 4mm;
      display: block;
    }
  </style>
</head>
<body>

  <div class="page">
    
    <!-- REGISTRATION MARKS (4 CANTORES DA FOLHA) -->
    <div class="reg-mark reg-top-left">
      <svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="7" fill="none" stroke="#000" stroke-width="0.8"/><line x1="10" y1="0" x2="10" y2="20" stroke="#000" stroke-width="0.6"/><line x1="0" y1="10" x2="20" y2="10" stroke="#000" stroke-width="0.6"/></svg>
    </div>
    <div class="reg-mark reg-top-right">
      <svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="7" fill="none" stroke="#000" stroke-width="0.8"/><line x1="10" y1="0" x2="10" y2="20" stroke="#000" stroke-width="0.6"/><line x1="0" y1="10" x2="20" y2="10" stroke="#000" stroke-width="0.6"/></svg>
    </div>
    <div class="reg-mark reg-bot-left">
      <svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="7" fill="none" stroke="#000" stroke-width="0.8"/><line x1="10" y1="0" x2="10" y2="20" stroke="#000" stroke-width="0.6"/><line x1="0" y1="10" x2="20" y2="10" stroke="#000" stroke-width="0.6"/></svg>
    </div>
    <div class="reg-mark reg-bot-right">
      <svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="7" fill="none" stroke="#000" stroke-width="0.8"/><line x1="10" y1="0" x2="10" y2="20" stroke="#000" stroke-width="0.6"/><line x1="0" y1="10" x2="20" y2="10" stroke="#000" stroke-width="0.6"/></svg>
    </div>

    <!-- TECH HEADER -->
    <div class="tech-header">
      <div class="brand-col">
        <h1>PSL <span>LABS</span> · GABARITO DE CORTE & VINCO</h1>
        <p>EMBALAGEM PRIMÁRIA · CARTUCHO FARMACÊUTICO GHK-CU 50 MG</p>
      </div>

      <div class="meta-col">
        <div><span class="scale-badge">ESCALA 1:1 · TAMANHO REAL</span></div>
        <div>Dimensões Fechada: <strong>32 × 32 × 70 mm</strong></div>
        <div>Dimensões Planificada: <strong>143 × 162 mm</strong> · Frasco: <strong>10 ml</strong></div>
      </div>
    </div>

    <!-- MAIN DIELINE SVG WITH REAL MILLIMETER UNITS -->
    <div class="dieline-wrap">
      <svg width="190mm" height="195mm" viewBox="0 0 190 195" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Dark Biotech Background for the Box -->
          <linearGradient id="boxBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0b1329" />
            <stop offset="60%" stop-color="#080e1d" />
            <stop offset="100%" stop-color="#050811" />
          </linearGradient>

          <linearGradient id="waveLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#2563eb" />
            <stop offset="100%" stop-color="#38bdf8" />
          </linearGradient>
        </defs>

        <!-- COORDINATES SYSTEM (1 unit = 1 mm):
             Offset to center in 190mm x 195mm:
             X origin = 23.5mm
             Y origin = 16.5mm
             Body:
             - Glue flap: X = 23.5, width = 15, H = 70 (Y = 62.5 to 132.5)
             - Panel 1 (Lateral Esq): X = 38.5, width = 32, H = 70
             - Panel 2 (Frente): X = 70.5, width = 32, H = 70
             - Panel 3 (Lateral Dir): X = 102.5, width = 32, H = 70
             - Panel 4 (Verso): X = 134.5, width = 32, H = 70
             Total width = 143mm (X = 23.5 to 166.5)
             
             Top:
             - Top Dust Flap 1 (over Panel 1): Y = 46.5 to 62.5 (H = 16mm)
             - Top Lid (over Panel 2): Y = 30.5 to 62.5 (H = 32mm)
             - Top Tuck Tongue: Y = 16.5 to 30.5 (H = 14mm)
             - Top Dust Flap 2 (over Panel 3): Y = 46.5 to 62.5 (H = 16mm)

             Bottom:
             - Bottom Dust Flap 1 (under Panel 1): Y = 132.5 to 148.5 (H = 16mm)
             - Bottom Dust Flap 2 (under Panel 3): Y = 132.5 to 148.5 (H = 16mm)
             - Bottom Lid (under Panel 4): Y = 132.5 to 164.5 (H = 32mm)
             - Bottom Tuck Tongue: Y = 164.5 to 178.5 (H = 14mm)
        -->

        <!-- ================= CARTON PRINTED ARTWORK ================= -->

        <!-- 1. GLUE FLAP (ABA DE COLA) -->
        <path d="M38.5 62.5 L25.5 66.5 L25.5 128.5 L38.5 132.5 Z" fill="#080e1a" />
        <text x="31" y="98" transform="rotate(-90 31 98)" font-family="'Inter', sans-serif" font-size="2" font-weight="700" fill="#64748b" text-anchor="middle" letter-spacing="0.5">ABA DE COLAGEM (15mm)</text>

        <!-- 2. TOP TUCK LID & TONGUE (OVER PANEL 2) -->
        <!-- Tuck Tongue -->
        <path d="M70.5 22.5 C72 16.5, 76 16.5, 80 16.5 L93 16.5 C97 16.5, 101 16.5, 102.5 22.5 L102.5 30.5 L70.5 30.5 Z" fill="#070c18" />
        <!-- Top Lid -->
        <rect x="70.5" y="30.5" width="32" height="32" fill="url(#boxBg)" />
        <g transform="translate(86.5, 46.5)">
          <!-- Mini Shield -->
          <path d="M0 -7 L-4 -5 V-1 C-4 2 -1 4 0 5 C1 4 4 2 4 -1 V-5 Z" fill="#0b1329" stroke="#38bdf8" stroke-width="0.5" />
          <circle cx="0" cy="-0.5" r="1" fill="#10b981" />
          <text x="0" y="3.5" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="900" font-size="2.6" fill="#ffffff" letter-spacing="0.1">GHK-Cu</text>
          <text x="0" y="6.5" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="900" font-size="2.4" fill="#38bdf8">50 MG</text>
          <text x="0" y="9.5" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="800" font-size="1.5" fill="#10b981" letter-spacing="0.2">✓ LACRE ORIGINAL</text>
        </g>

        <!-- Top Dust Flap 1 (over Panel 1) -->
        <path d="M38.5 62.5 L38.5 48.5 C40 46.5, 48 46.5, 50 48.5 L50 62.5 Z" fill="#070c16" />
        <!-- Top Dust Flap 2 (over Panel 3) -->
        <path d="M102.5 62.5 L102.5 48.5 C104 46.5, 112 46.5, 114 48.5 L114 62.5 Z" fill="#070c16" />

        <!-- 3. BOTTOM TUCK LID & TONGUE (UNDER PANEL 4) -->
        <rect x="134.5" y="132.5" width="32" height="32" fill="url(#boxBg)" />
        <!-- Bottom Tongue -->
        <path d="M134.5 164.5 L134.5 172.5 C136 178.5, 140 178.5, 144 178.5 L157 178.5 C161 178.5, 165 178.5, 166.5 172.5 L166.5 164.5 Z" fill="#070c18" />
        <g transform="translate(150.5, 148.5)">
          <text x="0" y="-3" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="800" font-size="2.2" fill="#94a3b8">PSL LABS S.A.</text>
          <text x="0" y="1" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="600" font-size="1.8" fill="#64748b">Conservar a 2°C - 8°C</text>
          <text x="0" y="5" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="800" font-size="1.8" fill="#38bdf8">INDUSTRIA PARAGUAYA 🇵🇾</text>
        </g>

        <!-- Bottom Dust Flap 1 (under Panel 1) -->
        <path d="M38.5 132.5 L38.5 146.5 C40 148.5, 48 148.5, 50 146.5 L50 132.5 Z" fill="#070c16" />
        <!-- Bottom Dust Flap 2 (under Panel 3) -->
        <path d="M102.5 132.5 L102.5 146.5 C104 148.5, 112 148.5, 114 146.5 L114 132.5 Z" fill="#070c16" />

        <!-- 4. MAIN 4 BODY PANELS (X = 38.5 to 166.5, Y = 62.5 to 132.5) -->
        <rect x="38.5" y="62.5" width="128" height="70" fill="url(#boxBg)" />

        <!-- Continuous Flowing Cyan/Royal Wave -->
        <path d="M38.5 118 C50 115, 60 110, 70.5 113 C82 116, 92 124, 102.5 120 C114 116, 124 114, 134.5 118 C145 122, 156 125, 166.5 120 L166.5 132.5 L38.5 132.5 Z" 
              fill="url(#waveLine)" fill-opacity="0.18" />
        <path d="M38.5 118 C50 115, 60 110, 70.5 113 C82 116, 92 124, 102.5 120 C114 116, 124 114, 134.5 118 C145 122, 156 125, 166.5 120" 
              fill="none" stroke="url(#waveLine)" stroke-width="0.8" />


        <!-- === PAINEL 1: LATERAL ESQUERDA (32 x 70 mm) === -->
        <g transform="translate(41.5, 66)">
          <text x="0" y="3.5" font-family="'Inter', sans-serif" font-weight="900" font-size="2.4" fill="#38bdf8" letter-spacing="0.2">COMPOSICIÓN</text>
          <text x="0" y="7" font-family="'Inter', sans-serif" font-weight="600" font-size="1.9" fill="#e2e8f0">Cada vial contiene:</text>
          <text x="0" y="10" font-family="'Inter', sans-serif" font-weight="700" font-size="1.9" fill="#ffffff">• GHK-Cu Tripeptide-1: <tspan fill="#38bdf8">50 mg</tspan></text>
          <text x="0" y="13" font-family="'Inter', sans-serif" font-weight="500" font-size="1.7" fill="#94a3b8">• Pureza: &gt; 99.2% (HPLC)</text>
          <text x="0" y="16" font-family="'Inter', sans-serif" font-weight="500" font-size="1.7" fill="#94a3b8">• Polvo Liofilizado Estéril</text>

          <line x1="0" y1="19.5" x2="26" y2="19.5" stroke="#1e293b" stroke-width="0.3" />
          <text x="0" y="23.5" font-family="'Inter', sans-serif" font-weight="900" font-size="2.4" fill="#38bdf8" letter-spacing="0.2">RECONSTITUCIÓN</text>
          <text x="0" y="27" font-family="'Inter', sans-serif" font-weight="500" font-size="1.7" fill="#cbd5e1">Reconstituir lentamente con agua</text>
          <text x="0" y="29.5" font-family="'Inter', sans-serif" font-weight="500" font-size="1.7" fill="#cbd5e1">bacteriostática o estéril.</text>
          <text x="0" y="32" font-family="'Inter', sans-serif" font-weight="700" font-size="1.7" fill="#f59e0b">No agitar vigorosamente.</text>

          <line x1="0" y1="35.5" x2="26" y2="35.5" stroke="#1e293b" stroke-width="0.3" />
          <text x="0" y="39.5" font-family="'Inter', sans-serif" font-weight="900" font-size="2.4" fill="#38bdf8" letter-spacing="0.2">CONSERVACIÓN</text>
          <text x="0" y="43" font-family="'Inter', sans-serif" font-weight="600" font-size="1.8" fill="#e2e8f0">• Liofilizado: 2°C a 8°C</text>
          <text x="0" y="45.5" font-family="'Inter', sans-serif" font-weight="500" font-size="1.7" fill="#94a3b8">• Proteger de la luz directa</text>
          <text x="0" y="48" font-family="'Inter', sans-serif" font-weight="500" font-size="1.7" fill="#94a3b8">• Reconstituido: usar en 30 días</text>

          <!-- Temp badge -->
          <g transform="translate(19, 51)">
            <circle cx="3.5" cy="3.5" r="3.5" fill="rgba(56,189,248,0.15)" stroke="#38bdf8" stroke-width="0.3" />
            <text x="3.5" y="4.5" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="900" font-size="2" fill="#38bdf8">2-8°C</text>
          </g>
        </g>


        <!-- === PAINEL 2: FRENTE PRINCIPAL (32 x 70 mm) === -->
        <g transform="translate(73.5, 66)">
          <!-- Top Origin Badge -->
          <rect x="0" y="0" width="10" height="3.5" rx="0.8" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" stroke-width="0.3" />
          <text x="5" y="2.5" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="800" font-size="1.8" fill="#34d399">🇵🇾 PY</text>

          <text x="26" y="2.5" text-anchor="end" font-family="'Inter', sans-serif" font-weight="800" font-size="1.7" fill="#38bdf8" letter-spacing="0.2">GRADE A+</text>

          <!-- PSL LABS LOGO & HEXASHIELD -->
          <g transform="translate(0, 7)">
            <!-- HexaShield Vector Logo -->
            <path d="M3.2 0.5 L0.8 1.8 V3.8 C0.8 5.2 1.8 6.2 3.2 6.6 C4.6 6.2 5.6 5.2 5.6 3.8 V1.8 Z" fill="#0b1329" stroke="#38bdf8" stroke-width="0.4"/>
            <line x1="3.2" y1="1.3" x2="3.2" y2="5.5" stroke="#38bdf8" stroke-width="0.4"/>
            <circle cx="3.2" cy="3.4" r="0.8" fill="#10b981" stroke="#ffffff" stroke-width="0.2"/>

            <text x="7.2" y="3.5" font-family="'Inter', sans-serif" font-weight="900" font-size="3.6" letter-spacing="-0.1">
              <tspan fill="#ffffff">PSL </tspan>
              <tspan fill="#38bdf8">LABS</tspan>
            </text>
            <text x="7.2" y="5.8" font-family="'Inter', sans-serif" font-weight="700" font-size="1.4" fill="#94a3b8" letter-spacing="0.3">
              PARAGUAY SCIENTIFIC
            </text>
          </g>

          <!-- PRODUCT TITLE & DOSAGE -->
          <g transform="translate(0, 21)">
            <text x="0" y="4.5" font-family="'Inter', sans-serif" font-weight="900" font-size="5.2" fill="#ffffff" letter-spacing="-0.1">GHK-Cu</text>
            <text x="0" y="8" font-family="'Inter', sans-serif" font-weight="800" font-size="1.8" fill="#38bdf8" letter-spacing="0.15">COPPER TRIPEPTIDE-1</text>

            <!-- Dosage Pill -->
            <rect x="0" y="10.5" width="26" height="7.2" rx="1.5" fill="linear-gradient(90deg, #1e3a8a, #0284c7)" />
            <text x="13" y="15.5" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="900" font-size="3.8" fill="#ffffff" letter-spacing="0.2">50 MG</text>

            <text x="13" y="21.5" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="700" font-size="1.6" fill="#94a3b8">POLVO LIOFILIZADO ESTÉRIL</text>
            <text x="13" y="24" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="600" font-size="1.4" fill="#64748b">1 Vial de Uso Científico / 10 ml</text>
          </g>

          <!-- Bottom Security Check -->
          <g transform="translate(0, 56.5)">
            <rect width="26" height="4.5" rx="1.2" fill="#091426" stroke="#10b981" stroke-width="0.3" />
            <circle cx="3" cy="2.25" r="1.0" fill="#10b981" />
            <text x="3" y="2.8" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="900" font-size="1.4" fill="#ffffff">✓</text>
            <text x="5.2" y="3.0" font-family="'Inter', sans-serif" font-weight="800" font-size="1.35" fill="#34d399" letter-spacing="0.1">AUTENTICIDAD VERIFICADA</text>
          </g>
        </g>


        <!-- === PAINEL 3: LATERAL DIREITA (32 x 70 mm) === -->
        <g transform="translate(105.5, 66)">
          <text x="0" y="3.5" font-family="'Inter', sans-serif" font-weight="900" font-size="2.4" fill="#38bdf8" letter-spacing="0.2">FABRICACIÓN</text>
          <text x="0" y="7" font-family="'Inter', sans-serif" font-weight="700" font-size="1.9" fill="#ffffff">PSL LABS S.A.</text>
          <text x="0" y="9.5" font-family="'Inter', sans-serif" font-weight="500" font-size="1.7" fill="#cbd5e1">División Biotecnológica</text>
          <text x="0" y="12" font-family="'Inter', sans-serif" font-weight="500" font-size="1.7" fill="#94a3b8">Asunción, Paraguay</text>
          <text x="0" y="14.5" font-family="'Inter', sans-serif" font-weight="600" font-size="1.7" fill="#38bdf8">www.psl-labs.com.py</text>

          <line x1="0" y1="18.5" x2="26" y2="18.5" stroke="#1e293b" stroke-width="0.3" />
          <text x="0" y="22.5" font-family="'Inter', sans-serif" font-weight="900" font-size="2.4" fill="#38bdf8" letter-spacing="0.2">ESTÁNDARES</text>
          <g transform="translate(0, 24.5)">
            <rect width="12" height="4.2" rx="0.8" fill="#0f172a" stroke="#334155" stroke-width="0.3" />
            <text x="6" y="3" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="800" font-size="1.6" fill="#e2e8f0">GMP ISO</text>

            <rect x="14" y="0" width="12" height="4.2" rx="0.8" fill="#0f172a" stroke="#334155" stroke-width="0.3" />
            <text x="20" y="3" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="800" font-size="1.6" fill="#e2e8f0">HPLC &gt;99%</text>
          </g>

          <line x1="0" y1="33" x2="26" y2="33" stroke="#1e293b" stroke-width="0.3" />
          <text x="0" y="37" font-family="'Inter', sans-serif" font-weight="900" font-size="2.2" fill="#f59e0b" letter-spacing="0.1">ADVERTENCIA</text>
          <text x="0" y="40.5" font-family="'Inter', sans-serif" font-weight="500" font-size="1.6" fill="#94a3b8">Sustancia para uso exclusivo</text>
          <text x="0" y="42.8" font-family="'Inter', sans-serif" font-weight="500" font-size="1.6" fill="#94a3b8">en investigación y laboratorio.</text>
          <text x="0" y="45.1" font-family="'Inter', sans-serif" font-weight="600" font-size="1.6" fill="#ef4444">Mantener fuera del alcance</text>
          <text x="0" y="47.4" font-family="'Inter', sans-serif" font-weight="600" font-size="1.6" fill="#ef4444">de los niños.</text>

          <!-- Origin Certified -->
          <g transform="translate(0, 52)">
            <rect width="26" height="8" rx="1.2" fill="#08101d" stroke="#1e293b" stroke-width="0.3" />
            <text x="2.5" y="3.5" font-family="'Inter', sans-serif" font-weight="800" font-size="1.7" fill="#ffffff">ORIGEN CERTIFICADO</text>
            <text x="2.5" y="6" font-family="'Inter', sans-serif" font-weight="600" font-size="1.5" fill="#10b981">República del Paraguay 🇵🇾</text>
          </g>
        </g>


        <!-- === PAINEL 4: VERSO COM QR CODE (32 x 70 mm) === -->
        <g transform="translate(137.5, 66)">
          <text x="13" y="3.5" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="900" font-size="2.0" fill="#38bdf8" letter-spacing="0.1">AUTENTICIDAD DIGITAL</text>
          <text x="13" y="6" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="500" font-size="1.5" fill="#94a3b8">Escanee para verificar lote</text>

          <!-- Box Branco do QR Code de Alta Leitura -->
          <g transform="translate(4, 7.5)">
            <rect width="18" height="18" rx="1.5" fill="#ffffff" />
            <image href="${qrDataUrl}" x="1" y="1" width="16" height="16" />
          </g>

          <text x="13" y="28" text-anchor="middle" font-family="'Courier New', monospace" font-weight="900" font-size="1.9" fill="#38bdf8" letter-spacing="0.1">GHK50-VERIFIED</text>
          <text x="13" y="30.5" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="700" font-size="1.3" fill="#10b981">psl-labs-verification.vercel.app</text>

          <!-- Tabela de Lote / Fabricação / Validade -->
          <g transform="translate(0, 33.5)">
            <rect width="26" height="14.5" rx="1.2" fill="#080e1a" stroke="#1e293b" stroke-width="0.3" />

            <text x="2" y="4" font-family="'Inter', sans-serif" font-weight="700" font-size="1.6" fill="#94a3b8">LOTE:</text>
            <text x="24" y="4" text-anchor="end" font-family="'Courier New', monospace" font-weight="900" font-size="1.8" fill="#ffffff">LOT-2026-01</text>
            <line x1="2" y1="5.2" x2="24" y2="5.2" stroke="#1e293b" stroke-width="0.2" />

            <text x="2" y="8.5" font-family="'Inter', sans-serif" font-weight="700" font-size="1.6" fill="#94a3b8">FAB:</text>
            <text x="24" y="8.5" text-anchor="end" font-family="'Inter', sans-serif" font-weight="800" font-size="1.7" fill="#ffffff">10/2026</text>
            <line x1="2" y1="9.7" x2="24" y2="9.7" stroke="#1e293b" stroke-width="0.2" />

            <text x="2" y="13" font-family="'Inter', sans-serif" font-weight="700" font-size="1.6" fill="#94a3b8">VAL:</text>
            <text x="24" y="13" text-anchor="end" font-family="'Inter', sans-serif" font-weight="800" font-size="1.7" fill="#38bdf8">10/2028</text>
          </g>

          <!-- Código de barras EAN-13 -->
          <g transform="translate(2, 51.5)">
            <rect x="0" y="0" width="0.4" height="4.5" fill="#cbd5e1" />
            <rect x="0.8" y="0" width="0.6" height="4.5" fill="#cbd5e1" />
            <rect x="1.8" y="0" width="0.3" height="4.5" fill="#cbd5e1" />
            <rect x="2.5" y="0" width="0.8" height="4.5" fill="#cbd5e1" />
            <rect x="3.7" y="0" width="0.4" height="4.5" fill="#cbd5e1" />
            <rect x="4.5" y="0" width="0.6" height="4.5" fill="#cbd5e1" />
            <rect x="5.5" y="0" width="0.9" height="4.5" fill="#cbd5e1" />
            <rect x="6.8" y="0" width="0.4" height="4.5" fill="#cbd5e1" />
            <rect x="7.6" y="0" width="0.8" height="4.5" fill="#cbd5e1" />
            <rect x="8.8" y="0" width="0.4" height="4.5" fill="#cbd5e1" />
            <rect x="9.6" y="0" width="0.6" height="4.5" fill="#cbd5e1" />
            <rect x="10.6" y="0" width="0.8" height="4.5" fill="#cbd5e1" />
            <rect x="11.8" y="0" width="0.4" height="4.5" fill="#cbd5e1" />
            <rect x="12.6" y="0" width="0.6" height="4.5" fill="#cbd5e1" />
            <rect x="13.6" y="0" width="0.9" height="4.5" fill="#cbd5e1" />
            <rect x="14.9" y="0" width="0.4" height="4.5" fill="#cbd5e1" />
            <rect x="15.7" y="0" width="0.6" height="4.5" fill="#cbd5e1" />
            <rect x="16.7" y="0" width="0.8" height="4.5" fill="#cbd5e1" />
            <rect x="17.9" y="0" width="0.4" height="4.5" fill="#cbd5e1" />
            <rect x="18.7" y="0" width="0.6" height="4.5" fill="#cbd5e1" />
            <rect x="19.7" y="0" width="0.9" height="4.5" fill="#cbd5e1" />
            <rect x="21" y="0" width="0.4" height="4.5" fill="#cbd5e1" />
            <text x="11" y="6.8" text-anchor="middle" font-family="'Courier New', monospace" font-size="1.5" fill="#64748b" letter-spacing="0.3">7 840001 502601</text>
          </g>
        </g>


        <!-- ================= 5. DIELINE CUT & CREASE LINES (FACA GRÁFICA) ================= -->
        <!-- Red Solid Lines: OUTSIDE CUT (LINHA DE CORTE) -->
        <!-- Outer perimeter of the flat box -->
        <path d="
          M38.5 62.5 
          L25.5 66.5 L25.5 128.5 L38.5 132.5 
          L38.5 146.5 C40 148.5, 48 148.5, 50 146.5 L50 132.5 
          L102.5 132.5 
          L102.5 146.5 C104 148.5, 112 148.5, 114 146.5 L114 132.5 
          L134.5 132.5 
          L134.5 164.5 
          L134.5 172.5 C136 178.5, 140 178.5, 144 178.5 L157 178.5 C161 178.5, 165 178.5, 166.5 172.5 L166.5 164.5 
          L166.5 132.5 
          L166.5 62.5 
          L114 62.5 
          L114 48.5 C112 46.5, 104 46.5, 102.5 48.5 L102.5 62.5 
          L102.5 30.5 
          L102.5 22.5 C101 16.5, 97 16.5, 93 16.5 L80 16.5 C76 16.5, 72 16.5, 70.5 22.5 L70.5 30.5 
          L70.5 62.5 
          L50 62.5 
          L50 48.5 C48 46.5, 40 46.5, 38.5 48.5 L38.5 62.5 Z
        " fill="none" stroke="#ef4444" stroke-width="0.35" />

        <!-- Blue Dashed Lines: FOLD CREASES (VINCOS DE DOBRA) -->
        <!-- Vertical Creases between panels -->
        <line x1="38.5" y1="62.5" x2="38.5" y2="132.5" stroke="#0284c7" stroke-width="0.3" stroke-dasharray="1.2 0.8" />
        <line x1="70.5" y1="62.5" x2="70.5" y2="132.5" stroke="#0284c7" stroke-width="0.3" stroke-dasharray="1.2 0.8" />
        <line x1="102.5" y1="62.5" x2="102.5" y2="132.5" stroke="#0284c7" stroke-width="0.3" stroke-dasharray="1.2 0.8" />
        <line x1="134.5" y1="62.5" x2="134.5" y2="132.5" stroke="#0284c7" stroke-width="0.3" stroke-dasharray="1.2 0.8" />

        <!-- Horizontal Creases (Top & Bottom Lids) -->
        <line x1="38.5" y1="62.5" x2="166.5" y2="62.5" stroke="#0284c7" stroke-width="0.3" stroke-dasharray="1.2 0.8" />
        <line x1="38.5" y1="132.5" x2="166.5" y2="132.5" stroke="#0284c7" stroke-width="0.3" stroke-dasharray="1.2 0.8" />
        <line x1="70.5" y1="30.5" x2="102.5" y2="30.5" stroke="#0284c7" stroke-width="0.3" stroke-dasharray="1.2 0.8" />
        <line x1="134.5" y1="164.5" x2="166.5" y2="164.5" stroke="#0284c7" stroke-width="0.3" stroke-dasharray="1.2 0.8" />

        <!-- Dimension Indicators (Cotas Técnicas em mm) -->
        <text x="54.5" y="136" text-anchor="middle" font-family="'Inter', sans-serif" font-size="1.8" font-weight="800" fill="#0284c7">32 mm</text>
        <text x="86.5" y="136" text-anchor="middle" font-family="'Inter', sans-serif" font-size="1.8" font-weight="800" fill="#0284c7">32 mm</text>
        <text x="118.5" y="136" text-anchor="middle" font-family="'Inter', sans-serif" font-size="1.8" font-weight="800" fill="#0284c7">32 mm</text>
        <text x="150.5" y="136" text-anchor="middle" font-family="'Inter', sans-serif" font-size="1.8" font-weight="800" fill="#0284c7">32 mm</text>

        <text x="171" y="98" font-family="'Inter', sans-serif" font-size="2" font-weight="800" fill="#0284c7">70 mm Altura</text>
      </svg>
    </div>

    <!-- TECH FOOTER & CALIBRATION RULER -->
    <div class="tech-footer">
      <div class="specs-box">
        <strong>ESPECIFICAÇÕES DE PRODUÇÃO GRÁFICA:</strong><br>
        • <strong>Papel:</strong> Papel Cartão Triplex 300g/m² ou 350g/m² (Frente Branca / Verso Branco).<br>
        • <strong>Impressão:</strong> Offset 4 Cores (CMYK) ou Digital Alta Resolução.<br>
        • <strong>Acabamento:</strong> Laminação Fosca (Soft Touch / BOPP) + Verniz UV Localizado no Logo e Dosagem.<br>
        • <strong>Corte & Vinco:</strong> Seguir linha vermelha contínua (Corte) e azul tracejada (Vinco).
      </div>

      <div class="legend-box">
        <div class="legend-row">
          <div class="line-cut-sample"></div>
          <span><strong>Linha Vermelha:</strong> Faca de Corte Externo</span>
        </div>
        <div class="legend-row">
          <div class="line-fold-sample"></div>
          <span><strong>Linha Azul Tracejada:</strong> Vinco / Dobra</span>
        </div>
      </div>

      <!-- 50MM CALIBRATION RULER -->
      <div class="ruler-box">
        <div class="ruler-label">RÉGUA DE CONFERÊNCIA (EXATOS 50 MM)</div>
        <svg class="ruler-svg" viewBox="0 0 50 4" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="50" height="4" fill="#f8fafc" stroke="#0f172a" stroke-width="0.3" />
          <!-- Millimeter ticks -->
          ${(() => {
            let ticks = '';
            for (let i = 0; i <= 50; i++) {
              let h = 1.2;
              if (i % 10 === 0) h = 3.2;
              else if (i % 5 === 0) h = 2.2;
              ticks += `<line x1="${i}" y1="0" x2="${i}" y2="${h}" stroke="#0f172a" stroke-width="0.25" />`;
              if (i % 10 === 0 && i > 0) {
                ticks += `<text x="${i}" y="3.6" font-family="'Inter', sans-serif" font-size="1.2" font-weight="800" text-anchor="middle" fill="#0f172a">${i}</text>`;
              }
            }
            return ticks;
          })()}
        </svg>
      </div>
    </div>

  </div>

</body>
</html>`;

  fs.writeFileSync(outputHtmlPath, html, 'utf8');
  console.log(`✓ HTML salvo em: ${outputHtmlPath}`);

  if (fs.existsSync(edgePath)) {
    console.log("Compilando PDF vetorial de impressão 1:1 com Microsoft Edge...");
    const fileUri = `file:///${outputHtmlPath.replace(/\\/g, '/')}`;

    execFile(edgePath, [
      '--headless',
      '--disable-gpu',
      '--no-margins',
      `--print-to-pdf=${outputPdfPath}`,
      fileUri
    ], (err) => {
      if (err) {
        console.error("Erro ao gerar PDF:", err);
      } else {
        fs.copyFileSync(outputPdfPath, outputProjectPdfPath);
        console.log(`🎉 PDF oficial de impressão gerado com sucesso em:\n${outputPdfPath}`);

        // Generate Preview Screenshot of the A4 Sheet
        const outPngPath = path.join(artifactDir, 'preview_folha_impressao_caixa_a4.png');
        execFile(edgePath, [
          '--headless',
          '--disable-gpu',
          '--window-size=1200,1697',
          '--hide-scrollbars',
          `--screenshot=${outPngPath}`,
          fileUri
        ], (err2) => {
          if (!err2) {
            console.log(`✓ Preview PNG salvo em: ${outPngPath}`);
          }
        });
      }
    });
  }
}

main().catch(console.error);
