import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import QRCode from 'qrcode';
import { execFile } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const outputHtmlPath = path.join(rootDir, 'preview_modelos_etiquetas.html');
const outputPngPath = "C:\\Users\\biagg\\.gemini\\antigravity\\brain\\eecd8f48-bc30-44c6-9d0f-0a791a01c2f5\\amostras_etiquetas_coloridas.png";

// HexaShield Logo SVG variants
const LOGO_DARK_BG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle; flex-shrink:0;">
  <path d="M12 2L3 7V12C3 17.5 6.8 21.7 12 23C17.2 21.7 21 17.5 21 12V7L12 2Z" fill="#0f172a" stroke="#38bdf8" stroke-width="1.4"/>
  <path d="M12 6V18M7.5 9.5L16.5 14.5M16.5 9.5L7.5 14.5" stroke="#38bdf8" stroke-width="1.6" stroke-linecap="round"/>
  <circle cx="12" cy="12" r="2.8" fill="#10b981" stroke="#ffffff" stroke-width="0.8"/>
</svg>`;

const LOGO_LIGHT_BG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle; flex-shrink:0;">
  <path d="M12 2L3 7V12C3 17.5 6.8 21.7 12 23C17.2 21.7 21 17.5 21 12V7L12 2Z" fill="#000000" stroke="#1e3a8a" stroke-width="1.2"/>
  <path d="M12 6V18M7.5 9.5L16.5 14.5M16.5 9.5L7.5 14.5" stroke="#38bdf8" stroke-width="1.6" stroke-linecap="round"/>
  <circle cx="12" cy="12" r="2.8" fill="#10b981" stroke="#ffffff" stroke-width="0.8"/>
</svg>`;

async function main() {
  const qrDataUrl = await QRCode.toDataURL("https://psl-labs-verification.vercel.app/v/GHK50-DEMO1", {
    margin: 2,
    width: 400,
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
  <title>Amostras de Etiquetas Coloridas - Spiral A4351</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background: #0f172a;
      color: #f8fafc;
      padding: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    .header {
      text-align: center;
      margin-bottom: 35px;
      max-width: 900px;
    }
    .badge-sub {
      display: inline-block;
      background: rgba(56, 189, 248, 0.15);
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.3);
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    h1 {
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #ffffff;
      margin-bottom: 8px;
    }
    p.desc {
      color: #94a3b8;
      font-size: 15px;
      line-height: 1.5;
    }

    .grid-container {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 28px;
      max-width: 1100px;
      width: 100%;
    }

    .card-sample {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 16px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    .card-title {
      font-size: 17px;
      font-weight: 700;
      color: #f1f5f9;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .tag-style {
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 6px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .tag-dark { background: #38bdf8; color: #0f172a; }
    .tag-bicolor { background: #818cf8; color: #0f172a; }
    .tag-soft { background: #34d399; color: #0f172a; }
    .tag-clean { background: #e2e8f0; color: #0f172a; }

    /* PHYSICAL STICKER SIMULATION - Exact proportions: 38.2mm x 21.2mm (ratio 1.802) */
    /* Rendered enlarged for crisp screen preview: width 382px, height 212px */
    .sticker-wrapper {
      background: #090d16;
      border: 2px dashed #475569;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 16px;
    }

    .sticker {
      width: 382px;
      height: 212px;
      border-radius: 8px;
      box-shadow: 0 8px 20px rgba(0,0,0,0.45);
      position: relative;
      display: flex;
      padding: 14px;
      gap: 12px;
      overflow: hidden;
      font-family: 'Inter', system-ui, sans-serif;
    }

    /* DETAILS INSIDE LABELS */
    .sticker .col-left {
      width: 130px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .sticker .qr-box {
      width: 120px;
      height: 120px;
      background: #ffffff;
      border-radius: 8px;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    }
    .sticker .qr-box img {
      width: 100%;
      height: 100%;
      display: block;
    }
    .sticker .serial {
      font-family: monospace;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.5px;
      margin-top: 6px;
      text-align: center;
    }

    .sticker .col-right {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
    }

    .sticker .brand-row {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .sticker .brand-name {
      font-size: 15px;
      font-weight: 900;
      letter-spacing: -0.3px;
    }
    .sticker .origin {
      font-size: 10px;
      font-weight: 800;
      margin-left: auto;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .sticker .product-title {
      font-size: 18px;
      font-weight: 900;
      letter-spacing: -0.5px;
      line-height: 1.1;
      margin-top: 4px;
      margin-bottom: 4px;
    }

    .sticker .meta-box {
      font-size: 10.5px;
      line-height: 1.4;
      font-weight: 600;
    }
    .sticker .meta-box strong {
      font-weight: 800;
    }

    .sticker .security-seal {
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    /* THEME 1: DARK BIOTECH */
    .sticker.theme-dark {
      background: linear-gradient(135deg, #0b1528 0%, #060e1d 100%);
      border: 1px solid rgba(56, 189, 248, 0.25);
    }
    .theme-dark .serial { color: #94a3b8; }
    .theme-dark .brand-name { color: #ffffff; }
    .theme-dark .brand-name span { color: #38bdf8; }
    .theme-dark .origin { background: rgba(16, 185, 129, 0.2); color: #34d399; }
    .theme-dark .product-title { color: #38bdf8; }
    .theme-dark .meta-box { color: #94a3b8; }
    .theme-dark .meta-box strong { color: #f1f5f9; }
    .theme-dark .security-seal { color: #34d399; }

    /* THEME 2: BICOLOR (GHK-Cu BLUE ACCENT) */
    .sticker.theme-bicolor {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0;
    }
    .theme-bicolor .top-banner {
      background: linear-gradient(90deg, #1e3a8a 0%, #2563eb 100%);
      padding: 6px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #ffffff;
    }
    .theme-bicolor .top-banner .brand-name { color: #ffffff; font-size: 13px; }
    .theme-bicolor .top-banner .brand-name span { color: #38bdf8; }
    .theme-bicolor .top-banner .origin { background: rgba(255,255,255,0.2); color: #ffffff; }
    .theme-bicolor .body-split {
      display: flex;
      flex: 1;
      padding: 10px 14px 12px 14px;
      gap: 12px;
    }
    .theme-bicolor .serial { color: #475569; }
    .theme-bicolor .product-title { color: #1e3a8a; }
    .theme-bicolor .meta-box { color: #475569; }
    .theme-bicolor .meta-box strong { color: #0f172a; }
    .theme-bicolor .security-seal { color: #059669; }

    /* THEME 3: SOFT ICE BLUE (HIGH TECH SAFE) */
    .sticker.theme-soft {
      background: #f0f7ff;
      border: 1px solid #bfdbfe;
    }
    .theme-soft .qr-box {
      border: 1px solid #dbeafe;
    }
    .theme-soft .serial { color: #475569; }
    .theme-soft .brand-name { color: #0f172a; }
    .theme-soft .brand-name span { color: #0284c7; }
    .theme-soft .origin { background: #dcfce7; color: #15803d; }
    .theme-soft .product-title { color: #0369a1; }
    .theme-soft .meta-box { color: #334155; }
    .theme-soft .meta-box strong { color: #0f172a; }
    .theme-soft .security-seal { color: #059669; }

    /* THEME 4: CLEAN WHITE ORIGINAL (ATUAL) */
    .sticker.theme-white {
      background: #ffffff;
      border: 1px solid #e2e8f0;
    }
    .theme-white .serial { color: #334155; }
    .theme-white .brand-name { color: #000000; }
    .theme-white .brand-name span { color: #059669; }
    .theme-white .origin { background: #ecfdf5; color: #047857; }
    .theme-white .product-title { color: #1e3a8a; }
    .theme-white .meta-box { color: #334155; }
    .theme-white .meta-box strong { color: #000000; }
    .theme-white .security-seal { color: #059669; }

    .card-footer-info {
      font-size: 13px;
      color: #94a3b8;
      line-height: 1.4;
      border-top: 1px solid #334155;
      padding-top: 12px;
      margin-top: auto;
    }
    .card-footer-info strong {
      color: #e2e8f0;
    }
    .pro-con {
      display: flex;
      gap: 16px;
      margin-top: 6px;
      font-size: 12px;
    }
    .pro { color: #34d399; }
    .con { color: #fbbf24; }
  </style>
</head>
<body>

  <div class="header">
    <div class="badge-sub">PSL LABS · Laboratório Científico</div>
    <h1>Comparativo de Estilos: Fundo Colorido vs Branco</h1>
    <p class="desc">Amostras ampliadas mantendo a proporção exata da folha Spiral A4351 (38,2 × 21,2 mm). Todas mantêm o QR Code com módulo de segurança óptica de leitura rápida.</p>
  </div>

  <div class="grid-container">

    <!-- OPÇÃO 1: DARK BIOTECH -->
    <div class="card-sample">
      <div class="card-header">
        <div class="card-title">1. Dark Premium Biotech</div>
        <span class="tag-style tag-dark">Alta Tecnologia</span>
      </div>

      <div class="sticker-wrapper">
        <div class="sticker theme-dark">
          <div class="col-left">
            <div class="qr-box">
              <img src="${qrDataUrl}" alt="QR" />
            </div>
            <div class="serial">GHK50-8F92A</div>
          </div>
          <div class="col-right">
            <div class="brand-row">
              ${LOGO_DARK_BG}
              <div class="brand-name">PSL <span>LABS</span></div>
              <div class="origin">🇵🇾 PY</div>
            </div>
            <div class="product-title">GHK CU 50 MG</div>
            <div class="meta-box">
              <div>LOTE: <strong>LOT-2026-01</strong></div>
              <div>FAB: <strong>10/26</strong> · VAL: <strong>10/28</strong></div>
            </div>
            <div class="security-seal">✓ Verifique Autenticidade</div>
          </div>
        </div>
      </div>

      <div class="card-footer-info">
        <strong>Visual:</strong> Fundo azul noite escuro com detalhes em ciano e branco. Aparência luxuosa e internacional.
        <div class="pro-con">
          <span class="pro">✓ Visual ultra premium</span>
          <span class="con">⚠️ Exige sangria no corte e gasta mais tinta</span>
        </div>
      </div>
    </div>

    <!-- OPÇÃO 2: BICOLOR FAIXA -->
    <div class="card-sample">
      <div class="card-header">
        <div class="card-title">2. Identidade Bicolor (Faixa Azul)</div>
        <span class="tag-style tag-bicolor">Recomendado</span>
      </div>

      <div class="sticker-wrapper">
        <div class="sticker theme-bicolor">
          <div class="top-banner">
            <div class="brand-row">
              ${LOGO_DARK_BG}
              <div class="brand-name">PSL <span>LABS</span></div>
            </div>
            <div class="origin">🇵🇾 PY</div>
          </div>
          <div class="body-split">
            <div class="col-left" style="width: 100px;">
              <div class="qr-box" style="width: 100px; height: 100px; box-shadow:none; border: 1px solid #e2e8f0;">
                <img src="${qrDataUrl}" alt="QR" />
              </div>
              <div class="serial">GHK50-8F92A</div>
            </div>
            <div class="col-right">
              <div class="product-title" style="margin-top:0;">GHK CU 50 MG</div>
              <div class="meta-box">
                <div>LOTE: <strong>LOT-2026-01</strong></div>
                <div>FAB: <strong>10/26</strong> · VAL: <strong>10/28</strong></div>
              </div>
              <div class="security-seal">✓ Verifique Autenticidade</div>
            </div>
          </div>
        </div>
      </div>

      <div class="card-footer-info">
        <strong>Visual:</strong> Cabeçalho com faixa na cor do peptídeo (Azul Royal) e corpo branco puro.
        <div class="pro-con">
          <span class="pro">✓ Destaque imediato do produto</span>
          <span class="pro">✓ Muito seguro na impressão</span>
        </div>
      </div>
    </div>

    <!-- OPÇÃO 3: SOFT ICE BLUE -->
    <div class="card-sample">
      <div class="card-header">
        <div class="card-title">3. Fundo Soft (Azul Gelo)</div>
        <span class="tag-style tag-soft">Elegante & Seguro</span>
      </div>

      <div class="sticker-wrapper">
        <div class="sticker theme-soft">
          <div class="col-left">
            <div class="qr-box">
              <img src="${qrDataUrl}" alt="QR" />
            </div>
            <div class="serial">GHK50-8F92A</div>
          </div>
          <div class="col-right">
            <div class="brand-row">
              ${LOGO_LIGHT_BG}
              <div class="brand-name">PSL <span>LABS</span></div>
              <div class="origin">🇵🇾 PY</div>
            </div>
            <div class="product-title">GHK CU 50 MG</div>
            <div class="meta-box">
              <div>LOTE: <strong>LOT-2026-01</strong></div>
              <div>FAB: <strong>10/26</strong> · VAL: <strong>10/28</strong></div>
            </div>
            <div class="security-seal">✓ Verifique Autenticidade</div>
          </div>
        </div>
      </div>

      <div class="card-footer-info">
        <strong>Visual:</strong> Fundo azul gelo sutil com contraste nítido em azul marinho.
        <div class="pro-con">
          <span class="pro">✓ Secagem rápida / Não mancha</span>
          <span class="pro">✓ Tolerante a micro desvios da impressora</span>
        </div>
      </div>
    </div>

    <!-- OPÇÃO 4: MODELO ATUAL BRANCO -->
    <div class="card-sample">
      <div class="card-header">
        <div class="card-title">4. Modelo Atual (Branco Farmacêutico)</div>
        <span class="tag-style tag-clean">Padrão Clínico</span>
      </div>

      <div class="sticker-wrapper">
        <div class="sticker theme-white">
          <div class="col-left">
            <div class="qr-box" style="box-shadow:none; border:1px solid #f1f5f9;">
              <img src="${qrDataUrl}" alt="QR" />
            </div>
            <div class="serial">GHK50-8F92A</div>
          </div>
          <div class="col-right">
            <div class="brand-row">
              ${LOGO_LIGHT_BG}
              <div class="brand-name">PSL <span>LABS</span></div>
              <div class="origin">🇵🇾 PY</div>
            </div>
            <div class="product-title">GHK CU 50 MG</div>
            <div class="meta-box">
              <div>LOTE: <strong>LOT-2026-01</strong></div>
              <div>FAB: <strong>10/26</strong> · VAL: <strong>10/28</strong></div>
            </div>
            <div class="security-seal">✓ Verifique Autenticidade</div>
          </div>
        </div>
      </div>

      <div class="card-footer-info">
        <strong>Visual:</strong> Branco farmacêutico clássico com máxima economia de tinta e contraste máximo.
        <div class="pro-con">
          <span class="pro">✓ Risco zero de falha no corte</span>
          <span class="pro">✓ Maior velocidade de leitura</span>
        </div>
      </div>
    </div>

  </div>

</body>
</html>`;

  fs.writeFileSync(outputHtmlPath, html, 'utf8');
  console.log(`✓ HTML gerado em: ${outputHtmlPath}`);

  if (fs.existsSync(edgePath)) {
    console.log("Gerando screenshot de alta definição...");
    const fileUri = `file:///${outputHtmlPath.replace(/\\/g, '/')}`;

    execFile(edgePath, [
      '--headless',
      '--disable-gpu',
      '--window-size=1200,1350',
      '--hide-scrollbars',
      `--screenshot=${outputPngPath}`,
      fileUri
    ], (err) => {
      if (err) {
        console.error("Erro ao gerar screenshot:", err);
      } else {
        console.log(`🎉 Imagem gerada com sucesso em:\n${outputPngPath}`);
      }
    });
  }
}

main().catch(console.error);
