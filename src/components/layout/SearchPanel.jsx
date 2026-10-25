import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiClock, FiSearch, FiTrendingUp, FiX } from 'react-icons/fi';
import { useAppSelector } from '@/app/hooks';
import { selectIsCatalogLoading, selectProducts } from '@/redux/selectors';
import { useDebounce } from '@/hooks/useDebounce';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import { TRENDING_SEARCHES } from '@/data/constants';
import ProductImage from '@/components/common/ProductImage';
import { formatINR } from '@/utils/currency';

export default function SearchPanel({ open, onClose }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const products = useAppSelector(selectProducts);
  const isLoading = useAppSelector(selectIsCatalogLoading);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 220);
  const { searches, addSearch, clearSearches } = useRecentSearches();

  useEffect(() => {
    if (!open) return undefined;
    setQuery('');
    const timer = window.setTimeout(() => inputRef.current?.focus(), 60);
    return () => window.clearTimeout(timer);
  }, [open]);

  const suggestions = useMemo(() => {
    const clean = debouncedQuery.trim().toLowerCase();
    if (clean.length < 2) return [];
    const terms = clean.split(/\s+/);
    return products
      .filter((product) => terms.every((term) => product.searchText.includes(term)))
      .slice(0, 5);
  }, [debouncedQuery, products]);

  if (!open) return null;

  const submitSearch = (term) => {
    const clean = String(term ?? '').trim();
    if (!clean) return;
    addSearch(clean);
    navigate(`/search?q=${encodeURIComponent(clean)}`);
    onClose?.();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submitSearch(query);
  };

  const chooseTerm = (term) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  return (
    <div
      id="site-search-panel"
      role="dialog"
      aria-label="Search the collection"
      className="absolute inset-x-0 top-full border-t border-caspian-900/10 bg-pearl-50 shadow-soft animate-fade-in"
    >
      <div className="container-page py-5 sm:py-7">
        <form onSubmit={handleSubmit} role="search" className="flex items-center gap-3">
          <div className="relative flex-1">
            <FiSearch
              aria-hidden="true"
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-500"
            />
            <label htmlFor="site-search-input" className="sr-only">
              Search products
            </label>
            <input
              ref={inputRef}
              id="site-search-input"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') onClose?.();
              }}
              placeholder="Search for pieces, categories, or a feeling…"
              autoComplete="off"
              className="h-14 w-full rounded-full border border-caspian-900/15 bg-white pl-12 pr-12 font-sans text-sm text-ink-900 placeholder:text-ink-500/60 focus:border-caspian-700 focus:outline-none focus:ring-2 focus:ring-champagne-500/25"
            />
            {query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-caspian-900/6"
              >
                <FiX className="h-4 w-4" />
              </button>
            ) : null}
          </div>
          <button
            type="submit"
            className="hidden h-14 items-center gap-2 rounded-full bg-caspian-900 px-7 font-sans text-[0.65rem] font-bold uppercase tracking-[0.18em] text-pearl-50 transition-colors hover:bg-caspian-800 sm:inline-flex"
          >
            Search
            <FiArrowRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-caspian-900/12 text-caspian-900 transition-colors hover:bg-caspian-900/6"
          >
            <FiX className="h-5 w-5" />
          </button>
        </form>

        <div className="mt-5 grid gap-5 md:grid-cols-[1fr_1.25fr]">
          <div>
            {searches.length > 0 ? (
              <div>
                <div className="mb-2.5 flex items-center justify-between">
                  <p className="flex items-center gap-1.5 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-ink-500">
                    <FiClock className="h-3 w-3" /> Recent searches
                  </p>
                  <button
                    type="button"
                    onClick={clearSearches}
                    className="text-[0.62rem] font-semibold text-ink-500 underline decoration-caspian-900/20 underline-offset-2 hover:text-caspian-900"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {searches.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => chooseTerm(term)}
                      className="rounded-full border border-caspian-900/12 bg-white px-3 py-1.5 text-xs text-ink-700 transition-colors hover:border-caspian-900/30 hover:text-caspian-900"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className={searches.length > 0 ? 'mt-5' : ''}>
              <p className="mb-2.5 flex items-center gap-1.5 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-ink-500">
                <FiTrendingUp className="h-3 w-3" /> Trending now
              </p>
              <div className="flex flex-wrap gap-1.5">
                {TRENDING_SEARCHES.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => chooseTerm(term)}
                    className="rounded-full bg-champagne-100 px-3 py-1.5 text-xs text-champagne-800 transition-colors hover:bg-champagne-200"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="min-w-0">
            {query.trim().length >= 2 ? (
              suggestions.length > 0 ? (
                <div>
                  <p className="mb-2.5 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-ink-500">
                    Pieces that match
                  </p>
                  <ul className="space-y-1">
                    {suggestions.map((product) => (
                      <li key={product.id}>
                        <Link
                          to={`/product/${product.id}`}
                          onClick={onClose}
                          className="group flex items-center gap-3 rounded-xl p-1.5 transition-colors hover:bg-white"
                        >
                          <span className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-pearl-200 p-1">
                            <ProductImage
                              src={product.image}
                              alt=""
                              imgClassName="mix-blend-multiply"
                            />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-xs font-semibold text-caspian-950 group-hover:text-caspian-700">
                              {product.title}
                            </span>
                            <span className="mt-0.5 block text-[0.65rem] text-ink-500">
                              {product.categoryLabel}
                            </span>
                          </span>
                          <span className="shrink-0 text-xs font-semibold tabular-nums text-caspian-900">
                            {formatINR(product.price)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => submitSearch(query)}
                    className="mt-2 inline-flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-caspian-900 hover:text-champagne-600"
                  >
                    View all results
                    <FiArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex h-full min-h-24 flex-col justify-center rounded-xl border border-dashed border-caspian-900/15 bg-white/50 p-4">
                  <p className="text-sm font-semibold text-caspian-900">
                    {isLoading ? 'The collection is still arriving…' : 'No pieces match that yet.'}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-ink-500">
                    Try a material, a category or a simpler phrase.
                  </p>
                </div>
              )
            ) : (
              <div className="hidden h-full flex-col justify-center rounded-xl border border-caspian-900/8 bg-white/45 p-4 md:flex">
                <p className="font-display text-xl text-caspian-950">Looking for something?</p>
                <p className="mt-1 text-xs leading-5 text-ink-500">
                  Search by name, category or material. Press enter to see every match.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
