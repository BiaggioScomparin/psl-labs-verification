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
const outputHtmlPath = path.join(rootDir, 'caixa_ghk_cu_impressao_clara_a4.html');
const outputPdfPath = path.join(artifactDir, 'caixa_ghk_cu_50mg_impressao_clara_a4.pdf');
const outputProjectPdfPath = path.join(rootDir, 'caixa_ghk_cu_50mg_impressao_clara_a4.pdf');
const outputFlatPngPath = path.join(artifactDir, 'caixa_ghk_cu_50mg_faca_aberta_clara.png');
const outputSheetPngPath = path.join(artifactDir, 'preview_folha_impressao_caixa_clara_a4.png');

async function main() {
  console.log("⚡ Gerando Caixa GHK-Cu 50 MG em FUNDO CLARO com QR Code do Produto e Logo Ajustado...");

  // QR Code pointing DIRECTLY to the product page on the website!
  const productUrl = "https://psl-labs-verification.vercel.app/product/ghk-cu-50mg";
  const qrDataUrl = await QRCode.toDataURL(productUrl, {
    margin: 1,
    width: 400,
    errorCorrectionLevel: 'M',
    color: {
      dark: '#0f172a',
      light: '#ffffff'
    }
  });

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>PSL LABS - Gabarito de Impressão Caixa GHK-Cu 50 MG (Fundo Claro)</title>
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
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
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
      background: #0284c7;
      color: #ffffff;
      font-weight: 900;
      font-size: 6.8pt;
      padding: 0.8mm 2.2mm;
      border-radius: 1mm;
      margin-bottom: 0.8mm;
    }

    /* REGISTRATION MARKS */
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

    /* SVG DIELINE WORKSPACE */
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

    /* 50MM CALIBRATION RULER */
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
        <h1>PSL <span>LABS</span> · GABARITO DE IMPRESSÃO (FUNDO CLARO)</h1>
        <p>EMBALAGEM PRIMÁRIA · CARTUCHO FARMACÊUTICO GHK-CU 50 MG · WHITE BIOTECH</p>
      </div>

      <div class="meta-col">
        <div><span class="scale-badge">ESCALA 1:1 · TAMANHO REAL</span></div>
        <div>Dimensões Fechada: <strong>32 × 32 × 70 mm</strong></div>
        <div>Dimensões Planificada: <strong>143 × 162 mm</strong> · Frasco: <strong>10 ml</strong></div>
      </div>
    </div>

    <!-- MAIN DIELINE SVG (1:1 MM SCALE) -->
    <div class="dieline-wrap">
      <svg width="190mm" height="195mm" viewBox="0 0 190 195" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Gradient for clean wave ribbon -->
          <linearGradient id="waveRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#1e3a8a" />
            <stop offset="50%" stop-color="#0284c7" />
            <stop offset="100%" stop-color="#38bdf8" />
          </linearGradient>

          <linearGradient id="blueBadge" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#1e3a8a" />
            <stop offset="100%" stop-color="#0284c7" />
          </linearGradient>

          <linearGradient id="subtlePanel" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="100%" stop-color="#f8fafc" />
          </linearGradient>
        </defs>

        <!-- ================= CARTON PRINTED ARTWORK (FUNDO CLARO) ================= -->

        <!-- 1. GLUE FLAP (ABA DE COLA) -->
        <path d="M38.5 62.5 L25.5 66.5 L25.5 128.5 L38.5 132.5 Z" fill="#f1f5f9" />
        <text x="31" y="98" transform="rotate(-90 31 98)" font-family="'Inter', sans-serif" font-size="2" font-weight="700" fill="#94a3b8" text-anchor="middle" letter-spacing="0.5">ABA DE COLAGEM (15mm)</text>

        <!-- 2. TOP TUCK LID & TONGUE (OVER PANEL 2) -->
        <!-- Tuck Tongue -->
        <path d="M70.5 22.5 C72 16.5, 76 16.5, 80 16.5 L93 16.5 C97 16.5, 101 16.5, 102.5 22.5 L102.5 30.5 L70.5 30.5 Z" fill="#f8fafc" />
        <!-- Top Lid -->
        <rect x="70.5" y="30.5" width="32" height="32" fill="#ffffff" />
        <g transform="translate(86.5, 46.5)">
          <!-- HexaShield Symbol (Light Version) -->
          <g transform="translate(0, -6)">
            <path d="M0 -5 L-4 -3 V1 C-4 4 -1 6 0 7 C1 6 4 4 4 1 V-3 Z" fill="#f8fafc" stroke="#1e3a8a" stroke-width="0.5" />
            <line x1="0" y1="-3.5" x2="0" y2="4.5" stroke="#0284c7" stroke-width="0.4" />
            <line x1="-2.5" y1="-1" x2="2.5" y2="2" stroke="#0284c7" stroke-width="0.4" />
            <line x1="2.5" y1="-1" x2="-2.5" y2="2" stroke="#0284c7" stroke-width="0.4" />
            <circle cx="0" cy="0.5" r="1.1" fill="#059669" stroke="#ffffff" stroke-width="0.3" />
          </g>
          <text x="0" y="4.5" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="900" font-size="2.6" fill="#0f172a">PSL <tspan fill="#0284c7">LABS</tspan></text>
          <text x="0" y="7.5" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="900" font-size="2.4" fill="#1e3a8a">GHK-Cu 50 MG</text>
          <text x="0" y="10.5" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="800" font-size="1.5" fill="#059669" letter-spacing="0.2">✓ LACRE DE SEGURANÇA</text>
        </g>

        <!-- Top Dust Flap 1 (over Panel 1) -->
        <path d="M38.5 62.5 L38.5 48.5 C40 46.5, 48 46.5, 50 48.5 L50 62.5 Z" fill="#f8fafc" />
        <!-- Top Dust Flap 2 (over Panel 3) -->
        <path d="M102.5 62.5 L102.5 48.5 C104 46.5, 112 46.5, 114 48.5 L114 62.5 Z" fill="#f8fafc" />

        <!-- 3. BOTTOM TUCK LID & TONGUE (UNDER PANEL 4) -->
        <rect x="134.5" y="132.5" width="32" height="32" fill="#ffffff" />
        <!-- Bottom Tongue -->
        <path d="M134.5 164.5 L134.5 172.5 C136 178.5, 140 178.5, 144 178.5 L157 178.5 C161 178.5, 165 178.5, 166.5 172.5 L166.5 164.5 Z" fill="#f8fafc" />
        <g transform="translate(150.5, 148.5)">
          <text x="0" y="-3" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="900" font-size="2.3" fill="#0f172a">PSL <tspan fill="#0284c7">LABS S.A.</tspan></text>
          <text x="0" y="1" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="600" font-size="1.8" fill="#64748b">Conservar a 2°C - 8°C</text>
          <text x="0" y="5" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="800" font-size="1.8" fill="#15803d">INDUSTRIA PARAGUAYA 🇵🇾</text>
        </g>

        <!-- Bottom Dust Flap 1 (under Panel 1) -->
        <path d="M38.5 132.5 L38.5 146.5 C40 148.5, 48 148.5, 50 146.5 L50 132.5 Z" fill="#f8fafc" />
        <!-- Bottom Dust Flap 2 (under Panel 3) -->
        <path d="M102.5 132.5 L102.5 146.5 C104 148.5, 112 148.5, 114 146.5 L114 132.5 Z" fill="#f8fafc" />

        <!-- 4. MAIN 4 BODY PANELS (X = 38.5 to 166.5, Y = 62.5 to 132.5) -->
        <rect x="38.5" y="62.5" width="128" height="70" fill="url(#subtlePanel)" />

        <!-- Continuous Flowing Royal/Cyan Ribbon across bottom of all 4 panels -->
        <path d="M38.5 119 C50 116, 60 111, 70.5 114 C82 117, 92 125, 102.5 121 C114 117, 124 115, 134.5 119 C145 123, 156 126, 166.5 121 L166.5 132.5 L38.5 132.5 Z" 
              fill="url(#waveRibbon)" />
        <path d="M38.5 119 C50 116, 60 111, 70.5 114 C82 117, 92 125, 102.5 121 C114 117, 124 115, 134.5 119 C145 123, 156 126, 166.5 121" 
              fill="none" stroke="#38bdf8" stroke-width="0.5" />


        <!-- === PAINEL 1: LATERAL ESQUERDA (32 x 70 mm) === -->
        <g transform="translate(41.5, 65)">
          <text x="0" y="3.5" font-family="'Inter', sans-serif" font-weight="900" font-size="2.3" fill="#0f172a" letter-spacing="0.2">COMPOSICIÓN</text>
          <text x="0" y="6.8" font-family="'Inter', sans-serif" font-weight="600" font-size="1.8" fill="#334155">Cada vial contiene:</text>
          <text x="0" y="9.5" font-family="'Inter', sans-serif" font-weight="800" font-size="1.8" fill="#0f172a">• GHK-Cu Tripeptide-1: <tspan fill="#0284c7">50 mg</tspan></text>
          <text x="0" y="12.2" font-family="'Inter', sans-serif" font-weight="600" font-size="1.6" fill="#64748b">• Pureza: &gt; 99.2% (HPLC)</text>
          <text x="0" y="14.8" font-family="'Inter', sans-serif" font-weight="600" font-size="1.6" fill="#64748b">• Polvo Liofilizado Estéril</text>

          <line x1="0" y1="17.8" x2="26" y2="17.8" stroke="#e2e8f0" stroke-width="0.3" />
          <text x="0" y="21.5" font-family="'Inter', sans-serif" font-weight="900" font-size="2.3" fill="#0f172a" letter-spacing="0.2">RECONSTITUCIÓN</text>
          <text x="0" y="24.8" font-family="'Inter', sans-serif" font-weight="600" font-size="1.6" fill="#475569">Reconstituir con agua</text>
          <text x="0" y="27.2" font-family="'Inter', sans-serif" font-weight="600" font-size="1.6" fill="#475569">bacteriostática o estéril.</text>
          <text x="0" y="29.6" font-family="'Inter', sans-serif" font-weight="800" font-size="1.6" fill="#d97706">No agitar vigorosamente.</text>

          <line x1="0" y1="32.5" x2="26" y2="32.5" stroke="#e2e8f0" stroke-width="0.3" />
          <text x="0" y="36.2" font-family="'Inter', sans-serif" font-weight="900" font-size="2.3" fill="#0f172a" letter-spacing="0.2">CONSERVACIÓN</text>
          <text x="0" y="39.5" font-family="'Inter', sans-serif" font-weight="700" font-size="1.7" fill="#0f172a">• Liofilizado: 2°C a 8°C</text>
          <text x="0" y="42" font-family="'Inter', sans-serif" font-weight="600" font-size="1.6" fill="#64748b">• Proteger de la luz directa</text>
          <text x="0" y="44.5" font-family="'Inter', sans-serif" font-weight="600" font-size="1.6" fill="#64748b">• Reconstituido: usar en 30 días</text>

          <!-- Temp badge -->
          <g transform="translate(19, 46)">
            <circle cx="3.2" cy="3.2" r="3.2" fill="#f0f9ff" stroke="#0284c7" stroke-width="0.4" />
            <text x="3.2" y="4.1" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="900" font-size="1.8" fill="#0284c7">2-8°C</text>
          </g>
        </g>


        <!-- === PAINEL 2: FRENTE PRINCIPAL (AJUSTADO & FUNDO CLARO) === -->
        <g transform="translate(73.5, 66)">
          <!-- Top Origin Badge -->
          <rect x="0" y="0" width="10" height="3.5" rx="0.8" fill="#dcfce7" stroke="#16a34a" stroke-width="0.3" />
          <text x="5" y="2.5" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="800" font-size="1.8" fill="#15803d">🇵🇾 PY</text>

          <text x="26" y="2.5" text-anchor="end" font-family="'Inter', sans-serif" font-weight="800" font-size="1.7" fill="#0284c7" letter-spacing="0.2">GRADE A+</text>

          <!-- OFFICIAL HEXASHIELD LOGO (PERFECTLY ALIGNED & PROPORTIONED) -->
          <g transform="translate(0, 6.5)">
            <!-- Outer Shield -->
            <path d="M3.2 0.3 L0.6 1.7 V3.9 C0.6 5.4 1.7 6.6 3.2 7.0 C4.7 6.6 5.8 5.4 5.8 3.9 V1.7 Z" 
                  fill="#ffffff" stroke="#1e3a8a" stroke-width="0.45" stroke-linejoin="round"/>
            <!-- Axes -->
            <line x1="3.2" y1="1.1" x2="3.2" y2="5.8" stroke="#0284c7" stroke-width="0.4" stroke-linecap="round"/>
            <line x1="1.5" y1="2.2" x2="4.9" y2="4.4" stroke="#0284c7" stroke-width="0.4" stroke-linecap="round"/>
            <line x1="4.9" y1="2.2" x2="1.5" y2="4.4" stroke="#0284c7" stroke-width="0.4" stroke-linecap="round"/>
            <!-- Emerald Core Nucleus -->
            <circle cx="3.2" cy="3.5" r="0.9" fill="#059669" stroke="#ffffff" stroke-width="0.25"/>

            <!-- Brand Typography -->
            <text x="7.4" y="3.6" font-family="'Inter', sans-serif" font-weight="900" font-size="3.8" letter-spacing="-0.1">
              <tspan fill="#0f172a">PSL </tspan>
              <tspan fill="#0284c7">LABS</tspan>
            </text>
            <text x="7.4" y="5.9" font-family="'Inter', sans-serif" font-weight="700" font-size="1.35" fill="#64748b" letter-spacing="0.25">
              PARAGUAY SCIENTIFIC
            </text>
          </g>

          <!-- PRODUCT TITLE & DOSAGE -->
          <g transform="translate(0, 20.5)">
            <text x="0" y="4.5" font-family="'Inter', sans-serif" font-weight="900" font-size="5.4" fill="#0f172a" letter-spacing="-0.1">GHK-Cu</text>
            <text x="0" y="8" font-family="'Inter', sans-serif" font-weight="800" font-size="1.8" fill="#0284c7" letter-spacing="0.15">COPPER TRIPEPTIDE-1</text>

            <!-- Dosage Pill -->
            <rect x="0" y="10.5" width="26" height="7.2" rx="1.5" fill="url(#blueBadge)" />
            <text x="13" y="15.5" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="900" font-size="3.8" fill="#ffffff" letter-spacing="0.2">50 MG</text>

            <text x="13" y="21.5" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="800" font-size="1.6" fill="#334155">POLVO LIOFILIZADO ESTÉRIL</text>
            <text x="13" y="24" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="600" font-size="1.4" fill="#64748b">1 Vial de Uso Científico / 10 ml</text>
          </g>

          <!-- Bottom Security Check (Over blue ribbon) -->
          <g transform="translate(0, 56.5)">
            <rect width="26" height="4.5" rx="1.2" fill="#ffffff" stroke="#059669" stroke-width="0.3" />
            <circle cx="3" cy="2.25" r="1.0" fill="#059669" />
            <text x="3" y="2.8" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="900" font-size="1.4" fill="#ffffff">✓</text>
            <text x="5.2" y="3.0" font-family="'Inter', sans-serif" font-weight="800" font-size="1.35" fill="#065f46" letter-spacing="0.1">AUTENTICIDAD VERIFICADA</text>
          </g>
        </g>


        <!-- === PAINEL 3: LATERAL DIREITA (32 x 70 mm) === -->
        <g transform="translate(105.5, 66)">
          <text x="0" y="3.5" font-family="'Inter', sans-serif" font-weight="900" font-size="2.4" fill="#0f172a" letter-spacing="0.2">FABRICACIÓN</text>
          <text x="0" y="7" font-family="'Inter', sans-serif" font-weight="800" font-size="1.9" fill="#0f172a">PSL LABS S.A.</text>
          <text x="0" y="9.5" font-family="'Inter', sans-serif" font-weight="600" font-size="1.7" fill="#475569">División Biotecnológica</text>
          <text x="0" y="12" font-family="'Inter', sans-serif" font-weight="600" font-size="1.7" fill="#64748b">Asunción, Paraguay</text>
          <text x="0" y="14.5" font-family="'Inter', sans-serif" font-weight="700" font-size="1.7" fill="#0284c7">www.psl-labs.com.py</text>

          <line x1="0" y1="18.5" x2="26" y2="18.5" stroke="#e2e8f0" stroke-width="0.3" />
          <text x="0" y="22.5" font-family="'Inter', sans-serif" font-weight="900" font-size="2.4" fill="#0f172a" letter-spacing="0.2">ESTÁNDARES</text>
          <g transform="translate(0, 24.5)">
            <rect width="12" height="4.2" rx="0.8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="0.3" />
            <text x="6" y="3" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="800" font-size="1.6" fill="#0f172a">GMP ISO</text>

            <rect x="14" y="0" width="12" height="4.2" rx="0.8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="0.3" />
            <text x="20" y="3" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="800" font-size="1.6" fill="#0f172a">HPLC &gt;99%</text>
          </g>

          <line x1="0" y1="33" x2="26" y2="33" stroke="#e2e8f0" stroke-width="0.3" />
          <text x="0" y="37" font-family="'Inter', sans-serif" font-weight="900" font-size="2.2" fill="#d97706" letter-spacing="0.1">ADVERTENCIA</text>
          <text x="0" y="40.5" font-family="'Inter', sans-serif" font-weight="500" font-size="1.6" fill="#64748b">Sustancia para uso exclusivo</text>
          <text x="0" y="42.8" font-family="'Inter', sans-serif" font-weight="500" font-size="1.6" fill="#64748b">en investigación y laboratorio.</text>
          <text x="0" y="45.1" font-family="'Inter', sans-serif" font-weight="700" font-size="1.6" fill="#dc2626">Mantener fuera del alcance</text>
          <text x="0" y="47.4" font-family="'Inter', sans-serif" font-weight="700" font-size="1.6" fill="#dc2626">de los niños.</text>

          <!-- Origin Certified -->
          <g transform="translate(0, 51.5)">
            <rect width="26" height="8" rx="1.2" fill="#ffffff" stroke="#cbd5e1" stroke-width="0.3" />
            <text x="2.5" y="3.5" font-family="'Inter', sans-serif" font-weight="800" font-size="1.7" fill="#0f172a">ORIGEN CERTIFICADO</text>
            <text x="2.5" y="6" font-family="'Inter', sans-serif" font-weight="700" font-size="1.5" fill="#15803d">República del Paraguay 🇵🇾</text>
          </g>
        </g>


        <!-- === PAINEL 4: VERSO COM QR CODE PARA A PÁGINA DO PRODUTO === -->
        <g transform="translate(137.5, 66)">
          <text x="13" y="3.5" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="900" font-size="1.8" fill="#0f172a" letter-spacing="0.1">INFORMACIÓN DE PRODUCTO</text>
          <text x="13" y="5.8" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="600" font-size="1.4" fill="#0284c7">Escanee para ver ficha técnica</text>

          <!-- QR Code apontando para a página do produto -->
          <g transform="translate(4, 7.5)">
            <rect width="18" height="18" rx="1.5" fill="#ffffff" stroke="#e2e8f0" stroke-width="0.3" />
            <image href="${qrDataUrl}" x="1" y="1" width="16" height="16" />
          </g>

          <text x="13" y="28" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="800" font-size="1.5" fill="#0f172a">GHK-Cu 50 MG · Monografía</text>
          <text x="13" y="30.2" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="700" font-size="1.15" fill="#64748b">psl-labs-verification.vercel.app/product/ghk-cu-50mg</text>

          <!-- Tabela de Lote / Fabricação / Validade -->
          <g transform="translate(0, 33.5)">
            <rect width="26" height="14.5" rx="1.2" fill="#ffffff" stroke="#cbd5e1" stroke-width="0.3" />

            <text x="2" y="4" font-family="'Inter', sans-serif" font-weight="700" font-size="1.6" fill="#64748b">LOTE:</text>
            <text x="24" y="4" text-anchor="end" font-family="'Courier New', monospace" font-weight="900" font-size="1.8" fill="#0f172a">LOT-2026-01</text>
            <line x1="2" y1="5.2" x2="24" y2="5.2" stroke="#e2e8f0" stroke-width="0.2" />

            <text x="2" y="8.5" font-family="'Inter', sans-serif" font-weight="700" font-size="1.6" fill="#64748b">FAB:</text>
            <text x="24" y="8.5" text-anchor="end" font-family="'Inter', sans-serif" font-weight="800" font-size="1.7" fill="#0f172a">10/2026</text>
            <line x1="2" y1="9.7" x2="24" y2="9.7" stroke="#e2e8f0" stroke-width="0.2" />

            <text x="2" y="13" font-family="'Inter', sans-serif" font-weight="700" font-size="1.6" fill="#64748b">VAL:</text>
            <text x="24" y="13" text-anchor="end" font-family="'Inter', sans-serif" font-weight="800" font-size="1.7" fill="#0284c7">10/2028</text>
          </g>

          <!-- Código de barras EAN-13 -->
          <g transform="translate(2, 51.5)">
            <rect x="0" y="0" width="0.4" height="4.5" fill="#0f172a" />
            <rect x="0.8" y="0" width="0.6" height="4.5" fill="#0f172a" />
            <rect x="1.8" y="0" width="0.3" height="4.5" fill="#0f172a" />
            <rect x="2.5" y="0" width="0.8" height="4.5" fill="#0f172a" />
            <rect x="3.7" y="0" width="0.4" height="4.5" fill="#0f172a" />
            <rect x="4.5" y="0" width="0.6" height="4.5" fill="#0f172a" />
            <rect x="5.5" y="0" width="0.9" height="4.5" fill="#0f172a" />
            <rect x="6.8" y="0" width="0.4" height="4.5" fill="#0f172a" />
            <rect x="7.6" y="0" width="0.8" height="4.5" fill="#0f172a" />
            <rect x="8.8" y="0" width="0.4" height="4.5" fill="#0f172a" />
            <rect x="9.6" y="0" width="0.6" height="4.5" fill="#0f172a" />
            <rect x="10.6" y="0" width="0.8" height="4.5" fill="#0f172a" />
            <rect x="11.8" y="0" width="0.4" height="4.5" fill="#0f172a" />
            <rect x="12.6" y="0" width="0.6" height="4.5" fill="#0f172a" />
            <rect x="13.6" y="0" width="0.9" height="4.5" fill="#0f172a" />
            <rect x="14.9" y="0" width="0.4" height="4.5" fill="#0f172a" />
            <rect x="15.7" y="0" width="0.6" height="4.5" fill="#0f172a" />
            <rect x="16.7" y="0" width="0.8" height="4.5" fill="#0f172a" />
            <rect x="17.9" y="0" width="0.4" height="4.5" fill="#0f172a" />
            <rect x="18.7" y="0" width="0.6" height="4.5" fill="#0f172a" />
            <rect x="19.7" y="0" width="0.9" height="4.5" fill="#0f172a" />
            <rect x="21" y="0" width="0.4" height="4.5" fill="#0f172a" />
            <text x="11" y="6.8" text-anchor="middle" font-family="'Courier New', monospace" font-size="1.5" fill="#334155" letter-spacing="0.3">7 840001 502601</text>
          </g>
        </g>


        <!-- ================= 5. DIELINE CUT & CREASE LINES ================= -->
        <!-- Red Solid Lines: OUTSIDE CUT (LINHA DE CORTE) -->
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
        <line x1="38.5" y1="62.5" x2="38.5" y2="132.5" stroke="#0284c7" stroke-width="0.3" stroke-dasharray="1.2 0.8" />
        <line x1="70.5" y1="62.5" x2="70.5" y2="132.5" stroke="#0284c7" stroke-width="0.3" stroke-dasharray="1.2 0.8" />
        <line x1="102.5" y1="62.5" x2="102.5" y2="132.5" stroke="#0284c7" stroke-width="0.3" stroke-dasharray="1.2 0.8" />
        <line x1="134.5" y1="62.5" x2="134.5" y2="132.5" stroke="#0284c7" stroke-width="0.3" stroke-dasharray="1.2 0.8" />

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
        <strong>ESPECIFICAÇÕES DE PRODUÇÃO GRÁFICA (FUNDO CLARO):</strong><br>
        • <strong>Papel:</strong> Papel Cartão Triplex 300g/m² ou 350g/m² (Frente e Verso Branco Alvura 100%).<br>
        • <strong>Impressão:</strong> Offset 4 Cores (CMYK) ou Digital Alta Definição.<br>
        • <strong>Acabamento:</strong> Laminação Fosca (Soft Touch / BOPP) + Verniz UV Localizado no Logo e Dosagem.<br>
        • <strong>QR Code:</strong> Redirecionamento dinâmico para a Ficha Técnica do Produto no site.
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
        console.log(`🎉 PDF oficial de impressão (Fundo Claro) gerado com sucesso em:\n${outputPdfPath}`);

        // Generate Preview Screenshot of the A4 Sheet
        execFile(edgePath, [
          '--headless',
          '--disable-gpu',
          '--window-size=1200,1697',
          '--hide-scrollbars',
          `--screenshot=${outputSheetPngPath}`,
          fileUri
        ], (err2) => {
          if (!err2) {
            console.log(`✓ Preview PNG salvo em: ${outputSheetPngPath}`);
          }
        });
      }
    });
  }
}

main().catch(console.error);
