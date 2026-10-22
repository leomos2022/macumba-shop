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
