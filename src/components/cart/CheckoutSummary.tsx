/**
 * CheckoutSummary — Resumen del carrito + CTA WhatsApp.
 * ------------------------------------------------------------
 * Flujo de checkout (Ticket 5):
 *   1. POST /api/orders con items + total
 *   2. API devuelve { id, whatsappUrl }
 *   3. Abrir wa.me con el ID REAL del pedido (no TEMP-xxx)
 *   4. El pedido queda persistido en Supabase (tabla `orders`)
 *   5. El artesano lo ve en Supabase Dashboard → Table Editor
 *
 * Documento de contexto: sección 7.2 y 11 regla 3
 */

'use client';

import { useState } from "react";
import { MessageCircle, Loader2, ShoppingBag, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "sonner";
import Link from "next/link";

interface CheckoutSummaryProps {
  variant?: 'drawer' | 'page';
}

interface CreateOrderResponse {
  id: string;
  status: string;
  whatsappUrl: string;
  total: number;
}

export function CheckoutSummary({ variant = 'drawer' }: CheckoutSummaryProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.getTotalPrice());
  const clear = useCartStore((s) => s.clear);
  const closeDrawer = useCartStore((s) => s.closeDrawer);

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
      // 1. POST a /api/orders para persistir el pedido en Supabase
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          total,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error ?? `Error del servidor (${response.status})`
        );
      }

      const data: CreateOrderResponse = await response.json();

      // 2. Guardar el ID del pedido creado (para mostrar link a /pedido/[id])
      setCreatedOrderId(data.id);

      // 3. Abrir WhatsApp con el mensaje generado (que incluye el ID real)
      window.open(data.whatsappUrl, '_blank', 'noopener,noreferrer');

      // 4. Feedback al usuario
      toast.success('¡Pedido creado!', {
        description: `Pedido #${data.id.slice(0, 8).toUpperCase()} — abre WhatsApp para confirmar`,
        duration: 5000,
      });

      // 5. Cerrar drawer (si aplica) y limpiar carrito tras éxito
      setTimeout(() => {
        if (variant === 'drawer') closeDrawer();
      }, 800);
    } catch (err) {
      console.error('[checkout] Error:', err);
      toast.error('No se pudo crear el pedido', {
        description:
          err instanceof Error
            ? err.message
            : 'Hubo un problema. Intenta de nuevo.',
        duration: 6000,
      });
    } finally {
      setTimeout(() => setIsRedirecting(false), 1500);
    }
  }

  if (items.length === 0 && !createdOrderId) {
    return null;
  }

  // Estado post-creación exitosa
  if (createdOrderId) {
    return (
      <div className="space-y-3">
        <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4 text-center">
          <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-green-600" aria-hidden />
          <p className="font-montserrat text-sm font-semibold text-foreground">
            ¡Pedido creado!
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Si WhatsApp no se abrió automáticamente, usa el botón de abajo.
          </p>
        </div>

        <Button
          asChild
          size="lg"
          className="h-12 w-full bg-[#25D366] text-base font-medium text-white hover:bg-[#1ebe5d]"
        >
          <a
            href={buildFallbackWhatsAppUrl(items, total, createdOrderId)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Abrir WhatsApp
          </a>
        </Button>

        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href={`/pedido/${createdOrderId}`}>
            Ver detalle del pedido →
          </Link>
        </Button>

        <button
          type="button"
          onClick={() => {
            clear();
            setCreatedOrderId(null);
          }}
          className="block w-full pt-1 text-center text-xs text-muted-foreground underline-offset-4 hover:underline"
        >
          Limpiar y crear otro pedido
        </button>
      </div>
    );
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
            Creando pedido...
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

      {/* Info sobre qué pasa después */}
      <p className="flex items-start gap-1.5 text-[11px] text-muted-foreground/80">
        <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
        Al confirmar, crearemos tu pedido y abriremos WhatsApp con el resumen. Tus artesanos lo verán en su panel.
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

/* ---------- Helpers ---------- */

/**
 * Fallback: si la API no devolvió whatsappUrl por algún motivo,
 * construimos una URL básica con la info que tenemos.
 */
function buildFallbackWhatsAppUrl(
  items: { productName: string; size: string; quantity: number; basePrice: number }[],
  total: number,
  orderId: string
): string {
  const phone = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '').replace(/[^0-9]/g, '');
  const ref = orderId.replace(/-/g, '').slice(0, 8).toUpperCase();
  const lines = [
    '🛒 NUEVO PEDIDO — MACUMBA SHOP',
    `Pedido #: ${ref}`,
    '',
    ...items.map(
      (i, idx) =>
        `${idx + 1}) ${i.productName} (Talla ${i.size}) — $${(
          i.basePrice * i.quantity
        ).toFixed(2)}`
    ),
    '',
    `💵 TOTAL: $${total.toFixed(2)}`,
    '',
    `Ver detalle: ${process.env.NEXT_PUBLIC_SITE_URL}/pedido/${orderId}`,
  ];
  const message = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${phone}?text=${message}`;
}
