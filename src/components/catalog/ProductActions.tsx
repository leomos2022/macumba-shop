/**
 * ProductActions — Wrapper que sincroniza SizeSelector + AddToCartButton.
 * Pasa cartImageUrl (fondo blanco) al carrito.
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
  isCustomizable: boolean;
  isPremade: boolean;
  cartImageUrl?: string;
}

export function ProductActions({
  productId,
  productName,
  productSlug,
  basePrice,
  sizes,
  isCustomizable,
  isPremade,
  cartImageUrl,
}: ProductActionsProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <SizeSelector sizes={sizes} onChange={setSelectedSize} />

      {isPremade && (
        <AddToCartButton
          productId={productId}
          productName={productName}
          basePrice={basePrice}
          selectedSize={selectedSize}
          cartImageUrl={cartImageUrl}
        />
      )}

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

      {isPremade && isCustomizable && (
        <div className="space-y-2 border-t border-border pt-4">
          <p className="text-center text-xs text-muted-foreground">
            ¿Quieres diseñarla tú?
          </p>
          <a
            href={`/estudio?producto=${productSlug}`}
            className="block rounded-md border border-border bg-background px-4 py-3 text-center text-sm font-medium text-foreground transition-colors hover:border-highlight/40 hover:bg-accent/30"
          >
            Personalizar en El Estudio →
          </a>
        </div>
      )}
    </div>
  );
}
