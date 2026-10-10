/**
 * CartDrawer — Drawer lateral con el carrito.
 * Precios en COP.
 */

'use client';

import Link from "next/link";
import { X, ShoppingBag, ArrowRight } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCartStore, formatCOP } from "@/stores/cart-store";
import { CartItemCard } from "./CartItemCard";
import { CheckoutSummary } from "./CheckoutSummary";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const items = useCartStore((s) => s.items);
  const totalItems = useCartStore((s) => s.getTotalItems());

  return (
    <Sheet open={isOpen} onOpenChange={closeDrawer}>
      <SheetContent side="right" aria-describedby={undefined} className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="flex-row items-center justify-between border-b border-border px-5 py-4">
          <SheetTitle className="flex items-center gap-2 font-syne text-lg font-bold">
            <ShoppingBag className="h-5 w-5 text-highlight" aria-hidden />
            Carrito
            {totalItems > 0 && (
              <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                {totalItems}
              </span>
            )}
          </SheetTitle>
          <SheetClose
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Cerrar carrito"
          >
            <X className="h-5 w-5" />
          </SheetClose>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/30">
              <ShoppingBag className="h-9 w-9 text-muted-foreground/60" aria-hidden />
            </div>
            <div className="space-y-1">
              <p className="font-syne text-lg font-semibold text-foreground">Tu carrito está vacío</p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Explora el catálogo y añade prendas únicas pintadas a mano.
              </p>
            </div>
            <Button asChild onClick={closeDrawer}>
              <Link href="/catalogo">
                Ver catálogo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <p className="mb-3 text-xs text-muted-foreground">
                {totalItems} {totalItems === 1 ? 'artículo' : 'artículos'} en tu carrito
              </p>
              <div className="space-y-3">
                {items.map((item) => (
                  <CartItemCard key={item.id} item={item} variant="drawer" />
                ))}
              </div>
            </div>

            <div className="border-t border-border bg-card/40 px-5 py-4">
              <CheckoutSummary variant="drawer" />
              <div className="mt-3 pt-3 border-t border-border/60">
                <Button asChild variant="ghost" size="sm" className="w-full">
                  <Link href="/carrito" onClick={closeDrawer}>
                    Ver carrito completo
                    <ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
