/**
 * Cliente Supabase del navegador (browser).
 * ------------------------------------------------------------
 * - Usa la clave ANON pública (RLS aplica).
 * - NO tiene acceso al service role key.
 * - Se usa solo para consultas de lectura del catálogo (products,
 *   product_views, design_assets, pricing_settings).
 * - Las escrituras se hacen server-side vía lib/supabase/server.ts
 *
 * Documento de contexto: sección 4 (Stack) y 11 (reglas 3 y 4).
 */

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      '[supabase/client] Faltan variables de entorno. ' +
        'Verifica NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local'
    );
  }

  return createBrowserClient(url, anonKey);
}
