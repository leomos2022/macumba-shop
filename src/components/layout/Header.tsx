'use client';

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { Menu, ShoppingBag } from "lucide-react";
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

function useCartItemCount(): number {
  return useSyncExternalStore(
    (callback) => useCartStore.subscribe(callback).unsubscribe,
    () => useCartStore.getState().getTotalItems(),
    () => 0
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const totalItems = useCartItemCount();
  const openDrawer = useCartStore((s) => s.openDrawer);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-background/70 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="group flex items-center gap-2 transition-opacity hover:opacity-90" aria-label="MÄCUMBA — Inicio">
          <span className="font-syne text-2xl font-extrabold tracking-tight text-foreground">MÄCUMBÄ</span>
          <span className="font-outfit text-[10px] font-semibold uppercase tracking-[0.3em] text-highlight">ART-MAGIA</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8" aria-label="Navegación principal">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}
              className="relative font-outfit text-sm font-medium text-muted-foreground transition-colors hover:text-foreground after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={openDrawer}
            className="relative h-10 w-10 rounded-full transition-colors hover:bg-white/5"
            aria-label={`Abrir carrito (${totalItems} ${totalItems === 1 ? 'artículo' : 'artículos'})`}>
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground shadow-[0_0_12px_oklch(0.55_0.20_25_/_0.6)]">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden h-10 w-10 rounded-full" aria-label="Abrir menú">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" aria-describedby={undefined} className="w-[280px] border-l border-white/[0.06] bg-background/95 backdrop-blur-xl">
              <SheetHeader className="px-6 pt-6">
                <SheetTitle className="font-syne text-2xl font-extrabold">Menú</SheetTitle>
                <SheetDescription className="sr-only">Menú de navegación principal</SheetDescription>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-1 px-6" aria-label="Navegación móvil">
                {NAV_LINKS.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                    className={cn("block rounded-lg px-4 py-3 text-base font-medium", "text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all")}>
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto px-6 pb-6 pt-8">
                <p className="text-xs text-muted-foreground">Hecho a mano en Colombia 🇨🇴</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-highlight/80">ART-MAGIA</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
