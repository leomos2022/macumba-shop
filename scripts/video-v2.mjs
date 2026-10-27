// Clips v2 para la pasarela Macumba — estrategia anti-warping:
// cámara bloqueada + movimiento mínimo (el arte pintado se deforma cuando el cuerpo se mueve mucho)
// Uso: node video-v2.mjs [A|B]
import fs from 'fs';
import path from 'path';

const cfg = JSON.parse(fs.readFileSync('/etc/.z-ai-config', 'utf-8'));
const BASE = cfg.baseUrl.replace(/\/+$/, '');
const outDir = '/home/z/my-project/download/macumba-pasarela';
const src = path.join(outDir, '02-roja-espalda.png');

const STABLE = 'The hand-painted artwork on the back of the jacket remains perfectly fixed and identical in every frame: same portrait, same colors, same brushstrokes, moving only naturally with the fabric, never morphing, never redrawing. Locked tripod camera, no zoom, no camera drift. Editorial fashion film, soft studio lighting, photorealistic.';

const variants = {
  A: {
    file: 'clip-v2A-micro.mp4',
    prompt: `A male model stands still showing the painted back of his red denim jacket to the camera. Only his head slowly turns over his right shoulder and the fabric sways very subtly. Minimal body movement. ${STABLE}`,
  },
  B: {
    file: 'clip-v2B-paso.mp4',
    prompt: `A male model takes one single slow elegant step forward away from the camera on a fashion runway, then stops, showing the painted back of his red denim jacket. Calm confident posture, no turning around. ${STABLE}`,
  },
  C: {
    file: 'clip-v2C-camara.mp4',
    prompt: `The male model stands completely frozen like a statue, body not moving at all. Only the camera performs a slow cinematic dolly-in toward the painted back of his red denim jacket. The hand-painted artwork stays pixel-identical and razor sharp in every single frame, zero morphing, zero redrawing. Editorial fashion film, soft studio lighting, photorealistic.`,
  },
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function headers() {
  const h = { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.apiKey}`, 'X-Z-AI-From': 'Z' };
  if (cfg.chatId) h['X-Chat-Id'] = cfg.chatId;
  if (cfg.userId) h['X-User-Id'] = cfg.userId;
  if (cfg.token) h['X-Token'] = cfg.token;
  return h;
}

async function genClip(key) {
  const v = variants[key];
  const dataUrl = `data:image/png;base64,${fs.readFileSync(src).toString('base64')}`;
  const res = await fetch(`${BASE}/video/generation`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      prompt: v.prompt,
      image_url: dataUrl,
      quality: 'quality',
      size: '864x1152',
      fps: 30,
      duration: 5,
    }),
  });
  const text = await res.text();
  if (!res.ok) {
    console.log(`[${key}] error creación:`, text.slice(0, 300));
    return;
  }
  const task = JSON.parse(text);
  console.log(`[${key}] task ${task.id}`);
  let result = task;
  for (let i = 0; i < 70; i++) {
    await sleep(10000);
    const r = await fetch(`${BASE}/async-result?id=${encodeURIComponent(task.id)}`, { headers: headers() });
    result = await r.json();
    if (result.task_status !== 'PROCESSING') break;
  }
  console.log(`[${key}] estado final: ${result.task_status}`);
  if (result.task_status === 'SUCCESS' && result.video_result?.[0]?.url) {
    const mp4 = await fetch(result.video_result[0].url);
    fs.writeFileSync(path.join(outDir, v.file), Buffer.from(await mp4.arrayBuffer()));
    console.log(`[${key}] guardado ${v.file} (${Math.round(fs.statSync(path.join(outDir, v.file)).size / 1024)} KB)`);
  } else {
    console.log(`[${key}] sin video:`, JSON.stringify(result).slice(0, 300));
  }
}

const only = process.argv[2]?.trim().toUpperCase();
if (variants[only]) await genClip(only);
else { await genClip('A'); await sleep(5000); await genClip('B'); }
console.log('Listo.');
