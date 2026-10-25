import { Link } from 'react-router-dom';
import { FiCheck, FiHeart, FiStar, FiTruck } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { markNotificationsRead } from '@/redux/uiSlice';
import { selectNotificationsRead } from '@/redux/selectors';
import { NOTIFICATIONS } from '@/data/constants';

const ICONS = {
  sparkle: FiStar,
  truck: FiTruck,
  heart: FiHeart,
};

export default function NotificationsMenu({ open, onClose }) {
  const dispatch = useAppDispatch();
  const read = useAppSelector(selectNotificationsRead);

  if (!open) return null;

  return (
    <div className="absolute right-0 top-[calc(100%+0.9rem)] z-50 w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-caspian-900/10 bg-white shadow-lift animate-slide-up">
      <div className="flex items-center justify-between border-b border-caspian-900/8 px-4 py-3.5">
        <div>
          <p className="font-display text-xl text-caspian-950">Notifications</p>
          <p className="mt-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-ink-500">
            {read ? 'All caught up' : `${NOTIFICATIONS.length} new notes`}
          </p>
        </div>
        {!read ? (
          <button
            type="button"
            onClick={() => dispatch(markNotificationsRead())}
            className="inline-flex items-center gap-1 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-caspian-700 hover:text-caspian-900"
          >
            <FiCheck className="h-3 w-3" /> Mark read
          </button>
        ) : null}
      </div>

      <ul className="divide-y divide-caspian-900/6">
        {NOTIFICATIONS.map((notification) => {
          const Icon = ICONS[notification.icon] ?? FiStar;
          return (
            <li key={notification.id}>
              <Link
                to={notification.to}
                onClick={onClose}
                className="flex gap-3 px-4 py-3.5 transition-colors hover:bg-pearl-50"
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-champagne-100 text-champagne-700">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-caspian-950">
                      {notification.title}
                    </span>
                    {!read ? (
                      <span
                        aria-label="Unread"
                        className="h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta-500"
                      />
                    ) : null}
                  </span>
                  <span className="mt-0.5 block text-[0.7rem] leading-5 text-ink-500">
                    {notification.body}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-caspian-900/8 bg-pearl-50 px-4 py-2.5">
        <Link
          to="/shop"
          onClick={onClose}
          className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-caspian-700 hover:text-caspian-900"
        >
          Explore the full collection
        </Link>
      </div>
    </div>
  );
}
