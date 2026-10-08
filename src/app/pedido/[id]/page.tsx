/**
 * Página /pedido/[id] — Detalle del pedido.
 * ------------------------------------------------------------
 * Server Component. Lee el pedido desde Supabase usando SERVICE ROLE.
 *
 * Seguridad: el ID del pedido es un UUID (unguessable). Conocerlo
 * es el "token de acceso" para ver el detalle. Esto es suficiente
 * para MVP — si en el futuro se requiere más seguridad, podemos
 * agregar signed URLs o auth de cliente.
 *
 * Casos:
 *   • Pedido existe → muestra detalle completo + link WhatsApp
 *   • Pedido no existe → 404
 *   • ID mal formateado → 400 / página de error amigable
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Package,
  MessageCircle,
  ArrowLeft,
  Copy,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";
import type { Order, OrderStatus, CartItem } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

// ---------- Metadata ----------

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const supabase = await createClient();
    const { data: order } = await supabase
      .from('orders')
      .select('id, status, total, created_at')
      .eq('id', id)
      .maybeSingle();

    if (!order) return { title: 'Pedido no encontrado' };

    return {
      title: `Pedido #${shortId(order.id)}`,
      description: `Detalle de tu pedido MACUMBA SHOP — estado: ${translateStatus(
        order.status as OrderStatus
      )}`,
      robots: { index: false, follow: false },
    };
  } catch {
    return { title: 'Pedido' };
  }
}

// ---------- Página ----------

export default async function PedidoPage({ params }: PageProps) {
  const { id } = await params;

  // Validar que el ID sea un UUID válido
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return <InvalidIdPage id={id} />;
  }

  let order: Order | null = null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('[pedido/[id]] Error BD:', error);
      throw error;
    }

    if (data) {
      order = {
        id: data.id,
        status: data.status as OrderStatus,
        customerName: data.customer_name,
        customerPhone: data.customer_phone,
        total: Number(data.total),
        itemsSnapshot: data.items_snapshot as CartItem[],
        whatsappMessageSent: data.whatsapp_message_sent,
        createdAt: data.created_at,
      };
    }
  } catch (err) {
    console.error('[pedido/[id]] Error:', err);
    throw err;
  }

  if (!order) {
    notFound();
  }

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(n);

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat("es-CO", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(new Date(iso));

  const whatsappUrl = order.whatsappMessageSent
    ? buildWhatsAppUrlFromMessage(order.whatsappMessageSent)
    : null;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
            <Link href="/catalogo">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al catálogo
            </Link>
          </Button>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="h-6 w-6" aria-hidden />
            </div>
            <div>
              <h1 className="font-montserrat text-2xl font-bold tracking-tight md:text-3xl">
                Pedido #{shortId(order.id)}
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Creado el {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Estado del pedido */}
        <div className="mb-6 rounded-lg border border-border bg-card/50 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Estado actual
              </p>
              <div className="mt-1.5 flex items-center gap-2">
                <StatusBadge status={order.status} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground max-w-xs">
              {getStatusDescription(order.status)}
            </p>
          </div>

          {/* Timeline visual */}
          <div className="mt-6 grid grid-cols-5 gap-2">
            <TimelineStep label="Pendiente" active={order.status === 'pending'} />
            <TimelineStep label="Contactado" active={order.status === 'contacted'} />
            <TimelineStep label="Confirmado" active={order.status === 'confirmed'} />
            <TimelineStep label="Producción" active={order.status === 'in_production'} />
            <TimelineStep label="Enviado" active={order.status === 'shipped'} />
          </div>
        </div>

        {/* Items del pedido */}
        <div className="mb-6 rounded-lg border border-border bg-card/40 p-5">
          <h2 className="mb-4 flex items-center gap-2 font-montserrat text-base font-semibold">
            <Package className="h-4 w-4 text-primary" aria-hidden />
            Artículos del pedido
          </h2>

          <div className="space-y-4">
            {order.itemsSnapshot.map((item, idx) => {
              const lineTotal =
                item.basePrice * item.quantity +
                (item.kind === 'custom'
                  ? (item.customDesign?.designPrice ?? 0) * item.quantity
                  : 0);
              return (
                <div key={item.id ?? idx} className="flex gap-3">
                  <div className="relative aspect-[4/5] w-16 shrink-0 overflow-hidden rounded-md border border-border bg-muted/30">
                    <div className="absolute inset-0 bg-fabric-pattern opacity-40" aria-hidden />
                    <div className="flex h-full items-center justify-center">
                      <ShoppingBag className="h-4 w-4 text-muted-foreground/60" aria-hidden />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <p className="font-medium text-foreground">{item.productName}</p>
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="rounded border border-border bg-background px-1.5 py-0.5 font-medium">
                        Talla {item.size}
                      </span>
                      <span>·</span>
                      <span>Cantidad: {item.quantity}</span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {formatPrice(lineTotal)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <Separator className="my-4" />

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatPrice(order.total)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-montserrat text-base font-bold">Total</span>
              <span className="font-montserrat text-lg font-bold text-primary tabular-nums">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Acción principal: WhatsApp */}
        <div className="mb-6 rounded-lg border border-border bg-card/40 p-5">
          <h2 className="mb-2 font-montserrat text-base font-semibold">
            ¿Necesitas ayuda con este pedido?
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Escríbenos por WhatsApp mencionando el número de pedido. Nuestros
            artesanos te atenderán directamente.
          </p>

          {whatsappUrl ? (
            <Button
              asChild
              size="lg"
              className="h-12 w-full bg-[#25D366] text-base font-medium text-white shadow-lg shadow-[#25D366]/20 hover:bg-[#1ebe5d]"
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" />
                Escribir por WhatsApp
              </a>
            </Button>
          ) : (
            <Button asChild size="lg" className="h-12 w-full" variant="outline">
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Escribir por WhatsApp
              </a>
            </Button>
          )}

          {/* ID para copiar */}
          <div className="mt-4 flex items-center justify-between gap-2 rounded-md border border-border bg-background/60 px-3 py-2">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                ID del pedido
              </p>
              <p className="font-mono text-xs text-foreground">{order.id}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 shrink-0"
              onClick={undefined}
              aria-label="Copiar ID del pedido"
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Información de contacto */}
        {order.customerName && (
          <div className="rounded-lg border border-border bg-card/30 p-4 text-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Información del cliente
            </p>
            <p className="mt-1.5 text-foreground">{order.customerName}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Helpers ---------- */

function shortId(id: string): string {
  return id.replace(/-/g, '').slice(0, 8).toUpperCase();
}

function translateStatus(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    pending: 'Pendiente',
    contacted: 'Contactado',
    confirmed: 'Confirmado',
    in_production: 'En producción',
    shipped: 'Enviado',
    cancelled: 'Cancelado',
  };
  return map[status] ?? 'Desconocido';
}

function getStatusDescription(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    pending: 'Acabas de crear este pedido. Te contactaremos por WhatsApp pronto.',
    contacted: 'Ya estamos en contacto contigo coordinando los detalles.',
    confirmed: 'Pedido confirmado. Lo pasamos a producción con nuestros pintores.',
    in_production: 'Tu prenda está siendo pintada a mano. Esto puede tomar de 3 a 7 días.',
    shipped: '¡Tu pedido fue enviado! Te llegará pronto.',
    cancelled: 'Este pedido fue cancelado. Si crees que es un error, escríbenos.',
  };
  return map[status] ?? '';
}

function buildWhatsAppUrlFromMessage(message: string): string {
  const phone = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '').replace(/[^0-9]/g, '');
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/* ---------- Sub-componentes ---------- */

function StatusBadge({ status }: { status: OrderStatus }) {
  const variants: Record<OrderStatus, { variant: 'default' | 'secondary' | 'outline' | 'destructive'; className?: string }> = {
    pending: { variant: 'secondary', className: 'bg-yellow-500/15 text-yellow-600 border-yellow-500/30' },
    contacted: { variant: 'secondary', className: 'bg-blue-500/15 text-blue-600 border-blue-500/30' },
    confirmed: { variant: 'default', className: 'bg-green-500/15 text-green-600 border-green-500/30' },
    in_production: { variant: 'default', className: 'bg-primary/15 text-primary border-primary/30' },
    shipped: { variant: 'default', className: 'bg-green-600/15 text-green-700 border-green-600/30' },
    cancelled: { variant: 'destructive' },
  };
  const config = variants[status] ?? variants.pending;

  return (
    <Badge variant={config.variant} className={config.className}>
      {status === 'in_production' && <Clock className="mr-1 h-3 w-3" aria-hidden />}
      {translateStatus(status)}
    </Badge>
  );
}

function TimelineStep({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <div
        className={`h-2 w-full rounded-full transition-colors ${
          active ? 'bg-primary' : 'bg-muted'
        }`}
        aria-hidden
      />
      <span
        className={`text-[10px] font-medium ${
          active ? 'text-foreground' : 'text-muted-foreground/60'
        }`}
      >
        {label}
      </span>
    </div>
  );
}

/* ---------- Estado de error ---------- */

function InvalidIdPage({ id }: { id: string }) {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <Package className="h-8 w-8" aria-hidden />
        </div>
        <h1 className="font-montserrat text-2xl font-bold">
          ID de pedido inválido
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          El ID <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{id}</code> no
          tiene el formato esperado. Verifica que el enlace sea correcto.
        </p>
        <Button asChild className="mt-6">
          <Link href="/catalogo">Volver al catálogo</Link>
        </Button>
      </div>
    </div>
  );
}
