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
const outputHtmlPath = path.join(rootDir, 'caixa_ghk_cu_faca_aberta.html');
const outputPngPath = path.join(artifactDir, 'caixa_ghk_cu_50mg_faca_aberta.png');

async function main() {
  console.log("🎨 Gerando faca aberta da caixa de GHK CU 50 MG...");

  // Generate QR code for packaging
  const qrDataUrl = await QRCode.toDataURL("https://psl-labs-verification.vercel.app/v/GHK50-PACK1", {
    margin: 1,
    width: 250,
    errorCorrectionLevel: 'M',
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>PSL LABS - Faca Aberta Caixa GHK-Cu 50 MG</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background: #06090f;
      color: #ffffff;
      padding: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    .header-bar {
      text-align: center;
      margin-bottom: 25px;
      max-width: 1100px;
    }
    .badge-tag {
      display: inline-block;
      background: rgba(56, 189, 248, 0.15);
      border: 1px solid rgba(56, 189, 248, 0.35);
      color: #38bdf8;
      padding: 6px 16px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    h1 {
      font-size: 28px;
      font-weight: 900;
      color: #ffffff;
      margin-bottom: 6px;
    }
    p.subtitle {
      color: #94a3b8;
      font-size: 14px;
    }

    /* DIELINE WORKSPACE */
    .canvas-container {
      background: #0c121e;
      border: 1.5px solid #1e293b;
      border-radius: 20px;
      padding: 50px 40px 40px 40px;
      box-shadow: 0 25px 60px rgba(0,0,0,0.6);
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }

    /* SVG CONTAINER FOR EXACT PACKAGING DIE-LINE */
    svg.dieline {
      display: block;
      filter: drop-shadow(0 15px 35px rgba(0,0,0,0.5));
    }

    .legend {
      display: flex;
      gap: 25px;
      margin-top: 25px;
      font-size: 12px;
      color: #94a3b8;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .line-cut {
      width: 24px;
      height: 2px;
      background: #ef4444;
    }
    .line-crease {
      width: 24px;
      height: 2px;
      border-top: 2px dashed #38bdf8;
    }
    .specs-pill {
      background: #1e293b;
      padding: 4px 10px;
      border-radius: 6px;
      color: #e2e8f0;
      font-weight: 600;
    }
  </style>
</head>
<body>

  <div class="header-bar">
    <div class="badge-tag">Gabarito Gráfico Oficial · Faca de Corte & Vinco</div>
    <h1>Cartucho Farmacêutico · GHK CU 50 MG</h1>
    <p class="subtitle">Embalagem primária para frasco ampola de 10ml (Dimensões: 32 × 32 × 70 mm + abas tuck-in)</p>
  </div>

  <div class="canvas-container">
    
    <!-- PACKAGING SVG: Width = 960px, Height = 760px -->
    <svg class="dieline" width="960" height="760" viewBox="0 0 960 760" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Background Gradient for Panels -->
        <linearGradient id="panelBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0b1329" />
          <stop offset="50%" stop-color="#080e1d" />
          <stop offset="100%" stop-color="#04070f" />
        </linearGradient>

        <!-- Tech Wave Glow -->
        <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0284c7" />
          <stop offset="50%" stop-color="#0ea5e9" />
          <stop offset="100%" stop-color="#38bdf8" />
        </linearGradient>

        <linearGradient id="cyanShine" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8" />
          <stop offset="100%" stop-color="#38bdf8" stop-opacity="0" />
        </linearGradient>

        <linearGradient id="copperGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#2563eb" />
          <stop offset="100%" stop-color="#38bdf8" />
        </linearGradient>

        <pattern id="dotPattern" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#38bdf8" fill-opacity="0.12" />
        </pattern>
      </defs>

      <!-- BASE COORDINATES:
           Main 4 panels are aligned horizontally:
           - Glue Tab (Aba de cola): X = 60, Width = 60, Height = 340 (Y = 210 to 550)
           - Panel 1 (Lateral Esquerda): X = 120, Width = 180, Height = 340
           - Panel 2 (Frente): X = 300, Width = 180, Height = 340
           - Panel 3 (Lateral Direita): X = 480, Width = 180, Height = 340
           - Panel 4 (Verso): X = 660, Width = 180, Height = 340
           Top extensions:
           - Top Flap Dust 1 (over Panel 1): X = 120, Y = 110, H = 100
           - Top Main Tuck Flap (over Panel 2): X = 300, Y = 30, H = 180 (Lid: 100 + Tongue: 80)
           - Top Flap Dust 2 (over Panel 3): X = 480, Y = 110, H = 100
           Bottom extensions:
           - Bottom Flap Dust 1 (under Panel 1): X = 120, Y = 550, H = 100
           - Bottom Main Tuck Flap (under Panel 4): X = 660, Y = 550, H = 180 (Lid: 100 + Tongue: 80)
           - Bottom Flap Dust 2 (under Panel 3): X = 480, Y = 550, H = 100
      -->

      <!-- ================= 1. GLUE TAB (ABA DE COLAGEM) ================= -->
      <path d="M120 210 L80 230 L80 530 L120 550 Z" fill="#080e1a" stroke="#1e293b" stroke-width="1.5" />
      <text x="96" y="380" transform="rotate(-90 96 380)" font-family="'Inter', sans-serif" font-size="10" font-weight="700" fill="#475569" letter-spacing="2">ABA DE COLAGEM (GLUE)</text>

      <!-- ================= 2. TOP TUCK FLAP (TAMPA SUPERIOR - SOBRE PAINEL 2 FRENTE) ================= -->
      <!-- Tuck Tongue (Aba de engate) -->
      <path d="M300 50 C310 20, 330 20, 350 20 L430 20 C450 20, 470 20, 480 50 L480 110 L300 110 Z" fill="#070c18" stroke="#1e293b" stroke-width="1.5"/>
      <rect x="300" y="110" width="180" height="100" fill="url(#panelBg)" stroke="#1e293b" stroke-width="1.5" />
      <rect x="300" y="110" width="180" height="100" fill="url(#dotPattern)" />
      
      <!-- Top Lid Graphics -->
      <g transform="translate(390, 160)">
        <!-- Small HexaShield Symbol -->
        <g transform="translate(-14, -30) scale(0.65)">
          <path d="M20 3 L5 11 V19 C5 28 12 34 20 36 C28 34 35 28 35 19 V11 L20 3 Z" fill="#0b1329" stroke="#38bdf8" stroke-width="2"/>
          <circle cx="20" cy="20" r="4.5" fill="#10b981" stroke="#ffffff" stroke-width="1.2"/>
        </g>
        <text x="0" y="12" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="900" font-size="13" fill="#ffffff" letter-spacing="0.5">
          GHK-Cu <tspan fill="#38bdf8">50 MG</tspan>
        </text>
        <text x="0" y="27" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="700" font-size="8" fill="#10b981" letter-spacing="1.5">
          ✓ LACRE ORIGINAL
        </text>
      </g>

      <!-- Top Dust Flap 1 (sobre painel 1) -->
      <path d="M120 210 L120 120 C130 110, 170 110, 180 120 L180 210 Z" fill="#070c16" stroke="#1e293b" stroke-width="1.5"/>
      <!-- Top Dust Flap 2 (sobre painel 3) -->
      <path d="M480 210 L480 120 C490 110, 530 110, 540 120 L540 210 Z" fill="#070c16" stroke="#1e293b" stroke-width="1.5"/>

      <!-- ================= 3. BOTTOM TUCK FLAP (FUNDO INFERIOR - SOB PAINEL 4 VERSO) ================= -->
      <rect x="660" y="550" width="180" height="100" fill="url(#panelBg)" stroke="#1e293b" stroke-width="1.5" />
      <!-- Bottom Tuck Tongue -->
      <path d="M660 650 L660 710 C670 740, 690 740, 710 740 L790 740 C810 740, 830 740, 840 710 L840 650 Z" fill="#070c18" stroke="#1e293b" stroke-width="1.5"/>
      <g transform="translate(750, 600)">
        <text x="0" y="0" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="800" font-size="10" fill="#94a3b8">
          PSL LABS S.A.
        </text>
        <text x="0" y="16" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="600" font-size="8" fill="#64748b">
          Conservar a 2°C - 8°C
        </text>
        <text x="0" y="30" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="700" font-size="8" fill="#38bdf8">
          INDUSTRIA PARAGUAYA 🇵🇾
        </text>
      </g>
      <!-- Bottom Dust Flap 1 (sob painel 1) -->
      <path d="M120 550 L120 640 C130 650, 170 650, 180 640 L180 550 Z" fill="#070c16" stroke="#1e293b" stroke-width="1.5"/>
      <!-- Bottom Dust Flap 2 (sob painel 3) -->
      <path d="M480 550 L480 640 C490 650, 530 650, 540 640 L540 550 Z" fill="#070c16" stroke="#1e293b" stroke-width="1.5"/>


      <!-- ================= 4. OS 4 PAINÉIS PRINCIPAIS (CORPO DA CAIXA) ================= -->
      
      <!-- BACKGROUND RECTANGLES FOR ALL 4 PANELS -->
      <rect x="120" y="210" width="180" height="340" fill="url(#panelBg)" stroke="#1e293b" stroke-width="1.5" />
      <rect x="300" y="210" width="180" height="340" fill="url(#panelBg)" stroke="#1e293b" stroke-width="1.5" />
      <rect x="480" y="210" width="180" height="340" fill="url(#panelBg)" stroke="#1e293b" stroke-width="1.5" />
      <rect x="660" y="210" width="180" height="340" fill="url(#panelBg)" stroke="#1e293b" stroke-width="1.5" />

      <!-- CONTINUOUS BIOTECH WAVE / SWOOSH ACCENT (Across Front and Sides) -->
      <path d="M120 480 C180 470, 240 450, 300 460 C360 470, 420 510, 480 490 C540 470, 600 460, 660 480 C720 500, 780 520, 840 490 L840 550 L120 550 Z" 
            fill="url(#copperGrad)" fill-opacity="0.15" />
      <path d="M120 480 C180 470, 240 450, 300 460 C360 470, 420 510, 480 490 C540 470, 600 460, 660 480 C720 500, 780 520, 840 490" 
            fill="none" stroke="url(#copperGrad)" stroke-width="3" />


      <!-- ================= PAINEL 1: LATERAL ESQUERDA (X = 120 A 300) ================= -->
      <!-- Composição, Reconstituição & Armazenamento -->
      <g transform="translate(135, 230)">
        <!-- Header -->
        <text x="0" y="15" font-family="'Inter', sans-serif" font-weight="900" font-size="11" fill="#38bdf8" letter-spacing="1">
          COMPOSICIÓN
        </text>
        <text x="0" y="32" font-family="'Inter', sans-serif" font-weight="600" font-size="8.5" fill="#e2e8f0" line-height="1.4">
          Cada vial contiene:
        </text>
        <text x="0" y="46" font-family="'Inter', sans-serif" font-weight="700" font-size="8.5" fill="#ffffff">
          • GHK-Cu Tripeptide-1: <tspan fill="#38bdf8">50 mg</tspan>
        </text>
        <text x="0" y="59" font-family="'Inter', sans-serif" font-weight="500" font-size="8" fill="#94a3b8">
          • Pureza analítica: &gt; 99.2% (HPLC)
        </text>
        <text x="0" y="72" font-family="'Inter', sans-serif" font-weight="500" font-size="8" fill="#94a3b8">
          • Forma: Polvo Liofilizado
        </text>

        <!-- Reconstituição -->
        <line x1="0" y1="88" x2="150" y2="88" stroke="#1e293b" stroke-width="1" />
        <text x="0" y="105" font-family="'Inter', sans-serif" font-weight="900" font-size="11" fill="#38bdf8" letter-spacing="1">
          RECONSTITUCIÓN
        </text>
        <text x="0" y="122" font-family="'Inter', sans-serif" font-weight="500" font-size="8" fill="#cbd5e1">
          Reconstituir lentamente con agua
        </text>
        <text x="0" y="134" font-family="'Inter', sans-serif" font-weight="500" font-size="8" fill="#cbd5e1">
          bacteriostática o estéril.
        </text>
        <text x="0" y="146" font-family="'Inter', sans-serif" font-weight="600" font-size="8" fill="#f59e0b">
          No agitar vigorosamente.
        </text>

        <!-- Armazenamento -->
        <line x1="0" y1="162" x2="150" y2="162" stroke="#1e293b" stroke-width="1" />
        <text x="0" y="179" font-family="'Inter', sans-serif" font-weight="900" font-size="11" fill="#38bdf8" letter-spacing="1">
          CONSERVACIÓN
        </text>
        <text x="0" y="196" font-family="'Inter', sans-serif" font-weight="600" font-size="8.5" fill="#e2e8f0">
          • Liofilizado: 2°C a 8°C
        </text>
        <text x="0" y="209" font-family="'Inter', sans-serif" font-weight="500" font-size="8" fill="#94a3b8">
          • Proteger de la luz directa
        </text>
        <text x="0" y="222" font-family="'Inter', sans-serif" font-weight="500" font-size="8" fill="#94a3b8">
          • Reconstituido: usar en 30 días
        </text>

        <!-- Temperature Icon Graphic -->
        <g transform="translate(110, 245)">
          <circle cx="16" cy="16" r="16" fill="rgba(56,189,248,0.1)" stroke="#38bdf8" stroke-width="1.2" />
          <text x="16" y="20" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="900" font-size="9" fill="#38bdf8">2-8°C</text>
        </g>
      </g>


      <!-- ================= PAINEL 2: FRENTE PRINCIPAL (X = 300 A 480) ================= -->
      <!-- Visual de Alto Impacto com Logotipo HexaShield -->
      <g transform="translate(315, 230)">
        <!-- Top Origin & Class -->
        <rect x="0" y="0" width="55" height="18" rx="4" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" stroke-width="1" />
        <text x="27.5" y="12.5" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="800" font-size="8.5" fill="#34d399">
          🇵🇾 PY
        </text>

        <text x="170" y="12" text-anchor="end" font-family="'Inter', sans-serif" font-weight="800" font-size="8" fill="#38bdf8" letter-spacing="1">
          GRADE A+
        </text>

        <!-- PSL LABS LOGO & HEXASHIELD -->
        <g transform="translate(0, 35)">
          <!-- HexaShield Vector Logo -->
          <g transform="translate(0, 2)">
            <path d="M16 2 L4 8 V16 C4 23 9 28 16 30 C23 28 28 23 28 16 V8 L16 2 Z" fill="#0b1329" stroke="#38bdf8" stroke-width="1.8" stroke-linejoin="round"/>
            <line x1="16" y1="6" x2="16" y2="25" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
            <line x1="8.5" y1="10.5" x2="23.5" y2="20.5" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
            <line x1="23.5" y1="10.5" x2="8.5" y2="20.5" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
            <circle cx="16" cy="15.5" r="3.8" fill="#10b981" stroke="#ffffff" stroke-width="1"/>
          </g>
          
          <text x="38" y="18" font-family="'Inter', sans-serif" font-weight="900" font-size="18" letter-spacing="-0.5">
            <tspan fill="#ffffff">PSL </tspan>
            <tspan fill="#38bdf8">LABS</tspan>
          </text>
          <text x="38" y="28" font-family="'Inter', sans-serif" font-weight="700" font-size="6.5" fill="#94a3b8" letter-spacing="1.5">
            PARAGUAY SCIENTIFIC
          </text>
        </g>

        <!-- PRODUCT NAME (SUPER BOLD & GLOWING) -->
        <g transform="translate(0, 105)">
          <text x="0" y="20" font-family="'Inter', sans-serif" font-weight="900" font-size="27" fill="#ffffff" letter-spacing="-0.5">
            GHK-Cu
          </text>
          <text x="0" y="38" font-family="'Inter', sans-serif" font-weight="800" font-size="12" fill="#38bdf8" letter-spacing="2">
            COPPER TRIPEPTIDE-1
          </text>
          
          <!-- DOSAGE BADGE -->
          <g transform="translate(0, 52)">
            <rect width="150" height="34" rx="8" fill="linear-gradient(90deg, #1e3a8a, #0284c7)" />
            <text x="75" y="23" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="900" font-size="18" fill="#ffffff" letter-spacing="0.5">
              50 MG
            </text>
          </g>

          <text x="75" y="105" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="700" font-size="8.5" fill="#94a3b8" letter-spacing="0.5">
            POLVO LIOFILIZADO ESTÉRIL
          </text>
          <text x="75" y="118" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="600" font-size="8" fill="#64748b">
            1 Vial de Uso Científico / 10 ml
          </text>
        </g>

        <!-- BOTTOM SECURITY SHIELD CHECK -->
        <g transform="translate(0, 280)">
          <rect width="150" height="22" rx="6" fill="#091426" stroke="#10b981" stroke-width="1" />
          <circle cx="16" cy="11" r="5" fill="#10b981" />
          <text x="16" y="14" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="900" font-size="8" fill="#ffffff">✓</text>
          <text x="28" y="14.5" font-family="'Inter', sans-serif" font-weight="800" font-size="7.5" fill="#34d399" letter-spacing="0.5">
            AUTENTICIDAD VERIFICADA
          </text>
        </g>
      </g>


      <!-- ================= PAINEL 3: LATERAL DIREITA (X = 480 A 660) ================= -->
      <!-- Fabricante, Avisos Legais e Certificações -->
      <g transform="translate(495, 230)">
        <text x="0" y="15" font-family="'Inter', sans-serif" font-weight="900" font-size="11" fill="#38bdf8" letter-spacing="1">
          FABRICACIÓN
        </text>
        <text x="0" y="32" font-family="'Inter', sans-serif" font-weight="700" font-size="8.5" fill="#ffffff">
          PSL LABS S.A.
        </text>
        <text x="0" y="45" font-family="'Inter', sans-serif" font-weight="500" font-size="8" fill="#cbd5e1">
          División Biotecnológica
        </text>
        <text x="0" y="57" font-family="'Inter', sans-serif" font-weight="500" font-size="8" fill="#94a3b8">
          Asunción, Paraguay
        </text>
        <text x="0" y="69" font-family="'Inter', sans-serif" font-weight="600" font-size="8" fill="#38bdf8">
          www.psl-labs.com.py
        </text>

        <!-- Certificações -->
        <line x1="0" y1="88" x2="150" y2="88" stroke="#1e293b" stroke-width="1" />
        <text x="0" y="105" font-family="'Inter', sans-serif" font-weight="900" font-size="11" fill="#38bdf8" letter-spacing="1">
          ESTÁNDARES
        </text>
        <g transform="translate(0, 115)">
          <rect width="68" height="20" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1" />
          <text x="34" y="13.5" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="800" font-size="8" fill="#e2e8f0">GMP ISO</text>
          
          <rect x="76" y="0" width="74" height="20" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1" />
          <text x="113" y="13.5" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="800" font-size="8" fill="#e2e8f0">HPLC &gt;99%</text>
        </g>

        <!-- Advertências -->
        <line x1="0" y1="155" x2="150" y2="155" stroke="#1e293b" stroke-width="1" />
        <text x="0" y="172" font-family="'Inter', sans-serif" font-weight="900" font-size="10.5" fill="#f59e0b" letter-spacing="0.5">
          ADVERTENCIA
        </text>
        <text x="0" y="188" font-family="'Inter', sans-serif" font-weight="500" font-size="7.5" fill="#94a3b8">
          Sustancia para uso exclusivo
        </text>
        <text x="0" y="199" font-family="'Inter', sans-serif" font-weight="500" font-size="7.5" fill="#94a3b8">
          en investigación y laboratorio.
        </text>
        <text x="0" y="210" font-family="'Inter', sans-serif" font-weight="600" font-size="7.5" fill="#ef4444">
          Mantener fuera del alcance
        </text>
        <text x="0" y="221" font-family="'Inter', sans-serif" font-weight="600" font-size="7.5" fill="#ef4444">
          de los niños.
        </text>

        <!-- Paraguay Map / Flag Badge -->
        <g transform="translate(0, 255)">
          <rect width="150" height="38" rx="6" fill="#08101d" stroke="#1e293b" stroke-width="1" />
          <text x="12" y="18" font-family="'Inter', sans-serif" font-weight="800" font-size="8.5" fill="#ffffff">
            ORIGEN CERTIFICADO
          </text>
          <text x="12" y="30" font-family="'Inter', sans-serif" font-weight="600" font-size="7.5" fill="#10b981">
            República del Paraguay 🇵🇾
          </text>
        </g>
      </g>


      <!-- ================= PAINEL 4: VERSO (X = 660 A 840) ================= -->
      <!-- QR Code de Autenticidade, Dados de Rastreabilidade e Lote -->
      <g transform="translate(675, 230)">
        <text x="75" y="15" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="900" font-size="11" fill="#38bdf8" letter-spacing="1">
          AUTENTICIDAD DIGITAL
        </text>
        <text x="75" y="28" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="500" font-size="7.5" fill="#94a3b8">
          Escanee para verificar lote único
        </text>

        <!-- QR CODE PROTETOR BRANCO -->
        <g transform="translate(25, 38)">
          <rect width="100" height="100" rx="8" fill="#ffffff" />
          <image href="${qrDataUrl}" x="5" y="5" width="90" height="90" />
        </g>

        <!-- Serial do Lote -->
        <text x="75" y="152" text-anchor="middle" font-family="'Courier New', monospace" font-weight="900" font-size="10" fill="#38bdf8" letter-spacing="1">
          GHK50-VERIFIED
        </text>
        <text x="75" y="164" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="700" font-size="7.5" fill="#10b981">
          psl-labs-verification.vercel.app
        </text>

        <!-- TABELA DE RASTREABILIDADE (LOTE / FAB / VAL) -->
        <g transform="translate(0, 182)">
          <rect width="150" height="74" rx="6" fill="#080e1a" stroke="#1e293b" stroke-width="1" />
          
          <text x="12" y="20" font-family="'Inter', sans-serif" font-weight="700" font-size="8" fill="#94a3b8">LOTE:</text>
          <text x="138" y="20" text-anchor="end" font-family="'Courier New', monospace" font-weight="900" font-size="9" fill="#ffffff">LOT-2026-01</text>
          <line x1="12" y1="26" x2="138" y2="26" stroke="#1e293b" stroke-width="1" />

          <text x="12" y="42" font-family="'Inter', sans-serif" font-weight="700" font-size="8" fill="#94a3b8">FABRICACIÓN:</text>
          <text x="138" y="42" text-anchor="end" font-family="'Inter', sans-serif" font-weight="800" font-size="8.5" fill="#ffffff">10/2026</text>
          <line x1="12" y1="48" x2="138" y2="48" stroke="#1e293b" stroke-width="1" />

          <text x="12" y="64" font-family="'Inter', sans-serif" font-weight="700" font-size="8" fill="#94a3b8">VENCIMIENTO:</text>
          <text x="138" y="64" text-anchor="end" font-family="'Inter', sans-serif" font-weight="800" font-size="8.5" fill="#38bdf8">10/2028</text>
        </g>

        <!-- Código de Barras EAN-13 Simulado -->
        <g transform="translate(15, 272)">
          <!-- Simulated barcode bars -->
          <rect x="0" y="0" width="2" height="20" fill="#cbd5e1" />
          <rect x="4" y="0" width="3" height="20" fill="#cbd5e1" />
          <rect x="9" y="0" width="1" height="20" fill="#cbd5e1" />
          <rect x="12" y="0" width="4" height="20" fill="#cbd5e1" />
          <rect x="18" y="0" width="2" height="20" fill="#cbd5e1" />
          <rect x="22" y="0" width="1" height="20" fill="#cbd5e1" />
          <rect x="25" y="0" width="3" height="20" fill="#cbd5e1" />
          <rect x="30" y="0" width="5" height="20" fill="#cbd5e1" />
          <rect x="37" y="0" width="2" height="20" fill="#cbd5e1" />
          <rect x="41" y="0" width="1" height="20" fill="#cbd5e1" />
          <rect x="44" y="0" width="4" height="20" fill="#cbd5e1" />
          <rect x="50" y="0" width="2" height="20" fill="#cbd5e1" />
          <rect x="54" y="0" width="3" height="20" fill="#cbd5e1" />
          <rect x="59" y="0" width="1" height="20" fill="#cbd5e1" />
          <rect x="62" y="0" width="4" height="20" fill="#cbd5e1" />
          <rect x="68" y="0" width="2" height="20" fill="#cbd5e1" />
          <rect x="72" y="0" width="5" height="20" fill="#cbd5e1" />
          <rect x="79" y="0" width="2" height="20" fill="#cbd5e1" />
          <rect x="83" y="0" width="1" height="20" fill="#cbd5e1" />
          <rect x="86" y="0" width="3" height="20" fill="#cbd5e1" />
          <rect x="91" y="0" width="2" height="20" fill="#cbd5e1" />
          <rect x="95" y="0" width="4" height="20" fill="#cbd5e1" />
          <rect x="101" y="0" width="1" height="20" fill="#cbd5e1" />
          <rect x="104" y="0" width="3" height="20" fill="#cbd5e1" />
          <rect x="109" y="0" width="2" height="20" fill="#cbd5e1" />
          <rect x="113" y="0" width="4" height="20" fill="#cbd5e1" />
          <rect x="118" y="0" width="2" height="20" fill="#cbd5e1" />
          <text x="60" y="29" text-anchor="middle" font-family="'Courier New', monospace" font-size="7" fill="#64748b" letter-spacing="1.5">7 840001 502601</text>
        </g>
      </g>

      <!-- ================= 5. DIELINE GUIDES (VINCOS E CORTES GRÁFICOS) ================= -->
      <!-- Vertical Fold Creases (Vinco) -->
      <line x1="120" y1="210" x2="120" y2="550" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4 3" />
      <line x1="300" y1="210" x2="300" y2="550" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4 3" />
      <line x1="480" y1="210" x2="480" y2="550" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4 3" />
      <line x1="660" y1="210" x2="660" y2="550" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4 3" />
      <line x1="840" y1="210" x2="840" y2="550" stroke="#ef4444" stroke-width="1.5" />

      <!-- Horizontal Fold Creases (Top & Bottom) -->
      <line x1="120" y1="210" x2="840" y2="210" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4 3" />
      <line x1="120" y1="550" x2="840" y2="550" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4 3" />
      <line x1="300" y1="110" x2="480" y2="110" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4 3" />
      <line x1="660" y1="650" x2="840" y2="650" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4 3" />

      <!-- Dimension labels on blueprint -->
      <text x="210" y="568" text-anchor="middle" font-family="'Inter', sans-serif" font-size="8.5" fill="#38bdf8" font-weight="700">32 mm</text>
      <text x="390" y="568" text-anchor="middle" font-family="'Inter', sans-serif" font-size="8.5" fill="#38bdf8" font-weight="700">32 mm</text>
      <text x="570" y="568" text-anchor="middle" font-family="'Inter', sans-serif" font-size="8.5" fill="#38bdf8" font-weight="700">32 mm</text>
      <text x="750" y="568" text-anchor="middle" font-family="'Inter', sans-serif" font-size="8.5" fill="#38bdf8" font-weight="700">32 mm</text>

      <text x="855" y="380" font-family="'Inter', sans-serif" font-size="9" fill="#38bdf8" font-weight="700">70 mm Altura</text>
    </svg>

  </div>

  <div class="legend">
    <div class="legend-item">
      <div class="line-cut"></div>
      <span>Linha Vermelha Contínua: Faca de Corte Externo</span>
    </div>
    <div class="legend-item">
      <div class="line-crease"></div>
      <span>Linha Azul Tracejada: Vinco / Dobra</span>
    </div>
    <div class="legend-item">
      <span class="specs-pill">Papel Sugerido: Cartão Triplex 300g ou 350g com Laminação Fosca + Verniz Localizado</span>
    </div>
  </div>

</body>
</html>`;

  fs.writeFileSync(outputHtmlPath, html, 'utf8');
  console.log(`✓ HTML da faca gráfica salvo em: ${outputHtmlPath}`);

  if (fs.existsSync(edgePath)) {
    console.log("Compilando imagem de alta definição com Edge...");
    const fileUri = `file:///${outputHtmlPath.replace(/\\/g, '/')}`;

    execFile(edgePath, [
      '--headless',
      '--disable-gpu',
      '--window-size=1180,1050',
      '--hide-scrollbars',
      `--screenshot=${outputPngPath}`,
      fileUri
    ], (err) => {
      if (err) {
        console.error("Erro ao gerar screenshot:", err);
      } else {
        console.log(`🎉 Imagem da faca aberta salva com sucesso em:\n${outputPngPath}`);
      }
    });
  }
}

main().catch(console.error);
