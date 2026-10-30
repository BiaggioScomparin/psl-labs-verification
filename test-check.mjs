import fs from 'fs';
import path from 'path';

const htmlPath = 'C:\\Users\\biagg\\.gemini\\antigravity\\scratch\\psl-labs-verification\\etiquetas_spiral_a4351.html';
const content = fs.readFileSync(htmlPath, 'utf8');

// Check if any element had overflow
console.log('Sheet contains labels:', (content.match(/class=\"label\"/g) || []).length);
