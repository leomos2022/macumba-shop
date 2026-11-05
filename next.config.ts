import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Vercel: el catálogo lee SQLite en runtime (solo lectura; los pedidos van
  // por WhatsApp), así que el archivo de la base debe viajar dentro del
  // serverless bundle. Sin esto, desplegado en Vercel la grilla sale vacía.
  outputFileTracingIncludes: {
    "/**": ["./db/custom.db"],
  },
  // Prisma fuera del bundle de Turbopack: garantiza que los binarios del
  // query engine lleguen completos al serverless de Vercel.
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;
