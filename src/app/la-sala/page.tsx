import { Suspense } from "react";
import type { Metadata } from "next";
import { getProductos } from "@/lib/productos";
import { VistaSala } from "@/components/tienda/vistas";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "La Sala — prendas hechas a pedido | Macumba Shop",
  description:
    "Desliza el desfile de prendas de Macumba: chaquetas, cazadoras y abrigos de denim reciclado pintados y tejidos a mano por artistas bogotanos, hechas a pedido.",
};

export default async function LaSalaPage() {
  const productos = await getProductos();
  return (
    <Suspense fallback={null}>
      <VistaSala productos={productos} />
    </Suspense>
  );
}
