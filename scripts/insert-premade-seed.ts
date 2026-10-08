/**
 * Inserta un producto seed PREMADE para poder probar el flujo de carrito.
 * Este producto se vende tal cual (sin personalización en este flujo).
 *
 * Ejecutar: bun run scripts/insert-premade-seed.ts
 */

import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function main() {
  const supabase = createClient(url, serviceRole, {
    auth: { persistSession: false },
  });

  console.log('Insertando producto premade seed...');

  // 1. Insertar producto premade (camiseta tribal)
  const { data: product, error: errProd } = await supabase
    .from('products')
    .upsert(
      {
        slug: 'camiseta-tribal-premade',
        name: 'Camiseta Tribal Negra',
        description:
          'Camiseta de algodón reciclado en negro, con diseño tribal pintado a mano por uno de nuestros artistas. Pieza única, lista para enviar. La foto muestra el diseño exacto que recibirás.',
        base_price: 35.0,
        sizes: ['S', 'M', 'L', 'XL'],
        category: 'jacket', // la usamos como categoría genérica para que aparezca en filtros
        is_customizable: false, // este ejemplo específico no se personaliza
        is_premade: true, // es venta directa
        is_active: true,
        sort_order: 2,
      },
      { onConflict: 'slug' }
    )
    .select()
    .single();

  if (errProd) {
    console.error('❌ Error insertando producto:', errProd.message);
    process.exit(1);
  }

  console.log('✅ Producto insertado:', product.name, '→', product.id);

  // 2. Insertar una vista (front) para que la galería funcione
  // Si ya existe, primero la borramos
  await supabase
    .from('product_views')
    .delete()
    .eq('product_id', product.id)
    .eq('view_type', 'front');

  const { error: errView } = await supabase.from('product_views').insert({
    product_id: product.id,
    view_type: 'front',
    mockup_url: '/mockups/camiseta-tribal-front-placeholder.png',
    print_area: { x: 0.25, y: 0.2, w: 0.5, h: 0.45 },
    sort_order: 1,
  });

  if (errView) {
    console.error('❌ Error insertando vista:', errView.message);
    process.exit(1);
  }

  console.log('✅ Vista front insertada');

  // Verificar
  const { data: all } = await supabase
    .from('products')
    .select('slug, name, is_premade, is_customizable, base_price')
    .order('sort_order');

  console.log('\nProductos en BD:');
  all?.forEach((p) =>
    console.log(`  • ${p.name} — $${p.base_price} — premade=${p.is_premade} custom=${p.is_customizable}`)
  );

  console.log('\n✅ Listo. Visita: http://localhost:3000/producto/camiseta-tribal-premade');
}

main().catch((err) => {
  console.error('Error inesperado:', err);
  process.exit(1);
});
