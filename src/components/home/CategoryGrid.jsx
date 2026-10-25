import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';
import { useAppSelector } from '@/app/hooks';
import { selectCategories } from '@/redux/selectors';
import ProductImage from '@/components/common/ProductImage';
import Reveal from '@/components/common/Reveal';
import SectionHeading from '@/components/common/SectionHeading';
import { buttonClasses } from '@/components/common/Button';
import { cn } from '@/utils/cn';

const SPANS = ['lg:col-span-7', 'lg:col-span-5', 'lg:col-span-5', 'lg:col-span-7'];

export default function CategoryGrid() {
  const categories = useAppSelector(selectCategories);

  if (!categories.length) return null;

  return (
    <section id="collections" aria-labelledby="collections-heading" className="section-pad">
      <div className="container-page">
        <SectionHeading
          eyebrow="Four quiet collections"
          title="Find your corner of the store."
          description="Electronics for the desk, jewellery for the everyday, and clothes that feel like they were already yours."
          action={
            <Link to="/shop" className={buttonClasses({ variant: 'outline', size: 'sm' })}>
              Shop everything
              <FiArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          }
        />

        <div className="mt-9 grid gap-3.5 sm:mt-11 sm:gap-4 lg:grid-cols-12">
          {categories.map((category, index) => (
            <Reveal
              key={category.slug}
              delay={index * 70}
              className={cn('group h-full', SPANS[index % SPANS.length])}
            >
              <Link
                to={`/category/${category.slug}`}
                aria-label={`Shop ${category.label}`}
                className="relative flex h-full min-h-[17rem] flex-col justify-between overflow-hidden rounded-[1.6rem] border border-caspian-900/10 bg-caspian-950 p-5 text-pearl-50 sm:min-h-[20rem] sm:p-6"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-tr from-caspian-950 via-caspian-900 to-lagoon-500/70 transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="absolute -right-10 -top-12 h-56 w-56 rounded-full border border-pearl-50/10"
                />
                <div
                  aria-hidden="true"
                  className="absolute -bottom-20 -left-12 h-56 w-56 rounded-full border border-champagne-500/20"
                />

                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[0.58rem] font-bold uppercase tracking-[0.24em] text-champagne-300">
                      0{index + 1} — {category.eyebrow}
                    </span>
                    <h3 className="mt-2 font-display text-3xl leading-none text-pearl-50 sm:text-4xl">
                      {category.label}
                    </h3>
                    <p className="mt-2 max-w-[16rem] text-xs leading-6 text-pearl-100/65">
                      {category.tagline}
                    </p>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-pearl-50/20 bg-pearl-50/5 backdrop-blur transition-colors duration-300 group-hover:border-champagne-400/60 group-hover:bg-champagne-500 group-hover:text-caspian-950">
                    <FiArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>

                <div className="relative z-10 mt-8 flex items-end justify-between gap-4">
                  <div className="h-28 w-28 shrink-0 sm:h-32 sm:w-32">
                    {category.image ? (
                      <ProductImage
                        src={category.image}
                        alt=""
                        imgClassName="drop-shadow-[0_18px_24px_rgba(0,0,0,.35)] transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : null}
                  </div>
                  <span className="pb-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-pearl-100/55">
                    {category.count} {category.count === 1 ? 'piece' : 'pieces'}
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
