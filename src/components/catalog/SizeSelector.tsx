'use client';

import { useState, useId } from "react";
import { cn } from "@/lib/utils";

interface SizeSelectorProps {
  sizes: string[];
  onChange?: (size: string) => void;
  defaultSize?: string;
}

export function SizeSelector({ sizes, onChange, defaultSize }: SizeSelectorProps) {
  const [selected, setSelected] = useState<string | null>(defaultSize ?? null);
  const groupId = useId();

  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, idx: number) {
    let nextIdx = idx;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIdx = (idx + 1) % sizes.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIdx = (idx - 1 + sizes.length) % sizes.length;
    } else return;
    const next = sizes[nextIdx];
    if (next) {
      setSelected(next);
      onChange?.(next);
      const buttons = e.currentTarget.parentElement?.querySelectorAll('button');
      (buttons?.[nextIdx] as HTMLButtonElement | undefined)?.focus();
    }
  }

  if (sizes.length === 0) {
    return <p className="text-sm text-muted-foreground">Sin tallas disponibles</p>;
  }

  return (
    <div role="radiogroup" aria-labelledby={`${groupId}-label`} className="space-y-2">
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
              onClick={() => { setSelected(size); onChange?.(size); }}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={cn(
                'h-11 min-w-[44px] rounded-md border px-3 font-outfit text-sm font-medium transition-all',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
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
