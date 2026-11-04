// Seed del catálogo — Macumba Arte-Magia
// 6 prendas HECHAS A PEDIDO sobre denim reciclado (3 cortes × pintura textil / mangas tejidas "tipo Ludivia")
// Nombres y precios confirmados por el taller — el arte es INTOCABLE: las fotos son ejecuciones reales.
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const productos = [
  {
    slug: 'chaqueta-torero-corta-pintura',
    name: 'Chaqueta torero (corta) pintura textil',
    category: 'chaqueta-torero',
    gender: 'unisex',
    kind: 'pedido',
    basePrice: 250000,
    sizes: 'S,M,L,XL',
    description:
      'Chaqueta de corte corto al cuerpo, confeccionada a pedido sobre denim reciclado y pintada a mano con pintura textil: el colectivo interviene cada pieza al confirmar tu pedido, así que ningún trazo se repite de una prenda a otra. La foto es una ejecución real del taller.',
    technique: 'Pintura textil a mano',
    material: 'Denim reciclado',
    // Foto confirmada por el taller: la pieza que el catálogo viejo llamaba
    // "Asian Soul" es esta chaqueta torero (corta) con arte pintado.
    imageUrl: '/tienda/pasarela-04.png',
    heroImageUrl: null,
    serieLabel: 'LÍNEA MACUMBA · 01/06',
    isFeatured: true,
    sortOrder: 1,
  },
  {
    slug: 'chaqueta-torero-ludivia',
    name: 'Chaqueta torero tipo Ludivia (mangas tejidas)',
    category: 'chaqueta-torero',
    gender: 'unisex',
    kind: 'pedido',
    basePrice: 300000,
    sizes: 'S,M,L,XL',
    description:
      'La chaqueta torero corta con las mangas tejidas a mano, el corte que hizo famosa a Ludivia. Se confecciona a pedido sobre denim reciclado: arte pintado a mano en el cuerpo y mangas trabajadas punto a punto por el taller. Cada ejecución es única.',
    technique: 'Pintura textil + mangas tejidas a mano',
    material: 'Denim reciclado',
    imageUrl: '/tienda/pieza-patchwork-violeta.jpg',
    heroImageUrl: null,
    serieLabel: 'LÍNEA MACUMBA · 02/06',
    isFeatured: true,
    sortOrder: 2,
  },
  {
    slug: 'cazadora-pintura',
    name: 'Cazadora pintura textil',
    category: 'cazadora',
    gender: 'unisex',
    kind: 'pedido',
    basePrice: 250000,
    sizes: 'S,M,L,XL',
    description:
      'La cazadora clásica de denim reciclado, intervenida con pintura textil a mano. Se confecciona a pedido: eliges tu talla, confirmas por WhatsApp y el taller pinta y arma la tuya. En la foto, una ejecución con jaguar y figura ceremonial sobre denim lavado al ácido.',
    technique: 'Pintura textil a mano',
    material: 'Denim reciclado',
    imageUrl: '/tienda/pieza-totem-jaguar.jpg',
    heroImageUrl: null,
    serieLabel: 'LÍNEA MACUMBA · 03/06',
    isFeatured: true,
    sortOrder: 3,
  },
  {
    slug: 'cazadora-ludivia',
    name: 'Cazadora tipo Ludivia (mangas tejidas)',
    category: 'cazadora',
    gender: 'unisex',
    kind: 'pedido',
    basePrice: 320000,
    sizes: 'S,M,L,XL',
    description:
      'Cazadora de denim reciclado con mangas tejidas a mano (estilo Ludivia) y arte pintado a mano por el colectivo. Se confecciona a pedido: mismo corte, ejecución irrepetible. En la foto, una ejecución con bordado de pájaro, crochet y puños en degradé.',
    technique: 'Pintura textil + mangas tejidas a mano',
    material: 'Denim reciclado',
    imageUrl: '/tienda/sala-alas-tejidas.jpg',
    heroImageUrl: null,
    serieLabel: 'LÍNEA MACUMBA · 04/06',
    isFeatured: true,
    sortOrder: 4,
  },
  {
    slug: 'abrigo-pintura',
    name: 'Abrigo pintura textil',
    category: 'abrigo',
    gender: 'unisex',
    kind: 'pedido',
    basePrice: 350000,
    sizes: 'S,M,L,XL',
    description:
      'El abrigo largo de la línea: silueta contundente sobre denim reciclado y arte pintado a mano que recorre la pieza. Se confecciona a pedido; la prenda más escénica del taller, pensada para durar muchos inviernos.',
    technique: 'Pintura textil a mano',
    material: 'Denim reciclado',
    imageUrl: '/tienda/sala-alma-dorada.jpg',
    heroImageUrl: null,
    serieLabel: 'LÍNEA MACUMBA · 05/06',
    isFeatured: true,
    sortOrder: 5,
  },
  {
    slug: 'abrigo-ludivia',
    name: 'Abrigo tipo Ludivia (mangas tejidas)',
    category: 'abrigo',
    gender: 'unisex',
    kind: 'pedido',
    basePrice: 350000,
    sizes: 'S,M,L,XL',
    description:
      'Abrigo largo de denim reciclado con puños y ruedo rematados en tejido a mano (estilo Ludivia) y arte pintado a mano. Se confecciona a pedido: cada ejecución no se repite. En la foto, una ejecución con bordado turquesa y crochet multicolor.',
    technique: 'Pintura textil + tejido a mano',
    material: 'Denim reciclado',
    imageUrl: '/tienda/sala-selva-nocturna.jpg',
    heroImageUrl: null,
    serieLabel: 'LÍNEA MACUMBA · 06/06',
    isFeatured: true,
    sortOrder: 6,
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
