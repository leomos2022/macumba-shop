// Seed del catálogo "La Sala" — Macumba Shop
// 5 piezas únicas reales de la pasarela (arte de Robert / Arley) + 4 siluetas personalizables de El Estudio
// Precios de REFERENCIA — por confirmar con el taller
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const productos = [
  // ---------- PIEZAS ÚNICAS (pasarela real, arte pintado a mano) ----------
  {
    slug: 'selva-roja',
    name: 'Selva Roja',
    category: 'chaqueta',
    gender: 'femenino',
    kind: 'unica',
    basePrice: 420000,
    sizes: 'S,M,L,XL',
    description:
      'La cazadora roja clásica de la serie: denim rojo intenso con el arte del colectivo pintado a mano en la espalda. Frente limpio, espalda que cuenta la historia — cada trazo es de Robert y Arley sobre tela que ya tuvo otra vida.',
    technique: 'Pintura textil a mano',
    material: 'Denim reciclado',
    imageUrl: '/tienda/pasarela-01.png',
    heroImageUrl: '/tienda/pasarela-02.png',
    serieLabel: 'COLECCIÓN MACUMBA · 01/05',
    isFeatured: true,
    sortOrder: 1,
  },
  {
    slug: 'asian-soul',
    name: 'Asian Soul',
    category: 'chaqueta',
    gender: 'femenino',
    kind: 'unica',
    basePrice: 460000,
    sizes: 'S,M,L',
    description:
      'Influencias del oriente sobre denim reciclado: trazos que mezclan caligrafía y selva tropical en una sola pieza. Pintada a mano pincelada a pincelada, sin repetición posible.',
    technique: 'Pintura textil a mano',
    material: 'Denim reciclado',
    imageUrl: '/tienda/pasarela-04.png',
    heroImageUrl: null,
    serieLabel: 'COLECCIÓN MACUMBA · 02/05',
    isFeatured: true,
    sortOrder: 2,
  },
  {
    slug: 'black-inspiration',
    name: 'Black Inspiration',
    category: 'chaqueta',
    gender: 'masculino',
    kind: 'unica',
    basePrice: 390000,
    sizes: 'M,L,XL',
    description:
      'Denim negro de fondo profundo para que el arte hable solo: composición pintada a mano que juega con el contraste y la sombra. Corte clásico masculino, arte que se ve desde donde te pongas.',
    technique: 'Pintura textil a mano',
    material: 'Denim reciclado',
    imageUrl: '/tienda/pasarela-03.png',
    heroImageUrl: null,
    serieLabel: 'COLECCIÓN MACUMBA · 03/05',
    isFeatured: true,
    sortOrder: 3,
  },
  {
    slug: 'alma-dorada',
    name: 'Alma Dorada',
    category: 'abrigo',
    gender: 'femenino',
    kind: 'unica',
    basePrice: 520000,
    sizes: 'M,L,XL',
    description:
      'El abrigo largo de la serie: silueta contundente y arte en tonos dorados que recorre la pieza de arriba a abajo. La prenda más escénica del colectivo, hecha para durar muchos inviernos.',
    technique: 'Pintura textil a mano',
    material: 'Denim reciclado',
    imageUrl: '/tienda/pasarela-05.png',
    heroImageUrl: null,
    serieLabel: 'COLECCIÓN MACUMBA · 04/05',
    isFeatured: true,
    sortOrder: 4,
  },
  {
    slug: 'espiritu-leon',
    name: 'Espíritu León',
    category: 'chaqueta',
    gender: 'masculino',
    kind: 'unica',
    basePrice: 480000,
    sizes: 'L,XL',
    description:
      'La fuerza del león pintada a mano sobre denim reciclado: el animal espiritual del colectivo en una pieza de carácter. Frente limpio, arte protagonista en la espalda.',
    technique: 'Pintura textil a mano',
    material: 'Denim reciclado',
    imageUrl: '/tienda/pasarela-06.png',
    heroImageUrl: null,
    serieLabel: 'COLECCIÓN MACUMBA · 05/05',
    isFeatured: true,
    sortOrder: 5,
  },
  // ---------- PERSONALIZABLES (siluetas base de El Estudio) ----------
  {
    slug: 'cazadora-personalizable',
    name: 'Cazadora a tu manera',
    category: 'chaqueta',
    gender: 'unisex',
    kind: 'personalizable',
    basePrice: 250000,
    sizes: 'S,M,L,XL',
    description:
      'Tu cazadora denim reciclada, tu color y tu arte: en El Estudio eliges la silueta, el tono, la técnica (pintura o bordado) y el diseño que la hará única. Robert y Arley la hacen realidad.',
    technique: 'Pintura o bordado a elegir',
    material: 'Denim reciclado',
    imageUrl: '/tienda/sil-cazadora.png',
    heroImageUrl: null,
    serieLabel: null,
    isFeatured: false,
    sortOrder: 6,
  },
  {
    slug: 'chaqueta-corta-personalizable',
    name: 'Chaqueta corta a tu manera',
    category: 'chaqueta',
    gender: 'unisex',
    kind: 'personalizable',
    basePrice: 230000,
    sizes: 'S,M,L,XL',
    description:
      'La chaqueta corta de denim reciclado que se adapta a tu historia: escoges color base, técnica y arte con nuestro colectivo. Ideal para un primer encargo en El Estudio.',
    technique: 'Pintura o bordado a elegir',
    material: 'Denim reciclado',
    imageUrl: '/tienda/sil-corta.png',
    heroImageUrl: null,
    serieLabel: null,
    isFeatured: false,
    sortOrder: 7,
  },
  {
    slug: 'abrigo-personalizable',
    name: 'Abrigo a tu manera',
    category: 'abrigo',
    gender: 'unisex',
    kind: 'personalizable',
    basePrice: 450000,
    sizes: 'M,L,XL',
    description:
      'Un abrigo de lana reciclada en el color que prefieras, con bordado o pintura diseñada contigo. La prenda más contundente de El Estudio, hecha para durar muchos inviernos.',
    technique: 'Pintura o bordado a elegir',
    material: 'Lana reciclada',
    imageUrl: '/tienda/sil-abrigo.png',
    heroImageUrl: null,
    serieLabel: null,
    isFeatured: false,
    sortOrder: 8,
  },
  {
    slug: 'cazadora-oversize-personalizable',
    name: 'Cazadora oversize a tu manera',
    category: 'chaqueta',
    gender: 'masculino',
    kind: 'personalizable',
    basePrice: 260000,
    sizes: 'L,XL',
    description:
      'Cazadora oversize de denim reciclado, lista para recibir tu arte: desde un motivo pequeño en el pecho hasta una composición completa en la espalda. Tú decides con el colectivo.',
    technique: 'Pintura o bordado a elegir',
    material: 'Denim reciclado',
    imageUrl: '/tienda/sil-hombre.png',
    heroImageUrl: null,
    serieLabel: null,
    isFeatured: false,
    sortOrder: 9,
  },
];

async function main() {
  console.log('Limpiando catálogo…');
  await db.product.deleteMany({});

  console.log(`Insertando ${productos.length} productos…`);
  for (const p of productos) {
    await db.product.create({ data: p });
    console.log(`  ✓ ${p.name}`);
  }

  const total = await db.product.count();
  console.log(`Listo: ${total} productos en La Sala.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
