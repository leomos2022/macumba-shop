// src/lib/whatsapp.ts
// Cliente mínimo para la WhatsApp Cloud API de Meta (Fase 0 — automatización).
// Las credenciales viven SOLO en variables de entorno (Vercel / .env local):
//   WHATSAPP_TOKEN            -> token de acceso (temporal en pruebas, permanente en producción)
//   WHATSAPP_PHONE_NUMBER_ID  -> ID del número emisor (lo da Meta en API Setup)
//   WHATSAPP_NOTIFY_TO        -> número que recibe los avisos internos (Robert)
//   WHATSAPP_VERIFY_TOKEN     -> cadena que escribimos en Meta al validar el webhook

const GRAPH_VERSION = "v21.0";

export function whatsappConfig() {
  return {
    token: process.env.WHATSAPP_TOKEN ?? "",
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID ?? "",
    notifyTo: process.env.WHATSAPP_NOTIFY_TO ?? "573204959889", // Robert por defecto
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN ?? "macumba-shop-verify",
  };
}

export function whatsappConfigurado(): boolean {
  const { token, phoneNumberId } = whatsappConfig();
  return Boolean(token && phoneNumberId);
}

interface ResultadoEnvio {
  ok: boolean;
  detalle: unknown;
}

/** Envía un mensaje de texto de WhatsApp a `to` (indicativo + número, sin "+"). */
export async function enviarWhatsApp(
  to: string,
  texto: string,
): Promise<ResultadoEnvio> {
  const { token, phoneNumberId } = whatsappConfig();

  if (!token || !phoneNumberId) {
    return { ok: false, detalle: "WHATSAPP_TOKEN o WHATSAPP_PHONE_NUMBER_ID no configurados" };
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to,
          type: "text",
          text: { preview_url: true, body: texto },
        }),
      },
    );

    const detalle = await res.json().catch(() => null);
    if (!res.ok) {
      console.error(`[whatsapp] error ${res.status} enviando a ${to}:`, detalle);
    }
    return { ok: res.ok, detalle };
  } catch (error) {
    console.error("[whatsapp] fallo de red llamando a Graph API:", error);
    return { ok: false, detalle: error };
  }
}

/** Aviso interno al taller (Robert) cuando un cliente quiere comprar o pide un humano. */
export async function avisarTaller(asunto: string, detalle: string): Promise<ResultadoEnvio> {
  const { notifyTo } = whatsappConfig();
  const mensaje = `[Macumba Shop] ${asunto}\n${detalle}`;
  return enviarWhatsApp(notifyTo, mensaje);
}
