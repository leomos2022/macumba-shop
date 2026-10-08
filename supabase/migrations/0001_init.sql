-- ============================================================
-- MACUMBA SHOP — Migración inicial (0001)
-- ============================================================
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query
-- Crea:
--   • Tablas base (products, product_views, design_assets,
--     pricing_settings, orders)
--   • RLS policies (lectura pública para catálogo, escritura
--     restringida para orders vía service role)
--   • Seeds mínimos (pricing_settings, 1 producto demo, 1 vista)
--
-- Compatible con PostgreSQL 15 (Supabase free tier).
-- ============================================================

-- Habilitar extensión para gen_random_uuid()
create extension if not exists pgcrypto;

-- ============================================================
-- 1. TABLAS
-- ============================================================

-- Prendas base (chaqueta, pantalón, etc.)
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  base_price numeric not null,
  sizes text[] not null default '{S,M,L,XL}',
  category text not null check (category in ('jacket', 'pants', 'custom-only')),
  is_customizable boolean not null default true,
  is_premade boolean not null default false,
  is_active boolean not null default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Vistas fotográficas de cada prenda (frente, dorso)
create table if not exists product_views (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade not null,
  view_type text not null check (view_type in ('front', 'back')),
  mockup_url text not null,
  fabric_texture_url text,
  shadow_url text,
  print_area jsonb not null,
  sort_order int default 0
);

-- Librería oficial de arte de los pintores de Macumba
create table if not exists design_assets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text not null,
  is_premium boolean default false,
  extra_price numeric default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Configuración de precios del personalizador
create table if not exists pricing_settings (
  key text primary key,
  value numeric not null,
  description text
);

-- Pedidos generados desde el carrito
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'pending'
    check (status in ('pending', 'contacted', 'confirmed', 'in_production', 'shipped', 'cancelled')),
  customer_name text,
  customer_phone text,
  total numeric not null,
  items_snapshot jsonb not null,
  whatsapp_message_sent text,
  created_at timestamptz default now()
);

-- ============================================================
-- 2. ROW LEVEL SECURITY
-- ============================================================

-- Encender RLS en todas las tablas
alter table products enable row level security;
alter table product_views enable row level security;
alter table design_assets enable row level security;
alter table pricing_settings enable row level security;
alter table orders enable row level security;

-- ----- 2.1 Catálogo (lectura pública, escritura solo service_role) -----
-- products
drop policy if exists "products_select_public" on products;
create policy "products_select_public" on products
  for select using (true);

drop policy if exists "products_write_service_role" on products;
create policy "products_write_service_role" on products
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- product_views
drop policy if exists "product_views_select_public" on product_views;
create policy "product_views_select_public" on product_views
  for select using (true);

drop policy if exists "product_views_write_service_role" on product_views;
create policy "product_views_write_service_role" on product_views
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- design_assets
drop policy if exists "design_assets_select_public" on design_assets;
create policy "design_assets_select_public" on design_assets
  for select using (true);

drop policy if exists "design_assets_write_service_role" on design_assets;
create policy "design_assets_write_service_role" on design_assets
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- pricing_settings
drop policy if exists "pricing_settings_select_public" on pricing_settings;
create policy "pricing_settings_select_public" on pricing_settings
  for select using (true);

drop policy if exists "pricing_settings_write_service_role" on pricing_settings;
create policy "pricing_settings_write_service_role" on pricing_settings
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- ----- 2.2 Orders (sin acceso anónimo — solo service_role) -----
drop policy if exists "orders_all_service_role" on orders;
create policy "orders_all_service_role" on orders
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- ============================================================
-- 3. SEEDS
-- ============================================================

-- ----- 3.1 Configuración de precios -----
insert into pricing_settings (key, value, description) values
  ('price_per_custom_design', 8.00, 'Precio base añadido por cada diseño aplicado a una prenda'),
  ('price_user_upload', 5.00, 'Precio extra cuando el usuario sube su propio diseño')
on conflict (key) do nothing;

-- ----- 3.2 Producto demo (Chaqueta Denim Negra) -----
-- Solo se inserta si no existe. La foto mockup es un placeholder hasta
-- que el cliente entregue las fotos flat-lay reales.
insert into products (slug, name, description, base_price, sizes, category, is_customizable, is_premade, sort_order)
select
  'chaqueta-denim-negra',
  'Chaqueta Denim Negra',
  'Chaqueta de denim negro reciclado, confeccionada a mano. Cada pieza es única y pintada con pinturas textiles de alta durabilidad.',
  45.00,
  '{S,M,L,XL}',
  'jacket',
  true,
  false,
  1
where not exists (select 1 from products where slug = 'chaqueta-denim-negra');

-- Vista front del producto demo (zona de diseño centrada)
insert into product_views (product_id, view_type, mockup_url, print_area, sort_order)
select
  p.id,
  'front',
  '/mockups/chaqueta-denim-negra-front-placeholder.png',
  '{"x": 0.25, "y": 0.20, "w": 0.50, "h": 0.45}'::jsonb,
  1
from products p
where p.slug = 'chaqueta-denim-negra'
  and not exists (
    select 1 from product_views pv where pv.product_id = p.id and pv.view_type = 'front'
  );

-- Vista back del producto demo
insert into product_views (product_id, view_type, mockup_url, print_area, sort_order)
select
  p.id,
  'back',
  '/mockups/chaqueta-denim-negra-back-placeholder.png',
  '{"x": 0.25, "y": 0.20, "w": 0.50, "h": 0.45}'::jsonb,
  2
from products p
where p.slug = 'chaqueta-denim-negra'
  and not exists (
    select 1 from product_views pv where pv.product_id = p.id and pv.view_type = 'back'
  );

-- ============================================================
-- 4. ÍNDICES (perf para queries comunes del catálogo)
-- ============================================================

create index if not exists idx_products_active_sort
  on products (is_active, sort_order);

create index if not exists idx_product_views_product
  on product_views (product_id, sort_order);

create index if not exists idx_design_assets_active
  on design_assets (is_active, created_at desc);

create index if not exists idx_orders_status_created
  on orders (status, created_at desc);

-- ============================================================
-- Fin de la migración.
-- Para verificar, ejecutar después:
--   select * from products;
--   select * from pricing_settings;
-- ============================================================
