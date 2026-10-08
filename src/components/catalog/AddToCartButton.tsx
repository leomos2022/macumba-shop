/**
 * AddToCartButton — Botón "Añadir al carrito".
 * ------------------------------------------------------------
 * Componente cliente que interactúa con el store de Zustand.
 *
 * Comportamiento:
 *   • Valida que se haya seleccionado la talla antes de añadir
 *   • Muestra feedback visual (check) durante 2 segundos
 *   • Abre el drawer del carrito tras añadir
 *   • Solo se usa para productos `premade` (los custom van por El Estudio)
 */

'use client';

import { useState } from "react";
import { ShoppingCart, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "sonner";

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  basePrice: number;
  /** Talla seleccionada (controlado por padre) */
  selectedSize: string | null;
  /** Si true, el botón muestra "Personalizar en El Estudio" en vez de añadir */
  isCustomizableOnly?: boolean;
  /** Slug del producto para el link a /estudio */
  productSlug?: string;
}

export function AddToCartButton({
  productId,
  productName,
  basePrice,
  selectedSize,
  isCustomizableOnly,
  productSlug,
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const addPremade = useCartStore((s) => s.addPremade);
  const openDrawer = useCartStore((s) => s.openDrawer);

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
    });

    setAdded(true);
    toast.success("Añadido al carrito", {
      description: `${productName} — Talla ${selectedSize}`,
    });

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  }

  // Si la prenda solo se vende como custom, redirige a El Estudio
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
        <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <AlertCircle className="h-3 w-3" aria-hidden />
          Selecciona una talla para continuar
        </p>
      )}
    </div>
  );
}
