"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Rombo } from "./rombo";
import { IconWhatsApp } from "./header";
import { useCanasta } from "@/stores/canasta";
import {
  ETIQUETA_CATEGORIA,
  ETIQUETA_GENERO,
  formatoCOP,
  mensajeConsultaProducto,
  tallasDe,
  urlWhatsApp,
  type Producto,
} from "@/lib/macumba";

type Props = {
  producto: Producto | null;
  abierto: boolean;
  onCerrar: () => void;
};

export function DetalleProducto({ producto, abierto, onCerrar }: Props) {
  const agregar = useCanasta((s) => s.agregar);
  const setAbiertaCanasta = useCanasta((s) => s.setAbierta);
  const [talla, setTalla] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const [prevSlug, setPrevSlug] = useState<string | null>(null);

  // Reinicio derivado cuando cambia el producto (patrón recomendado por React)
  if (producto && producto.slug !== prevSlug) {
    setPrevSlug(producto.slug);
    setTalla(tallasDe(producto.sizes)[0] ?? null);
    setCantidad(1);
  }

  if (!producto) return null;
  const unica = producto.kind === "unica";
  const tallas = tallasDe(producto.sizes);

  const anadir = () => {
    if (!talla) return;
    agregar({
      slug: producto.slug,
      nombre: producto.name,
      talla,
      precio: producto.basePrice,
      cantidad,
      imagen: producto.imageUrl,
      kind: producto.kind,
    });
    toast(`${producto.name} (talla ${talla}) está en tu canasta`, {
      description: "Coordinamos disponibilidad y pago por WhatsApp.",
      action: {
        label: "Ver canasta",
        onClick: () => {
          onCerrar();
          setAbiertaCanasta(true);
        },
      },
    });
  };

  return (
    <Sheet open={abierto} onOpenChange={(o) => !o && onCerrar()}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto bg-crema p-0 sm:max-w-md"
      >
        <div className="relative aspect-[4/5] w-full bg-white">
          <Image
            src={producto.imageUrl}
            alt={`${producto.name} — ${producto.technique.toLowerCase()} sobre ${producto.material.toLowerCase()}`}
            fill
            sizes="(max-width: 640px) 100vw, 28rem"
            className="object-cover"
          />
          <span
            className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow ${
              unica ? "bg-badge" : "bg-verde"
            }`}
          >
            {unica ? "Pieza única" : "Personalizable"}
          </span>
        </div>

        <SheetHeader className="space-y-1 px-6 pt-5 text-left">
          <SheetTitle className="font-display text-3xl text-tinta">
            {producto.name}
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            {ETIQUETA_CATEGORIA[producto.category] ?? producto.category} ·{" "}
            {ETIQUETA_GENERO[producto.gender] ?? producto.gender} ·{" "}
            {producto.material}
          </SheetDescription>
        </SheetHeader>

        <div className="px-6 pb-8">
          <p className="mt-4 text-sm leading-relaxed text-tinta/80">
            {producto.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-crema-hondo px-3 py-1 text-xs font-medium text-tinta/70">
              {producto.technique}
            </span>
            <span className="rounded-full bg-crema-hondo px-3 py-1 text-xs font-medium text-tinta/70">
              Tallas: {tallas.join(" · ")}
            </span>
          </div>

          <div className="mt-6 flex items-baseline gap-2">
            <span className="font-display text-3xl text-morado">
              {formatoCOP(producto.basePrice)}
            </span>
            {unica && (
              <span className="text-xs text-muted-foreground">
                una sola, sin repetición
              </span>
            )}
          </div>

          {unica ? (
            <>
              {/* Tallas */}
              <fieldset className="mt-6">
                <legend className="mb-2 text-sm font-semibold text-tinta">
                  Elige tu talla
                </legend>
                <div className="flex flex-wrap gap-2">
                  {tallas.map((t) => (
                    <button
                      key={t}
                      type="button"
                      aria-pressed={talla === t}
                      onClick={() => setTalla(t)}
                      className={`h-11 min-w-11 rounded-lg border px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring ${
                        talla === t
                          ? "border-morado bg-morado text-primary-foreground"
                          : "border-border bg-card text-tinta hover:border-morado/50"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Cantidad + CTA */}
              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center rounded-full border border-border bg-card">
                  <button
                    type="button"
                    aria-label="Quitar una unidad"
                    onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                    className="flex h-11 w-11 items-center justify-center rounded-full text-tinta hover:bg-crema-hondo focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-semibold" aria-live="polite">
                    {cantidad}
                  </span>
                  <button
                    type="button"
                    aria-label="Agregar una unidad"
                    onClick={() => setCantidad((c) => Math.min(5, c + 1))}
                    className="flex h-11 w-11 items-center justify-center rounded-full text-tinta hover:bg-crema-hondo focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Button
                  size="lg"
                  className="h-12 flex-1 rounded-full bg-morado text-base font-semibold hover:bg-morado-hondo"
                  onClick={anadir}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Añadir a la canasta
                </Button>
              </div>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Pagas contra entrega · confirmamos por WhatsApp
              </p>
            </>
          ) : (
            <>
              {/* Camino El Taller */}
              <div className="mt-6 rounded-xl border border-verde/20 bg-card p-4">
                <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-verde">
                  <Rombo className="h-3.5 w-3.5 text-morado" />
                  Así funcionará El Estudio
                </p>
                <ol className="space-y-2 text-sm text-tinta/80">
                  <li>1 · Eliges tu silueta y color base</li>
                  <li>2 · Definimos la técnica: pintura o bordado</li>
                  <li>3 · El colectivo crea el arte contigo</li>
                  <li>4 · El colectivo la hace realidad</li>
                </ol>
              </div>
              <Button
                size="lg"
                disabled
                className="mt-5 h-12 w-full rounded-full bg-morado/40 text-base font-semibold"
              >
                Pronto en El Estudio
              </Button>
            </>
          )}

          <a
            href={urlWhatsApp(mensajeConsultaProducto(producto.name))}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-verde/30 text-sm font-medium text-verde transition-colors hover:bg-verde hover:text-crema focus-visible:outline-2 focus-visible:outline-ring"
          >
            <IconWhatsApp className="h-4 w-4" />
            Preguntar por WhatsApp
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
