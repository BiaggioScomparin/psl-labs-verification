import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import QRCode from 'qrcode';
import { execFileSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const artifactDir = "C:\\Users\\biagg\\.gemini\\antigravity\\brain\\eecd8f48-bc30-44c6-9d0f-0a791a01c2f5";
const publicDocsDir = path.join(rootDir, 'public', 'docs');

const outputHtmlPath = path.join(rootDir, 'guia_retatrutida_60mg_3ml.html');
const outputPdfPath = path.join(artifactDir, 'guia_retatrutida_60mg_3ml_psl_labs.pdf');
const outputProjectPdfPath = path.join(publicDocsDir, 'guia_retatrutida_60mg_3ml_psl_labs.pdf');

const previewP1PngPath = path.join(artifactDir, 'preview_guia_retatrutida_p1.png');
const previewP2PngPath = path.join(artifactDir, 'preview_guia_retatrutida_p2.png');
const previewProjectP1Path = path.join(publicDocsDir, 'preview_guia_retatrutida_p1.png');
const previewProjectP2Path = path.join(publicDocsDir, 'preview_guia_retatrutida_p2.png');

async function generateGuide() {
  console.log("⚡ Gerando Versão Otimizada do Guia Clínico - RETATRUTIDA 60MG (3ML)...");

  // Load Logo in Base64
  const logoPath = path.join(rootDir, 'public', 'brand', 'psl-labs-premium-synthesis-line.png');
  let logoBase64 = '';
  if (fs.existsSync(logoPath)) {
    logoBase64 = `data:image/png;base64,${fs.readFileSync(logoPath).toString('base64')}`;
  }

  // Generate QR Code for Interactive Calculator
  const calcUrl = "https://psl-labs-verification.vercel.app/lp";
  const qrCalcDataUrl = await QRCode.toDataURL(calcUrl, {
    margin: 1,
    width: 240,
    errorCorrectionLevel: 'M',
    color: {
      dark: '#145C46',
      light: '#ffffff'
    }
  });

  // Generate QR Code for Batch Verification
  const verifyUrl = "https://psl-labs-verification.vercel.app/v/PSL-TEST-ORIGINAL";
  const qrVerifyDataUrl = await QRCode.toDataURL(verifyUrl, {
    margin: 1,
    width: 240,
    errorCorrectionLevel: 'M',
    color: {
      dark: '#0F172A',
      light: '#ffffff'
    }
  });

  const getStyle = () => `
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
      background: #FFFFFF;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0F172A;
      -webkit-font-smoothing: antialiased;
    }

    .page {
      width: 210mm;
      height: 297mm;
      max-height: 297mm;
      padding: 13mm 15mm 11mm 15mm;
      background: #FFFFFF;
      position: relative;
      overflow: hidden;
      page-break-after: always;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    /* TOP HEADER BAR */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 9px;
      border-bottom: 2.5px solid #145C46;
    }
    .header-logo img {
      height: 42px;
      width: auto;
      object-fit: contain;
    }
    .header-doc-info {
      text-align: right;
    }
    .header-badge {
      display: inline-block;
      background: #145C46;
      color: #FFFFFF;
      font-size: 9.5px;
      font-weight: 800;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      padding: 3.5px 9px;
      border-radius: 5px;
      margin-bottom: 3px;
    }
    .header-meta {
      font-size: 8.5px;
      color: #64748B;
      font-weight: 700;
      letter-spacing: 0.5px;
      font-family: "Courier New", monospace;
    }

    /* COMPOUND HIGHLIGHT HERO */
    .hero-card {
      background: linear-gradient(135deg, #064E3B 0%, #145C46 50%, #0D4131 100%);
      color: #FFFFFF;
      border-radius: 12px;
      padding: 14px 18px;
      margin-top: 10px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 12px rgba(20, 92, 70, 0.25);
    }
    .hero-left h1 {
      font-size: 22px;
      font-weight: 900;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      line-height: 1.1;
      margin-bottom: 3px;
    }
    .hero-left p {
      font-size: 11px;
      color: #A7F3D0;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    .hero-metrics {
      display: flex;
      gap: 10px;
    }
    .metric-pill {
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.28);
      border-radius: 8px;
      padding: 7px 12px;
      text-align: center;
      min-width: 105px;
    }
    .metric-pill .label {
      font-size: 8px;
      text-transform: uppercase;
      color: #D1FAE5;
      font-weight: 700;
      letter-spacing: 0.6px;
    }
    .metric-pill .val {
      font-size: 16px;
      font-weight: 900;
      color: #FFFFFF;
      line-height: 1.2;
      margin-top: 1px;
    }
    .metric-pill .sub {
      font-size: 8px;
      color: #6EE7B7;
      font-weight: 600;
    }

    /* SECTION TITLE */
    .sec-title {
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #0F172A;
      margin-bottom: 7px;
    }
    .sec-title-icon {
      width: 19px;
      height: 19px;
      background: #145C46;
      color: #FFFFFF;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10.5px;
      font-weight: 900;
    }

    /* 3-STEP RECONSTITUTION */
    .steps-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 10px;
      margin-bottom: 12px;
    }
    .step-box {
      border: 1.5px solid #CBD5E1;
      border-radius: 10px;
      padding: 10px 12px;
      background: #F8FAFC;
      border-left: 4.5px solid #145C46;
    }
    .step-badge {
      font-size: 8.5px;
      font-weight: 800;
      color: #145C46;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      margin-bottom: 3px;
    }
    .step-name {
      font-size: 11px;
      font-weight: 800;
      color: #0F172A;
      margin-bottom: 4px;
    }
    .step-desc {
      font-size: 9.5px;
      color: #475569;
      line-height: 1.4;
    }
    .step-alert {
      font-size: 8.5px;
      color: #B91C1C;
      font-weight: 700;
      margin-top: 4px;
      background: #FEE2E2;
      padding: 2.5px 6px;
      border-radius: 4px;
      display: inline-block;
    }

    /* DOSING TABLE */
    .dosing-section {
      margin-bottom: 11px;
    }
    table.dosing-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9.5px;
      border-radius: 9px;
      overflow: hidden;
      border: 1.5px solid #CBD5E1;
    }
    table.dosing-table thead th {
      background: #145C46;
      color: #FFFFFF;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      padding: 7.5px 8px;
      text-align: center;
      font-size: 9px;
    }
    table.dosing-table thead th:first-child {
      text-align: left;
      padding-left: 12px;
    }
    table.dosing-table tbody tr {
      border-bottom: 1px solid #E2E8F0;
    }
    table.dosing-table tbody tr:nth-child(even) {
      background: #F8FAFC;
    }
    table.dosing-table tbody tr.highlight {
      background: #ECFDF5;
      font-weight: 700;
    }
    table.dosing-table tbody td {
      padding: 5.5px 8px;
      text-align: center;
      color: #1E293B;
    }
    table.dosing-table tbody td:first-child {
      text-align: left;
      font-weight: 800;
      color: #0F172A;
      padding-left: 12px;
    }
    .ui-badge {
      display: inline-block;
      background: #145C46;
      color: #FFFFFF;
      font-weight: 900;
      padding: 2.5px 8px;
      border-radius: 5px;
      font-size: 10.5px;
      letter-spacing: 0.4px;
    }
    .ui-badge.alt {
      background: #0284C7;
    }
    .phase-badge {
      display: inline-block;
      font-size: 8px;
      font-weight: 700;
      color: #065F46;
      background: #D1FAE5;
      padding: 2px 7px;
      border-radius: 4px;
    }

    /* SYRINGE VISUAL SCHEMATIC */
    .syringe-schematic {
      background: #F8FAFC;
      border: 1.5px solid #CBD5E1;
      border-radius: 10px;
      padding: 10px 14px;
      margin-bottom: 8px;
    }
    .syringe-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }
    .syringe-title {
      font-size: 10.5px;
      font-weight: 800;
      color: #0F172A;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .syringe-tip {
      font-size: 9px;
      color: #145C46;
      font-weight: 800;
      background: #E8F5EE;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .syringe-callouts {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-top: 7px;
    }
    .callout-box {
      background: #FFFFFF;
      border: 1.5px solid #E2E8F0;
      border-radius: 8px;
      padding: 6px 8px;
      text-align: center;
    }
    .callout-box .c-dose {
      font-size: 9.5px;
      font-weight: 800;
      color: #0F172A;
    }
    .callout-box .c-ui {
      font-size: 13px;
      font-weight: 900;
      color: #145C46;
      margin: 1.5px 0;
    }
    .callout-box .c-sub {
      font-size: 8px;
      color: #64748B;
    }

    /* FOOTER */
    .footer {
      border-top: 1.5px solid #CBD5E1;
      padding-top: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 8.5px;
      color: #64748B;
    }
    .footer-left {
      line-height: 1.45;
    }
    .footer-right {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .footer-qr {
      display: flex;
      align-items: center;
      gap: 7px;
      text-align: right;
    }
    .footer-qr img {
      width: 38px;
      height: 38px;
      border-radius: 4px;
      border: 1px solid #CBD5E1;
      background: #FFFFFF;
    }

    /* ========================================================
       PAGE 2 SPECIFICS
       ======================================================== */
    .injection-sites-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 10px;
      margin-bottom: 12px;
    }
    .site-card {
      border: 1.5px solid #CBD5E1;
      border-radius: 10px;
      background: #F8FAFC;
      padding: 12px 11px;
      text-align: center;
    }
    .site-card-icon {
      font-size: 22px;
      margin-bottom: 4px;
    }
    .site-card h4 {
      font-size: 11px;
      font-weight: 800;
      color: #0F172A;
      margin-bottom: 3px;
    }
    .site-card p {
      font-size: 9px;
      color: #475569;
      line-height: 1.4;
    }
    .site-badge {
      display: inline-block;
      margin-top: 6px;
      font-size: 8px;
      font-weight: 700;
      color: #145C46;
      background: #E8F5EE;
      padding: 2.5px 7px;
      border-radius: 4px;
    }

    .admin-steps-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 7px;
      margin-bottom: 12px;
    }
    .admin-step {
      background: #FFFFFF;
      border: 1.5px solid #CBD5E1;
      border-top: 3.5px solid #145C46;
      border-radius: 8px;
      padding: 9px 7px;
      text-align: center;
    }
    .admin-step-num {
      width: 18px;
      height: 18px;
      background: #145C46;
      color: #FFFFFF;
      border-radius: 50%;
      font-size: 9px;
      font-weight: 800;
      margin: 0 auto 4px auto;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .admin-step-title {
      font-size: 9.5px;
      font-weight: 800;
      color: #0F172A;
      margin-bottom: 3px;
    }
    .admin-step-text {
      font-size: 8px;
      color: #64748B;
      line-height: 1.35;
    }

    .two-col-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 12px;
    }
    .info-card {
      border: 1.5px solid #CBD5E1;
      border-radius: 10px;
      background: #FFFFFF;
      padding: 12px 14px;
    }
    .info-card h4 {
      font-size: 11px;
      font-weight: 800;
      color: #0F172A;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      margin-bottom: 7px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .info-card-list {
      list-style: none;
      font-size: 9px;
      color: #334155;
      line-height: 1.55;
    }
    .info-card-list li {
      margin-bottom: 5px;
      padding-left: 14px;
      position: relative;
    }
    .info-card-list li::before {
      content: "•";
      position: absolute;
      left: 2px;
      color: #145C46;
      font-weight: 900;
      font-size: 12px;
    }
    .info-card-list li.warn::before {
      color: #DC2626;
      content: "!";
    }

    .faq-box {
      background: #F1F5F9;
      border-radius: 10px;
      padding: 11px 14px;
      border-left: 4.5px solid #0284C7;
      margin-bottom: 10px;
    }
    .faq-title {
      font-size: 10.5px;
      font-weight: 800;
      color: #0369A1;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 5px;
    }
    .faq-text {
      font-size: 9px;
      color: #334155;
      line-height: 1.5;
    }

    .cta-banner {
      background: linear-gradient(135deg, #145C46, #0D4131);
      color: #FFFFFF;
      border-radius: 10px;
      padding: 10px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 10px rgba(20, 92, 70, 0.2);
    }
    .cta-left h5 {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      margin-bottom: 3px;
    }
    .cta-left p {
      font-size: 9px;
      color: #A7F3D0;
    }
    .cta-qr-box {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .cta-qr-box img {
      width: 48px;
      height: 48px;
      background: #FFFFFF;
      padding: 2px;
      border-radius: 5px;
    }
    .cta-qr-txt {
      font-size: 8.5px;
      color: #FFFFFF;
      text-align: right;
      line-height: 1.3;
      font-weight: 700;
    }
  `;

  // HTML content of Page 1
  const page1Content = `
    <!-- HEADER -->
    <div class="header">
      <div class="header-logo">
        ${logoBase64 ? `<img src="${logoBase64}" alt="PSL Labs">` : `<div style="font-size:16px; font-weight:900; color:#145C46;">PSL LABS • PREMIUM SYNTHESIS LINE</div>`}
      </div>
      <div class="header-doc-info">
        <div class="header-badge">Guia Oficial do Paciente</div>
        <div class="header-meta">DOC: PSL-RET-60-3ML // HPLC ≥ 99.4%</div>
      </div>
    </div>

    <!-- HERO COMPOUND CARD -->
    <div class="hero-card">
      <div class="hero-left">
        <h1>RETATRUTIDA 60 MG</h1>
        <p>Tri-Agonista GLP-1 / GIP / GCG • Grau Farmacêutico Liofilizado</p>
      </div>
      <div class="hero-metrics">
        <div class="metric-pill">
          <div class="label">Água Adicionada</div>
          <div class="val">3,0 ml</div>
          <div class="sub">Bacteriostática 0.9%</div>
        </div>
        <div class="metric-pill">
          <div class="label">Concentração</div>
          <div class="val">20 mg/ml</div>
          <div class="sub">200 mcg por 1 UI</div>
        </div>
        <div class="metric-pill">
          <div class="label">Dose Base (10 UI)</div>
          <div class="val">2,0 mg</div>
          <div class="sub">Início Clínico 1x/sem</div>
        </div>
      </div>
    </div>

    <!-- SECTION 1: 3-STEP RECONSTITUTION -->
    <div class="sec-title">
      <div class="sec-title-icon">1</div>
      <span>Protocolo de Reconstituição Clínica (Como Preparar o Frasco)</span>
    </div>

    <div class="steps-grid">
      <div class="step-box">
        <div class="step-badge">Passo 01 • Assepsia</div>
        <div class="step-name">Higienização e Coleta</div>
        <div class="step-desc">
          Higienize as mãos e limpe a borracha (septo) do frasco de Retatrutida e da ampola de água com algodão e álcool 70%. Com uma seringa de 3ml ou 5ml, aspire <strong>exatamente 3,0 ml</strong> de água bacteriostática.
        </div>
      </div>

      <div class="step-box">
        <div class="step-badge">Passo 02 • Injeção Suave</div>
        <div class="step-name">Escorrimento Lento</div>
        <div class="step-desc">
          Insira a agulha inclinada em 45°. O frasco possui vácuo: segure o êmbolo e deixe a água escorrer <strong>lentamente pela parede de vidro</strong>.
        </div>
        <div class="step-alert">⚠ NUNCA jogue o jato direto no pó liofilizado!</div>
      </div>

      <div class="step-box">
        <div class="step-badge">Passo 03 • Dissolução</div>
        <div class="step-name">Movimento Circular</div>
        <div class="step-desc">
          Faça movimentos circulares suaves com o frasco na palma da mão até o líquido ficar 100% transparente e translúcido. Deixe repousar por 5 minutos antes da primeira aplicação.
        </div>
        <div class="step-alert">⚠ NUNCA sacuda ou chacoalhe o frasco!</div>
      </div>
    </div>

    <!-- SECTION 2: MASTER DOSING TABLE -->
    <div class="dosing-section">
      <div class="sec-title">
        <div class="sec-title-icon">2</div>
        <span>Tabela Mestra de Dosagem (Seringa de Insulina U-100)</span>
      </div>

      <table class="dosing-table">
        <thead>
          <tr>
            <th>Dose Desejada (mg)</th>
            <th>Volume Líquido</th>
            <th>Puxe na Seringa (UI)</th>
            <th>Fase do Protocolo Sugerida</th>
            <th>Rendimento no Frasco (60mg)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1,0 mg</td>
            <td>0,05 ml</td>
            <td><span class="ui-badge alt">5 UI</span></td>
            <td><span class="phase-badge">Adaptação / Sensibilidade</span></td>
            <td>60 aplicações semanais</td>
          </tr>
          <tr class="highlight">
            <td>★ 2,0 mg (Dose Inicial Padrão)</td>
            <td>0,10 ml</td>
            <td><span class="ui-badge">10 UI</span></td>
            <td><span class="phase-badge">Semanas 1 a 4 (Adaptação Metabólica)</span></td>
            <td><strong>30 aplicações (30 semanas)</strong></td>
          </tr>
          <tr>
            <td>3,0 mg</td>
            <td>0,15 ml</td>
            <td><span class="ui-badge alt">15 UI</span></td>
            <td><span class="phase-badge">Transição Intermediária Suave</span></td>
            <td>20 aplicações semanais</td>
          </tr>
          <tr class="highlight">
            <td>★ 4,0 mg (Degrau Terapêutico 2)</td>
            <td>0,20 ml</td>
            <td><span class="ui-badge">20 UI</span></td>
            <td><span class="phase-badge">Semanas 5 a 8 (Queima & Saciedade Ativa)</span></td>
            <td><strong>15 aplicações (15 semanas)</strong></td>
          </tr>
          <tr>
            <td>5,0 mg</td>
            <td>0,25 ml</td>
            <td><span class="ui-badge alt">25 UI</span></td>
            <td><span class="phase-badge">Ajuste de Titulação Individual</span></td>
            <td>12 aplicações semanais</td>
          </tr>
          <tr class="highlight">
            <td>★ 6,0 mg (Degrau Terapêutico 3)</td>
            <td>0,30 ml</td>
            <td><span class="ui-badge">30 UI</span></td>
            <td><span class="phase-badge">Semanas 9 a 12 (Alta Potência Tri-Agonista)</span></td>
            <td><strong>10 aplicações (10 semanas)</strong></td>
          </tr>
          <tr>
            <td>8,0 mg (Dose Otimizada)</td>
            <td>0,40 ml</td>
            <td><span class="ui-badge">40 UI</span></td>
            <td><span class="phase-badge">Fase Avançada / Manutenção de Peso</span></td>
            <td>7,5 aplicações completas</td>
          </tr>
          <tr>
            <td>10,0 mg</td>
            <td>0,50 ml</td>
            <td><span class="ui-badge">50 UI</span></td>
            <td><span class="phase-badge">Fase Avançada Sob Acompanhamento</span></td>
            <td>6 aplicações completas</td>
          </tr>
          <tr>
            <td>12,0 mg (Teto Clínico de Ensaio)</td>
            <td>0,60 ml</td>
            <td><span class="ui-badge">60 UI</span></td>
            <td><span class="phase-badge">Dose Máxima Estudada em Ensaios</span></td>
            <td>5 aplicações completas</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- SECTION 3: SYRINGE VISUAL REFERENCE -->
    <div class="syringe-schematic">
      <div class="syringe-header">
        <div class="syringe-title">Guia Visual de Leitura na Seringa de Insulina U-100</div>
        <div class="syringe-tip">Fórmula: <strong>UI na Seringa = Dose em mg × 5</strong></div>
      </div>

      <!-- SVG Syringe Scale Simulation -->
      <svg viewBox="0 0 520 48" width="100%" height="44" xmlns="http://www.w3.org/2000/svg">
        <rect x="25" y="10" width="480" height="28" rx="4" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.8" />
        <rect x="15" y="18" width="10" height="12" fill="#CBD5E1" stroke="#0F172A" stroke-width="1.5" />
        <line x1="0" y1="24" x2="15" y2="24" stroke="#94A3B8" stroke-width="1.6" />
        
        <!-- Liquid Fill up to 10 UI (2mg standard initial dose) -->
        <rect x="26" y="11" width="96" height="26" fill="rgba(20, 92, 70, 0.25)" />
        
        <!-- Plunger Head at 10 UI -->
        <rect x="118" y="11" width="7" height="26" fill="#145C46" />
        <rect x="125" y="18" width="375" height="12" fill="#E2E8F0" stroke="#64748B" stroke-width="1" />

        <!-- Syringe Scale Ticks (0 to 50 UI) -->
        ${(() => {
          let ticks = '';
          for (let ui = 0; ui <= 50; ui++) {
            const x = 26 + (ui * 9.48);
            let h = 5;
            let isMajor = (ui % 10 === 0);
            let isMid = (ui % 5 === 0 && !isMajor);
            
            if (isMajor) h = 14;
            else if (isMid) h = 9;

            ticks += `<line x1="${x}" y1="10" x2="${x}" y2="${10 + h}" stroke="#0F172A" stroke-width="${isMajor ? 1.4 : 0.8}" />`;

            if (isMajor) {
              ticks += `<text x="${x}" y="34" font-family="-apple-system, sans-serif" font-size="8" font-weight="800" text-anchor="middle" fill="#0F172A">${ui}</text>`;
            }
          }
          return ticks;
        })()}
      </svg>

      <div class="syringe-callouts">
        <div class="callout-box">
          <div class="c-dose">Dose: 1,0 mg</div>
          <div class="c-ui">5 UI</div>
          <div class="c-sub">1º tracinho médio</div>
        </div>
        <div class="callout-box" style="border-color:#145C46; background:#ECFDF5;">
          <div class="c-dose" style="color:#145C46;">Dose Padrão: 2,0 mg</div>
          <div class="c-ui">10 UI</div>
          <div class="c-sub">Marca do número 10</div>
        </div>
        <div class="callout-box" style="border-color:#145C46; background:#ECFDF5;">
          <div class="c-dose" style="color:#145C46;">Degrau 2: 4,0 mg</div>
          <div class="c-ui">20 UI</div>
          <div class="c-sub">Marca do número 20</div>
        </div>
        <div class="callout-box">
          <div class="c-dose">Degrau 3: 6,0 mg</div>
          <div class="c-ui">30 UI</div>
          <div class="c-sub">Marca do número 30</div>
        </div>
      </div>
    </div>

    <!-- FOOTER PAGE 1 -->
    <div class="footer">
      <div class="footer-left">
        <strong>PSL LABS • Premium Synthesis Line</strong> — Divisão de Pesquisa Farmacêutica em Peptídeos.<br>
        Documento de suporte ao paciente. Protocolo para Retatrutida 60mg reconstituída em 3ml (20mg/ml).
      </div>
      <div class="footer-right">
        <div class="footer-qr">
          <div>
            <div style="font-weight:800; color:#145C46;">Calculadora Digital</div>
            <div>Aponte a câmera</div>
          </div>
          <img src="${qrCalcDataUrl}" alt="QR Code Calculadora">
        </div>
        <div style="font-weight:800; font-family:monospace; font-size:9.5px; color:#145C46;">PÁG 01/02</div>
      </div>
    </div>
  `;

  // HTML content of Page 2
  const page2Content = `
    <!-- HEADER -->
    <div class="header">
      <div class="header-logo">
        ${logoBase64 ? `<img src="${logoBase64}" alt="PSL Labs">` : `<div style="font-size:16px; font-weight:900; color:#145C46;">PSL LABS • PREMIUM SYNTHESIS LINE</div>`}
      </div>
      <div class="header-doc-info">
        <div class="header-badge">Técnica de Aplicação & Conservação</div>
        <div class="header-meta">ADMINISTRAÇÃO SUBCUTÂNEA (SC) // FREQUÊNCIA: 1X/SEMANA</div>
      </div>
    </div>

    <!-- SECTION 1: INJECTION SITES -->
    <div class="sec-title" style="margin-top:10px;">
      <div class="sec-title-icon">3</div>
      <span>Locais Recomendados para Aplicação Subcutânea (SC)</span>
    </div>

    <div class="injection-sites-grid">
      <div class="site-card">
        <div class="site-card-icon">🎯</div>
        <h4>1. Abdômen (Preferencial)</h4>
        <p>Aplique a 2 a 3 dedos de distância do umbigo (cerca de 5 cm), em qualquer quadrante. É a região com absorção mais uniforme e menor sensibilidade à dor.</p>
        <div class="site-badge">Melhor Absorção & Conforto</div>
      </div>

      <div class="site-card">
        <div class="site-card-icon">🦵</div>
        <h4>2. Face Externa da Coxa</h4>
        <p>Região anterior e lateral média da coxa (área com maior concentração de gordura subcutânea). Excelente opção para alternar com a região abdominal.</p>
        <div class="site-badge">Ideal para Alternância</div>
      </div>

      <div class="site-card">
        <div class="site-card-icon">💪</div>
        <h4>3. Posterior do Braço (Tríceps)</h4>
        <p>Face posterior do braço (região do tríceps). Recomendado quando houver auxílio de outra pessoa para segurar a prega da pele durante a injeção.</p>
        <div class="site-badge">Com Auxílio de Terceiro</div>
      </div>
    </div>

    <!-- SECTION 2: 5 STEPS TO INJECT SAFELY -->
    <div class="sec-title">
      <div class="sec-title-icon">4</div>
      <span>Passo a Passo para Injeção Sem Dor e Sem Perdas</span>
    </div>

    <div class="admin-steps-grid">
      <div class="admin-step">
        <div class="admin-step-num">1</div>
        <div class="admin-step-title">Assepsia Dupla</div>
        <div class="admin-step-text">Limpe o septo do frasco com álcool 70%. Em seguida, passe o algodão com álcool no local da pele e aguarde secar.</div>
      </div>
      <div class="admin-step">
        <div class="admin-step-num">2</div>
        <div class="admin-step-title">Injetar Ar</div>
        <div class="admin-step-text">Puxe o êmbolo da seringa vazia até a sua marca de UI. Injete esse ar dentro do frasco para equalizar a pressão interna.</div>
      </div>
      <div class="admin-step">
        <div class="admin-step-num">3</div>
        <div class="admin-step-title">Aspirar a Dose</div>
        <div class="admin-step-text">Vire o frasco de ponta cabeça e aspire lentamente até o tracinho exato da sua dose em UI. Verifique se não há bolhas de ar.</div>
      </div>
      <div class="admin-step">
        <div class="admin-step-num">4</div>
        <div class="admin-step-title">Fazer a Prega</div>
        <div class="admin-step-text">Com o polegar e o indicador, faça uma leve prega na pele. Insira a agulha em ângulo de 90° e pressione o êmbolo até o fim.</div>
      </div>
      <div class="admin-step">
        <div class="admin-step-num">5</div>
        <div class="admin-step-title">Esperar 5 a 10s</div>
        <div class="admin-step-text">Mantenha a agulha inserida por 5 a 10 segundos antes de puxar. Isso evita qualquer vazamento ou refluxo do medicamento.</div>
      </div>
    </div>

    <!-- SECTION 3: STORAGE AND SAFETY RULES (2 COLUMNS) -->
    <div class="two-col-grid">
      <div class="info-card">
        <h4>❄ Regras Críticas de Conservação</h4>
        <ul class="info-card-list">
          <li><strong>Refrigeração Contínua Obrigatória (2°C a 8°C):</strong> Após reconstituído com o líquido, guarde imediatamente na geladeira.</li>
          <li><strong>Posição Correta:</strong> Mantenha na prateleira interna do meio. <strong>NUNCA coloque na porta da geladeira</strong> (onde a temperatura varia com o abre e fecha).</li>
          <li class="warn"><strong>NUNCA CONGELAR:</strong> O congelamento quebra a estrutura proteica e destrói o efeito biológico da Retatrutida.</li>
          <li><strong>Proteção Luminosa:</strong> Guarde o frasco dentro da caixa ou envolto em papel alumínio para proteger da luz solar direta.</li>
          <li><strong>Validade Refrigerado:</strong> Com água bacteriostática contendo 0,9% de álcool benzílico, o frasco mantém esterilidade por até <strong>30 dias</strong> refrigerado.</li>
        </ul>
      </div>

      <div class="info-card">
        <h4>💧 Manejo de Sintomas & Dicas Clínicas</h4>
        <ul class="info-card-list">
          <li><strong>Super-Hidratação (2,5L a 3L/dia):</strong> A Retatrutida aumenta o gasto energético e a eliminação de líquidos. Beba água ao longo de todo o dia.</li>
          <li><strong>Fracione as Refeições:</strong> O esvaziamento gástrico fica mais lento. Coma porções menores e mastigue muito bem para evitar refluxo ou empachamento.</li>
          <li><strong>Priorize Proteínas Magras:</strong> Consuma ovos, frango, peixes ou whey para manter sua massa muscular durante o processo de redução de gordura.</li>
          <li><strong>Evite Frituras e Gorduras Pesadas:</strong> Alimentos muito gordurosos aumentam significativamente a chance de náuseas.</li>
          <li><strong>Náuseas Leves Iniciais:</strong> São comuns na fase de adaptação (semanas 1 e 2). Chá de gengibre ou hortelã gelado proporcionam alívio imediato.</li>
        </ul>
      </div>
    </div>

    <!-- FAQ & IMPORTANT SAFETY NOTE -->
    <div class="faq-box">
      <div class="faq-title">Perguntas Frequentes & Diretrizes de Segurança</div>
      <div class="faq-text">
        • <strong>Esqueci de aplicar no dia programado, o que fazer?</strong> Aplique assim que lembrar, desde que faltem pelo menos 3 dias para a próxima dose agendada. Nunca dobre a dose.<br>
        • <strong>Posso reaproveitar a seringa ou agulha?</strong> NUNCA. Cada aplicação exige uma seringa nova estéril descartável para evitar contaminação do frasco e infecções de pele.<br>
        • <strong>Frequência de aplicação:</strong> A Retatrutida possui meia-vida longa (~6 dias). A administração recomendada em protocolos clínicos é de <strong>apenas 1 vez por semana</strong>, sempre no mesmo dia.
      </div>
    </div>

    <!-- CTA BANNER & SUPPORT -->
    <div class="cta-banner">
      <div class="cta-left">
        <h5>Acesso ao Catálogo Oficial & Validação de Autenticidade</h5>
        <p>Consulte laudos cromatográficos (HPLC), dados analíticos e verifique o lote do seu frasco via QR Code.</p>
      </div>
      <div class="cta-qr-box">
        <div class="cta-qr-txt">
          <div>Portal PSL LABS</div>
          <div>Aponte a câmera</div>
        </div>
        <img src="${qrVerifyDataUrl}" alt="QR Autenticidade">
      </div>
    </div>

    <!-- FOOTER PAGE 2 -->
    <div class="footer">
      <div class="footer-left">
        <strong>PSL LABS • Premium Synthesis Line</strong> — Padrão de Alta Pureza Farmacêutica Analítica.<br>
        Este material tem finalidade estritamente informativa e de orientação técnica para reconstituição correta.
      </div>
      <div class="footer-right">
        <div class="footer-qr">
          <div>
            <div style="font-weight:800; color:#145C46;">Calculadora Digital</div>
            <div>Aponte a câmera</div>
          </div>
          <img src="${qrCalcDataUrl}" alt="QR Code Calculadora">
        </div>
        <div style="font-weight:800; font-family:monospace; font-size:9.5px; color:#145C46;">PÁG 02/02</div>
      </div>
    </div>
  `;

  // Full 2-Page HTML for PDF
  const fullHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Guia de Reconstituição e Dosagem - Retatrutida 60mg (3ml) | PSL LABS</title>
  <style>
    ${getStyle()}
  </style>
</head>
<body>
  <div class="page">${page1Content}</div>
  <div class="page">${page2Content}</div>
</body>
</html>`;

  fs.writeFileSync(outputHtmlPath, fullHtml, 'utf8');
  console.log(`✓ HTML completo salvo em: ${outputHtmlPath}`);

  if (fs.existsSync(edgePath)) {
    console.log("Compilando PDF Oficial de Instruções de 2 Páginas com Edge...");
    const fileUri = `file:///${outputHtmlPath.replace(/\\/g, '/')}`;

    // 1. Generate Full Vector PDF
    execFileSync(edgePath, [
      '--headless',
      '--disable-gpu',
      '--no-margins',
      `--print-to-pdf=${outputPdfPath}`,
      fileUri
    ]);
    console.log(`🎉 PDF gerado com sucesso em:\n${outputPdfPath}`);
    fs.copyFileSync(outputPdfPath, outputProjectPdfPath);

    // 2. Generate Single-Page HTML for Page 1 Screenshot
    const p1Html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><style>${getStyle()}</style></head><body><div class="page" style="page-break-after:avoid;">${page1Content}</div></body></html>`;
    const p1Path = path.join(rootDir, 'guia_p1_temp.html');
    fs.writeFileSync(p1Path, p1Html, 'utf8');

    console.log("Gerando imagem de preview da Página 1...");
    execFileSync(edgePath, [
      '--headless',
      '--disable-gpu',
      '--window-size=1200,1697',
      '--hide-scrollbars',
      `--screenshot=${previewP1PngPath}`,
      `file:///${p1Path.replace(/\\/g, '/')}`
    ]);
    fs.copyFileSync(previewP1PngPath, previewProjectP1Path);
    console.log(`✓ Preview Página 1 salvo em: ${previewP1PngPath}`);

    // 3. Generate Single-Page HTML for Page 2 Screenshot
    const p2Html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><style>${getStyle()}</style></head><body><div class="page" style="page-break-after:avoid;">${page2Content}</div></body></html>`;
    const p2Path = path.join(rootDir, 'guia_p2_temp.html');
    fs.writeFileSync(p2Path, p2Html, 'utf8');

    console.log("Gerando imagem de preview da Página 2...");
    execFileSync(edgePath, [
      '--headless',
      '--disable-gpu',
      '--window-size=1200,1697',
      '--hide-scrollbars',
      `--screenshot=${previewP2PngPath}`,
      `file:///${p2Path.replace(/\\/g, '/')}`
    ]);
    fs.copyFileSync(previewP2PngPath, previewProjectP2Path);
    console.log(`✓ Preview Página 2 salvo em: ${previewP2PngPath}`);

    // Clean up temp preview files
    if (fs.existsSync(p1Path)) fs.unlinkSync(p1Path);
    if (fs.existsSync(p2Path)) fs.unlinkSync(p2Path);
  }

  console.log("✅ Concluído com sucesso total!");
}

generateGuide().catch(console.error);
