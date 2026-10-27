"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SeparadorRombo, Rombo } from "./rombo";
import { IconWhatsApp } from "./header";
import { urlWhatsApp } from "@/lib/macumba";

const PASOS = [
  {
    n: "01",
    titulo: "Elige tu silueta",
    texto: "Cazadora, chaqueta corta, abrigo u oversize.",
    img: "/tienda/sil-cazadora.png",
  },
  {
    n: "02",
    titulo: "Escoge el color",
    texto: "Cada silueta tiene su propia paleta de textiles.",
    img: "/tienda/sil-corta.png",
  },
  {
    n: "03",
    titulo: "Define la técnica",
    texto: "Pintura textil, bordado o una mezcla de ambas.",
    img: "/tienda/sil-abrigo.png",
  },
  {
    n: "04",
    titulo: "El arte lo pone el colectivo",
    texto: "Robert y Arley crean y plasman tu diseño.",
    img: "/tienda/sil-hombre.png",
  },
];

export function TallerTeaser() {
  return (
    <section
      id="el-taller"
      aria-labelledby="titulo-taller"
      className="relative overflow-hidden bg-crema-hondo"
    >
      <div
        className="textura-tejido pointer-events-none absolute inset-0 opacity-[0.07]"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="text-center">
          <p className="text-xs font-semibold tracking-marca text-verde">
            MUY PRONTO
          </p>
          <h2
            id="titulo-taller"
            className="mt-3 font-display text-4xl text-tinta sm:text-5xl"
          >
            El Taller
          </h2>
          <SeparadorRombo className="mt-5" />
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-tinta/70">
            Diseña tu propia pieza en cuatro pasos: nosotros ponemos el textil
            reciclado, las técnicas y las manos. Pronto podrás construir tu
            prenda desde la web.
          </p>
        </div>

        <ol className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PASOS.map((paso) => (
            <li
              key={paso.n}
              className="group rounded-2xl border border-border/70 bg-card p-5 text-center shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="relative mx-auto aspect-square w-28 overflow-hidden rounded-full bg-white ring-1 ring-border/60">
                <Image
                  src={paso.img}
                  alt={`Paso ${paso.n}: ${paso.titulo}`}
                  fill
                  sizes="112px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold tracking-marca text-morado">
                <Rombo className="h-3 w-3" />
                PASO {paso.n}
              </p>
              <h3 className="mt-2 font-display text-xl text-tinta">
                {paso.titulo}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-tinta/65">
                {paso.texto}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col items-center gap-4">
          <Button
            size="lg"
            className="h-12 rounded-full bg-morado px-8 font-semibold hover:bg-morado-hondo"
            asChild
          >
            <a
              href={urlWhatsApp(
                "¡Hola, Macumba Shop! Quiero que me avisen cuando abra El Taller para diseñar mi propia pieza."
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              Avísame cuando abra
            </a>
          </Button>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <IconWhatsApp className="h-4 w-4 text-verde" />
            Mientras tanto, puedes empezar tu encargo por WhatsApp.
          </p>
        </div>
      </div>
    </section>
  );
}
