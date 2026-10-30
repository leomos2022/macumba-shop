"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Rombo } from "./rombo";
import { type Producto } from "@/lib/macumba";

type Props = {
  piezas: Producto[];
};

type Slot = {
  /** slug de la pieza en el catálogo (null = pieza nueva, aún sin ficha) */
  slug: string | null;
  /** etiqueta que aparece sobre el reel en este segmento */
  etiqueta: string;
};

/** Orden real del reel: asian-soul → alas-tejidas → black-inspiration → selva-roja → alas-tejidas (cortes secos) */
const DESFILE_SLOTS: Slot[] = [
  { slug: "asian-soul", etiqueta: "Asian Soul" },
  { slug: "alas-tejidas", etiqueta: "Alas Tejidas" },
  { slug: "black-inspiration", etiqueta: "Black Inspiration" },
  { slug: "selva-roja", etiqueta: "Selva Roja" },
  { slug: "alas-tejidas", etiqueta: "Alas Tejidas" },
];

/**
 * Fronteras de segmento en segundos (reel de 10.63 s, 5 escenas).
 * Medidas con signalstats tras eliminar el fundido largo hacia/desde la
 * escena roja: cortes secos en 5.93 (entra Selva Roja) y 8.10 (sale).
 */
const FRONTERAS = [2.0, 4.0, 5.9, 8.1];

const DATOS = [
  { valor: "100%", etiqueta: "Textiles reciclados" },
  { valor: "1/1", etiqueta: "Cada pieza no se repite" },
  { valor: "2", etiqueta: "Artistas, un colectivo" },
];

/**
 * HERO · Reel + Historia
 * El reel de modelos (loop infinito, en silencio) junto a la historia de la
 * marca en un único bloque horizontal. Tocar el reel abre la ficha de la
 * pieza en pantalla; si el segmento es una pieza nueva, lleva a La Sala.
 */
export function HeroReel({ piezas }: Props) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [idx, setIdx] = useState(0);
  const [reproduciendo, setReproduciendo] = useState(true);
  const [reducido, setReducido] = useState(false);

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

  const slot = DESFILE_SLOTS[idx] ?? DESFILE_SLOTS[0];
  const pieza = slot.slug ? (porSlug.get(slot.slug) ?? null) : null;

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
      aria-label="Macumba Shop — moda que viste arte"
      className="relative overflow-hidden bg-crema"
    >
      {/* textura sutil de tejido */}
      <div
        className="textura-tejido pointer-events-none absolute inset-0 opacity-[0.06]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:pb-20 lg:pt-14">
        {/* ── Historia (texto) ── */}
        <div className="order-2 lg:order-1">
          <p className="mb-4 flex items-center gap-2 text-xs font-semibold tracking-marca text-verde">
            <Rombo className="h-3.5 w-3.5 text-morado" />
            MACUMBA SHOP · BOGOTÁ
          </p>

          <h1 className="font-display text-4xl leading-[1.05] text-tinta sm:text-5xl lg:text-6xl">
            Moda que viste arte
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-tinta/75 sm:text-lg">
            Rescatamos textiles que Bogotá descartó y nuestro colectivo los
            transforma a mano —pintura, bordado y crochet— en chaquetas
            únicas que nadie más tendrá. Cada pieza del reel existe de
            verdad: una sola, firmada por el proceso.
          </p>

          {/* Datos de la marca */}
          <dl className="mt-8 grid max-w-xl grid-cols-3 gap-4">
            {DATOS.map((d) => (
              <div
                key={d.etiqueta}
                className="rounded-[10px] border border-border/70 bg-card/70 px-3 py-4 text-center"
              >
                <dt className="sr-only">{d.etiqueta}</dt>
                <dd>
                  <p className="font-display text-2xl text-morado sm:text-3xl">
                    {d.valor}
                  </p>
                  <p className="mt-1 text-[0.7rem] leading-tight text-tinta/70 sm:text-xs">
                    {d.etiqueta}
                  </p>
                </dd>
              </div>
            ))}
          </dl>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="h-12 rounded-full bg-morado px-8 text-base font-semibold hover:bg-morado-hondo"
              asChild
            >
              <a href="/la-sala">Explorar La Sala</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-verde/30 px-8 text-base font-medium text-verde hover:bg-verde hover:text-crema"
              asChild
            >
              <a href="/el-estudio">Personaliza en El Estudio</a>
            </Button>
          </div>
        </div>

        {/* ── Reel de modelos (loop infinito) ── */}
        <div className="relative order-1 lg:order-2">
          <div className="rounded-[10px] relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden border border-border/60 bg-crema-hondo shadow-[0_30px_60px_-30px_rgba(20,40,29,0.45)] lg:max-w-lg">
            {/* El reel entero es clicable: ficha de la pieza, o La Sala si es nueva */}
            <button
              type="button"
              onClick={() =>
                pieza ? onVerFicha(pieza, router) : router.push("/la-sala")
              }
              aria-label={
                pieza
                  ? `Ver la ficha de ${pieza.name}, pieza en el reel`
                  : "Ver más piezas en La Sala"
              }
              className="absolute inset-0 block w-full cursor-pointer focus-visible:outline-2 focus-visible:outline-ring"
            >
              <video
                ref={videoRef}
                poster="/tienda/reel-poster.jpg"
                muted
                loop
                playsInline
                autoPlay={!reducido}
                preload="metadata"
                aria-hidden="true"
                tabIndex={-1}
                className="pointer-events-none h-full w-full object-cover"
                onTimeUpdate={(e) => {
                  const t = e.currentTarget.currentTime;
                  let n = 0;
                  for (const f of FRONTERAS) if (t >= f) n += 1;
                  setIdx(n);
                }}
              >
                <source src="/tienda/reel-modelos.mp4" type="video/mp4" />
              </video>
            </button>

            {/* velo inferior para legibilidad */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-crema/70 to-transparent" />

            {/* etiqueta del modelo en pantalla */}
            <span className="pointer-events-none absolute bottom-4 left-4 max-w-[75%] truncate rounded-full bg-tinta/55 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-crema backdrop-blur-sm">
              {pieza?.name ?? slot.etiqueta}
            </span>

            {/* play / pausa */}
            <button
              type="button"
              onClick={alternar}
              aria-label={
                reproduciendo ? "Pausar el reel" : "Reproducir el reel"
              }
              className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-crema/85 text-tinta shadow transition-colors hover:bg-crema focus-visible:outline-2 focus-visible:outline-ring"
            >
              {reproduciendo ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </button>
          </div>

          <span className="absolute left-4 top-6 rounded-full bg-badge px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-lg sm:left-8">
            Pieza única
          </span>

          <p className="mt-3 text-center text-xs text-tinta/55">
            Toca el reel: abre la ficha de la pieza en pantalla
          </p>
        </div>
      </div>
    </section>
  );
}

/** Navega a la ficha de la pieza vía query (la vista de La Sala la resuelve) */
function onVerFicha(pieza: Producto, router: ReturnType<typeof useRouter>) {
  router.push(`/la-sala?pieza=${encodeURIComponent(pieza.slug)}`);
}
