/**
 * CheckoutSummary — Resumen del carrito + CTA WhatsApp.
 * ------------------------------------------------------------
 * Componente cliente que:
 *   • Calcula subtotal, extras y total
 *   • Construye el mensaje de WhatsApp usando lib/whatsapp/buildMessage
 *   • Abre wa.me con el mensaje en una nueva pestaña
 *
 * NOTA (Fase 1, MVP): en este ticket NO se persiste el pedido en
 * Supabase todavía. El pedido se guarda en /api/orders en el Ticket 5.
 * Por ahora, el mensaje de WhatsApp contiene todo lo necesario
 * (items, precios, total) para que el artesano lo procese manualmente.
 */

'use client';

import { useState } from "react";
import { MessageCircle, Loader2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/cart-store";
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
} from "@/lib/whatsapp/buildMessage";

interface CheckoutSummaryProps {
  variant?: 'drawer' | 'page';
}

export function CheckoutSummary({ variant = 'drawer' }: CheckoutSummaryProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.getTotalPrice());
  const clear = useCartStore((s) => s.clear);
  const closeDrawer = useCartStore((s) => s.closeDrawer);

  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(n);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const customCount = items.filter((i) => i.kind === 'custom').length;
  const designsExtra = items.reduce(
    (sum, i) =>
      sum + (i.kind === 'custom' ? (i.customDesign?.designPrice ?? 0) * i.quantity : 0),
    0
  );
  const baseSubtotal = items.reduce(
    (sum, i) => sum + i.basePrice * i.quantity,
    0
  );

  async function handleWhatsAppCheckout() {
    setIsRedirecting(true);

    try {
      // Generar un ID temporal para mostrar como referencia en el mensaje
      // (en el Ticket 5 esto vendrá de Supabase al insertar el pedido)
      const tempId = `TEMP-${Date.now().toString(36).toUpperCase()}`;

      const message = buildWhatsAppMessage({
        order: {
          id: tempId,
          itemsSnapshot: items,
          total,
          customerName: '', // El usuario lo completa en el chat de WhatsApp
        },
        siteUrl: siteUrl || undefined,
      });

      const url = buildWhatsAppUrl(message, phone);

      // Abrir WhatsApp en nueva pestaña
      window.open(url, '_blank', 'noopener,noreferrer');

      // Pequeño delay para asegurar que el popup se abra
      setTimeout(() => {
        if (variant === 'drawer') closeDrawer();
      }, 500);
    } catch (err) {
      console.error('[checkout] Error:', err);
    } finally {
      setTimeout(() => setIsRedirecting(false), 1500);
    }
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <Separator />

      {/* Desglose */}
      <div className="space-y-1.5 text-sm">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Prendas ({totalItems})</span>
          <span className="tabular-nums">{formatPrice(baseSubtotal)}</span>
        </div>

        {designsExtra > 0 && (
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Diseños personalizados ({customCount})</span>
            <span className="tabular-nums">{formatPrice(designsExtra)}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-1.5">
          <span className="font-montserrat text-base font-bold text-foreground">
            Total
          </span>
          <span className="font-montserrat text-lg font-bold text-primary tabular-nums">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      {/* CTA WhatsApp */}
      <Button
        size="lg"
        onClick={handleWhatsAppCheckout}
        disabled={isRedirecting}
        className="h-12 w-full bg-[#25D366] text-base font-medium text-white shadow-lg shadow-[#25D366]/20 hover:bg-[#1ebe5d] hover:shadow-[#25D366]/30"
      >
        {isRedirecting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Abriendo WhatsApp...
          </>
        ) : (
          <>
            <MessageCircle className="mr-2 h-5 w-5" />
            Confirmar por WhatsApp
          </>
        )}
      </Button>

      {/* Trust badge */}
      <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
        <ShoppingBag className="h-3 w-3" aria-hidden />
        El pago y envío se coordinan por chat. Sin pasarela de pagos.
      </p>

      {/* Acción secundaria: vaciar carrito */}
      <button
        type="button"
        onClick={() => {
          if (confirm('¿Vaciar todo el carrito? Esta acción no se puede deshacer.')) {
            clear();
          }
        }}
        className="block w-full pt-1 text-center text-xs text-muted-foreground/70 underline-offset-4 transition-colors hover:text-muted-foreground hover:underline"
      >
        Vaciar carrito
      </button>
    </div>
  );
}
