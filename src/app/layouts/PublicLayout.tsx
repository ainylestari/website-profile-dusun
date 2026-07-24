import { Outlet } from 'react-router';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ScrollToTop } from '../components/ScrollToTop';
import { Toaster } from '../components/ui/sonner';
import { AnnouncementPopup } from '../components/AnnouncementPopup';

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementPopup />
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}