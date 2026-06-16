import { createBrowserRouter } from 'react-router';
import { PublicLayout } from './layouts/PublicLayout';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { Potential } from './pages/Potential';
import { EvacuationMap } from './pages/Evacuationmap'; // ← BARU (ganti Gallery)
import { News } from './pages/News';
import { NewsDetail } from './pages/NewsDetail';
import { Contact } from './pages/Contact';
import { NotFound } from './pages/NotFound';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminNews } from './pages/admin/AdminNews';
import { AdminEvacuationMap } from './pages/admin/AdminEvacuationMap'; // ← BARU (ganti AdminGallery)
import { AdminProfile } from './pages/admin/AdminProfile';
import { AdminOrganization } from './pages/admin/AdminOrganization';
import { AdminStats } from './pages/admin/AdminStats';
import { AdminUMKM } from './pages/admin/AdminUMKM';
import { AdminAttractions } from './pages/admin/AdminAttractions';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: PublicLayout,
    children: [
      { index: true, Component: Home },
      { path: 'profil', Component: Profile },
      { path: 'potensi', Component: Potential },
      { path: 'peta-evakuasi', Component: EvacuationMap }, // ← ganti dari /galeri
      { path: 'berita', Component: News },
      { path: 'berita/:id', Component: NewsDetail },
      { path: 'kontak', Component: Contact },
      { path: '*', Component: NotFound }
    ]
  },
  {
    path: '/admin',
    children: [
      { index: true, Component: AdminLogin },
      {
        path: '',
        Component: AdminLayout,
        children: [
          { path: 'dashboard', Component: AdminDashboard },
          { path: 'profile', Component: AdminProfile },
          { path: 'organization', Component: AdminOrganization },
          { path: 'stats', Component: AdminStats },
          { path: 'news', Component: AdminNews },
          { path: 'evacuation-map', Component: AdminEvacuationMap }, // ← ganti dari /gallery
          { path: 'umkm', Component: AdminUMKM },
          { path: 'attractions', Component: AdminAttractions }
        ]
      }
    ]
  }
]);