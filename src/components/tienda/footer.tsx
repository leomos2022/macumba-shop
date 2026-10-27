"use client";

import { Rombo } from "./rombo";
import { IconWhatsApp } from "./header";
import {
  WHATSAPP_NUMERO_VISIBLE,
  urlWhatsApp,
} from "@/lib/macumba";

export function Footer() {
  return (
    <footer className="mt-auto bg-verde-hondo text-crema">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        {/* Marca */}
        <div>
          <p className="flex items-baseline gap-2">
            <span className="font-display text-3xl">Macumba</span>
            <Rombo className="h-3 w-3 self-center text-pistacho" />
            <span className="text-[0.65rem] font-semibold tracking-marca text-pistacho">
              SHOP
            </span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-crema/70">
            Textiles reciclados, arte a mano. Piezas únicas intervenidas por
            artistas bogotanos.
          </p>
        </div>

        {/* Navegación */}
        <nav aria-label="Pie de página" className="md:justify-self-center">
          <p className="text-xs font-semibold tracking-marca text-pistacho">
            EXPLORA
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              ["#inicio", "Inicio"],
              ["#la-sala", "La Sala"],
              ["#el-estudio", "El Estudio"],
              ["#historia", "Historia"],
            ].map(([href, label]) => (
              <li key={href}>
                <a
                  href={href}
                  className="text-crema/80 transition-colors hover:text-pistacho focus-visible:outline-2 focus-visible:outline-ring rounded"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contacto */}
        <div className="md:justify-self-end">
          <p className="text-xs font-semibold tracking-marca text-pistacho">
            CONTACTO
          </p>
          <a
            href={urlWhatsApp("¡Hola, Macumba Shop!")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-pistacho/40 px-4 py-2 text-sm font-medium text-crema transition-colors hover:bg-pistacho hover:text-verde-hondo focus-visible:outline-2 focus-visible:outline-ring"
          >
            <IconWhatsApp className="h-4 w-4" />
            {WHATSAPP_NUMERO_VISIBLE}
          </a>
          <p className="mt-4 text-sm leading-relaxed text-crema/70">
            Bogotá, Colombia
            <br />
            Ferias culturales y por encargo
          </p>
        </div>
      </div>

      <div className="border-t border-crema/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-crema/60 sm:flex-row sm:px-6">
          <p>© 2026 Macumba Shop · Hecho a mano en Bogotá</p>
          <p className="flex items-center gap-2">
            <Rombo className="h-3 w-3 text-pistacho/70" />
            Viste Arte · Pieza única
          </p>
        </div>
      </div>
    </footer>
  );
}
