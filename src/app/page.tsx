import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Brush, Heart, Palette, Recycle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JacketHeroVideo } from "@/components/catalog/JacketHeroVideo";
import { AmbientGlow } from "@/components/layout/AmbientGlow";

export const metadata: Metadata = {
  title: "MÄCUMBA — Ropa artesanal pintada a mano",
  description:
    "Ropa artesanal pintada a mano con pinturas textiles de alta durabilidad. Cada prenda es única. Diseña la tuya en El Estudio.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ============= HERO MOBILE-FIRST ============= */}
      <section className="relative isolate overflow-hidden">
        {/* Mesh gradient animado de fondo */}
        <div className="absolute inset-0 -z-20 animate-art-mesh" aria-hidden />
        <AmbientGlow variant="hero" />

        {/* === MOBILE: chaqueta a pantalla completa === */}
        <div className="relative flex min-h-[94vh] flex-col items-center justify-center px-1 py-2 md:hidden">
          <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-highlight/50 bg-highlight/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-highlight backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-highlight animate-pulse" aria-hidden />
            Arte pintado a mano
            <span className="text-muted-foreground">•</span>
            Edición limitada
          </div>

          {/* Chaqueta 3D en loop — la estrella de mobile */}
          <div className="relative h-[88vh] w-full max-w-[460px]">
            <JacketHeroVideo />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="h-5 w-5 text-muted-foreground" aria-hidden />
          </div>
        </div>

        {/* === DESKTOP: layout con chaqueta + texto juntos === */}
        <div className="hidden md:block">
          <div className="container mx-auto px-4 py-20">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-highlight/50 bg-highlight/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-highlight backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-highlight animate-pulse" aria-hidden />
                Arte pintado a mano
                <span className="text-muted-foreground">•</span>
                Edición limitada
              </div>

              <div className="relative mx-auto mb-8 h-[48rem] w-[25rem]">
                <JacketHeroVideo />
              </div>

              <h1 className="font-syne text-6xl font-extrabold leading-[1.05] tracking-tight md:text-7xl">
                Cada prenda es{" "}
                <span className="text-gradient-macumba">única</span>,
                <br />
                como tu historia.
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg md:leading-relaxed">
                Ropa artesanal sobre textiles reciclados. Cada pieza es pintada a
                mano por los artistas de Macumba como Rober Novoa. Sin impresiones
                industriales, sin series, sin réplicas.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild size="lg" className="glow-primary group h-12 px-8 text-base font-semibold transition-all">
                  <Link href="/catalogo">
                    Ver colección única
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 border-white/20 bg-white/[0.04] px-8 text-base font-semibold backdrop-blur-md transition-all hover:border-primary/40 hover:bg-primary/[0.08]">
                  <Link href="/estudio">
                    <Brush className="mr-2 h-4 w-4" />
                    Crear en El Estudio
                  </Link>
                </Button>
              </div>

              <p className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Heart className="h-3 w-3 text-highlight" aria-hidden />
                Hecho por artesanos, para personas que valoran lo hecho a mano.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Sección 2: Textos y CTAs (mobile only) --- */}
      <section className="relative isolate overflow-hidden md:hidden">
        <div className="absolute inset-0 -z-20 animate-art-mesh" aria-hidden />
        <AmbientGlow variant="accent" />

        <div className="container mx-auto px-4 py-16">
          <h1 className="font-syne text-5xl font-extrabold leading-[1.1] tracking-tight">
            Cada prenda es{" "}
            <span className="text-gradient-macumba">única</span>,
            <br />
            como tu historia.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
            Ropa artesanal sobre textiles reciclados. Cada pieza es pintada a
            mano por los artistas de Macumba como Rober Novoa. Sin impresiones
            industriales, sin series, sin réplicas.
          </p>

          <div className="mt-10 flex flex-col gap-3">
            <Button asChild size="lg" className="glow-primary group h-12 px-8 text-base font-semibold transition-all">
              <Link href="/catalogo">
                Ver colección única
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 border-white/20 bg-white/[0.04] px-8 text-base font-semibold backdrop-blur-md transition-all hover:border-primary/40 hover:bg-primary/[0.08]">
              <Link href="/estudio">
                <Brush className="mr-2 h-4 w-4" />
                Crear en El Estudio
              </Link>
            </Button>
          </div>

          <p className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Heart className="h-3 w-3 text-highlight" aria-hidden />
            Hecho por artesanos, para personas que valoran lo hecho a mano.
          </p>
        </div>
      </section>

      {/* ============= MANIFESTO ============= */}
      <section className="relative border-t border-white/[0.06] py-20">
        <AmbientGlow variant="subtle" />
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-highlight">
              Por qué Macumba
            </p>
            <h2 className="mt-3 font-syne text-3xl font-bold tracking-tight md:text-5xl">
              Tres principios,
              <span className="text-gradient-macumba"> una promesa</span>.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <PillarCard icon={<Palette className="h-6 w-6" />} title="Pintado a mano" description="Cada diseño se pinta individualmente con pinturas textiles de alta durabilidad. No usamos impresión industrial. Tocar la prenda es sentir el trazo del artista." />
            <PillarCard icon={<Recycle className="h-6 w-6" />} title="Supra-reciclaje" description="Damos segunda vida a textiles descartados. Moda consciente que reduce el desperdicio sin sacrificar calidad ni estilo. El arte nace de lo que otros desechan." />
            <PillarCard icon={<Sparkles className="h-6 w-6" />} title="Piezas únicas" description="Ninguna prenda es idéntica a otra. Al pintar a mano, cada pieza lleva la firma invisible de quien la creó. Tu prenda es tuya y de nadie más." />
          </div>
        </div>
      </section>

      {/* ============= EL ARTE DETRÁS ============= */}
      <section className="relative border-t border-white/[0.06] bg-card/30 py-20">
        <AmbientGlow variant="accent" />
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-highlight">
              El arte detrás
            </p>
            <h2 className="mt-3 font-syne text-3xl font-bold tracking-tight md:text-4xl">
              Cada trazo,
              <br />
              <span className="text-gradient-macumba">una firma invisible.</span>
            </h2>

            <div className="mt-8 space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg md:leading-relaxed">
              <p>
                MACUMBA SHOP nació en las ferias culturales de Colombia, donde
                artesanos y creadores se reúnen para compartir su trabajo con
                quienes saben mirar de cerca. Ahí, entre luces de colores y
                conversaciones largas, descubrimos algo importante: la gente no
                solo quería comprar ropa, quería entenderla.
              </p>
              <p>
                Hoy, cada chaqueta y cada pantalón sigue siendo pintado a mano
                con pinturas textiles de alta durabilidad, sobre textiles
                reciclados que damos una segunda vida. Seguimos en las ferias —
                siempre volveremos — pero también abrimos este canal digital
                para que puedas llevar una pieza única, hecha para ti.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============= CTA SECUNDARIO ============= */}
      <section className="relative border-t border-white/[0.06] bg-card/30 py-20">
        <AmbientGlow variant="hero" />
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary backdrop-blur-sm">
                <Brush className="h-8 w-8" aria-hidden />
              </div>
            </div>
            <h2 className="font-syne text-3xl font-bold tracking-tight md:text-5xl">
              Crea tu propia prenda
            </h2>
            <p className="mt-4 text-base text-muted-foreground md:text-lg">
              En <span className="font-semibold text-primary">El Estudio</span>{" "}
              eliges una prenda base, arrastras diseños de nuestros pintores
              o subes el tuyo, y ves el resultado en tiempo real.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="glow-primary h-12 px-8 text-base">
                <Link href="/estudio">
                  Entrar al Estudio
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="h-12 px-8 text-base">
                <Link href="/catalogo">Explorar catálogo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PillarCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="glass-card glass-card-hover group rounded-2xl p-6">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
        {icon}
      </div>
      <h3 className="font-syne text-xl font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}
