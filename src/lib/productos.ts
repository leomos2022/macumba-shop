import type { Producto } from "@/lib/macumba";
import { CATALOGO } from "@/lib/catalogo-data";

/**
 * Devuelve el catálogo completo ordenado por sortOrder.
 * Lee de datos estáticos — sin dependencia de base de datos.
 */
export async function getProductos(): Promise<Producto[]> {
  return [...CATALOGO].sort((a, b) => a.sortOrder - b.sortOrder);
}
