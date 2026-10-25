import { useId } from 'react';
import { cn } from '@/utils/cn';

export default function Textarea({
  label,
  error,
  hint,
  id,
  required = false,
  className,
  containerClassName,
  rows = 4,
  ...props
}) {
  const generatedId = useId();
  const textareaId = id || generatedId;
  const errorId = `${textareaId}-error`;
  const hintId = `${textareaId}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ');

  return (
    <div className={cn('space-y-1.5', containerClassName)}>
      {label ? (
        <label
          htmlFor={textareaId}
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
      <textarea
        id={textareaId}
        required={required}
        rows={rows}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy || undefined}
        className={cn(
          'w-full resize-y rounded-xl border bg-white px-4 py-3 font-sans text-sm leading-6 text-ink-900 transition-colors placeholder:text-ink-500/60',
          'focus:border-caspian-600 focus:outline-none focus:ring-2 focus:ring-champagne-500/25',
          error
            ? 'border-terracotta-500 focus:border-terracotta-500 focus:ring-terracotta-500/20'
            : 'border-caspian-900/15',
          className,
        )}
        {...props}
      />
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
