/**
 * Test de conexión a Supabase — script de verificación
 * Ejecutar: bun run /home/z/my-project/scripts/test-supabase-connection.ts
 */

import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function main() {
  console.log('───────────────────────────────────────────────────');
  console.log('  MACUMBA SHOP — Test de conexión a Supabase');
  console.log('───────────────────────────────────────────────────\n');

  console.log('URL:', url);
  console.log('Anon key (primeros 30 chars):', anon.slice(0, 30) + '...\n');

  const supabase = createClient(url, anon, {
    auth: { persistSession: false },
  });

  // 1. Test de ping a la API REST
  console.log('[1/3] Ping al endpoint REST...');
  try {
    const res = await fetch(`${url}/rest/v1/`, {
      headers: {
        apikey: anon,
        Authorization: `Bearer ${anon}`,
      },
    });
    if (res.ok) {
      console.log('  ✅ API REST responde (HTTP', res.status + ')');
    } else {
      console.log('  ❌ API REST respondió', res.status, res.statusText);
    }
  } catch (err) {
    console.log('  ❌ No se pudo alcanzar el endpoint REST');
    console.log('     ', (err as Error).message);
  }

  // 2. Test de lectura sobre tabla products
  console.log('\n[2/3] Lectura de tabla `products`...');
  const { data, error } = await supabase.from('products').select('*').limit(5);
  if (error) {
    console.log('  ❌ Error al leer products:', error.message);
    console.log('     ¿Ya ejecutaste la migración SQL en Supabase?');
  } else {
    console.log('  ✅ Lectura exitosa. Registros encontrados:', data?.length ?? 0);
    if (data && data.length > 0) {
      console.log('     Primera fila:', JSON.stringify(data[0], null, 2));
    }
  }

  // 3. Test de lectura sobre pricing_settings
  console.log('\n[3/3] Lectura de tabla `pricing_settings`...');
  const { data: pricing, error: errPricing } = await supabase
    .from('pricing_settings')
    .select('*');
  if (errPricing) {
    console.log('  ❌ Error al leer pricing_settings:', errPricing.message);
  } else {
    console.log('  ✅ Lectura exitosa. Configuraciones:', pricing?.length ?? 0);
    if (pricing && pricing.length > 0) {
      pricing.forEach((p) =>
        console.log(`     • ${p.key}: $${p.value} — ${p.description ?? ''}`)
      );
    }
  }

  console.log('\n───────────────────────────────────────────────────');
  console.log('  Test completado.');
  console.log('───────────────────────────────────────────────────\n');
}

main().catch((err) => {
  console.error('Error inesperado:', err);
  process.exit(1);
});
