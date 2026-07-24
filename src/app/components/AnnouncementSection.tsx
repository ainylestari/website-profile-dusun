import { useState, useEffect } from 'react';
import { Bell, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { getAnnouncements, type Announcement } from '../lib/data';

export function AnnouncementSection() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getAnnouncements();
      setAnnouncements(data);
      setIsLoading(false);
    };
    load();
  }, []);

  if (isLoading || announcements.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
          <Bell className="h-5 w-5 text-yellow-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-primary">Pengumuman</h2>
          <p className="text-sm text-muted-foreground">Informasi penting dari Dusun Ngrancah</p>
        </div>
      </div>

      <div className="space-y-3">
        {announcements.map((item) => (
          <Card key={item.id} className="border-l-4 border-l-yellow-400 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex gap-4 items-start">
                {/* Foto kalau ada */}
                {item.image_url ? (
                  <div className="w-24 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bell className="h-6 w-6 text-yellow-500" />
                  </div>
                )}

                {/* Konten */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-800 line-clamp-1">{item.title}</h3>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 shrink-0 text-xs">
                      Pengumuman
                    </Badge>
                  </div>
                  {item.content && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.content}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(item.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}