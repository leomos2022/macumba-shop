#!/usr/bin/env python3
"""Renderiza el design system de Macumba a PNG (device_scale_factor=2)."""
from playwright.sync_api import sync_playwright
import os

BASE = "/home/z/my-project/download/macumba-design-system"
OUT = BASE
PAGES = [
    ("#pg-fundamentos", "01-fundamentos-paleta-tipografia.png"),
    ("#pg-hero",        "02-inicio-hero-desktop.png"),
    ("#pg-mobile",      "03-inicio-hero-mobile.png"),
    ("#pg-catalogo",    "04-catalogo-la-sala.png"),
    ("#pg-estudio",     "05-el-estudio.png"),
]

with sync_playwright() as p:
    browser = p.chromium.launch()
    # Viewport alto: evita scroll/stitching durante la captura de elementos
    page = browser.new_page(viewport={"width": 1560, "height": 1900}, device_scale_factor=2)
    page.goto(f"file://{BASE}/index.html", wait_until="networkidle")
    # Espera a que las fuentes de Google estén listas
    page.evaluate("document.fonts.ready.then(() => true)")
    page.wait_for_timeout(2500)
    for sel, fname in PAGES:
        el = page.locator(sel)
        page.wait_for_timeout(300)
        el.screenshot(path=os.path.join(OUT, fname))
        print(f"OK  {fname}")
    browser.close()
print("RENDER COMPLETO")
