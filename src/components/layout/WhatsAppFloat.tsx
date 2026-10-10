'use client';

import { useSyncExternalStore } from "react";
import { MessageCircle } from "lucide-react";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function WhatsAppFloat() {
  const isClient = useIsClient();

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
      className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-all duration-300 hover:scale-110 hover:bg-[#1ebe5d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <MessageCircle className="h-7 w-7" aria-hidden />
      <span
        className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 animate-ping"
        aria-hidden="true"
      />
    </a>
  );
}
