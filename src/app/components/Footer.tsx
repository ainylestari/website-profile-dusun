import { useState, useEffect } from 'react';
import { Mail, MapPin, Phone, Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router';
import { getVillageInfo } from '../lib/data';
import type { VillageInfo } from '../lib/data';

export function Footer() {
  const [villageInfo, setVillageInfo] = useState<VillageInfo | null>(null);

  useEffect(() => {
    getVillageInfo().then(setVillageInfo);
  }, []);

  return (
    <footer className="bg-primary text-primary-foreground mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-xl">🏘️</span>
              </div>
              <div>
                <h3 className="font-bold">{villageInfo?.name ?? 'Dusun Tirtomoyo'}</h3>
                <p className="text-xs opacity-90">{villageInfo?.village ?? 'Desa Bumiharjo'}</p>
              </div>
            </div>
            <p className="text-sm opacity-90 leading-relaxed">
              Website resmi Dusun Tirtomoyo, menyajikan informasi terkini tentang profil,
              potensi, dan kegiatan di dusun kami.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold mb-4">Kontak</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="opacity-90">{villageInfo?.address ?? '-'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span className="opacity-90">{villageInfo?.phone ?? '-'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="opacity-90">{villageInfo?.email ?? '-'}</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-bold mb-4">Media Sosial</h3>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm opacity-90 mt-4">Ikuti media sosial kami untuk update terbaru</p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-sm opacity-90">
            &copy; {new Date().getFullYear()} {villageInfo?.name ?? 'Dusun Tirtomoyo'}. Dikembangkan oleh Tim KKN UPN "Veteran" Yogyakarta.
          </p>
        </div>
      </div>
    </footer>
  );
}