/**
 * CheckoutSummary — Resumen del carrito + CTA WhatsApp.
 * Precios en COP.
 */

'use client';

import { useState } from "react";
import { MessageCircle, Loader2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore, formatCOP } from "@/stores/cart-store";
import { toast } from "sonner";

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

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  async function handleWhatsAppCheckout() {
    setIsRedirecting(true);
    try {
      const tempId = `TEMP-${Date.now().toString(36).toUpperCase()}`;

      const messageLines: string[] = [
        '🛒 NUEVO PEDIDO — MACUMBA SHOP',
        `Pedido #: ${tempId}`,
        '',
      ];

      items.forEach((item, idx) => {
        const lineTotal = item.basePrice * item.quantity;
        messageLines.push(
          `${idx + 1}) ${item.productName} (Talla ${item.size}) — ${formatCOP(lineTotal)}`
        );
        messageLines.push(`   Cantidad: ${item.quantity}`);
      });

      messageLines.push('', `💵 TOTAL: ${formatCOP(total)}`, '');
      messageLines.push(`Hola, soy ___ y quiero confirmar mi pedido.`);
      messageLines.push('Mi dirección de envío es: ___');

      const message = encodeURIComponent(messageLines.join('\n'));
      const url = `https://wa.me/${phone}?text=${message}`;

      window.open(url, '_blank', 'noopener,noreferrer');

      toast.success('¡Pedido creado!', {
        description: `Pedido #${tempId} — abre WhatsApp para confirmar`,
      });

      setTimeout(() => {
        if (variant === 'drawer') closeDrawer();
      }, 800);
    } catch (err) {
      console.error('[checkout] Error:', err);
    } finally {
      setTimeout(() => setIsRedirecting(false), 1500);
    }
  }

  if (items.length === 0) return null;

  return (
    <div className="space-y-3">
      <Separator />
      <div className="space-y-1.5 text-sm">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Prendas ({totalItems})</span>
          <span className="tabular-nums">{formatCOP(total)}</span>
        </div>
        <div className="flex items-center justify-between pt-1.5">
          <span className="font-syne text-base font-bold text-foreground">Total</span>
          <span className="font-syne text-lg font-bold text-highlight tabular-nums">{formatCOP(total)}</span>
        </div>
      </div>

      <Button
        size="lg"
        onClick={handleWhatsAppCheckout}
        disabled={isRedirecting}
        className="h-12 w-full bg-[#25D366] text-base font-medium text-white shadow-lg shadow-[#25D366]/20 hover:bg-[#1ebe5d]"
      >
        {isRedirecting ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creando pedido...</>
        ) : (
          <><MessageCircle className="mr-2 h-5 w-5" /> Confirmar por WhatsApp</>
        )}
      </Button>

      <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
        <ShoppingBag className="h-3 w-3" aria-hidden />
        El pago y envío se coordinan por chat. Sin pasarela de pagos.
      </p>

      <button
        type="button"
        onClick={() => {
          if (confirm('¿Vaciar todo el carrito?')) clear();
        }}
        className="block w-full pt-1 text-center text-xs text-muted-foreground/70 underline-offset-4 hover:text-muted-foreground hover:underline"
      >
        Vaciar carrito
      </button>
    </div>
  );
}
