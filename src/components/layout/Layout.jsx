import { Outlet } from 'react-router-dom';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/common/ScrollToTop';
import ToastViewport from '@/components/common/Toast';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-pearl-100">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[200] focus:rounded-full focus:bg-caspian-900 focus:px-4 focus:py-2.5 focus:text-xs focus:font-bold focus:uppercase focus:tracking-[0.12em] focus:text-pearl-50"
      >
        Skip to content
      </a>
      <AnnouncementBar />
      <Header />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
      <ToastViewport />
    </div>
  );
}
