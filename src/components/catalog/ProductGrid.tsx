/**
 * ProductGrid con filtros por categoría.
 * ------------------------------------------------------------
 * Categorías:
 *   • Todo — todas las prendas
 *   • Chaquetas — category = 'jacket'
 *   • Pantalones — category = 'pants' (futuro)
 *   • Personalizables — is_customizable = true
 */

'use client';

import { useMemo, useState } from "react";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Product, ProductCategory } from "@/types";

type FilterCategory = 'all' | 'chaquetas' | 'pantalones' | 'personalizables';

interface ProductGridProps {
  products: Product[];
}

const FILTER_TABS: { key: FilterCategory; label: string; short: string }[] = [
  { key: 'all', label: 'Todo', short: 'Todo' },
  { key: 'chaquetas', label: 'Chaquetas', short: 'Chaquetas' },
  { key: 'pantalones', label: 'Pantalones', short: 'Pantalones' },
  { key: 'personalizables', label: 'Personalizables', short: 'Custom' },
];

export function ProductGrid({ products }: ProductGridProps) {
  const [filter, setFilter] = useState<FilterCategory>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return products;
    if (filter === 'chaquetas') {
      return products.filter((p) => p.category === 'jacket' && !p.isCustomizable);
    }
    if (filter === 'pantalones') {
      return products.filter((p) => p.category === 'pants');
    }
    if (filter === 'personalizables') {
      return products.filter((p) => p.isCustomizable);
    }
    return products;
  }, [products, filter]);

  const counts = useMemo(() => {
    return {
      all: products.length,
      chaquetas: products.filter((p) => p.category === 'jacket' && !p.isCustomizable).length,
      pantalones: products.filter((p) => p.category === 'pants').length,
      personalizables: products.filter((p) => p.isCustomizable).length,
    } as Record<FilterCategory, number>;
  }, [products]);

  return (
    <div>
      {/* Filtros por categoría */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Filtrar:
          </span>
          {FILTER_TABS.map((tab) => {
            const count = counts[tab.key] ?? 0;
            const isActive = filter === tab.key;
            return (
              <Button
                key={tab.key}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(tab.key)}
                disabled={count === 0}
                className={cn(
                  'h-9 rounded-full px-4 text-xs font-medium transition-all',
                  isActive
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border-border text-muted-foreground hover:text-foreground'
                )}
              >
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.short}</span>
                <span
                  className={cn(
                    'ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold',
                    isActive ? 'bg-primary-foreground/20' : 'bg-muted'
                  )}
                >
                  {count}
                </span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Grid de productos */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/30 py-20 text-center">
          <p className="font-syne text-lg font-semibold text-foreground">
            No hay productos en esta categoría
          </p>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            Estamos pintando nuevas prendas a mano. Vuelve pronto o síguenos en Instagram.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilter('all')}
            className="mt-6"
          >
            Ver todos los productos
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Contador inferior */}
      <p className="mt-8 text-xs text-muted-foreground">
        Mostrando {filtered.length} de {products.length} productos
      </p>
    </div>
  );
}
