// src/app/api/whatsapp/webhook/route.ts
// Webhook de WhatsApp Cloud API (Fase 0).
//
// GET  -> validación inicial de Meta (hub.challenge) al registrar la URL.
// POST -> mensajes entrantes: responde según palabra clave y avisa al taller.
//
// Variables de entorno necesarias (ver .env.example):
//   WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_VERIFY_TOKEN, WHATSAPP_NOTIFY_TO

import { NextRequest, NextResponse } from "next/server";
import { avisarTaller, enviarWhatsApp, whatsappConfig } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

const URL_TIENDA =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://macumba-shop.vercel.app";

/** Quita mayúsculas y tildes para comparar palabras clave sin dolores de cabeza. */
function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function saludo(): string {
  return [
    "Hola, gracias por escribir a Macumba Arte-Magia — moda que viste arte.",
    "",
    "Escribe una de estas palabras y te ayudo:",
    "1. CATALOGO -> ver las prendas disponibles",
    "2. TALLAS -> como elegir tu talla",
    "3. PEDIDO -> quiero una prenda, conéctame con el taller",
    "4. HUMANO -> quiero hablar con una persona",
  ].join("\n");
}

function respuestaCatalogo(): string {
  return [
    "Este es nuestro catálogo vivo, cada prenda es única:",
    `${URL_TIENDA}/catalogo`,
    "",
    "Si te enamoras de una, escribe PEDIDO con el nombre de la prenda y el taller te confirma disponibilidad y talla.",
  ].join("\n");
}

function respuestaTallas(): string {
  return [
    "Cada pieza de Macumba es única, así que la talla disponible va prenda por prenda.",
    "En el catálogo encuentras las medidas reales de cada pieza:",
    `${URL_TIENDA}/catalogo`,
    "",
    "Si tienes duda entre dos tallas, escribe PEDIDO y el taller te asesora personalmente.",
  ].join("\n");
}

function respuestaPedido(nombreCliente: string, telefono: string, textoCliente: string) {
  // Avisa al taller con los datos del cliente y le confirma al cliente.
  void avisarTaller(
    "Pedido nuevo",
    [
      `Cliente: ${nombreCliente}`,
      `WhatsApp: ${telefono}`,
      `Mensaje: ${textoCliente}`,
      `Tienda: ${URL_TIENDA}/catalogo`,
    ].join("\n"),
  );

  return [
    "Perfecto, tu solicitud quedó en manos del taller.",
    "Muy pronto te escribimos para confirmar disponibilidad, talla y pago.",
    "",
    `Mientras tanto puedes mirar el catálogo aquí: ${URL_TIENDA}/catalogo`,
  ].join("\n");
}

function respuestaHumano(nombreCliente: string, telefono: string) {
  void avisarTaller(
    "Cliente pide hablar con una persona",
    `Cliente: ${nombreCliente}\nWhatsApp: ${telefono}`,
  );
  return "Listo, en un momento te atiende una persona del taller. Gracias por tu paciencia.";
}

/** Decide qué responder según el texto del cliente. */
function decidirRespuesta(
  textoCliente: string,
  nombreCliente: string,
  telefono: string,
): string {
  const t = normalizar(textoCliente);

  if (/(^|\s)(hola|buenas|buenos dias|buenas tardes|buenas noches|hey)(\s|$)/.test(t)) {
    return saludo();
  }
  if (/(catalogo|producto|prenda|ver ropa|que tienen|que hay)/.test(t)) {
    return respuestaCatalogo();
  }
  if (/(talla|medida|como me queda|servira)/.test(t)) {
    return respuestaTallas();
  }
  if (/(pedido|comprar|quiero|me interesa|me gusta|disponible|cotizar)/.test(t)) {
    return respuestaPedido(nombreCliente, telefono, textoCliente);
  }
  if (/(humano|persona|asesor|arley|robert|hablar con alguien)/.test(t)) {
    return respuestaHumano(nombreCliente, telefono);
  }
  return saludo();
}

// ---------------------------------------------------------------------------
// GET: validación del webhook (Meta llama una sola vez al guardar la URL)
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const mode = params.get("hub.mode");
  const token = params.get("hub.verify_token");
  const challenge = params.get("hub.challenge");
  const { verifyToken } = whatsappConfig();

  if (mode === "subscribe" && token === verifyToken) {
    return new NextResponse(challenge ?? "", { status: 200 });
  }
  return new NextResponse("Verificacion fallida", { status: 403 });
}

// ---------------------------------------------------------------------------
// POST: mensajes entrantes de los clientes
// ---------------------------------------------------------------------------
interface MensajeWhatsApp {
  from?: string;
  type?: string;
  text?: { body?: string };
  profile?: { name?: string };
}

export async function POST(req: NextRequest) {
  try {
    const cuerpo = (await req.json()) as {
      entry?: Array<{
        changes?: Array<{
          value?: {
            contacts?: Array<{ profile?: { name?: string }; wa_id?: string }>;
            messages?: MensajeWhatsApp[];
          };
        }>;
      }>;
    };

    const value = cuerpo.entry?.[0]?.changes?.[0]?.value;
    const mensaje = value?.messages?.[0];

    // Los reportes de entrega/lectura (statuses) no llevan "messages": se confirman y ya.
    if (!mensaje || mensaje.type !== "text" || !mensaje.text?.body) {
      return NextResponse.json({ recibido: true });
    }

    const telefonoCliente = mensaje.from ?? value?.contacts?.[0]?.wa_id ?? "";
    const nombreCliente =
      mensaje.profile?.name ?? value?.contacts?.[0]?.profile?.name ?? "Cliente";
    const textoCliente = mensaje.text.body;

    const respuesta = decidirRespuesta(textoCliente, nombreCliente, telefonoCliente);
    const resultado = await enviarWhatsApp(telefonoCliente, respuesta);

    return NextResponse.json({ recibido: true, respondido: resultado.ok });
  } catch (error) {
    // Si algo explota al parsear, respondemos 200 igual: Meta reintenta si no.
    console.error("[webhook whatsapp] error procesando mensaje:", error);
    return NextResponse.json({ recibido: true, error: true });
  }
}
