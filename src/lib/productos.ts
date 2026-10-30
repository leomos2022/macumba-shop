import { db } from "@/lib/db";
import type { Producto } from "@/lib/macumba";

/**
 * Carga el catálogo completo (server-only). Devuelve [] si la DB no responde
 * para que las páginas rendericen vacías en vez de romper la vista.
 */
export async function getProductos(): Promise<Producto[]> {
  try {
    const filas = await db.product.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return filas.map((f) => ({
      id: f.id,
      slug: f.slug,
      name: f.name,
      category: f.category,
      gender: f.gender,
      kind: f.kind,
      basePrice: f.basePrice,
      sizes: f.sizes,
      description: f.description,
      technique: f.technique,
      material: f.material,
      imageUrl: f.imageUrl,
      heroImageUrl: f.heroImageUrl,
      serieLabel: f.serieLabel,
      isFeatured: f.isFeatured,
      sortOrder: f.sortOrder,
    }));
  } catch (error) {
    console.error("No se pudo cargar el catálogo:", error);
    return [];
  }
}
