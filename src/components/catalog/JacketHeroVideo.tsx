/**
 * JacketHeroVideo — Chaqueta 3D en loop infinito (video Qwen).
 * ------------------------------------------------------------
 * Reproduce el video procesado en loop infinito:
 *   • Empieza desde el REVERSO (jaguar visible)
 *   • Gira 360° completo (reverso → lateral → frente → lateral → reverso)
 *   • Loop invisible (termina donde empieza)
 *
 * Características:
 *   ✅ Loop infinito automático
 *   ✅ Sin dependencias externas (no Three.js, no GLB)
 *   ✅ 100% responsive (mobile + desktop)
 *   ✅ Sin marco rectangular
 *   ✅ Fondo transparente (canvas alpha)
 *   ✅ Pausa al hover/touch
 *   ✅ Drop-shadow para dar profundidad
 */

'use client';

import { useState, useRef, useEffect } from 'react';

interface JacketHeroVideoProps {
  videoSrc?: string;
  className?: string;
}

export function JacketHeroVideo({
  videoSrc = '/mockups/macumba-jacket.mp4',
  className = '',
}: JacketHeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play (muted + playsInline requerido para mobile)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = async () => {
      try {
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.defaultMuted = true;
        await video.play();
        setIsLoaded(true);
      } catch (err) {
        console.warn('[JacketHeroVideo] Auto-play bloqueado:', err);
        const handleInteraction = () => {
          video.play().catch(() => {});
          setIsLoaded(true);
          document.removeEventListener('click', handleInteraction);
          document.removeEventListener('touchstart', handleInteraction);
        };
        document.addEventListener('click', handleInteraction, { once: true });
        document.addEventListener('touchstart', handleInteraction, { once: true });
      }
    };

    tryPlay();
  }, []);

  function handleMouseEnter() {
    if (videoRef.current && isLoaded) {
      videoRef.current.pause();
      setIsPaused(true);
    }
  }

  function handleMouseLeave() {
    if (videoRef.current && isLoaded && isPaused) {
      videoRef.current.play().catch(() => {});
      setIsPaused(false);
    }
  }

  return (
    <div
      className={`relative h-full w-full ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseEnter}
      onTouchEnd={handleMouseLeave}
    >
      {/* Glow ambiental detrás */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 mx-auto h-full w-full scale-110 rounded-full opacity-50 blur-3xl"
        style={{
          background:
            'radial-gradient(ellipse at center, oklch(0.55 0.20 25 / 0.5), oklch(0.45 0.20 320 / 0.35) 50%, transparent 70%)',
        }}
        aria-hidden
      />

      {/* Video en loop infinito — mix-blend-mode:lighten elimina el fondo negro */}
      <video
        ref={videoRef}
        className="relative h-full w-full object-contain"
        style={{
          mixBlendMode: 'lighten',
          filter: 'drop-shadow(0 15px 25px rgba(0, 0, 0, 0.3))',
        }}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label="Chaqueta MACUMBA girando 360 grados — reverso con jaguar pintado a mano"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Indicador "360°" */}
      <div className="pointer-events-none absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full border border-highlight/20 bg-background/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-highlight backdrop-blur-md">
        <span className="text-highlight">●</span> Gira 360°
      </div>

      {/* Spinner mientras carga */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      {/* Partículas decorativas */}
      <Sparkles className="absolute right-2 top-8 h-3 w-3 text-accent/60 animate-pulse" aria-hidden />
      <Sparkles className="absolute left-2 bottom-12 h-2.5 w-2.5 text-secondary/60 animate-pulse" aria-hidden />
    </div>
  );
}

function Sparkles({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 2l1.4 6.6L20 10l-6.6 1.4L12 18l-1.4-6.6L4 10l6.6-1.4L12 2z" />
    </svg>
  );
}
