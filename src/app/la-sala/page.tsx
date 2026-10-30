import type { Metadata } from "next";
import { getProductos } from "@/lib/productos";
import { VistaSala } from "@/components/tienda/vistas";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "La Sala — piezas únicas | Macumba Shop",
  description:
    "Desliza el desfile de piezas únicas de Macumba: chaquetas y abrigos de denim reciclado pintados y bordados a mano por artistas bogotanos.",
};

export default async function LaSalaPage() {
  const productos = await getProductos();
  return <VistaSala productos={productos} />;
}
