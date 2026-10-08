import type { Metadata } from "next";
import { Poppins, Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { CartDrawer } from "@/components/cart/CartDrawer";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MACUMBA SHOP — Ropa artesanal pintada a mano",
    template: "%s | MACUMBA SHOP",
  },
  description:
    "Ropa artesanal pintada a mano con pinturas textiles de alta durabilidad. Cada prenda es única. Diseña la tuya en El Estudio.",
  keywords: [
    "ropa artesanal",
    "pintada a mano",
    "reciclada",
    "Colombia",
    "diseño personalizado",
    "Macumba",
  ],
  authors: [{ name: "MACUMBA SHOP" }],
  openGraph: {
    title: "MACUMBA SHOP — Ropa artesanal pintada a mano",
    description:
      "Cada prenda es única e irrepetible. Diseños pintados a mano sobre textiles reciclados.",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    siteName: "MACUMBA SHOP",
    type: "website",
    locale: "es_CO",
  },
  twitter: {
    card: "summary_large_image",
    title: "MACUMBA SHOP",
    description: "Ropa artesanal pintada a mano.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CO" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${montserrat.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
        <WhatsAppFloat />
        <CartDrawer />
        <Toaster />
        <SonnerToaster />
      </body>
    </html>
  );
}
