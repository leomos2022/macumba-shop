"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChromeTienda } from "./chrome-tienda";
import { HeroReel } from "./hero-reel";
import { LaSala } from "./la-sala";
import { Estudio } from "./estudio";
import { Catalogo } from "./catalogo";
import { DetalleProducto } from "./detalle-producto";
import type { Producto } from "@/lib/macumba";

/* ── HOME: reel + historia, sin más contenido (módulos en rutas separadas) ── */
export function VistaHome({ productos }: { productos: Producto[] }) {
  return (
    <ChromeTienda>
      <HeroReel piezas={productos} />
    </ChromeTienda>
  );
}

/* ── LA SALA: componente interno que lee ?pieza= del query ── */
function VistaSalaInner({ productos }: { productos: Producto[] }) {
  const params = useSearchParams();
  const slugPedido = params.get("pieza");

  // ?pieza=slug (desde el reel del hero): la ficha nace abierta, sin effects
  const [productoDetalle, setProductoDetalle] = useState<Producto | null>(() =>
    slugPedido
      ? (productos.find((x) => x.slug === slugPedido) ?? null)
      : null
  );
  const [detalleAbierto, setDetalleAbierto] = useState<boolean>(
    () => !!slugPedido && productos.some((x) => x.slug === slugPedido)
  );

  const verDetalle = (p: Producto) => {
    setProductoDetalle(p);
    setDetalleAbierto(true);
  };

  return (
    <>
      <LaSala productos={productos} onVerDetalle={verDetalle} />
      <DetalleProducto
        producto={productoDetalle}
        abierto={detalleAbierto}
        onCerrar={() => setDetalleAbierto(false)}
      />
    </>
  );
}

/* ── LA SALA: wrapper con Suspense propio para que useSearchParams funcione ── */
export function VistaSala({ productos }: { productos: Producto[] }) {
  return (
    <ChromeTienda>
      <Suspense fallback={null}>
        <VistaSalaInner productos={productos} />
      </Suspense>
    </ChromeTienda>
  );
}

/* ── EL ESTUDIO: personalizador ghost mannequin ── */
export function VistaEstudio() {
  return (
    <ChromeTienda>
      <Estudio />
    </ChromeTienda>
  );
}

/* ── EL CATÁLOGO: grid completo con filtros ── */
export function VistaCatalogo({ productos }: { productos: Producto[] }) {
  const [productoDetalle, setProductoDetalle] = useState<Producto | null>(null);
  const [detalleAbierto, setDetalleAbierto] = useState(false);

  const verDetalle = (p: Producto) => {
    setProductoDetalle(p);
    setDetalleAbierto(true);
  };

  return (
    <ChromeTienda>
      <Catalogo productos={productos} onVerDetalle={verDetalle} />
      <DetalleProducto
        producto={productoDetalle}
        abierto={detalleAbierto}
        onCerrar={() => setDetalleAbierto(false)}
      />
    </ChromeTienda>
  );
}
