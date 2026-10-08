/**
 * Landing — MACUMBA SHOP
 * ------------------------------------------------------------
 * Fase 1, ticket 2: landing detallada con:
 *   1. Hero (titular + CTA)
 *   2. Manifesto (3 pilares)
 *   3. Historia de la marca (texto largo, manifesto artesanal)
 *   4. Productos destacados (Server Component, lee de Supabase)
 *   5. CTA secundario a El Estudio
 */

import Link from "next/link";
import { ArrowRight, Palette, Recycle, Sparkles, Brush, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeaturedProducts } from "@/components/catalog/FeaturedProducts";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ============= HERO ============= */}
      <section className="relative isolate overflow-hidden bg-fabric-pattern">
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
              <Button asChild size="lg" className="h-12 px-8 text-base font-medium">
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
                <Link href="/estudio">Diseña la tuya</Link>
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

      {/* ============= HISTORIA DE LA MARCA ============= */}
      <section className="border-t border-border bg-card/40 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Nuestra historia
            </p>
            <h2 className="mt-2 font-montserrat text-3xl font-bold tracking-tight md:text-4xl">
              De las ferias culturales al mundo
            </h2>

            <div className="mt-8 space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg md:leading-relaxed">
              <p>
                MACUMBA SHOP nació en las ferias culturales de Colombia, donde
                artesanos y creadores se reúnen para compartir su trabajo con
                quienes saben mirar de cerca. Ahí, entre luces de colores y
                conversaciones largas, descubrimos algo importante: la gente no
                solo quería comprar ropa, quería entenderla. Quería saber por
                qué una prenda se sentía distinta, qué manos la habían pintado,
                qué historia llevaba cosida en cada trazo.
              </p>

              <p>
                Empezamos pintando prendas para amigos y vecinos. Pronto las
                ferias se quedaron cortas — no por falta de ventas, sino porque
                muchas personas nos preguntaban cómo podían hacer su propia
                combinación, elegir su propio diseño, hacer de una prenda
                estándar algo profundamente suyo. Esa pregunta nos dio la idea
                de El Estudio: un espacio digital donde tú eliges la prenda
                base, arrastras diseños de nuestros pintores o subes el tuyo,
                y ves el resultado antes de que alguien pinte un solo trazo.
              </p>

              <p>
                Hoy, cada chaqueta y cada pantalón sigue siendo pintado a mano
                con pinturas textiles de alta durabilidad, sobre textiles
                reciclados que damos una segunda vida. Seguimos en las ferias —
                siempre volveremos — pero también abrimos este canal digital
                para que puedas llevar una pieza única, hecha para ti, estés
                donde estés. Cada prenda sale de las manos de un pintor de
                Macumba y llega a tu puerta lista para acompañarte años.
              </p>
            </div>

            {/* Mini-stats */}
            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-border pt-8">
              <StatCard number="100%" label="Hecho a mano" />
              <StatCard number="0" label="Impresión industrial" />
              <StatCard number="∞" label="Diseños posibles" />
            </div>
          </div>
        </div>
      </section>

      {/* ============= PRODUCTOS DESTACADOS (desde Supabase) ============= */}
      <FeaturedProducts />

      {/* ============= CTA SECUNDARIO: EL ESTUDIO ============= */}
      <section className="border-t border-border bg-card/40 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Brush className="h-8 w-8" aria-hidden />
              </div>
            </div>
            <h2 className="font-montserrat text-3xl font-bold md:text-4xl">
              Crea tu propia prenda
            </h2>
            <p className="mt-4 text-base text-muted-foreground md:text-lg">
              En <span className="font-semibold text-primary">El Estudio</span>{" "}
              eliges una prenda base, arrastras diseños de nuestros pintores
              o subes el tuyo, y ves el resultado en tiempo real. El precio se
              actualiza al instante.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 px-8 text-base">
                <Link href="/estudio">
                  Entrar al Estudio
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="h-12 px-8 text-base"
              >
                <Link href="/catalogo">Explorar catálogo</Link>
              </Button>
            </div>

            {/* Pequeño trust indicator */}
            <p className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Heart className="h-3 w-3 text-primary" aria-hidden />
              Hecho por artesanos, para personas que valoran lo hecho a mano.
            </p>
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

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <p className="font-montserrat text-3xl font-extrabold text-gradient-macumba md:text-4xl">
        {number}
      </p>
      <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
