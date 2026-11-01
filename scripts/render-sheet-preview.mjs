import { execFile } from 'child_process';
import path from 'path';

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const htmlPath = "C:\\Users\\biagg\\.gemini\\antigravity\\scratch\\psl-labs-verification\\etiquetas_spiral_a4351.html";
const outPng = "C:\\Users\\biagg\\.gemini\\antigravity\\brain\\eecd8f48-bc30-44c6-9d0f-0a791a01c2f5\\preview_folha_dark_biotech.png";

const fileUri = `file:///${htmlPath.replace(/\\/g, '/')}`;

execFile(edgePath, [
  '--headless',
  '--disable-gpu',
  '--window-size=1200,1700',
  '--hide-scrollbars',
  `--screenshot=${outPng}`,
  fileUri
], (err) => {
  if (err) {
    console.error("Erro:", err);
  } else {
    console.log("✓ Screenshot da folha completa salvo em:", outPng);
  }
});
