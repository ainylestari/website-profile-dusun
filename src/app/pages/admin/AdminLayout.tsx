import { Link, Outlet, useNavigate, useLocation } from 'react-router';
import { Button } from '../../components/ui/button';
import { Home, LayoutDashboard, Newspaper, AlertTriangle, LogOut, Menu, X, FileText, Users2, BarChart3, Briefcase, MapPin } from 'lucide-react';
import { logout, getCurrentUser } from '../../lib/auth';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Toaster } from '../../components/ui/sonner';

interface AdminUser {
  username: string;
  name: string;
  isLoggedIn: boolean;
}

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        navigate('/admin');
        return;
      }
      setUser(currentUser);
    };
    checkUser();
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logout berhasil!');
    navigate('/admin');
  };

  const isActive = (path: string) => location.pathname === path;

  const navigation = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Profil Dusun', path: '/admin/profile', icon: FileText },
    { name: 'Struktur Organisasi', path: '/admin/organization', icon: Users2 },
    { name: 'Data Kependudukan', path: '/admin/stats', icon: BarChart3 },
    { name: 'Kelola Berita', path: '/admin/news', icon: Newspaper },
    { name: 'Peta Evakuasi', path: '/admin/evacuation-map', icon: AlertTriangle },
    { name: 'Kelola UMKM', path: '/admin/umkm', icon: Briefcase },
    { name: 'Kelola Wisata', path: '/admin/attractions', icon: MapPin },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="bg-primary text-primary-foreground border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-xl">🏘️</span>
              </div>
              <div>
                <h1 className="font-bold">Admin Panel</h1>
                <p className="text-xs opacity-90">Dusun Sukamaju</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/" target="_blank">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 hidden md:flex">
                  <Home className="h-4 w-4 mr-2" />
                  Lihat Website
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white hover:bg-white/10 hidden md:flex"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-white"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-primary">
            <nav className="container mx-auto px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <Link key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant={isActive(item.path) ? 'secondary' : 'ghost'}
                    className="w-full justify-start text-white hover:bg-white/10"
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Button>
                </Link>
              ))}
              <Link to="/" target="_blank" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                  <Home className="h-4 w-4 mr-2" />
                  Lihat Website
                </Button>
              </Link>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start text-white hover:bg-white/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </nav>
          </div>
        )}
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:block w-64 border-r border-border bg-card min-h-[calc(100vh-64px)] sticky top-16">
          <nav className="p-4 space-y-2">
            {navigation.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? 'default' : 'ghost'}
                  className="w-full justify-start"
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Button>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  );
}