// Genera las mockups del flujo de compra: Canasta -> Datos de entrega -> WhatsApp
// Design System "Selva Viva" (Macumba Shop) — usa el CLI z-ai image
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const outputDir = '/home/z/my-project/download/macumba-flujo-compra';
fs.mkdirSync(outputDir, { recursive: true });

const DS = `DESIGN SYSTEM (strict): warm cream paper background #F7F3E9; white cards with rounded corners and soft shadows; forest green #1E5631 for secondary elements; pistachio green #93C572 small highlights; PURPLE #5B2A86 is the queen color used for all prices, main CTA buttons and active states; magenta #C2186B only for tiny 'Pieza Única' badges; dark green-black #14281D text. Elegant high-contrast serif headings (Fraunces style) and clean geometric sans-serif UI text (Outfit style). Small hand-embroidered diamond (rombo) motifs as separators. Editorial jungle-artisanal fashion aesthetic, generous whitespace.`;

const NOAPP = `IMPORTANT: it must look like a WEBSITE open in a desktop Chrome browser, NOT a mobile native app; NO app-style bottom navigation bar; crisp dribbble-quality UI render, professional UI/UX portfolio shot, high quality, detailed.`;

const jobs = [
  {
    name: '01-carrito-desktop.png',
    size: '1344x768',
    prompt: `Photorealistic website UI design mockup inside a Google Chrome desktop browser window (tab bar and address bar with URL macumbashop.co), 1440x900 viewport. Shopping cart page for MACUMBA SHOP, artisanal Colombian fashion brand: recycled-textile jackets hand-painted by artists. Keep ALL text minimal, short and perfectly legible, large typography.

${DS}

LAYOUT: minimal header with serif wordmark 'Macumba' and a purple cart icon with badge 2. Large serif page title 'Tu Canasta'. EXACTLY TWO white product cards side by side on the left half of the page, nothing else beside them:
- Card 1: flat-lay photo on pure white background of a forest-green recycled jacket with vibrant hand-painted purple and magenta jungle flowers art; small purple corner ribbon with the text 'Única'; serif name 'Cazadora Selva'; bold purple price '$280.000'; a simple quantity stepper '− 1 +'.
- Card 2: flat-lay photo of a caramel recycled-wool coat on white background; serif name 'Abrigo Raíces'; bold purple price '$220.000'; quantity stepper '− 1 +'.
On the right side ONE single white summary card, well separated from the product cards, not overlapping anything: serif title 'Resumen', row 'Subtotal $500.000', row 'Contra entrega', embroidered diamond separator, huge purple serif 'Total $500.000', one large purple rounded button with white WhatsApp phone logo and the label 'Finalizar por WhatsApp'. Floating green WhatsApp circle bottom-right corner. Only two product cards, one summary card. NO other small text anywhere. ${NOAPP}`
  },
  {
    name: '02-datos-entrega-desktop.png',
    size: '1344x768',
    prompt: `Photorealistic website UI design mockup inside a Google Chrome desktop browser window (address bar with URL macumbashop.co), 1440x900 viewport. Checkout delivery-form page for MACUMBA SHOP, artisanal Colombian fashion brand (recycled textiles, hand-painted art). Keep ALL text minimal, short and perfectly legible, large typography.

${DS}

LAYOUT: minimal header with serif wordmark 'Macumba'. Big serif title 'Datos de entrega'. Below it a simple 3-step progress line made of small diamond icons: first diamond filled forest green labeled 'Canasta', second diamond filled purple labeled 'Entrega', third diamond pistachio outline labeled 'WhatsApp'.
Center-left: one white form card with four large rounded input fields, each with a short label above: 'Nombre', 'WhatsApp', 'Ciudad', 'Dirección'; below, two radio options with rounded borders: 'Contra entrega' selected with purple border and purple dot, 'Envío nacional' unselected; then one large purple rounded button with white WhatsApp logo and label 'Enviar por WhatsApp'.
Right: white summary card with two small garment photo thumbnails (green hand-painted jacket, caramel coat), diamond separator, big purple serif text 'Total $500.000' and small line 'Pagas al recibir'. NO other small text anywhere. ${NOAPP}`
  },
  {
    name: '03-confirmacion-whatsapp.png',
    size: '1344x768',
    prompt: `Photorealistic website UI design mockup inside a Google Chrome desktop browser window (address bar with URL macumbashop.co/pedido), 1440x900 viewport. Order confirmation page for MACUMBA SHOP, artisanal Colombian fashion brand (recycled textiles, hand-painted art). Keep ALL text minimal, short and perfectly legible, very large typography, lots of whitespace.

${DS}

LAYOUT: two clean columns.
LEFT column, vertically centered: large forest-green circle with a white check mark; big serif headline '¡Pedido enviado!'; below it one small purple pill chip with text 'MB-1042'; below, a horizontal 3-step timeline with embroidered diamond icons connected by a dotted line: first diamond filled purple labeled 'Recibido', second diamond pistachio outline labeled 'Producción', third diamond pistachio outline labeled 'Enviado'.
RIGHT column: ONE white chat-preview card with rounded corners: green rounded header bar with white text 'Macumba Shop'; inside, a small photo thumbnail of a forest-green jacket with hand-painted purple and magenta jungle art, next to it the short bold text 'Total $500.000' and the line 'Contra entrega'; below, one large purple rounded button with white WhatsApp logo and label 'Abrir WhatsApp'.
All Spanish text must be spelled EXACTLY as given, no invented words. NO other small text anywhere. ${NOAPP}`
  },
  {
    name: '04-movil-feria.png',
    size: '1024x1024',
    prompt: `Composition with EXACTLY TWO modern smartphone mockups side by side, centered with generous margins, on a warm cream background #F7F3E9 with soft botanical leaf shadows, showcasing the MOBILE WEBSITE of MACUMBA SHOP, artisanal Colombian fashion brand (recycled textiles, hand-painted art). Only two phones in the whole image, nothing cut off at the edges. Keep ALL text minimal, short and perfectly legible, very large typography.

LEFT PHONE: a mobile web browser (small address bar at top, NOT a native app): cream background page, serif heading 'Tu Canasta', ONE white card with a photo of a forest-green recycled jacket with hand-painted purple and magenta jungle art and a small blank purple ribbon badge without any text, big purple price '$280.000', one large purple button with WhatsApp logo and short label 'Finalizar', small caption 'Contra entrega'.

RIGHT PHONE: WhatsApp chat with dark green header 'Macumba Shop': ONE white incoming message bubble with short bold text 'Nuevo pedido' and one line 'Total $500.000'; below the bubble one attached photo of the painted green jacket; then ONE light-green reply bubble with only the word '¡Recibido!'. Nothing else. All Spanish text must be spelled EXACTLY as given.

${DS} Photorealistic device mockups, dribbble-quality UI presentation, high quality, detailed.`
  }
];

function runCli(job) {
  return new Promise((resolve) => {
    const args = ['image', '-p', job.prompt, '-o', path.join(outputDir, job.name), '-s', job.size];
    const child = spawn('z-ai', args);
    let out = '';
    child.stdout.on('data', d => { out += d; });
    child.stderr.on('data', d => { out += d; });
    child.on('close', code => resolve({ code, out }));
  });
}

// Filtro opcional: node generar-flujo-compra.mjs 01,02
const only = process.argv[2] ? process.argv[2].split(',').map(s => s.trim()) : null;
const selected = only ? jobs.filter(j => only.some(o => j.name.startsWith(o))) : jobs;

for (const job of selected) {
  const outPath = path.join(outputDir, job.name);
  let done = false;
  for (let attempt = 1; attempt <= 3 && !done; attempt++) {
    console.log(`Generando ${job.name} (intento ${attempt})...`);
    const { code, out } = await runCli(job);
    if (code === 0 && fs.existsSync(outPath) && fs.statSync(outPath).size > 10000) {
      console.log(`OK -> ${outPath}`);
      done = true;
    } else {
      console.error(`Fallo ${job.name} (exit ${code}): ${out.slice(-300)}`);
      await new Promise(r => setTimeout(r, 2000 * attempt));
    }
  }
  if (!done) {
    console.error(`NO se pudo generar ${job.name}`);
    process.exitCode = 1;
  }
}
console.log('Listo.');
