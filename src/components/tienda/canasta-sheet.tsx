"use client";

import Image from "next/image";
import { toast } from "sonner";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SeparadorRombo } from "./rombo";
import { IconWhatsApp } from "./header";
import { useCanasta, totalItems, totalPrecio } from "@/stores/canasta";
import { formatoCOP, mensajePedido, urlWhatsApp } from "@/lib/macumba";

export function CanastaSheet() {
  const abierta = useCanasta((s) => s.abierta);
  const setAbierta = useCanasta((s) => s.setAbierta);
  const items = useCanasta((s) => s.items);
  const cambiarCantidad = useCanasta((s) => s.cambiarCantidad);
  const eliminar = useCanasta((s) => s.eliminar);

  const unidades = totalItems(items);
  const total = totalPrecio(items);

  const finalizar = () => {
    window.open(urlWhatsApp(mensajePedido(items, total)), "_blank", "noopener");
    toast("Abrimos WhatsApp con tu pedido listo", {
      description: "Solo presiona enviar: te confirmamos disponibilidad y entrega.",
    });
  };

  return (
    <Sheet open={abierta} onOpenChange={setAbierta}>
      <SheetContent
        side="right"
        className="flex w-full flex-col bg-crema p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-border/70 px-6 py-5 text-left">
          <SheetTitle className="font-display text-3xl text-tinta">
            Tu Canasta
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            {unidades === 0
              ? "Aún no llevas piezas."
              : `${unidades} ${unidades === 1 ? "pieza" : "piezas"} seleccionadas`}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-crema-hondo">
              <ShoppingBag className="h-7 w-7 text-verde" aria-hidden="true" />
            </span>
            <p className="text-sm leading-relaxed text-tinta/70">
              Tu canasta está vacía. En La Sala hay piezas únicas esperando a
              alguien como tú.
            </p>
            <Button
              className="rounded-full bg-morado px-8 font-semibold hover:bg-morado-hondo"
              asChild
            >
              <a href="#la-sala" onClick={() => setAbierta(false)}>
                Explorar La Sala
              </a>
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
              {items.map((i) => (
                <li
                  key={`${i.slug}-${i.talla}`}
                  className="flex gap-4 rounded-xl border border-border/70 bg-card p-3"
                >
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-white">
                    <Image
                      src={i.imagen}
                      alt={i.nombre}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-display text-base leading-tight text-tinta">
                          {i.nombre}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Talla {i.talla}
                          {i.kind === "personalizable" && " · personalizable"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => eliminar(i.slug, i.talla)}
                        aria-label={`Quitar ${i.nombre} talla ${i.talla} de la canasta`}
                        className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-crema-hondo hover:text-destructive focus-visible:outline-2 focus-visible:outline-ring"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-full border border-border">
                        <button
                          type="button"
                          aria-label={`Quitar una unidad de ${i.nombre}`}
                          onClick={() => cambiarCantidad(i.slug, i.talla, -1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-tinta hover:bg-crema-hondo focus-visible:outline-2 focus-visible:outline-ring"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm font-semibold">
                          {i.cantidad}
                        </span>
                        <button
                          type="button"
                          aria-label={`Agregar una unidad de ${i.nombre}`}
                          onClick={() => cambiarCantidad(i.slug, i.talla, 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-tinta hover:bg-crema-hondo focus-visible:outline-2 focus-visible:outline-ring"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="font-semibold text-morado">
                        {formatoCOP(i.precio * i.cantidad)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-border/70 bg-card/60 px-6 py-5">
              <div className="flex items-center justify-between text-sm text-tinta/70">
                <span>Subtotal</span>
                <span>{formatoCOP(total)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-sm text-tinta/70">
                <span>Envío</span>
                <span>Contra entrega, coordinado por WhatsApp</span>
              </div>
              <SeparadorRombo className="my-4" />
              <div className="flex items-baseline justify-between">
                <span className="font-display text-xl text-tinta">Total</span>
                <span className="font-display text-3xl text-morado">
                  {formatoCOP(total)}
                </span>
              </div>
              <Button
                size="lg"
                className="mt-4 h-13 w-full rounded-full bg-morado py-3.5 text-base font-semibold hover:bg-morado-hondo"
                onClick={finalizar}
              >
                <IconWhatsApp className="mr-2 h-5 w-5" />
                Finalizar pedido por WhatsApp
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Sin pagos en línea: te llevamos a WhatsApp con el pedido escrito
                y confirmamos disponibilidad.
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
