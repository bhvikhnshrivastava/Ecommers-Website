import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import { cn } from '@/utils/cn';

export default function Breadcrumbs({ items = [], light = false, className }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('font-sans', className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.16em]">
        <li>
          <Link
            to="/"
            className={cn(
              'transition-colors',
              light
                ? 'text-pearl-100/60 hover:text-pearl-50'
                : 'text-ink-500 hover:text-caspian-900',
            )}
          >
            Home
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              <FiChevronRight
                aria-hidden="true"
                className={cn('h-3 w-3', light ? 'text-pearl-100/30' : 'text-ink-500/50')}
              />
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className={cn(
                    'transition-colors',
                    light
                      ? 'text-pearl-100/60 hover:text-pearl-50'
                      : 'text-ink-500 hover:text-caspian-900',
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={cn(
                    'line-clamp-1 max-w-[14rem]',
                    light ? 'text-pearl-50' : 'text-caspian-900',
                  )}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
