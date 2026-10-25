import { useState } from 'react';
import { FiCheck, FiTag, FiX } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { applyCoupon, removeCoupon } from '@/redux/cartSlice';
import { addToast } from '@/redux/uiSlice';
import { selectCartCoupon } from '@/redux/selectors';
import { COUPON_LIST, getCoupon, validateCoupon } from '@/data/coupons';
import { formatINR } from '@/utils/currency';

export default function CouponForm({ subtotal }) {
  const dispatch = useAppDispatch();
  const appliedCode = useAppSelector(selectCartCoupon);
  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const appliedCoupon = getCoupon(appliedCode);
  const appliedValidity = appliedCode ? validateCoupon(appliedCode, subtotal) : null;

  const apply = (candidate) => {
    const result = validateCoupon(candidate, subtotal);
    if (!result.ok) {
      setFeedback({ type: 'error', message: result.message });
      return;
    }
    dispatch(applyCoupon(result.coupon.code));
    setFeedback({
      type: 'success',
      message: `${result.coupon.code} applied — ${result.coupon.label}.`,
    });
    setCode('');
    dispatch(
      addToast({
        title: 'Coupon applied',
        message: `${result.coupon.code}: ${result.coupon.label}.`,
      }),
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    apply(code);
  };

  const handleRemove = () => {
    dispatch(removeCoupon());
    setFeedback({ type: 'info', message: 'Coupon removed.' });
    dispatch(addToast({ type: 'info', message: 'Coupon removed from your order.' }));
  };

  return (
    <div className="rounded-[1.4rem] border border-caspian-900/8 bg-white p-4 sm:p-5">
      <p className="flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-caspian-900">
        <FiTag className="h-3.5 w-3.5 text-champagne-600" aria-hidden="true" />
        Have a code?
      </p>

      {appliedCoupon ? (
        <div className="mt-3 rounded-xl border border-caspian-900/10 bg-pearl-200/60 p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="inline-flex items-center gap-1.5 text-xs font-bold text-caspian-900">
                <FiCheck className="h-3.5 w-3.5 text-caspian-600" aria-hidden="true" />
                {appliedCoupon.code}
              </p>
              <p className="mt-0.5 text-[0.68rem] text-ink-500">{appliedCoupon.description}</p>
              {!appliedValidity?.ok ? (
                <p className="mt-1 text-[0.66rem] font-semibold text-terracotta-600">
                  {appliedValidity?.message}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={handleRemove}
              aria-label={`Remove coupon ${appliedCoupon.code}`}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-white hover:text-terracotta-600"
            >
              <FiX className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
          <label htmlFor="coupon-code" className="sr-only">
            Coupon code
          </label>
          <input
            id="coupon-code"
            type="text"
            value={code}
            onChange={(event) => {
              setCode(event.target.value);
              if (feedback.message) setFeedback({ type: '', message: '' });
            }}
            placeholder="Enter coupon code"
            autoComplete="off"
            className="h-10 min-w-0 flex-1 rounded-full border border-caspian-900/15 bg-pearl-50 px-4 font-sans text-xs uppercase tracking-[0.08em] text-ink-900 placeholder:normal-case placeholder:tracking-normal placeholder:text-ink-500/60 focus:border-caspian-700 focus:outline-none focus:ring-2 focus:ring-champagne-500/20"
          />
          <button
            type="submit"
            className="h-10 shrink-0 rounded-full bg-caspian-900 px-4 text-[0.6rem] font-bold uppercase tracking-[0.12em] text-pearl-50 transition-colors hover:bg-caspian-800"
          >
            Apply
          </button>
        </form>
      )}

      {feedback.message ? (
        <p
          role="status"
          className={
            feedback.type === 'error'
              ? 'mt-2 text-[0.66rem] text-terracotta-600'
              : 'mt-2 text-[0.66rem] text-caspian-700'
          }
        >
          {feedback.message}
        </p>
      ) : null}

      <details className="group mt-3 border-t border-caspian-900/8 pt-3">
        <summary className="cursor-pointer list-none text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-ink-500 transition-colors hover:text-caspian-900">
          View available offers
        </summary>
        <ul className="mt-2.5 space-y-2">
          {COUPON_LIST.map((coupon) => (
            <li key={coupon.code} className="flex items-center justify-between gap-3">
              <div>
                <p className="font-sans text-[0.68rem] font-bold tracking-[0.06em] text-caspian-900">
                  {coupon.code}
                </p>
                <p className="text-[0.62rem] leading-4 text-ink-500">{coupon.description}</p>
              </div>
              <button
                type="button"
                onClick={() => apply(coupon.code)}
                className="shrink-0 text-[0.58rem] font-bold uppercase tracking-[0.1em] text-champagne-700 underline decoration-champagne-500/30 underline-offset-2 hover:text-caspian-900"
              >
                Apply
              </button>
            </li>
          ))}
        </ul>
        {subtotal > 0 ? (
          <p className="mt-2 text-[0.6rem] text-ink-500">
            Your bag currently totals {formatINR(subtotal)}.
          </p>
        ) : null}
      </details>
    </div>
  );
}
