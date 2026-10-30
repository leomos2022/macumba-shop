#!/usr/bin/env python3
"""Mide el ancho de barras negras laterales por frame del reel-modelos.mp4."""
import subprocess, os, glob
from PIL import Image
import numpy as np

VID = "/home/z/my-project/public/tienda/reel-modelos.mp4"
OUT = "/home/z/my-project/qa-video/barras"
os.makedirs(OUT, exist_ok=True)
for f in glob.glob(f"{OUT}/*.png"):
    os.remove(f)

# 6 fps -> 72 frames de 12 s, reducidos a 270x360 (1/4) para velocidad
subprocess.run(
    ["ffmpeg", "-y", "-i", VID, "-vf", "fps=6,scale=270:360", f"{OUT}/b%03d.png"],
    check=True, capture_output=True,
)

ESCALA = 4  # multiplicar para px originales (1080x1440)
files = sorted(glob.glob(f"{OUT}/*.png"))
print(f"frames: {len(files)}")
print(f"{'t(s)':>6} {'barIzq':>7} {'barDer':>7} {'oscIzq%':>8} {'oscDer%':>8}")
max_izq = max_der = 0
for i, f in enumerate(files):
    t = (i + 1) / 6
    im = np.asarray(Image.open(f).convert("L"), dtype=np.float32)
    h, w = im.shape
    colmean = im.mean(axis=0)
    izq = 0
    while izq < w // 3 and colmean[izq] < 28:
        izq += 1
    der = 0
    while der < w // 3 and colmean[w - 1 - der] < 28:
        der += 1
    izq, der = izq * ESCALA, der * ESCALA
    max_izq = max(max_izq, izq)
    max_der = max(max_der, der)
    osc_izq = float((colmean[:15] < 40).mean()) * 100
    osc_der = float((colmean[-15:] < 40).mean()) * 100
    flag = "  <-- barras" if izq > 8 or der > 8 else ""
    print(f"{t:6.2f} {izq:7d} {der:7d} {osc_izq:8.1f} {osc_der:8.1f}{flag}")
print(f"\nMAX barra izq: {max_izq}px  |  MAX barra der: {max_der}px")
