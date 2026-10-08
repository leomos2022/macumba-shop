/**
 * ProductCard — Card individual de producto para catálogo.
 * ------------------------------------------------------------
 * Mobile-first. En desktop se vuelve más compacta.
 * Imagen placeholder elegante mientras el cliente entrega las fotos flat-lay.
 */

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (n: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(n);

  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card/50 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={`Ver ${product.name} — ${formatPrice(product.basePrice)}`}
    >
      {/* Imagen / Placeholder */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted/30">
        {/* Placeholder con patron de tela + simbolo artesanal */}
        <div className="absolute inset-0 bg-fabric-pattern opacity-40" aria-hidden />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <Sparkles
            className="h-10 w-10 text-primary/60 mb-3"
            aria-hidden
          />
          <p className="font-montserrat text-sm font-medium uppercase tracking-wider text-muted-foreground">
            {product.category === 'jacket' && 'Chaqueta'}
            {product.category === 'pants' && 'Pantalón'}
            {product.category === 'custom-only' && 'Personalizable'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            Foto próximamente
          </p>
        </div>

        {/* Badge esquina superior */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isPremade && (
            <Badge
              variant="default"
              className="bg-primary text-primary-foreground shadow"
            >
              Diseño listo
            </Badge>
          )}
          {product.isCustomizable && !product.isPremade && (
            <Badge
              variant="outline"
              className="border-primary/40 bg-card/80 text-primary backdrop-blur"
            >
              Personalizable
            </Badge>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-montserrat text-base font-semibold leading-tight text-foreground line-clamp-2">
          {product.name}
        </h3>

        {product.description && (
          <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Tallas disponibles */}
        <div className="mt-3 flex flex-wrap items-center gap-1">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
            Tallas:
          </span>
          {product.sizes.slice(0, 4).map((size) => (
            <span
              key={size}
              className="rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-foreground"
            >
              {size}
            </span>
          ))}
          {product.sizes.length > 4 && (
            <span className="text-[10px] text-muted-foreground">
              +{product.sizes.length - 4}
            </span>
          )}
        </div>

        {/* Precio + CTA */}
        <div className="mt-4 flex items-end justify-between gap-2 pt-3 border-t border-border">
          <div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
              Desde
            </span>
            <p className="font-montserrat text-lg font-bold text-foreground">
              {formatPrice(product.basePrice)}
            </p>
          </div>

          <span
            className="flex items-center gap-1 text-xs font-medium text-primary transition-transform group-hover:translate-x-1"
            aria-hidden
          >
            Ver
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
