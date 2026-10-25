import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { ANNOUNCEMENT } from '@/data/constants';

export default function AnnouncementBar() {
  return (
    <div className="bg-caspian-950 text-pearl-100">
      <div className="container-page flex h-9 items-center justify-between gap-4 text-[0.6rem] font-semibold uppercase tracking-[0.15em]">
        <p className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-champagne-400" aria-hidden="true" />
          {ANNOUNCEMENT.message}
        </p>
        <p className="hidden items-center gap-2 text-pearl-100/55 sm:flex">
          {ANNOUNCEMENT.secondary}
        </p>
        <Link
          to="/shop"
          className="hidden items-center gap-1 text-champagne-300 transition-colors hover:text-champagne-100 md:flex"
        >
          Shop the edit
          <FiArrowRight className="h-3 w-3" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
