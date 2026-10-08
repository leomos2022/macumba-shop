/**
 * SizeSelector — Selector de tallas interactivo.
 * ------------------------------------------------------------
 * Componente cliente controlado. Recibe la lista de tallas disponibles
 * y notifica al padre cuál se seleccionó.
 *
 * Accesibilidad:
 *   • role="radiogroup" para lectores de pantalla
 *   • Cada talla es role="radio" con aria-checked
 *   • Navegación por teclado (flechas)
 *   • Focus visible
 */

'use client';

import { useState, useId } from "react";
import { cn } from "@/lib/utils";

interface SizeSelectorProps {
  sizes: string[];
  /** Se llama cada vez que el usuario selecciona una talla */
  onChange?: (size: string) => void;
  /** Talla inicial seleccionada (opcional) */
  defaultSize?: string;
}

export function SizeSelector({
  sizes,
  onChange,
  defaultSize,
}: SizeSelectorProps) {
  const [selected, setSelected] = useState<string | null>(defaultSize ?? null);
  const groupId = useId();

  function handleSelect(size: string) {
    setSelected(size);
    onChange?.(size);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, idx: number) {
    let nextIdx = idx;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIdx = (idx + 1) % sizes.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIdx = (idx - 1 + sizes.length) % sizes.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIdx = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIdx = sizes.length - 1;
    } else {
      return;
    }
    const next = sizes[nextIdx];
    if (next) {
      handleSelect(next);
      // Mover focus al siguiente radio
      const buttons = e.currentTarget.parentElement?.querySelectorAll('button');
      const nextBtn = buttons?.[nextIdx] as HTMLButtonElement | undefined;
      nextBtn?.focus();
    }
  }

  if (sizes.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Sin tallas disponibles
      </p>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-labelledby={`${groupId}-label`}
      className="space-y-2"
    >
      <span id={`${groupId}-label`} className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Talla
      </span>

      <div className="flex flex-wrap gap-2">
        {sizes.map((size, idx) => {
          const isSelected = selected === size;
          return (
            <button
              key={size}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected || (selected === null && idx === 0) ? 0 : -1}
              onClick={() => handleSelect(size)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={cn(
                'h-11 min-w-[44px] rounded-md border px-3 font-poppins text-sm font-medium transition-all',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                isSelected
                  ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                  : 'border-border bg-background text-foreground hover:border-primary/40 hover:bg-accent/30'
              )}
            >
              {size}
            </button>
          );
        })}
      </div>

      {selected && (
        <p className="text-xs text-muted-foreground">
          Talla seleccionada: <span className="font-semibold text-foreground">{selected}</span>
        </p>
      )}
    </div>
  );
}
