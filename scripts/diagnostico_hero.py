#!/usr/bin/env python3
"""Diagnóstico del hero: mide elementos y estilos computados."""
from playwright.sync_api import sync_playwright

BASE = "/home/z/my-project/download/macumba-design-system"

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1560, "height": 1900}, device_scale_factor=2)
    page.goto(f"file://{BASE}/index.html", wait_until="networkidle")
    page.wait_for_timeout(2000)
    data = page.evaluate("""() => {
        const g = (sel) => {
            const el = document.querySelector(sel);
            if (!el) return null;
            const r = el.getBoundingClientRect();
            const cs = getComputedStyle(el);
            return {x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height),
                    pos: cs.position, display: cs.display};
        };
        return {
            page_hero: g('#pg-hero'),
            hero: g('.hero'),
            txt: g('.hero .txt'),
            foto: g('.hero .foto'),
            marco: g('.hero .foto .marco'),
            secuencia: g('.hero .secuencia'),
            th0: g('.hero .secuencia .th'),
            th0img: (() => { const el = document.querySelector('.hero .secuencia .th img');
                if (!el) return null; const r = el.getBoundingClientRect();
                return {w: Math.round(r.width), h: Math.round(r.height)}; })(),
            dots: g('.hero .dots'),
            n_th: document.querySelectorAll('.hero .secuencia .th').length,
        };
    }""")
    for k, v in data.items():
        print(f"{k}: {v}")
    browser.close()
