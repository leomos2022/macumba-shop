/**
 * Página /producto/[slug] — Ficha de producto.
 * ------------------------------------------------------------
 * Server Component con SSR + generateMetadata dinámico para SEO.
 *
 * Estructura:
 *   • Breadcrumb (Inicio / Catálogo / Producto)
 *   • Layout 2 columnas (desktop):
 *       - Izquierda: galería (Frente/Dorso tabs)
 *       - Derecha: info (nombre, precio, descripción, tallas, CTA)
 *   • Mobile: stack vertical, galería primero
 *   • Productos relacionados (al final)
 *
 * Estados:
 *   • 404 si el producto no existe (notFound())
 *   • Error boundary si falla Supabase
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  Home,
  Palette,
  Recycle,
  Brush,
  Truck,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductGallery } from "@/components/catalog/ProductGallery";
import { ProductActions } from "@/components/catalog/ProductActions";
import { RelatedProducts } from "@/components/catalog/RelatedProducts";
import { createClient } from "@/lib/supabase/server";
import {
  getProductBySlug,
  listProductViews,
  listProducts,
} from "@/lib/supabase/queries";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const supabase = await createClient();
    const product = await getProductBySlug(supabase, slug);

    if (!product) {
      return {
        title: "Producto no encontrado",
      };
    }

    return {
      title: product.name,
      description:
        product.description ??
        `${product.name} — ropa artesanal pintada a mano por MACUMBA SHOP.`,
      openGraph: {
        title: `${product.name} | MACUMBA SHOP`,
        description: product.description ?? undefined,
        type: "website",
      },
    };
  } catch {
    return { title: "Producto" };
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  let product: Awaited<ReturnType<typeof getProductBySlug>>;
  let views: Awaited<ReturnType<typeof listProductViews>> = [];
  let related: Awaited<ReturnType<typeof listProducts>> = [];

  try {
    const supabase = await createClient();
    product = await getProductBySlug(supabase, slug);

    if (!product) {
      notFound();
    }

    // Cargar vistas y productos relacionados en paralelo
    const [viewsResult, allProducts] = await Promise.all([
      listProductViews(supabase, product.id),
      listProducts(supabase),
    ]);
    views = viewsResult;
    // Filtrar el producto actual y tomar 4 relacionados de la misma categoría primero
    related = allProducts
      .filter((p) => p.id !== product.id)
      .sort((a, b) => {
        const aMatch = a.category === product.category ? 0 : 1;
        const bMatch = b.category === product.category ? 0 : 1;
        return aMatch - bMatch;
      })
      .slice(0, 4);
  } catch (err) {
    console.error(`[producto/${slug}] Error:`, err);
    throw err;
  }

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(n);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/" className="flex items-center gap-1">
                <Home className="h-3 w-3" aria-hidden />
                Inicio
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-3 w-3" aria-hidden />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/catalogo">Catálogo</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-3 w-3" aria-hidden />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Layout principal */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Columna izquierda: Galería */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ProductGallery views={views} productName={product.name} />
        </div>

        {/* Columna derecha: Info */}
        <div className="flex flex-col">
          {/* Badges */}
          <div className="mb-3 flex flex-wrap gap-2">
            {product.isPremade && (
              <Badge className="bg-primary text-primary-foreground">
                Diseño listo
              </Badge>
            )}
            {product.isCustomizable && (
              <Badge variant="outline" className="border-primary/40 text-primary">
                Personalizable
              </Badge>
            )}
            <Badge variant="outline" className="border-border text-muted-foreground">
              {product.category === 'jacket' && 'Chaqueta'}
              {product.category === 'pants' && 'Pantalón'}
              {product.category === 'custom-only' && 'Personalizable'}
            </Badge>
          </div>

          {/* Nombre */}
          <h1 className="font-montserrat text-3xl font-extrabold tracking-tight md:text-4xl">
            {product.name}
          </h1>

          {/* Precio */}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Desde
            </span>
            <span className="font-montserrat text-3xl font-bold text-foreground">
              {formatPrice(product.basePrice)}
            </span>
            {product.isCustomizable && (
              <span className="text-xs text-muted-foreground">
                + extras por diseño
              </span>
            )}
          </div>

          <Separator className="my-6" />

          {/* Descripción */}
          {product.description && (
            <div className="space-y-4">
              <h2 className="font-montserrat text-sm font-semibold uppercase tracking-wider text-foreground">
                Descripción
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            </div>
          )}

          {/* Acciones: tallas + CTA */}
          <div className="mt-8">
            <ProductActions
              productId={product.id}
              productName={product.name}
              productSlug={product.slug}
              basePrice={product.basePrice}
              sizes={product.sizes}
              isCustomizable={product.isCustomizable}
              isPremade={product.isPremade}
            />
          </div>

          <Separator className="my-8" />

          {/* Features / Trust badges */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Feature
              icon={<Palette className="h-5 w-5" />}
              title="Pintado a mano"
              description="Por artistas de Macumba"
            />
            <Feature
              icon={<Recycle className="h-5 w-5" />}
              title="Textil reciclado"
              description="Moda consciente"
            />
            <Feature
              icon={<Brush className="h-5 w-5" />}
              title="Personalizable"
              description="Diseña en El Estudio"
            />
          </div>

          <Separator className="my-8" />

          {/* FAQ corto */}
          <div className="space-y-4">
            <h2 className="font-montserrat text-sm font-semibold uppercase tracking-wider text-foreground">
              Preguntas frecuentes
            </h2>
            <FAQItem
              icon={<Truck className="h-4 w-4" />}
              question="¿Cómo se coordina el envío?"
              answer="Tras añadir al carrito y confirmar por WhatsApp, los artesanos coordinan contigo el envío y el pago. No se cobra online."
            />
            <FAQItem
              icon={<ShieldCheck className="h-4 w-4" />}
              question="¿La pintura se borra al lavar?"
              answer="No. Usamos pinturas textiles de alta durabilidad, fijadas al textil con calor. Lavado suave y planchado al revés para máxima vida útil."
            />
            <FAQItem
              icon={<HelpCircle className="h-4 w-4" />}
              question="¿Puedo personalizar esta prenda?"
              answer={
                product.isCustomizable
                  ? 'Sí. En El Estudio puedes añadir diseños de nuestros pintores o subir el tuyo. El precio se actualiza en tiempo real.'
                  : 'Esta prenda se vende tal como la ves. Para personalizar, explora otras prendas personalizables del catálogo.'
              }
            />
          </div>
        </div>
      </div>

      {/* Productos relacionados */}
      {related.length > 0 && <RelatedProducts products={related} />}
    </div>
  );
}

/* ---------- Componentes auxiliares ---------- */

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-border bg-card/30 p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function FAQItem({
  icon,
  question,
  answer,
}: {
  icon: React.ReactNode;
  question: string;
  answer: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{question}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{answer}</p>
      </div>
    </div>
  );
}
