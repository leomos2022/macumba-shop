// Pasarela Macumba — Técnica A: editar las fotos reales del cliente
// Regla de oro: la prenda y el arte pintado a mano quedan INTACTOS; solo cambia fondo/luz/set.
// Uso: node generar-pasarela.mjs            (todas)
//      node generar-pasarela.mjs 01,03      (solo esas)
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const outputDir = '/home/z/my-project/download/macumba-pasarela';
const uploadDir = '/home/z/my-project/upload';
fs.mkdirSync(outputDir, { recursive: true });

// Preservación absoluta del arte pintado a mano
const KEEP = `Keep the person, their pose, their face, their hair, their trousers and the garment EXACTLY as in the original photo. The garment and ALL its hand-painted artwork must remain pixel-identical: every brushstroke, every color, every detail of the painting completely unchanged. Do not repaint, do not reinterpret, do not redraw, do not move the artwork.`;

// Set editorial unificado de la serie
const SET = `Replace ONLY the background with a seamless professional photo-studio backdrop in warm mid-tone greige taupe, smooth soft gradient, completely empty: no objects, no walls, no graffiti, no texture, no people. Lighting: high-end fashion magazine studio lighting, soft key light, subtle rim light separating the model from the backdrop, clean soft shadow on the floor. Unified warm editorial color grade across the whole series. Full body visible, vertical portrait composition, nothing cut off at the edges. Photorealistic editorial fashion photography, sharp focus on the garment. No text, no logos, no watermark.`;

const jobs = [
  {
    name: '01-roja-frente.png',
    src: '1791573793fda6.png',
    size: '864x1152',
    prompt: `Editorial fashion studio photograph. ${KEEP} The model stands facing the camera wearing a hand-painted red denim jacket with a green scarf at the neck. ${SET}`,
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
    prompt: `Editorial fashion studio photograph. ${KEEP} The model is seen from the back, hand on hip, wearing a long hand-painted black coat with a golden female portrait artwork. Extend the composition vertically to show her full body from head to feet, keeping the coat and the painting completely unchanged. ${SET}`,
  },
  {
    name: '06-espiritu-leon.png',
    src: 'personalizableleon.png',
    size: '864x1152',
    prompt: `Editorial fashion studio photograph. ${KEEP} The model is seen from the back, head turned over her shoulder, wearing a long hand-painted denim jacket with a white tiger artwork in blue and pink tones. ${SET}`,
  },
];

const only = process.argv[2]
  ? process.argv[2].split(',').map((s) => s.trim())
  : null;
const selected = only
  ? jobs.filter((j) => only.some((o) => j.name.startsWith(o)))
  : jobs;

function runCli(job) {
  return new Promise((resolve) => {
    const outPath = path.join(outputDir, job.name);
    const args = [
      'image-edit',
      '-p', job.prompt,
      '-i', path.join(uploadDir, job.src),
      '-o', outPath,
      '-s', job.size,
    ];
    const child = spawn('z-ai', args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    let err = '';
    child.stdout.on('data', (d) => (out += d));
    child.stderr.on('data', (d) => (err += d));
    const timer = setTimeout(() => child.kill('SIGKILL'), 300000);
    child.on('close', (code) => {
      clearTimeout(timer);
      let ok = code === 0 && fs.existsSync(outPath) && fs.statSync(outPath).size > 10240;
      resolve({ job, ok, code, out: out.slice(-400), err: err.slice(-400) });
    });
  });
}

for (const job of selected) {
  let result = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    process.stdout.write(`[${job.name}] intento ${attempt}... `);
    result = await runCli(job);
    if (result.ok) {
      const kb = Math.round(fs.statSync(path.join(outputDir, job.name)).size / 1024);
      console.log(`OK (${kb} KB)`);
      break;
    }
    console.log(`fallo (code=${result.code}) ${result.err || result.out}`);
  }
  if (!result || !result.ok) console.log(`[${job.name}] AGOTÓ REINTENTOS`);
}
console.log('Listo.');
