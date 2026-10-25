import { useMemo } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  FiArrowRight,
  FiCheck,
  FiCreditCard,
  FiHeart,
  FiMail,
  FiMapPin,
  FiPackage,
  FiTruck,
} from 'react-icons/fi';
import { useAppSelector } from '@/app/hooks';
import { selectWishlistCount } from '@/redux/selectors';
import { readJSON, STORAGE_KEYS } from '@/utils/storage';
import { computeTotals } from '@/utils/orderTotals';
import { formatDate, formatDateTime } from '@/utils/date';
import { formatINR } from '@/utils/currency';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import BrandLogo from '@/components/common/BrandLogo';
import Button, { buttonClasses } from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import ProductImage from '@/components/common/ProductImage';

const TIMELINE = [
  { id: 'confirmed', label: 'Order confirmed', note: 'Your details are with us.' },
  { id: 'packed', label: 'Packed with care', note: 'Wrapped and checked by hand.' },
  { id: 'shipped', label: 'On its way', note: 'Handed to our delivery partner.' },
  { id: 'delivered', label: 'Delivered', note: 'A small, good thing, at your door.' },
];

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const wishlistCount = useAppSelector(selectWishlistCount);

  const order = useMemo(() => {
    const fromState = location.state?.order;
    if (fromState && fromState.id === orderId) return fromState;
    const stored = readJSON(STORAGE_KEYS.orders, []);
    if (!Array.isArray(stored)) return null;
    return stored.find((entry) => entry.id === orderId) ?? null;
  }, [location.state, orderId]);

  useDocumentTitle(order ? 'Order confirmed' : 'Order not found');

  if (!order) {
    return (
      <section className="section-pad">
        <div className="container-page">
          <EmptyState
            icon={FiPackage}
            eyebrow="Order not found"
            title="We cannot find that confirmation."
            description="Order records live only in this browser. If you cleared your site data or opened a different device, the order will not be here."
            action={
              <Link to="/shop" className={buttonClasses({ variant: 'primary', size: 'md' })}>
                Back to the collection
                <FiArrowRight className="h-4 w-4" />
              </Link>
            }
          />
        </div>
      </section>
    );
  }

  const storedTotals = order.totals ?? {};
  const fallbackTotals = computeTotals(order.items ?? [], order.couponCode, {
    deliveryMethod: order.deliveryMethod ?? 'standard',
    paymentMethod: order.paymentMethod === 'cod' ? 'cod' : 'prepaid',
  });
  const totals = { ...fallbackTotals, ...storedTotals };
  const firstName = String(order.customer?.fullName ?? 'there').split(' ')[0];
  const itemCount =
    totals.itemCount ?? (order.items ?? []).reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <section className="grain relative overflow-hidden bg-caspian-950 text-pearl-50">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-caspian-950 via-caspian-900 to-lagoon-500/35"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full border border-champagne-500/20"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-champagne-500/8 blur-3xl"
        />
        <div className="container-page relative py-12 sm:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <span className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-champagne-500/40 bg-champagne-500/10 text-champagne-300">
              <span className="absolute inset-2 rounded-full border border-champagne-500/25" />
              <FiCheck className="h-8 w-8 animate-pop" aria-hidden="true" />
            </span>
            <p className="eyebrow-light mt-6">Order confirmed</p>
            <h1 className="mt-4 font-display text-4xl leading-[0.98] text-pearl-50 sm:text-6xl">
              Thank you, {firstName}.
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-pearl-100/65">
              Your order is with us. A confirmation would normally arrive by email at{' '}
              <span className="text-champagne-300">{order.customer?.email}</span>. In this demo,
              keep this page as your receipt.
            </p>
            <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-full border border-pearl-50/15 bg-pearl-50/5 px-5 py-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-pearl-100/65">
              <span>
                Order <span className="text-champagne-300">{order.id}</span>
              </span>
              <span className="h-1 w-1 rounded-full bg-pearl-100/25" aria-hidden="true" />
              <span>{formatDateTime(order.placedAt)}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page section-pad">
        <div className="grid gap-7 lg:grid-cols-[1fr_22rem] lg:items-start lg:gap-9">
          <div className="space-y-4">
            <div className="rounded-[1.5rem] border border-caspian-900/8 bg-white p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-champagne-700">
                    Your pieces
                  </p>
                  <h2 className="mt-1 font-display text-2xl text-caspian-950">
                    {itemCount} {itemCount === 1 ? 'piece' : 'pieces'}, on their way to you
                  </h2>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-caspian-100/70 px-2.5 py-1 text-[0.56rem] font-bold uppercase tracking-[0.08em] text-caspian-800">
                  <FiTruck className="h-3 w-3" aria-hidden="true" />
                  {order.deliveryLabel ?? 'Standard delivery'}
                </span>
              </div>

              <ul className="mt-5 divide-y divide-caspian-900/8">
                {(order.items ?? []).map((item) => (
                  <li key={item.id} className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0">
                    <Link
                      to={`/product/${item.id}`}
                      className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-pearl-200 p-1.5"
                    >
                      <ProductImage
                        src={item.image}
                        alt={item.title}
                        imgClassName="mix-blend-multiply"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-xs font-semibold text-caspian-950">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-[0.62rem] text-ink-500">
                        {item.categoryLabel} · Qty {item.quantity}
                      </p>
                    </div>
                    <p className="shrink-0 text-xs font-semibold tabular-nums text-caspian-950">
                      {formatINR(item.price * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.4rem] border border-caspian-900/8 bg-white p-5">
                <p className="flex items-center gap-2 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-caspian-900">
                  <FiMapPin className="h-3.5 w-3.5 text-champagne-600" aria-hidden="true" />
                  Delivering to
                </p>
                <p className="mt-3 text-sm font-semibold text-caspian-950">
                  {order.customer?.fullName}
                </p>
                <p className="mt-1 text-[0.72rem] leading-6 text-ink-500">
                  {order.address?.address}
                  {order.address?.landmark ? `, ${order.address.landmark}` : ''}
                  <br />
                  {order.address?.city}, {order.address?.state} {order.address?.pincode}
                  <br />
                  {order.customer?.phone}
                </p>
                <p className="mt-3 border-t border-caspian-900/8 pt-3 text-[0.68rem] text-caspian-700">
                  Estimated arrival{' '}
                  <strong className="font-semibold text-caspian-950">
                    {formatDate(order.eta)}
                  </strong>
                </p>
              </div>

              <div className="rounded-[1.4rem] border border-caspian-900/8 bg-white p-5">
                <p className="flex items-center gap-2 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-caspian-900">
                  <FiCreditCard className="h-3.5 w-3.5 text-champagne-600" aria-hidden="true" />
                  Payment
                </p>
                <p className="mt-3 text-sm font-semibold text-caspian-950">{order.paymentLabel}</p>
                <p className="mt-1 text-[0.72rem] leading-6 text-ink-500">
                  {order.paymentMethod === 'cod'
                    ? 'Pay in cash when your order arrives.'
                    : order.paymentMethod === 'card' && order.cardLast4
                      ? `Card ending ${order.cardLast4}.`
                      : order.paymentMethod === 'upi' && order.upiMasked
                        ? `${order.upiMasked}.`
                        : 'Paid securely in this demonstration.'}
                </p>
                <p className="mt-3 border-t border-caspian-900/8 pt-3 text-[0.68rem] text-ink-500">
                  This is a simulated payment. No money has moved.
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <a
                    href={`mailto:hello@ecaspian.com?subject=Order%20${order.id}`}
                    className="inline-flex items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-[0.08em] text-caspian-900 underline decoration-champagne-500/40 underline-offset-2 hover:text-champagne-700"
                  >
                    <FiMail className="h-3 w-3" />
                    Ask about this order
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-caspian-900/8 bg-pearl-200/60 p-5 sm:p-6">
              <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-caspian-700">
                What happens next
              </p>
              <ol className="mt-4 space-y-4">
                {TIMELINE.map((step, index) => {
                  const done = index === 0;
                  return (
                    <li key={step.id} className="flex gap-3">
                      <span
                        className={
                          done
                            ? 'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-caspian-900 text-pearl-50'
                            : 'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-caspian-900/15 bg-white text-[0.55rem] font-bold text-ink-500'
                        }
                      >
                        {done ? <FiCheck className="h-3 w-3" aria-hidden="true" /> : index + 1}
                      </span>
                      <div>
                        <p
                          className={
                            done
                              ? 'text-xs font-semibold text-caspian-950'
                              : 'text-xs font-semibold text-ink-500'
                          }
                        >
                          {step.label}
                        </p>
                        <p className="mt-0.5 text-[0.66rem] leading-5 text-ink-500">{step.note}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28">
            <div className="rounded-[1.5rem] border border-caspian-900/10 bg-white p-5 shadow-[0_18px_50px_-40px_rgba(6,42,49,.5)]">
              <h2 className="border-b border-caspian-900/8 pb-3 font-display text-2xl text-caspian-950">
                Receipt
              </h2>
              <dl className="mt-4 space-y-2.5 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-500">Subtotal</dt>
                  <dd className="font-semibold tabular-nums text-caspian-950">
                    {formatINR(totals.subtotal)}
                  </dd>
                </div>
                {totals.couponDiscount > 0 ? (
                  <div className="flex justify-between gap-3">
                    <dt className="text-ink-500">Coupon {order.couponCode}</dt>
                    <dd className="font-semibold tabular-nums text-terracotta-600">
                      −{formatINR(totals.couponDiscount)}
                    </dd>
                  </div>
                ) : null}
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-500">Delivery</dt>
                  <dd className="font-semibold tabular-nums text-caspian-950">
                    {totals.deliveryFee === 0 ? 'Complimentary' : formatINR(totals.deliveryFee)}
                  </dd>
                </div>
                {totals.codFee > 0 ? (
                  <div className="flex justify-between gap-3">
                    <dt className="text-ink-500">COD fee</dt>
                    <dd className="font-semibold tabular-nums text-caspian-950">
                      {formatINR(totals.codFee)}
                    </dd>
                  </div>
                ) : null}
                <div className="flex items-end justify-between gap-3 border-t border-caspian-900/10 pt-3">
                  <dt className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-ink-500">
                    Total paid
                  </dt>
                  <dd className="font-display text-3xl leading-none tabular-nums text-caspian-950">
                    {formatINR(totals.total)}
                  </dd>
                </div>
              </dl>
              {totals.totalSavings > 0 ? (
                <p className="mt-2 text-right text-[0.62rem] font-semibold text-caspian-700">
                  You saved {formatINR(totals.totalSavings)}
                </p>
              ) : null}

              <div className="mt-5 space-y-2">
                <Link
                  to="/shop"
                  className={buttonClasses({ variant: 'primary', size: 'md', fullWidth: true })}
                >
                  Continue shopping
                  <FiArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/wishlist"
                  className={buttonClasses({ variant: 'outline', size: 'md', fullWidth: true })}
                >
                  <FiHeart className="h-4 w-4" />
                  Wishlist{wishlistCount ? ` (${wishlistCount})` : ''}
                </Link>
              </div>
              <div className="mt-5 border-t border-caspian-900/8 pt-4 text-center">
                <BrandLogo compact className="opacity-50" />
                <p className="mt-3 text-[0.6rem] leading-4 text-ink-500">
                  Thank you for shopping small and considered.
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              fullWidth
              className="mt-3"
              onClick={() => window.print()}
            >
              Print this receipt
            </Button>
          </aside>
        </div>
      </section>
    </>
  );
}
