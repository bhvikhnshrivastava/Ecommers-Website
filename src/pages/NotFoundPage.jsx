import { Link } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiCompass, FiSearch } from 'react-icons/fi';
import { useAppSelector } from '@/app/hooks';
import { selectCategories } from '@/redux/selectors';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import BrandLogo from '@/components/common/BrandLogo';
import { buttonClasses } from '@/components/common/Button';

export default function NotFoundPage() {
  const categories = useAppSelector(selectCategories);
  useDocumentTitle('Page not found');

  return (
    <section className="grain relative overflow-hidden bg-pearl-100 hero-wash">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full border border-champagne-500/20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-lagoon-500/8 blur-3xl"
      />
      <div className="container-page relative flex min-h-[72vh] flex-col items-center justify-center py-16 text-center">
        <BrandLogo compact className="opacity-60" />
        <p
          aria-hidden="true"
          className="mt-8 font-display text-[7rem] leading-[0.8] tracking-[-0.04em] text-caspian-950/10 sm:text-[11rem]"
        >
          404
        </p>
        <p className="eyebrow mt-4">A wrong turn, softly taken</p>
        <h1 className="mt-3 max-w-2xl font-display text-4xl leading-[1.02] text-caspian-950 sm:text-6xl">
          This page is not part of the collection.
        </h1>
        <p className="mt-4 max-w-md text-sm leading-7 text-ink-500">
          The address may have changed, or the page has quietly retired. The store is still open —
          and there is something lovely on every shelf.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-2">
          <Link to="/" className={buttonClasses({ variant: 'primary', size: 'md' })}>
            <FiArrowLeft className="h-4 w-4" />
            Back home
          </Link>
          <Link to="/shop" className={buttonClasses({ variant: 'outline', size: 'md' })}>
            Browse the collection
            <FiArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/search" className={buttonClasses({ variant: 'ghost', size: 'md' })}>
            <FiSearch className="h-4 w-4" />
            Search
          </Link>
        </div>

        {categories.length > 0 ? (
          <div className="mt-12 w-full max-w-2xl border-t border-caspian-900/10 pt-6">
            <p className="flex items-center justify-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-ink-500">
              <FiCompass className="h-3.5 w-3.5" aria-hidden="true" />
              Or begin with a collection
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  to={`/category/${category.slug}`}
                  className="rounded-full border border-caspian-900/12 bg-white/80 px-3.5 py-2 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-caspian-900 transition-colors hover:border-caspian-900/30"
                >
                  {category.label}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
