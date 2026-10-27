// Pasarela Macumba — cliente directo del endpoint /images/generations/edit
// El CLI z-ai image-edit envía `image` (string) y la API exige `images` (array) → lo hacemos a mano.
// Uso: node editar-pasarela.mjs          (todas)
//      node editar-pasarela.mjs 01,03    (solo esas)
import fs from 'fs';
import path from 'path';

const outputDir = '/home/z/my-project/download/macumba-pasarela';
const uploadDir = '/home/z/my-project/upload';
fs.mkdirSync(outputDir, { recursive: true });

const cfg = JSON.parse(fs.readFileSync('/etc/.z-ai-config', 'utf-8'));
const BASE = cfg.baseUrl.replace(/\/+$/, '');

const KEEP = `Keep the person, their pose, their face, their hair, their trousers and the garment EXACTLY as in the original photo. The garment and ALL its hand-painted artwork must remain pixel-identical: every brushstroke, every color, every detail of the painting completely unchanged. Do not repaint, do not reinterpret, do not redraw, do not move the artwork.`;

const SET = `Replace ONLY the background with a seamless professional photo-studio backdrop in warm mid-tone greige taupe, smooth soft gradient, completely empty: no objects, no walls, no graffiti, no texture, no people. Lighting: high-end fashion magazine studio lighting, soft key light, subtle rim light separating the model from the backdrop, clean soft shadow on the floor. Unified warm editorial color grade across the whole series. Full body visible, vertical portrait composition, nothing cut off at the edges. Photorealistic editorial fashion photography, sharp focus on the garment. No text, no logos, no watermark.`;

const jobs = [
  {
    // Frente SIN arte: el frente es denim rojo clásico (corrección del cliente)
    name: '01-roja-frente.png',
    src: '1791573793fda6.png',
    size: '768x1344',
    prompt: `Editorial fashion studio photograph. Keep the model, his pose, his face, his hair, his green scarf and his green trousers EXACTLY as in the original photo. The jacket is a classic red denim jacket: REMOVE all painted artwork from the front of the jacket — the front must be plain clean red denim fabric with natural denim texture, seams and stitching only, absolutely no painting, no print, no artwork on the front. Keep the jacket's cut, collar shape, fit and red color identical. Replace ONLY the background with a seamless professional photo-studio backdrop in warm mid-tone greige taupe, smooth soft gradient, completely empty: no objects, no walls, no graffiti, no texture, no people. Lighting: high-end fashion magazine studio lighting, soft key light, clean soft shadow on the floor. Absolutely no glowing halo, no rim glow, no light bloom around the model's silhouette. Wide full-length editorial shot: the entire body visible from head to shoes, both shoes fully visible standing on the studio floor with generous empty space below the shoes. Unified warm editorial color grade across the whole series. Photorealistic editorial fashion photography, sharp focus on the garment. No text, no logos, no watermark.`,
  },
  {
    name: '02-roja-espalda.png',
    src: 'chaqueta-denim-roja.png',
    size: '864x1152',
    prompt: `Editorial fashion studio photograph. ${KEEP} The model is seen from the back, head turned over his shoulder, wearing a hand-painted red denim jacket with a tropical portrait painting on the back. ${SET}`,
  },
  {
    name: '03-black-inspiration.png',
    src: 'chaqueta-black-inspiration.jpeg',
    size: '864x1152',
    prompt: `Editorial fashion studio photograph. ${KEEP} The model is seen from the back wearing a hand-painted black denim jacket covered in purple, black and blue splatter art with a figure wearing yellow sunglasses. Remove all street elements, signage and bystanders. Brighten the scene to clean professional studio lighting while keeping the painting colors exactly the same. ${SET}`,
  },
  {
    name: '04-asian-soul.png',
    src: 'personalizable-asian-soul.png',
    size: '864x1152',
    prompt: `Editorial fashion studio photograph. ${KEEP} The model is seen from the back, head turned over her shoulder, wearing a hand-painted black jacket with a blue, red and white female portrait artwork and colorful geometric patterns at the hem. ${SET}`,
  },
  {
    name: '05-alma-dorada.png',
    src: 'Gemini_Generated_Image_fcvtowfcvtowfcvt.jpeg',
    size: '864x1152',
    prompt: `Editorial fashion studio photograph. ${KEEP} The model is seen from the back, hand on hip, wearing a long hand-painted black coat with a golden female portrait artwork. Extend the composition vertically to show her full body from head to feet, keeping the coat and the painting completely unchanged. The backdrop must be evenly lit, plain and smooth with a gentle gradient only: absolutely no glowing halo, no rim glow, no colored light bloom around the model's silhouette. ${SET}`,
  },
  {
    name: '06-espiritu-leon.png',
    src: 'personalizableleon.png',
    size: '864x1152',
    prompt: `Editorial fashion studio photograph. ${KEEP} The model is seen from the back, head turned over her shoulder, wearing a long hand-painted denim jacket with a white tiger artwork in blue and pink tones. The backdrop must be evenly lit, plain and smooth with a gentle gradient only: absolutely no glowing halo, no rim glow, no orange light bloom around the model's silhouette. ${SET}`,
  },
];

const only = process.argv[2] ? process.argv[2].split(',').map((s) => s.trim()) : null;
const selected = only ? jobs.filter((j) => only.some((o) => j.name.startsWith(o))) : jobs;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function dataUrl(file) {
  const ext = path.extname(file).toLowerCase();
  const mime = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' }[ext] || 'image/png';
  return `data:${mime};base64,${fs.readFileSync(file).toString('base64')}`;
}

function headers() {
  const h = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${cfg.apiKey}`,
    'X-Z-AI-From': 'Z',
  };
  if (cfg.chatId) h['X-Chat-Id'] = cfg.chatId;
  if (cfg.userId) h['X-User-Id'] = cfg.userId;
  if (cfg.token) h['X-Token'] = cfg.token;
  return h;
}

// Variantes de cuerpo: formato correcto según skill = images: [{ url }]
function bodyVariants(prompt, size, img) {
  return [
    { prompt, size, images: [{ url: img }] },
    { prompt, size, images: [img] },
  ];
}

async function post(body) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 240000);
  try {
    const res = await fetch(`${BASE}/images/generations/edit`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    const text = await res.text();
    if (!res.ok) return { ok: false, status: res.status, text: text.slice(0, 300) };
    return { ok: true, json: JSON.parse(text) };
  } catch (e) {
    return { ok: false, status: 0, text: String(e).slice(0, 300) };
  } finally {
    clearTimeout(t);
  }
}

async function saveResult(json, outPath) {
  const item = json?.data?.[0];
  if (!item) return false;
  let buf = null;
  if (item.base64) buf = Buffer.from(item.base64, 'base64');
  else if (item.b64_json) buf = Buffer.from(item.b64_json, 'base64');
  else if (item.url) {
    const res = await fetch(item.url);
    if (!res.ok) return false;
    buf = Buffer.from(await res.arrayBuffer());
  }
  if (!buf || buf.length < 10240) return false;
  fs.writeFileSync(outPath, buf);
  return true;
}

for (const job of selected) {
  const outPath = path.join(outputDir, job.name);
  if (fs.existsSync(outPath) && fs.statSync(outPath).size > 10240) {
    console.log(`[${job.name}] ya existe, se omite`);
    continue;
  }
  const img = dataUrl(path.join(uploadDir, job.src));
  let done = false;
  for (let attempt = 1; attempt <= 4 && !done; attempt++) {
    for (let v = 0; v < 3 && !done; v++) {
      const body = bodyVariants(job.prompt, job.size, img)[v];
      process.stdout.write(`[${job.name}] intento ${attempt} variante ${v + 1}... `);
      const r = await post(body);
      if (r.ok) {
        done = await saveResult(r.json, outPath);
        console.log(done ? `OK (${Math.round(fs.statSync(outPath).size / 1024)} KB)` : 'respuesta sin imagen util');
      } else if (r.status === 429) {
        console.log('429 rate limit, espero 20s');
        await sleep(20000);
        break; // reintenta misma variante en el siguiente attempt
      } else {
        console.log(`fallo ${r.status}: ${r.text.slice(0, 120)}`);
      }
    }
    if (!done) await sleep(8000);
  }
  if (!done) console.log(`[${job.name}] AGOTÓ REINTENTOS`);
  await sleep(6000); // espacio entre jobs para no golpear el rate limit
}
console.log('Listo.');
