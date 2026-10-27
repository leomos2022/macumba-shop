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

---
Task ID: 4
Agent: Z.ai (main agent)
Task: Nuevo brief del cliente — pasarela editorial (Inicio), Sala como slider continuo, Estudio estilo ghost mannequin; asesoría antes de ejecutar

Work Log:
- Recibidas 6 fotos reales de piezas pintadas en upload/: cazadora roja frente+espalda (¿misma pieza? por confirmar), black inspiration (noche Parque 93), asian soul, alma dorada (abrigo largo negro), león denim largo
- Investigación adworker.ai/tools/ghost-mannequin: input foto principal + ángulo extra opcional + interior de cuello; output prenda 3D sin cuerpo sobre fondo blanco; modos Basic/Standard/Pro, vista 45° IA, batch mode
- Verificado CLI z-ai: image-edit (-i acepta archivo local, ideal para preservar arte) y video (--image-url soporta image-to-video, 5/10s, primer/último frame, 30/60fps)
- Referencia John Gress no descargable (el servidor devuelve HTML); el estilo editorial se aplicará por descripción en los prompts
- Estrategia anti-deriva del arte definida: Técnica A (image-edit sobre fotos del cliente: arte intacto píxel a píxel, solo fondo/luz/grade unificados), Técnica B (cambio de pose a zancada, riesgo de deriva, solo con aprobación), video por image-to-video desde las stills
- Propuesta entregada al cliente: unificar set editorial (un fondo de estudio, una luz, un grade), formato vertical 2:3 (864x1152), embudo Sala de 3 niveles (slider continuo → ficha rápida → ficha estática SEO con fotos reales), Estudio con ghost mannequin como lienzo Fabric.js (un asset = lienzo + foto "antes")

Stage Summary:
- Cola de producción pendiente de green light: 6 fotos pasarela (Técnica A) → 1 clip video de prueba → mockups Sala slider + Estudio ghost → update CLAUDE.md
- Piezas identificadas: 5 únicas (Roja "Selva", Black Inspiration, Asian Soul, Alma Dorada, Espíritu León) y 6 tomas
- Impacto en Fase 1 existente (código en /): hero de secuencia editorial → video pasarela; la-sala grid → slider continuo; taller-teaser → lienzo ghost mannequin

---
Task ID: 5
Agent: Z.ai (main agent)
Task: Pasarela editorial del Inicio — 6 fotos (Técnica A sobre fotos reales) + clip de video de prueba

Work Log:
- Cliente aprobó: 5 piezas únicas / 6 tomas (roja denim frente+espalda, black inspiration, asian soul, alma dorada, espíritu león); diseños van en la espalda
- BUG SDK descubierto: CLI z-ai image-edit envía body {image: string} pero la API exige {images: [{url}]} (skill image-edit lo documenta); scripts/generar-pasarela.mjs (CLI) abandonado → scripts/editar-pasarela.mjs (fetch directo a /images/generations/edit con config de /etc/.z-ai-config, variantes de cuerpo, backoff 429)
- Técnica A aplicada: KEEP (prenda+arte pixel-identical) + SET (fondo estudio greige cálido unificado, luz key+rim, grade editorial, vertical 864x1152)
- 6/6 generadas al primer intento; QA visual: 01-04 limpias; 05 y 06 con halo de color alrededor del modelo → regeneradas con "no glowing halo, evenly lit backdrop" y quedaron limpias (backups v1 eliminados)
- Video: SDK POST /video/generation acepta image_url data-URL local; modelo cogvideox-3; poll /async-result (~2.5 min, quality mode); scripts/video-prueba.mjs
- Clip de prueba 5s desde 02-roja-espalda: el arte pintado sobrevive intacto a la animación (verificado extrayendo frame con ffmpeg)

Stage Summary:
- Entregables en download/macumba-pasarela/: 01-roja-frente.png, 02-roja-espalda.png, 03-black-inspiration.png, 04-asian-soul.png, 05-alma-dorada.png, 06-espiritu-leon.png, clip-prueba-02.mp4 (+meta)
- Serie lista para: slider de La Sala, clips del hero (pendiente aprobación del cliente para los 5 restantes), fichas estáticas
- Orden de desfile sugerido: 01 (H frente, abre) → 04 (M) → 03 (H) → 05 (M) → 02 (H espalda) → 06 (M, cierra la pieza más grande)

---
Task ID: 6
Agent: Z.ai (main agent)
Task: Corrección 01 (frente sin arte) + mejora del video de pasarela (anti-warping)

Work Log:
- Feedback del cliente: el frente de la chaqueta roja es denim clásico SIN estampado (el arte vive solo en la espalda); el video "buen intento pero hay que mejorar"; las demás fotos aprobadas
- 01 regenerada en 3 iteraciones: v2 media-carta con halo → v3 still halos/spotlight → v4 FINAL (768x1344, cuerpo completo con zapatos, frente denim liso, sin halo). Prompt clave: "REMOVE all painted artwork from the front... plain clean red denim"
- QA de video con modelo de visión (glm-5v-turbo vía z-ai vision; los videos locales fallan con "图片输入格式/解析错误" → workaround: montaje 3x3 de frames con ffmpeg tile y analizar como imagen)
- Diagnóstico clip v1 (cogvideox-3): el modelo NO camina (solo se mece), el arte se REDIBUJA cada frame, la tela se derrite
- Intentos anti-warping: A (micro-movimiento, cámara bloqueada) 3/10; B (429 rate limit persistente, no se generó); C (modelo congelado + dolly) 2/10 — conclusión: cogvideox-3 repinta el arte cada frame sin importar el prompt; limitación del modelo, no del prompt
- Solución adoptada: clip Ken Burns con ffmpeg zoompan (push-in lento 1.0→1.14, 5s, 30fps, H.264 yuv420p +faststart, 472 KB) sobre la still 02 → arte 100% estable
- Limpieza: eliminados clips defectuosos v2A/v2C, montajes QA y backups de 01

Stage Summary:
- 01-roja-frente.png final: frente denim rojo clásico SIN arte, cuerpo completo, set unificado — reemplaza a la anterior
- clip-kenburns-02.mp4: recomendado para el hero (arte perfecto garantizado); clip-prueba-02.mp4 (IA) se conserva solo como referencia
- Lección técnica mayor: para piezas con arte pintado único, el video IA (cogvideox-3) NO preserva el arte (2-3/10 estabilidad) → para el hero usar secuencias Ken Burns de las 6 stills (2-3s c/u) o video IA solo si el cliente acepta deriva del arte
- Scripts: scripts/editar-pasarela.mjs (edición directa API), scripts/video-v2.mjs (variantes A/B/C), scripts/video-prueba.mjs

---
Task ID: 7
Agent: Z.ai (main agent)
Task: Green light del cliente — clips Ken Burns de las 5 piezas restantes + desfile completo ensamblado

Work Log:
- Cliente aprobó ("si apruebo continuemos") tras verificar 01 final (768x1344, frente denim liso, cuerpo completo, sin halo) y el enfoque Ken Burns
- scripts/clips-kenburns.sh: 5 clips generados con movimientos editoriales diferenciados — 01 push-in 1.00→1.12 (abre), 03 push-out 1.14→1.00 (revela el splatter), 04 push-in 1.00→1.14, 05 push-in + deriva abajo (abrigo largo), 06 push-in 1.00→1.12 + deriva arriba — todos 5s @30fps, still pre-escalada 2x para nitidez, H.264 crf18 yuv420p +faststart
- clip 02 existente copiado como clips/clip-02-roja-espalda.mp4 (set numerado completo)
- desfile-completo.mp4 ensamblado con ffmpeg xfade (crossfade 0.4s, 2.5s por modelo, fade in/out): 864x1152, 30fps, ~13s, 3.3MB; la 01 (4:7) integrada con fondo desenfocado de sí misma (blur-fill) para el lienzo 3:4
- QA: integridad ffmpeg -f null OK en los 7 videos; tira de 6 frames del desfile verificada visualmente — orden 01→04→03→05→02→06 correcto, arte intacto, set greige unificado
- Housekeeping: eliminados backups _01-v1.png / 01-roja-frente-v2.png; creada _ia-referencia/ (clip-prueba-02.mp4 + meta + clip-kenburns-02.mp4 original); clips/ con los 6 clips oficiales
- CLAUDE.md recreado en la raíz (se perdió con el reinicio del sandbox): stack, Selva Viva, 4 decisiones UX aprobadas, regla de oro del arte, lecciones API, pendientes
- Nota de operación: preset slow a 2x puede superar 5 min por clip en este sandbox (2 CPUs) — los archivos sí se completan

Stage Summary:
- Paquete pasarela completo en download/macumba-pasarela/: 6 stills + desfile-completo.mp4 (hero) + clips/ (6 clips individuales 5s) + _ia-referencia/
- Arte pintado 100% estable en todo el material (Ken Burns, sin IA de video)
- Siguiente: mockups La Sala (slider continuo + ficha rápida) y El Estudio (ghost mannequin), luego integración al código Fase 1

---
Task ID: 8
Agent: Z.ai (main agent)
Task: Mockups Selva Viva — La Sala (embudo de 3 vistas) + El Estudio (ghost mannequin)

Work Log:
- Asset clave generado con image-edit directo (scripts/ghost-mannequin.mjs, 1 intento): cazadora roja flotante sin cuerpo estilo maniquí invisible (cuello formado, mangas llenas, sombra suave, fondo blanco) a partir de 01-roja-frente.png → download/macumba-mockups/assets/ghost-roja.png; valida el flujo "foto real → lienzo" del Estudio
- index.html con 5 láminas (download/macumba-mockups/): 01 slider continuo desktop (tinta + textura, prendas laterales asomando, ficha flotante, progreso), 02 slider móvil (teléfono, pantalla completa, "una grilla que encoges" corregido), 03 ficha rápida (sheet derecho con foto+badge pieza única, tallas, CTA, salida al catálogo), 04 catálogo estático (nav, filtros, grid 5 piezas + CTA Estudio + 2 "En el taller", hover demo), 05 Estudio ghost mannequin (lienzo con badge paso 2/4, foto "antes"→lienzo, 4 pasos con bloqueo progresivo, resumen $480.000, 3 notas al pie)
- Stills de pasarela copiadas como assets/pasarela-01..06.png; nombres reales de piezas (Selva Roja, Black Inspiration, Asian Soul, Alma Dorada, Espíritu León); precios de referencia con nota "por confirmar"
- Render con Playwright device_scale_factor=2 (scripts/render_mockups.py, env SOLO= para regenerar láminas sueltas)
- QA iterativo: L1 ficha bajada al hem (tapaba la chaqueta) + nowrap "Toca la prenda → ficha"; L2 precio nowrap + chip LA SALA con fondo + gramática "una grilla"; L4 chip "Personalizables · El Estudio"; L5 badge centrado (el arco lo recortaba), etiqueta "antes" acortada y "arrastra para girar" movida a la esquina inferior derecha (colisión resuelta)
- Nota: MultiEdit resultó NO atómico en esta sesión (aplicó el primer edit y falló el resto) → verificación por Grep y edits individuales tras el incidente

Stage Summary:
- 5 PNG finales en download/macumba-mockups/ + index.html (especificación viva del embudo Sala y del lienzo del Estudio)
- El ghost mannequin queda probado como asset doble (lienzo Fabric.js + foto "antes") — requiere del cliente fotos con ángulo lateral e interior de cuello por pieza
- Siguiente: aprobación del cliente → integración en Fase 1 (hero video pasarela, la-sala slider, taller → Estudio)

---
Task ID: 9
Agent: Z.ai (main agent)
Task: Ajuste feedback cliente — eliminar arco redondo de la card del Estudio

Work Log:
- Cliente aprueba mockups ("me gusta mucho la idea y como se ve") con 1 cambio: la card del lienzo del Estudio tenía marco en arco (border-radius:320px 320px 22px 22px) → reemplazado por radio mínimo 10px (cuadrado con esquinas suaves) en .est-maniqui (download/macumba-mockups/index.html línea 469)
- Regenerada solo la lámina afectada: SOLO=05- python scripts/render_mockups.py → 05-estudio-ghost-mannequin.png
- QA visual: arco eliminado, lienzo cuadrado, ghost/badge/thumbnail "antes"/hint 360 intactos
- Alcance: solo El Estudio; los arcos del slider de La Sala (foto-arco/slide-lateral/marco-linea) NO se tocaron — son parte del lenguaje del slider que el cliente aprobó

Stage Summary:
- Estudio con lienzo cuadrado radio 10px; pendiente de confirmación si el cliente quiere extender el estilo cuadrado a otras vistas
- Siguiente: integración en Fase 1 al confirmar

---
Task ID: 10
Agent: Z.ai (main agent)
Task: Integración Fase 1 — mockups aprobados al código (hero video, La Sala slider, El Estudio)

Work Log:
- Assets a public/tienda/: desfile-completo.mp4, pasarela-01..06.png, ghost-roja.png, antes-roja.png (redimensionada a 320px/≈170KB con PIL tras problemas del PNG de ffmpeg con el optimizer)
- seed.ts → 5 piezas únicas reales (Selva Roja $420k, Asian Soul $460k, Black Inspiration $390k, Alma Dorada $520k, Espíritu León $480k — precios de referencia) + 4 personalizables; DB re-seeded (9 productos)
- hero-secuencia.tsx reescrito: video desfile (Ken Burns, 12.97s) en marco-arco con panel editorial SINCRONIZADO por timeupdate (6 segmentos, fronteras 2.3/4.4/6.5/8.6/10.7 → orden 01→04→03→05→02→06; segmento 5 = "Selva Roja · el arte por detrás"), dots que buscan segmento, play/pause, etiqueta de modelo sobre el video, autoplay resiliente con reintento en rAF (respeta prefers-reduced-motion)
- la-sala.tsx reescrito con embudo 3 niveles: Nivel 1 SliderContinuo (fondo tinta, snap-x scroll nativo + scrollIntoView center, arcos, slides laterales opacity 40, ficha flotante con badge/serie/precio/CTA "Ver la ficha", flechas + teclado + progreso pistacho, salida al catálogo) → Nivel 2 DetalleProducto existente (ficha rápida sheet) → Nivel 3 grid estático con filtros (id la-sala-catalogo); scroll-mt-16 en ambas secciones
- estudio.tsx nuevo (reemplaza taller-teaser.tsx): lienzo ghost mannequin CUADRADO radio 10px (feedback del cliente), badge "Paso 2 de 4 · Color", thumb "Tu foto real" → lienzo, hint "Arrastra para girar (muy pronto)" solo ≥sm (colisión móvil resuelta), 4 pasos con estados (Silueta LISTA con chips que cambian precio base 420k/520k/460k, Color ELIGIENDO con 5 swatches, Técnica/Arte BLOQUEADA), resumen dinámico base+$60.000, CTA "Empezar mi prenda" → WhatsApp con selección incluida, 3 notas al pie
- Consistencia: nav header/footer "El Estudio" (#el-estudio), detalle-producto "Así funcionará El Estudio", precio tarjeta sin nowrap en móvil (overflow "Desde $450.000" resuelto), tokens CSS nuevos --morado-clara + animación cambio-suave + utilidad sin-scrollbar
- QA agent-browser: video 12.97s playing + sync correcto en cada segmento, slider navegable (flechas/dots/teclado), ficha rápida abre, añadir a canasta persiste (Asian Soul talla S en localStorage), filtros grid OK, silueta actualiza precio, CTA wa.me con mensaje estructurado, móvil (iPhone 14): hero/slider/estudio OK, footer sticky OK, lint limpio
- Incidentes resueltos: (1) dev server viejo (PID 1175 del 17:30) con optimizer de imágenes en estado tóxico — /_next/image colgaba indefinidamente en la transformación webp de antes-roja.png (curl sin Accept respondía 200, con Accept colgaba; sharp directo funcionaba) → matado árbol completo + arranque limpio → webp 200 en 9ms; (2) warning hidratación radix aria-controls: pre-existente, cosmético, sin acción

Stage Summary:
- Fase 1 INTEGRADA: hero video desfile + La Sala slider continuo→ficha→catálogo + El Estudio ghost mannequin, todo con las 5 piezas reales y Selva Viva
- QA en download/qa/int-01..11 (desktop + móvil)
- Pendiente cliente: WhatsApp oficial, precios reales, fotos ghost mannequin multi-ángulo, textos finales
- Siguiente: Fase 2 (Fabric.js en El Estudio) tras confirmación del cliente

---
Task ID: 11
Agent: main
Task: Configurar número oficial de WhatsApp (+57 320 495 9889) y definir plan de automatización (n8n / Cloud API)

Work Log:
- Cliente confirmó número oficial: +57 320 495 9889
- .env: NEXT_PUBLIC_WHATSAPP_NUMBER=573204959889
- src/lib/macumba.ts: fallback actualizado de 573001234567 → 573204959889 + nuevo export WHATSAPP_NUMERO_VISIBLE (formatea +57 320 495 9889)
- src/components/tienda/footer.tsx: usa WHATSAPP_NUMERO_VISIBLE (antes mostraba "+3204959889" ambiguo)
- CLAUDE.md: pendiente de WhatsApp oficial marcado ✅ con nota de plan de automatización
- tsc --noEmit limpio en src/ (errores restantes solo en examples/ y skills/, ajenos a la app)
- Investigación (web): Cloud API Colombia = USD 0.0008 utility/service (1.000 service/mes gratis), USD 0.0125 marketing; Coexistence oficial desde may 2025 (app + API mismo número); n8n tiene nodo nativo WhatsApp Business Cloud (send + trigger)

Stage Summary:
- Número real activo en toda la tienda (wa.me, footer, CTA canasta) sin cambiar arquitectura
- Plan de automatización propuesto: n8n self-hosted + WhatsApp Cloud API con Coexistence; integración futura vía /api/pedidos → webhook n8n
- Siguiente: responder al cliente con el plan y continuar Fase 2 / ajustes

---
Task ID: 12
Agent: main
Task: Eliminar arcos de la presentación de prendas en Inicio (decisión cliente: sin arcos en todo el UI/UX)

Work Log:
- Cliente: "en el inicio en la presentación de las prendas sigue el arco en la parte superior, elimínalo, no quiero ese arco en el UI/UX"
- Alcance real: clase .marco-arco (border-radius 999px 999px 1.5rem) usada en 2 componentes del Inicio: hero-secuencia.tsx (marco del video desfile) y la-sala.tsx (slides del slider)
- globals.css: eliminada la utility .marco-arco por completo
- hero-secuencia.tsx + la-sala.tsx: marco-arco → rounded-[10px] (mismo radio cuadrado del lienzo Estudio aprobado en Task 9 — consistencia total)
- Grep verificado: cero referencias a marco-arco/999px/rounded-t-[* en src/
- QA visual (agent-browser): download/qa/qa-sin-arco-hero.png, qa-sin-arco-la-sala.png, qa-sin-arco-catalogo.png — hero, slider y catálogo todos con esquinas cuadradas 10px, badges "Pieza única" bien posicionados
- CLAUDE.md: motivo "marcos de arco" marcado ELIMINADO en Design System Selva Viva (rombo + textura tejido permanecen)

Stage Summary:
- El motivo arco quedó retirado de TODA la UI viva (hero, La Sala, catálogo, Estudio); lenguaje visual unificado: tarjetas cuadradas 10px
- Rombo del bordado sigue como único motivo de marca en marcos decorativos
- Decisión de diseño registrada en CLAUDE.md para que futuros componentes no reintroduzcan arcos
