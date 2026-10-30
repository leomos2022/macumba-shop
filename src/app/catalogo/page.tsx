import type { Metadata } from "next";
import { getProductos } from "@/lib/productos";
import { VistaCatalogo } from "@/components/tienda/vistas";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "El Catálogo completo | Macumba Shop",
  description:
    "Todas las piezas de Macumba Shop de un vistazo: únicas del colectivo y siluetas personalizables. Filtros por categoría y género. Pago contra entrega en Bogotá.",
};

export default async function CatalogoPage() {
  const productos = await getProductos();
  return <VistaCatalogo productos={productos} />;
}
