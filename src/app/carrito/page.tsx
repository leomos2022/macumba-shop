/**
 * Página /carrito — Versión full page del carrito.
 * ------------------------------------------------------------
 * Útil para mobile (el drawer puede sentirse apretado en pantallas pequeñas).
 * Server Component (envoltorio) + CartPageClient (contenido interactivo).
 *
 * SEO: noindex (no queremos que Google indexe el carrito de cada usuario).
 */

import type { Metadata } from "next";
import { CartPageClient } from "@/components/cart/CartPageClient";

export const metadata: Metadata = {
  title: "Carrito",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CarritoPage() {
  return <CartPageClient />;
}
