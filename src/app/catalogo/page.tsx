/**
 * Página /catalogo — Server Component.
 * ------------------------------------------------------------
 * Lee los productos desde Supabase en el servidor (SSR) para:
 *   • SEO: el HTML que recibe el navegador ya viene con el catálogo
 *   • Performance: no hay "flash" de loading en el cliente
 *   • Seguridad: usa el cliente anónimo (RLS aplica)
 *
 * El filtrado por categoría se hace en el cliente (ProductGrid) para
 * evitar recargas de página.
 */

import type { Metadata } from "next";
import { PackageX } from "lucide-react";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { createClient } from "@/lib/supabase/server";
import { listProducts } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Explora todas las prendas de MACUMBA SHOP: chaquetas, pantalones y personalizables. Cada pieza es única, pintada a mano sobre textiles reciclados.",
  keywords: [
    "catálogo",
    "chaquetas",
    "pantalones",
    "ropa artesanal",
    "pintada a mano",
  ],
  openGraph: {
    title: "Catálogo | MACUMBA SHOP",
    description:
      "Ropa artesanal pintada a mano. Cada prenda es única e irrepetible.",
  },
};

// Revalidar cada 60 segundos (ISR) para que productos nuevos aparezcan
export const revalidate = 60;

export default async function CatalogoPage() {
  let products: Awaited<ReturnType<typeof listProducts>> = [];
  let errorMessage: string | null = null;

  try {
    const supabase = await createClient();
    products = await listProducts(supabase);
  } catch (err) {
    console.error('[catalogo] Error cargando productos:', err);
    errorMessage =
      err instanceof Error ? err.message : 'Error desconocido al cargar productos';
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      {/* Header */}
      <header className="mb-10 max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          Colección
        </p>
        <h1 className="mt-2 font-montserrat text-4xl font-extrabold tracking-tight md:text-5xl">
          Catálogo
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
          Cada prenda de MACUMBA SHOP es pintada a mano sobre textiles reciclados.
          Explora nuestra colección de chaquetas y pantalones — cuando encuentres
          una que te guste, puedes usarla tal cual o personalizarla en El Estudio
          con diseños de nuestros pintores o con el tuyo propio.
        </p>
      </header>

      {/* Error state */}
      {errorMessage ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5 py-20 text-center">
          <PackageX className="h-10 w-10 text-destructive mb-4" aria-hidden />
          <p className="font-montserrat text-lg font-semibold text-foreground">
            No pudimos cargar el catálogo
          </p>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            Hubo un problema conectando con el servidor. Por favor, recarga la
            página o inténtalo más tarde.
          </p>
          <p className="mt-4 text-xs text-muted-foreground/70">
            Detalle técnico: {errorMessage}
          </p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/30 py-20 text-center">
          <PackageX className="h-10 w-10 text-muted-foreground mb-4" aria-hidden />
          <p className="font-montserrat text-lg font-semibold text-foreground">
            Aún no hay productos publicados
          </p>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            Estamos preparando nuestra colección. Mientras tanto, puedes diseñar
            tu propia prenda en El Estudio.
          </p>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
