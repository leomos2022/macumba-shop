// Utilidades de dominio Macumba Shop

export type Producto = {
  id: string;
  slug: string;
  name: string;
  category: string;
  gender: string;
  kind: string;
  basePrice: number;
  sizes: string;
  description: string;
  technique: string;
  material: string;
  imageUrl: string;
  heroImageUrl: string | null;
  serieLabel: string | null;
  isFeatured: boolean;
  sortOrder: number;
};

export type ItemCanasta = {
  slug: string;
  nombre: string;
  talla: string;
  precio: number;
  cantidad: number;
  imagen: string;
  kind: string;
};

/** Formato COP determinista (misma salida en servidor y cliente → sin hydration mismatch) */
export function formatoCOP(valor: number): string {
  const entero = Math.round(valor);
  return `$${entero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

export function tallasDe(sizes: string): string[] {
  return sizes.split(",").map((s) => s.trim()).filter(Boolean);
}

export const ETIQUETA_CATEGORIA: Record<string, string> = {
  chaqueta: "Chaquetas",
  abrigo: "Abrigos",
  otra: "Otras prendas",
};

export const ETIQUETA_GENERO: Record<string, string> = {
  femenino: "Femenino",
  masculino: "Masculino",
  unisex: "Unisex",
};

/** Número oficial de WhatsApp (variable de entorno; fallback: +57 320 495 9889) */
export const WHATSAPP_NUMERO =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573204959889";

/** Formato visible para la UI: +57 320 495 9889 */
export const WHATSAPP_NUMERO_VISIBLE = `+${WHATSAPP_NUMERO.replace(
  /^(\d{2})(\d{3})(\d{3})(\d{4})$/,
  "$1 $2 $3 $4"
)}`;

export function urlWhatsApp(mensaje: string): string {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;
}

/** Mensaje de consulta por una pieza */
export function mensajeConsultaProducto(nombre: string): string {
  return [
    "¡Hola, Macumba Shop!",
    "",
    `Vengo de la web y me interesa "${nombre}".`,
    "¿Me cuentas disponibilidad y detalles de la pieza?",
  ].join("\n");
}

/** Mensaje de pedido armado desde la canasta (modelo contra entrega) */
export function mensajePedido(items: ItemCanasta[], total: number): string {
  const lineas = items.map(
    (i) =>
      `• ${i.cantidad}× ${i.nombre} — Talla ${i.talla} — ${formatoCOP(
        i.precio * i.cantidad
      )}`
  );
  return [
    "¡Hola, Macumba Shop!",
    "",
    "Quiero hacer un pedido desde la web:",
    "",
    ...lineas,
    "",
    `Total: ${formatoCOP(total)}`,
    "Pago: contra entrega",
    "",
    "Mis datos de entrega:",
    "Nombre: ",
    "Ciudad: ",
    "Dirección: ",
  ].join("\n");
}
