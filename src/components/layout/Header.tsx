/**
 * Header fijo superior.
 * ------------------------------------------------------------
 * Documento de contexto: sección 8 (UI/UX) y 3 (navegación móvil).
 *
 * Estructura:
 *   [Logo MACUMBA]                    [☰ menú] [🛒 carrito badge]
 *
 * Mobile-first. En desktop se muestra un menú horizontal simple.
 */

'use client';

import Link from "next/link";
import { useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { useCartStore } from "@/stores/cart-store";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/estudio", label: "El Estudio" },
  { href: "/carrito", label: "Carrito" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const totalItems = useCartStore((s) => s.getTotalItems());
  const openDrawer = useCartStore((s) => s.openDrawer);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
          aria-label="MACUMBA SHOP — Inicio"
        >
          <span className="font-montserrat text-xl font-extrabold tracking-tight text-foreground">
            MACUMBA
          </span>
          <span className="font-poppins text-xs font-medium uppercase tracking-[0.2em] text-primary">
            SHOP
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Navegación principal">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-poppins text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Acciones derecha */}
        <div className="flex items-center gap-2">
          {/* Carrito con badge */}
          <Button
            variant="ghost"
            size="icon"
            onClick={openDrawer}
            className="relative h-10 w-10 rounded-full"
            aria-label={`Abrir carrito (${totalItems} ${totalItems === 1 ? 'artículo' : 'artículos'})`}
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span
                className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-primary-foreground"
                aria-hidden="true"
              >
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Button>

          {/* Menú hamburguesa (mobile) */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-10 w-10 rounded-full"
                aria-label="Abrir menú"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" aria-describedby={undefined} className="w-[280px] bg-background">
              <SheetHeader className="px-6 pt-6">
                <SheetTitle className="font-montserrat text-2xl font-bold">
                  Menú
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Menú de navegación principal
                </SheetDescription>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-2 px-6" aria-label="Navegación móvil">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block rounded-md px-3 py-3 text-base font-medium",
                      "text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto px-6 pb-6 pt-8">
                <p className="text-xs text-muted-foreground">
                  Hecho a mano en Colombia 🇨🇴
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
