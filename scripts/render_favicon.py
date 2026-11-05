"""Favicon + og:image de Macumba Arte-Magia.

Renderiza con Playwright tres activos de marca:
  1. icon.png       512×512 — M de Macumba (Macondo), fondo verde claro, M verde selva.
                              Esquinas redondeadas con transparencia.
  2. apple-icon.png 180×180 — mismo diseño, cuadrado pleno (iOS aplica su propia máscara).
  3. og-image.png  1200×630 — vista previa al compartir el enlace (WhatsApp, etc.).

Colores de la paleta del sitio (globals.css):
  verde claro #CDE9D5 (tinte del verde selva) · verde #1E5631 · tinta #14281d · crema #f7f3e9
"""

import pathlib

from playwright.sync_api import sync_playwright

FUENTE = pathlib.Path("/tmp/Macondo-Regular.ttf").as_uri()
SALIDA = pathlib.Path("/home/z/my-project")

VERDE_CLARO = "#CDE9D5"
VERDE = "#1E5631"
TINTA = "#14281d"
CREMA = "#f7f3e9"

HTML_ICONO = f"""<!doctype html>
<html><head><style>
@font-face {{ font-family: 'Macondo'; src: url('{FUENTE}') format('truetype'); }}
html, body {{ margin: 0; padding: 0; background: transparent; }}
.caja {{
  width: 512px; height: 512px; box-sizing: border-box;
  background: {VERDE_CLARO};
  border-radius: 112px;
  display: flex; align-items: center; justify-content: center;
}}
.m {{
  font-family: 'Macondo';
  font-size: 400px;
  line-height: 1;
  color: {VERDE};
  transform: translateY(-18px);
}}
</style></head>
<body><div class="caja"><span class="m">M</span></div></body></html>"""

HTML_OG = f"""<!doctype html>
<html><head><style>
@font-face {{ font-family: 'Macondo'; src: url('{FUENTE}') format('truetype'); }}
html, body {{ margin: 0; padding: 0; }}
.lienzo {{
  width: 1200px; height: 630px; box-sizing: border-box;
  background: {CREMA};
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 26px;
}}
.chip {{
  width: 148px; height: 148px; border-radius: 34px;
  background: {VERDE_CLARO};
  display: flex; align-items: center; justify-content: center;
}}
.chip span {{
  font-family: 'Macondo'; font-size: 118px; line-height: 1;
  color: {VERDE}; transform: translateY(-6px);
}}
.marca {{
  font-family: 'Macondo'; font-size: 168px; line-height: 0.9;
  color: {TINTA};
}}
.linea {{
  font-family: sans-serif; font-weight: 700; font-size: 38px;
  letter-spacing: 15px; text-indent: 15px;
  color: {VERDE};
}}
.pie {{
  font-family: sans-serif; font-weight: 600; font-size: 23px;
  letter-spacing: 4px;
  color: {TINTA}; opacity: 0.62;
}}
</style></head>
<body><div class="lienzo">
  <div class="chip"><span>M</span></div>
  <div class="marca">Macumba</div>
  <div class="linea">ARTE-MAGIA</div>
  <div class="pie">MODA QUE VISTE ARTE &nbsp;·&nbsp; HECHO A MANO EN BOGOTÁ</div>
</div></body></html>"""


def render(html: str, ruta: str, ancho: int, alto: int, sin_fondo: bool) -> None:
    tmp = pathlib.Path(f"/tmp/render-{pathlib.Path(ruta).name}.html")
    tmp.write_text(html, encoding="utf-8")
    with sync_playwright() as p:
        navegador = p.chromium.launch()
        pagina = navegador.new_page(viewport={"width": ancho, "height": alto})
        pagina.goto(tmp.as_uri())
        pagina.screenshot(path=ruta, omit_background=sin_fondo)
        navegador.close()
    print(f"OK {ruta}")


render(HTML_ICONO, str(SALIDA / "src/app/icon.png"), 512, 512, sin_fondo=True)
render(HTML_ICONO, str(SALIDA / "src/app/apple-icon.png"), 180, 180, sin_fondo=False)
render(HTML_OG, str(SALIDA / "public/og-image.png"), 1200, 630, sin_fondo=False)
