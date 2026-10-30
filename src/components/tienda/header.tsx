"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, ShoppingBag } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Rombo } from "./rombo";
import { useCanasta, totalItems } from "@/stores/canasta";
import { urlWhatsApp } from "@/lib/macumba";

const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/la-sala", label: "La Sala" },
  { href: "/el-estudio", label: "El Estudio" },
  { href: "/catalogo", label: "El Catálogo" },
];

export function Header() {
  const items = useCanasta((s) => s.items);
  const setAbierta = useCanasta((s) => s.setAbierta);
  const [menuAbierto, setMenuAbierto] = useState(false);

  const enCanasta = totalItems(items);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-crema/90 backdrop-blur supports-[backdrop-filter]:bg-crema/75">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Wordmark */}
        <Link
          href="/"
          className="group flex items-baseline gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-ring"
          aria-label="Macumba Shop — ir al inicio"
        >
          <span className="font-display text-[1.7rem] leading-none text-tinta">
            Macumba
          </span>
          <Rombo className="h-3 w-3 self-center text-morado transition-transform group-hover:rotate-45" />
          <span className="hidden text-[0.65rem] font-semibold tracking-marca text-verde sm:inline">
            SHOP
          </span>
        </Link>

        {/* Navegación escritorio */}
        <nav aria-label="Principal" className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-sm font-medium text-tinta/80 transition-colors hover:text-morado focus-visible:outline-2 focus-visible:outline-ring rounded-md"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Acciones */}
        <div className="flex items-center gap-1.5">
          <a
            href={urlWhatsApp("¡Hola, Macumba Shop! Vengo de la web.")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Escríbenos por WhatsApp"
            className="hidden h-10 items-center gap-2 rounded-full border border-verde/25 px-4 text-sm font-medium text-verde transition-colors hover:bg-verde hover:text-crema focus-visible:outline-2 focus-visible:outline-ring sm:flex"
          >
            <IconWhatsApp className="h-4 w-4" />
            WhatsApp
          </a>

          <button
            type="button"
            onClick={() => setAbierta(true)}
            aria-label={`Abrir tu canasta (${enCanasta} artículos)`}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-tinta transition-colors hover:bg-crema-hondo focus-visible:outline-2 focus-visible:outline-ring"
          >
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            {enCanasta > 0 && (
              <span
                className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-morado px-1 text-[0.65rem] font-bold text-primary-foreground"
                aria-hidden="true"
              >
                {enCanasta}
              </span>
            )}
          </button>

          {/* Menú móvil */}
          <Sheet open={menuAbierto} onOpenChange={setMenuAbierto}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Abrir menú de navegación"
                className="flex h-10 w-10 items-center justify-center rounded-full text-tinta transition-colors hover:bg-crema-hondo focus-visible:outline-2 focus-visible:outline-ring md:hidden"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-crema">
              <SheetHeader className="border-b border-border/70 text-left">
                <SheetTitle className="font-display text-2xl text-tinta">
                  Macumba
                  <span className="ml-1 text-xs font-sans font-semibold tracking-marca text-verde">
                    SHOP
                  </span>
                </SheetTitle>
              </SheetHeader>
              <nav aria-label="Menú móvil" className="flex flex-col gap-1 px-4 pt-4">
                {NAV.map((n) => (
                  <Link
                    key={n.href}
                    href={n.href}
                    onClick={() => setMenuAbierto(false)}
                    className="rounded-lg px-3 py-3 font-display text-xl text-tinta transition-colors hover:bg-crema-hondo"
                  >
                    {n.label}
                  </Link>
                ))}
              </nav>
              <p className="mt-auto px-6 pb-6 text-sm text-muted-foreground">
                Textiles reciclados, arte a mano.
                <br />
                Bogotá, Colombia.
              </p>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function IconWhatsApp({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.074-.149-.668-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}
