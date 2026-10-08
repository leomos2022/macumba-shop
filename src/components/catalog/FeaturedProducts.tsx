/**
 * Sección "Productos Destacados" en la landing.
 * ------------------------------------------------------------
 * Server Component: lee los primeros 4 productos activos desde
 * Supabase y los muestra como sneak peek del catálogo.
 */

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { listProducts } from "@/lib/supabase/queries";
import type { Product } from "@/types";

export async function FeaturedProducts() {
  let products: Product[] = [];

  try {
    const supabase = await createClient();
    products = await listProducts(supabase);
    // Tomamos los primeros 4 para mostrar en landing
    products = products.slice(0, 4);
  } catch (err) {
    // Si Supabase falla, ocultamos la sección silenciosamente
    console.error('[landing] Error cargando productos destacados:', err);
    return null;
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-border py-20">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Colección actual
            </p>
            <h2 className="mt-2 font-montserrat text-3xl font-bold tracking-tight md:text-4xl">
              Prendas destacadas
            </h2>
            <p className="mt-3 text-sm text-muted-foreground md:text-base">
              Una selección de nuestras piezas más recientes. Toca cualquier
              prenda para ver el detalle, las tallas y las opciones de
              personalización.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="shrink-0">
            <Link href="/catalogo">
              Ver todo el catálogo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
