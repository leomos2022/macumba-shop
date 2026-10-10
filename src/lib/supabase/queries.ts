/**
 * Queries tipadas para catálogo MACUMBA.
 * Trae productos + sus vistas (front/back) desde Supabase.
 *
 * product_views.mockup_url = imagen para CATÁLOGO (foto original)
 * product_views.shadow_url = imagen para CARRITO (fondo blanco, versión "car")
 */

import type { Product, ProductView, ProductCategory } from '@/types';
import type { SupabaseClient } from '@supabase/supabase-js';

type AnySupabaseClient = SupabaseClient<any, any, any>;

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  base_price: number;
  sizes: string[];
  category: string;
  is_customizable: boolean;
  is_premade: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  product_views: Array<{
    id: string;
    view_type: string;
    mockup_url: string;
    fabric_texture_url: string | null;
    shadow_url: string | null;
    print_area: any;
    sort_order: number;
  }>;
}

function mapProductRow(row: ProductRow): Product {
  const frontView = row.product_views?.find((v) => v.view_type === 'front')
    ?? row.product_views?.[0];

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    basePrice: Number(row.base_price),
    sizes: row.sizes ?? [],
    category: row.category as ProductCategory,
    isCustomizable: row.is_customizable,
    isPremade: row.is_premade,
    isActive: row.is_active,
    sortOrder: row.sort_order ?? 0,
    createdAt: row.created_at,
    // mockup_url = imagen para catálogo (original)
    imageUrl: frontView?.mockup_url,
    // shadow_url = imagen para carrito (fondo blanco, versión "car")
    cartImageUrl: frontView?.shadow_url ?? undefined,
  };
}

export async function listProducts(
  supabase: AnySupabaseClient
): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_views (*)
    `)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) throw error;

  const rows = (data ?? []) as unknown as ProductRow[];
  return rows.map(mapProductRow);
}

export async function getProductBySlug(
  supabase: AnySupabaseClient,
  slug: string
): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_views (*)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return mapProductRow(data as unknown as ProductRow);
}

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

  return (data ?? []).map((row: any) => ({
    id: row.id,
    productId: row.product_id,
    viewType: row.view_type,
    mockupUrl: row.mockup_url,
    fabricTextureUrl: row.fabric_texture_url,
    shadowUrl: row.shadow_url,
    printArea: row.print_area,
    sortOrder: row.sort_order ?? 0,
  }));
}

export async function listDesignAssets(
  supabase: AnySupabaseClient
) {
  const { data, error } = await supabase
    .from('design_assets')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function listPricingSettings(
  supabase: AnySupabaseClient
) {
  const { data, error } = await supabase
    .from('pricing_settings')
    .select('*');

  if (error) throw error;
  return (data ?? []).map((row: any) => ({
    key: row.key,
    value: Number(row.value),
    description: row.description,
  }));
}
