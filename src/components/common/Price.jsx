import { cn } from '@/utils/cn';
import { formatINR } from '@/utils/currency';

const SIZES = {
  sm: { current: 'text-[0.92rem]', original: 'text-[0.68rem]', note: 'text-[0.58rem]' },
  md: { current: 'text-[1.08rem]', original: 'text-[0.74rem]', note: 'text-[0.6rem]' },
  lg: { current: 'text-3xl sm:text-4xl', original: 'text-sm', note: 'text-[0.68rem]' },
};

export default function Price({
  price,
  originalPrice,
  discount,
  size = 'md',
  showDiscount = true,
  className,
}) {
  const sizes = SIZES[size] ?? SIZES.md;
  const current = Number(price) || 0;
  const original = Number(originalPrice) || 0;
  const saving = original > current ? Math.round((1 - current / original) * 100) : 0;
  const shownDiscount = Number(discount) || saving;

  return (
    <span className={cn('inline-flex flex-wrap items-baseline gap-x-2 gap-y-1', className)}>
      <span className={cn('font-sans font-semibold tabular-nums text-caspian-950', sizes.current)}>
        {formatINR(current)}
      </span>
      {original > current ? (
        <span className={cn('font-sans tabular-nums text-ink-500 line-through', sizes.original)}>
          {formatINR(original)}
        </span>
      ) : null}
      {showDiscount && shownDiscount > 0 ? (
        <span
          className={cn(
            'rounded-full bg-terracotta-100 px-2 py-0.5 font-sans font-bold uppercase tracking-[0.08em] text-terracotta-600',
            sizes.note,
          )}
        >
          {shownDiscount}% off
        </span>
      ) : null}
    </span>
  );
}
