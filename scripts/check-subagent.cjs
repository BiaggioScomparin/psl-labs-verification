const fs = require('fs');
const path = 'C:/Users/biagg/.gemini/antigravity/brain/9871fb80-a6a9-4fd9-a5e0-3fe1ce780260/.system_generated/logs/transcript.jsonl';
if (fs.existsSync(path)) {
  const lines = fs.readFileSync(path, 'utf8').trim().split('\n');
  console.log('Total lines:', lines.length);
  for (const line of lines.slice(-4)) {
    try {
      const obj = JSON.parse(line);
      console.log(`[Step ${obj.step_index}] ${obj.source} ${obj.type}`);
      if (obj.content) console.log('Content:', String(obj.content).slice(0, 300));
    } catch(e) {}
  }
} else {
  console.log('File does not exist');
}
