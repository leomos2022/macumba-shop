export function Rombo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 2.5 L21.5 12 L12 21.5 L2.5 12 Z" />
      <path d="M12 6.5 L17.5 12 L12 17.5 L6.5 12 Z" opacity="0.45" />
    </svg>
  );
}

export function SeparadorRombo({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center gap-3 ${className}`}
      aria-hidden="true"
    >
      <span className="h-px w-12 bg-border" />
      <Rombo className="h-4 w-4 text-morado" />
      <span className="h-px w-12 bg-border" />
    </div>
  );
}
