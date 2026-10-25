import { Link } from 'react-router-dom';
import { FiHeart, FiLogOut, FiShoppingBag, FiUser } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { logout } from '@/redux/authSlice';
import { addToast } from '@/redux/uiSlice';
import { selectAuthUser, selectCartCount, selectWishlistCount } from '@/redux/selectors';

export default function AccountMenu({ open, onClose }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const cartCount = useAppSelector(selectCartCount);
  const wishlistCount = useAppSelector(selectWishlistCount);

  if (!open || !user) return null;

  const handleLogout = () => {
    dispatch(logout());
    dispatch(addToast({ message: 'Signed out. Your bag is still here whenever you need it.' }));
    onClose?.();
  };

  return (
    <div className="absolute right-0 top-[calc(100%+0.9rem)] z-50 w-[19rem] overflow-hidden rounded-2xl border border-caspian-900/10 bg-white shadow-lift animate-slide-up">
      <div className="flex items-center gap-3 border-b border-caspian-900/8 bg-pearl-50 px-4 py-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-caspian-900 font-sans text-sm font-bold text-champagne-300">
          {user.initials || 'EC'}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-caspian-950">{user.name}</p>
          <p className="truncate text-[0.68rem] text-ink-500">{user.email}</p>
        </div>
      </div>

      <div className="p-1.5">
        <Link
          to="/wishlist"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-700 transition-colors hover:bg-pearl-50 hover:text-caspian-950"
        >
          <FiHeart className="h-4 w-4 text-caspian-700" />
          <span className="flex-1">Wishlist</span>
          <span className="text-xs tabular-nums text-ink-500">{wishlistCount}</span>
        </Link>
        <Link
          to="/cart"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-700 transition-colors hover:bg-pearl-50 hover:text-caspian-950"
        >
          <FiShoppingBag className="h-4 w-4 text-caspian-700" />
          <span className="flex-1">Shopping bag</span>
          <span className="text-xs tabular-nums text-ink-500">{cartCount}</span>
        </Link>
        <Link
          to="/shop"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-700 transition-colors hover:bg-pearl-50 hover:text-caspian-950"
        >
          <FiUser className="h-4 w-4 text-caspian-700" />
          <span className="flex-1">Continue browsing</span>
        </Link>
      </div>

      <div className="border-t border-caspian-900/8 p-1.5">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-terracotta-600 transition-colors hover:bg-terracotta-100/50"
        >
          <FiLogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>

      <p className="border-t border-caspian-900/8 bg-pearl-50 px-4 py-2.5 text-[0.6rem] leading-4 text-ink-500">
        Demo account · your details stay on this device.
      </p>
    </div>
  );
}
