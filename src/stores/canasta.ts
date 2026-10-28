"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ItemCanasta } from "@/lib/macumba";

type EstadoCanasta = {
  items: ItemCanasta[];
  abierta: boolean;
  setAbierta: (abierta: boolean) => void;
  agregar: (item: ItemCanasta) => void;
  cambiarCantidad: (slug: string, talla: string, delta: number) => void;
  eliminar: (slug: string, talla: string) => void;
  vaciar: () => void;
};

export const useCanasta = create<EstadoCanasta>()(
  persist(
    (set) => ({
      items: [],
      abierta: false,
      setAbierta: (abierta) => set({ abierta }),
      agregar: (item) =>
        set((estado) => {
          const idx = estado.items.findIndex(
            (i) => i.slug === item.slug && i.talla === item.talla
          );
          if (idx >= 0) {
            const items = [...estado.items];
            items[idx] = {
              ...items[idx],
              cantidad: items[idx].cantidad + item.cantidad,
            };
            return { items };
          }
          return { items: [...estado.items, item] };
        }),
      cambiarCantidad: (slug, talla, delta) =>
        set((estado) => ({
          items: estado.items
            .map((i) =>
              i.slug === slug && i.talla === talla
                ? { ...i, cantidad: Math.max(0, i.cantidad + delta) }
                : i
            )
            .filter((i) => i.cantidad > 0),
        })),
      eliminar: (slug, talla) =>
        set((estado) => ({
          items: estado.items.filter(
            (i) => !(i.slug === slug && i.talla === talla)
          ),
        })),
      vaciar: () => set({ items: [] }),
    }),
    {
      name: "macumba-canasta",
      partialize: (estado) => ({ items: estado.items }),
      skipHydration: true,
    }
  )
);

export function totalItems(items: ItemCanasta[]): number {
  return items.reduce((acc, i) => acc + i.cantidad, 0);
}

export function totalPrecio(items: ItemCanasta[]): number {
  return items.reduce((acc, i) => acc + i.cantidad * i.precio, 0);
}
