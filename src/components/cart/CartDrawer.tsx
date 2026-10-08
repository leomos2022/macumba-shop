/**
 * CartDrawer — Drawer lateral derecho con el carrito.
 * ------------------------------------------------------------
 * Estado controlado por Zustand (isOpen, openDrawer, closeDrawer).
 * Se monta en el layout raíz (siempre presente en el DOM).
 *
 * Contenido:
 *   • Header con título + botón cerrar
 *   • Lista de items (CartItemCard) — scroll si overflow
 *   • CheckoutSummary con total y CTA WhatsApp
 *   • Empty state cuando no hay items
 *   • Footer con link a /carrito (vista completa en página dedicada)
 */

'use client';

import Link from "next/link";
import { X, ShoppingBag, ArrowRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { CartItemCard } from "./CartItemCard";
import { CheckoutSummary } from "./CheckoutSummary";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const items = useCartStore((s) => s.items);
  const totalItems = useCartStore((s) => s.getTotalItems());

  return (
    <Sheet open={isOpen} onOpenChange={closeDrawer}>
      <SheetContent
        side="right"
        aria-describedby={undefined}
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
      >
        {/* Header fijo */}
        <SheetHeader className="flex-row items-center justify-between border-b border-border px-5 py-4">
          <SheetTitle className="flex items-center gap-2 font-montserrat text-lg font-bold">
            <ShoppingBag className="h-5 w-5 text-primary" aria-hidden />
            Carrito
            {totalItems > 0 && (
              <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                {totalItems}
              </span>
            )}
          </SheetTitle>
          <SheetDescription className="sr-only">
            {totalItems > 0
              ? `Tienes ${totalItems} ${totalItems === 1 ? 'artículo' : 'artículos'} en el carrito`
              : 'Tu carrito está vacío'}
          </SheetDescription>
          <SheetClose
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Cerrar carrito"
          >
            <X className="h-5 w-5" />
          </SheetClose>
        </SheetHeader>

        {/* Contenido scrollable */}
        {items.length === 0 ? (
          <EmptyState onClose={closeDrawer} />
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

            {/* Footer con resumen + CTA */}
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

function EmptyState({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/30">
        <ShoppingBag className="h-9 w-9 text-muted-foreground/60" aria-hidden />
      </div>
      <div className="space-y-1">
        <p className="font-montserrat text-lg font-semibold text-foreground">
          Tu carrito está vacío
        </p>
        <p className="text-sm text-muted-foreground max-w-xs">
          Explora el catálogo y añade prendas únicas pintadas a mano.
        </p>
      </div>
      <Button asChild onClick={onClose}>
        <Link href="/catalogo">
          Ver catálogo
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
