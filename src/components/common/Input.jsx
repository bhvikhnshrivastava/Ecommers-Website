import { forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';

const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    icon: Icon,
    trailing,
    id,
    required = false,
    className,
    containerClassName,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ');

  return (
    <div className={cn('space-y-1.5', containerClassName)}>
      {label ? (
        <label
          htmlFor={inputId}
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
        {Icon ? (
          <Icon
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500"
          />
        ) : null}
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy || undefined}
          className={cn(
            'h-12 w-full rounded-xl border bg-white px-4 font-sans text-sm text-ink-900 shadow-[0_1px_0_rgba(6,42,49,.02)] transition-colors placeholder:text-ink-500/60',
            'focus:border-caspian-600 focus:outline-none focus:ring-2 focus:ring-champagne-500/25',
            Icon ? 'pl-10' : '',
            trailing ? 'pr-12' : '',
            error
              ? 'border-terracotta-500 focus:border-terracotta-500 focus:ring-terracotta-500/20'
              : 'border-caspian-900/15',
            className,
          )}
          {...props}
        />
        {trailing ? (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">{trailing}</div>
        ) : null}
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
});

export default Input;
