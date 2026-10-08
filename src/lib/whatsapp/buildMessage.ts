/**
 * Builder del mensaje de WhatsApp para checkout.
 * ------------------------------------------------------------
 * Genera el texto estructurado del pedido y la URL wa.me lista
 * para abrir en una nueva pestaña.
 *
 * Documento de contexto: sección 7.2
 *
 * Nota: wa.me NO permite adjuntar imágenes. Las URLs de preview
 * (PNGs en Supabase Storage) se incluyen como enlaces; además,
 * la página /pedido/[id] tiene el detalle completo.
 */

import type { CartItem, Order } from '@/types';

/** Formato moneda USD simple — cambiar a COP si el negocio lo requiere */
function formatPrice(n: number): string {
  return `$${n.toFixed(2)}`;
}

/** Toma los últimos 8 caracteres del UUID del pedido como referencia corta */
function shortId(id: string): string {
  return id.replace(/-/g, '').slice(0, 8).toUpperCase();
}

export interface BuildWhatsAppMessageInput {
  order: Pick<Order, 'id' | 'itemsSnapshot' | 'total' | 'customerName'>;
  siteUrl?: string;
}

/**
 * Construye el texto plano del mensaje de WhatsApp.
 * El formato está pensado para ser legible en el chat de WhatsApp,
 * con emojis sutiles y secciones claramente separadas.
 */
export function buildWhatsAppMessage({
  order,
  siteUrl,
}: BuildWhatsAppMessageInput): string {
  const ref = shortId(order.id);
  const lines: string[] = [];

  lines.push('🛒 NUEVO PEDIDO — MACUMBA SHOP');
  lines.push(`Pedido #: ${ref}`);
  lines.push('');

  const items: CartItem[] = order.itemsSnapshot;
  items.forEach((item, idx) => {
    const lineTotal =
      item.basePrice * item.quantity +
      (item.kind === 'custom'
        ? (item.customDesign?.designPrice ?? 0) * item.quantity
        : 0);

    lines.push(
      `${idx + 1}) ${item.productName} (Talla ${item.size}) — ${formatPrice(
        lineTotal
      )}`
    );

    if (item.kind === 'custom' && item.customDesign) {
      lines.push(
        `   🎨 Diseño personalizado: ${item.customDesign.previewUrl}`
      );
    }

    if (item.quantity > 1) {
      lines.push(`   Cantidad: ${item.quantity}`);
    }

    if (siteUrl) {
      lines.push(`   Ver detalle: ${siteUrl}/pedido/${order.id}`);
    }
  });

  lines.push('');
  lines.push(`💵 TOTAL: ${formatPrice(order.total)}`);
  lines.push('');
  lines.push(`Hola, soy ${order.customerName || '___'} y quiero confirmar mi pedido.`);
  lines.push('Mi dirección de envío es: ___');

  return lines.join('\n');
}

/**
 * Construye la URL wa.me lista para abrir.
 * Codifica el mensaje con encodeURIComponent.
 */
export function buildWhatsAppUrl(message: string, phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}
