# Worklog — Proyecto Macumba Shop

---
Task ID: 1
Agent: Z.ai (principal)
Task: Design System visual "Selva Viva" para la web de Macumba Shop (mockups de aprobación para Robert y Arley)

Work Log:
- Se generaron 13 fotografías con IA (CLI z-ai): 4 editoriales (fondo lino), 4 de catálogo (fondo blanco), 4 siluetas lisas para El Estudio y 1 textura de tejido verde. Guardadas en download/macumba-design-system/assets/
- Se construyó design-system en HTML/CSS único: download/macumba-design-system/index.html (5 láminas: fundamentos, hero desktop, hero mobile, catálogo, estudio)
- Paleta aplicada: crema #F7F3E9 (60%), verde selva #1E5631 + pistacho #93C572 (30%), morado #5B2A86 (10% acción), magenta #C2186B (micro-acentos), tinta #14281D
- Tipografías: Fraunces (display) + Outfit (UI) vía Google Fonts
- Motivos: rombo del bordado (SVG), marcos de arco, textura de tejido
- Renderizado a PNG con Playwright (device_scale_factor=2) vía scripts/render_design_system.py
- QA visual iterativo: se corrigieron anidamiento de .secuencia fuera de .hero (diagnóstico DOM con scripts/diagnostico_hero.py), colisión del page-tag con el carrito, alturas fijas que cortaban contenido y visibilidad de los dots sobre la foto

Stage Summary:
- 5 PNG finales en /home/z/my-project/download/macumba-design-system/:
  01-fundamentos-paleta-tipografia.png · 02-inicio-hero-desktop.png · 03-inicio-hero-mobile.png · 04-catalogo-la-sala.png · 05-el-estudio.png
- index.html sirve como especificación viva del design system (tokens CSS en :root)
- Scripts persistidos: scripts/generar_imagenes.sh, scripts/render_design_system.py, scripts/diagnostico_hero.py
- Decisiones de diseño cerradas con la reunión del cliente: adiós chaqueta ghost 360° → secuencia editorial; morado reservado para acción; catálogo grid denso con info al hover; Estudio en 4 pasos (silueta→color→técnica→arte) con colores dinámicos por silueta; fondos blancos en catálogo/estudio y ambiente selvático solo en inicio
- Pendiente del cliente: fotos reales de siluetas por color, stock creativo, textos de marca, precios por técnica, lettering vectorizable, número de WhatsApp oficial

---
Task ID: 1
Agent: Z.ai (main agent)
Task: Visualización del flujo de compra Canasta → Datos de entrega → WhatsApp (sistema Selva Viva)

Work Log:
- Cargada skill image-generation; SDK no disponible en node, se usó CLI z-ai image vía spawn
- Script persistido: scripts/generar-flujo-compra.mjs (jobs con prompt+size, filtro por índice, 3 reintentos)
- Regeneraciones 01 y 02 para corregir texto garbled (simplificación de textos y "EXACTLY TWO cards")
- Salidas en download/macumba-flujo-compra/: 01-carrito-desktop.png, 02-datos-entrega-desktop.png, 03-confirmacion-whatsapp.png, 04-movil-feria.png

Stage Summary:
- Flujo visualizado en 4 pantallas con paleta Selva Viva (crema #F7F3E9, morado #5B2A86 CTAs, verde selva #1E5631, magenta badges)
- Flujo UX: Canasta (2 items, total, CTA morado) → Datos de entrega (3 pasos: Canasta/Entrega/WhatsApp, contra entrega) → Confirmación + chat WhatsApp (pedido MB-1042 + receta JSON) → versión móvil para ferias
- Script reutilizable para regenerar pantallas: node scripts/generar-flujo-compra.mjs 01,02

---
Task ID: 2
Agent: Z.ai (main agent)
Task: Simplificación y mejora de las mockups de confirmación WhatsApp (03 y 04) según feedback del usuario

Work Log:
- Feedback: "las de confirmación por WhatsApp no están bn, simplificar y mejorar"
- Editado scripts/generar-flujo-compra.mjs: 03 rediseñada (split web+teléfono → página de confirmación desktop con tarjeta chat-preview; timeline 5 pasos → 3; sin líneas de texto secundarias); 04 simplificada (badge sin texto, chat reducido a 2 burbujas + foto, "EXACTLY TWO phones")
- 3 iteraciones para 03 (eliminar subline que garbateaba, orthography EXACT) y 2 para 04 (composición de 2 teléfonos)

Stage Summary:
- 03-confirmacion-whatsapp.png v3: check verde + "¡Pedido enviado!" + chip MB-1042 + timeline Recibido/Producción/Enviado + tarjeta chat "Macumba Shop" con Total y botón "Abrir WhatsApp" — todo legible
- 04-movil-feria.png v5: dos teléfonos exactos, formato $280.000 correcto, chat minimal (Nuevo pedido / Total / foto / ¡Recibido!)
- Lección aplicada: menos palabras por pantalla = menos garbling del modelo de imagen; reutilizable para futuras pantallas

---
Task ID: 3
Agent: Z.ai (main agent)
Task: Fase 1 — Inicio + Catálogo "La Sala" funcionando (Next.js 16, design system Selva Viva)

Work Log:
- Init fullstack (Next.js 16 + shadcn/ui + Prisma/SQLite + Zustand + sonner)
- Copiados 13 assets fotográficos existentes a public/tienda/ (reutilización, no regeneración)
- prisma/schema.prisma: modelo Product (slug, category, gender, kind 'unica'|'personalizable', basePrice COP, sizes, technique, material, imageUrl, heroImageUrl, serieLabel, isFeatured, sortOrder) + db:push
- scripts/seed.ts: 8 productos (4 piezas únicas: Jaguar/Raíces/Colibrí/Orquídea; 4 personalizables de El Taller)
- globals.css: tokens Selva Viva (--morado #5B2A86 primary, --verde #1E5631, --pistacho, --badge #C2186B, --crema #F7F3E9, --tinta #14281D) + utilidades textura-tejido/marco-arco/font-display
- layout.tsx: lang es, Fraunces (display) + Outfit (sans) vía next/font, metadata es_CO, Toaster sonner
- Componentes en src/components/tienda/: header (badge canasta + menú móvil Sheet), hero-secuencia (autoplay 5.5s, pausa hover/focus, prefers-reduced-motion, dots+arrows, marco arco), la-sala (filtros categoría/género, grid denso, overlay hover/focus-within), detalle-producto (Sheet, tallas, stepper, añadir + toast; personalizables → camino El Taller), canasta-sheet (items, totales, checkout), taller-teaser (4 pasos con siluetas), historia (Viste Arte), footer (mt-auto), boton-whatsapp flotante, rombo/separador
- stores/canasta.ts: Zustand + persist (skipHydration + rehydrate() en mount, patrón lint-safe); formatoCOP determinista sin Intl (evita hydration mismatch)
- Todo en ruta única "/" (limitación del sandbox); detalle y canasta como Sheets
- Lint limpio; E2E con agent-browser: hero autoplay, 8 cards, filtros (Abrigos→2, +Masculino→1), foco activa overlay (opacity 1), añadir→toast, badge persiste, checkout wa.me con mensaje estructurado verificado, menú móvil, footer pegado, sin errores de consola; capturas en download/qa/

Stage Summary:
- Web Macumba Shop Fase 1 operativa en /: Inicio (secuencia editorial), La Sala (catálogo filtrable con 8 productos desde SQLite), El Taller teaser, Historia, Canasta persistente y checkout por WhatsApp (placeholder 573001234567 hasta tener el número oficial)
- Pendiente siguiente: Fase 2 (El Tudio personalizador con Fabric.js), números/precios reales del cliente, deploy Vercel
