/**
 * CartItemCard — Card de item en el carrito.
 * Usa cartImageUrl (versión con fondo blanco) si está disponible.
 * Precios en COP.
 */

'use client';

import Link from "next/link";
import { Minus, Plus, Trash2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore, formatCOP } from "@/stores/cart-store";
import type { CartItem } from "@/types";

interface CartItemCardProps {
  item: CartItem;
  variant?: 'drawer' | 'page';
}

export function CartItemCard({ item, variant = 'drawer' }: CartItemCardProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const lineTotal = item.basePrice * item.quantity;
  const cartImage = item.cartImageUrl;

  return (
    <div className="flex gap-3 rounded-lg border border-border bg-card/40 p-3">
      {/* Imagen — usa cartImageUrl (fondo blanco) */}
      <Link
        href={`/producto/${item.productId}`}
        className="relative aspect-[4/5] w-16 shrink-0 overflow-hidden rounded-md border border-border bg-white"
        aria-label={`Ver ${item.productName}`}
      >
        {cartImage ? (
          <img
            src={cartImage}
            alt={item.productName}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted/30">
            <Sparkles className="h-4 w-4 text-muted-foreground/60" aria-hidden />
          </div>
        )}
      </Link>

      {/* Info + controles */}
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <Link
              href={`/producto/${item.productId}`}
              className="font-medium leading-tight text-foreground hover:text-highlight transition-colors text-sm"
            >
              {item.productName}
            </Link>
            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              <span className="rounded border border-border bg-background px-1.5 py-0.5 font-medium">
                Talla {item.size}
              </span>
              {item.kind === 'custom' && (
                <span className="inline-flex items-center gap-1 rounded border border-highlight/40 bg-highlight/5 px-1.5 py-0.5 font-medium text-highlight">
                  <Sparkles className="h-2.5 w-2.5" aria-hidden />
                  Personalizado
                </span>
              )}
            </div>
          </div>

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

        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            {formatCOP(item.basePrice)} c/u
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-md"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              aria-label="Reducir cantidad"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="min-w-[28px] text-center text-sm font-semibold tabular-nums">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-md"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              aria-label="Aumentar cantidad"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-2">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Subtotal
          </span>
          <span className="font-syne text-sm font-bold text-foreground">
            {formatCOP(lineTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}
