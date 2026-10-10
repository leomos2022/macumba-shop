/**
 * MACUMBA SHOP — Tipos globales del dominio.
 */

export type ProductCategory = 'jacket' | 'pants' | 'custom-only';

export type ProductViewType = 'front' | 'back';

export interface PrintArea {
  x: number;
  y: number;
  w: number;
  h: number;
}

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
  createdAt: string;
  /** URL de la imagen principal para el catálogo (foto original) */
  imageUrl?: string;
  /** URL de la imagen para el carrito (fondo blanco, versión "car") */
  cartImageUrl?: string;
}

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

export type CartItemKind = 'premade' | 'custom';

export interface CartItemCustomDesign {
  placement: any;
  previewUrl: string;
  designPrice: number;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  size: string;
  quantity: number;
  basePrice: number;
  kind: CartItemKind;
  customDesign?: CartItemCustomDesign;
  /** URL de la imagen con fondo blanco (versión "car") para el carrito */
  cartImageUrl?: string;
}

export type OrderStatus =
  | 'pending' | 'contacted' | 'confirmed' | 'in_production' | 'shipped' | 'cancelled';

export interface Order {
  id: string;
  status: OrderStatus;
  customerName: string | null;
  customerPhone: string | null;
  total: number;
  itemsSnapshot: CartItem[];
  whatsappMessageSent: string | null;
  createdAt: string;
}
