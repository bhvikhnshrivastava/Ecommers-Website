import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiHeart, FiShoppingBag, FiTrash2 } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { addItem } from '@/redux/cartSlice';
import { clearWishlist } from '@/redux/wishlistSlice';
import { addToast } from '@/redux/uiSlice';
import { selectTopRated, selectWishlistCount, selectWishlistItems } from '@/redux/selectors';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { computeTotals } from '@/utils/orderTotals';
import { formatINR } from '@/utils/currency';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Button, { buttonClasses } from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import Modal from '@/components/common/Modal';
import ProductGrid from '@/components/product/ProductGrid';
import SectionHeading from '@/components/common/SectionHeading';

export default function WishlistPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectWishlistItems);
  const count = useAppSelector(selectWishlistCount);
  const topRated = useAppSelector(selectTopRated);
  const [confirmClear, setConfirmClear] = useState(false);

  useDocumentTitle('Your wishlist');

  const totals = computeTotals(items);
  const recommendations = topRated.filter(
    (product) => !items.some((item) => item.id === product.id),
  );

  const moveAllToBag = () => {
    items.forEach((item) => dispatch(addItem(item)));
    dispatch(clearWishlist());
    dispatch(
      addToast({
        title: 'Moved to your bag',
        message: `${items.length} ${items.length === 1 ? 'piece is' : 'pieces are'} waiting at checkout.`,
      }),
    );
  };

  const handleClear = () => {
    dispatch(clearWishlist());
    setConfirmClear(false);
    dispatch(addToast({ type: 'info', message: 'Your wishlist is empty again.' }));
  };

  return (
    <>
      <section className="border-b border-caspian-900/8 bg-pearl-200/50">
        <div className="container-page py-7 sm:py-9">
          <Breadcrumbs items={[{ label: 'Wishlist' }]} />
          <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Kept for later</p>
              <h1 className="mt-2 font-display text-4xl text-caspian-950 sm:text-5xl">
                Your wishlist{count ? ` (${count})` : ''}
              </h1>
              <p className="mt-2 max-w-lg text-sm leading-6 text-ink-500">
                A quiet place for the pieces you are still thinking about. Saved on this device,
                ready whenever you are.
              </p>
            </div>
            {items.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" onClick={moveAllToBag}>
                  <FiShoppingBag className="h-3.5 w-3.5" />
                  Move all to bag
                </Button>
                <Button variant="outline" size="sm" onClick={() => setConfirmClear(true)}>
                  <FiTrash2 className="h-3.5 w-3.5" />
                  Clear
                </Button>
              </div>
            ) : (
              <Link to="/shop" className="link-underline">
                Browse the collection
                <FiArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          {items.length === 0 ? (
            <EmptyState
              icon={FiHeart}
              eyebrow="Nothing saved yet"
              title="A wishlist is a lovely thing to start."
              description="Tap the heart on any piece and it will wait here for you, quietly, until you are ready."
              action={
                <Link to="/shop" className={buttonClasses({ variant: 'primary', size: 'md' })}>
                  Find something to love
                  <FiArrowRight className="h-4 w-4" />
                </Link>
              }
            />
          ) : (
            <>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-[0.65rem] text-ink-500">
                <p>
                  {count} {count === 1 ? 'piece' : 'pieces'} saved · if you took them all,{' '}
                  <span className="font-semibold text-caspian-900">
                    {formatINR(totals.subtotal)}
                  </span>
                </p>
                <p className="hidden sm:block">
                  Hearts are stored on this device, not shared with anyone.
                </p>
              </div>
              <ProductGrid products={items} variant="wishlist" />
            </>
          )}

          {recommendations.length > 0 ? (
            <div className="mt-16 border-t border-caspian-900/10 pt-10">
              <SectionHeading
                eyebrow="Still deciding?"
                title="The pieces everyone is looking at."
                description="A good place to begin if the wishlist feels a little too short."
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
        title="Clear your wishlist?"
        description="This only affects the pieces saved on this device."
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setConfirmClear(false)}>
              Keep them
            </Button>
            <Button variant="danger" size="sm" onClick={handleClear}>
              Clear wishlist
            </Button>
          </div>
        }
      >
        <p className="text-sm leading-7 text-ink-500">
          Every saved piece will be removed. You can always add them again from the collection.
        </p>
      </Modal>
    </>
  );
}
