import { FiShoppingBag } from 'react-icons/fi';
import { cn } from '@/utils/cn';
import BrandLogo from '@/components/common/BrandLogo';

export default function EmptyState({
  icon: Icon = FiShoppingBag,
  eyebrow = 'Nothing here yet',
  title,
  description,
  action = null,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-caspian-900/15 bg-pearl-50/70 px-6 py-16 text-center sm:py-20',
        className,
      )}
    >
      <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-soft">
        <span className="absolute inset-2 rounded-full border border-champagne-500/30" />
        <Icon className="h-8 w-8 text-caspian-700" aria-hidden="true" />
      </div>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 max-w-md font-display text-3xl text-caspian-950 sm:text-4xl">{title}</h2>
      {description ? (
        <p className="mt-3 max-w-md text-sm leading-7 text-ink-500">{description}</p>
      ) : null}
      {action ? <div className="mt-7">{action}</div> : null}
      <div className="mt-10 opacity-40">
        <BrandLogo compact />
      </div>
    </div>
  );
}
