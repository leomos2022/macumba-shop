"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Eye } from "lucide-react";
import { SeparadorRombo } from "./rombo";
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

/**
 * EL CATÁLOGO · grid estático con filtros (sección propia, SEO)
 * Todas las piezas de un vistazo: únicas y personalizables.
 */
export function Catalogo({ productos, onVerDetalle }: Props) {
  const [categoria, setCategoria] = useState<FiltroCategoria>("todas");
  const [genero, setGenero] = useState<FiltroGenero>("todos");

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
    <section
      id="catalogo"
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
            Todas las piezas de un vistazo: diez piezas únicas del
            colectivo, pintadas, bordadas y armadas a mano. Pasa el cursor
            sobre una —o tócala— para conocer su historia.
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
    <article className="group relative overflow-hidden rounded-[10px] border border-border/70 bg-card shadow-sm transition-shadow hover:shadow-xl focus-within:shadow-xl">
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
