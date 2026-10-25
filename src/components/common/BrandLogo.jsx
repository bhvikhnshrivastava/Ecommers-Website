import { cn } from '@/utils/cn';

export function BrandMark({ className, tone = 'dark' }) {
  const isLight = tone === 'light';
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={cn('h-10 w-10 shrink-0', className)}
      fill="none"
    >
      <circle cx="24" cy="24" r="23" fill="#0b3b45" />
      <circle
        cx="24"
        cy="24"
        r="19"
        stroke={isLight ? '#e0c68c' : '#c9a45c'}
        strokeOpacity="0.34"
      />
      <path
        d="M15.5 15.5c5.6-2 10-2 16 0"
        stroke="#c9a45c"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path
        d="M15.5 24c6.8-2.2 12-2.2 18.5 0"
        stroke="#c9a45c"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path
        d="M15.5 32.5c5.6-2 10-2 16 0"
        stroke="#c9a45c"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path d="M15.5 16v16.5" stroke="#f7f3ea" strokeWidth="2.1" strokeLinecap="round" />
      <circle cx="35" cy="13.5" r="2.4" fill="#c9a45c" />
    </svg>
  );
}

export default function BrandLogo({
  tone = 'dark',
  showTagline = false,
  compact = false,
  className,
  markClassName,
}) {
  const isLight = tone === 'light';
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <BrandMark tone={tone} className={cn(compact ? 'h-8 w-8' : 'h-10 w-10', markClassName)} />
      <span className="flex flex-col">
        <span
          className={cn(
            'font-display font-semibold uppercase leading-none',
            compact ? 'text-[0.95rem]' : 'text-[1.18rem]',
            isLight ? 'text-pearl-50' : 'text-caspian-950',
          )}
          style={{ letterSpacing: '0.24em' }}
        >
          Ecaspian
        </span>
        {showTagline ? (
          <span
            className={cn(
              'mt-1 font-sans text-[0.55rem] font-semibold uppercase tracking-[0.24em]',
              isLight ? 'text-champagne-300/80' : 'text-ink-500',
            )}
          >
            Curated for the extraordinary
          </span>
        ) : null}
      </span>
    </span>
  );
}
