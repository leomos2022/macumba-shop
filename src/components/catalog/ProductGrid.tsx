/**
 * ProductGrid con filtros por categoría.
 * ------------------------------------------------------------
 * Componente cliente que recibe todos los productos desde el server
 * y permite filtrarlos por categoría en el cliente (sin recargar).
 *
 * Categorías soportadas:
 *   • all — todas
 *   • jacket — chaquetas
 *   • pants — pantalones
 *   • custom-only — solo personalizables (sin versión premade)
 */

'use client';

import { useMemo, useState } from "react";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Product, ProductCategory } from "@/types";

type FilterCategory = 'all' | ProductCategory;

interface ProductGridProps {
  products: Product[];
}

const FILTER_TABS: { key: FilterCategory; label: string; short: string }[] = [
  { key: 'all', label: 'Todo', short: 'Todo' },
  { key: 'jacket', label: 'Chaquetas', short: 'Chaquetas' },
  { key: 'pants', label: 'Pantalones', short: 'Pantalones' },
  { key: 'custom-only', label: 'Personalizables', short: 'Custom' },
];

export function ProductGrid({ products }: ProductGridProps) {
  const [filter, setFilter] = useState<FilterCategory>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return products;
    return products.filter((p) => p.category === filter);
  }, [products, filter]);

  const counts = useMemo(() => {
    const c: Record<FilterCategory, number> = {
      all: products.length,
      jacket: 0,
      pants: 0,
      'custom-only': 0,
    };
    products.forEach((p) => {
      c[p.category] = (c[p.category] ?? 0) + 1;
    });
    return c;
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
          <p className="font-montserrat text-lg font-semibold text-foreground">
            No hay productos en esta categoría
          </p>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            Estamos pintando nuevas prendas a mano. Vuelve pronto o síguenos en Instagram para ver los lanzamientos.
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
