import { db } from "@/lib/db";
import { Tienda } from "@/components/tienda/tienda";
import type { Producto } from "@/lib/macumba";

export const dynamic = "force-dynamic";

export default async function Home() {
  let productos: Producto[] = [];

  try {
    const filas = await db.product.findMany({
      orderBy: { sortOrder: "asc" },
    });
    productos = filas.map((f) => ({
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
  }

  return <Tienda productos={productos} />;
}
