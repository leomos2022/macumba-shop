# Macumba Shop — Memoria del Proyecto

Tienda online de Macumba: moda denim con arte pintado a mano (artistas Robert / Arley, Colombia).
Venta por WhatsApp sin pasarela de pagos (contra entrega). Idioma del proyecto: español.

## Stack

- Next.js 16 + TypeScript + Tailwind 4 + shadcn/ui (código Fase 1 en la raíz `/`)
- Prisma + SQLite (modelo `Product`), Zustand + persist para la canasta
- Producción audiovisual: scripts Node/ffmpeg en `/home/z/my-project/scripts/`
- Assets del cliente en `/upload/` · Entregables en `/download/`

## Design System "Selva Viva" (aprobado)

- Paleta: crema `#F7F3E9` (60%) · verde selva `#1E5631` + pistacho `#93C572` (30%) · morado `#5B2A86` (10%, solo acción) · magenta `#C2186B` (micro-acentos) · tinta `#14281D`
- Tipografías: Fraunces (display) + Outfit (UI)
- Motivos: rombo del bordado (SVG), marcos de arco, textura de tejido
- Fondos blancos/estudio en catálogo y Estudio; ambiente selvático solo en Inicio
- Especificación viva: `download/macumba-design-system/index.html`

## Decisiones de UX aprobadas por el cliente

1. **Inicio — hero = video pasarela**: 6 stills editoriales (2:3, fondo greige unificado, luz editorial) animadas con **Ken Burns ffmpeg** (zoompan + crossfades). La animación IA (cogvideox-3) quedó **descartada**: repinta el arte cada frame y destruye el arte pintado (estabilidad 2-3/10). Orden de desfile: 01 → 04 → 03 → 05 → 02 → 06.
2. **La Sala (catálogo) — embudo de 3 niveles**: entrada 1 = **slider continuo** de las prendas (swipe right, una tras otra) → al elegir, **ficha rápida** de información → desde ahí, **catálogo estático** (grid con filtros, SEO). La primera experiencia es inmersiva, no un grid.
3. **El Estudio / Taller — ghost mannequin**: prenda flotante 3D sin cuerpo (referencia adworker.ai/tools/ghost-mannequin). Un mismo asset sirve doble: lienzo del personalizador (Fabric.js, Fase 2) y foto "antes". Requiere del cliente: foto principal + ángulo lateral + interior del cuello.
4. **Flujo de compra**: Canasta → Datos de entrega (3 pasos, contra entrega) → WhatsApp con pedido estructurado. Sin pasarela de pagos.

## Regla de oro — el arte pintado es intocable

- Toda fotografía se produce con **Técnica A** (image-edit sobre foto real del cliente): prenda + arte **pixel-identical**, solo cambia fondo/luz/grade. No se re-dibuja, no se reinterpreta.
- Video IA sobre piezas pintadas: prohibido salvo aprobación explícita de deriva del arte.

## Lecciones técnicas API (z-ai)

- **image-edit directo** (`POST {BASE}/images/generations/edit`): el body correcto es `{prompt, size, images: [{url: dataUrl}]}` — el CLI/SDK envía `image: string` y falla. Headers desde `/etc/.z-ai-config`. 429 → esperar 20s. Script: `scripts/editar-pasarela.mjs` (uso: `node editar-pasarela.mjs 01,03`, omite archivos ya existentes).
- **Ken Burns** (`scripts/clips-kenburns.sh`): zoompan sobre still pre-escalada 2x, preset `slow`/2x puede tardar >5 min por clip. Salidas: 864x1152@30fps (01 es 768x1344), H.264 yuv420p +faststart, sin audio.
- **QA de video**: extraer frames con ffmpeg y verificar el arte visualmente; el modelo de visión rechaza videos locales (usar montajes de frames).

## Entregables actuales

- `download/macumba-pasarela/`: 6 stills (01-06) · `desfile-completo.mp4` (13s hero) · `clips/` (6 clips 5s) · `_ia-referencia/` (descartes IA)
- `download/macumba-design-system/`, `download/macumba-flujo-compra/`, `download/qa/`

## Pendientes

- Mockups: La Sala (slider continuo + ficha) y El Estudio (ghost mannequin) en Selva Viva
- Integración Fase 1: hero → `desfile-completo.mp4`; la-sala grid → slider continuo; taller-teaser → lienzo ghost
- Cliente: precios reales, fotos ghost mannequin, textos de marca. ✅ WhatsApp oficial confirmado: +57 320 495 9889 (env NEXT_PUBLIC_WHATSAPP_NUMBER=573204959889, fallback en macumba.ts; plan automatización: n8n + WhatsApp Cloud API con Coexistence)
- Fase 2: personalizador Fabric.js · Remanufactura (seguimiento en 3 días)
