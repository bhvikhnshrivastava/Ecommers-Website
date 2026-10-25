import { cn } from '@/utils/cn';
import Badge from '@/components/common/Badge';

const VARIANTS = {
  ghost: 'text-caspian-900 hover:bg-caspian-900/7',
  paper: 'border border-caspian-900/10 bg-white text-caspian-900 hover:border-caspian-900/25',
  dark: 'bg-caspian-900 text-pearl-50 hover:bg-caspian-800',
  light: 'bg-pearl-50/10 text-pearl-50 hover:bg-pearl-50/20',
};

export function iconButtonClasses({ variant = 'ghost', size = 'md', className } = {}) {
  return cn(
    'relative inline-flex shrink-0 items-center justify-center rounded-full transition-colors duration-200 disabled:pointer-events-none disabled:opacity-40',
    VARIANTS[variant] ?? VARIANTS.ghost,
    size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-12 w-12' : 'h-10 w-10',
    className,
  );
}

export default function IconButton({
  label,
  badge = 0,
  variant = 'ghost',
  size = 'md',
  className,
  children,
  ...props
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={iconButtonClasses({ variant, size, className })}
      {...props}
    >
      {children}
      <Badge count={badge} />
    </button>
  );
}
