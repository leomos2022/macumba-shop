import { getProductos } from "@/lib/productos";
import { VistaHome } from "@/components/tienda/vistas";

export const dynamic = "force-dynamic";

export default async function Home() {
  const productos = await getProductos();
  return <VistaHome productos={productos} />;
}
