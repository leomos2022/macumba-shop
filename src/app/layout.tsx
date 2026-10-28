import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Macumba Shop — Viste Arte",
  description:
    "Ropa de textiles reciclados intervenida a mano por artistas bogotanos. Piezas únicas pintadas y bordadas: chaquetas, abrigos y creaciones hechas a tu manera. Bogotá, Colombia.",
  keywords: [
    "Macumba Shop",
    "ropa reciclada",
    "moda sostenible Colombia",
    "pintura textil",
    "bordado a mano",
    "piezas únicas",
    "Bogotá",
  ],
  authors: [{ name: "Macumba Shop" }],
  openGraph: {
    title: "Macumba Shop — Viste Arte",
    description:
      "Textiles reciclados, arte a mano. Piezas únicas desde Bogotá para toda Colombia.",
    siteName: "Macumba Shop",
    type: "website",
    locale: "es_CO",
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
        className={`${fraunces.variable} ${outfit.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
