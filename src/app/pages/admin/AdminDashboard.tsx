import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router';
import { Newspaper, AlertTriangle, TrendingUp, Users, Eye, FileText, Users2, BarChart3, Briefcase, MapPin, Loader2 } from 'lucide-react';
import { getNewsArticles, getVillageStats, getUMKM, getTouristAttractions } from '../../lib/data';
import type { NewsArticle, VillageStats, UMKM, TouristAttraction } from '../../lib/data';

export function AdminDashboard() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [stats, setStats] = useState<VillageStats>({ population: 0, families: 0, umkm: 0, area: '0 Ha' });
  const [umkm, setUmkm] = useState<UMKM[]>([]);
  const [attractions, setAttractions] = useState<TouristAttraction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const [newsData, statsData, umkmData, attractionsData] = await Promise.all([
        getNewsArticles(),
        getVillageStats(),
        getUMKM(),
        getTouristAttractions(),
      ]);
      setNews(newsData);
      setStats(statsData);
      setUmkm(umkmData);
      setAttractions(attractionsData);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const recentNews = news.slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Selamat datang di Admin Panel Dusun Tirtomoyo</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Berita', value: news.length, icon: Newspaper, color: 'primary' },
          { label: 'Total UMKM', value: umkm.length, icon: Briefcase, color: 'chart-3' },
          { label: 'Kategori Berita', value: new Set(news.map(n => n.category)).size, icon: TrendingUp, color: 'chart-3' },
          { label: 'Total Penduduk', value: stats.population.toLocaleString('id-ID'), icon: Users, color: 'primary' },
          { label: 'Kepala Keluarga', value: stats.families.toLocaleString('id-ID'), icon: Users2, color: 'secondary' },
          { label: 'UMKM Terdaftar', value: stats.umkm, icon: Briefcase, color: 'chart-3' },
          { label: 'Luas Wilayah', value: stats.area, icon: BarChart3, color: 'chart-4' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{label}</p>
                  <p className="text-3xl font-bold">{value}</p>
                </div>
                <div className={`w-12 h-12 bg-${color}/10 rounded-full flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 text-${color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent News */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Berita Terbaru</CardTitle>
              <CardDescription>5 berita terakhir yang dipublikasikan</CardDescription>
            </div>
            <Link to="/admin/news">
              <Button variant="outline" size="sm">Lihat Semua</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentNews.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Belum ada berita.</p>
          ) : (
            <div className="space-y-4">
              {recentNews.map((article) => (
                <div key={article.id} className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-accent transition-colors">
                  <div className="w-20 h-20 overflow-hidden rounded-lg flex-shrink-0">
                    <img src={article.thumbnail} alt={article.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium line-clamp-1 mb-1">{article.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{article.summary}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded">{article.category}</span>
                      <span>•</span>
                      <span>{new Date(article.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}