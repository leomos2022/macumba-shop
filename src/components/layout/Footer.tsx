import Link from "next/link";
import { Instagram, MessageCircle, Palette, Recycle, Sparkles } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/[0.06] bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <div>
              <span className="font-syne text-2xl font-extrabold tracking-tight">
                MÄCUMBÄ
              </span>
              <span className="ml-2 font-outfit text-[10px] font-semibold uppercase tracking-[0.3em] text-highlight">
                ART-MAGIA
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Ropa artesanal pintada a mano con pinturas textiles de alta durabilidad.
              Cada prenda es única e irrepetible.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-syne text-sm font-semibold uppercase tracking-wider text-foreground">
              Nuestros valores
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-highlight" aria-hidden />
                Pintado a mano
              </li>
              <li className="flex items-center gap-2">
                <Recycle className="h-4 w-4 text-highlight" aria-hidden />
                Supra-reciclaje
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-highlight" aria-hidden />
                Piezas únicas
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-syne text-sm font-semibold uppercase tracking-wider text-foreground">
              Conecta
            </h3>
            <div className="flex flex-col gap-2 text-sm">
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <MessageCircle className="h-4 w-4 text-highlight" aria-hidden />
                WhatsApp
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Instagram className="h-4 w-4 text-highlight" aria-hidden />
                @macumba.shop
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-white/[0.06] pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {year} MÄCUMBA. ART-MAGIA.</p>
          <p className="flex items-center gap-1">
            Hecho con
            <span className="text-highlight" aria-hidden>♥</span>
            en Colombia 🇨🇴
          </p>
        </div>
      </div>
    </footer>
  );
}
