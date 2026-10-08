/**
 * Landing — MACUMBA SHOP
 * ------------------------------------------------------------
 * Fase 1, ticket 1: landing mínima placeholder para validar
 * que el proyecto compila y sirve en el navegador.
 *
 * Secciones:
 *   1. Hero (titular + CTA)
 *   2. Manifesto (3 pilares: hecho a mano, reciclado, único)
 *   3. CTA secundario al catálogo
 *
 * El contenido real (galería, fotos flat-lay, historia de marca
 * detallada) se completa en el ticket 3 de la Fase 1.
 */

import Link from "next/link";
import { ArrowRight, Palette, Recycle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ============= HERO ============= */}
      <section className="relative isolate overflow-hidden bg-fabric-pattern">
        {/* Glow terracota de fondo */}
        <div
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 30%, oklch(0.70 0.135 60 / 0.25), transparent)",
          }}
          aria-hidden="true"
        />

        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground backdrop-blur">
              <Sparkles className="h-3 w-3 text-primary" aria-hidden />
              Ropa artesanal pintada a mano
            </span>

            <h1 className="mt-6 font-montserrat text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
              Cada prenda es{" "}
              <span className="text-gradient-macumba">única</span>,<br />
              como tu historia.
            </h1>

            <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg md:leading-relaxed">
              Diseñamos y confeccionamos prendas sobre textiles reciclados.
              Cada pieza es pintada a mano por nuestros artistas con pinturas
              textiles de alta durabilidad. Nada es impresión industrial.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 px-8 text-base font-medium"
              >
                <Link href="/catalogo">
                  Ver catálogo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base font-medium"
              >
                <Link href="/estudio">
                  Diseña la tuya
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ============= MANIFESTO ============= */}
      <section className="border-t border-border py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="font-montserrat text-3xl font-bold md:text-4xl">
              Por qué Macumba
            </h2>
            <p className="mt-3 text-sm text-muted-foreground md:text-base">
              Tres principios que definen cada prenda.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <PillarCard
              icon={<Palette className="h-6 w-6" />}
              title="Hecho a mano"
              description="Cada diseño se pinta individualmente con pinturas textiles de alta durabilidad. No usamos impresión industrial. Tocar la prenda es sentir el trazo del artista."
            />
            <PillarCard
              icon={<Recycle className="h-6 w-6" />}
              title="Materiales reciclados"
              description="Trabajamos con textiles reciclados y descartes de producción. Moda consciente que reduce el desperdicio sin sacrificar calidad ni estilo."
            />
            <PillarCard
              icon={<Sparkles className="h-6 w-6" />}
              title="Piezas únicas"
              description="Ninguna prenda es idéntica a otra. Al pintar a mano, cada pieza lleva la firma invisible de quien la creó. Tu prenda es tuya y de nadie más."
            />
          </div>
        </div>
      </section>

      {/* ============= CTA SECUNDARIO ============= */}
      <section className="border-t border-border bg-card/40 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-montserrat text-3xl font-bold md:text-4xl">
              Crea tu propia prenda
            </h2>
            <p className="mt-4 text-base text-muted-foreground md:text-lg">
              En <span className="font-semibold text-primary">El Estudio</span>{" "}
              eliges una prenda base, arrastras diseños de nuestros pintores
              o subes el tuyo, y ves el resultado en tiempo real. El precio se
              actualiza al instante.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="h-12 px-8 text-base">
                <Link href="/estudio">
                  Entrar al Estudio
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- Componentes auxiliares ---------- */

function PillarCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-lg border border-border bg-card/50 p-6 transition-colors hover:border-primary/40">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="font-montserrat text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
