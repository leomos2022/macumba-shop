# Prepara las fotos reales de Robert para el catálogo de Macumba Shop.
# - Convierte a JPEG (los PNG pesaban ~1.5MB cada uno)
# - Calidad 85, sin metadatos EXIF (privacidad)
# - Nombres limpios que coinciden con los slugs del catálogo
from PIL import Image
import os

ORIGEN = "/home/z/my-project/upload"
DESTINO = "/home/z/my-project/public/tienda"

# (archivo original, nombre final)
MAPA = [
    ("chaqueta clasica corta femenina 250.000.png", "cat-cazadora-pavorreal.jpg"),
    ("chaqueta claseica corta femenin 250.000.png", "cat-abrigo-tejido.jpg"),
    ("abrigo femenino 350.000.png", "cat-abrigo-tigre.jpg"),
    ("chaueta femenina tipo torero talla unica (gris, azul, azul hielo y negra).png", "cat-chaqueta-torero.jpg"),
    ("cazadora diseno pintura textil 270.000.png", "cat-cazadora-tropical.jpg"),
    ("cazadora unisex talla unica.jpeg", "cat-cazadora-festival.jpg"),
    ("WhatsApp Image 2026-10-08 at 15.18.16.jpeg", "cat-cazadora-rosada.jpg"),
    ("cazadora unizex 270000.jpeg", "cat-cazadora-jaguar.jpg"),
]

for original, final in MAPA:
    ruta = os.path.join(ORIGEN, original)
    im = Image.open(ruta)

    # Foto limpia: sin EXIF ni metadatos
    limpia = Image.new("RGB", im.size)
    limpia.putdata(list(im.convert("RGB").getdata()))

    # Límite de ancho razonable para web
    if limpia.width > 1200:
        alto = int(limpia.height * 1200 / limpia.width)
        limpia = limpia.resize((1200, alto), Image.LANCZOS)

    salida = os.path.join(DESTINO, final)
    limpia.save(salida, "JPEG", quality=85, optimize=True)

    kb_orig = os.path.getsize(ruta) // 1024
    kb_final = os.path.getsize(salida) // 1024
    print(f"{final:30s} {limpia.size[0]}x{limpia.size[1]}  {kb_orig}KB -> {kb_final}KB")

print("\nListo: 8 fotos en public/tienda/")
