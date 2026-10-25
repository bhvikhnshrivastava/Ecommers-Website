import { useEffect } from 'react';
import { FiInfo, FiRefreshCw, FiX } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { loadCatalog, clearCatalogWarning } from '@/redux/productsSlice';
import {
  selectCatalogError,
  selectCatalogStatus,
  selectCatalogWarning,
  selectProducts,
} from '@/redux/selectors';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import HeroCarousel from '@/components/home/HeroCarousel';
import TrustStrip from '@/components/home/TrustStrip';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedEdit from '@/components/home/FeaturedEdit';
import PromoBanner from '@/components/home/PromoBanner';
import FaqSection from '@/components/home/FaqSection';
import ErrorState from '@/components/common/ErrorState';
import ProductGrid from '@/components/product/ProductGrid';
import SectionHeading from '@/components/common/SectionHeading';
import Button from '@/components/common/Button';
import { ProductGridSkeleton, Skeleton } from '@/components/common/Skeleton';

function HomeLoading() {
  return (
    <>
      <section className="section-pad">
        <div className="container-page">
          <div className="space-y-3">
            <Skeleton className="h-2.5 w-32 rounded-full" />
            <Skeleton className="h-9 w-80 max-w-full rounded-xl" />
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-52 rounded-[1.5rem]" />
            ))}
          </div>
        </div>
      </section>
      <section className="border-y border-caspian-900/8 bg-pearl-200/55 section-pad">
        <div className="container-page">
          <ProductGridSkeleton count={4} />
        </div>
      </section>
    </>
  );
}

export default function HomePage() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectCatalogStatus);
  const error = useAppSelector(selectCatalogError);
  const warning = useAppSelector(selectCatalogWarning);
  const products = useAppSelector(selectProducts);
  const { ids: recentIds, clear: clearRecent } = useRecentlyViewed();

  useDocumentTitle('');

  useEffect(() => {
    if (status === 'idle') dispatch(loadCatalog());
  }, [dispatch, status]);

  const loading = (status === 'idle' || status === 'loading') && products.length === 0;
  const failed = status === 'failed' && products.length === 0;

  const recentlyViewed = recentIds
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean)
    .slice(0, 4);

  return (
    <>
      <HeroCarousel />

      {warning ? (
        <div className="border-b border-champagne-500/20 bg-champagne-50">
          <div className="container-page flex items-start gap-2.5 py-3">
            <FiInfo className="mt-0.5 h-4 w-4 shrink-0 text-champagne-700" aria-hidden="true" />
            <p className="flex-1 text-xs leading-5 text-champagne-800">{warning}</p>
            <button
              type="button"
              onClick={() => dispatch(clearCatalogWarning())}
              aria-label="Dismiss catalogue notice"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-champagne-700 transition-colors hover:bg-champagne-100"
            >
              <FiX className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : null}

      <TrustStrip />

      {loading ? (
        <HomeLoading />
      ) : failed ? (
        <section className="section-pad">
          <div className="container-page">
            <ErrorState
              title="The collection is taking a moment"
              description={error || 'We could not reach the catalogue. Please try again.'}
              onRetry={() => dispatch(loadCatalog({ force: true }))}
            />
          </div>
        </section>
      ) : (
        <>
          <CategoryGrid />
          <FeaturedEdit />
          <PromoBanner />

          {recentlyViewed.length > 0 ? (
            <section
              aria-labelledby="recent-heading"
              className="border-t border-caspian-900/8 section-pad"
            >
              <div className="container-page">
                <SectionHeading
                  eyebrow="Where you left off"
                  title="A second look, if you like."
                  description="The pieces you opened most recently, still here and still waiting."
                  action={
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearRecent}
                      aria-label="Clear recently viewed products"
                    >
                      <FiRefreshCw className="h-3.5 w-3.5" />
                      Clear history
                    </Button>
                  }
                />
                <div className="mt-8">
                  <ProductGrid products={recentlyViewed} />
                </div>
              </div>
            </section>
          ) : null}
        </>
      )}

      <FaqSection />
    </>
  );
}
