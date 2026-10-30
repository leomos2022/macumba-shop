"use client";

import { useEffect, type ReactNode } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { CanastaSheet } from "./canasta-sheet";
import { BotonWhatsAppFlotante } from "./boton-whatsapp";
import { useCanasta } from "@/stores/canasta";

/**
 * Chrome compartido de todas las páginas de la tienda:
 * Header sticky + contenido + Footer + canasta + botón flotante de WhatsApp.
 */
export function ChromeTienda({ children }: { children: ReactNode }) {
  // Hidrata la canasta persistida (localStorage) después del montaje
  useEffect(() => {
    useCanasta.persist.rehydrate();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="/la-sala"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-morado focus:px-5 focus:py-2 focus:text-primary-foreground"
      >
        Saltar a La Sala
      </a>

      <Header />
      <main className="flex-1">{children}</main>
      <Footer />

      <CanastaSheet />
      <BotonWhatsAppFlotante />
    </div>
  );
}
