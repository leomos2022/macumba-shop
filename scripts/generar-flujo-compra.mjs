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
    prompt: `Split marketing composition, wide landscape: LEFT 62% a website order-confirmation page inside a Google Chrome browser window (URL macumbashop.co/pedido/MB-1042); RIGHT 38% a modern smartphone mockup slightly tilted showing a WhatsApp Business chat. Both on a warm cream studio background with subtle tropical leaf shadows. Brand: MACUMBA SHOP, artisanal Colombian fashion (recycled textiles, hand-painted art).

WEBSITE (left) ${DS} — content: big forest-green circle with white check mark; serif headline '¡Tu pedido está en camino!'; subtext 'Abrimos WhatsApp con tu pedido listo. Solo presiona enviar.'; purple chip 'Pedido MB-1042'; small white card with two garment photo thumbnails (hand-painted green jacket, caramel coat) and purple total '$500.000'; horizontal status timeline with five embroidered diamond icons: 'Recibido' filled purple, then 'Contactado', 'Confirmado', 'En producción', 'Enviado' outlined pistachio; footer caption 'Te avisamos por WhatsApp cuando tu pieza esté lista — Robert'.

PHONE (right): WhatsApp Business chat with green header 'Macumba Shop · en línea'; white incoming message bubble with structured order text: bold 'NUEVO PEDIDO · MB-1042', lines '1× Cazadora Selva Profunda · Talla M · $280.000', '1× Abrigo Raíces · Talla L · $220.000', 'Total: $500.000', 'Pago: contra entrega', 'Dirección: Chapinero, Bogotá'; two small attached preview photos of the painted jacket front and back; one green document chip 'MB-1042-receta.json'; below, a reply bubble from Macumba Shop: '¡Hola! Recibimos tu pedido, te confirmamos hoy mismo.' Photorealistic UI render, dribbble quality, high quality, detailed.`
  },
  {
    name: '04-movil-feria.png',
    size: '1024x1024',
    prompt: `Composition with two modern smartphone mockups side by side on a warm cream background #F7F3E9 with soft botanical leaf shadows, showcasing the MOBILE WEBSITE of MACUMBA SHOP, artisanal Colombian fashion brand (recycled textiles, hand-painted art). Both phones show a web browser (small address bar at top), NOT a native app.

LEFT PHONE: mobile shopping cart page: cream background, serif heading 'Tu Canasta', white card with photo of a forest-green recycled jacket with hand-painted purple and magenta jungle art, tiny magenta badge 'Pieza Única', purple price '$280.000', quantity stepper, purple page-level button with WhatsApp logo 'Finalizar por WhatsApp', small caption 'Contra entrega · coordinamos por WhatsApp'.

RIGHT PHONE: WhatsApp Business chat with 'Macumba Shop': incoming white bubble with order text 'NUEVO PEDIDO · MB-1042', item lines with prices, 'Total: $500.000', 'Pago: contra entrega', one attached preview photo of the painted jacket, and a reply bubble from the shop '¡Recibimos tu pedido! Te confirmamos hoy.'

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
