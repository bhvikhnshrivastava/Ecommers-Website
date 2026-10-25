import { cn } from '@/utils/cn';

export default function Badge({ count = 0, tone = 'gold', className }) {
  if (!count) return null;
  return (
    <span
      key={count}
      aria-hidden="true"
      className={cn(
        'absolute -right-1 -top-1 flex h-[1.15rem] min-w-[1.15rem] animate-pop items-center justify-center rounded-full px-1 text-[0.58rem] font-bold leading-none',
        tone === 'gold' ? 'bg-champagne-500 text-caspian-950' : 'bg-terracotta-500 text-white',
        className,
      )}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}
