import { createPortal } from 'react-dom';
import { useEffect, useId, useRef } from 'react';
import { FiX } from 'react-icons/fi';
import { cn } from '@/utils/cn';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

const SIZES = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
};

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer = null,
  size = 'md',
  className,
}) {
  const panelRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();

  useLockBodyScroll(open);
  useFocusTrap(panelRef, open);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-caspian-950/65 backdrop-blur-[3px] animate-fade-in"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          'relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[1.75rem] border border-white/20 bg-pearl-50 shadow-lift animate-slide-up sm:rounded-[1.75rem]',
          SIZES[size] ?? SIZES.md,
          className,
        )}
      >
        <div className="flex items-start justify-between gap-6 border-b border-caspian-900/10 px-5 py-4 sm:px-7 sm:py-5">
          <div>
            {title ? (
              <h2 id={titleId} className="font-display text-2xl text-caspian-950 sm:text-[1.7rem]">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p id={descriptionId} className="mt-1 text-xs leading-5 text-ink-500">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-caspian-900 transition-colors hover:bg-caspian-900/8"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">{children}</div>
        {footer ? (
          <div className="border-t border-caspian-900/10 bg-white/60 px-5 py-4 sm:px-7">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
