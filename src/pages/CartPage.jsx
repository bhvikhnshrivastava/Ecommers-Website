import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck, FiHeart, FiShoppingBag, FiTrash2, FiTruck } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { loadCatalog } from '@/redux/productsSlice';
import { clearCart } from '@/redux/cartSlice';
import { addToast } from '@/redux/uiSlice';
import {
  selectAuthUser,
  selectCartCount,
  selectCartCoupon,
  selectCartItems,
  selectCatalogStatus,
  selectTopRated,
} from '@/redux/selectors';
import { computeTotals } from '@/utils/orderTotals';
import { formatINR } from '@/utils/currency';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Button, { buttonClasses } from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import Modal from '@/components/common/Modal';
import PaymentBadges from '@/components/common/PaymentBadges';
import CartItemRow from '@/components/cart/CartItemRow';
import CouponForm from '@/components/cart/CouponForm';
import OrderSummary from '@/components/cart/OrderSummary';
import ProductGrid from '@/components/product/ProductGrid';
import SectionHeading from '@/components/common/SectionHeading';

export default function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const coupon = useAppSelector(selectCartCoupon);
  const count = useAppSelector(selectCartCount);
  const user = useAppSelector(selectAuthUser);
  const status = useAppSelector(selectCatalogStatus);
  const topRated = useAppSelector(selectTopRated);
  const [confirmClear, setConfirmClear] = useState(false);

  useDocumentTitle('Your bag');

  useEffect(() => {
    if (status === 'idle') dispatch(loadCatalog());
  }, [dispatch, status]);

  const totals = computeTotals(items, coupon);
  const recommendations = topRated.filter(
    (product) => !items.some((item) => item.id === product.id),
  );
  const progress = Math.min(
    100,
    Math.round((totals.subtotal / totals.freeDeliveryThreshold) * 100),
  );

  const handleClear = () => {
    dispatch(clearCart());
    setConfirmClear(false);
    dispatch(addToast({ type: 'info', message: 'Your bag is empty again.' }));
  };

  return (
    <>
      <section className="border-b border-caspian-900/8 bg-pearl-200/50">
        <div className="container-page py-7 sm:py-9">
          <Breadcrumbs items={[{ label: 'Shopping bag' }]} />
          <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow">Almost yours</p>
              <h1 className="mt-2 font-display text-4xl text-caspian-950 sm:text-5xl">
                Your bag{count ? ` (${count})` : ''}
              </h1>
              {items.length > 0 ? (
                <p className="mt-2 text-sm text-ink-500">
                  A considered few. We will hold them for you.
                </p>
              ) : null}
            </div>
            <div className="flex items-center gap-4">
              {items.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  className="inline-flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-ink-500 transition-colors hover:text-terracotta-600"
                >
                  <FiTrash2 className="h-3.5 w-3.5" />
                  Empty bag
                </button>
              ) : null}
              <Link to="/shop" className="link-underline">
                Continue shopping
                <FiArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          {items.length === 0 ? (
            <EmptyState
              icon={FiShoppingBag}
              eyebrow="Your bag is quiet"
              title="Nothing in here yet."
              description="Start with a collection, save something to your wishlist, or let us show you the pieces people are loving this week."
              action={
                <div className="flex flex-wrap justify-center gap-2">
                  <Link to="/shop" className={buttonClasses({ variant: 'primary', size: 'md' })}>
                    Explore the collection
                    <FiArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/wishlist"
                    className={buttonClasses({ variant: 'outline', size: 'md' })}
                  >
                    <FiHeart className="h-4 w-4" />
                    Your wishlist
                  </Link>
                </div>
              }
            />
          ) : (
            <div className="grid gap-7 lg:grid-cols-[1fr_23rem] lg:items-start lg:gap-9">
              <div>
                <div className="rounded-[1.5rem] border border-caspian-900/8 bg-white p-4 sm:p-6">
                  <div className="mb-5 rounded-xl bg-pearl-200/60 p-3.5">
                    <p className="flex items-center gap-2 text-[0.68rem] font-semibold text-caspian-900">
                      <FiTruck className="h-4 w-4 shrink-0 text-caspian-700" aria-hidden="true" />
                      {totals.qualifiesForFreeDelivery
                        ? 'Complimentary delivery is included with this order.'
                        : `You are ${formatINR(totals.freeDeliveryRemaining)} away from complimentary delivery.`}
                    </p>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-white">
                      <div
                        className="h-full rounded-full bg-champagne-500 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    {items.map((item) => (
                      <CartItemRow key={item.id} item={item} />
                    ))}
                  </div>

                  <div className="mt-5 flex flex-col gap-3 border-t border-caspian-900/8 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="flex items-center gap-2 text-[0.66rem] leading-5 text-ink-500">
                      <FiCheck
                        className="h-3.5 w-3.5 shrink-0 text-caspian-700"
                        aria-hidden="true"
                      />
                      Easy 7-day returns on unused pieces in original packaging.
                    </p>
                    <Link
                      to="/shop"
                      className="shrink-0 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-caspian-900 underline decoration-champagne-500 underline-offset-4 hover:text-champagne-700"
                    >
                      Add more pieces
                    </Link>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <CouponForm subtotal={totals.subtotal} />

                  <div className="rounded-[1.4rem] border border-caspian-900/8 bg-pearl-200/50 p-4 sm:p-5">
                    <p className="flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-caspian-900">
                      <FiHeart className="h-3.5 w-3.5 text-champagne-600" aria-hidden="true" />A
                      note on gifting
                    </p>
                    <p className="mt-2 text-[0.68rem] leading-5 text-ink-500">
                      Every order is wrapped in recyclable Ecaspian packaging. Jewellery arrives in
                      a signature pouch; add a handwritten note at checkout, free of charge.
                    </p>
                    <Link to="/wishlist" className="link-underline mt-3">
                      Look at your saved pieces
                      <FiArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>

              <aside className="lg:sticky lg:top-28">
                <OrderSummary
                  items={items}
                  couponCode={coupon}
                  footnote={
                    user
                      ? 'Signed in as ' + user.email + '.'
                      : 'You will be asked to sign in before payment. This is a demo store — no real payment is taken.'
                  }
                >
                  <Link
                    to="/checkout"
                    className={buttonClasses({ variant: 'primary', size: 'lg', fullWidth: true })}
                  >
                    Proceed to checkout
                    <FiArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/shop"
                    className={buttonClasses({ variant: 'ghost', size: 'sm', fullWidth: true })}
                  >
                    Continue shopping
                  </Link>
                </OrderSummary>

                <div className="mt-3 rounded-xl border border-caspian-900/8 bg-white/60 p-3.5">
                  <p className="text-[0.58rem] font-bold uppercase tracking-[0.16em] text-ink-500">
                    We accept
                  </p>
                  <PaymentBadges className="mt-2" />
                  <p className="mt-2.5 text-[0.6rem] leading-4 text-ink-500">
                    Prices are in INR and include all taxes. This storefront is a demonstration.
                  </p>
                </div>
              </aside>
            </div>
          )}

          {recommendations.length > 0 ? (
            <div className="mt-16 border-t border-caspian-900/10 pt-10">
              <SectionHeading
                eyebrow="One more look"
                title="Might sit nicely alongside."
                action={
                  <Link to="/shop" className="link-underline">
                    See all pieces
                    <FiArrowRight className="h-3.5 w-3.5" />
                  </Link>
                }
              />
              <div className="mt-7">
                <ProductGrid products={recommendations} />
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <Modal
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        title="Empty your bag?"
        description="Your wishlist and saved reviews will not be affected."
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setConfirmClear(false)}>
              Keep shopping
            </Button>
            <Button variant="danger" size="sm" onClick={handleClear}>
              Empty bag
            </Button>
          </div>
        }
      >
        <p className="text-sm leading-7 text-ink-500">
          Every piece will be removed from your bag. You can always find them again in the
          collection — or in your wishlist, if you saved them.
        </p>
      </Modal>
    </>
  );
}
