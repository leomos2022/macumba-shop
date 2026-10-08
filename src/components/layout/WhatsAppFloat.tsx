/**
 * Botón flotante de WhatsApp.
 * ------------------------------------------------------------
 * Documento de contexto: sección 3 (navegación móvil) y 8 (UI/UX).
 *
 * Esquina inferior derecha, toda la web. Oculto cuando el drawer
 * del carrito está abierto (para evitar superposición).
 *
 * Nota sobre hidratación: usamos `useSyncExternalStore` para evitar
 * el patrón "setState in effect" que React 19 prohíbe.
 */

'use client';

import { useSyncExternalStore } from "react";
import { MessageCircle } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";

/**
 * Hook idiomático React 19 para saber si ya estamos en el cliente.
 * `useSyncExternalStore` con un subscribe vacío + getServerSnapshot=false
 * evita warnings de hidratación y respeta el Strict Mode.
 */
function useIsClient() {
  return useSyncExternalStore(
    () => () => {}, // subscribe: noop
    () => true,     // client snapshot
    () => false     // server snapshot
  );
}

export function WhatsAppFloat() {
  const isClient = useIsClient();
  const drawerOpen = useCartStore((s) => s.isOpen);

  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '';
  const defaultMessage = encodeURIComponent(
    "¡Hola MACUMBA! Quiero hacer una consulta sobre una prenda 👋"
  );
  const href = `https://wa.me/${phone}?text=${defaultMessage}`;

  if (!isClient) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className={`fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-all duration-300 hover:scale-110 hover:bg-[#1ebe5d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
        drawerOpen ? 'opacity-0 pointer-events-none translate-x-4' : 'opacity-100'
      }`}
    >
      <MessageCircle className="h-7 w-7" aria-hidden />
      {/* Anillo de pulso */}
      <span
        className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 animate-ping"
        aria-hidden="true"
      />
    </a>
  );
}
