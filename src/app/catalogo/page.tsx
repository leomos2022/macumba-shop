import type { Metadata } from "next";
import { getProductos } from "@/lib/productos";
import { VistaCatalogo } from "@/components/tienda/vistas";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "El Catálogo completo | Macumba Shop",
  description:
    "Las seis prendas de Macumba Shop de un vistazo: chaquetas torero, cazadoras y abrigos pintados y tejidos a mano, hechas a pedido. Filtros por categoría y género. Pago contra entrega en Bogotá.",
};

export default async function CatalogoPage() {
  const productos = await getProductos();
  return <VistaCatalogo productos={productos} />;
}
