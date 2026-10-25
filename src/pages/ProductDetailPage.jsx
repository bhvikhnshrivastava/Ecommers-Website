import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  FiArrowRight,
  FiCheck,
  FiChevronRight,
  FiHeart,
  FiRefreshCw,
  FiShield,
  FiShoppingBag,
  FiTruck,
} from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { loadCatalog } from '@/redux/productsSlice';
import { addItem, setQuantity as setCartQuantity } from '@/redux/cartSlice';
import { toggleWishlist } from '@/redux/wishlistSlice';
import { addToast } from '@/redux/uiSlice';
import {
  selectCatalogError,
  selectCatalogStatus,
  selectCartQuantity,
  selectIsInCart,
  selectIsWishlisted,
  selectProductById,
  selectProducts,
} from '@/redux/selectors';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { useReducedMotion } from '@/hooks/useMediaQuery';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Button, { buttonClasses } from '@/components/common/Button';
import Price from '@/components/common/Price';
import Rating from '@/components/common/Rating';
import ProductImage from '@/components/common/ProductImage';
import QuantityStepper from '@/components/common/QuantityStepper';
import PaymentBadges from '@/components/common/PaymentBadges';
import Accordion from '@/components/common/Accordion';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import ProductGrid from '@/components/product/ProductGrid';
import PincodeCheck from '@/components/product/PincodeCheck';
import ReviewSection from '@/components/product/ReviewSection';
import SectionHeading from '@/components/common/SectionHeading';
import { Skeleton } from '@/components/common/Skeleton';
import { CATEGORY_META } from '@/data/categories';
import { formatINR } from '@/utils/currency';
import { cn } from '@/utils/cn';

function ProductSkeleton() {
  return (
    <div className="container-page py-8 sm:py-12">
      <Skeleton className="h-3 w-56 rounded-full" />
      <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <Skeleton className="aspect-square w-full rounded-[2rem]" />
        <div className="space-y-4">
          <Skeleton className="h-2.5 w-24 rounded-full" />
          <Skeleton className="h-10 w-4/5 rounded-xl" />
          <Skeleton className="h-4 w-36 rounded-full" />
          <Skeleton className="h-8 w-52 rounded-full" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const product = useAppSelector((state) => selectProductById(state, id));
  const allProducts = useAppSelector(selectProducts);
  const status = useAppSelector(selectCatalogStatus);
  const error = useAppSelector(selectCatalogError);
  const inCart = useAppSelector((state) => (product ? selectIsInCart(state, product.id) : false));
  const cartQuantity = useAppSelector((state) =>
    product ? selectCartQuantity(state, product.id) : 0,
  );
  const wishlisted = useAppSelector((state) =>
    product ? selectIsWishlisted(state, product.id) : false,
  );
  const reducedMotion = useReducedMotion();
  const { add: addRecentlyViewed } = useRecentlyViewed();

  const [quantity, setQuantity] = useState(1);
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 });

  useDocumentTitle(product?.title ?? 'Product');

  useEffect(() => {
    if (status === 'idle') dispatch(loadCatalog());
  }, [dispatch, status]);

  useEffect(() => {
    if (product) addRecentlyViewed(product.id);
    setQuantity(1);
    setZoom({ active: false, x: 50, y: 50 });
  }, [product, addRecentlyViewed]);

  const related = useMemo(() => {
    if (!product) return [];
    const sameCategory = allProducts.filter(
      (entry) => entry.category === product.category && entry.id !== product.id,
    );
    const pool =
      sameCategory.length >= 3
        ? sameCategory
        : allProducts.filter((entry) => entry.id !== product.id);
    return [...pool].sort((a, b) => b.rating - a.rating).slice(0, 4);
  }, [allProducts, product]);

  const loading = (status === 'idle' || status === 'loading') && !product;

  if (loading) return <ProductSkeleton />;

  if (status === 'failed' && !product) {
    return (
      <section className="section-pad">
        <div className="container-page">
          <ErrorState
            title="This piece is taking a moment"
            description={error || 'We could not reach the catalogue. Please try again.'}
            onRetry={() => dispatch(loadCatalog({ force: true }))}
          />
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="section-pad">
        <div className="container-page">
          <EmptyState
            icon={FiShoppingBag}
            eyebrow="Piece not found"
            title="This one has left the shelf."
            description="The piece you were looking for may have sold out or moved. There is still plenty to see."
            action={
              <Link to="/shop" className="link-underline">
                Browse the collection
                <FiChevronRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
        </div>
      </section>
    );
  }

  const category = CATEGORY_META[product.category];
  const maxQuantity = Math.max(1, product.stock ?? 10);
  const remaining = Math.max(0, maxQuantity - cartQuantity);

  const handleAdd = () => {
    if (remaining <= 0) {
      dispatch(
        addToast({ type: 'info', message: 'You already have every piece we have in stock.' }),
      );
      return;
    }
    const amount = Math.min(quantity, remaining);
    if (inCart) {
      dispatch(
        setCartQuantity({ id: product.id, quantity: Math.min(cartQuantity + amount, maxQuantity) }),
      );
    } else {
      dispatch(addItem(product));
      if (amount > 1) {
        dispatch(setCartQuantity({ id: product.id, quantity: amount }));
      }
    }
    dispatch(
      addToast({
        title: 'Added to your bag',
        message: `${amount > 1 ? `${amount} × ` : ''}${product.title}`,
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

  const accordionItems = [
    {
      id: 'delivery',
      question: 'Delivery & returns',
      answer: `${product.shipping ?? category?.shipping} ${product.returnPolicy ?? category?.returnPolicy} Orders over ₹999 ship complimentary; below that, standard delivery is ₹79 and express is ₹99.`,
    },
    {
      id: 'details',
      question: 'The details',
      answer: `SKU ${product.sku}. Category: ${product.categoryLabel}. ${product.warranty ?? category?.warranty}. ${product.description}`,
    },
    {
      id: 'care',
      question: 'Caring for your piece',
      answer: product.care ?? category?.care ?? 'Follow the care notes included with your piece.',
    },
    {
      id: 'packaging',
      question: 'Packing & gifting',
      answer:
        'Every order arrives in recyclable Ecaspian packaging. Jewellery is gift-wrapped in a signature pouch at no extra cost. If you would like a handwritten note, write to hello@ecaspian.com with your order number.',
    },
  ];

  return (
    <>
      <div className="border-b border-caspian-900/8 bg-pearl-200/40">
        <div className="container-page py-4">
          <Breadcrumbs
            items={[
              { label: 'Shop', to: '/shop' },
              { label: product.categoryLabel, to: `/category/${product.category}` },
              { label: product.title },
            ]}
          />
        </div>
      </div>

      <section className="container-page py-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
          <div>
            <div
              className="group relative overflow-hidden rounded-[1.75rem] border border-caspian-900/10 bg-gradient-to-b from-white via-pearl-100 to-pearl-200 p-6 sm:rounded-[2rem] sm:p-10"
              onMouseEnter={() => setZoom((current) => ({ ...current, active: true }))}
              onMouseLeave={() => setZoom({ active: false, x: 50, y: 50 })}
              onMouseMove={(event) => {
                const bounds = event.currentTarget.getBoundingClientRect();
                const x = ((event.clientX - bounds.left) / bounds.width) * 100;
                const y = ((event.clientY - bounds.top) / bounds.height) * 100;
                setZoom({ active: true, x, y });
              }}
            >
              <div className="absolute left-5 top-5 z-10 flex flex-col gap-2">
                {product.discount > 0 ? (
                  <span className="rounded-full bg-caspian-900 px-3 py-1.5 text-[0.58rem] font-bold uppercase tracking-[0.1em] text-pearl-50">
                    −{product.discount}% this week
                  </span>
                ) : null}
                {product.lowStock ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[0.56rem] font-semibold uppercase tracking-[0.08em] text-caspian-900 backdrop-blur">
                    <span className="h-1.5 w-1.5 rounded-full bg-terracotta-500" />
                    Only {product.stock} left
                  </span>
                ) : null}
              </div>

              <div className="relative mx-auto aspect-square max-w-[30rem]">
                <div
                  className="h-full w-full transition-transform duration-500 ease-out"
                  style={
                    zoom.active && !reducedMotion
                      ? {
                          transform: 'scale(1.45)',
                          transformOrigin: `${zoom.x}% ${zoom.y}%`,
                        }
                      : undefined
                  }
                >
                  <ProductImage
                    src={product.image}
                    alt={product.title}
                    loading="eager"
                    fetchPriority="high"
                    imgClassName="mix-blend-multiply"
                  />
                </div>
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-6">
                <span className="rounded-full border border-caspian-900/10 bg-white/85 px-3 py-1.5 text-[0.54rem] font-bold uppercase tracking-[0.16em] text-ink-500 backdrop-blur">
                  {product.sku}
                </span>
                <span className="hidden rounded-full border border-caspian-900/10 bg-white/85 px-3 py-1.5 text-[0.54rem] font-semibold uppercase tracking-[0.12em] text-ink-500 backdrop-blur sm:block">
                  Hover to look closer
                </span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2.5">
              {[
                { Icon: FiTruck, title: 'Delivered with care', note: 'Free over ₹999' },
                { Icon: FiRefreshCw, title: '7-day returns', note: 'Uncomplicated' },
                { Icon: FiShield, title: 'Secure checkout', note: 'Trusted partners' },
              ].map(({ Icon, title, note }) => (
                <div
                  key={title}
                  className="rounded-xl border border-caspian-900/8 bg-white/70 p-3 text-center sm:text-left"
                >
                  <Icon className="mx-auto h-4 w-4 text-champagne-600 sm:mx-0" aria-hidden="true" />
                  <p className="mt-2 text-[0.62rem] font-semibold text-caspian-950">{title}</p>
                  <p className="mt-0.5 text-[0.56rem] uppercase tracking-[0.08em] text-ink-500">
                    {note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to={`/category/${product.category}`}
                className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-champagne-700 transition-colors hover:text-caspian-900"
              >
                {product.categoryLabel}
              </Link>
              <span className="h-1 w-1 rounded-full bg-caspian-900/20" aria-hidden="true" />
              <span className="text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-ink-500">
                {product.stock > 0 ? 'In stock' : 'Out of stock'}
              </span>
            </div>

            <h1 className="mt-3 font-display text-4xl leading-[1.02] text-caspian-950 sm:text-[3.1rem]">
              {product.title}
            </h1>

            <a
              href="#reviews"
              className="mt-3 inline-flex items-center gap-2 text-ink-500 transition-colors hover:text-caspian-900"
            >
              <Rating value={product.rating} count={product.reviewCount} size="sm" />
              <span className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] underline decoration-caspian-900/20 underline-offset-4">
                Read the reviews
              </span>
            </a>

            <div className="mt-5 rounded-2xl border border-caspian-900/8 bg-white px-4 py-4 sm:px-5">
              <Price
                price={product.price}
                originalPrice={product.originalPrice}
                discount={product.discount}
                size="lg"
              />
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-caspian-900/8 pt-3 text-[0.65rem] text-ink-500">
                <span>
                  You save{' '}
                  <strong className="font-semibold text-terracotta-600">
                    ₹{product.savings.toLocaleString('en-IN')}
                  </strong>
                </span>
                <span className="h-1 w-1 rounded-full bg-caspian-900/15" aria-hidden="true" />
                <span>Inclusive of all taxes</span>
                <span className="h-1 w-1 rounded-full bg-caspian-900/15" aria-hidden="true" />
                <span className="inline-flex items-center gap-1 font-semibold text-caspian-700">
                  <FiCheck className="h-3 w-3" aria-hidden="true" />
                  ECASP10 applies at checkout
                </span>
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-ink-500">{product.description}</p>

            <ul className="mt-4 grid gap-1.5 sm:grid-cols-2">
              {product.keyFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-xs leading-5 text-ink-700">
                  <span className="mt-1 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-champagne-100 text-champagne-700">
                    <FiCheck className="h-2.5 w-2.5" aria-hidden="true" />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-6 space-y-3 border-t border-caspian-900/10 pt-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-caspian-900">
                  Quantity
                </span>
                <QuantityStepper
                  value={quantity}
                  onChange={setQuantity}
                  min={1}
                  max={Math.max(1, remaining)}
                />
                {inCart ? (
                  <span className="text-[0.65rem] text-ink-500">
                    {cartQuantity} already in your bag
                  </span>
                ) : null}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                {inCart ? (
                  <>
                    <Link
                      to="/cart"
                      className={buttonClasses({
                        variant: 'primary',
                        size: 'lg',
                        className: 'flex-1',
                      })}
                    >
                      Go to cart
                      <FiArrowRight className="h-4 w-4" />
                    </Link>
                    <Button variant="outline" size="lg" onClick={handleAdd} className="sm:px-6">
                      <FiShoppingBag className="h-4 w-4" />
                      Add more
                    </Button>
                  </>
                ) : (
                  <Button
                    size="lg"
                    onClick={handleAdd}
                    disabled={remaining <= 0}
                    className="flex-1"
                  >
                    <FiShoppingBag className="h-4 w-4" />
                    Add to cart
                  </Button>
                )}
                <Button
                  variant={wishlisted ? 'secondary' : 'outline'}
                  size="lg"
                  onClick={handleWishlist}
                  aria-pressed={wishlisted}
                  className={cn(
                    'sm:w-auto',
                    wishlisted && 'border-terracotta-500/30 text-terracotta-600',
                  )}
                >
                  <FiHeart className={cn('h-4 w-4', wishlisted && 'fill-current')} />
                  {wishlisted ? 'Saved' : 'Wishlist'}
                </Button>
              </div>

              {remaining <= 0 ? (
                <p className="text-xs text-terracotta-600">
                  Every available piece is in your bag. We can let you know if more arrive.
                </p>
              ) : null}
            </div>

            <div className="mt-4">
              <PincodeCheck />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-pearl-200/60 px-4 py-3">
              <span className="text-[0.58rem] font-bold uppercase tracking-[0.16em] text-ink-500">
                Pay your way
              </span>
              <PaymentBadges />
            </div>

            <div className="mt-6">
              <Accordion items={accordionItems} defaultOpenId="delivery" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-caspian-900/8 bg-pearl-200/45">
        <div className="container-page section-pad">
          <ReviewSection product={product} />
        </div>
      </section>

      {related.length > 0 ? (
        <section className="section-pad">
          <div className="container-page">
            <SectionHeading
              eyebrow="You may also like"
              title="A few more quiet things."
              description="Pieces chosen from the same corner of the store, or close enough in spirit."
              action={
                <Link to={`/category/${product.category}`} className="link-underline">
                  More {product.categoryLabel.toLowerCase()}
                  <FiChevronRight className="h-3.5 w-3.5" />
                </Link>
              }
            />
            <div className="mt-8">
              <ProductGrid products={related} />
            </div>
          </div>
        </section>
      ) : null}

      <div className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-caspian-900/10 bg-pearl-50/95 px-4 py-2.5 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.62rem] font-semibold text-ink-700">{product.title}</p>
            <p className="mt-0.5 text-sm font-semibold tabular-nums text-caspian-950">
              {formatINR(product.price)}
              <span className="ml-1.5 text-[0.6rem] font-normal text-ink-500 line-through">
                {formatINR(product.originalPrice)}
              </span>
            </p>
          </div>
          {inCart ? (
            <Link
              to="/cart"
              className={buttonClasses({ variant: 'primary', size: 'sm', className: 'shrink-0' })}
            >
              Go to cart
              <FiArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <Button size="sm" onClick={handleAdd} className="shrink-0">
              Add to cart
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
