import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck } from 'react-icons/fi';
import { useAppSelector } from '@/app/hooks';
import { selectTopRated } from '@/redux/selectors';
import ProductCard from '@/components/product/ProductCard';
import Reveal from '@/components/common/Reveal';
import { buttonClasses } from '@/components/common/Button';
import { EDITOR_PRODUCT_IDS } from '@/data/constants';

const NOTES = [
  'Chosen by hand, not by algorithm.',
  'Inspected and packed before it leaves the studio.',
  'Delivered with a 7-day return promise.',
];

export default function FeaturedEdit() {
  const topRated = useAppSelector(selectTopRated);
  const picks = EDITOR_PRODUCT_IDS.map((id) =>
    topRated.find((product) => product.id === id),
  ).filter(Boolean);
  const products = (picks.length >= 4 ? picks : topRated).slice(0, 4);

  if (!products.length) return null;

  return (
    <section
      id="edit"
      aria-labelledby="edit-heading"
      className="border-y border-caspian-900/8 bg-pearl-200/55"
    >
      <div className="container-page section-pad">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:gap-14">
          <Reveal className="lg:sticky lg:top-28">
            <p className="eyebrow">The considered edit</p>
            <h2 id="edit-heading" className="section-title mt-3 max-w-md">
              The pieces we keep coming back to.
            </h2>
            <p className="body-copy mt-4 max-w-sm">
              It is not the loudest thing on the shelf that stays with you. This is a small
              selection of pieces our team reaches for, wears out and quietly recommends.
            </p>

            <ul className="mt-7 space-y-3 border-t border-caspian-900/10 pt-6">
              {NOTES.map((note, index) => (
                <li key={note} className="flex items-start gap-3 text-[0.82rem] text-ink-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-champagne-100 text-champagne-700">
                    <FiCheck className="h-3 w-3" aria-hidden="true" />
                  </span>
                  <span className="leading-6">
                    <span className="mr-1.5 font-sans text-[0.58rem] font-bold text-ink-500">
                      0{index + 1}
                    </span>
                    {note}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              to="/shop"
              className={buttonClasses({ variant: 'primary', size: 'md', className: 'mt-7' })}
            >
              Explore the full collection
              <FiArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-3 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-ink-500">
              Prices in INR · all taxes included
            </p>
          </Reveal>

          <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-4">
            {products.map((product, index) => (
              <Reveal key={product.id} delay={index * 80}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
