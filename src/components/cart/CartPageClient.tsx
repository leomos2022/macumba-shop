/**
 * CartPageClient — Versión full-page del carrito.
 * ------------------------------------------------------------
 * Renderiza todos los items del carrito en una página dedicada,
 * con layout más amplio que el drawer.
 *
 * Se diferencia del CartDrawer en:
 *   • Layout vertical amplio (no drawer lateral)
 *   • Botón "Seguir comprando" más visible
 *   • Ideal para mobile donde el drawer se siente apretado
 */

'use client';

import Link from "next/link";
import { ArrowLeft, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { CartItemCard } from "./CartItemCard";
import { CheckoutSummary } from "./CheckoutSummary";

export function CartPageClient() {
  const items = useCartStore((s) => s.items);
  const totalItems = useCartStore((s) => s.getTotalItems());

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-montserrat text-3xl font-extrabold tracking-tight md:text-4xl">
            Carrito
          </h1>
          {totalItems > 0 && (
            <p className="mt-1 text-sm text-muted-foreground">
              {totalItems} {totalItems === 1 ? 'artículo' : 'artículos'} en tu carrito
            </p>
          )}
        </div>
        <Button asChild variant="ghost" size="sm" className="shrink-0">
          <Link href="/catalogo">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Seguir comprando
          </Link>
        </Button>
      </div>

      {items.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center gap-6 rounded-lg border border-dashed border-border bg-card/30 py-20 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted/30">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/60" aria-hidden />
          </div>
          <div className="space-y-2">
            <p className="font-montserrat text-xl font-semibold text-foreground">
              Tu carrito está vacío
            </p>
            <p className="text-sm text-muted-foreground max-w-sm">
              Explora nuestro catálogo de prendas artesanales pintadas a mano.
              Cada pieza es única, como tu historia.
            </p>
          </div>
          <Button asChild size="lg" className="h-12 px-8">
            <Link href="/catalogo">
              Ver catálogo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      ) : (
        /* Layout 2 columnas en desktop, stack en mobile */
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
          {/* Lista de items (2/3 del ancho) */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <CartItemCard key={item.id} item={item} variant="page" />
              ))}
            </div>

            {/* CTA secundario */}
            <div className="mt-8">
              <Button asChild variant="outline">
                <Link href="/catalogo">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Añadir más prendas
                </Link>
              </Button>
            </div>
          </div>

          {/* Sidebar con resumen (1/3 del ancho, sticky en desktop) */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-border bg-card/50 p-5">
              <h2 className="font-montserrat text-lg font-bold text-foreground">
                Resumen del pedido
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Revisa tu carrito antes de confirmar por WhatsApp.
              </p>

              <div className="mt-5">
                <CheckoutSummary variant="page" />
              </div>
            </div>

            {/* Trust box */}
            <div className="mt-4 rounded-lg border border-border bg-card/30 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Cómo funciona
              </p>
              <ol className="mt-3 space-y-2 text-xs text-muted-foreground">
                <li className="flex gap-2">
                  <span className="font-bold text-primary">1.</span>
                  Confirma tu pedido por WhatsApp desde el botón de arriba.
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-primary">2.</span>
                  Los artesanos revisan tu pedido y confirman disponibilidad.
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-primary">3.</span>
                  Coordinas datos de envío y pago por chat (sin pasarela online).
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-primary">4.</span>
                  Recibes tu prenda única, pintada a mano para ti.
                </li>
              </ol>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
