import { cn } from '@/utils/cn';

const VARIANTS = {
  primary:
    'bg-caspian-900 text-pearl-50 hover:bg-caspian-800 active:bg-caspian-950 shadow-[0_14px_30px_-18px_rgba(6,42,49,.7)]',
  gold: 'bg-champagne-500 text-caspian-950 hover:bg-champagne-400 active:bg-champagne-600',
  outline:
    'border border-caspian-900/25 bg-transparent text-caspian-900 hover:border-caspian-900 hover:bg-caspian-900 hover:text-pearl-50',
  secondary:
    'border border-caspian-900/10 bg-white text-caspian-900 hover:border-caspian-900/25 hover:bg-pearl-50',
  ghost: 'bg-transparent text-caspian-900 hover:bg-caspian-900/6',
  danger: 'bg-terracotta-500 text-white hover:bg-terracotta-600',
  dark: 'bg-pearl-50 text-caspian-950 hover:bg-champagne-300',
};

const SIZES = {
  sm: 'h-9 gap-2 px-4 text-[0.61rem]',
  md: 'h-11 gap-2.5 px-6 text-[0.64rem]',
  lg: 'h-13 gap-3 px-8 text-[0.68rem]',
};

export function buttonClasses({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
} = {}) {
  return cn(
    'inline-flex select-none items-center justify-center rounded-full font-sans font-bold uppercase tracking-[0.16em] transition-all duration-300 disabled:pointer-events-none disabled:opacity-50',
    VARIANTS[variant] ?? VARIANTS.primary,
    SIZES[size] ?? SIZES.md,
    fullWidth && 'w-full',
    className,
  );
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  className,
  children,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClasses({ variant, size, fullWidth, className })}
      {...props}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
      ) : null}
      {children}
    </button>
  );
}
