import { Link } from 'react-router-dom';
import { FiArrowRight, FiHeart, FiShoppingBag } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { addItem } from '@/redux/cartSlice';
import { removeFromWishlist, toggleWishlist } from '@/redux/wishlistSlice';
import { addToast } from '@/redux/uiSlice';
import { selectCartQuantity, selectIsInCart, selectIsWishlisted } from '@/redux/selectors';
import { buttonClasses } from '@/components/common/Button';
import Price from '@/components/common/Price';
import Rating from '@/components/common/Rating';
import ProductImage from '@/components/common/ProductImage';
import { cn } from '@/utils/cn';

export default function ProductCard({ product, variant = 'default' }) {
  const dispatch = useAppDispatch();
  const inCart = useAppSelector((state) => selectIsInCart(state, product.id));
  const wishlisted = useAppSelector((state) => selectIsWishlisted(state, product.id));
  const cartQuantity = useAppSelector((state) => selectCartQuantity(state, product.id));
  const atStockLimit = cartQuantity >= (product.stock ?? 10);

  if (!product) return null;

  const handleAdd = () => {
    dispatch(addItem(product));
    dispatch(
      addToast({
        title: 'Added to your bag',
        message: `${product.title} is waiting in your bag.`,
      }),
    );
  };

  const handleWishlist = () => {
    dispatch(toggleWishlist(product));
    dispatch(
      addToast({
        type: wishlisted ? 'info' : 'success',
        message: wishlisted ? 'Removed from your wishlist.' : 'Saved to your wishlist for later.',
      }),
    );
  };

  const handleMoveToCart = () => {
    dispatch(addItem(product));
    dispatch(removeFromWishlist(product.id));
    dispatch(
      addToast({
        title: 'Moved to your bag',
        message: `${product.title} is ready when you are.`,
      }),
    );
  };

  const action =
    variant === 'wishlist' && !inCart ? (
      <button
        type="button"
        onClick={handleMoveToCart}
        className={buttonClasses({
          variant: 'gold',
          size: 'sm',
          fullWidth: true,
          className: 'justify-between',
        })}
      >
        Move to bag
        <FiArrowRight className="h-3.5 w-3.5" />
      </button>
    ) : inCart ? (
      <Link
        to="/cart"
        className={buttonClasses({
          variant: 'outline',
          size: 'sm',
          fullWidth: true,
          className: 'justify-between',
        })}
      >
        Go to cart
        <FiArrowRight className="h-3.5 w-3.5" />
      </Link>
    ) : (
      <button
        type="button"
        onClick={handleAdd}
        disabled={atStockLimit}
        className={buttonClasses({
          variant: 'primary',
          size: 'sm',
          fullWidth: true,
          className: 'justify-between',
        })}
      >
        {atStockLimit ? 'Maximum in bag' : 'Add to cart'}
        <FiShoppingBag className="h-3.5 w-3.5" />
      </button>
    );

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-caspian-900/8 bg-white p-2.5 transition-all duration-500 hover:-translate-y-1 hover:border-caspian-900/15 hover:shadow-lift">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.05rem] bg-pearl-200">
        <Link
          to={`/product/${product.id}`}
          className="block h-full w-full"
          aria-label={`View ${product.title}`}
        >
          <ProductImage
            src={product.image}
            alt={product.title}
            imgClassName="mix-blend-multiply p-3 transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {product.discount > 0 ? (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-pearl-50/95 px-2 py-1 text-[0.56rem] font-bold uppercase tracking-[0.08em] text-terracotta-600 shadow-sm backdrop-blur">
            −{product.discount}%
          </span>
        ) : null}

        <button
          type="button"
          onClick={handleWishlist}
          aria-label={
            wishlisted
              ? `Remove ${product.title} from wishlist`
              : `Add ${product.title} to wishlist`
          }
          aria-pressed={wishlisted}
          className={cn(
            'absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border shadow-sm backdrop-blur transition-all duration-300',
            wishlisted
              ? 'border-terracotta-500/20 bg-terracotta-100 text-terracotta-500'
              : 'border-caspian-900/8 bg-pearl-50/90 text-caspian-800 hover:border-caspian-900/20 hover:bg-white',
          )}
        >
          <FiHeart className={cn('h-4 w-4', wishlisted && 'fill-current')} />
        </button>

        {product.lowStock ? (
          <span className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 rounded-full bg-white/90 px-2 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.08em] text-caspian-800 backdrop-blur">
            <span className="h-1 w-1 rounded-full bg-terracotta-500" />
            Only {product.stock} left
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-1.5 pb-1 pt-4">
        <div className="flex items-center justify-between gap-2">
          <Link
            to={`/category/${product.category}`}
            className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-ink-500 transition-colors hover:text-caspian-900"
          >
            {product.categoryLabel}
          </Link>
          <Rating value={product.rating} count={product.reviewCount} size="xs" />
        </div>

        <h3 className="mt-1.5 line-clamp-2 min-h-10 font-sans text-[0.86rem] font-semibold leading-5 text-caspian-950">
          <Link to={`/product/${product.id}`} className="transition-colors hover:text-caspian-700">
            {product.title}
          </Link>
        </h3>

        <div className="mt-2">
          <Price
            price={product.price}
            originalPrice={product.originalPrice}
            discount={product.discount}
            size="sm"
            showDiscount={false}
          />
        </div>

        <div className="mt-auto pt-3.5">{action}</div>
      </div>
    </article>
  );
}
