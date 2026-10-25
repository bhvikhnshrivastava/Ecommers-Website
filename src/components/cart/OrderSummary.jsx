import { FiLock } from 'react-icons/fi';
import { computeTotals } from '@/utils/orderTotals';
import { formatINR } from '@/utils/currency';
import { cn } from '@/utils/cn';

export default function OrderSummary({
  items = [],
  couponCode = null,
  deliveryMethod = 'standard',
  paymentMethod = 'prepaid',
  title = 'Order summary',
  children = null,
  footnote = null,
  className,
}) {
  const totals = computeTotals(items, couponCode, { deliveryMethod, paymentMethod });
  const progress = Math.min(
    100,
    Math.round((totals.subtotal / totals.freeDeliveryThreshold) * 100),
  );

  return (
    <div
      className={cn(
        'rounded-[1.5rem] border border-caspian-900/10 bg-white p-5 shadow-[0_18px_50px_-40px_rgba(6,42,49,.5)]',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-caspian-900/8 pb-4">
        <h2 className="font-display text-2xl text-caspian-950">{title}</h2>
        <span className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-ink-500">
          {totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'}
        </span>
      </div>

      {items.length > 0 && deliveryMethod === 'standard' ? (
        <div className="mt-4 rounded-xl bg-pearl-200/60 p-3">
          {totals.qualifiesForFreeDelivery ? (
            <p className="text-[0.68rem] font-semibold text-caspian-700">
              Complimentary delivery unlocked.
            </p>
          ) : (
            <>
              <p className="text-[0.68rem] text-ink-700">
                Add {formatINR(totals.freeDeliveryRemaining)} for complimentary delivery.
              </p>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white">
                <div
                  className="h-full rounded-full bg-champagne-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          )}
        </div>
      ) : null}

      <dl className="mt-4 space-y-2.5 text-sm">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-ink-500">
            Subtotal
            {totals.productSavings > 0 ? (
              <span className="ml-1.5 text-[0.6rem] font-semibold text-terracotta-600">
                {formatINR(totals.productSavings)} saved
              </span>
            ) : null}
          </dt>
          <dd className="font-semibold tabular-nums text-caspian-950">
            {formatINR(totals.subtotal)}
          </dd>
        </div>

        {totals.couponDiscount > 0 ? (
          <div className="flex items-baseline justify-between gap-3">
            <dt className="flex items-center gap-1.5 text-ink-500">
              Coupon
              <span className="rounded-full bg-champagne-100 px-1.5 py-0.5 text-[0.55rem] font-bold uppercase tracking-[0.06em] text-champagne-700">
                {totals.couponCode}
              </span>
            </dt>
            <dd className="font-semibold tabular-nums text-terracotta-600">
              −{formatINR(totals.couponDiscount)}
            </dd>
          </div>
        ) : null}

        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-ink-500">
            Delivery
            <span className="ml-1.5 text-[0.6rem] uppercase tracking-[0.06em] text-ink-500">
              {deliveryMethod === 'express' ? 'Express' : 'Standard'}
            </span>
          </dt>
          <dd
            className={cn(
              'font-semibold tabular-nums',
              totals.deliveryFee === 0 ? 'text-caspian-700' : 'text-caspian-950',
            )}
          >
            {totals.deliveryFee === 0 ? 'Complimentary' : formatINR(totals.deliveryFee)}
          </dd>
        </div>

        {totals.codFee > 0 ? (
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-ink-500">Cash on delivery fee</dt>
            <dd className="font-semibold tabular-nums text-caspian-950">
              {formatINR(totals.codFee)}
            </dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-4 flex items-end justify-between gap-3 border-t border-caspian-900/10 pt-4">
        <div>
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-ink-500">Total</p>
          <p className="mt-0.5 text-[0.6rem] text-ink-500">Inclusive of all taxes</p>
        </div>
        <p className="font-display text-3xl leading-none tabular-nums text-caspian-950">
          {formatINR(totals.total)}
        </p>
      </div>

      {totals.totalSavings > 0 ? (
        <p className="mt-2 text-right text-[0.62rem] font-semibold text-caspian-700">
          You save {formatINR(totals.totalSavings)} in total
        </p>
      ) : null}

      {children ? <div className="mt-5 space-y-2">{children}</div> : null}

      <p className="mt-4 flex items-center justify-center gap-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-ink-500">
        <FiLock className="h-3 w-3" aria-hidden="true" />
        Secure, simulated checkout
      </p>

      {footnote ? (
        <p className="mt-3 border-t border-caspian-900/8 pt-3 text-center text-[0.62rem] leading-5 text-ink-500">
          {footnote}
        </p>
      ) : null}
    </div>
  );
}
