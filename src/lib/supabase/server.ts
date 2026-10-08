/**
 * Cliente Supabase server-side (Server Components, Route Handlers, Server Actions).
 * ------------------------------------------------------------
 * - Usa la SERVICE ROLE KEY — acceso total, IGNORA RLS.
 * - SECRETO. JAMÁS importar este archivo en código del cliente.
 * - Se usa para escrituras (orders, storage de previews, etc.).
 *
 * Documento de contexto: sección 4 y 11 (reglas 3 y 4).
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      '[supabase/server] Faltan variables de entorno. ' +
        'Verifica NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local'
    );
  }

  const cookieStore = cookies();

  return createServerClient(url, serviceRoleKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component — safe to ignore
          // since cookies can only be set from Route Handlers / Server Actions.
        }
      },
    },
  });
}
