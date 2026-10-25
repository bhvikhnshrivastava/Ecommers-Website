import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiTruck } from 'react-icons/fi';
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
import { buttonClasses } from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import ProductImage from '@/components/common/ProductImage';
import ProductListing from '@/components/product/ProductListing';
import { ProductGridSkeleton } from '@/components/common/Skeleton';
import { CATEGORY_META } from '@/data/categories';
import { formatCount } from '@/utils/currency';

export default function CategoryPage() {
  const { slug } = useParams();
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectCatalogStatus);
  const error = useAppSelector(selectCatalogError);
  const products = useAppSelector(selectProducts);
  const categories = useAppSelector(selectCategories);

  const meta = categories.find((category) => category.slug === slug) ?? CATEGORY_META[slug] ?? null;
  const items = products.filter((product) => product.category === slug);

  useDocumentTitle(meta?.label ?? 'Collection');

  useEffect(() => {
    if (status === 'idle') dispatch(loadCatalog());
  }, [dispatch, status]);

  const loading = (status === 'idle' || status === 'loading') && products.length === 0;
  const failed = status === 'failed' && products.length === 0;
  const missing = !loading && !failed && products.length > 0 && items.length === 0;

  if (failed) {
    return (
      <section className="section-pad">
        <div className="container-page">
          <ErrorState
            title="This collection is taking a moment"
            description={error || 'We could not reach the catalogue. Please try again.'}
            onRetry={() => dispatch(loadCatalog({ force: true }))}
          />
        </div>
      </section>
    );
  }

  if (missing) {
    return (
      <section className="section-pad">
        <div className="container-page">
          <EmptyState
            icon={FiArrowLeft}
            eyebrow="Collection not found"
            title="This shelf is empty."
            description="The collection you were looking for may have moved, or the address may be a little off."
            action={
              <Link to="/shop" className="link-underline">
                Browse all pieces
                <FiArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
        </div>
      </section>
    );
  }

  const otherCategories = categories.filter((category) => category.slug !== slug).slice(0, 3);

  return (
    <>
      <section className="grain relative overflow-hidden bg-caspian-950 text-pearl-50">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-caspian-950 via-caspian-900 to-lagoon-500/40"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full border border-champagne-500/20"
        />
        <div className="container-page relative py-9 sm:py-12 lg:py-14">
          <Breadcrumbs
            light
            items={[{ label: 'Shop', to: '/shop' }, { label: meta?.label ?? 'Collection' }]}
          />
          <div className="mt-7 grid items-center gap-9 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="eyebrow-light">{meta?.eyebrow ?? 'The Ecaspian edit'}</p>
              <h1 className="mt-3 font-display text-5xl leading-[0.95] text-pearl-50 sm:text-6xl">
                {meta?.label ?? 'Collection'}
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-pearl-100/65">
                {meta?.description ??
                  'A small, thoughtful edit from the Ecaspian collection, chosen with a slow eye.'}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-pearl-50/10 pt-4 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-pearl-100/55">
                <span className="text-champagne-300">
                  {items.length || meta?.count || 0}{' '}
                  {(items.length || meta?.count) === 1 ? 'piece' : 'pieces'}
                </span>
                <span className="flex items-center gap-1.5">
                  <FiTruck className="h-3.5 w-3.5" aria-hidden="true" />
                  Free delivery over ₹999
                </span>
                <span>{meta?.warranty ?? 'Quality guarantee'}</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[20rem] lg:ml-auto lg:mr-0">
              <div
                aria-hidden="true"
                className="absolute -inset-2.5 rounded-[999px_999px_1.6rem_1.6rem] border border-champagne-500/25"
              />
              <div className="arch-frame relative overflow-hidden border border-pearl-50/10 bg-gradient-to-b from-pearl-50 via-pearl-100 to-champagne-100 px-8 pb-5 pt-12">
                <div className="aspect-square w-full">
                  {meta?.image || items[0]?.image ? (
                    <ProductImage
                      src={meta?.image ?? items[0]?.image}
                      alt={meta?.label ?? ''}
                      loading="eager"
                      imgClassName="mix-blend-multiply"
                    />
                  ) : (
                    <div className="skeleton h-full w-full rounded-[2rem]" />
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-caspian-900/10 pt-3">
                  <span className="text-[0.54rem] font-bold uppercase tracking-[0.18em] text-caspian-900">
                    Collection {meta?.code ?? 'ECP'}
                  </span>
                  <span className="font-display text-base text-caspian-950">
                    {formatCount(items.length || meta?.count || 0)} pieces
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-pearl-200/50 border-b border-caspian-900/8">
        <div className="container-page grid gap-6 py-8 sm:grid-cols-3">
          <div>
            <p className="text-[0.58rem] font-bold uppercase tracking-[0.2em] text-caspian-700">
              What it is for
            </p>
            <p className="mt-2 text-sm leading-6 text-ink-700">
              {meta?.tagline ?? 'Everyday pieces, considered.'}
            </p>
          </div>
          <div>
            <p className="text-[0.58rem] font-bold uppercase tracking-[0.2em] text-caspian-700">
              How it arrives
            </p>
            <p className="mt-2 text-sm leading-6 text-ink-700">
              {meta?.shipping ?? 'Dispatched within 24 hours, delivered in 3–5 business days.'}
            </p>
          </div>
          <div>
            <p className="text-[0.58rem] font-bold uppercase tracking-[0.2em] text-caspian-700">
              Looking after it
            </p>
            <p className="mt-2 text-sm leading-6 text-ink-700">
              {meta?.care ?? 'Follow the care notes included with your piece.'}
            </p>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          {loading ? (
            <ProductGridSkeleton count={6} />
          ) : (
            <ProductListing
              key={slug}
              products={items}
              showToolbarTitle={false}
              emptyTitle={`Nothing in ${meta?.label ?? 'this collection'} matches those filters.`}
            />
          )}

          <div className="mt-14 flex flex-col items-start justify-between gap-6 border-t border-caspian-900/10 pt-8 sm:flex-row sm:items-center">
            <div>
              <p className="eyebrow">Keep looking</p>
              <p className="mt-2 font-display text-2xl text-caspian-950">
                Another corner of the store.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {otherCategories.map((category) => (
                <Link
                  key={category.slug}
                  to={`/category/${category.slug}`}
                  className="rounded-full border border-caspian-900/15 bg-white px-3.5 py-2 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-caspian-900 transition-colors hover:border-caspian-900/35"
                >
                  {category.label}
                </Link>
              ))}
              <Link to="/shop" className={buttonClasses({ variant: 'outline', size: 'sm' })}>
                All pieces
                <FiArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
