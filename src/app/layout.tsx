import type { Metadata } from "next";
import { Fraunces, Macondo, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

/** Caligrafía pintada a mano de la etiqueta (Mäcuᴍbä · ART-MAGIA) */
const macondo = Macondo({
  variable: "--font-macondo",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

// URL canónica para las vistas previas al compartir (WhatsApp, etc.).
// Si Vercel asigna otro dominio, definir NEXT_PUBLIC_SITE_URL en su panel.
const URL_SITIO = process.env.NEXT_PUBLIC_SITE_URL ?? "https://macumba-shop.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(URL_SITIO),
  title: "Macumba Arte-Magia — Viste Arte",
  description:
    "Ropa de textiles reciclados intervenida a mano por artistas bogotanos. Chaquetas, cazadoras y abrigos pintados y tejidos a mano, hechos a pedido. Bogotá, Colombia.",
  keywords: [
    "Macumba Arte-Magia",
    "ropa reciclada",
    "moda sostenible Colombia",
    "pintura textil",
    "bordado a mano",
    "prendas hechas a pedido",
    "Bogotá",
  ],
  authors: [{ name: "Macumba Arte-Magia" }],
  openGraph: {
    title: "Macumba Arte-Magia — Viste Arte",
    description:
      "Textiles reciclados, arte a mano. Prendas hechas a pedido desde Bogotá para toda Colombia.",
    siteName: "Macumba Arte-Magia",
    type: "website",
    locale: "es_CO",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Macumba Arte-Magia — M de Macumba pintada a mano sobre verde claro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Macumba Arte-Magia — Viste Arte",
    description:
      "Textiles reciclados, arte a mano. Prendas hechas a pedido desde Bogotá para toda Colombia.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${outfit.variable} ${macondo.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
