import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiArrowRight, FiSearch, FiX } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { loadCatalog } from '@/redux/productsSlice';
import {
  selectCatalogStatus,
  selectCategories,
  selectProducts,
  selectTopRated,
} from '@/redux/selectors';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import EmptyState from '@/components/common/EmptyState';
import ProductGrid from '@/components/product/ProductGrid';
import ProductListing from '@/components/product/ProductListing';
import SectionHeading from '@/components/common/SectionHeading';
import { ProductGridSkeleton } from '@/components/common/Skeleton';
import { TRENDING_SEARCHES } from '@/data/constants';

export default function SearchPage() {
  const dispatch = useAppDispatch();
  const [params, setParams] = useSearchParams();
  const query = (params.get('q') ?? '').trim();
  const [draft, setDraft] = useState(query);

  const status = useAppSelector(selectCatalogStatus);
  const products = useAppSelector(selectProducts);
  const categories = useAppSelector(selectCategories);
  const topRated = useAppSelector(selectTopRated);
  const { searches, addSearch, clearSearches } = useRecentSearches();

  useDocumentTitle(query ? `Search: ${query}` : 'Search');

  useEffect(() => {
    if (status === 'idle') dispatch(loadCatalog());
  }, [dispatch, status]);

  useEffect(() => {
    setDraft(query);
    if (query) addSearch(query);
  }, [query, addSearch]);

  const loading = (status === 'idle' || status === 'loading') && products.length === 0;

  const results = useMemo(() => {
    if (!query) return [];
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return products.filter((product) => terms.every((term) => product.searchText.includes(term)));
  }, [products, query]);

  const submit = (term) => {
    const clean = String(term ?? '').trim();
    if (!clean) {
      setParams({});
      return;
    }
    addSearch(clean);
    setParams({ q: clean });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submit(draft);
  };

  return (
    <>
      <section className="grain relative overflow-hidden border-b border-caspian-900/8 bg-pearl-200/60 hero-wash">
        <div className="container-page relative py-9 sm:py-12">
          <Breadcrumbs items={[{ label: 'Search' }]} />
          <div className="mt-6 max-w-3xl">
            <p className="eyebrow">Look a little closer</p>
            <h1 className="display-title mt-3">
              {query ? (
                <>
                  Results for <span className="italic text-caspian-700">“{query}”</span>
                </>
              ) : (
                'Search the collection.'
              )}
            </h1>
            <p className="body-copy mt-4 max-w-xl">
              A name, a material, a category or a half-formed idea — all of it works. We will look
              through the store with you.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            role="search"
            className="mt-7 flex max-w-2xl items-center gap-2"
          >
            <div className="relative flex-1">
              <FiSearch
                aria-hidden="true"
                className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500"
              />
              <label htmlFor="search-page-input" className="sr-only">
                Search products
              </label>
              <input
                id="search-page-input"
                type="search"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Try “gold”, “jacket” or “monitor”…"
                autoComplete="off"
                className="h-12 w-full rounded-full border border-caspian-900/15 bg-white pl-11 pr-11 font-sans text-sm text-ink-900 placeholder:text-ink-500/60 focus:border-caspian-700 focus:outline-none focus:ring-2 focus:ring-champagne-500/25"
              />
              {draft ? (
                <button
                  type="button"
                  onClick={() => {
                    setDraft('');
                    setParams({});
                  }}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-ink-500 hover:bg-caspian-900/6"
                >
                  <FiX className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </div>
            <button
              type="submit"
              className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-caspian-900 px-5 font-sans text-[0.62rem] font-bold uppercase tracking-[0.14em] text-pearl-50 transition-colors hover:bg-caspian-800 sm:px-7"
            >
              Search
              <FiArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-[0.58rem] font-bold uppercase tracking-[0.16em] text-ink-500">
              Try
            </span>
            {TRENDING_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => submit(term)}
                className="rounded-full border border-caspian-900/12 bg-white/70 px-2.5 py-1 text-[0.65rem] text-ink-700 transition-colors hover:border-caspian-900/30 hover:text-caspian-950"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : query ? (
            results.length > 0 ? (
              <>
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-ink-500">
                      {results.length} {results.length === 1 ? 'match' : 'matches'} found
                    </p>
                    <h2 className="mt-1.5 font-display text-3xl text-caspian-950">
                      Pieces that fit the thought.
                    </h2>
                  </div>
                  <Link to="/shop" className="link-underline">
                    Browse everything
                    <FiArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <ProductListing
                  key={query}
                  products={results}
                  showToolbarTitle={false}
                  emptyTitle="Nothing matches those filters."
                />
              </>
            ) : (
              <EmptyState
                icon={FiSearch}
                eyebrow="No matches yet"
                title={`We could not find “${query}”.`}
                description="Try a simpler phrase, a category, or one of the ideas below. The collection is small, which makes finding things rather nice."
                action={
                  <div className="flex flex-wrap justify-center gap-2">
                    {TRENDING_SEARCHES.slice(0, 3).map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => submit(term)}
                        className="rounded-full border border-caspian-900/15 bg-white px-3.5 py-2 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-caspian-900 transition-colors hover:border-caspian-900/35"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                }
              />
            )
          ) : (
            <>
              {searches.length > 0 ? (
                <div className="mb-10">
                  <SectionHeading
                    eyebrow="Your recent searches"
                    title="Pick up where you left off."
                    action={
                      <button
                        type="button"
                        onClick={clearSearches}
                        className="text-[0.62rem] font-semibold text-ink-500 underline decoration-caspian-900/20 underline-offset-2 hover:text-caspian-900"
                      >
                        Clear history
                      </button>
                    }
                  />
                  <div className="mt-5 flex flex-wrap gap-2">
                    {searches.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => submit(term)}
                        className="inline-flex items-center gap-2 rounded-full border border-caspian-900/12 bg-white px-3.5 py-2 text-xs text-ink-700 transition-colors hover:border-caspian-900/30 hover:text-caspian-950"
                      >
                        <FiSearch className="h-3 w-3" aria-hidden="true" />
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <SectionHeading
                eyebrow="A good place to begin"
                title="Start with a collection."
                description="Four small worlds, each with its own pace. Choose one and wander."
              />
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    to={`/category/${category.slug}`}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-caspian-900/10 bg-white p-4 transition-colors hover:border-caspian-900/25"
                  >
                    <div>
                      <p className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-champagne-700">
                        {category.count} pieces
                      </p>
                      <p className="mt-1 font-display text-xl text-caspian-950">{category.label}</p>
                      <p className="mt-1 text-[0.68rem] text-ink-500">{category.shortLabel}</p>
                    </div>
                    <FiArrowRight className="h-4 w-4 shrink-0 text-caspian-700 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </div>

              <div className="mt-12">
                <SectionHeading
                  eyebrow="Most loved"
                  title="What everyone is looking at."
                  action={
                    <Link to="/shop" className="link-underline">
                      See all pieces
                      <FiArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  }
                />
                <div className="mt-7">
                  <ProductGrid products={topRated} />
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
