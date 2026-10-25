import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FiBell, FiChevronDown, FiHeart, FiMenu, FiSearch, FiShoppingBag } from 'react-icons/fi';
import BrandLogo from '@/components/common/BrandLogo';
import Badge from '@/components/common/Badge';
import ProductImage from '@/components/common/ProductImage';
import { buttonClasses } from '@/components/common/Button';
import { iconButtonClasses } from '@/components/common/IconButton';
import AccountMenu from '@/components/layout/AccountMenu';
import MobileMenu from '@/components/layout/MobileMenu';
import NotificationsMenu from '@/components/layout/NotificationsMenu';
import SearchPanel from '@/components/layout/SearchPanel';
import { useAppSelector } from '@/app/hooks';
import {
  selectAuthUser,
  selectCartCount,
  selectCategories,
  selectNotificationsRead,
  selectWishlistCount,
} from '@/redux/selectors';
import { NOTIFICATIONS } from '@/data/constants';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { cn } from '@/utils/cn';

const navLinkClass = ({ isActive }) =>
  cn(
    'rounded-full px-3.5 py-2 text-[0.63rem] font-bold uppercase tracking-[0.16em] transition-colors',
    isActive
      ? 'bg-caspian-900/7 text-caspian-950'
      : 'text-ink-500 hover:bg-caspian-900/5 hover:text-caspian-900',
  );

export default function Header() {
  const location = useLocation();
  const scrollY = useScrollPosition();
  const [panel, setPanel] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const categories = useAppSelector(selectCategories);
  const user = useAppSelector(selectAuthUser);
  const cartCount = useAppSelector(selectCartCount);
  const wishlistCount = useAppSelector(selectWishlistCount);
  const notificationsRead = useAppSelector(selectNotificationsRead);

  const scrolled = scrollY > 8;
  const unreadCount = notificationsRead ? 0 : NOTIFICATIONS.length;

  useEffect(() => {
    setPanel(null);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!panel) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setPanel(null);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [panel]);

  const togglePanel = (name) => {
    setPanel((current) => (current === name ? null : name));
  };

  const closePanel = () => setPanel(null);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 border-b bg-pearl-50/95 backdrop-blur-md transition-shadow duration-300',
          scrolled ? 'border-caspian-900/10 shadow-header' : 'border-caspian-900/6 shadow-none',
        )}
      >
        <div className="relative">
          <div className="container-page relative z-40 flex h-[4.4rem] items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(true);
                  closePanel();
                }}
                aria-label="Open menu"
                className={cn(iconButtonClasses({ className: 'lg:hidden' }))}
              >
                <FiMenu className="h-5 w-5" />
              </button>
              <Link to="/" aria-label="Ecaspian home" className="shrink-0">
                <span className="hidden sm:inline-flex">
                  <BrandLogo />
                </span>
                <span className="inline-flex sm:hidden">
                  <BrandLogo compact />
                </span>
              </Link>
            </div>

            <nav aria-label="Primary navigation" className="hidden items-center gap-0.5 lg:flex">
              <NavLink to="/" end className={navLinkClass}>
                Home
              </NavLink>
              <NavLink to="/shop" className={navLinkClass}>
                Shop
              </NavLink>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => togglePanel('categories')}
                  aria-expanded={panel === 'categories'}
                  aria-haspopup="true"
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-[0.63rem] font-bold uppercase tracking-[0.16em] transition-colors',
                    panel === 'categories'
                      ? 'bg-caspian-900/7 text-caspian-950'
                      : 'text-ink-500 hover:bg-caspian-900/5 hover:text-caspian-900',
                  )}
                >
                  Categories
                  <FiChevronDown
                    className={cn(
                      'h-3.5 w-3.5 transition-transform duration-200',
                      panel === 'categories' && 'rotate-180',
                    )}
                  />
                </button>

                {panel === 'categories' ? (
                  <div className="absolute left-1/2 top-[calc(100%+0.65rem)] w-[min(34rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-2xl border border-caspian-900/10 bg-white p-2 shadow-lift animate-slide-up">
                    <div className="flex items-center justify-between px-2.5 pb-2 pt-1">
                      <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-ink-500">
                        Shop by collection
                      </p>
                      <Link
                        to="/shop"
                        onClick={closePanel}
                        className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-caspian-700 hover:text-caspian-950"
                      >
                        View all
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-0.5">
                      {categories.map((category) => (
                        <Link
                          key={category.slug}
                          to={`/category/${category.slug}`}
                          onClick={closePanel}
                          className="group flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-pearl-50"
                        >
                          <span className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-pearl-200 p-1">
                            {category.image ? (
                              <ProductImage
                                src={category.image}
                                alt=""
                                imgClassName="mix-blend-multiply"
                              />
                            ) : null}
                          </span>
                          <span className="min-w-0">
                            <span className="block text-xs font-semibold text-caspian-950 group-hover:text-caspian-700">
                              {category.label}
                            </span>
                            <span className="mt-0.5 block truncate text-[0.62rem] text-ink-500">
                              {category.tagline}
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                    <Link
                      to="/shop"
                      onClick={closePanel}
                      className="mt-1.5 flex items-center justify-between rounded-xl bg-caspian-900 px-4 py-3 text-pearl-50"
                    >
                      <span>
                        <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-champagne-300">
                          The full edit
                        </span>
                        <span className="mt-0.5 block font-display text-lg">
                          Explore all pieces
                        </span>
                      </span>
                      <FiChevronDown className="h-4 w-4 -rotate-90 text-champagne-300" />
                    </Link>
                  </div>
                ) : null}
              </div>
              <Link
                to="/#faq"
                className="rounded-full px-3.5 py-2 text-[0.63rem] font-bold uppercase tracking-[0.16em] text-ink-500 transition-colors hover:bg-caspian-900/5 hover:text-caspian-900"
              >
                FAQs
              </Link>
            </nav>

            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => togglePanel('search')}
                aria-label={panel === 'search' ? 'Close search' : 'Search products'}
                aria-expanded={panel === 'search'}
                aria-controls="site-search-panel"
                className={iconButtonClasses()}
              >
                <FiSearch className="h-[1.15rem] w-[1.15rem]" />
              </button>

              <div className="relative hidden md:block">
                <button
                  type="button"
                  onClick={() => togglePanel('notifications')}
                  aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
                  aria-expanded={panel === 'notifications'}
                  className={iconButtonClasses()}
                >
                  <FiBell className="h-[1.15rem] w-[1.15rem]" />
                  <Badge count={unreadCount} />
                </button>
                <NotificationsMenu open={panel === 'notifications'} onClose={closePanel} />
              </div>

              <Link
                to="/wishlist"
                aria-label={`Wishlist${wishlistCount ? `, ${wishlistCount} items` : ''}`}
                className={iconButtonClasses()}
              >
                <FiHeart className="h-[1.15rem] w-[1.15rem]" />
                <Badge count={wishlistCount} />
              </Link>

              <Link
                to="/cart"
                aria-label={`Shopping bag${cartCount ? `, ${cartCount} items` : ''}`}
                className={iconButtonClasses()}
              >
                <FiShoppingBag className="h-[1.15rem] w-[1.15rem]" />
                <Badge count={cartCount} />
              </Link>

              {user ? (
                <div className="relative ml-1 hidden md:block">
                  <button
                    type="button"
                    onClick={() => togglePanel('account')}
                    aria-label="Account menu"
                    aria-expanded={panel === 'account'}
                    className="inline-flex h-10 items-center gap-1 rounded-full border border-caspian-900/12 bg-white pl-1 pr-2 transition-colors hover:border-caspian-900/25"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-caspian-900 text-[0.62rem] font-bold text-champagne-300">
                      {user.initials || 'EC'}
                    </span>
                    <FiChevronDown className="h-3.5 w-3.5 text-ink-500" />
                  </button>
                  <AccountMenu open={panel === 'account'} onClose={closePanel} />
                </div>
              ) : (
                <Link
                  to="/login"
                  className={buttonClasses({
                    variant: 'outline',
                    size: 'sm',
                    className: 'ml-1 hidden md:inline-flex',
                  })}
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>

          {panel ? (
            <button
              type="button"
              aria-label="Close overlay"
              tabIndex={-1}
              onClick={closePanel}
              className="fixed inset-0 z-30 cursor-default bg-caspian-950/30 backdrop-blur-[2px] animate-fade-in"
            />
          ) : null}

          <div className="relative z-50">
            <SearchPanel open={panel === 'search'} onClose={closePanel} />
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
