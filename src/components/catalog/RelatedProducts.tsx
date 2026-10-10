/**
 * RelatedProducts — Sección "También te puede gustar".
 */

import { ProductCard } from "./ProductCard";
import type { Product } from "@/types";

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;
  return (
    <section className="mt-20 border-t border-white/[0.06] pt-16">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-highlight">
          Sigue explorando
        </p>
        <h2 className="mt-2 font-syne text-2xl font-bold tracking-tight md:text-3xl">
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
