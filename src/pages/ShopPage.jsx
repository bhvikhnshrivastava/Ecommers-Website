import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiTruck } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { loadCatalog } from '@/redux/productsSlice';
import {
  selectCatalogError,
  selectCatalogStatus,
  selectCategories,
  selectProducts,
} from '@/redux/selectors';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import ProductListing from '@/components/product/ProductListing';
import ErrorState from '@/components/common/ErrorState';
import { ProductGridSkeleton } from '@/components/common/Skeleton';
import { buttonClasses } from '@/components/common/Button';
import { BRAND } from '@/data/constants';
import { formatCount } from '@/utils/currency';
import { cn } from '@/utils/cn';

export default function ShopPage() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectCatalogStatus);
  const error = useAppSelector(selectCatalogError);
  const products = useAppSelector(selectProducts);
  const categories = useAppSelector(selectCategories);
  const [activeCategory, setActiveCategory] = useState('all');

  useDocumentTitle('Shop all');

  useEffect(() => {
    if (status === 'idle') dispatch(loadCatalog());
  }, [dispatch, status]);

  const loading = (status === 'idle' || status === 'loading') && products.length === 0;
  const failed = status === 'failed' && products.length === 0;

  const visible = useMemo(
    () =>
      activeCategory === 'all'
        ? products
        : products.filter((product) => product.category === activeCategory),
    [activeCategory, products],
  );

  const activeMeta = categories.find((category) => category.slug === activeCategory);

  return (
    <>
      <section className="grain relative overflow-hidden border-b border-caspian-900/8 bg-pearl-200/60 hero-wash">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full border border-champagne-500/20"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-8 right-6 select-none font-display text-[7rem] leading-none text-caspian-950/[0.04] sm:text-[11rem]"
        >
          SHOP
        </span>
        <div className="container-page relative py-9 sm:py-12">
          <Breadcrumbs items={[{ label: 'Shop all' }]} />
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="eyebrow">The collection</p>
              <h1 className="display-title mt-3 max-w-2xl">Everything, considered.</h1>
              <p className="body-copy mt-4 max-w-xl">
                Twenty pieces across four collections — each chosen for the way it looks, feels and
                fits into a real day. Filter slowly, take your time.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-caspian-900/10 pt-4 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
              <div>
                <p className="font-display text-3xl leading-none text-caspian-950">
                  {products.length ? formatCount(products.length) : '—'}
                </p>
                <p className="mt-1 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-ink-500">
                  Pieces in store
                </p>
              </div>
              <div>
                <p className="font-display text-3xl leading-none text-caspian-950">
                  {categories.length ? formatCount(categories.length) : '—'}
                </p>
                <p className="mt-1 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-ink-500">
                  Collections
                </p>
              </div>
              <p className="flex items-center gap-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-caspian-700">
                <FiTruck className="h-3.5 w-3.5" aria-hidden="true" />
                Free delivery over ₹999
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Filter by collection" className="border-b border-caspian-900/8 bg-white">
        <div className="container-page flex gap-2 overflow-x-auto py-3.5 hide-scrollbar">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            aria-pressed={activeCategory === 'all'}
            className={cn(
              'shrink-0 rounded-full border px-3.5 py-2 text-[0.62rem] font-bold uppercase tracking-[0.12em] transition-colors',
              activeCategory === 'all'
                ? 'border-caspian-900 bg-caspian-900 text-pearl-50'
                : 'border-caspian-900/12 bg-white text-ink-700 hover:border-caspian-900/30 hover:text-caspian-950',
            )}
          >
            All pieces
            <span className="ml-1.5 tabular-nums opacity-60">{products.length}</span>
          </button>
          {categories.map((category) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => setActiveCategory(category.slug)}
              aria-pressed={activeCategory === category.slug}
              className={cn(
                'shrink-0 rounded-full border px-3.5 py-2 text-[0.62rem] font-bold uppercase tracking-[0.12em] transition-colors',
                activeCategory === category.slug
                  ? 'border-caspian-900 bg-caspian-900 text-pearl-50'
                  : 'border-caspian-900/12 bg-white text-ink-700 hover:border-caspian-900/30 hover:text-caspian-950',
              )}
            >
              {category.label}
              <span className="ml-1.5 tabular-nums opacity-60">{category.count}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : failed ? (
            <ErrorState
              title="The shelves are taking a moment"
              description={error || 'We could not reach the catalogue. Please try again.'}
              onRetry={() => dispatch(loadCatalog({ force: true }))}
            />
          ) : (
            <>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-ink-500">
                    {activeCategory === 'all' ? 'The full edit' : 'Filtered edit'}
                  </p>
                  <h2 className="mt-1.5 font-display text-3xl text-caspian-950">
                    {activeMeta ? activeMeta.label : 'All pieces'}
                  </h2>
                </div>
                {activeMeta ? (
                  <Link to={`/category/${activeMeta.slug}`} className="link-underline">
                    Read the collection note
                    <FiArrowRight className="h-3.5 w-3.5" />
                  </Link>
                ) : (
                  <Link to="/#collections" className="link-underline">
                    Browse by collection
                    <FiArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>

              <ProductListing
                key={activeCategory}
                products={visible}
                showToolbarTitle={false}
                emptyTitle={
                  activeMeta
                    ? `Nothing in ${activeMeta.label.toLowerCase()} matches those filters.`
                    : 'No pieces match those filters.'
                }
              />

              <div className="mt-14 rounded-[1.6rem] border border-caspian-900/8 bg-pearl-200/60 p-6 sm:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="eyebrow">Need a little direction?</p>
                    <p className="mt-2 font-display text-2xl text-caspian-950 sm:text-3xl">
                      Start with a collection note.
                    </p>
                    <p className="mt-2 max-w-lg text-xs leading-6 text-ink-500">
                      Each collection has its own small story — what it is for, how it wears and how
                      to look after it.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        to={`/category/${category.slug}`}
                        className="rounded-full border border-caspian-900/15 bg-white px-3 py-2 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-caspian-900 transition-colors hover:border-caspian-900/35"
                      >
                        {category.shortLabel}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="border-t border-caspian-900/8 bg-white">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-8 text-center sm:flex-row sm:text-left">
          <p className="max-w-md text-sm leading-6 text-ink-500">
            Not sure where to begin? Tell us what you are looking for and we will point you to the
            right three pieces.
          </p>
          <a
            href={`mailto:${BRAND.email}`}
            className={buttonClasses({ variant: 'outline', size: 'sm' })}
          >
            Write to the studio
            <FiArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </section>
    </>
  );
}
