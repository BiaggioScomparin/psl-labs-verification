const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/admin.jsx',
  'src/components/admin/AdminVendas.jsx',
  'src/components/admin/AdminStock.jsx',
  'src/components/admin/AdminCompras.jsx',
  'src/components/admin/AdminPerdas.jsx',
  'src/components/admin/AdminDRE.jsx'
];

for (const f of files) {
  const p = path.join(process.cwd(), f);
  if (!fs.existsSync(p)) continue;
  const content = fs.readFileSync(p, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, i) => {
    if (line.includes('Excluir') || line.includes('Trash') || line.includes('delete') || line.includes('Delete')) {
      console.log(`${f}:${i+1}: ${line.trim()}`);
    }
  });
}
