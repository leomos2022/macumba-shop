"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { Rombo } from "./rombo";
import { ETIQUETA_GENERO, formatoCOP, type Producto } from "@/lib/macumba";

type Props = {
  productos: Producto[];
  onVerDetalle: (p: Producto) => void;
};

/**
 * LA SALA · verde tinta + textura de tejido
 * El "slide right": carrusel horizontal que desfila las prendas del catálogo.
 * Toca una pieza activa y abre su ficha completa; al pie, salida directa
 * al catálogo completo.
 */
export function LaSala({ productos, onVerDetalle }: Props) {
  const pistaRef = useRef<HTMLDivElement>(null);
  const [activo, setActivo] = useState(0);

  const unicas = productos
    .filter((p) => p.kind === "unica")
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const total = unicas.length;

  const irA = useCallback(
    (i: number) => {
      const pista = pistaRef.current;
      if (!pista || total === 0) return;
      const destino = ((i % total) + total) % total;
      const hijo = pista.children[destino] as HTMLElement | undefined;
      hijo?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    },
    [total]
  );

  // Centra la primera pieza al montar.
  // Doble rAF: garantiza que el navegador completó el layout antes de leer
  // offsetLeft (crítico en móvil donde SSR/hidratación difiere del layout real).
  useEffect(() => {
    const centrar = () => {
      const pista = pistaRef.current;
      if (!pista) return;
      const hijo = pista.children[0] as HTMLElement | undefined;
      if (hijo && hijo.offsetLeft !== undefined) {
        pista.scrollLeft =
          hijo.offsetLeft - (pista.clientWidth - hijo.clientWidth) / 2;
      }
    };
    const id = requestAnimationFrame(() => requestAnimationFrame(centrar));
    return () => cancelAnimationFrame(id);
  }, []);

  const enScroll = useCallback(() => {
    const pista = pistaRef.current;
    if (!pista) return;
    const centro = pista.scrollLeft + pista.clientWidth / 2;
    let mejor = 0;
    let mejorDist = Number.POSITIVE_INFINITY;
    Array.from(pista.children).forEach((hijo, i) => {
      const el = hijo as HTMLElement;
      const c = el.offsetLeft + el.clientWidth / 2;
      const d = Math.abs(c - centro);
      if (d < mejorDist) {
        mejorDist = d;
        mejor = i;
      }
    });
    setActivo(mejor);
  }, []);

  return (
    <div
      id="la-sala"
      className="relative scroll-mt-16 bg-tinta text-crema"
    >
      <div
        className="textura-tejido pointer-events-none absolute inset-0 opacity-[0.08] invert"
        aria-hidden="true"
      />

      <div className="relative py-14 lg:py-20">
        {/* Encabezado */}
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-crema/25 px-4 py-1.5 text-xs font-semibold tracking-marca text-pistacho">
            <Rombo className="h-3 w-3 text-morado-clara" />
            LA SALA
          </p>
          <h2 className="mt-4 font-display text-4xl text-crema sm:text-5xl">
            Pieza a pieza, como en el taller
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-crema/70">
            Desliza hacia la derecha y recorre el desfile de piezas únicas.
            Toca la prenda para abrir su ficha completa.
          </p>
        </div>

        {/* Pista del slider (slide right) */}
        <div
          ref={pistaRef}
          onScroll={enScroll}
          tabIndex={0}
          role="region"
          aria-roledescription="carrusel"
          aria-label="Piezas únicas de La Sala — desliza o usa las flechas"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") {
              e.preventDefault();
              irA(activo + 1);
            }
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              irA(activo - 1);
            }
          }}
          className="sin-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-[15vw] pb-2 sm:gap-8 sm:px-[20vw] focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-[-4px] lg:px-[24vw]"
        >
          {unicas.map((p, i) => (
            <article
              key={p.slug}
              aria-hidden={i !== activo}
              className={`rounded-[10px] relative shrink-0 snap-center overflow-hidden border border-crema/20 bg-crema-hondo transition-all duration-500 ease-out w-[64vw] max-w-[300px] sm:w-[340px] lg:w-[380px] ${
                i === activo
                  ? "opacity-100 shadow-[0_40px_90px_rgba(0,0,0,0.55)]"
                  : "cursor-pointer opacity-40 hover:opacity-60"
              }`}
            >
              <button
                type="button"
                onClick={() => (i === activo ? onVerDetalle(p) : irA(i))}
                aria-label={
                  i === activo
                    ? `Ver la ficha de ${p.name}`
                    : `Ir a ${p.name}`
                }
                tabIndex={i === activo ? 0 : -1}
                className="block w-full text-left focus-visible:outline-2 focus-visible:outline-ring"
              >
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src={p.imageUrl}
                    alt={`${p.name} — ${p.technique.toLowerCase()} sobre ${p.material.toLowerCase()}, pieza única`}
                    fill
                    sizes="(max-width: 640px) 64vw, 380px"
                    className="object-cover"
                  />
                </div>

                {/* Ficha corta de la pieza (bajo el arte, sin tocarlo) */}
                <div className="border-t border-crema/15 bg-tinta px-4 py-3.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="truncate font-display text-xl text-crema">
                      {p.name}
                    </h3>
                    <p className="whitespace-nowrap font-display text-lg text-morado-clara">
                      {formatoCOP(p.basePrice)}
                    </p>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-crema/60">
                    {ETIQUETA_GENERO[p.gender] ?? p.gender} · {p.material}
                  </p>
                  {/* Reserva de altura del pill: todas las tarjetas miden igual */}
                  <div className="mt-2.5 flex h-9 items-center">
                    {i === activo && (
                      <span className="cambio-suave inline-flex items-center gap-1.5 rounded-full bg-morado px-4 py-1.5 text-xs font-semibold text-white">
                        <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                        Ver la ficha
                      </span>
                    )}
                  </div>
                </div>
              </button>
            </article>
          ))}
        </div>

        {/* Controles: flechas + progreso */}
        <div className="mt-8 flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={() => irA(activo - 1)}
            aria-label="Pieza anterior"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-crema/30 text-crema transition-colors hover:bg-crema/10 focus-visible:outline-2 focus-visible:outline-ring"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div
            className="flex items-center gap-1.5"
            role="tablist"
            aria-label="Ir a una pieza"
          >
            {unicas.map((p, i) => (
              <button
                key={p.slug}
                role="tab"
                aria-selected={i === activo}
                aria-label={`Ir a ${p.name}`}
                onClick={() => irA(i)}
                className={`h-1.5 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-ring ${
                  i === activo
                    ? "w-7 bg-pistacho"
                    : "w-3 bg-crema/25 hover:bg-crema/50"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => irA(activo + 1)}
            aria-label="Pieza siguiente"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-crema/30 text-crema transition-colors hover:bg-crema/10 focus-visible:outline-2 focus-visible:outline-ring"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Salida directa al catálogo completo */}
        <div className="mt-10 text-center">
          <a
            href="/catalogo"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-morado px-8 text-base font-semibold text-white transition-colors hover:bg-morado-hondo focus-visible:outline-2 focus-visible:outline-ring"
          >
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
            Ver el catálogo completo
          </a>
          <p className="mt-3 text-xs text-crema/55">
            Filtros por categoría y género · Pago contra entrega en Bogotá
          </p>
        </div>
      </div>
    </div>
  );
}
