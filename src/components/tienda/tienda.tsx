"use client";

import { useEffect, useState } from "react";
import { Header } from "./header";
import { HeroSecuencia } from "./hero-secuencia";
import { LaSala } from "./la-sala";
import { DetalleProducto } from "./detalle-producto";
import { CanastaSheet } from "./canasta-sheet";
import { Estudio } from "./estudio";
import { Historia } from "./historia";
import { Footer } from "./footer";
import { BotonWhatsAppFlotante } from "./boton-whatsapp";
import { useCanasta } from "@/stores/canasta";
import type { Producto } from "@/lib/macumba";

export function Tienda({ productos }: { productos: Producto[] }) {
  const [productoDetalle, setProductoDetalle] = useState<Producto | null>(null);
  const [detalleAbierto, setDetalleAbierto] = useState(false);

  // Hidrata la canasta persistida (localStorage) después del montaje
  useEffect(() => {
    useCanasta.persist.rehydrate();
  }, []);

  const destacados = productos.filter((p) => p.isFeatured);

  const verDetalle = (p: Producto) => {
    setProductoDetalle(p);
    setDetalleAbierto(true);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#la-sala"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-morado focus:px-5 focus:py-2 focus:text-primary-foreground"
      >
        Saltar al catálogo
      </a>

      <Header />
      <main className="flex-1">
        <HeroSecuencia piezas={destacados} onVerDetalle={verDetalle} />
        <LaSala productos={productos} onVerDetalle={verDetalle} />
        <Estudio />
        <Historia />
      </main>
      <Footer />

      <DetalleProducto
        producto={productoDetalle}
        abierto={detalleAbierto}
        onCerrar={() => setDetalleAbierto(false)}
      />
      <CanastaSheet />
      <BotonWhatsAppFlotante />
    </div>
  );
}
