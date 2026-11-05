import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFile } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const artifactsDir = "C:\\Users\\biagg\\.gemini\\antigravity\\brain\\eecd8f48-bc30-44c6-9d0f-0a791a01c2f5";
const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

// ==========================================
// 5 DISTINCT VECTOR SVG LOGO DESIGNS
// ==========================================

// 1. MONOGRAMA MOLECULAR "PSL"
function getLogo1(size = 48, isLight = false) {
  const stroke1 = isLight ? "#0284c7" : "#38bdf8";
  const stroke2 = isLight ? "#059669" : "#10b981";
  const atomFill = isLight ? "#0369a1" : "#00f0ff";
  return `
  <svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gradPsl${size}${isLight}" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="${stroke1}" />
        <stop offset="60%" stop-color="${stroke2}" />
        <stop offset="100%" stop-color="${stroke1}" />
      </linearGradient>
    </defs>
    <!-- Background subtle ring -->
    <circle cx="32" cy="32" r="30" stroke="${isLight ? '#e2e8f0' : '#1e293b'}" stroke-width="1.5" stroke-dasharray="2 3" />
    
    <!-- Letter P (Left loop) -->
    <path d="M16 48V16H28C33.5 16 38 20.5 38 26C38 31.5 33.5 36 28 36H16" stroke="url(#gradPsl${size}${isLight})" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
    
    <!-- Letter S (Flowing through center to bottom) -->
    <path d="M46 22C46 18.7 43.3 16 40 16H32" stroke="${stroke1}" stroke-width="3" stroke-linecap="round" />
    <path d="M34 26C38 27.5 44 29 44 34.5C44 41 38 43 32 43" stroke="${stroke2}" stroke-width="4" stroke-linecap="round" />
    
    <!-- Letter L (Base horizontal anchor) -->
    <path d="M26 48H48" stroke="url(#gradPsl${size}${isLight})" stroke-width="4.5" stroke-linecap="round" />
    
    <!-- Molecular bonding nodes -->
    <circle cx="16" cy="16" r="3.5" fill="${atomFill}" />
    <circle cx="28" cy="36" r="3" fill="${stroke2}" />
    <circle cx="48" cy="48" r="3.5" fill="${atomFill}" />
    <circle cx="16" cy="48" r="3.5" fill="${stroke1}" />
  </svg>`;
}

// 2. ESTRELLA DE MAYO & ANEL CIENTÍFICO (Herança Nacional Paraguaia)
function getLogo2(size = 48, isLight = false) {
  const ringColor = isLight ? "#0284c7" : "#38bdf8";
  const starFill = isLight ? "#059669" : "#10b981";
  const glow = isLight ? "rgba(2,132,199,0.12)" : "rgba(56,189,248,0.15)";
  return `
  <svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
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
             fill="${starFill}" stroke="${isLight ? '#ffffff' : '#0f172a'}" stroke-width="1.2" stroke-linejoin="round" />
             
    <!-- Inner core nucleus -->
    <circle cx="32" cy="32" r="3" fill="#ffffff" />
  </svg>`;
}

// 3. ELO INFINITO & DUPLA HÉLICE (Longevidade & Regeneração Celular)
function getLogo3(size = 48, isLight = false) {
  const c1 = isLight ? "#0284c7" : "#00f0ff";
  const c2 = isLight ? "#059669" : "#10b981";
  return `
  <svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="infGrad1${size}${isLight}" x1="8" y1="18" x2="56" y2="46" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="${c1}" />
        <stop offset="100%" stop-color="${c2}" />
      </linearGradient>
      <linearGradient id="infGrad2${size}${isLight}" x1="56" y1="18" x2="8" y2="46" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="${c2}" />
        <stop offset="100%" stop-color="${c1}" />
      </linearGradient>
    </defs>
    <!-- Background circular shield -->
    <rect x="3" y="3" width="58" height="58" rx="29" fill="${isLight ? '#f8fafc' : '#0f172a'}" stroke="${isLight ? '#e2e8f0' : '#1e293b'}" stroke-width="1.2" />
    
    <!-- Left loop of infinity -->
    <path d="M32 32C26 22 14 20 10 27C6 34 10 42 18 42C26 42 32 32 32 32Z" stroke="url(#infGrad1${size}${isLight})" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
    
    <!-- Right loop of infinity -->
    <path d="M32 32C38 42 50 44 54 37C58 30 54 22 46 22C38 22 32 32 32 32Z" stroke="url(#infGrad2${size}${isLight})" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
    
    <!-- DNA/Peptide rungs crossing the loops -->
    <line x1="15" y1="28" x2="19" y2="36" stroke="${c2}" stroke-width="2" stroke-linecap="round" />
    <line x1="45" y1="28" x2="49" y2="36" stroke="${c1}" stroke-width="2" stroke-linecap="round" />
    <circle cx="32" cy="32" r="3" fill="#ffffff" />
  </svg>`;
}

// 4. ESCUDO CLÍNICO NÓRDICO COM CRUZ DE PRECISÃO (Padrão Farmacêutico Puro)
function getLogo4(size = 48, isLight = false) {
  const strokeColor = isLight ? "#0369a1" : "#38bdf8";
  const crossColor = isLight ? "#0284c7" : "#00f0ff";
  const shieldFill = isLight ? "#f0f9ff" : "rgba(15, 23, 42, 0.9)";
  return `
  <svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Chiseled Nordic Shield Outline -->
    <path d="M32 5L52 14V32C52 46 43 55 32 60C21 55 12 46 12 32V14L32 5Z" 
          fill="${shieldFill}" stroke="${strokeColor}" stroke-width="3" stroke-linejoin="round" />
          
    <path d="M32 10L48 17.5V32C48 43.5 40.5 51 32 55C23.5 51 16 43.5 16 32V17.5L32 10Z" 
          stroke="${isLight ? '#bae6fd' : '#1e293b'}" stroke-width="1.2" />

    <!-- Medical Precision Cross (+) inside shield -->
    <path d="M32 18V46M18 32H46" stroke="${crossColor}" stroke-width="4.5" stroke-linecap="round" />
    
    <!-- Central diamond core -->
    <rect x="29" y="29" width="6" height="6" rx="1.5" transform="rotate(45 32 32)" fill="#10b981" />
  </svg>`;
}

// 5. PRISMA / CRISTAL HEXAGONAL LIOFILIZADO (Pureza Absoluta & Luxo)
function getLogo5(size = 48, isLight = false) {
  const edgeColor = isLight ? "#0284c7" : "#38bdf8";
  const fTop = isLight ? "#bae6fd" : "#0284c7";
  const fLeft = isLight ? "#e0f2fe" : "#0369a1";
  const fRight = isLight ? "#0284c7" : "#0f172a";
  return `
  <svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Hexagon Outer Boundary -->
    <polygon points="32,4 58,19 58,49 32,64 6,49 6,19" 
             stroke="${edgeColor}" stroke-width="1.8" stroke-linejoin="round" />

    <!-- Isometric Facet Top -->
    <polygon points="32,10 52,21.5 32,33 12,21.5" 
             fill="${fTop}" fill-opacity="${isLight ? '0.7' : '0.4'}" stroke="${edgeColor}" stroke-width="2" stroke-linejoin="round" />
             
    <!-- Isometric Facet Bottom-Left -->
    <polygon points="12,21.5 32,33 32,56 12,44.5" 
             fill="${fLeft}" fill-opacity="${isLight ? '0.9' : '0.6'}" stroke="${edgeColor}" stroke-width="2" stroke-linejoin="round" />

    <!-- Isometric Facet Bottom-Right -->
    <polygon points="32,33 52,21.5 52,44.5 32,56" 
             fill="${fRight}" fill-opacity="${isLight ? '0.9' : '0.8'}" stroke="${edgeColor}" stroke-width="2" stroke-linejoin="round" />

    <!-- Central Floating Pure Nucleus -->
    <circle cx="32" cy="33" r="4.5" fill="#10b981" stroke="#ffffff" stroke-width="1.2" />
  </svg>`;
}

async function main() {
  console.log("⚡ Gerando Vitrine de Apresentação com as 5 Propostas de Logotipo para PSL LABS...");

  const htmlPath = path.join(rootDir, 'amostra_5_propostas_logos.html');
  const pngPath = path.join(artifactsDir, 'amostras_5_logos_psl_labs.png');

  const concepts = [
    {
      id: "opcao1",
      number: "01",
      name: "Monograma Molecular PSL",
      subtitle: "Intertravamento Geométrico das Letras P, S e L",
      desc: "As 3 letras se fundem em uma linha contínua simulando uma ligação peptídica. Minimalista, contemporâneo e perfeito para relevo em tampas de frasco.",
      logoFn: getLogo1,
      tag: "Ultra-Moderno & Exclusivo"
    },
    {
      id: "opcao2",
      number: "02",
      name: "Estrella de Mayo & Anel Científico",
      subtitle: "Herança Nacional Paraguaia com Rigor de Laboratório",
      desc: "A estrela máxima do brasão da República do Paraguai envolvida por anéis de precisão milimétrica. Passa autoridade de laboratório estatal/oficial.",
      logoFn: getLogo2,
      tag: "DNA 100% Paraguai"
    },
    {
      id: "opcao3",
      number: "03",
      name: "Elo Infinito & Dupla Hélice",
      subtitle: "Longevidade, Renovação Celular & Peptídeos",
      desc: "O símbolo do infinito estilizado em uma fita de DNA em degradê esmeralda e ciano. Representa a regeneração celular (GHK-Cu) e a vida ativa.",
      logoFn: getLogo3,
      tag: "Biotecnologia & Longevidade"
    },
    {
      id: "opcao4",
      number: "04",
      name: "Escudo Clínico Nórdico",
      subtitle: "Austero, Cirúrgico e Hospitalar com Cruz Médica",
      desc: "Linhas chanfradas de precisão com cruz médica negativa em ciano. Inspira pureza analítica, farmacopéia rigorosa e controle HPLC >99%.",
      logoFn: getLogo4,
      tag: "Clínico & Farmacêutico Puro"
    },
    {
      id: "opcao5",
      number: "05",
      name: "Prisma Hexagonal / Cristal Liofilizado",
      subtitle: "Geometria Isométrica Lapidada como Diamante",
      desc: "Remete à estrutura molecular cristalina e à pureza do pó liofilizado. Passa sensação de produto nobre, luxuoso e de tecnologia cristalina.",
      logoFn: getLogo5,
      tag: "Luxo & Pureza Cristalina"
    }
  ];

  let cardsHtml = '';

  for (const c of concepts) {
    cardsHtml += `
      <div class="concept-row">
        
        <!-- Header Info -->
        <div class="concept-header">
          <div class="concept-num">${c.number}</div>
          <div class="concept-titles">
            <div class="concept-name">${c.name}</div>
            <div class="concept-sub">${c.subtitle}</div>
          </div>
          <div class="concept-tag">${c.tag}</div>
        </div>

        <p class="concept-desc">${c.desc}</p>

        <!-- Previews Grid: Dark Lockup, Light Lockup, and Flip-off Cap Preview -->
        <div class="previews-grid">
          
          <!-- DARK BIOTECH LOCKUP -->
          <div class="preview-box dark-bg">
            <div class="box-tag">Fundo Escuro (Dark Biotech)</div>
            <div class="lockup">
              ${c.logoFn(54, false)}
              <div class="lockup-text">
                <div class="brand-title-dark">PSL LABS <span class="badge-py-dark">PY</span></div>
                <div class="brand-sub-dark">PARAGUAY SCIENTIFIC LABORATORIES</div>
              </div>
            </div>
          </div>

          <!-- WHITE CLINICAL LOCKUP -->
          <div class="preview-box light-bg">
            <div class="box-tag" style="color: #64748b; background: #e2e8f0;">Fundo Claro (White Biotech)</div>
            <div class="lockup">
              ${c.logoFn(54, true)}
              <div class="lockup-text">
                <div class="brand-title-light">PSL LABS <span class="badge-py-light">PY</span></div>
                <div class="brand-sub-light">PARAGUAY SCIENTIFIC LABORATORIES</div>
              </div>
            </div>
          </div>

          <!-- FLIP-OFF CAP 30MM APPLICATION -->
          <div class="preview-box cap-bg">
            <div class="box-tag" style="color: #38bdf8;">Aplicação na Tampa (Flip-Off 20mm)</div>
            <div class="cap-circle">
              ${c.logoFn(36, false)}
              <div class="cap-text">PSL LABS · PY</div>
            </div>
          </div>

        </div>

      </div>
    `;
  }

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>PSL LABS - 5 Propostas de Rebranding do Logotipo</title>
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
    .wrapper {
      max-width: 1200px;
      width: 100%;
    }
    .header-banner {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 1px solid #1e293b;
    }
    .pill {
      display: inline-block;
      background: rgba(56, 189, 248, 0.12);
      border: 1px solid rgba(56, 189, 248, 0.3);
      color: #38bdf8;
      font-size: 13px;
      font-weight: 800;
      padding: 6px 18px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 14px;
    }
    h1 {
      font-size: 34px;
      font-weight: 900;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #ffffff 40%, #94a3b8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 8px;
    }
    p.header-sub {
      font-size: 16px;
      color: #94a3b8;
    }

    /* Concept Rows */
    .concept-row {
      background: #0c121e;
      border: 1px solid #1e293b;
      border-radius: 18px;
      padding: 26px 30px;
      margin-bottom: 30px;
      box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
    }
    .concept-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 10px;
    }
    .concept-num {
      font-family: 'JetBrains Mono', monospace;
      font-size: 20px;
      font-weight: 900;
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.1);
      border: 1px solid rgba(56, 189, 248, 0.3);
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      flex-shrink: 0;
    }
    .concept-titles { flex: 1; }
    .concept-name {
      font-size: 22px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.2px;
    }
    .concept-sub {
      font-size: 13.5px;
      color: #94a3b8;
      font-weight: 500;
    }
    .concept-tag {
      background: #1e293b;
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.3);
      font-size: 12px;
      font-weight: 700;
      padding: 5px 12px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    .concept-desc {
      font-size: 14px;
      color: #cbd5e1;
      line-height: 1.5;
      margin-bottom: 20px;
      padding-left: 60px;
    }

    /* Previews Grid */
    .previews-grid {
      display: grid;
      grid-template-columns: 1.2fr 1.2fr 0.9fr;
      gap: 20px;
    }
    .preview-box {
      border-radius: 14px;
      padding: 22px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      min-height: 140px;
    }
    .box-tag {
      position: absolute;
      top: 10px;
      left: 14px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #94a3b8;
    }
    .dark-bg {
      background: #090e17;
      border: 1px solid #1e293b;
    }
    .light-bg {
      background: #ffffff;
      border: 1px solid #cbd5e1;
    }
    .cap-bg {
      background: radial-gradient(circle at center, #111c2e 0%, #080d16 100%);
      border: 1px dashed #223249;
    }

    /* Lockup Typography */
    .lockup {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-top: 10px;
    }
    .brand-title-dark {
      font-size: 24px;
      font-weight: 900;
      letter-spacing: 0.5px;
      color: #ffffff;
      line-height: 1;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .brand-title-light {
      font-size: 24px;
      font-weight: 900;
      letter-spacing: 0.5px;
      color: #0f172a;
      line-height: 1;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .brand-sub-dark {
      font-size: 9.5px;
      font-weight: 700;
      letter-spacing: 1.5px;
      color: #38bdf8;
      text-transform: uppercase;
      margin-top: 5px;
    }
    .brand-sub-light {
      font-size: 9.5px;
      font-weight: 700;
      letter-spacing: 1.5px;
      color: #0284c7;
      text-transform: uppercase;
      margin-top: 5px;
    }
    .badge-py-dark {
      font-size: 11px;
      font-weight: 800;
      background: #1e293b;
      color: #38bdf8;
      padding: 2px 7px;
      border-radius: 5px;
      border: 0.5px solid #334155;
    }
    .badge-py-light {
      font-size: 11px;
      font-weight: 800;
      background: #f1f5f9;
      color: #0284c7;
      padding: 2px 7px;
      border-radius: 5px;
      border: 0.5px solid #cbd5e1;
    }

    /* Flip-off Cap Simulation */
    .cap-circle {
      width: 82px;
      height: 82px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #059669 0%, #064e3b 100%);
      box-shadow: 0 6px 14px rgba(0,0,0,0.6), inset 0 2px 3px rgba(255,255,255,0.3);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 1.5px solid #34d399;
      margin-top: 8px;
    }
    .cap-text {
      font-size: 7px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: 0.5px;
      margin-top: 3px;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header-banner">
      <div class="pill">PSL LABS · Rebranding & Identidade Visual</div>
      <h1>5 Novas Opções de Logotipo para PSL LABS</h1>
      <p class="header-sub">Conceitos exclusivos vetorizados e testados em fundo escuro, fundo claro e na tampa de frasco (20mm)</p>
    </div>

    ${cardsHtml}

  </div>
</body>
</html>`;

  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log(`✓ HTML salvo em: ${htmlPath}`);

  console.log("📸 Capturando imagem em altíssima resolução...");
  await new Promise((resolve, reject) => {
    execFile(edgePath, [
      '--headless',
      '--disable-gpu',
      '--screenshot=' + pngPath,
      '--window-size=1260,2250',
      '--hide-scrollbars',
      htmlPath
    ], (err, stdout) => {
      if (err) return reject(err);
      resolve(stdout);
    });
  });

  console.log(`🎉 Imagem final salva com sucesso em:\n${pngPath}`);
}

main().catch(console.error);
