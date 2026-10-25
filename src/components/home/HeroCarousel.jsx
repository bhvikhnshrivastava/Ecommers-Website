import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiStar, FiTruck } from 'react-icons/fi';
import { useAppSelector } from '@/app/hooks';
import { selectProducts } from '@/redux/selectors';
import { HERO_SLIDES } from '@/data/constants';
import { buttonClasses } from '@/components/common/Button';
import ProductImage from '@/components/common/ProductImage';
import Rating from '@/components/common/Rating';
import { useReducedMotion } from '@/hooks/useMediaQuery';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { formatINR } from '@/utils/currency';
import { cn } from '@/utils/cn';

export default function HeroCarousel() {
  const products = useAppSelector(selectProducts);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();
  const scrollY = useScrollPosition();
  const touchStart = useRef(null);
  const slide = HERO_SLIDES[active];
  const product = products.find((item) => item.id === slide.productId);
  const total = HERO_SLIDES.length;
  const parallax = reducedMotion ? 0 : Math.min(scrollY, 700) * 0.055;

  useEffect(() => {
    if (paused || reducedMotion) return undefined;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % total);
    }, 7200);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion, total]);

  const goTo = (index) => setActive(((index % total) + total) % total);
  const next = () => goTo(active + 1);
  const previous = () => goTo(active - 1);

  return (
    <section
      className="grain relative overflow-hidden border-b border-caspian-900/8 bg-pearl-100 hero-wash"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={(event) => {
        touchStart.current = event.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchStart.current === null) return;
        const end = event.changedTouches[0]?.clientX ?? touchStart.current;
        const difference = touchStart.current - end;
        if (Math.abs(difference) > 45) {
          if (difference > 0) next();
          else previous();
        }
        touchStart.current = null;
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-16 h-80 w-80 rounded-full border border-champagne-500/20"
        style={{ transform: `translate3d(0, ${parallax}px, 0)` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-lagoon-500/8 blur-3xl"
        style={{ transform: `translate3d(0, ${-parallax}px, 0)` }}
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 180"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 top-0 h-40 w-full text-caspian-900/5"
      >
        <path
          d="M0,96 C240,16 420,160 720,84 C980,20 1160,140 1440,60"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M0,132 C260,52 480,172 760,100 C1020,34 1200,154 1440,80"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>

      <div className="container-page relative">
        <div className="grid min-h-[620px] items-center gap-10 py-10 sm:py-14 lg:min-h-[650px] lg:grid-cols-[1.02fr_0.98fr] lg:gap-8 lg:py-16">
          <div className="relative z-10 max-w-xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-champagne-500" aria-hidden="true" />
              <p className="eyebrow">{slide.eyebrow}</p>
            </div>

            <h1
              key={`title-${slide.id}`}
              className="mt-5 max-w-[15ch] font-display text-[2.9rem] leading-[0.92] font-medium tracking-[-0.025em] text-caspian-950 animate-slide-up sm:text-[3.7rem] lg:text-[4.4rem]"
            >
              {slide.title}
            </h1>

            <p
              key={`copy-${slide.id}`}
              className="mt-5 max-w-md text-sm leading-7 text-ink-500 animate-fade-in sm:text-[0.95rem]"
            >
              {slide.description}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-2.5">
              <Link to={slide.ctaTo} className={buttonClasses({ variant: 'primary', size: 'lg' })}>
                {slide.ctaLabel}
                <FiArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/shop" className={buttonClasses({ variant: 'outline', size: 'lg' })}>
                Browse the edit
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-ink-500">
              <span className="flex items-center gap-1.5">
                <FiTruck className="h-3.5 w-3.5 text-caspian-600" />
                Free delivery over ₹999
              </span>
              <span className="hidden h-1 w-1 rounded-full bg-champagne-500 sm:block" />
              <span>{slide.footnote}</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[25rem] lg:max-w-[27rem]">
            <div
              aria-hidden="true"
              className="absolute -inset-3 rounded-[999px_999px_2.5rem_2.5rem] border border-champagne-500/25 sm:-inset-4"
              style={{ transform: `translate3d(0, ${-parallax * 0.5}px, 0)` }}
            />
            <div className="relative arch-frame overflow-hidden border border-caspian-900/10 bg-gradient-to-b from-white via-pearl-50 to-pearl-200 px-7 pb-7 pt-16 shadow-soft sm:px-10 sm:pt-20">
              <div className="aspect-[4/5] w-full overflow-hidden">
                {product ? (
                  <ProductImage
                    src={product.image}
                    alt={product.title}
                    loading="eager"
                    fetchPriority="high"
                    imgClassName="mix-blend-multiply"
                  />
                ) : (
                  <div className="skeleton h-full w-full rounded-[2rem]" />
                )}
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-caspian-900/8 pt-4">
                <span className="text-[0.58rem] font-bold uppercase tracking-[0.2em] text-ink-500">
                  The Ecaspian edit
                </span>
                <span className="font-display text-lg text-caspian-900">
                  0{active + 1} <span className="text-ink-500/50">/ 0{total}</span>
                </span>
              </div>
            </div>

            {product ? (
              <div className="absolute -right-3 top-[22%] hidden rounded-2xl border border-caspian-900/10 bg-white/95 p-3 shadow-soft backdrop-blur animate-float-slow sm:block">
                <p className="text-[0.52rem] font-bold uppercase tracking-[0.18em] text-ink-500">
                  This week
                </p>
                <p className="mt-1 font-display text-2xl leading-none text-caspian-950">
                  {formatINR(product.price)}
                </p>
                <p className="mt-1 text-[0.58rem] text-ink-500 tabular-nums">
                  <span className="line-through">{formatINR(product.originalPrice)}</span>
                  <span className="ml-1.5 font-bold text-terracotta-500">
                    {product.discount}% off
                  </span>
                </p>
              </div>
            ) : null}

            {product ? (
              <div className="absolute -left-3 bottom-[17%] hidden rounded-2xl border border-caspian-900/10 bg-white/95 p-3 shadow-soft backdrop-blur animate-float sm:block">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-champagne-100 text-champagne-700">
                    <FiStar className="h-4 w-4 fill-current" />
                  </span>
                  <div>
                    <Rating value={product.rating} count={product.reviewCount} size="xs" />
                    <p className="mt-1 text-[0.56rem] font-semibold uppercase tracking-[0.08em] text-ink-500">
                      Loved by {product.reviewCount}+ people
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="absolute -bottom-5 right-7 hidden h-20 w-20 overflow-hidden rounded-full border-4 border-pearl-100 bg-pearl-200 p-2 shadow-soft md:block">
              {product ? (
                <ProductImage
                  src={product.image}
                  alt=""
                  imgClassName="mix-blend-multiply"
                  className="opacity-70"
                />
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-caspian-900/8 py-4 sm:py-5">
          <div
            className="flex items-center gap-2"
            role="tablist"
            aria-label="Choose a featured slide"
          >
            {HERO_SLIDES.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={index === active}
                aria-label={`Go to slide ${index + 1}: ${item.eyebrow}`}
                onClick={() => goTo(index)}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  index === active
                    ? 'w-8 bg-caspian-900'
                    : 'w-3 bg-caspian-900/20 hover:bg-caspian-900/40',
                )}
              />
            ))}
          </div>

          <p className="sr-only" aria-live="polite">
            Slide {active + 1} of {total}: {slide.title}
          </p>

          <div className="flex items-center gap-2">
            <span className="mr-2 hidden text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-ink-500 sm:block">
              {paused || reducedMotion ? 'Paused' : 'Moving slowly'}
            </span>
            <button
              type="button"
              onClick={previous}
              aria-label="Previous slide"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-caspian-900/15 text-caspian-900 transition-colors hover:border-caspian-900/40 hover:bg-white"
            >
              <FiArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-caspian-900/15 text-caspian-900 transition-colors hover:border-caspian-900/40 hover:bg-white"
            >
              <FiArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
