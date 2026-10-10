/**
 * Página /catalogo — Catálogo con filtros por categoría.
 * Secciones: Todo, Chaquetas, Pantalones, Personalizables.
 */

import type { Metadata } from "next";
import { PackageX } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { listProducts } from "@/lib/supabase/queries";
import { ProductGrid } from "@/components/catalog/ProductGrid";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Explora las prendas de MACUMBA SHOP: chaquetas, pantalones y personalizables. Cada pieza es única.",
};

export const revalidate = 60;

export default async function CatalogoPage() {
  let products: Awaited<ReturnType<typeof listProducts>> = [];
  let errorMessage: string | null = null;

  try {
    const supabase = await createClient();
    products = await listProducts(supabase);
  } catch (err) {
    console.error('[catalogo] Error:', err);
    errorMessage = err instanceof Error ? err.message : 'Error desconocido';
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <header className="mb-10 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-highlight">
          Colección
        </p>
        <h1 className="mt-2 font-syne text-4xl font-extrabold tracking-tight md:text-5xl">
          Catálogo
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
          Cada prenda de MACUMBA SHOP es pintada a mano sobre textiles reciclados.
          Explora nuestra colección de chaquetas y prendas personalizables.
        </p>
      </header>

      {errorMessage ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5 py-20 text-center">
          <PackageX className="h-10 w-10 text-destructive mb-4" aria-hidden />
          <p className="font-syne text-lg font-semibold">No pudimos cargar el catálogo</p>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            Hubo un problema conectando con el servidor.
          </p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/30 py-20 text-center">
          <PackageX className="h-10 w-10 text-muted-foreground mb-4" aria-hidden />
          <p className="font-syne text-lg font-semibold">Aún no hay productos publicados</p>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
