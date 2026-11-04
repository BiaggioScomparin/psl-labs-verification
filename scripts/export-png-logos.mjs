import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFile } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const publicBrandDir = path.join(rootDir, 'public', 'brand');
const artifactBrandDir = path.join('C:', 'Users', 'biagg', '.gemini', 'antigravity', 'brain', 'eecd8f48-bc30-44c6-9d0f-0a791a01c2f5', 'brand');
const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const items = [
  {
    name: 'psl-labs-horizontal-dark',
    svgFile: 'psl-labs-horizontal-dark.svg',
    width: 1360,
    height: 320,
    bg: 'transparent'
  },
  {
    name: 'psl-labs-horizontal-light',
    svgFile: 'psl-labs-horizontal-light.svg',
    width: 1360,
    height: 320,
    bg: 'transparent'
  },
  {
    name: 'psl-labs-symbol',
    svgFile: 'psl-labs-symbol.svg',
    width: 800,
    height: 800,
    bg: 'transparent'
  },
  {
    name: 'psl-labs-vertical-dark',
    svgFile: 'psl-labs-vertical-dark.svg',
    width: 800,
    height: 800,
    bg: 'transparent'
  }
];

async function run() {
  for (const item of items) {
    const svgPath = path.join(publicBrandDir, item.svgFile);
    const svgContent = fs.readFileSync(svgPath, 'utf8');

    const tempHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@700;800;900&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: ${item.width}px;
      height: ${item.height}px;
      background: transparent;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    svg {
      width: 100%;
      height: 100%;
    }
  </style>
</head>
<body>
  ${svgContent}
</body>
</html>`;

    const tempHtmlPath = path.join(rootDir, `temp_${item.name}.html`);
    fs.writeFileSync(tempHtmlPath, tempHtml, 'utf8');

    const outPngPath1 = path.join(publicBrandDir, `${item.name}.png`);
    const outPngPath2 = path.join(artifactBrandDir, `${item.name}.png`);

    await new Promise((resolve) => {
      execFile(edgePath, [
        '--headless',
        '--disable-gpu',
        '--default-background-color=00000000',
        `--window-size=${item.width},${item.height}`,
        '--hide-scrollbars',
        `--screenshot=${outPngPath1}`,
        `file:///${tempHtmlPath.replace(/\\/g, '/')}`
      ], (err) => {
        if (!err) {
          fs.copyFileSync(outPngPath1, outPngPath2);
          console.log(`✓ PNG gerado: ${item.name}.png`);
        }
        if (fs.existsSync(tempHtmlPath)) fs.unlinkSync(tempHtmlPath);
        resolve();
      });
    });
  }
  console.log("🎉 Todos os logos PNG transparentes foram exportados!");
}

run().catch(console.error);
