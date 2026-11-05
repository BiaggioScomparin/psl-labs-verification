import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFile } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const artifactsDir = "C:\\Users\\biagg\\.gemini\\antigravity\\brain\\eecd8f48-bc30-44c6-9d0f-0a791a01c2f5";
const brandDir = path.join(rootDir, 'public', 'brand');
const artifactsBrandDir = path.join(artifactsDir, 'brand');
const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

if (!fs.existsSync(brandDir)) fs.mkdirSync(brandDir, { recursive: true });
if (!fs.existsSync(artifactsBrandDir)) fs.mkdirSync(artifactsBrandDir, { recursive: true });

// SVG Estrella de Mayo & Anel Científico Symbol
function getEstrellaSvg(size = 64, isLight = false) {
  const ringColor = isLight ? "#0284c7" : "#38bdf8";
  const starFill = isLight ? "#059669" : "#10b981";
  const glow = isLight ? "rgba(2,132,199,0.12)" : "rgba(56,189,248,0.15)";
  const strokeBorder = isLight ? "#ffffff" : "#0a0f18";

  return `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Outer Precision Lab Dial -->
  <circle cx="32" cy="32" r="30" stroke="${ringColor}" stroke-width="1.8" />
  <circle cx="32" cy="32" r="26" stroke="${ringColor}" stroke-width="0.8" stroke-dasharray="1.5 2" />
  <circle cx="32" cy="32" r="18" fill="${glow}" />
  
  <!-- Precision Crosshairs -->
  <line x1="32" y1="2" x2="32" y2="7" stroke="${ringColor}" stroke-width="2" stroke-linecap="round" />
  <line x1="32" y1="57" x2="32" y2="62" stroke="${ringColor}" stroke-width="2" stroke-linecap="round" />
  <line x1="2" y1="32" x2="7" y2="32" stroke="${ringColor}" stroke-width="2" stroke-linecap="round" />
  <line x1="57" y1="32" x2="62" y2="32" stroke="${ringColor}" stroke-width="2" stroke-linecap="round" />
  
  <!-- Central 5-Pointed Star of May (Estrella de Mayo) -->
  <polygon points="32,13 36.5,24 48,24.8 39.2,32.2 42,43.5 32,37.5 22,43.5 24.8,32.2 16,24.8 27.5,24" 
           fill="${starFill}" stroke="${strokeBorder}" stroke-width="1.2" stroke-linejoin="round" />
           
  <!-- Inner core nucleus -->
  <circle cx="32" cy="32" r="3" fill="#ffffff" />
</svg>`;
}

// Full horizontal lockup SVG
function getHorizontalLockupSvg(isLight = false) {
  const textColor = isLight ? "#0f172a" : "#ffffff";
  const subColor = isLight ? "#0284c7" : "#38bdf8";
  const badgeBg = isLight ? "#f1f5f9" : "#1e293b";
  const badgeText = isLight ? "#0284c7" : "#38bdf8";
  const badgeBorder = isLight ? "#cbd5e1" : "#334155";

  return `<svg width="400" height="90" viewBox="0 0 400 90" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(15, 13)">
    ${getEstrellaSvg(64, isLight)}
  </g>
  <text x="95" y="47" font-family="'Inter', sans-serif" font-weight="900" font-size="32" fill="${textColor}" letter-spacing="0.5">PSL <tspan fill="#10b981">LABS</tspan></text>
  
  <!-- PY Badge -->
  <rect x="260" y="27" width="34" height="22" rx="6" fill="${badgeBg}" stroke="${badgeBorder}" stroke-width="1" />
  <text x="277" y="42" font-family="'Inter', sans-serif" font-weight="800" font-size="12" fill="${badgeText}" text-anchor="middle">PY</text>

  <text x="96" y="66" font-family="'Inter', sans-serif" font-weight="700" font-size="10" fill="${subColor}" letter-spacing="1.8">PARAGUAY SCIENTIFIC LABORATORIES</text>
</svg>`;
}

async function main() {
  console.log("⭐ Exportando Novo Kit de Identidade Visual Oficial (Opção 02: Estrella de Mayo)...");

  // Save standalone SVGs
  const symbolSvg = getEstrellaSvg(128, false);
  const horizDarkSvg = getHorizontalLockupSvg(false);
  const horizLightSvg = getHorizontalLockupSvg(true);

  fs.writeFileSync(path.join(brandDir, 'psl-labs-symbol.svg'), symbolSvg, 'utf8');
  fs.writeFileSync(path.join(brandDir, 'psl-labs-horizontal-dark.svg'), horizDarkSvg, 'utf8');
  fs.writeFileSync(path.join(brandDir, 'psl-labs-horizontal-light.svg'), horizLightSvg, 'utf8');

  fs.writeFileSync(path.join(artifactsBrandDir, 'psl-labs-symbol.svg'), symbolSvg, 'utf8');
  fs.writeFileSync(path.join(artifactsBrandDir, 'psl-labs-horizontal-dark.svg'), horizDarkSvg, 'utf8');
  fs.writeFileSync(path.join(artifactsBrandDir, 'psl-labs-horizontal-light.svg'), horizLightSvg, 'utf8');

  // Generate Brand Kit Presentation HTML
  const brandKitHtmlPath = path.join(rootDir, 'novo_brand_kit_estrella.html');
  const brandKitPngPath = path.join(artifactsDir, 'psl_labs_novo_logo_oficial.png');

  const brandKitHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>PSL LABS - Novo Logotipo Oficial (Estrella de Mayo & Anel Científico)</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', system-ui, sans-serif;
      background: #06090e;
      color: #f8fafc;
      padding: 40px 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }
    .wrapper { max-width: 1100px; width: 100%; }
    .header {
      text-align: center;
      margin-bottom: 35px;
      padding-bottom: 25px;
      border-bottom: 1px solid #1e293b;
    }
    .pill {
      display: inline-block;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.35);
      color: #10b981;
      font-size: 13px;
      font-weight: 800;
      padding: 6px 18px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 12px;
    }
    h1 {
      font-size: 34px;
      font-weight: 900;
      letter-spacing: -0.5px;
      color: #ffffff;
      margin-bottom: 8px;
    }
    p.sub { font-size: 15px; color: #94a3b8; }

    /* Showcase Layout */
    .showcase-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 25px;
      margin-bottom: 30px;
    }
    .card {
      border-radius: 16px;
      padding: 30px 25px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      min-height: 200px;
      box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
    }
    .card-tag {
      position: absolute;
      top: 14px;
      left: 18px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .card-dark {
      background: #090e17;
      border: 1px solid #1e293b;
    }
    .card-light {
      background: #ffffff;
      border: 1px solid #cbd5e1;
    }

    /* Symbol & Cap details */
    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 20px;
      margin-bottom: 30px;
    }
    .detail-card {
      background: #0c121e;
      border: 1px solid #1e293b;
      border-radius: 14px;
      padding: 24px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .detail-title {
      font-size: 14px;
      font-weight: 700;
      color: #38bdf8;
      margin-bottom: 15px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .cap-badge {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #059669 0%, #064e3b 100%);
      box-shadow: 0 8px 20px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.4);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 1.5px solid #34d399;
    }
    .cap-label {
      font-size: 7.5px;
      font-weight: 800;
      color: #ffffff;
      margin-top: 3px;
      letter-spacing: 0.5px;
    }

    /* Specs info */
    .specs-box {
      background: #0c121e;
      border: 1px solid #1e293b;
      border-radius: 14px;
      padding: 20px 25px;
    }
    .specs-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #1e293b;
      font-size: 14px;
    }
    .specs-row:last-child { border-bottom: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="pill">Identidade Visual Oficial Homologada</div>
      <h1>PSL LABS · Novo Logotipo Oficial</h1>
      <p class="sub">Conceito: Estrella de Mayo & Anel Científico (República del Paraguay)</p>
    </div>

    <!-- Main 2 Cards: Dark Lockup & Light Lockup -->
    <div class="showcase-grid">
      <div class="card card-dark">
        <div class="card-tag" style="color: #38bdf8;">Versão Principal (Dark Biotech)</div>
        ${horizDarkSvg}
      </div>

      <div class="card card-light">
        <div class="card-tag" style="color: #0284c7;">Versão Clínica (White Biotech)</div>
        ${horizLightSvg}
      </div>
    </div>

    <!-- Details: Symbol Alone, Cap Application, Monogram Stamp -->
    <div class="details-grid">
      
      <div class="detail-card">
        <div class="detail-title">Brasão Isolado</div>
        <div style="margin: 10px 0;">
          ${getEstrellaSvg(70, false)}
        </div>
        <p style="font-size: 12px; color: #94a3b8; margin-top: 10px;">Estrella de Mayo de 5 pontas, anéis laboratoriais e miras de precisão cromatográfica.</p>
      </div>

      <div class="detail-card">
        <div class="detail-title">Aplicação Tampa Flip-Off (20mm)</div>
        <div class="cap-badge">
          ${getEstrellaSvg(40, false)}
          <div class="cap-label">PSL LABS · PY</div>
        </div>
        <p style="font-size: 12px; color: #94a3b8; margin-top: 10px;">Encaixe perfeito na tampa plástica verde esmeralda com relevo ou tampografia.</p>
      </div>

      <div class="detail-card">
        <div class="detail-title">Selo de Autenticidade</div>
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 10px; padding: 12px 16px; margin: 10px 0;">
          <div style="font-size: 13px; font-weight: 800; color: #10b981;">LACRE HOLOGRÁFICO</div>
          <div style="font-size: 11px; color: #38bdf8; font-weight: 700; margin-top: 2px;">AUTENTICIDAD VERIFICADA</div>
        </div>
        <p style="font-size: 12px; color: #94a3b8;">Aplicado nos cantos de abertura das caixas e estojos.</p>
      </div>

    </div>

    <!-- Technical Specs -->
    <div class="specs-box">
      <div class="specs-row">
        <span style="color: #94a3b8; font-weight: 600;">Nome Oficial</span>
        <span style="color: #ffffff; font-weight: 700;">PSL LABS (Paraguay Scientific Laboratories S.A.)</span>
      </div>
      <div class="specs-row">
        <span style="color: #94a3b8; font-weight: 600;">Símbolo Heráldico</span>
        <span style="color: #10b981; font-weight: 700;">Estrella de Mayo (Símbolo Nacional do Paraguai) + Anéis Orbitais de Precisão</span>
      </div>
      <div class="specs-row">
        <span style="color: #94a3b8; font-weight: 600;">Cores Institucionais</span>
        <span style="color: #38bdf8; font-weight: 700;">Azul Ciano (#38bdf8 / #0284c7) · Verde Esmeralda (#10b981 / #059669) · Grafite Titânio (#090e17)</span>
      </div>
      <div class="specs-row">
        <span style="color: #94a3b8; font-weight: 600;">Selo de Procedência</span>
        <span style="color: #ffffff; font-weight: 700;">REPÚBLICA DEL PARAGUAY · [PY]</span>
      </div>
    </div>

  </div>
</body>
</html>`;

  fs.writeFileSync(brandKitHtmlPath, brandKitHtml, 'utf8');

  // Take screenshot with Edge
  console.log("📸 Gerando screenshot em alta resolução do novo Brand Kit...");
  await new Promise((resolve, reject) => {
    execFile(edgePath, [
      '--headless',
      '--disable-gpu',
      '--screenshot=' + brandKitPngPath,
      '--window-size=1200,1220',
      '--hide-scrollbars',
      brandKitHtmlPath
    ], (err, stdout) => {
      if (err) return reject(err);
      resolve(stdout);
    });
  });

  console.log(`✓ Brand Kit salvo em: ${brandKitPngPath}`);
}

main().catch(console.error);
