#!/usr/bin/env python3
"""Fotos reales para La Sala: convierte las fotos del chat a JPEG optimizado."""
from PIL import Image
import os

SRC = "/home/z/my-project/upload"
DST = "/home/z/my-project/public/tienda"

FOTOS = [
    # (archivo origen en upload/, nombre final en public/tienda/)
    ("chaqueta-bordado-tejido.jpeg", "sala-alas-tejidas.jpg"),
    ("personalizable.jpeg", "sala-alma-dorada.jpg"),
    ("Gemini_Generated_Image_dtl1d0dtl1d0dtl1.jpeg", "sala-selva-nocturna.jpg"),
]

for origen, destino in FOTOS:
    ruta = os.path.join(SRC, origen)
    im = Image.open(ruta).convert("RGB")
    w, h = im.size
    if max(w, h) > 1440:
        f = 1440 / max(w, h)
        im = im.resize((round(w * f), round(h * f)), Image.LANCZOS)
    salida = os.path.join(DST, destino)
    im.save(salida, "JPEG", quality=86, optimize=True, progressive=True)
    print(f"{destino}: {im.size[0]}x{im.size[1]}  ({os.path.getsize(salida)//1024} KB)")
