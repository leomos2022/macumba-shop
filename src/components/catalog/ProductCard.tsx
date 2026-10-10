/**
 * ProductCard — Card del catálogo.
 * Usa imageUrl (foto original) para el catálogo.
 * Precios en COP (pesos colombianos).
 */

import Link from "next/link";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types";

/** Formatea en COP */
function formatCOP(n: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/producto/${product.slug}`}
      className="glass-card glass-card-hover group relative flex flex-col overflow-hidden rounded-2xl"
      aria-label={`Ver ${product.name} — ${formatCOP(product.basePrice)}`}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-art-pattern">
        <div className="absolute inset-0 bg-fabric-pattern opacity-30" aria-hidden />
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <Sparkles className="h-10 w-10 text-highlight/70 mb-3" aria-hidden />
            <p className="font-syne text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {product.category === 'jacket' && 'Chaqueta'}
              {product.category === 'pants' && 'Pantalón'}
              {product.category === 'custom-only' && 'Personalizable'}
            </p>
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isPremade && (
            <Badge className="border-0 bg-primary text-primary-foreground shadow-lg shadow-primary/30">
              <Star className="mr-1 h-2.5 w-2.5" aria-hidden />
              Pieza única
            </Badge>
          )}
          {product.isCustomizable && !product.isPremade && (
            <Badge variant="outline" className="border-highlight/40 bg-background/80 text-highlight backdrop-blur-md">
              Personalizable
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-syne text-base font-bold leading-tight text-foreground line-clamp-2">
          {product.name}
        </h3>

        {product.description && (
          <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-1">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
            Tallas:
          </span>
          {product.sizes.slice(0, 5).map((size) => (
            <span
              key={size}
              className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-foreground"
            >
              {size}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-end justify-between gap-2 border-t border-white/[0.06] pt-3">
          <div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
              {product.isCustomizable && !product.isPremade ? 'Desde' : 'Precio'}
            </span>
            <p className="font-syne text-lg font-bold text-foreground">
              {formatCOP(product.basePrice)}
            </p>
          </div>
          <span className="flex items-center gap-1 text-xs font-medium text-highlight transition-all group-hover:gap-2" aria-hidden>
            Ver
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
