-- ============================================================
-- MACUMBA SHOP — Migración 0002: GRANT de permisos
-- ============================================================
-- En Supabase, las RLS policies son una capa, pero los GRANTs
-- a nivel PostgreSQL son OTRA capa. Por defecto, las tablas
-- creadas por el usuario `postgres` solo son accesibles por
-- `postgres` y `service_role`. Hay que dar permisos explícitos
-- al rol `anon` (cliente público) y `authenticated` (usuario
-- con sesión iniciada) para que las queries funcionen.
--
-- Esta migración es segura: solo otorga SELECT (lectura) al
-- rol anónimo, que es exactamente lo que RLS ya permite.
-- ============================================================

-- ---------- Permisos de SELECT público para catálogo ----------
grant select on products to anon, authenticated;
grant select on product_views to anon, authenticated;
grant select on design_assets to anon, authenticated;
grant select on pricing_settings to anon, authenticated;

-- ---------- Permisos para orders ----------
-- IMPORTANTE: NO damos permisos a anon ni authenticated.
-- orders solo es accesible vía service_role (escritura server-side).
-- Esto ya está cubierto por la RLS policy "orders_all_service_role".

-- ---------- Permisos de secuencia (por si se usa serial en el futuro) ----------
-- Las tablas actuales usan gen_random_uuid(), no serial,
-- pero dejamos esto preparado por si agregamos tablas con IDs secuenciales:
grant usage, select on all sequences in schema public to anon, authenticated;

-- ---------- Nota sobre nuevas tablas ----------
-- Si en el futuro agregas una tabla nueva al schema public y quieres
-- que el rol anónimo pueda leerla, debes ejecutar:
--
--   grant select on tu_tabla to anon, authenticated;
--   alter table tu_tabla enable row level security;
--   create policy "tu_tabla_select_public" on tu_tabla
--     for select using (true);
--
-- Por eso en la creación del proyecto marcamos "Enable automatic RLS"
-- pero esto NO cubre automáticamente los GRANTs. Hay que hacerlo manual.

-- ---------- Verificación rápida ----------
-- Esta query devuelve los privilegios actuales:
-- select grantee, table_name, privilege_type
-- from information_schema.role_table_grants
-- where table_schema = 'public'
-- order by table_name, grantee;
