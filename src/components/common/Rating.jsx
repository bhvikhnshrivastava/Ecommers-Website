import { FiStar } from 'react-icons/fi';
import { cn } from '@/utils/cn';
import { formatCount } from '@/utils/currency';

const SIZES = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
};

export default function Rating({
  value = 0,
  count = 0,
  size = 'sm',
  showCount = true,
  className,
  light = false,
}) {
  const rating = Math.max(0, Math.min(5, Number(value) || 0));
  const percent = (rating / 5) * 100;
  const starSize = SIZES[size] ?? SIZES.sm;
  const stars = [0, 1, 2, 3, 4];

  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <span
        role="img"
        aria-label={`${rating.toFixed(1)} out of 5 stars`}
        className="relative inline-flex shrink-0"
      >
        <span
          className={cn('flex gap-0.5', light ? 'text-pearl-50/30' : 'text-caspian-900/20')}
          aria-hidden="true"
        >
          {stars.map((star) => (
            <FiStar key={star} style={{ width: starSize, height: starSize }} strokeWidth={1.6} />
          ))}
        </span>
        <span
          className="absolute inset-y-0 left-0 flex gap-0.5 overflow-hidden text-champagne-500"
          style={{ width: `${percent}%` }}
          aria-hidden="true"
        >
          {stars.map((star) => (
            <FiStar
              key={star}
              style={{ width: starSize, height: starSize, flexShrink: 0, fill: 'currentColor' }}
              strokeWidth={1.2}
            />
          ))}
        </span>
      </span>
      {showCount && count > 0 ? (
        <span
          className={cn(
            'font-sans text-[0.68rem] tabular-nums',
            light ? 'text-pearl-100/70' : 'text-ink-500',
          )}
        >
          ({formatCount(count)})
        </span>
      ) : null}
    </span>
  );
}
