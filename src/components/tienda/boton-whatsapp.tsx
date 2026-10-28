"use client";

import { IconWhatsApp } from "./header";
import { urlWhatsApp } from "@/lib/macumba";

export function BotonWhatsAppFlotante() {
  return (
    <a
      href={urlWhatsApp("¡Hola, Macumba Shop! Vengo de la web y quiero saber más.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chatear con Macumba Shop por WhatsApp"
      className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-verde text-crema shadow-xl transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-morado"
    >
      <IconWhatsApp className="h-7 w-7" />
    </a>
  );
}
