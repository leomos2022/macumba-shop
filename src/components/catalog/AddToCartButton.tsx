/**
 * AddToCartButton — Pasa cartImageUrl (fondo blanco) al carrito.
 * Precios en COP.
 */

'use client';

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "sonner";

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  basePrice: number;
  selectedSize: string | null;
  cartImageUrl?: string;
  isCustomizableOnly?: boolean;
  productSlug?: string;
}

export function AddToCartButton({
  productId,
  productName,
  basePrice,
  selectedSize,
  cartImageUrl,
  isCustomizableOnly,
  productSlug,
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const addPremade = useCartStore((s) => s.addPremade);

  function handleAdd() {
    if (!selectedSize) {
      toast.error("Selecciona una talla", {
        description: "Elige la talla antes de añadir al carrito.",
      });
      return;
    }

    addPremade({
      productId,
      productName,
      size: selectedSize,
      quantity: 1,
      basePrice,
      cartImageUrl, // ← pasa la imagen con fondo blanco
    });

    setAdded(true);
    toast.success("Añadido al carrito", {
      description: `${productName} — Talla ${selectedSize}`,
    });

    setTimeout(() => setAdded(false), 2000);
  }

  if (isCustomizableOnly && productSlug) {
    return (
      <Button asChild size="lg" className="h-12 w-full text-base">
        <a href={`/estudio?producto=${productSlug}`}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Personalizar en El Estudio
        </a>
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        size="lg"
        onClick={handleAdd}
        className="h-12 w-full text-base"
        disabled={!selectedSize}
      >
        {added ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Añadido ✓
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Añadir al carrito
          </>
        )}
      </Button>

      {!selectedSize && (
        <p className="text-center text-xs text-muted-foreground">
          Selecciona una talla para continuar
        </p>
      )}
    </div>
  );
}
