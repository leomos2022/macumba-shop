/**
 * Footer.
 * ------------------------------------------------------------
 * Sticky al fondo del viewport (regla de layout del skill).
 * Estilo minimal, solo info esencial: marca, valores, contacto.
 */

import Link from "next/link";
import { Instagram, Mail, Palette } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Columna 1 — Marca */}
          <div className="space-y-3">
            <div>
              <span className="font-montserrat text-lg font-extrabold">MACUMBA</span>
              <span className="ml-2 font-poppins text-[10px] font-medium uppercase tracking-[0.2em] text-primary">
                SHOP
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Ropa artesanal pintada a mano con pinturas textiles de alta durabilidad.
              Cada prenda es única e irrepetible.
            </p>
          </div>

          {/* Columna 2 — Valores */}
          <div className="space-y-3">
            <h3 className="font-montserrat text-sm font-semibold uppercase tracking-wider text-foreground">
              Nuestros valores
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-primary" aria-hidden />
                Hecho a mano
              </li>
              <li className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-primary" aria-hidden />
                Materiales reciclados
              </li>
              <li className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-primary" aria-hidden />
                Piezas únicas
              </li>
            </ul>
          </div>

          {/* Columna 3 — Contacto */}
          <div className="space-y-3">
            <h3 className="font-montserrat text-sm font-semibold uppercase tracking-wider text-foreground">
              Conecta
            </h3>
            <div className="flex flex-col gap-2 text-sm">
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4" aria-hidden />
                WhatsApp
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Instagram className="h-4 w-4" aria-hidden />
                @macumbashop
              </a>
            </div>
          </div>
        </div>

        {/* Línea inferior */}
        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {year} MACUMBA SHOP. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Hecho con
            <span className="text-primary" aria-hidden>♥</span>
            en Colombia 🇨🇴
          </p>
        </div>
      </div>
    </footer>
  );
}
