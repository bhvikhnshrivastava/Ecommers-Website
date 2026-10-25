import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import Button from '@/components/common/Button';
import { cn } from '@/utils/cn';

export default function ErrorState({
  title = 'Something interrupted us',
  description = 'We could not load this part of the store. Please try once more.',
  onRetry,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-[1.75rem] border border-terracotta-500/20 bg-terracotta-100/40 px-6 py-14 text-center',
        className,
      )}
    >
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-terracotta-500 shadow-soft">
        <FiAlertCircle className="h-6 w-6" aria-hidden="true" />
      </span>
      <h2 className="font-display text-2xl text-caspian-950">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-ink-500">{description}</p>
      {onRetry ? (
        <Button variant="outline" size="sm" className="mt-5" onClick={onRetry}>
          <FiRefreshCw className="h-3.5 w-3.5" />
          Try again
        </Button>
      ) : null}
    </div>
  );
}
