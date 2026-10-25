import { FiMinus, FiPlus } from 'react-icons/fi';
import { cn } from '@/utils/cn';

export default function QuantityStepper({
  value = 1,
  min = 1,
  max = 10,
  onChange,
  size = 'md',
  label = 'Quantity',
  className,
}) {
  const height = size === 'sm' ? 'h-8' : 'h-10';
  const buttonSize = size === 'sm' ? 'w-8' : 'w-10';

  return (
    <div
      className={cn(
        'inline-flex items-center overflow-hidden rounded-full border border-caspian-900/15 bg-white',
        height,
        className,
      )}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange?.(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={cn(
          'flex h-full items-center justify-center text-caspian-900 transition-colors hover:bg-caspian-900/5 disabled:opacity-30',
          buttonSize,
        )}
      >
        <FiMinus className="h-3.5 w-3.5" />
      </button>
      <span
        className="min-w-7 text-center font-sans text-xs font-bold tabular-nums text-caspian-950"
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange?.(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={cn(
          'flex h-full items-center justify-center text-caspian-900 transition-colors hover:bg-caspian-900/5 disabled:opacity-30',
          buttonSize,
        )}
      >
        <FiPlus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
