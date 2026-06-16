import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Home } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <h2 className="text-3xl font-bold mb-4">Halaman Tidak Ditemukan</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Maaf, halaman yang Anda cari tidak dapat ditemukan. Silakan kembali ke halaman utama.
          </p>
        </div>
        <Link to="/">
          <Button size="lg" className="rounded-full">
            <Home className="mr-2 h-5 w-5" />
            Kembali ke Beranda
          </Button>
        </Link>
      </div>
    </div>
  );
}
