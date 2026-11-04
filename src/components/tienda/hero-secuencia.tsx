"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Rombo } from "./rombo";
import { formatoCOP, type Producto } from "@/lib/macumba";

type Props = {
  piezas: Producto[];
  onVerDetalle: (p: Producto) => void;
};

/** Orden real del desfile: pasarela 01 → 04 → 03 → 05 → 02 → 06 (cada segmento ≈ 2,1 s) */
const DESFILE_SLUGS = [
  "selva-roja",
  "asian-soul",
  "black-inspiration",
  "alma-dorada",
  "selva-roja", // segmento 5: la espalda de la Roja
  "espiritu-leon",
] as const;

/** Fronteras de segmento en segundos (fade centrado en 2,1·n + 0,2) */
const FRONTERAS = [2.3, 4.4, 6.5, 8.6, 10.7];

const ETIQUETA_ESPALDA = "Selva Roja · el arte por detrás";

export function HeroSecuencia({ piezas, onVerDetalle }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [idx, setIdx] = useState(0);
  const [reproduciendo, setReproduciendo] = useState(true);
  const [reducido, setReducido] = useState(false);
  const total = DESFILE_SLUGS.length;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const aplicar = () => {
      setReducido(mq.matches);
      if (mq.matches) {
        videoRef.current?.pause();
        setReproduciendo(false);
      } else {
        // Reintento explícito: el atributo autoplay a veces no dispara en el cliente
        videoRef.current?.play().catch(() => setReproduciendo(false));
      }
    };
    const raf = requestAnimationFrame(aplicar);
    return () => cancelAnimationFrame(raf);
  }, []);

  const porSlug = useMemo(() => {
    const mapa = new Map<string, Producto>();
    piezas.forEach((p) => mapa.set(p.slug, p));
    return mapa;
  }, [piezas]);

  /** Pieza visible según el segmento del video (null si el catálogo aún no carga) */
  const pieza = piezaActual(idx, porSlug, piezas);

  const irA = useCallback(
    (i: number) => {
      const nuevo = (i + total) % total;
      setIdx(nuevo);
      const v = videoRef.current;
      if (v) {
        v.currentTime = Math.min(nuevo * 2.1, (v.duration || 13) - 0.05);
        if (v.paused) {
          v.play().catch(() => undefined);
          setReproduciendo(true);
        }
      }
    },
    [total]
  );

  const alternar = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => undefined);
      setReproduciendo(true);
    } else {
      v.pause();
      setReproduciendo(false);
    }
  }, []);

  return (
    <section
      id="inicio"
      aria-label="Desfile de las piezas destacadas de Macumba"
      className="relative overflow-hidden bg-crema"
    >
      {/* textura sutil de tejido */}
      <div
        className="textura-tejido pointer-events-none absolute inset-0 opacity-[0.06]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pb-24 lg:pt-16">
        {/* ── Panel editorial (sincronizado con el desfile) ── */}
        <div className="order-2 lg:order-1">
          <p className="mb-4 flex items-center gap-2 text-xs font-semibold tracking-marca text-verde">
            <Rombo className="h-3.5 w-3.5 text-morado" />
            MODA QUE VISTE ARTE
          </p>

          <div aria-live="polite" className="min-h-[300px] sm:min-h-[280px]">
            <div key={idx} className="cambio-suave">
              <p className="mb-3 text-sm font-medium tracking-marca text-morado">
                {pieza?.serieLabel ?? "COLECCIÓN MACUMBA"}
              </p>
              <h1 className="font-display text-4xl leading-[1.05] text-tinta sm:text-5xl lg:text-6xl">
                {idx === 4 ? ETIQUETA_ESPALDA : (pieza?.name ?? "Macumba")}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-tinta/75 sm:text-lg">
                {pieza?.description ??
                  "Denim pintado a mano por los artistas Robert y Arley. Piezas únicas, textiles reciclados, arte que se viste."}
              </p>

              {pieza && (
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
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="h-12 rounded-full bg-morado px-8 text-base font-semibold hover:bg-morado-hondo"
              disabled={!pieza}
              onClick={() => pieza && onVerDetalle(pieza)}
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

            {/* Controles del desfile */}
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={alternar}
                aria-label={
                  reproduciendo ? "Pausar el desfile" : "Reproducir el desfile"
                }
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/60 text-tinta transition-colors hover:bg-card focus-visible:outline-2 focus-visible:outline-ring"
              >
                {reproduciendo ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </button>
              <button
                type="button"
                onClick={() => irA(idx - 1)}
                aria-label="Modelo anterior"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/60 text-tinta transition-colors hover:bg-card focus-visible:outline-2 focus-visible:outline-ring"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => irA(idx + 1)}
                aria-label="Modelo siguiente"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/60 text-tinta transition-colors hover:bg-card focus-visible:outline-2 focus-visible:outline-ring"
              >
                ›
              </button>
            </div>
          </div>

          {/* Progreso del desfile (6 segmentos) */}
          <div
            className="mt-8 flex items-center gap-2"
            role="tablist"
            aria-label="Ir a un modelo del desfile"
          >
            {DESFILE_SLUGS.map((slug, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === idx}
                aria-label={`Modelo ${i + 1}: ${
                  i === 4 ? ETIQUETA_ESPALDA : (porSlug.get(slug)?.name ?? slug)
                }`}
                onClick={() => irA(i)}
                className={`h-2.5 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-ring ${
                  i === idx
                    ? "w-8 bg-morado"
                    : "w-2.5 bg-tinta/20 hover:bg-tinta/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ── Video desfile (Ken Burns sobre la pasarela real) ── */}
        <div className="relative order-1 lg:order-2">
          <div className="rounded-[10px] relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden border border-border/60 bg-crema-hondo shadow-[0_30px_60px_-30px_rgba(20,40,29,0.45)] lg:max-w-lg">
            <video
              ref={videoRef}
              poster="/tienda/pasarela-01.png"
              muted
              loop
              playsInline
              autoPlay={!reducido}
              preload="metadata"
              aria-label="Desfile animado de las piezas únicas de Macumba"
              className="h-full w-full object-cover"
              onTimeUpdate={(e) => {
                const t = e.currentTarget.currentTime;
                let n = 0;
                for (const f of FRONTERAS) if (t >= f) n += 1;
                setIdx(n);
              }}
            >
              <source src="/tienda/desfile-completo.mp4" type="video/mp4" />
            </video>
            {/* velo inferior para legibilidad */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-crema/70 to-transparent" />
            {/* etiqueta del modelo en pantalla */}
            <span className="pointer-events-none absolute bottom-4 left-4 max-w-[80%] truncate rounded-full bg-tinta/55 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-crema backdrop-blur-sm">
              {idx === 4
                ? ETIQUETA_ESPALDA
                : (pieza?.name ?? "Desfile Macumba")}
            </span>
          </div>

          <span className="absolute left-4 top-6 rounded-full bg-badge px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-lg sm:left-8">
            Pieza única
          </span>
        </div>
      </div>
    </section>
  );
}

/** Resuelve la pieza del segmento actual (si el catálogo ya cargó) */
function piezaActual(
  idx: number,
  porSlug: Map<string, Producto>,
  piezas: Producto[]
): Producto | null {
  if (piezas.length === 0) return null;
  return porSlug.get(DESFILE_SLUGS[idx]) ?? piezas[0];
}
