// Clip de prueba image-to-video para la pasarela Macumba (usa la foto 02-roja-espalda)
// Endpooint directo: POST /video/generation → task id; luego GET /async-result?id=...
import fs from 'fs';
import path from 'path';

const cfg = JSON.parse(fs.readFileSync('/etc/.z-ai-config', 'utf-8'));
const BASE = cfg.baseUrl.replace(/\/+$/, '');
const src = '/home/z/my-project/download/macumba-pasarela/02-roja-espalda.png';
const outFile = '/home/z/my-project/download/macumba-pasarela/clip-prueba-02.json';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function headers() {
  const h = { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.apiKey}`, 'X-Z-AI-From': 'Z' };
  if (cfg.chatId) h['X-Chat-Id'] = cfg.chatId;
  if (cfg.userId) h['X-User-Id'] = cfg.userId;
  if (cfg.token) h['X-Token'] = cfg.token;
  return h;
}

const dataUrl = `data:image/png;base64,${fs.readFileSync(src).toString('base64')}`;

const body = {
  prompt:
    'The male model walks forward on a fashion runway away from the camera, showing the hand-painted back of his red denim jacket. Smooth cinematic camera tracking at low angle, editorial fashion film look, studio lighting, the painted artwork on the jacket stays sharp and unchanged. Slow elegant runway walk, confident.',
  image_url: dataUrl,
  quality: 'quality',
  size: '864x1152',
  fps: 30,
  duration: 5,
};

const res = await fetch(`${BASE}/video/generation`, {
  method: 'POST',
  headers: headers(),
  body: JSON.stringify(body),
});
const text = await res.text();
console.log('estado:', res.status);
if (!res.ok) {
  console.log('error:', text.slice(0, 400));
  process.exit(1);
}
const task = JSON.parse(text);
console.log('task:', task.id, task.task_status);
fs.writeFileSync(outFile, JSON.stringify(task, null, 2));

// Poll
let result = task;
for (let i = 0; i < 60; i++) {
  await sleep(10000);
  const r = await fetch(`${BASE}/async-result?id=${encodeURIComponent(task.id)}`, { headers: headers() });
  result = await r.json();
  console.log(`poll ${i + 1}: ${result.task_status}`);
  if (result.task_status !== 'PROCESSING') break;
}
fs.writeFileSync(outFile.replace('.json', '-final.json'), JSON.stringify(result, null, 2));
console.log('final:', JSON.stringify(result).slice(0, 600));
