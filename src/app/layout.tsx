import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { CartDrawer } from "@/components/cart/CartDrawer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MÄCUMBA — Ropa artesanal pintada a mano",
    template: "%s | MÄCUMBA",
  },
  description:
    "Ropa artesanal pintada a mano con pinturas textiles de alta durabilidad. Cada prenda es única.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CO" suppressHydrationWarning>
      <body
        className={`${outfit.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
        <WhatsAppFloat />
        <CartDrawer />
      </body>
    </html>
  );
}
