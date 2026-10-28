#!/usr/bin/env python3
"""Renderiza los mockups La Sala + El Estudio a PNG (device_scale_factor=2)."""
from playwright.sync_api import sync_playwright
import os

BASE = "/home/z/my-project/download/macumba-mockups"
PAGES = [
    ("#pg-sala-slider",  "01-sala-slider-continuo-desktop.png"),
    ("#pg-sala-movil",   "02-sala-slider-continuo-movil.png"),
    ("#pg-sala-ficha",   "03-sala-ficha-rapida.png"),
    ("#pg-sala-catalogo","04-sala-catalogo-estatico.png"),
    ("#pg-estudio",      "05-estudio-ghost-mannequin.png"),
]

only = os.environ.get("SOLO")
pares = [p for p in PAGES if not only or p[1].startswith(only)]

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1560, "height": 2000}, device_scale_factor=2)
    page.goto(f"file://{BASE}/index.html", wait_until="networkidle")
    page.evaluate("document.fonts.ready.then(() => true)")
    page.wait_for_timeout(2500)
    for sel, fname in pares:
        el = page.locator(sel)
        page.wait_for_timeout(300)
        el.screenshot(path=os.path.join(BASE, fname))
        print(f"OK  {fname}")
    browser.close()
print("RENDER COMPLETO")
