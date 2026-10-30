# Fotos reales del catálogo (chaqueta10-13 del cliente) → public/tienda
# Regla de oro: el arte es INTOCABLE — solo re-encode JPEG, sin filtros ni recortes.
from PIL import Image
import os

MAPA = {
    'chaqueta10.jpeg': 'pieza-totem-jaguar.jpg',      # denim negro, jaguar + figura tótem
    'chaqueta11.jpeg': 'pieza-mujer-de-maiz.jpg',     # violeta, mujer indígena con maíz
    'chaqueta12.jpeg': 'pieza-mosaico-andino.jpg',    # abrigo largo patchwork de jeans
    'chaqueta13.jpeg': 'pieza-patchwork-violeta.jpg', # patchwork azules+morado, mangas bufantes
}

for origen, destino in MAPA.items():
    ruta = os.path.join('upload', origen)
    im = Image.open(ruta).convert('RGB')
    out = os.path.join('public/tienda', destino)
    im.save(out, 'JPEG', quality=82, optimize=True, progressive=True)
    print(f'{origen} {im.size} → {destino} {os.path.getsize(out)//1024}KB')
