// Seed del catálogo "La Sala" — Macumba Shop
// 4 piezas únicas (pintadas/bordadas a mano) + 4 siluetas personalizables de El Taller
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const productos = [
  // ---------- PIEZAS ÚNICAS (premades con arte del colectivo) ----------
  {
    slug: 'cazadora-jaguar',
    name: 'Cazadora Jaguar',
    category: 'chaqueta',
    gender: 'femenino',
    kind: 'unica',
    basePrice: 380000,
    sizes: 'S,M,L,XL',
    description:
      'Denim negro rescatado y intervenido a mano: un jaguar que cruza la espalda entre hojas de selva y flores moradas. Cada trazo es de Robert, pintado pincelada a pincelada sobre tela que ya tuvo otra vida.',
    technique: 'Pintura textil a mano',
    material: 'Denim reciclado',
    imageUrl: '/tienda/cat-jaguar.png',
    heroImageUrl: '/tienda/hero-cazadora.png',
    serieLabel: 'SELVA VIVA · 01/04',
    isFeatured: true,
    sortOrder: 1,
  },
  {
    slug: 'abrigo-raices',
    name: 'Abrigo Raíces',
    category: 'abrigo',
    gender: 'femenino',
    kind: 'unica',
    basePrice: 520000,
    sizes: 'M,L,XL',
    description:
      'Abrigo de lana reciclada azul noche, bordado a mano con dahlias magenta y palmas en hilo verde. Arley dedicó más de veinte horas a bordar cada flor: es la pieza más íntima de la serie.',
    technique: 'Bordado a mano',
    material: 'Lana reciclada',
    imageUrl: '/tienda/cat-abrigo.png',
    heroImageUrl: '/tienda/hero-abrigo.png',
    serieLabel: 'SELVA VIVA · 02/04',
    isFeatured: true,
    sortOrder: 2,
  },
  {
    slug: 'chaqueta-colibri',
    name: 'Chaqueta Colibrí',
    category: 'chaqueta',
    gender: 'femenino',
    kind: 'unica',
    basePrice: 290000,
    sizes: 'S,M,L',
    description:
      'Un colibrí morado levanta vuelo entre hojas de monkey plant pintadas sobre denim negro reciclado. Liviana, de corte clásico, para quienes quieren llevar la selva en el día a día.',
    technique: 'Pintura textil a mano',
    material: 'Denim reciclado',
    imageUrl: '/tienda/cat-corta.png',
    heroImageUrl: '/tienda/hero-corta.png',
    serieLabel: 'SELVA VIVA · 03/04',
    isFeatured: true,
    sortOrder: 3,
  },
  {
    slug: 'chaqueta-orquidea',
    name: 'Chaqueta Orquídea',
    category: 'chaqueta',
    gender: 'masculino',
    kind: 'unica',
    basePrice: 350000,
    sizes: 'M,L,XL',
    description:
      'Denim azul clásico intervenido con orquídeas moradas y palmas: el homenaje de Macumba a la flor nacional. Corte masculino recto, arte que se ve desde donde te pongas.',
    technique: 'Pintura textil a mano',
    material: 'Denim reciclado',
    imageUrl: '/tienda/cat-hombre.png',
    heroImageUrl: '/tienda/hero-hombre.png',
    serieLabel: 'SELVA VIVA · 04/04',
    isFeatured: true,
    sortOrder: 4,
  },
  // ---------- PERSONALIZABLES (siluetas base de El Taller) ----------
  {
    slug: 'cazadora-personalizable',
    name: 'Cazadora a tu manera',
    category: 'chaqueta',
    gender: 'unisex',
    kind: 'personalizable',
    basePrice: 250000,
    sizes: 'S,M,L,XL',
    description:
      'Tu cazadora denim reciclada, tu color y tu arte: en El Taller eliges la silueta, el tono, la técnica (pintura o bordado) y el diseño que la hará única. Robert y Arley la hacen realidad.',
    technique: 'Pintura o bordado a elegir',
    material: 'Denim reciclado',
    imageUrl: '/tienda/sil-cazadora.png',
    heroImageUrl: null,
    serieLabel: null,
    isFeatured: false,
    sortOrder: 5,
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
      'La chaqueta corta de denim reciclado que se adapta a tu historia: escoges color base, técnica y arte con nuestro colectivo. Ideal para un primer encargo en El Taller.',
    technique: 'Pintura o bordado a elegir',
    material: 'Denim reciclado',
    imageUrl: '/tienda/sil-corta.png',
    heroImageUrl: null,
    serieLabel: null,
    isFeatured: false,
    sortOrder: 6,
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
      'Un abrigo de lana reciclada en el color que prefieras, con bordado o pintura diseñada contigo. La prenda más contundente de El Taller, hecha para durar muchos inviernos.',
    technique: 'Pintura o bordado a elegir',
    material: 'Lana reciclada',
    imageUrl: '/tienda/sil-abrigo.png',
    heroImageUrl: null,
    serieLabel: null,
    isFeatured: false,
    sortOrder: 7,
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
  console.log(`Listo: ${total} productos en La Sala.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
