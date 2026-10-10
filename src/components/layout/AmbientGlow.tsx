'use client';

import { cn } from '@/lib/utils';

interface AmbientGlowProps {
  variant?: 'hero' | 'subtle' | 'accent';
  className?: string;
}

export function AmbientGlow({ variant = 'hero', className }: AmbientGlowProps) {
  if (variant === 'subtle') {
    return (
      <div className={cn('pointer-events-none absolute inset-0 -z-10 overflow-hidden', className)} aria-hidden>
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-[100px] animate-aura" />
      </div>
    );
  }

  if (variant === 'accent') {
    return (
      <div className={cn('pointer-events-none absolute inset-0 -z-10 overflow-hidden', className)} aria-hidden>
        <div className="absolute -right-20 top-1/3 h-72 w-72 rounded-full bg-secondary/20 blur-[100px]" />
        <div className="absolute -left-20 bottom-1/4 h-72 w-72 rounded-full bg-accent/10 blur-[100px]" />
      </div>
    );
  }

  return (
    <div className={cn('pointer-events-none absolute inset-0 -z-10 overflow-hidden', className)} aria-hidden>
      <div
        className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-50 blur-[120px] animate-aura"
        style={{
          background:
            'radial-gradient(circle, oklch(0.55 0.20 25 / 0.35) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute left-10 top-1/3 h-[400px] w-[400px] rounded-full opacity-30 blur-[100px] animate-aura"
        style={{
          background:
            'radial-gradient(circle, oklch(0.45 0.20 320 / 0.4) 0%, transparent 70%)',
          animationDelay: '2s',
        }}
      />
      <div
        className="absolute right-10 bottom-1/3 h-[400px] w-[400px] rounded-full opacity-25 blur-[100px] animate-aura"
        style={{
          background:
            'radial-gradient(circle, oklch(0.55 0.13 150 / 0.4) 0%, transparent 70%)',
          animationDelay: '4s',
        }}
      />
    </div>
  );
}
