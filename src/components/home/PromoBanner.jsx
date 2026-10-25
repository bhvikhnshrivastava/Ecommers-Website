import { Link } from 'react-router-dom';
import { FiArrowRight, FiShoppingBag, FiStar } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectProducts } from '@/redux/selectors';
import { addItem } from '@/redux/cartSlice';
import { addToast } from '@/redux/uiSlice';
import { buttonClasses } from '@/components/common/Button';
import ProductImage from '@/components/common/ProductImage';
import Rating from '@/components/common/Rating';
import Reveal from '@/components/common/Reveal';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { useReducedMotion } from '@/hooks/useMediaQuery';
import { PROMO_PRODUCT_ID } from '@/data/constants';
import { formatINR } from '@/utils/currency';

export default function PromoBanner() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const scrollY = useScrollPosition();
  const reducedMotion = useReducedMotion();

  const product = products.find((item) => item.id === PROMO_PRODUCT_ID);
  if (!product) return null;

  const drift = reducedMotion ? 0 : Math.min(24, Math.max(-12, (scrollY - 900) * 0.03));
  const saving = product.originalPrice - product.price;

  const handleAdd = () => {
    dispatch(addItem(product));
    dispatch(
      addToast({
        title: 'Added to your bag',
        message: `${product.title} is waiting for you at checkout.`,
      }),
    );
  };

  return (
    <section aria-labelledby="promo-heading" className="section-pad">
      <div className="container-page">
        <Reveal>
          <div className="grain relative overflow-hidden rounded-[2rem] bg-caspian-950 text-pearl-50 shadow-soft sm:rounded-[2.5rem]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-28 -top-32 h-96 w-96 rounded-full bg-lagoon-500/20 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-40 right-[18%] h-96 w-96 rounded-full bg-champagne-500/10 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-champagne-500/20 to-transparent"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-4 top-2 select-none font-display text-[11rem] leading-none text-pearl-50/[0.035] sm:right-4 sm:text-[16rem]"
            >
              VII
            </span>

            <div className="relative grid gap-10 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-14 lg:py-16">
              <div className="max-w-lg">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-champagne-500" aria-hidden="true" />
                  <p className="eyebrow-light">The object of the week</p>
                </div>
                <h2
                  id="promo-heading"
                  className="mt-4 font-display text-4xl leading-[0.98] text-pearl-50 sm:text-5xl"
                >
                  One small thing, considered closely.
                </h2>
                <p className="mt-4 text-[0.9rem] leading-7 text-pearl-100/65">
                  {product.title}. A piece our team has been quietly admiring all season — warm
                  gold, clean lines and the kind of weight that feels like it will stay with you.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-pearl-50/10 py-4">
                  <span className="text-3xl font-semibold tabular-nums text-pearl-50">
                    {formatINR(product.price)}
                  </span>
                  <span className="text-sm text-pearl-100/40 line-through tabular-nums">
                    {formatINR(product.originalPrice)}
                  </span>
                  <span className="rounded-full bg-champagne-500 px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.1em] text-caspian-950">
                    Save {formatINR(saving)}
                  </span>
                  <Rating value={product.rating} count={product.reviewCount} size="xs" light />
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-2.5">
                  <Link
                    to={`/product/${product.id}`}
                    className={buttonClasses({ variant: 'gold', size: 'md' })}
                  >
                    Discover the piece
                    <FiArrowRight className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={handleAdd}
                    className={buttonClasses({ variant: 'dark', size: 'md' })}
                  >
                    <FiShoppingBag className="h-4 w-4" />
                    Add to bag
                  </button>
                </div>

                <p className="mt-4 flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-champagne-300/80">
                  <FiStar className="h-3 w-3 fill-current" aria-hidden="true" />
                  Use code ECASP10 for 10% off, up to ₹500
                </p>
              </div>

              <div className="relative mx-auto w-full max-w-[23rem] lg:max-w-[25rem]">
                <div
                  aria-hidden="true"
                  className="absolute -inset-3 rounded-[999px_999px_2rem_2rem] border border-champagne-500/25"
                  style={{ transform: `translate3d(0, ${drift}px, 0)` }}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-x-10 -bottom-3 h-8 rounded-[50%] bg-caspian-950/60 blur-xl"
                />
                <div
                  className="arch-frame relative overflow-hidden border border-pearl-50/15 bg-gradient-to-b from-pearl-50 via-pearl-100 to-champagne-100 px-8 pb-6 pt-12"
                  style={{ transform: `translate3d(0, ${-drift * 0.4}px, 0)` }}
                >
                  <div className="aspect-square w-full">
                    <ProductImage
                      src={product.image}
                      alt={product.title}
                      imgClassName="mix-blend-multiply"
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-caspian-900/10 pt-3.5 text-caspian-950">
                    <span className="text-[0.56rem] font-bold uppercase tracking-[0.18em]">
                      {product.categoryLabel}
                    </span>
                    <span className="font-display text-lg">No. 0{product.id}</span>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-3 hidden rounded-2xl border border-pearl-50/15 bg-caspian-900/90 px-4 py-3 shadow-lift backdrop-blur sm:block">
                  <p className="text-[0.54rem] font-bold uppercase tracking-[0.18em] text-champagne-300">
                    Signature wrapping
                  </p>
                  <p className="mt-1 text-[0.68rem] text-pearl-100/70">Included with every piece</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
