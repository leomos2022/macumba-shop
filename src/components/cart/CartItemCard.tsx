/**
 * CartItemCard — Card individual de un item en el carrito.
 * ------------------------------------------------------------
 * Muestra:
 *   • Nombre del producto + talla
 *   • Badge "Personalizado" si es custom
 *   • Precio base + extra (si custom)
 *   • Controles de cantidad (+/-) y botón eliminar
 *   • Link a la ficha del producto
 *
 * Componente cliente: interactúa con Zustand para updateQuantity y removeItem.
 */

'use client';

import Link from "next/link";
import { Minus, Plus, Trash2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import type { CartItem } from "@/types";
import { cn } from "@/lib/utils";

interface CartItemCardProps {
  item: CartItem;
  /** Compact mode para drawer lateral */
  variant?: 'drawer' | 'page';
}

export function CartItemCard({ item, variant = 'drawer' }: CartItemCardProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(n);

  const lineTotal =
    item.basePrice * item.quantity +
    (item.kind === 'custom'
      ? (item.customDesign?.designPrice ?? 0) * item.quantity
      : 0);

  const isCompact = variant === 'drawer';

  return (
    <div
      className={cn(
        'flex gap-3 rounded-lg border border-border bg-card/40 p-3 transition-colors hover:border-border/80',
        isCompact && 'p-3'
      )}
    >
      {/* Placeholder de imagen */}
      <Link
        href={`/producto/${item.productId}`}
        className="relative aspect-[4/5] w-16 shrink-0 overflow-hidden rounded-md border border-border bg-muted/30"
        aria-label={`Ver ${item.productName}`}
      >
        <div className="absolute inset-0 bg-fabric-pattern opacity-40" aria-hidden />
        <div className="flex h-full items-center justify-center">
          <Sparkles className="h-4 w-4 text-muted-foreground/60" aria-hidden />
        </div>
      </Link>

      {/* Info + controles */}
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <Link
              href={`/producto/${item.productId}`}
              className={cn(
                'font-medium leading-tight text-foreground hover:text-primary transition-colors',
                isCompact ? 'text-sm' : 'text-base'
              )}
            >
              {item.productName}
            </Link>
            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              <span className="rounded border border-border bg-background px-1.5 py-0.5 font-medium">
                Talla {item.size}
              </span>
              {item.kind === 'custom' && (
                <span className="inline-flex items-center gap-1 rounded border border-primary/40 bg-primary/5 px-1.5 py-0.5 font-medium text-primary">
                  <Sparkles className="h-2.5 w-2.5" aria-hidden />
                  Personalizado
                </span>
              )}
            </div>
          </div>

          {/* Botón eliminar */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
            onClick={() => removeItem(item.id)}
            aria-label={`Eliminar ${item.productName} del carrito`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Precio unitario */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            {formatPrice(item.basePrice)} c/u
            {item.kind === 'custom' && item.customDesign && (
              <span className="ml-1 text-primary/80">
                + {formatPrice(item.customDesign.designPrice)} diseño
              </span>
            )}
          </p>

          {/* Controles de cantidad */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-md"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              aria-label={`Reducir cantidad de ${item.productName}`}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span
              className="min-w-[28px] text-center text-sm font-semibold tabular-nums"
              aria-label={`Cantidad: ${item.quantity}`}
            >
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-md"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              aria-label={`Aumentar cantidad de ${item.productName}`}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Total por item */}
        <div className="flex items-center justify-between border-t border-border pt-2">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Subtotal
          </span>
          <span className="font-montserrat text-sm font-bold text-foreground">
            {formatPrice(lineTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}
