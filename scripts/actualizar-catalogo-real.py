# Reemplaza el catálogo genérico por las 8 piezas reales de Robert
# con los precios confirmados por el usuario (nov 2026):
#   - Abrigos: ambos 350.000 ("los abrigos igual a 350.000")
#   - Cazadora unisex talla única: 250.000
#   - Cazadora unisex diseño (rosada/lavanda): 270.000
#   - Cazadora unisex diseño (jaguar): 270.000 (por nombre de archivo de Robert;
#     provisional, confirmar mañana)
#   - Chaqueta torero femenina: 250.000 (provisional, confirmar mañana)
import sqlite3
import os
from datetime import datetime

RUTA_DB = "/home/z/my-project/db/custom.db"
BACKUP = "/home/z/my-project/backups/custom-backup-2026-11-07.db"

os.makedirs(os.path.dirname(BACKUP), exist_ok=True)
con = sqlite3.connect(RUTA_DB)
con.backup(sqlite3.connect(BACKUP))
print(f"Backup en {BACKUP}")

con = sqlite3.connect(RUTA_DB)
cur = con.cursor()

cur.execute("DELETE FROM products")
print("Catálogo anterior eliminado (6 filas)")

def cuid():
    return "c" + os.urandom(12).hex()

PIEZAS = [
    {
        "slug": "chaqueta-torero-femenina",
        "name": "Chaqueta torero femenina (talla única)",
        "category": "chaqueta-torero",
        "gender": "femenino",
        "kind": "pedido",
        "basePrice": 250000,
        "description": (
            "Chaqueta torero de denim con un rostro femenino y pájaros en rojo, "
            "pintados a mano sobre la espalda. Se confecciona a pedido en cuatro "
            "colores: gris, azul, azul hielo y negra."
        ),
        "technique": "Pintura textil",
        "imageUrl": "/tienda/cat-chaqueta-torero.jpg",
        "sortOrder": 1,
    },
    {
        "slug": "cazadora-corta-pavorreal",
        "name": "Cazadora corta diseño (pavorreal)",
        "category": "cazadora",
        "gender": "femenino",
        "kind": "unica",
        "basePrice": 250000,
        "description": (
            "Cazadora corta de denim con un pavorreal pintado a mano en la espalda: "
            "plumaje azul, verde y naranja sobre degradados amarillos y violetas. "
            "La foto es la pieza real: única e irrepetible."
        ),
        "technique": "Pintura textil",
        "imageUrl": "/tienda/cat-cazadora-pavorreal.jpg",
        "sortOrder": 2,
    },
    {
        "slug": "cazadora-retrato-tropical",
        "name": "Cazadora unisex talla única (retrato tropical)",
        "category": "cazadora",
        "gender": "unisex",
        "kind": "unica",
        "basePrice": 250000,
        "description": (
            "Un rostro rodeado de selva, hojas y flores amarillas, pintado a mano "
            "sobre cazadora roja de denim. La foto es la pieza real: única e "
            "irrepetible."
        ),
        "technique": "Pintura textil",
        "imageUrl": "/tienda/cat-cazadora-tropical.jpg",
        "sortOrder": 3,
    },
    {
        "slug": "cazadora-mirada-psicodelica",
        "name": "Cazadora unisex talla única (mirada psicodélica)",
        "category": "cazadora",
        "gender": "unisex",
        "kind": "unica",
        "basePrice": 250000,
        "description": (
            "Cazadora violeta con una figura de gafas amarillas rodeada de ojos y "
            "texturas psicodélicas, pintada a mano. La foto es la pieza real: "
            "única e irrepetible."
        ),
        "technique": "Pintura textil",
        "imageUrl": "/tienda/cat-cazadora-festival.jpg",
        "sortOrder": 4,
    },
    {
        "slug": "cazadora-diseno-rosada",
        "name": "Cazadora unisex diseño (pájaro entre flores)",
        "category": "cazadora",
        "gender": "unisex",
        "kind": "unica",
        "basePrice": 270000,
        "description": (
            "Cazadora lavanda con un pájaro posado en una rama entre flores "
            "rosadas, pintado a mano sobre un cielo en degradado. La foto es la "
            "pieza real: única e irrepetible."
        ),
        "technique": "Pintura textil",
        "imageUrl": "/tienda/cat-cazadora-rosada.jpg",
        "sortOrder": 5,
    },
    {
        "slug": "cazadora-diseno-jaguar",
        "name": "Cazadora unisex diseño (jaguar nocturno)",
        "category": "cazadora",
        "gender": "unisex",
        "kind": "unica",
        "basePrice": 270000,
        "description": (
            "Cazadora de denim con un jaguar pintado a mano trepando una rama, en "
            "tonos amarillos y morados. La foto es la pieza real: única e "
            "irrepetible."
        ),
        "technique": "Pintura textil",
        "imageUrl": "/tienda/cat-cazadora-jaguar.jpg",
        "sortOrder": 6,
    },
    {
        "slug": "abrigo-pajaro-tejido",
        "name": "Abrigo femenino (pájaro y flores tejidas)",
        "category": "abrigo",
        "gender": "femenino",
        "kind": "unica",
        "basePrice": 350000,
        "description": (
            "Abrigo de denim claro con un pájaro bordado a mano y flores de "
            "crochet en tonos cálidos; puños con tejido artesanal. La foto es la "
            "pieza real: única e irrepetible."
        ),
        "technique": "Bordado y crochet a mano",
        "imageUrl": "/tienda/cat-abrigo-tejido.jpg",
        "sortOrder": 7,
    },
    {
        "slug": "abrigo-tigre-blanco",
        "name": "Abrigo femenino (tigre blanco)",
        "category": "abrigo",
        "gender": "femenino",
        "kind": "unica",
        "basePrice": 350000,
        "description": (
            "Abrigo largo de denim con un tigre blanco pintado a mano, rodeado de "
            "hojas y cintas rosadas sobre fondo degradado. La foto es la pieza "
            "real: única e irrepetible."
        ),
        "technique": "Pintura textil",
        "imageUrl": "/tienda/cat-abrigo-tigre.jpg",
        "sortOrder": 8,
    },
]

ahora = datetime.now().isoformat(sep=" ", timespec="seconds")

for p in PIEZAS:
    cur.execute(
        """INSERT INTO products
           (id, slug, name, category, gender, kind, basePrice, sizes,
            description, technique, material, imageUrl, heroImageUrl,
            serieLabel, isFeatured, sortOrder, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, 'Talla única', ?, ?, 'Denim', ?,
                   NULL, NULL, 1, ?, ?, ?)""",
        (
            cuid(), p["slug"], p["name"], p["category"], p["gender"],
            p["kind"], p["basePrice"], p["description"], p["technique"],
            p["imageUrl"], p["sortOrder"], ahora, ahora,
        ),
    )

con.commit()

print("\n=== Catálogo nuevo ===")
for r in cur.execute(
    "SELECT sortOrder, name, gender, kind, basePrice, imageUrl FROM products ORDER BY sortOrder"
):
    print(f"{r[0]}. {r[1]:52s} {r[2]:8s} {r[3]:6s} ${r[4]:,.0f}  {r[5]}")

con.close()
