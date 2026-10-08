/**
 * RelatedProducts — Sección "También te puede gustar".
 * ------------------------------------------------------------
 * Server Component. Recibe productos ya cargados del padre
 * (evita una nueva query a Supabase).
 */

import { ProductCard } from "./ProductCard";
import type { Product } from "@/types";

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="mt-20 border-t border-border pt-16">
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          Sigue explorando
        </p>
        <h2 className="mt-2 font-montserrat text-2xl font-bold tracking-tight md:text-3xl">
          También te puede gustar
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
