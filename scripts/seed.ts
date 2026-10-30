// Seed del catálogo "La Sala" — Macumba Shop
// 10 piezas únicas con foto real (arte del colectivo) — el arte es INTOCABLE
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
      'La cazadora roja clásica de la serie: denim rojo intenso con el arte del colectivo pintado a mano en la espalda. Frente limpio, espalda que cuenta la historia — cada trazo es del colectivo sobre tela que ya tuvo otra vida.',
    technique: 'Pintura textil a mano',
    material: 'Denim reciclado',
    imageUrl: '/tienda/pasarela-01.png',
    heroImageUrl: '/tienda/pasarela-02.png',
    serieLabel: 'COLECCIÓN MACUMBA · 01/10',
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
    serieLabel: 'COLECCIÓN MACUMBA · 02/10',
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
    serieLabel: 'COLECCIÓN MACUMBA · 03/10',
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
    imageUrl: '/tienda/sala-alma-dorada.jpg',
    heroImageUrl: null,
    serieLabel: 'COLECCIÓN MACUMBA · 04/10',
    isFeatured: true,
    sortOrder: 4,
  },
  {
    slug: 'alas-tejidas',
    name: 'Alas Tejidas',
    category: 'chaqueta',
    gender: 'femenino',
    kind: 'unica',
    basePrice: 480000,
    sizes: 'S,M,L',
    description:
      'Denim celeste rescatado con un pájaro bordado a mano en la espalda, flores de crochet y puños tejidos en degradé arcoíris. Pieza al detalle: hilo por hilo sobre tela que ya tuvo otra vida — no se repite.',
    technique: 'Bordado y crochet a mano',
    material: 'Denim reciclado',
    imageUrl: '/tienda/sala-alas-tejidas.jpg',
    heroImageUrl: null,
    serieLabel: 'COLECCIÓN MACUMBA · 05/10',
    isFeatured: true,
    sortOrder: 5,
  },
  {
    slug: 'selva-nocturna',
    name: 'Selva Nocturna',
    category: 'abrigo',
    gender: 'femenino',
    kind: 'unica',
    basePrice: 520000,
    sizes: 'M,L,XL',
    description:
      'Abrigo largo en denim negro con bordado turquesa en el pecho y puños y ruedo rematados en crochet multicolor. La calma de la selva sobre la ciudad: arte trenzado a mano, una sola vez.',
    technique: 'Bordado y crochet a mano',
    material: 'Denim reciclado',
    imageUrl: '/tienda/sala-selva-nocturna.jpg',
    heroImageUrl: null,
    serieLabel: 'COLECCIÓN MACUMBA · 06/10',
    isFeatured: true,
    sortOrder: 6,
  },
  // ---------- PIEZAS ÚNICAS NUEVAS (fotos reales del cliente) ----------
  // NOMBRES Y PRECIOS PROVISIONALES — se corrigen cuando lleguen los datos reales
  {
    slug: 'totem-jaguar',
    name: 'Tótem Jaguar',
    category: 'chaqueta',
    gender: 'masculino',
    kind: 'unica',
    basePrice: 450000,
    sizes: 'S,M,L,XL',
    description:
      'Denim negro intervenido con desgastes al tono y una composición pintada a mano en la espalda: el jaguar y una figura con pintura facial ceremonial, capturados en el street de Bogotá. Una sola pieza, firmada por el proceso.',
    technique: 'Pintura textil a mano',
    material: 'Denim reciclado',
    imageUrl: '/tienda/pieza-totem-jaguar.jpg',
    heroImageUrl: null,
    serieLabel: 'COLECCIÓN MACUMBA · 07/10',
    isFeatured: true,
    sortOrder: 7,
  },
  {
    slug: 'mujer-de-maiz',
    name: 'Mujer de Maíz',
    category: 'chaqueta',
    gender: 'masculino',
    kind: 'unica',
    basePrice: 460000,
    sizes: 'S,M,L',
    description:
      'Denim violeta lavado al ácido con una pintura a mano en la espalda: la mujer indígena que abraza la cosecha de maíz, símbolo de abundancia. Corte clásico, arte que se ve desde donde te pongas.',
    technique: 'Pintura textil a mano',
    material: 'Denim reciclado',
    imageUrl: '/tienda/pieza-mujer-de-maiz.jpg',
    heroImageUrl: null,
    serieLabel: 'COLECCIÓN MACUMBA · 08/10',
    isFeatured: true,
    sortOrder: 8,
  },
  {
    slug: 'mosaico-andino',
    name: 'Mosaico Andino',
    category: 'abrigo',
    gender: 'masculino',
    kind: 'unica',
    basePrice: 520000,
    sizes: 'M,L,XL',
    description:
      'Abrigo largo construido en patchwork de jeans reciclados en distintos tonos: cuello alto, cinturón y bolsas de cargo generosas. Cada retazo fue una prenda que Bogotá descartó — armado a mano, no se repite.',
    technique: 'Patchwork y costura a mano',
    material: 'Denim reciclado',
    imageUrl: '/tienda/pieza-mosaico-andino.jpg',
    heroImageUrl: null,
    serieLabel: 'COLECCIÓN MACUMBA · 09/10',
    isFeatured: true,
    sortOrder: 9,
  },
  {
    slug: 'patchwork-violeta',
    name: 'Patchwork Violeta',
    category: 'chaqueta',
    gender: 'femenino',
    kind: 'unica',
    basePrice: 440000,
    sizes: 'S,M,L',
    description:
      'Patchwork de denim en azules y morado con mangas bufantes en denim claro: piezas de distintas vidas unidas en una sola silueta. Costura a mano sobre textiles rescatados, una sola vez.',
    technique: 'Patchwork y costura a mano',
    material: 'Denim reciclado',
    imageUrl: '/tienda/pieza-patchwork-violeta.jpg',
    heroImageUrl: null,
    serieLabel: 'COLECCIÓN MACUMBA · 10/10',
    isFeatured: true,
    sortOrder: 10,
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
