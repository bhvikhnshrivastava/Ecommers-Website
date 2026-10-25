import { cn } from '@/utils/cn';

export default function SectionHeading({
  eyebrow,
  title,
  description,
  action = null,
  align = 'left',
  light = false,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between',
        align === 'center' && 'items-center text-center sm:flex-col sm:items-center',
        className,
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        {eyebrow ? <p className={light ? 'eyebrow-light' : 'eyebrow'}>{eyebrow}</p> : null}
        {title ? (
          <h2 className={cn('section-title mt-3', light && 'text-pearl-50')}>{title}</h2>
        ) : null}
        {description ? (
          <p className={cn('body-copy mt-3 max-w-xl', light && 'text-pearl-100/70')}>
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
