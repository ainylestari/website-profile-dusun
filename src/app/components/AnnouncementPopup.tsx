import { useState, useEffect } from 'react';
import { X, Bell } from 'lucide-react';
import { getAnnouncements, type Announcement } from '../lib/data';
import { Button } from './ui/button';

export function AnnouncementPopup() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadAnnouncements = async () => {
      const data = await getAnnouncements();
      const popupAnnouncements = data.filter(a => a.show_popup);

      if (popupAnnouncements.length === 0) return;

      // Cek apakah sudah pernah ditampilkan hari ini
      const lastShown = localStorage.getItem('announcement_last_shown');
      const today = new Date().toDateString();

      if (lastShown !== today) {
        setAnnouncements(popupAnnouncements);
        setIsOpen(true);
        localStorage.setItem('announcement_last_shown', today);
      }
    };
    loadAnnouncements();
  }, []);

  if (!isOpen || announcements.length === 0) return null;

  const current = announcements[currentIndex];

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleNext = () => {
    if (currentIndex < announcements.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-primary text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <span className="font-semibold">Pengumuman</span>
            {announcements.length > 1 && (
              <span className="text-xs opacity-75 bg-white/20 px-2 py-0.5 rounded-full">
                {currentIndex + 1}/{announcements.length}
              </span>
            )}
          </div>
          <button onClick={handleClose} className="hover:bg-white/20 rounded-full p-1 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Konten */}
        <div className="p-5 space-y-4">
          <h2 className="text-xl font-bold text-gray-800">{current.title}</h2>

          {/* Foto */}
          {current.image_url && (
            <div className="rounded-xl overflow-hidden max-h-64">
              <img
                src={current.image_url}
                alt={current.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Teks */}
          {current.content && (
            <p className="text-gray-600 leading-relaxed text-sm">{current.content}</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={handleClose}>
            Tutup
          </Button>
          {currentIndex < announcements.length - 1 && (
            <Button size="sm" onClick={handleNext}>
              Berikutnya
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}