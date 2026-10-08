/**
 * Estado global del carrito — Zustand + middleware persist.
 * ------------------------------------------------------------
 * - Persiste en localStorage entre sesiones.
 * - Tipado estricto: cada item es `CartItem` (ver src/types).
 * - En Fase 1 solo se usa para prendas premade. Los custom designs
 *   (con DesignPlacement y previewUrl) llegan en Fase 2.
 *
 * Documento de contexto: sección 7.1
 */

'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { CartItem, CartItemCustomDesign } from '@/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean; // drawer abierto/cerrado (lo usa CartDrawer)

  // ----- actions -----
  addPremade: (input: {
    productId: string;
    productName: string;
    size: string;
    quantity: number;
    basePrice: number;
  }) => void;

  addCustom: (input: {
    productId: string;
    productName: string;
    size: string;
    quantity: number;
    basePrice: number;
    customDesign: CartItemCustomDesign;
  }) => void;

  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;

  // ----- selectors (funciones puras, no mutan estado) -----
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addPremade: ({ productId, productName, size, quantity, basePrice }) =>
        set((state) => {
          // Si ya existe el mismo premade con la misma talla, sumamos cantidad
          const existing = state.items.find(
            (i) =>
              i.kind === 'premade' &&
              i.productId === productId &&
              i.size === size
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === existing.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          const item: CartItem = {
            id: uuidv4(),
            productId,
            productName,
            size,
            quantity,
            basePrice,
            kind: 'premade',
          };
          return { items: [...state.items, item], isOpen: true };
        }),

      addCustom: ({
        productId,
        productName,
        size,
        quantity,
        basePrice,
        customDesign,
      }) =>
        set((state) => {
          // Cada custom design es único — siempre se agrega como nuevo item
          const item: CartItem = {
            id: uuidv4(),
            productId,
            productName,
            size,
            quantity,
            basePrice,
            kind: 'custom',
            customDesign,
          };
          return { items: [...state.items, item], isOpen: true };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
            )
            .filter((i) => i.quantity > 0),
        })),

      clear: () => set({ items: [] }),

      openDrawer: () => set({ isOpen: true }),
      closeDrawer: () => set({ isOpen: false }),

      getTotalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce((sum, i) => {
          const base = i.basePrice * i.quantity;
          const extra =
            i.kind === 'custom'
              ? (i.customDesign?.designPrice ?? 0) * i.quantity
              : 0;
          return sum + base + extra;
        }, 0),
    }),
    {
      name: 'macumba-cart',
      storage: createJSONStorage(() => localStorage),
      // Solo persistimos los items, no el estado del drawer
      partialize: (state) => ({ items: state.items }),
    }
  )
);
