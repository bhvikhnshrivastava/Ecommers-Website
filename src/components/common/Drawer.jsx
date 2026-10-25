import { createPortal } from 'react-dom';
import { useEffect, useId, useRef } from 'react';
import { FiX } from 'react-icons/fi';
import { cn } from '@/utils/cn';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

export default function Drawer({ open, onClose, title, children, side = 'left', footer = null }) {
  const panelRef = useRef(null);
  const titleId = useId();

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
    <div className="fixed inset-0 z-[110]">
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-caspian-950/65 backdrop-blur-[2px] animate-fade-in"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={cn(
          'absolute inset-y-0 flex w-[88%] max-w-sm flex-col bg-pearl-50 shadow-lift animate-[drawer-in_.38s_cubic-bezier(.22,1,.36,1)]',
          side === 'left' ? 'left-0' : 'right-0',
        )}
      >
        <div className="flex items-center justify-between border-b border-caspian-900/10 px-5 py-4">
          {title ? (
            <h2 id={titleId} className="font-display text-2xl text-caspian-950">
              {title}
            </h2>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full text-caspian-900 transition-colors hover:bg-caspian-900/8"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer ? <div className="border-t border-caspian-900/10 px-5 py-4">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
}
