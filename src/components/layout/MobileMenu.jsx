import { Link, NavLink } from 'react-router-dom';
import {
  FiArrowRight,
  FiHeart,
  FiHelpCircle,
  FiHome,
  FiLogOut,
  FiMail,
  FiShoppingBag,
  FiShoppingCart,
  FiUser,
} from 'react-icons/fi';
import Drawer from '@/components/common/Drawer';
import BrandLogo from '@/components/common/BrandLogo';
import PaymentBadges from '@/components/common/PaymentBadges';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { logout } from '@/redux/authSlice';
import { addToast } from '@/redux/uiSlice';
import {
  selectAuthUser,
  selectCartCount,
  selectCategories,
  selectWishlistCount,
} from '@/redux/selectors';
import { BRAND } from '@/data/constants';
import { cn } from '@/utils/cn';

const primaryLinks = [
  { label: 'Home', to: '/', icon: FiHome },
  { label: 'Shop all', to: '/shop', icon: FiShoppingBag },
];

export default function MobileMenu({ open, onClose }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const categories = useAppSelector(selectCategories);
  const cartCount = useAppSelector(selectCartCount);
  const wishlistCount = useAppSelector(selectWishlistCount);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(addToast({ message: 'Signed out. Your bag is still here whenever you need it.' }));
    onClose();
  };

  const linkClass =
    'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-ink-700 transition-colors hover:bg-white hover:text-caspian-950';

  return (
    <Drawer open={open} onClose={onClose} title="Menu">
      <div className="flex flex-col gap-6">
        <Link to="/" onClick={onClose} aria-label="Ecaspian home" className="inline-flex">
          <BrandLogo showTagline markClassName="h-12 w-12" />
        </Link>

        <nav aria-label="Mobile navigation" className="space-y-1">
          {primaryLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={linkClass}
                end={link.to === '/'}
              >
                <Icon className="h-4 w-4 text-caspian-600" />
                {link.label}
              </NavLink>
            );
          })}
          <Link to="/wishlist" onClick={onClose} className={linkClass}>
            <FiHeart className="h-4 w-4 text-caspian-600" />
            <span className="flex-1">Wishlist</span>
            {wishlistCount > 0 ? (
              <span className="rounded-full bg-champagne-100 px-2 py-0.5 text-[0.62rem] font-bold text-champagne-800">
                {wishlistCount}
              </span>
            ) : null}
          </Link>
          <Link to="/cart" onClick={onClose} className={linkClass}>
            <FiShoppingCart className="h-4 w-4 text-caspian-600" />
            <span className="flex-1">Shopping bag</span>
            {cartCount > 0 ? (
              <span className="rounded-full bg-caspian-900 px-2 py-0.5 text-[0.62rem] font-bold text-pearl-50">
                {cartCount}
              </span>
            ) : null}
          </Link>
        </nav>

        <div>
          <p className="mb-2 px-3 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-ink-500">
            Collections
          </p>
          <div className="space-y-0.5">
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={`/category/${category.slug}`}
                onClick={onClose}
                className="group flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-white"
              >
                <span className="text-sm text-ink-700 group-hover:text-caspian-950">
                  {category.label}
                </span>
                <span className="flex items-center gap-2 text-[0.62rem] text-ink-500">
                  {category.count}
                  <FiArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-caspian-900/10 pt-4">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl bg-white p-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-caspian-900 text-xs font-bold text-champagne-300">
                  {user.initials || 'EC'}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-caspian-950">{user.name}</p>
                  <p className="truncate text-[0.66rem] text-ink-500">{user.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-terracotta-600 hover:bg-terracotta-100/40"
              >
                <FiLogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={onClose}
              className="flex items-center justify-center gap-2 rounded-full bg-caspian-900 px-5 py-3 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-pearl-50"
            >
              <FiUser className="h-4 w-4" />
              Sign in
            </Link>
          )}
        </div>

        <div className="border-t border-caspian-900/10 pt-4">
          <Link to="/#faq" onClick={onClose} className={cn(linkClass, 'text-xs')}>
            <FiHelpCircle className="h-4 w-4 text-caspian-600" />
            Help & frequently asked questions
          </Link>
          <a href={`mailto:${BRAND.email}`} className={cn(linkClass, 'text-xs')}>
            <FiMail className="h-4 w-4 text-caspian-600" />
            {BRAND.email}
          </a>
          <div className="mt-5 px-3">
            <p className="mb-2 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-ink-500">
              Secure payments
            </p>
            <PaymentBadges />
          </div>
        </div>

        <p className="px-3 text-[0.62rem] leading-5 text-ink-500">
          {BRAND.tagline} · {BRAND.address}
        </p>
      </div>
    </Drawer>
  );
}
