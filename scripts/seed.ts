// Seed del catálogo — Macumba Arte-Magia
// 8 piezas reales del taller con foto y precio confirmados (nov 2026):
//   · 7 piezas únicas (talla única, la foto es la prenda exacta)
//   · 1 hecha a pedido (chaqueta torero femenina, en 4 colores)
// Precios: torero 250.000 y jaguar 270.000 provisionales — confirmar con Robert.
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const productos = [
  {
    slug: 'chaqueta-torero-femenina',
    name: 'Chaqueta torero femenina (talla única)',
    category: 'chaqueta-torero',
    gender: 'femenino',
    kind: 'pedido',
    basePrice: 250000,
    sizes: 'Talla única',
    description:
      'Chaqueta torero de denim con un rostro femenino y pájaros en rojo, pintados a mano sobre la espalda. Se confecciona a pedido en cuatro colores: gris, azul, azul hielo y negra.',
    technique: 'Pintura textil',
    material: 'Denim',
    imageUrl: '/tienda/cat-chaqueta-torero.jpg',
    heroImageUrl: null,
    serieLabel: null,
    isFeatured: true,
    sortOrder: 1,
  },
  {
    slug: 'cazadora-corta-pavorreal',
    name: 'Cazadora corta diseño (pavorreal)',
    category: 'cazadora',
    gender: 'femenino',
    kind: 'unica',
    basePrice: 250000,
    sizes: 'Talla única',
    description:
      'Cazadora corta de denim con un pavorreal pintado a mano en la espalda: plumaje azul, verde y naranja sobre degradados amarillos y violetas. La foto es la pieza real: única e irrepetible.',
    technique: 'Pintura textil',
    material: 'Denim',
    imageUrl: '/tienda/cat-cazadora-pavorreal.jpg',
    heroImageUrl: null,
    serieLabel: null,
    isFeatured: true,
    sortOrder: 2,
  },
  {
    slug: 'cazadora-retrato-tropical',
    name: 'Cazadora unisex talla única (retrato tropical)',
    category: 'cazadora',
    gender: 'unisex',
    kind: 'unica',
    basePrice: 250000,
    sizes: 'Talla única',
    description:
      'Un rostro rodeado de selva, hojas y flores amarillas, pintado a mano sobre cazadora roja de denim. La foto es la pieza real: única e irrepetible.',
    technique: 'Pintura textil',
    material: 'Denim',
    imageUrl: '/tienda/cat-cazadora-tropical.jpg',
    heroImageUrl: null,
    serieLabel: null,
    isFeatured: true,
    sortOrder: 3,
  },
  {
    slug: 'cazadora-mirada-psicodelica',
    name: 'Cazadora unisex talla única (mirada psicodélica)',
    category: 'cazadora',
    gender: 'unisex',
    kind: 'unica',
    basePrice: 250000,
    sizes: 'Talla única',
    description:
      'Cazadora violeta con una figura de gafas amarillas rodeada de ojos y texturas psicodélicas, pintada a mano. La foto es la pieza real: única e irrepetible.',
    technique: 'Pintura textil',
    material: 'Denim',
    imageUrl: '/tienda/cat-cazadora-festival.jpg',
    heroImageUrl: null,
    serieLabel: null,
    isFeatured: true,
    sortOrder: 4,
  },
  {
    slug: 'cazadora-diseno-rosada',
    name: 'Cazadora unisex diseño (pájaro entre flores)',
    category: 'cazadora',
    gender: 'unisex',
    kind: 'unica',
    basePrice: 270000,
    sizes: 'Talla única',
    description:
      'Cazadora lavanda con un pájaro posado en una rama entre flores rosadas, pintado a mano sobre un cielo en degradado. La foto es la pieza real: única e irrepetible.',
    technique: 'Pintura textil',
    material: 'Denim',
    imageUrl: '/tienda/cat-cazadora-rosada.jpg',
    heroImageUrl: null,
    serieLabel: null,
    isFeatured: true,
    sortOrder: 5,
  },
  {
    slug: 'cazadora-diseno-jaguar',
    name: 'Cazadora unisex diseño (jaguar nocturno)',
    category: 'cazadora',
    gender: 'unisex',
    kind: 'unica',
    basePrice: 270000,
    sizes: 'Talla única',
    description:
      'Cazadora de denim con un jaguar pintado a mano trepando una rama, en tonos amarillos y morados. La foto es la pieza real: única e irrepetible.',
    technique: 'Pintura textil',
    material: 'Denim',
    imageUrl: '/tienda/cat-cazadora-jaguar.jpg',
    heroImageUrl: null,
    serieLabel: null,
    isFeatured: true,
    sortOrder: 6,
  },
  {
    slug: 'abrigo-pajaro-tejido',
    name: 'Abrigo femenino (pájaro y flores tejidas)',
    category: 'abrigo',
    gender: 'femenino',
    kind: 'unica',
    basePrice: 350000,
    sizes: 'Talla única',
    description:
      'Abrigo de denim claro con un pájaro bordado a mano y flores de crochet en tonos cálidos; puños con tejido artesanal. La foto es la pieza real: única e irrepetible.',
    technique: 'Bordado y crochet a mano',
    material: 'Denim',
    imageUrl: '/tienda/cat-abrigo-tejido.jpg',
    heroImageUrl: null,
    serieLabel: null,
    isFeatured: true,
    sortOrder: 7,
  },
  {
    slug: 'abrigo-tigre-blanco',
    name: 'Abrigo femenino (tigre blanco)',
    category: 'abrigo',
    gender: 'femenino',
    kind: 'unica',
    basePrice: 350000,
    sizes: 'Talla única',
    description:
      'Abrigo largo de denim con un tigre blanco pintado a mano, rodeado de hojas y cintas rosadas sobre fondo degradado. La foto es la pieza real: única e irrepetible.',
    technique: 'Pintura textil',
    material: 'Denim',
    imageUrl: '/tienda/cat-abrigo-tigre.jpg',
    heroImageUrl: null,
    serieLabel: null,
    isFeatured: true,
    sortOrder: 8,
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
  console.log(`Listo: ${total} productos en el catálogo.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
