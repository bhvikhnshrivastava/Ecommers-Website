import { Link } from 'react-router-dom';
import { FiHeart, FiTrash2 } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { removeItem, setQuantity } from '@/redux/cartSlice';
import { toggleWishlist } from '@/redux/wishlistSlice';
import { addToast } from '@/redux/uiSlice';
import { selectIsWishlisted } from '@/redux/selectors';
import ProductImage from '@/components/common/ProductImage';
import Price from '@/components/common/Price';
import QuantityStepper from '@/components/common/QuantityStepper';
import { formatINR } from '@/utils/currency';

export default function CartItemRow({ item }) {
  const dispatch = useAppDispatch();
  const wishlisted = useAppSelector((state) => selectIsWishlisted(state, item.id));
  const lineTotal = Number(item.price) * Number(item.quantity);
  const maxQuantity = Math.max(1, Number(item.stock) || 10);

  const handleRemove = () => {
    dispatch(removeItem(item.id));
    dispatch(addToast({ type: 'info', message: `${item.title} removed from your bag.` }));
  };

  const handleSave = () => {
    if (!wishlisted) dispatch(toggleWishlist(item));
    dispatch(removeItem(item.id));
    dispatch(
      addToast({
        title: wishlisted ? 'Removed from bag' : 'Saved for later',
        message: wishlisted
          ? `${item.title} is no longer in your bag.`
          : `${item.title} is waiting in your wishlist.`,
      }),
    );
  };

  return (
    <article className="flex gap-3 border-b border-caspian-900/8 py-5 first:pt-0 sm:gap-4">
      <Link
        to={`/product/${item.id}`}
        className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-pearl-200 p-2 transition-colors hover:bg-pearl-300 sm:h-28 sm:w-28"
        aria-label={`View ${item.title}`}
      >
        <ProductImage src={item.image} alt={item.title} imgClassName="mix-blend-multiply" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[0.54rem] font-bold uppercase tracking-[0.16em] text-ink-500">
              {item.categoryLabel}
            </p>
            <h3 className="mt-1 line-clamp-2 font-sans text-[0.84rem] font-semibold leading-5 text-caspian-950">
              <Link to={`/product/${item.id}`} className="transition-colors hover:text-caspian-700">
                {item.title}
              </Link>
            </h3>
            <div className="mt-1.5">
              <Price
                price={item.price}
                originalPrice={item.originalPrice}
                discount={item.discount}
                size="sm"
                showDiscount={false}
              />
            </div>
          </div>
          <p className="shrink-0 font-sans text-sm font-semibold tabular-nums text-caspian-950">
            {formatINR(lineTotal)}
          </p>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <QuantityStepper
              value={item.quantity}
              min={1}
              max={maxQuantity}
              size="sm"
              onChange={(quantity) => dispatch(setQuantity({ id: item.id, quantity }))}
              label={`Quantity for ${item.title}`}
            />
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-[0.62rem] font-semibold text-ink-500 transition-colors hover:bg-caspian-900/5 hover:text-caspian-900"
            >
              <FiHeart className="h-3.5 w-3.5" />
              {wishlisted ? 'Saved' : 'Save for later'}
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-[0.62rem] font-semibold text-ink-500 transition-colors hover:bg-terracotta-100/60 hover:text-terracotta-600"
            >
              <FiTrash2 className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
          {item.quantity >= maxQuantity ? (
            <span className="text-[0.58rem] font-semibold uppercase tracking-[0.08em] text-terracotta-600">
              Maximum available
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
