import { useMemo, useState } from 'react';
import { FiFilter, FiSliders, FiX } from 'react-icons/fi';
import ProductGrid from '@/components/product/ProductGrid';
import Select from '@/components/common/Select';
import Button from '@/components/common/Button';
import Drawer from '@/components/common/Drawer';
import EmptyState from '@/components/common/EmptyState';
import { SORT_OPTIONS } from '@/data/constants';
import { sortProducts } from '@/utils/sort';
import { formatINR } from '@/utils/currency';

const RATING_OPTIONS = [
  { value: 0, label: 'Any rating' },
  { value: 4, label: '4 stars & above' },
  { value: 3.5, label: '3.5 stars & above' },
  { value: 3, label: '3 stars & above' },
];

function roundUpTo(value, step = 100) {
  return Math.max(step, Math.ceil(Number(value ?? 0) / step) * step);
}

function FilterPanel({ filters, maxLimit, minLimit, onChange, onClear, activeCount }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-caspian-900">
          Refine
        </p>
        {activeCount > 0 ? (
          <button
            type="button"
            onClick={onClear}
            className="text-[0.62rem] font-semibold text-ink-500 underline decoration-caspian-900/20 underline-offset-2 hover:text-caspian-900"
          >
            Clear all
          </button>
        ) : null}
      </div>

      <fieldset className="border-t border-caspian-900/10 pt-5">
        <legend className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-ink-500">
          Price
        </legend>
        <div className="mt-4">
          <input
            type="range"
            min={minLimit}
            max={maxLimit}
            step={100}
            value={filters.maxPrice}
            onChange={(event) => onChange({ maxPrice: Number(event.target.value) })}
            aria-label="Maximum price"
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-caspian-900/10 accent-champagne-500"
          />
          <div className="mt-3 flex items-center justify-between text-[0.68rem] tabular-nums text-ink-500">
            <span>{formatINR(minLimit)}</span>
            <span className="rounded-full bg-pearl-200 px-2.5 py-1 font-semibold text-caspian-900">
              Up to {formatINR(filters.maxPrice)}
            </span>
          </div>
        </div>
      </fieldset>

      <fieldset className="border-t border-caspian-900/10 pt-5">
        <legend className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-ink-500">
          Rating
        </legend>
        <div className="mt-3 space-y-1.5">
          {RATING_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1.5 py-1.5 text-xs text-ink-700 transition-colors hover:bg-white"
            >
              <input
                type="radio"
                name="rating-filter"
                checked={filters.minRating === option.value}
                onChange={() => onChange({ minRating: option.value })}
                className="h-3.5 w-3.5 accent-champagne-500"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="border-t border-caspian-900/10 pt-5">
        <legend className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-ink-500">
          Availability
        </legend>
        <label className="mt-3 flex cursor-pointer items-center gap-2.5 px-1.5 text-xs text-ink-700">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(event) => onChange({ inStockOnly: event.target.checked })}
            className="h-3.5 w-3.5 accent-champagne-500"
          />
          In stock only
        </label>
      </fieldset>

      <div className="rounded-xl bg-pearl-200/80 p-3.5">
        <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-caspian-700">
          A small reminder
        </p>
        <p className="mt-1.5 text-[0.68rem] leading-5 text-ink-500">
          Delivery is complimentary on every order over ₹999. Returns are open for seven days.
        </p>
      </div>
    </div>
  );
}

export default function ProductListing({
  products = [],
  title,
  eyebrow = 'The collection',
  description,
  action = null,
  showToolbarTitle = true,
  emptyTitle = 'No pieces match those filters.',
  emptyDescription = 'Try widening the price range or clearing a filter or two.',
  onClearEmpty,
}) {
  const prices = products.map((product) => Number(product.price) || 0);
  const maxPrice = roundUpTo(Math.max(0, ...prices));
  const minPrice = 0;

  const [sort, setSort] = useState('featured');
  const [filters, setFilters] = useState({
    maxPrice,
    minRating: 0,
    inStockOnly: false,
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeCount =
    (filters.maxPrice < maxPrice ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0);

  const filtered = useMemo(() => {
    const result = products.filter((product) => {
      if (product.price > filters.maxPrice) return false;
      if (filters.minRating > 0 && product.rating < filters.minRating) return false;
      if (filters.inStockOnly && (product.stock ?? 0) <= 0) return false;
      return true;
    });
    return sortProducts(result, sort);
  }, [products, filters, sort]);

  const updateFilters = (patch) => setFilters((current) => ({ ...current, ...patch }));

  const clearFilters = () => {
    setFilters({ maxPrice, minRating: 0, inStockOnly: false });
    onClearEmpty?.();
  };

  const panel = (
    <FilterPanel
      filters={filters}
      maxLimit={maxPrice}
      minLimit={minPrice}
      onChange={updateFilters}
      onClear={clearFilters}
      activeCount={activeCount}
    />
  );

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        {showToolbarTitle ? (
          <div>
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            <h2 className="mt-2 font-display text-3xl text-caspian-950 sm:text-4xl">{title}</h2>
            {description ? (
              <p className="mt-2 max-w-xl text-sm leading-6 text-ink-500">{description}</p>
            ) : null}
          </div>
        ) : (
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-500">
            Showing <span className="font-bold text-caspian-950">{filtered.length}</span>{' '}
            {filtered.length === 1 ? 'piece' : 'pieces'}
          </p>
        )}
        {action}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-y border-caspian-900/10 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-caspian-900/15 bg-white px-3.5 py-2 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-caspian-900 transition-colors hover:border-caspian-900/35 lg:hidden"
          >
            <FiSliders className="h-3.5 w-3.5" />
            Filters
            {activeCount > 0 ? (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-caspian-900 px-1 text-[0.55rem] text-pearl-50">
                {activeCount}
              </span>
            ) : null}
          </button>
          {showToolbarTitle ? (
            <p className="hidden text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-ink-500 sm:block">
              {filtered.length} of {products.length} pieces
            </p>
          ) : null}
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          <label
            htmlFor="sort-products"
            className="hidden text-[0.62rem] font-bold uppercase tracking-[0.14em] text-ink-500 sm:block"
          >
            Sort
          </label>
          <Select
            id="sort-products"
            aria-label="Sort products"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            containerClassName="w-full sm:w-52"
            className="h-10 rounded-full text-xs"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {activeCount > 0 ? (
        <div className="flex flex-wrap items-center gap-1.5 pt-3">
          {filters.maxPrice < maxPrice ? (
            <button
              type="button"
              onClick={() => updateFilters({ maxPrice })}
              className="inline-flex items-center gap-1.5 rounded-full bg-caspian-900/6 px-2.5 py-1 text-[0.62rem] font-semibold text-caspian-900 hover:bg-caspian-900/10"
            >
              Up to {formatINR(filters.maxPrice)}
              <FiX className="h-3 w-3" aria-hidden="true" />
              <span className="sr-only">Remove price filter</span>
            </button>
          ) : null}
          {filters.minRating > 0 ? (
            <button
              type="button"
              onClick={() => updateFilters({ minRating: 0 })}
              className="inline-flex items-center gap-1.5 rounded-full bg-caspian-900/6 px-2.5 py-1 text-[0.62rem] font-semibold text-caspian-900 hover:bg-caspian-900/10"
            >
              {filters.minRating}+ stars
              <FiX className="h-3 w-3" aria-hidden="true" />
              <span className="sr-only">Remove rating filter</span>
            </button>
          ) : null}
          {filters.inStockOnly ? (
            <button
              type="button"
              onClick={() => updateFilters({ inStockOnly: false })}
              className="inline-flex items-center gap-1.5 rounded-full bg-caspian-900/6 px-2.5 py-1 text-[0.62rem] font-semibold text-caspian-900 hover:bg-caspian-900/10"
            >
              In stock
              <FiX className="h-3 w-3" aria-hidden="true" />
              <span className="sr-only">Remove availability filter</span>
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="mt-6 grid gap-8 lg:grid-cols-[15rem_1fr] lg:gap-10">
        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded-[1.4rem] border border-caspian-900/8 bg-white/70 p-5">
            {panel}
          </div>
        </aside>

        <div>
          {filtered.length > 0 ? (
            <ProductGrid products={filtered} columns={3} />
          ) : (
            <EmptyState
              icon={FiFilter}
              eyebrow="Nothing quite matches"
              title={emptyTitle}
              description={emptyDescription}
              action={
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear filters
                </Button>
              }
            />
          )}
        </div>
      </div>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Filters">
        {panel}
        <div className="mt-6 flex gap-2">
          <Button variant="outline" size="sm" fullWidth onClick={clearFilters}>
            Clear
          </Button>
          <Button size="sm" fullWidth onClick={() => setDrawerOpen(false)}>
            Show {filtered.length} pieces
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
