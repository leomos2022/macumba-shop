/**
 * ProductActions — Wrapper cliente que sincroniza SizeSelector + AddToCartButton.
 * ------------------------------------------------------------
 * Mantiene el estado local de la talla seleccionada y lo pasa
 * al botón de añadir al carrito.
 */

'use client';

import { useState } from "react";
import { SizeSelector } from "./SizeSelector";
import { AddToCartButton } from "./AddToCartButton";

interface ProductActionsProps {
  productId: string;
  productName: string;
  productSlug: string;
  basePrice: number;
  sizes: string[];
  /** Si true y NO es premade, mostrar "Personalizar en El Estudio" */
  isCustomizable: boolean;
  /** Si true, mostrar botón "Añadir al carrito" (venta directa) */
  isPremade: boolean;
}

export function ProductActions({
  productId,
  productName,
  productSlug,
  basePrice,
  sizes,
  isCustomizable,
  isPremade,
}: ProductActionsProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Selector de tallas — siempre visible si hay tallas */}
      <SizeSelector sizes={sizes} onChange={setSelectedSize} />

      {/* CTA según tipo de producto */}
      {/* Si es premade: botón directo de añadir al carrito */}
      {isPremade && (
        <AddToCartButton
          productId={productId}
          productName={productName}
          basePrice={basePrice}
          selectedSize={selectedSize}
        />
      )}

      {/* Si es customizable pero NO premade: redirige a El Estudio */}
      {isCustomizable && !isPremade && (
        <AddToCartButton
          productId={productId}
          productName={productName}
          basePrice={basePrice}
          selectedSize={selectedSize}
          isCustomizableOnly
          productSlug={productSlug}
        />
      )}

      {/* Si es BOTH premade + customizable: dos botones */}
      {isPremade && isCustomizable && (
        <div className="space-y-2 border-t border-border pt-4">
          <p className="text-center text-xs text-muted-foreground">
            ¿Quieres diseñarla tú?
          </p>
          <a
            href={`/estudio?producto=${productSlug}`}
            className="block rounded-md border border-border bg-background px-4 py-3 text-center text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-accent/30"
          >
            Personalizar en El Estudio →
          </a>
        </div>
      )}
    </div>
  );
}
