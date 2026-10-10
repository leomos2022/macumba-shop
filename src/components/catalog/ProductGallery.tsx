/**
 * ProductGallery — Galería simple SIN "zona de diseño".
 * Solo muestra la imagen del producto.
 */

'use client';

import { useState } from "react";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  imageUrl: string;
  productName: string;
}

export function ProductGallery({ imageUrl, productName }: ProductGalleryProps) {
  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border border-border bg-card/30">
        <div className="absolute inset-0 bg-fabric-pattern opacity-40" aria-hidden />

        <div className="relative flex h-full items-center justify-center p-8">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={productName}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-6 text-center">
              <Eye className="h-8 w-8 text-muted-foreground/60" aria-hidden />
              <p className="mt-2 text-sm text-muted-foreground">
                Vista preliminar
              </p>
            </div>
          )}
        </div>

        {/* Badge personalizable (sin "zona de diseño") */}
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
          <Eye className="h-3 w-3 text-highlight" aria-hidden />
          Vista frontal
        </div>
      </div>

      {/* Nota informativa */}
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <Eye className="h-3 w-3 shrink-0" aria-hidden />
        Vista preliminar. Las fotos flat-lay reales se mostrarán cuando estén disponibles.
      </p>
    </div>
  );
}
