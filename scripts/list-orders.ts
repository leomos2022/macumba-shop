/**
 * Lista los pedidos en Supabase para verificar que se crearon.
 * Ejecutar: bun run scripts/list-orders.ts
 */

import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function main() {
  const supabase = createClient(url, serviceRole, {
    auth: { persistSession: false },
  });

  console.log('📦 Listando pedidos en Supabase...\n');

  const { data, error } = await supabase
    .from('orders')
    .select('id, status, total, created_at, customer_name')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.log('No hay pedidos todavía.');
    return;
  }

  console.log(`Se encontraron ${data.length} pedidos:\n`);

  data.forEach((order, idx) => {
    const shortId = order.id.replace(/-/g, '').slice(0, 8).toUpperCase();
    console.log(`${idx + 1}. Pedido #${shortId}`);
    console.log(`   Estado: ${order.status}`);
    console.log(`   Total: $${order.total}`);
    console.log(`   Cliente: ${order.customer_name ?? '(no especificado)'}`);
    console.log(`   Creado: ${new Date(order.created_at).toLocaleString('es-CO')}`);
    console.log(`   URL: ${process.env.NEXT_PUBLIC_SITE_URL}/pedido/${order.id}`);
    console.log('');
  });
}

main().catch((err) => {
  console.error('Error inesperado:', err);
  process.exit(1);
});
