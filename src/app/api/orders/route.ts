/**
 * API Route: POST /api/orders
 * ------------------------------------------------------------
 * Crea un pedido en Supabase (tabla `orders`) usando SERVICE ROLE.
 * NUNCA expone el service role key al cliente.
 *
 * Flujo:
 *   1. Cliente (CheckoutSummary) hace POST con items del carrito
 *   2. Esta route valida con zod, inserta en Supabase
 *   3. Retorna el order.id + whatsappUrl lista para abrir
 *
 * Documento de contexto: sección 7.2 y 11 regla 3
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
} from '@/lib/whatsapp/buildMessage';
import type { CartItem, CreateOrderInput } from '@/types';

// ---------- Validación con Zod ----------

const CartItemSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  productName: z.string().min(1),
  size: z.string().min(1),
  quantity: z.number().int().positive(),
  basePrice: z.number().nonnegative(),
  kind: z.enum(['premade', 'custom']),
  customDesign: z
    .object({
      placement: z.object({
        productId: z.string(),
        view: z.enum(['front', 'back']),
        fabricJson: z.string(),
        elements: z.array(
          z.object({
            assetId: z.string(),
            x: z.number(),
            y: z.number(),
            scale: z.number(),
            rotation: z.number(),
            flipX: z.boolean(),
          })
        ),
      }),
      previewUrl: z.string().url(),
      designPrice: z.number().nonnegative(),
    })
    .optional(),
});

const CreateOrderSchema = z.object({
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  items: z.array(CartItemSchema).min(1, 'El carrito está vacío'),
  total: z.number().nonnegative(),
});

// ---------- POST handler ----------

export async function POST(request: NextRequest) {
  // 1. Parsear y validar el body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Body inválido (se esperaba JSON)' },
      { status: 400 }
    );
  }

  const parsed = CreateOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Datos inválidos',
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 422 }
    );
  }

  const { items, total, customerName, customerPhone } = parsed.data;

  // 2. Validación de seguridad: el total enviado debe coincidir con el calculado
  const calculatedTotal = items.reduce(
    (sum, i) =>
      sum +
      i.basePrice * i.quantity +
      (i.kind === 'custom'
        ? (i.customDesign?.designPrice ?? 0) * i.quantity
        : 0),
    0
  );

  // Tolerancia de 1 centavo por redondeo flotante
  if (Math.abs(calculatedTotal - total) > 0.01) {
    console.warn(
      `[api/orders] Discrepancia de total: cliente dice ${total}, real es ${calculatedTotal}`
    );
    return NextResponse.json(
      {
        error: 'El total no coincide con los items',
        expected: calculatedTotal,
        received: total,
      },
      { status: 400 }
    );
  }

  try {
    // 3. Construir el mensaje de WhatsApp PRIMERO (lo guardamos en BD)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
    const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '';

    // Generamos un ID temporal SOLO para incluir en el mensaje.
    // Después del insert tendremos el ID real.
    const tempId = crypto.randomUUID();

    const whatsappMessage = buildWhatsAppMessage({
      order: {
        id: tempId, // se reemplaza abajo después del insert
        itemsSnapshot: items as CartItem[],
        total,
        customerName: customerName ?? null,
      },
      siteUrl: siteUrl || undefined,
    });

    // 4. Insertar en Supabase usando SERVICE ROLE
    const supabase = await createClient();

    const orderInput: CreateOrderInput = {
      customerName,
      customerPhone,
      items: items as CartItem[],
      total,
      whatsappMessage,
    };

    const { data: order, error: insertError } = await supabase
      .from('orders')
      .insert({
        status: 'pending',
        customer_name: customerName ?? null,
        customer_phone: customerPhone ?? null,
        total,
        items_snapshot: orderInput.items,
        whatsapp_message_sent: null, // se actualizará después
      })
      .select()
      .single();

    if (insertError || !order) {
      console.error('[api/orders] Error insertando:', insertError);
      return NextResponse.json(
        { error: 'No se pudo crear el pedido', details: insertError?.message },
        { status: 500 }
      );
    }

    // 5. Reconstruir el mensaje con el ID real
    const finalMessage = buildWhatsAppMessage({
      order: {
        id: order.id,
        itemsSnapshot: items as CartItem[],
        total,
        customerName: customerName ?? null,
      },
      siteUrl: siteUrl || undefined,
    });

    // 6. Actualizar el pedido con el mensaje final enviado
    await supabase
      .from('orders')
      .update({ whatsapp_message_sent: finalMessage })
      .eq('id', order.id);

    // 7. Construir URL de WhatsApp lista para abrir
    const whatsappUrl = buildWhatsAppUrl(finalMessage, whatsappPhone);

    // 8. Retornar respuesta
    return NextResponse.json(
      {
        id: order.id,
        status: order.status,
        whatsappUrl,
        total,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[api/orders] Error inesperado:', err);
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        details: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// ---------- GET handler (lista pedidos - para futuro admin dashboard) ----------

export async function GET() {
  // Por ahora, no exponemos listado público de pedidos
  // (requeriría auth de admin que aún no implementamos)
  return NextResponse.json(
    { error: 'Método no permitido. Usa POST para crear un pedido.' },
    { status: 405 }
  );
}
