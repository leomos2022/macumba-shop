#!/bin/bash
# Genera las fotografías de prendas estilo Macumba para los mockups del design system
# Estilo: arte selvático pintado a mano, paleta verde selva / verde pistacho / morado

A="/home/z/my-project/download/macumba-design-system/assets"

# ── EDITORIALES (fondo crema, hero) ─────────────────────────────
z-ai image -p "Editorial fashion photography, black denim jacket laid flat on warm cream linen fabric background, hand-painted jungle art with an emerald green jaguar head and purple tropical birds, lush green leaves surrounding, artisanal textile paint style, vibrant colors, soft studio lighting, high quality, detailed" -o "$A/hero-cazadora.png" -s 864x1152

z-ai image -p "Editorial fashion photography, long dark wool coat with colorful patchwork textile panels and embroidered jungle flowers, laid flat on warm cream linen background, artisanal Colombian style, purple green and magenta tones, soft studio lighting, high quality, detailed" -o "$A/hero-abrigo.png" -s 864x1152

z-ai image -p "Editorial fashion photography, short cropped black denim jacket with hand-painted purple hummingbirds and emerald green tropical foliage, laid flat on warm cream linen background, artisanal textile paint art, soft studio lighting, high quality, detailed" -o "$A/hero-corta.png" -s 864x1152

z-ai image -p "Editorial fashion photography, men's classic denim jacket with hand-painted jungle design, green monstera leaves and purple orchids, laid flat on warm cream linen background, artisanal textile paint art, soft studio lighting, high quality, detailed" -o "$A/hero-hombre.png" -s 864x1152

# ── CATÁLOGO (fondo blanco puro, e-commerce) ────────────────────
z-ai image -p "E-commerce product photography, black denim jacket with hand-painted emerald green jaguar and purple birds design, flat lay on pure white background, clean minimal catalog style, professional studio lighting, high quality, detailed" -o "$A/cat-jaguar.png" -s 864x1152

z-ai image -p "E-commerce product photography, long dark coat with colorful patchwork panels and embroidered jungle flowers, flat lay on pure white background, clean minimal catalog style, professional studio lighting, high quality, detailed" -o "$A/cat-abrigo.png" -s 864x1152

z-ai image -p "E-commerce product photography, short cropped denim jacket with hand-painted purple hummingbirds and green leaves, flat lay on pure white background, clean minimal catalog style, professional studio lighting, high quality, detailed" -o "$A/cat-corta.png" -s 864x1152

z-ai image -p "E-commerce product photography, men's denim jacket with hand-painted green monstera leaves and purple orchids, flat lay on pure white background, clean minimal catalog style, professional studio lighting, high quality, detailed" -o "$A/cat-hombre.png" -s 864x1152

# ── SILUETAS LISAS (sin diseño, para El Estudio) ────────────────
z-ai image -p "E-commerce product photography, plain short cropped black denim jacket with no design, flat lay on pure white background, minimal clean, professional studio lighting, high quality" -o "$A/sil-corta.png" -s 864x1152

z-ai image -p "E-commerce product photography, plain black denim trucker jacket with no design, flat lay on pure white background, minimal clean, professional studio lighting, high quality" -o "$A/sil-cazadora.png" -s 864x1152

z-ai image -p "E-commerce product photography, plain camel beige long wool coat with no design, flat lay on pure white background, minimal clean, professional studio lighting, high quality" -o "$A/sil-abrigo.png" -s 864x1152

z-ai image -p "E-commerce product photography, plain classic blue denim men's jacket with no design, flat lay on pure white background, minimal clean, professional studio lighting, high quality" -o "$A/sil-hombre.png" -s 864x1152

# ── TEXTURA DE TEJIDO (fondo de secciones) ──────────────────────
z-ai image -p "Close-up texture of deep green woven artisanal fabric, Colombian mochila weaving pattern, subtle diagonal threads, soft natural light, dark emerald tones, high quality" -o "$A/textura-tejido.png" -s 1344x768

echo "IMAGENES LISTAS"
ls -la "$A"
