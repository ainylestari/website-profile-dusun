import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Save, Users, Home, Briefcase, MapPin, Loader2 } from 'lucide-react';
import { getVillageStats, saveVillageStats, type VillageStats } from '../../lib/data';
import { toast } from 'sonner';

export function AdminStats() {
  const [stats, setStats] = useState<VillageStats>({ population: 0, families: 0, umkm: 0, area: '0 Ha' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      const data = await getVillageStats();
      setStats(data);
      setIsLoading(false);
    };
    loadStats();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const ok = await saveVillageStats(stats);
    if (ok) {
      toast.success('Data kependudukan berhasil diperbarui!');
    } else {
      toast.error('Gagal menyimpan data.');
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Data Kependudukan</h1>
          <p className="text-muted-foreground">Kelola statistik dan data penduduk dusun</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Simpan Perubahan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Jumlah Penduduk</CardTitle>
                <CardDescription>Total penduduk dusun</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Label htmlFor="population">Jumlah Penduduk</Label>
            <Input
              id="population"
              type="number"
              value={stats.population}
              onChange={(e) => setStats({ ...stats, population: parseInt(e.target.value) || 0 })}
              placeholder="contoh: 1245"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                <Home className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <CardTitle>Jumlah Kepala Keluarga</CardTitle>
                <CardDescription>Total kepala keluarga</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Label htmlFor="families">Jumlah KK</Label>
            <Input
              id="families"
              type="number"
              value={stats.families}
              onChange={(e) => setStats({ ...stats, families: parseInt(e.target.value) || 0 })}
              placeholder="contoh: 320"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-chart-3/10 rounded-full flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-chart-3" />
              </div>
              <div>
                <CardTitle>Jumlah UMKM</CardTitle>
                <CardDescription>Total usaha mikro kecil menengah</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Label htmlFor="umkm">Jumlah UMKM</Label>
            <Input
              id="umkm"
              type="number"
              value={stats.umkm}
              onChange={(e) => setStats({ ...stats, umkm: parseInt(e.target.value) || 0 })}
              placeholder="contoh: 42"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-chart-4/10 rounded-full flex items-center justify-center">
                <MapPin className="h-6 w-6 text-chart-4" />
              </div>
              <div>
                <CardTitle>Luas Wilayah</CardTitle>
                <CardDescription>Total luas wilayah dusun</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Label htmlFor="area">Luas Wilayah</Label>
            <Input
              id="area"
              value={stats.area}
              onChange={(e) => setStats({ ...stats, area: e.target.value })}
              placeholder="contoh: 125 Ha"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preview Data</CardTitle>
          <CardDescription>Data statistik yang akan ditampilkan di halaman beranda</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 border rounded-lg">
              <p className="text-3xl font-bold text-primary">{stats.population.toLocaleString('id-ID')}</p>
              <p className="text-sm text-muted-foreground mt-1">Penduduk</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-3xl font-bold text-secondary">{stats.families.toLocaleString('id-ID')}</p>
              <p className="text-sm text-muted-foreground mt-1">Kepala Keluarga</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-3xl font-bold text-chart-3">{stats.umkm.toLocaleString('id-ID')}</p>
              <p className="text-sm text-muted-foreground mt-1">UMKM</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-3xl font-bold text-chart-4">{stats.area}</p>
              <p className="text-sm text-muted-foreground mt-1">Luas Wilayah</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}