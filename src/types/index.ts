/**
 * MACUMBA SHOP — Tipos globales del dominio
 * ------------------------------------------------------------
 * Fuentes: Documento de contexto del proyecto, secciones 5, 6.4 y 7.1
 * Cualquier cambio aquí debe reflejarse en `supabase/migrations/0001_init.sql`.
 */

/* ------------------------------------------------------------------ */
/* Catálogo                                                            */
/* ------------------------------------------------------------------ */

export type ProductCategory = 'jacket' | 'pants' | 'custom-only';

export type ProductViewType = 'front' | 'back';

/** Zona válida de diseño en coordenadas relativas (0–1) — responsive */
export interface PrintArea {
  /** Esquina superior izquierda, 0–1 relativo al ancho del mockup */
  x: number;
  /** Esquina superior izquierda, 0–1 relativo al alto del mockup */
  y: number;
  /** Ancho, 0–1 relativo al ancho del mockup */
  w: number;
  /** Alto, 0–1 relativo al alto del mockup */
  h: number;
}

/** Prenda base (chaqueta, pantalón, etc.) — espejo de la tabla `products` */
export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  basePrice: number;
  sizes: string[];
  category: ProductCategory;
  isCustomizable: boolean;
  isPremade: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string; // ISO timestamp
}

/** Vista fotográfica de una prenda — espejo de la tabla `product_views` */
export interface ProductView {
  id: string;
  productId: string;
  viewType: ProductViewType;
  mockupUrl: string;
  fabricTextureUrl: string | null;
  shadowUrl: string | null;
  printArea: PrintArea;
  sortOrder: number;
}

/** Elemento de la librería oficial de arte — espejo de la tabla `design_assets` */
export interface DesignAsset {
  id: string;
  name: string;
  imageUrl: string;
  isPremium: boolean;
  extraPrice: number;
  isActive: boolean;
  createdAt: string;
}

/* ------------------------------------------------------------------ */
/* Personalizador (El Estudio)                                        */
/* ------------------------------------------------------------------ */

/**
 * Posición de un elemento individual en el canvas del personalizador.
 * TODAS las coordenadas son relativas 0–1 respecto al mockup original,
 * para que el diseño se reposicione correctamente en cualquier resolución
 * y el artesano pueda reproducirlo a mano.
 */
export interface DesignPlacementElement {
  /** 'user-upload' o el uuid del design_assets */
  assetId: string | 'user-upload';
  /** Posición X del centro, 0–1 */
  x: number;
  /** Posición Y del centro, 0–1 */
  y: number;
  /** Escala multiplicativa (1 = escala original) */
  scale: number;
  /** Rotación en grados (0–360) */
  rotation: number;
  /** Reflejo horizontal */
  flipX: boolean;
}

/**
 * Plano técnico exportado al añadir al carrito.
 * Es la "receta" que el artesano usa para pintar la prenda real.
 */
export interface DesignPlacement {
  productId: string;
  view: ProductViewType;
  /** canvas.toJSON() de Fabric.js serializado como string */
  fabricJson: string;
  elements: DesignPlacementElement[];
}

/* ------------------------------------------------------------------ */
/* Carrito y pedidos                                                   */
/* ------------------------------------------------------------------ */

export type CartItemKind = 'premade' | 'custom';

export interface CartItemCustomDesign {
  /** Plano técnico (JSON) — receta para el artesano */
  placement: DesignPlacement;
  /** PNG renderizado a 2000px alojado en Supabase Storage */
  previewUrl: string;
  /** Total de extras (precio por diseño + premium + upload) */
  designPrice: number;
}

export interface CartItem {
  /** UUID local generado en el cliente */
  id: string;
  productId: string;
  productName: string;
  /** Talla elegida (debe existir en `product.sizes`) */
  size: string;
  quantity: number;
  /** Precio base de la prenda SIN diseños extras (snapshot al añadir) */
  basePrice: number;
  kind: CartItemKind;
  /** Solo presente si `kind === 'custom'` */
  customDesign?: CartItemCustomDesign;
}

/* ------------------------------------------------------------------ */
/* Configuración de precios (tabla `pricing_settings`)                */
/* ------------------------------------------------------------------ */

export type PricingKey =
  | 'price_per_custom_design' // precio base por cada diseño añadido
  | 'price_user_upload'; // precio extra por subir diseño propio

export interface PricingSetting {
  key: PricingKey;
  value: number;
  description: string;
}

/* ------------------------------------------------------------------ */
/* Pedidos (tabla `orders`)                                           */
/* ------------------------------------------------------------------ */

export type OrderStatus =
  | 'pending'
  | 'contacted'
  | 'confirmed'
  | 'in_production'
  | 'shipped'
  | 'cancelled';

export interface Order {
  id: string;
  status: OrderStatus;
  customerName: string | null;
  customerPhone: string | null;
  total: number;
  /** Copia inmutable de los items del carrito al confirmar */
  itemsSnapshot: CartItem[];
  /** Texto exacto enviado por WhatsApp */
  whatsappMessageSent: string | null;
  createdAt: string;
}

/* ------------------------------------------------------------------ */
/* API: payload de creación de pedido                                 */
/* ------------------------------------------------------------------ */

export interface CreateOrderInput {
  customerName?: string;
  customerPhone?: string;
  items: CartItem[];
  total: number;
  whatsappMessage: string;
}

export interface CreateOrderResponse {
  id: string;
  status: OrderStatus;
  whatsappUrl: string;
}
