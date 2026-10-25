import { FiChevronDown } from 'react-icons/fi';
import { useId } from 'react';
import { cn } from '@/utils/cn';

export default function Select({
  label,
  error,
  hint,
  id,
  required = false,
  className,
  containerClassName,
  children,
  ...props
}) {
  const generatedId = useId();
  const selectId = id || generatedId;
  const errorId = `${selectId}-error`;
  const hintId = `${selectId}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ');

  return (
    <div className={cn('space-y-1.5', containerClassName)}>
      {label ? (
        <label
          htmlFor={selectId}
          className="flex items-center gap-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-caspian-900"
        >
          {label}
          {required ? (
            <span className="text-terracotta-500" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
      ) : null}
      <div className="relative">
        <select
          id={selectId}
          required={required}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy || undefined}
          className={cn(
            'h-12 w-full appearance-none rounded-xl border bg-white px-4 pr-10 font-sans text-sm text-ink-900 transition-colors',
            'focus:border-caspian-600 focus:outline-none focus:ring-2 focus:ring-champagne-500/25',
            error
              ? 'border-terracotta-500 focus:border-terracotta-500 focus:ring-terracotta-500/20'
              : 'border-caspian-900/15',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <FiChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500"
        />
      </div>
      {error ? (
        <p id={errorId} role="alert" className="font-sans text-xs leading-5 text-terracotta-600">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="font-sans text-xs leading-5 text-ink-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
