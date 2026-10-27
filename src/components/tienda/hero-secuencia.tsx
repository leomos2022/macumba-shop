"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Rombo } from "./rombo";
import { formatoCOP, type Producto } from "@/lib/macumba";

type Props = {
  piezas: Producto[];
  onVerDetalle: (p: Producto) => void;
};

export function HeroSecuencia({ piezas, onVerDetalle }: Props) {
  const [idx, setIdx] = useState(0);
  const [pausado, setPausado] = useState(false);
  const reducido = useRef(false);
  const total = piezas.length;

  useEffect(() => {
    reducido.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  const siguiente = useCallback(
    () => setIdx((i) => (i + 1) % total),
    [total]
  );
  const anterior = useCallback(
    () => setIdx((i) => (i - 1 + total) % total),
    [total]
  );

  useEffect(() => {
    if (pausado || reducido.current || total <= 1) return;
    const t = setInterval(siguiente, 5500);
    return () => clearInterval(t);
  }, [pausado, siguiente, total]);

  if (total === 0) return null;
  const pieza = piezas[idx];

  return (
    <section
      id="inicio"
      aria-label="Piezas destacadas de la serie Selva Viva"
      className="relative overflow-hidden bg-crema"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
    >
      {/* textura sutil de tejido */}
      <div
        className="textura-tejido pointer-events-none absolute inset-0 opacity-[0.06]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pb-24 lg:pt-16">
        {/* ── Panel editorial ── */}
        <div className="order-2 lg:order-1">
          <p className="mb-4 flex items-center gap-2 text-xs font-semibold tracking-marca text-verde">
            <Rombo className="h-3.5 w-3.5 text-morado" />
            MODA QUE VISTE ARTE
          </p>

          <div aria-live="polite" className="min-h-[300px] sm:min-h-[280px]">
            <p className="mb-3 text-sm font-medium tracking-marca text-morado">
              {pieza.serieLabel ?? "COLECCIÓN MACUMBA"}
            </p>
            <h1 className="font-display text-4xl leading-[1.05] text-tinta sm:text-5xl lg:text-6xl">
              {pieza.name}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-tinta/75 sm:text-lg">
              {pieza.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="font-display text-3xl text-morado">
                {formatoCOP(pieza.basePrice)}
              </span>
              <span className="rounded-full bg-badge px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                Pieza única
              </span>
              <span className="rounded-full bg-crema-hondo px-3 py-1 text-xs font-medium text-tinta/70">
                {pieza.technique}
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="h-12 rounded-full bg-morado px-8 text-base font-semibold hover:bg-morado-hondo"
              onClick={() => onVerDetalle(pieza)}
            >
              La quiero
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-verde/30 px-8 text-base font-medium text-verde hover:bg-verde hover:text-crema"
              asChild
            >
              <a href="#la-sala">Ver en La Sala</a>
            </Button>

            {/* Controles de la secuencia */}
            <div className="ml-auto flex items-center gap-3" aria-hidden={false}>
              <button
                type="button"
                onClick={anterior}
                aria-label="Pieza anterior"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/60 text-tinta transition-colors hover:bg-card focus-visible:outline-2 focus-visible:outline-ring"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={siguiente}
                aria-label="Siguiente pieza"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/60 text-tinta transition-colors hover:bg-card focus-visible:outline-2 focus-visible:outline-ring"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Dots */}
          <div
            className="mt-8 flex items-center gap-2"
            role="tablist"
            aria-label="Seleccionar pieza destacada"
          >
            {piezas.map((p, i) => (
              <button
                key={p.slug}
                role="tab"
                aria-selected={i === idx}
                aria-label={`Ver ${p.name}`}
                onClick={() => setIdx(i)}
                className={`h-2.5 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-ring ${
                  i === idx
                    ? "w-8 bg-morado"
                    : "w-2.5 bg-tinta/20 hover:bg-tinta/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ── Secuencia fotográfica ── */}
        <div className="relative order-1 lg:order-2">
          <div className="marco-arco relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden border border-border/60 bg-crema-hondo shadow-[0_30px_60px_-30px_rgba(20,40,29,0.45)] lg:max-w-lg">
            {piezas.map((p, i) => (
              <Image
                key={p.slug}
                src={p.heroImageUrl ?? p.imageUrl}
                alt={`${p.name} — ${p.technique.toLowerCase()} sobre ${p.material.toLowerCase()}, pieza única de Macumba Shop`}
                fill
                priority={i === 0}
                sizes="(max-width: 1024px) 90vw, 40vw"
                className={`object-cover transition-opacity duration-700 ease-out ${
                  i === idx ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            {/* velo inferior para legibilidad del badge */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-crema/70 to-transparent" />
          </div>

          <span className="absolute left-4 top-6 rounded-full bg-badge px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-lg sm:left-8">
            Pieza única
          </span>
        </div>
      </div>
    </section>
  );
}
