/**
 * ProductGallery — Galería con tabs Frente / Dorso.
 * ------------------------------------------------------------
 * Componente cliente. Recibe las vistas (front + back) del producto.
 *
 * Como todavía no tenemos fotos reales, muestra placeholders
 * elegantes que dejan claro qué vista es y dónde está la zona
 * válida de diseño (print_area).
 *
 * Cuando el cliente entregue las fotos flat-lay reales, solo hay
 * que cambiar el contenido del render por <Image src={mockupUrl} />
 */

'use client';

import { useState } from "react";
import { Sparkles, Eye, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductView, ProductViewType } from "@/types";

interface ProductGalleryProps {
  views: ProductView[];
  /** Para mostrar el nombre del producto en los placeholders */
  productName: string;
}

const VIEW_LABELS: Record<ProductViewType, string> = {
  front: 'Frente',
  back: 'Dorso',
};

export function ProductGallery({ views, productName }: ProductGalleryProps) {
  // Ordenar views por sort_order (front primero)
  const sortedViews = [...views].sort((a, b) => a.sortOrder - b.sortOrder);
  const [activeViewId, setActiveViewId] = useState<string | null>(
    sortedViews[0]?.id ?? null
  );

  if (sortedViews.length === 0) {
    return (
      <div className="aspect-[4/5] w-full overflow-hidden rounded-lg border border-border bg-card/30">
        <div className="flex h-full items-center justify-center">
          <p className="text-sm text-muted-foreground">Sin vistas disponibles</p>
        </div>
      </div>
    );
  }

  const activeView = sortedViews.find((v) => v.id === activeViewId) ?? sortedViews[0];

  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border border-border bg-card/30">
        <div className="absolute inset-0 bg-fabric-pattern opacity-40" aria-hidden />

        {/* Placeholder visual con info útil */}
        <div className="relative flex h-full flex-col items-center justify-center p-8 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Eye className="h-8 w-8" aria-hidden />
          </div>
          <p className="font-montserrat text-lg font-semibold text-foreground">
            {VIEW_LABELS[activeView.viewType]}
          </p>
          <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
            {productName}
          </p>

          {/* Indicador de zona de diseño (print_area) */}
          <div
            className="absolute border-2 border-dashed border-primary/40 bg-primary/5"
            style={{
              left: `${activeView.printArea.x * 100}%`,
              top: `${activeView.printArea.y * 100}%`,
              width: `${activeView.printArea.w * 100}%`,
              height: `${activeView.printArea.h * 100}%`,
            }}
            aria-label="Zona válida para diseño"
          >
            <div className="flex h-full items-center justify-center">
              <span className="rounded-full bg-primary/20 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-primary backdrop-blur">
                Zona de diseño
              </span>
            </div>
          </div>
        </div>

        {/* Badge de personalizable */}
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
          <Sparkles className="h-3 w-3 text-primary" aria-hidden />
          Personalizable
        </div>
      </div>

      {/* Thumbs / tabs de vistas */}
      {sortedViews.length > 1 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {sortedViews.map((view) => {
            const isActive = view.id === activeViewId;
            return (
              <button
                key={view.id}
                type="button"
                onClick={() => setActiveViewId(view.id)}
                aria-pressed={isActive}
                className={cn(
                  'group relative aspect-square overflow-hidden rounded-md border transition-all',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  isActive
                    ? 'border-primary ring-1 ring-primary'
                    : 'border-border hover:border-primary/40'
                )}
              >
                <div className="absolute inset-0 bg-fabric-pattern opacity-30" aria-hidden />
                <div className="relative flex h-full flex-col items-center justify-center p-2 text-center">
                  <Layers className="h-5 w-5 text-muted-foreground" aria-hidden />
                  <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-foreground">
                    {VIEW_LABELS[view.viewType]}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Nota informativa */}
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <Eye className="h-3 w-3 shrink-0" aria-hidden />
        Vista preliminar. Las fotos flat-lay reales se mostrarán cuando estén disponibles.
      </p>
    </div>
  );
}
