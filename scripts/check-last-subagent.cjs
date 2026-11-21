const fs = require('fs');
const path = 'C:/Users/biagg/.gemini/antigravity/brain/9871fb80-a6a9-4fd9-a5e0-3fe1ce780260/.system_generated/logs/transcript.jsonl';
if (fs.existsSync(path)) {
  const lines = fs.readFileSync(path, 'utf8').trim().split('\n');
  const lastLine = JSON.parse(lines[lines.length - 1]);
  console.log(lastLine.content);
}
