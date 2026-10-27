"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { Rombo, SeparadorRombo } from "./rombo";
import {
  ETIQUETA_CATEGORIA,
  ETIQUETA_GENERO,
  formatoCOP,
  tallasDe,
  type Producto,
} from "@/lib/macumba";

type Props = {
  productos: Producto[];
  onVerDetalle: (p: Producto) => void;
};

type FiltroCategoria = "todas" | "chaqueta" | "abrigo" | "otra";
type FiltroGenero = "todos" | "femenino" | "masculino";

/* =====================================================================
   NIVEL 1 · SLIDER CONTINUO — la entrada inmersiva a La Sala
   ===================================================================== */

function SliderContinuo({
  productos,
  onVerDetalle,
}: {
  productos: Producto[];
  onVerDetalle: (p: Producto) => void;
}) {
  const pistaRef = useRef<HTMLDivElement>(null);
  const [activo, setActivo] = useState(0);
  const total = productos.length;

  const irA = useCallback(
    (i: number) => {
      const pista = pistaRef.current;
      if (!pista) return;
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

  // Centra la primera pieza al montar (sin animación)
  useEffect(() => {
    const pista = pistaRef.current;
    if (!pista) return;
    const hijo = pista.children[0] as HTMLElement | undefined;
    if (hijo) {
      pista.scrollLeft =
        hijo.offsetLeft - (pista.clientWidth - hijo.clientWidth) / 2;
    }
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

  const pieza = productos[activo];

  return (
    <div className="relative bg-tinta text-crema">
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
            Desliza y recorre el desfile de piezas únicas. Toca la prenda para
            abrir su ficha — o baja al catálogo completo cuando quieras.
          </p>
        </div>

        {/* Pista del slider */}
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
          className="sin-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-[15vw] pb-2 sm:gap-8 sm:px-[22vw] focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-[-4px] lg:px-[26vw]"
        >
          {productos.map((p, i) => (
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
                className="block w-full focus-visible:outline-2 focus-visible:outline-ring"
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
              </button>
            </article>
          ))}
        </div>

        {/* Ficha flotante de la pieza activa */}
        {pieza && (
          <div className="mx-auto mt-8 w-[86vw] max-w-xl">
            <div
              key={pieza.slug}
              className="cambio-suave flex flex-col items-center gap-4 rounded-2xl border border-crema/15 bg-tinta/60 px-6 py-5 backdrop-blur-sm sm:flex-row sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <div>
                  <p className="flex flex-wrap items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-wide">
                    <span className="rounded-full bg-badge px-2.5 py-1 text-white">
                      Pieza única
                    </span>
                    <span className="text-pistacho">{pieza.serieLabel}</span>
                  </p>
                  <h3 className="mt-1.5 font-display text-2xl text-crema">
                    {pieza.name}
                  </h3>
                  <p className="text-sm text-crema/65">
                    {ETIQUETA_GENERO[pieza.gender] ?? pieza.gender} ·{" "}
                    {pieza.material}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="whitespace-nowrap font-display text-2xl text-morado-clara">
                  {formatoCOP(pieza.basePrice)}
                </p>
                <button
                  type="button"
                  onClick={() => onVerDetalle(pieza)}
                  className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full bg-morado px-6 text-sm font-semibold text-white transition-colors hover:bg-morado-hondo focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <Eye className="h-4 w-4" aria-hidden="true" />
                  Ver la ficha
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Controles: flechas + progreso */}
        <div className="mt-6 flex items-center justify-center gap-5">
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
            {productos.map((p, i) => (
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

        {/* Salida al catálogo estático */}
        <div className="mt-8 text-center">
          <a
            href="#la-sala-catalogo"
            className="inline-flex items-center gap-2 text-sm font-medium text-crema/70 transition-colors hover:text-pistacho focus-visible:outline-2 focus-visible:outline-ring"
          >
            ¿Prefieres compararlas todas? Baja al catálogo completo
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   NIVEL 3 · CATÁLOGO ESTÁTICO — el grid con filtros (SEO)
   ===================================================================== */

export function LaSala({ productos, onVerDetalle }: Props) {
  const [categoria, setCategoria] = useState<FiltroCategoria>("todas");
  const [genero, setGenero] = useState<FiltroGenero>("todos");

  const unicas = useMemo(
    () =>
      productos
        .filter((p) => p.kind === "unica")
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [productos]
  );

  const categoriasDisponibles = useMemo(() => {
    const set = new Set(productos.map((p) => p.category));
    return ["todas", ...Array.from(set)] as FiltroCategoria[];
  }, [productos]);

  const filtrados = useMemo(
    () =>
      productos
        .filter((p) => (categoria === "todas" ? true : p.category === categoria))
        .filter((p) =>
          genero === "todos"
            ? true
            : genero === "femenino"
              ? p.gender === "femenino" || p.gender === "unisex"
              : p.gender === "masculino" || p.gender === "unisex"
        )
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [productos, categoria, genero]
  );

  return (
    <>
      <section
        id="la-sala"
        aria-labelledby="titulo-la-sala"
        className="scroll-mt-16"
      >
        <h2 id="titulo-la-sala" className="sr-only">
          La Sala — piezas únicas de Macumba
        </h2>
        <SliderContinuo productos={unicas} onVerDetalle={onVerDetalle} />
      </section>

      <section
        id="la-sala-catalogo"
        aria-labelledby="titulo-catalogo"
        className="scroll-mt-16 bg-white"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="text-center">
            <p className="text-xs font-semibold tracking-marca text-verde">
              EL CATÁLOGO
            </p>
            <h2
              id="titulo-catalogo"
              className="mt-3 font-display text-4xl text-tinta sm:text-5xl"
            >
              El catálogo completo
            </h2>
            <SeparadorRombo className="mt-5" />
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-tinta/70">
              Todas las piezas de un vistazo: únicas del colectivo y siluetas
              listas para personalizarse. Pasa el cursor sobre una —o tócala—
              para conocer su historia.
            </p>
          </div>

          {/* Filtros */}
          <div className="mt-10 flex flex-col items-center justify-between gap-4 lg:flex-row">
            <div
              className="flex flex-wrap justify-center gap-2"
              role="group"
              aria-label="Filtrar por categoría"
            >
              {categoriasDisponibles.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={categoria === c}
                  onClick={() => setCategoria(c)}
                  className={`rounded-full border px-5 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring ${
                    categoria === c
                      ? "border-morado bg-morado text-primary-foreground"
                      : "border-border bg-card text-tinta/75 hover:border-morado/40 hover:text-morado"
                  }`}
                >
                  {c === "todas" ? "Todas" : ETIQUETA_CATEGORIA[c] ?? c}
                </button>
              ))}
            </div>

            <div
              className="flex flex-wrap justify-center gap-2"
              role="group"
              aria-label="Filtrar por género"
            >
              {(
                [
                  ["todos", "Todos"],
                  ["femenino", "Femenino"],
                  ["masculino", "Masculino"],
                ] as [FiltroGenero, string][]
              ).map(([valor, etiqueta]) => (
                <button
                  key={valor}
                  type="button"
                  aria-pressed={genero === valor}
                  onClick={() => setGenero(valor)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring ${
                    genero === valor
                      ? "bg-verde text-secondary-foreground"
                      : "bg-crema-hondo text-tinta/70 hover:bg-crema-hondo/70"
                  }`}
                >
                  {etiqueta}
                </button>
              ))}
            </div>
          </div>

          {/* Grid denso */}
          {filtrados.length === 0 ? (
            <p className="mt-16 text-center text-muted-foreground">
              No hay piezas con estos filtros todavía. Prueba otra combinación.
            </p>
          ) : (
            <ul className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
              {filtrados.map((p) => (
                <li key={p.slug}>
                  <TarjetaProducto producto={p} onVerDetalle={onVerDetalle} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}

function TarjetaProducto({
  producto: p,
  onVerDetalle,
}: {
  producto: Producto;
  onVerDetalle: (p: Producto) => void;
}) {
  const unica = p.kind === "unica";
  const tallas = tallasDe(p.sizes);

  return (
    <article className="group relative overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm transition-shadow hover:shadow-xl focus-within:shadow-xl">
      <button
        type="button"
        onClick={() => onVerDetalle(p)}
        aria-label={`Ver ${p.name}, ${ETIQUETA_CATEGORIA[p.category] ?? p.category} ${p.gender === "unisex" ? "unisex" : ""}, ${formatoCOP(p.basePrice)}`}
        className="block w-full text-left focus-visible:outline-2 focus-visible:outline-ring"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-white">
          <Image
            src={p.imageUrl}
            alt={`${p.name} — ${p.technique.toLowerCase()} sobre ${p.material.toLowerCase()}`}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <span
            className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-white shadow ${
              unica ? "bg-badge" : "bg-verde"
            }`}
          >
            {unica ? "Pieza única" : "Personalizable"}
          </span>

          {/* Overlay con info al hover / foco */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-white via-white/95 to-white/60 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
            <p className="text-xs font-medium text-verde">
              {p.technique} · {p.material}
            </p>
            <p className="mt-1 text-xs text-tinta/60">
              Tallas: {tallas.join(" · ")}
            </p>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-morado px-4 py-1.5 text-xs font-semibold text-primary-foreground">
              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
              Ver esta pieza
            </span>
          </div>
        </div>

        <div className="flex items-start justify-between gap-2 p-4">
          <div>
            <h3 className="font-display text-lg leading-tight text-tinta">
              {p.name}
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {ETIQUETA_GENERO[p.gender] ?? p.gender}
            </p>
          </div>
          <p className="sm:whitespace-nowrap font-semibold text-morado">
            {unica ? formatoCOP(p.basePrice) : `Desde ${formatoCOP(p.basePrice)}`}
          </p>
        </div>
      </button>
    </article>
  );
}
