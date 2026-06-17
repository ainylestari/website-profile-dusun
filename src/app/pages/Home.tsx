import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  Users, 
  Home as HomeIcon, 
  Store, 
  MapPin, 
  Newspaper, 
  AlertTriangle,
  Phone,
  ArrowRight,
  TrendingUp,
  Leaf,
  Calendar,
  Loader2
} from 'lucide-react';
import { getVillageStats, getNewsArticles, getVillageInfo, getUMKM } from '../lib/data';
import type { NewsArticle, VillageStats, VillageInfo, UMKM } from '../lib/data';

export function Home() {
  const [latestNews, setLatestNews] = useState<NewsArticle[]>([]);
  const [villageStats, setVillageStats] = useState<VillageStats>({ population: 0, families: 0, umkm: 0, area: '0 Ha' });
  const [villageInfo, setVillageInfo] = useState<VillageInfo | null>(null);
  const [umkmList, setUmkmList] = useState<UMKM[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const [news, stats, info, umkm] = await Promise.all([
        getNewsArticles(),
        getVillageStats(),
        getVillageInfo(),
        getUMKM(),
      ]);
      setLatestNews(news.slice(0, 3));
      setVillageStats(stats);
      setVillageInfo(info);
      setUmkmList(umkm);
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/60" />
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Selamat Datang di {villageInfo?.name ?? 'Dusun Ngrancah'}
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-95">
              Dusun yang indah dengan masyarakat yang ramah, berbudaya, dan terus berkembang
              menuju masa depan yang lebih baik.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/profil">
                <Button size="lg" variant="secondary" className="rounded-full">
                  Tentang Kami
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/kontak">
                <Button size="lg" variant="outline" className="rounded-full bg-white/10 text-white border-white hover:bg-white hover:text-primary">
                  Hubungi Kami
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* Welcome Message */}
        <section className="-mt-24 mb-16 relative z-10">
          <Card className="shadow-xl">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-primary flex-shrink-0">
                  <img
                    src="https://ssnmnvmwpwegwponzkaf.supabase.co/storage/v1/object/public/assets/kadus/9014688285_75131472632167_1770218940242.png"
                    alt="Kepala Dusun"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-primary mb-2">Sambutan Kepala Dusun</h2>
                  <p className="text-muted-foreground mb-4">Assalamu'alaikum Warahmatullahi Wabarakatuh</p>
                  <p className="leading-relaxed mb-4">
                    Puji syukur kehadirat Allah SWT, dengan hadirnya website ini, kami berharap dapat
                    memberikan informasi yang transparan dan mudah diakses oleh seluruh masyarakat
                    Dusun Ngrancah dan masyarakat luas. Website ini merupakan wujud komitmen kami
                    dalam meningkatkan pelayanan dan komunikasi kepada masyarakat.
                  </p>
                  <p className="font-medium">
                    {villageInfo?.headOfHamlet ?? '-'}
                    <br />
                    <span className="text-muted-foreground font-normal">Kepala Dusun Ngrancah</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Statistics */}
        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <Users className="h-10 w-10 mb-3 opacity-90" />
                <p className="text-3xl font-bold mb-1">{villageStats.population.toLocaleString('id-ID')}</p>
                <p className="text-sm opacity-90">Total Penduduk</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-secondary to-secondary/80 text-white shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <HomeIcon className="h-10 w-10 mb-3 opacity-90" />
                <p className="text-3xl font-bold mb-1">{villageStats.families.toLocaleString('id-ID')}</p>
                <p className="text-sm opacity-90">Kepala Keluarga</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-chart-3 to-chart-3/80 text-white shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <Store className="h-10 w-10 mb-3 opacity-90" />
                <p className="text-3xl font-bold mb-1">{villageStats.umkm}</p>
                <p className="text-sm opacity-90">UMKM Aktif</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-chart-4 to-chart-4/80 text-white shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <MapPin className="h-10 w-10 mb-3 opacity-90" />
                <p className="text-3xl font-bold mb-1">{villageStats.area}</p>
                <p className="text-sm opacity-90">Luas Wilayah</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Featured Village Potential */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary mb-2">Potensi Dusun</h2>
            <p className="text-muted-foreground">Kekayaan dan potensi yang dimiliki Dusun Ngrancah</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <Store className="h-20 w-20 text-white" />
              </div>
              <CardHeader>
                <CardTitle>UMKM Lokal</CardTitle>
                <CardDescription>{umkmList.length}+ usaha mikro yang menghasilkan produk berkualitas</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/potensi">
                  <Button variant="outline" className="w-full">Lihat UMKM <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center">
                <Leaf className="h-20 w-20 text-white" />
              </div>
              <CardHeader>
                <CardTitle>Pertanian</CardTitle>
                <CardDescription>Lahan pertanian produktif dengan hasil panen melimpah</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/potensi">
                  <Button variant="outline" className="w-full">Lihat Potensi <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-chart-3 to-chart-3/70 flex items-center justify-center">
                <TrendingUp className="h-20 w-20 text-white" />
              </div>
              <CardHeader>
                <CardTitle>Wisata</CardTitle>
                <CardDescription>Destinasi wisata alam yang indah dan menarik</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/potensi">
                  <Button variant="outline" className="w-full">Lihat Wisata <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Latest News */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-2">Berita Terkini</h2>
              <p className="text-muted-foreground">Informasi dan kegiatan terbaru di Dusun Ngrancah</p>
            </div>
            <Link to="/berita">
              <Button variant="outline" className="hidden md:flex">
                Lihat Semua <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          {latestNews.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Newspaper className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Belum ada berita. Tambahkan berita melalui panel admin.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestNews.map((news) => (
                <Card key={news.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={news.thumbnail}
                      alt={news.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(news.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <CardTitle className="line-clamp-2">{news.title}</CardTitle>
                    <CardDescription className="line-clamp-3">{news.summary}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to={`/berita/${news.id}`}>
                      <Button variant="link" className="p-0 h-auto">
                        Baca Selengkapnya <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          <div className="mt-6 md:hidden text-center">
            <Link to="/berita">
              <Button variant="outline">Lihat Semua Berita <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}