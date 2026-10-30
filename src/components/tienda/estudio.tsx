"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Rombo } from "./rombo";
import { IconWhatsApp } from "./header";
import { formatoCOP, urlWhatsApp } from "@/lib/macumba";

/* ── Datos del configurador (Fase 1: teaser con silueta y color vivos) ── */

const SILUETAS = [
  { id: "cazadora", nombre: "Cazadora", base: 420000 },
  { id: "abrigo", nombre: "Abrigo largo", base: 520000 },
  { id: "gabardina", nombre: "Gabardina", base: 460000 },
] as const;

const COLORES = [
  { id: "rojo", valor: "#b3392e", nombre: "Rojo clásico" },
  { id: "azul", valor: "#34506b", nombre: "Azul profundo" },
  { id: "negro", valor: "#1a1a1a", nombre: "Negro" },
  { id: "verde", valor: "#1e5631", nombre: "Verde selva" },
  { id: "crema", valor: "#e5d9bd", nombre: "Crema" },
] as const;

const COSTO_ARTE = 60000;

export function Estudio() {
  const [silueta, setSilueta] = useState<(typeof SILUETAS)[number]["id"]>(
    "cazadora"
  );
  const [color, setColor] = useState<(typeof COLORES)[number]["id"]>("rojo");

  const siluetaActual = SILUETAS.find((s) => s.id === silueta)!;
  const colorActual = COLORES.find((c) => c.id === color)!;
  const total = siluetaActual.base + COSTO_ARTE;

  const ctaWhatsApp = urlWhatsApp(
    [
      "¡Hola, Macumba Shop! Quiero empezar mi prenda en El Estudio:",
      "",
      `• Silueta: ${siluetaActual.nombre}`,
      `• Color base: ${colorActual.nombre}`,
      `• Técnica: pintado a mano por el colectivo`,
      "",
      "¿Me acompañan con el siguiente paso?",
    ].join("\n")
  );

  return (
    <section
      id="el-estudio"
      aria-labelledby="titulo-estudio"
      className="scroll-mt-16 bg-white"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid items-start gap-10 lg:grid-cols-[600px_1fr] lg:gap-14">
          {/* ── Lienzo ghost mannequin (card cuadrada, radio mínimo) ── */}
          <div className="relative flex h-[540px] items-center justify-center overflow-hidden rounded-[10px] border border-border bg-gradient-to-b from-white to-[#f4efe4] sm:h-[640px] lg:h-[700px]">
            <span className="absolute left-1/2 top-6 -translate-x-1/2 whitespace-nowrap rounded-full bg-verde px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-crema">
              Paso 2 de 4 · Color
            </span>

            <Image
              src="/tienda/ghost-roja.png"
              alt="Cazadora roja flotando como maniquí invisible — así se verá tu prenda mientras la diseñas"
              width={640}
              height={640}
              sizes="(max-width: 1024px) 90vw, 560px"
              className="max-h-[62%] w-auto max-w-[78%] object-contain drop-shadow-[0_34px_30px_rgba(20,40,29,0.16)]"
              priority={false}
            />

            {/* Tu foto real → lienzo */}
            <div className="absolute bottom-5 left-5 flex items-center gap-3">
              <div className="h-20 w-16 overflow-hidden rounded-md border-2 border-white bg-white shadow-[0_8px_22px_rgba(20,40,29,0.22)]">
                <Image
                  src="/tienda/antes-roja.png"
                  alt="Foto original de tu prenda antes de pasar al lienzo flotante"
                  width={64}
                  height={80}
                  priority
                  className="h-full w-full object-cover"
                />
              </div>
              <span aria-hidden="true" className="text-lg text-morado">
                →
              </span>
              <p className="w-32 text-[11px] font-semibold leading-snug text-tinta/60">
                <b className="text-tinta/80">Tu foto real</b> se convierte en el
                lienzo flotante
              </p>
            </div>

            <p className="absolute bottom-5 right-5 hidden text-right text-[11px] font-bold uppercase tracking-[0.18em] text-tinta/40 sm:block">
              ⟲ Arrastra para girar
              <br />
              (muy pronto)
            </p>
          </div>

          {/* ── Panel del configurador ── */}
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-marca text-verde">
              <Rombo className="h-3 w-3 text-morado" />
              MUY PRONTO · EL ESTUDIO, PASO A PASO
            </p>
            <h2
              id="titulo-estudio"
              className="mt-3 font-display text-4xl leading-[1.05] text-tinta sm:text-5xl"
            >
              Tu prenda, <em className="text-verde">tu arte.</em>
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-tinta/70">
              Configuras la pieza viéndola flotar como en maniquí invisible —
              sin cuerpo, sin distracción: solo la prenda y el arte que va a
              vivir en ella.
            </p>

            <div className="mt-8 flex flex-col gap-4">
              {/* Paso 1 · Silueta — LISTA */}
              <PasoCard
                num={1}
                titulo="Silueta"
                estado="lista"
                activo
                contenido={
                  <div className="flex flex-wrap gap-2">
                    {SILUETAS.map((s) => (
                      <Chip
                        key={s.id}
                        activo={silueta === s.id}
                        onClick={() => setSilueta(s.id)}
                      >
                        {s.nombre}
                      </Chip>
                    ))}
                  </div>
                }
              />

              {/* Paso 2 · Color — ELIGIENDO */}
              <PasoCard
                num={2}
                titulo="Color"
                estado="eligiendo"
                activo
                contenido={
                  <div className="flex flex-wrap items-center gap-3">
                    {COLORES.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        aria-pressed={color === c.id}
                        aria-label={`Color ${c.nombre}`}
                        onClick={() => setColor(c.id)}
                        className={`h-9 w-9 rounded-full border transition-all focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 ${
                          color === c.id
                            ? "scale-110 border-morado ring-2 ring-morado ring-offset-2"
                            : "border-tinta/15 hover:scale-105"
                        }`}
                        style={{ backgroundColor: c.valor }}
                      />
                    ))}
                    <span className="ml-1 text-sm text-tinta/60">
                      {colorActual.nombre}
                    </span>
                  </div>
                }
              />

              {/* Paso 3 · Técnica — BLOQUEADA */}
              <PasoCard
                num={3}
                titulo="Técnica"
                estado="bloqueada"
                contenido={
                  <div className="flex flex-wrap gap-2">
                    {["Pintado a mano", "Bordado", "Mixta"].map((t) => (
                      <Chip key={t} activo={false} disabled>
                        {t}
                      </Chip>
                    ))}
                  </div>
                }
              />

              {/* Paso 4 · Arte — BLOQUEADA */}
              <PasoCard
                num={4}
                titulo="Arte"
                estado="bloqueada"
                contenido={
                  <div className="flex flex-wrap gap-2">
                    {["Retrato tropical", "Animal espiritual", "Sube tu propia idea"].map(
                      (a) => (
                        <Chip key={a} activo={false} disabled>
                          {a}
                        </Chip>
                      )
                    )}
                  </div>
                }
              />
            </div>

            {/* Resumen */}
            <div className="mt-7 flex items-end justify-between gap-6 border-t-2 border-tinta pt-5">
              <div className="text-sm leading-relaxed text-tinta/70">
                <p>
                  {siluetaActual.nombre} denim — base{" "}
                  <b className="text-tinta">{formatoCOP(siluetaActual.base)}</b>
                </p>
                <p>
                  Pintado a mano por el colectivo —{" "}
                  <b className="text-tinta">{formatoCOP(COSTO_ARTE)}</b>
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-tinta/50">
                  Tu prenda
                </p>
                <p className="font-display text-3xl font-semibold text-tinta sm:text-4xl">
                  {formatoCOP(total)}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <Button
                size="lg"
                className="h-12 rounded-full bg-morado px-8 text-base font-semibold hover:bg-morado-hondo"
                asChild
              >
                <a href={ctaWhatsApp} target="_blank" rel="noopener noreferrer">
                  Empezar mi prenda
                </a>
              </Button>
              <p className="flex items-center gap-2 text-sm text-tinta/55">
                <IconWhatsApp className="h-4 w-4 text-verde" />
                Te acompañamos por WhatsApp en cada paso del diseño.
              </p>
            </div>
            <p className="mt-2 text-xs text-tinta/45">
              Precios de referencia — por confirmar con el taller.
            </p>
          </div>
        </div>

        {/* Notas al pie */}
        <ol className="mt-14 grid gap-6 border-t border-border pt-8 sm:grid-cols-3">
          <Nota titulo="Sin cuerpo, sin ruido.">
            La prenda flota como en maniquí invisible — el mismo estilo que
            verás en la foto final de tu pieza.
          </Nota>
          <Nota titulo="Un asset, dos usos.">
            El lienzo flotante es también la foto “antes” de tu pieza en La
            Sala: lo que diseñas es lo que ves.
          </Nota>
          <Nota titulo="Arte real, no estampado.">
            Lo que eliges aquí lo pinta a mano el artista — cada brochazo,
            único.
          </Nota>
        </ol>
      </div>
    </section>
  );
}

/* ── Piezas UI del configurador ── */

function PasoCard({
  num,
  titulo,
  estado,
  contenido,
  activo = false,
}: {
  num: number;
  titulo: string;
  estado: "lista" | "eligiendo" | "bloqueada";
  contenido: React.ReactNode;
  activo?: boolean;
}) {
  const etiqueta =
    estado === "lista"
      ? "LISTA"
      : estado === "eligiendo"
        ? "ELIGIENDO"
        : "BLOQUEADA";

  return (
    <div
      className={`rounded-2xl border border-border bg-crema p-5 ${
        estado === "bloqueada" ? "opacity-45" : ""
      }`}
    >
      <div className="mb-3 flex items-center gap-3">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
            activo ? "bg-morado text-white" : "bg-tinta text-crema"
          }`}
          aria-hidden="true"
        >
          {num}
        </span>
        <h3 className="font-display text-xl font-semibold text-tinta">
          {titulo}
        </h3>
        <span
          className={`ml-auto flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] ${
            estado === "bloqueada" ? "text-tinta/50" : "text-verde"
          }`}
        >
          {estado !== "bloqueada" && (
            <span
              className="h-1.5 w-1.5 rounded-full bg-verde"
              aria-hidden="true"
            />
          )}
          {etiqueta}
        </span>
      </div>
      {contenido}
    </div>
  );
}

function Chip({
  activo,
  disabled = false,
  onClick,
  children,
}: {
  activo: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={activo}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring ${
        activo
          ? "border-morado bg-morado text-white"
          : "border-border bg-white text-tinta/80 hover:border-morado/40"
      } ${disabled ? "cursor-not-allowed hover:border-border" : ""}`}
    >
      {children}
    </button>
  );
}

function Nota({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3">
      <Rombo className="mt-1 h-3 w-3 shrink-0 text-verde" />
      <p className="text-sm leading-relaxed text-tinta/70">
        <b className="text-tinta">{titulo}</b> {children}
      </p>
    </li>
  );
}
