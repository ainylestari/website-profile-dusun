import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Store, Leaf, MapPin, Phone, Loader2 } from 'lucide-react';
import { getUMKM, getTouristAttractions } from '../lib/data';
import type { UMKM, TouristAttraction } from '../lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export function Potential() {
  const [umkmList, setUmkmList] = useState<UMKM[]>([]);
  const [touristAttractions, setTouristAttractions] = useState<TouristAttraction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const [umkm, attractions] = await Promise.all([
        getUMKM(),
        getTouristAttractions(),
      ]);
      setUmkmList(umkm);
      setTouristAttractions(attractions);
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
      {/* Page Header */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Potensi Dusun</h1>
          <p className="text-lg opacity-90">Kekayaan dan potensi yang dimiliki Dusun Tirtomoyo</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="umkm" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="umkm">UMKM</TabsTrigger>
            <TabsTrigger value="agriculture">Pertanian</TabsTrigger>
            <TabsTrigger value="tourism">Wisata</TabsTrigger>
            {/*<TabsTrigger value="livestock">Peternakan</TabsTrigger>*/}
          </TabsList>

          {/* UMKM Tab */}
          <TabsContent value="umkm">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-2">Usaha Mikro Kecil dan Menengah</h2>
              <p className="text-muted-foreground">Berbagai usaha lokal yang dikembangkan oleh masyarakat Dusun Tirtomoyo</p>
            </div>
            {umkmList.length === 0 ? (
              <div className="text-center py-16">
                <Store className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
                <p className="text-muted-foreground">Belum ada data UMKM. Tambahkan melalui panel admin.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {umkmList.map((umkm) => (
                  <Card key={umkm.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-56 overflow-hidden">
                      <img
                        src={umkm.image}
                        alt={umkm.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <CardTitle>{umkm.name}</CardTitle>
                        <Badge variant="secondary">{umkm.category}</Badge>
                      </div>
                      <CardDescription>{umkm.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Store className="h-4 w-4" />
                          <span>Pemilik: {umkm.owner}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span>{umkm.contact}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Agriculture Tab */}
          <TabsContent value="agriculture">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-2">Pertanian dan Perkebunan</h2>
              <p className="text-muted-foreground">Hasil pertanian dan perkebunan yang menjadi mata pencaharian utama masyarakat</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  color: 'primary',
                  title: 'Padi',
                  desc: 'Tanaman padi menjadi komoditas utama dengan lahan sawah seluas 150 hektar',
                  stats: [['Luas Lahan', '150 Ha'], ['Masa Panen', '3-4 bulan'], ['Produksi/Tahun', '900 ton']],
                },
                {
                  color: 'secondary',
                  title: 'Sayuran',
                  desc: 'Berbagai jenis sayuran segar seperti cabai, tomat, kangkung, dan bayam',
                  stats: [['Luas Lahan', '45 Ha'], ['Jenis Tanaman', '15+ jenis'], ['Panen', 'Kontinyu']],
                },
                {
                  color: 'chart-3',
                  title: 'Perkebunan',
                  desc: 'Kopi, kelapa, dan buah-buahan tropis seperti durian dan rambutan',
                  stats: [['Luas Lahan', '80 Ha'], ['Komoditas', 'Kopi, Kelapa'], ['Petani', '120+ KK']],
                },
              ].map(({ color, title, desc, stats }) => (
                <Card key={title}>
                  <CardHeader>
                    <div className={`w-16 h-16 bg-${color}/10 rounded-full flex items-center justify-center mb-4`}>
                      <Leaf className={`h-8 w-8 text-${color}`} />
                    </div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{desc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      {stats.map(([label, value]) => (
                        <div key={label} className="flex justify-between">
                          <span className="text-muted-foreground">{label}</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="mt-6 bg-muted/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Leaf className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Sistem Pertanian Modern</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Dusun Tirtomoyo menerapkan sistem pertanian modern dengan irigasi teknis,
                      penggunaan pupuk organik, dan pengendalian hama terpadu. Hal ini meningkatkan
                      produktivitas dan kualitas hasil pertanian secara signifikan.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tourism Tab */}
          <TabsContent value="tourism">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-2">Destinasi Wisata</h2>
              <p className="text-muted-foreground">Tempat wisata alam yang indah dan menarik untuk dikunjungi</p>
            </div>
            {touristAttractions.length === 0 ? (
              <div className="text-center py-16">
                <MapPin className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
                <p className="text-muted-foreground">Belum ada data wisata. Tambahkan melalui panel admin.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {touristAttractions.map((attraction) => (
                  <Card key={attraction.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-64 overflow-hidden">
                      <img
                        src={attraction.image}
                        alt={attraction.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-2xl">{attraction.name}</CardTitle>
                      <CardDescription className="text-base leading-relaxed">{attraction.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          Fasilitas:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {attraction.facilities.map((facility, index) => (
                            <Badge key={index} variant="outline">{facility}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <Card className="mt-6 bg-primary text-primary-foreground">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Kunjungi Dusun Tirtomoyo</h3>
                <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
                  Nikmati keindahan alam, udara segar, dan keramahan masyarakat. Cocok untuk
                  refreshing bersama keluarga atau gathering kantor.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  {[
                    ['Jam Buka', '24 Jam'],
                    ['Akses', 'Mudah Dijangkau'],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-white/10 rounded-lg px-6 py-3">
                      <p className="text-sm opacity-90">{label}</p>
                      <p className="font-bold text-lg">{value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/*
          <TabsContent value="livestock">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-2">Peternakan</h2>
              <p className="text-muted-foreground">Hasil peternakan yang menjadi salah satu sumber penghasilan masyarakat Dusun Tirtomoyo</p>
            </div>
          
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  emoji: '🐄',
                  color: 'primary',
                  title: 'Sapi',
                  desc: 'Peternakan sapi potong dan sapi perah yang dikelola warga secara mandiri',
                  stats: [['Jumlah Ternak', '±120 ekor'], ['Peternak', '35 KK'], ['Hasil', 'Daging & Susu']],
                },
                {
                  emoji: '🐐',
                  color: 'secondary',
                  title: 'Kambing & Domba',
                  desc: 'Kambing dan domba dipelihara sebagai tabungan hidup dan untuk kebutuhan hari raya',
                  stats: [['Jumlah Ternak', '±250 ekor'], ['Peternak', '48 KK'], ['Hasil', 'Daging & Kulit']],
                },
                {
                  emoji: '🐓',
                  color: 'chart-3',
                  title: 'Unggas',
                  desc: 'Ayam kampung dan itik dipelihara hampir di setiap rumah tangga sebagai sumber protein',
                  stats: [['Jumlah Ternak', '±1.500 ekor'], ['Peternak', '80+ KK'], ['Hasil', 'Telur & Daging']],
                },
              ].map(({ emoji, color, title, desc, stats }) => (
                <Card key={title}>
                  <CardHeader>
                    <div className={`w-16 h-16 bg-${color}/10 rounded-full flex items-center justify-center mb-4 text-3xl`}>
                      {emoji}
                    </div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{desc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      {stats.map(([label, value]) => (
                        <div key={label} className="flex justify-between">
                          <span className="text-muted-foreground">{label}</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          
            <Card className="mt-6 bg-muted/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-2xl">
                    🌿
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Pola Peternakan Terpadu</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Masyarakat Dusun Tirtomoyo menerapkan pola peternakan terpadu yang memanfaatkan
                      limbah pertanian sebagai pakan ternak, dan kotoran ternak sebagai pupuk organik
                      untuk lahan pertanian. Sistem ini menjaga keseimbangan ekosistem sekaligus
                      meningkatkan pendapatan warga.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          
            <Card className="mt-6 bg-primary text-primary-foreground">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Potensi Peternakan Dusun Tirtomoyo</h3>
                <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
                  Sektor peternakan menjadi salah satu pilar ekonomi masyarakat yang terus
                  berkembang dengan dukungan lahan hijau yang luas dan sumber pakan yang melimpah.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  {[
                    ['Total Peternak', '160+ KK'],
                    ['Jenis Ternak', '3+ Jenis'],
                    ['Sistem', 'Terpadu'],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-white/10 rounded-lg px-6 py-3">
                      <p className="text-sm opacity-90">{label}</p>
                      <p className="font-bold text-lg">{value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
           */}
        </Tabs>
      </div>
    </div>
  );
}