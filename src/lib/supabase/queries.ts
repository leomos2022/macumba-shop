/**
 * Queries tipadas para catálogo.
 * ------------------------------------------------------------
 * Documento de contexto: sección 11 regla 5 — usar cliente anónimo con RLS.
 *
 * Estas funciones se usan en Server Components (catálogo, ficha de producto)
 * pasando el cliente creado desde lib/supabase/server.ts o directamente
 * desde lib/supabase/client.ts en componentes cliente.
 */

import type { Product, ProductView, DesignAsset, PricingSetting } from '@/types';
import type { SupabaseClient } from '@supabase/supabase-js';

type AnySupabaseClient = SupabaseClient<any, any, any>;

/** Lista todos los productos activos, ordenados por sort_order */
export async function listProducts(
  supabase: AnySupabaseClient
): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) throw error;

  return (data ?? []).map(rowToProduct);
}

/** Busca un producto por su slug */
export async function getProductBySlug(
  supabase: AnySupabaseClient,
  slug: string
): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return rowToProduct(data);
}

/** Lista las vistas (frente/dorso) de un producto */
export async function listProductViews(
  supabase: AnySupabaseClient,
  productId: string
): Promise<ProductView[]> {
  const { data, error } = await supabase
    .from('product_views')
    .select('*')
    .eq('product_id', productId)
    .order('sort_order', { ascending: true });

  if (error) throw error;

  return (data ?? []).map(rowToProductView);
}

/** Lista todos los design_assets activos */
export async function listDesignAssets(
  supabase: AnySupabaseClient
): Promise<DesignAsset[]> {
  const { data, error } = await supabase
    .from('design_assets')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? []).map(rowToDesignAsset);
}

/** Lista todas las configuraciones de precios */
export async function listPricingSettings(
  supabase: AnySupabaseClient
): Promise<PricingSetting[]> {
  const { data, error } = await supabase
    .from('pricing_settings')
    .select('*');

  if (error) throw error;

  return (data ?? []).map((row) => ({
    key: row.key,
    value: Number(row.value),
    description: row.description,
  }));
}

/* ---------- Mappers (snake_case DB → camelCase TS) ---------- */

function rowToProduct(row: any): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    basePrice: Number(row.base_price),
    sizes: row.sizes ?? [],
    category: row.category,
    isCustomizable: row.is_customizable,
    isPremade: row.is_premade,
    isActive: row.is_active,
    sortOrder: row.sort_order ?? 0,
    createdAt: row.created_at,
  };
}

function rowToProductView(row: any): ProductView {
  return {
    id: row.id,
    productId: row.product_id,
    viewType: row.view_type,
    mockupUrl: row.mockup_url,
    fabricTextureUrl: row.fabric_texture_url,
    shadowUrl: row.shadow_url,
    printArea: row.print_area,
    sortOrder: row.sort_order ?? 0,
  };
}

function rowToDesignAsset(row: any): DesignAsset {
  return {
    id: row.id,
    name: row.name,
    imageUrl: row.image_url,
    isPremium: row.is_premium,
    extraPrice: Number(row.extra_price),
    isActive: row.is_active,
    createdAt: row.created_at,
  };
}
