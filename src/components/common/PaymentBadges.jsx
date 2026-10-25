import { PAYMENT_METHODS } from '@/data/constants';
import { cn } from '@/utils/cn';

export default function PaymentBadges({
  className,
  tone = 'light',
  limit = PAYMENT_METHODS.length,
}) {
  return (
    <ul
      className={cn('flex flex-wrap items-center gap-1.5', className)}
      aria-label="Payment methods"
    >
      {PAYMENT_METHODS.slice(0, limit).map((method) => (
        <li
          key={method}
          className={cn(
            'rounded-md border px-1.5 py-1 text-[0.52rem] font-bold uppercase tracking-[0.08em]',
            tone === 'dark'
              ? 'border-pearl-50/15 bg-pearl-50/5 text-pearl-100/70'
              : 'border-caspian-900/12 bg-white text-ink-500',
          )}
        >
          {method}
        </li>
      ))}
    </ul>
  );
}
