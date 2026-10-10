/**
 * Estado global del carrito — Zustand + persist.
 * Guarda cartImageUrl (versión fondo blanco) para mostrar en el carrito.
 * Precios en COP (pesos colombianos).
 */

'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  addPremade: (input: {
    productId: string;
    productName: string;
    size: string;
    quantity: number;
    basePrice: number;
    cartImageUrl?: string;
  }) => void;

  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;

  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addPremade: ({ productId, productName, size, quantity, basePrice, cartImageUrl }) =>
        set((state) => {
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
            cartImageUrl,
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
      partialize: (state) => ({ items: state.items }),
    }
  )
);

/** Formatea precio en pesos colombianos (COP) */
export function formatCOP(n: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}
