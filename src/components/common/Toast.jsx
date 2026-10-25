import { useEffect } from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { dismissToast } from '@/redux/uiSlice';
import { selectToasts } from '@/redux/selectors';
import { cn } from '@/utils/cn';

const ICONS = {
  success: FiCheckCircle,
  error: FiAlertCircle,
  info: FiInfo,
};

function Toast({ toast }) {
  const dispatch = useAppDispatch();
  const Icon = ICONS[toast.type] ?? FiInfo;

  useEffect(() => {
    const timer = window.setTimeout(() => dispatch(dismissToast(toast.id)), 4200);
    return () => window.clearTimeout(timer);
  }, [dispatch, toast.id]);

  return (
    <div
      className={cn(
        'pointer-events-auto flex items-start gap-3 rounded-2xl border bg-white/95 p-3.5 pr-2.5 shadow-soft backdrop-blur animate-toast-in',
        toast.type === 'error' ? 'border-terracotta-500/30' : 'border-caspian-900/10',
      )}
    >
      <span
        className={cn(
          'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
          toast.type === 'error'
            ? 'bg-terracotta-100 text-terracotta-600'
            : 'bg-champagne-100 text-champagne-700',
        )}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1 pt-0.5">
        {toast.title ? <p className="text-xs font-bold text-caspian-950">{toast.title}</p> : null}
        <p className="text-xs leading-5 text-ink-700">{toast.message}</p>
      </div>
      <button
        type="button"
        onClick={() => dispatch(dismissToast(toast.id))}
        aria-label="Dismiss notification"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-caspian-900/5"
      >
        <FiX className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default function ToastViewport() {
  const toasts = useAppSelector(selectToasts);
  if (!toasts.length) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-[130] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 sm:bottom-6 sm:right-6"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
