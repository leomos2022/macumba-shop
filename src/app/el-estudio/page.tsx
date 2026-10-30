import type { Metadata } from "next";
import { VistaEstudio } from "@/components/tienda/vistas";

export const metadata: Metadata = {
  title: "El Estudio — personaliza tu prenda | Macumba Shop",
  description:
    "Elige la silueta, el color y la técnica —pintura a mano o bordado— y Robert y Arley intervienen tu prenda. Denim reciclado, arte único.",
};

export default function ElEstudioPage() {
  return <VistaEstudio />;
}
