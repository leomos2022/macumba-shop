// Asset ghost mannequin para El Estudio — chaqueta roja flotante sin cuerpo
// Mismo pipeline directo que editar-pasarela.mjs (images: [{url}])
import fs from 'fs';
import path from 'path';

const cfg = JSON.parse(fs.readFileSync('/etc/.z-ai-config', 'utf-8'));
const BASE = cfg.baseUrl.replace(/\/+$/, '');
const SRC = '/home/z/my-project/download/macumba-pasarela/01-roja-frente.png';
const OUT = '/home/z/my-project/download/macumba-mockups/assets/ghost-roja.png';

const prompt = `Ghost mannequin product photograph for an e-commerce catalog. Remove the male model completely: no person, no head, no face, no hands, no arms, no legs, no body, no scarf, no trousers. Show ONLY the red denim jacket itself floating in the air as if worn by an invisible mannequin: collar shaped naturally open, sleeves gently filled and rounded, front panel centered facing the camera, classic ghost mannequin invisible-mannequin e-commerce style. The jacket must remain EXACTLY identical to the original: plain clean red denim with natural denim texture, same buttons, same seams, same stitching, same cut, same red color, absolutely no artwork, no print, no painting on it. Pure white background, soft even studio lighting, subtle soft shadow below the floating garment. Vertical composition with generous empty space around the jacket, whole garment visible, nothing cut off. Photorealistic professional e-commerce product photography, sharp focus. No text, no logos, no watermark.`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const img = `data:image/png;base64,${fs.readFileSync(SRC).toString('base64')}`;
fs.mkdirSync(path.dirname(OUT), { recursive: true });

function headers() {
  const h = { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.apiKey}`, 'X-Z-AI-From': 'Z' };
  if (cfg.chatId) h['X-Chat-Id'] = cfg.chatId;
  if (cfg.userId) h['X-User-Id'] = cfg.userId;
  if (cfg.token) h['X-Token'] = cfg.token;
  return h;
}

for (let attempt = 1; attempt <= 4; attempt++) {
  for (const body of [
    { prompt, size: '864x1152', images: [{ url: img }] },
    { prompt, size: '864x1152', images: [img] },
  ]) {
    process.stdout.write(`intento ${attempt}... `);
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 240000);
    try {
      const res = await fetch(`${BASE}/images/generations/edit`, {
        method: 'POST', headers: headers(), body: JSON.stringify(body), signal: ctrl.signal,
      });
      const text = await res.text();
      clearTimeout(t);
      if (res.status === 429) { console.log('429, espero 20s'); await sleep(20000); continue; }
      if (!res.ok) { console.log(`fallo ${res.status}: ${text.slice(0, 120)}`); continue; }
      const item = JSON.parse(text)?.data?.[0];
      if (!item) { console.log('sin imagen'); continue; }
      let buf = null;
      if (item.base64) buf = Buffer.from(item.base64, 'base64');
      else if (item.b64_json) buf = Buffer.from(item.b64_json, 'base64');
      else if (item.url) buf = Buffer.from(await (await fetch(item.url)).arrayBuffer());
      if (!buf || buf.length < 10240) { console.log('respuesta vacía'); continue; }
      fs.writeFileSync(OUT, buf);
      console.log(`OK (${Math.round(buf.length / 1024)} KB) → ${OUT}`);
      process.exit(0);
    } catch (e) {
      clearTimeout(t);
      console.log(`error: ${String(e).slice(0, 120)}`);
    }
  }
  await sleep(8000);
}
console.log('AGOTÓ REINTENTOS');
process.exit(1);
