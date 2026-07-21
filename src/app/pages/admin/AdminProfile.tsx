import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Save, Plus, X, Loader2 } from 'lucide-react';
import { getVillageInfo, saveVillageInfo, type VillageInfo } from '../../lib/data';
import { toast } from 'sonner';

const defaultInfo: VillageInfo = {
  name: '', village: '', district: '', regency: '', province: '',
  postalCode: '', headOfHamlet: '', phone: '', email: '', address: '',
  history: '', vision: '', missions: [], mapEmbedUrl: '',
};

export function AdminProfile() {
  const [info, setInfo] = useState<VillageInfo>(defaultInfo);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [missionInput, setMissionInput] = useState('');

  useEffect(() => {
    const loadInfo = async () => {
      setIsLoading(true);
      const data = await getVillageInfo();
      if (data) setInfo(data);
      setIsLoading(false);
    };
    loadInfo();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const ok = await saveVillageInfo(info);
    if (ok) {
      toast.success('Profil dusun berhasil diperbarui!');
    } else {
      toast.error('Gagal menyimpan profil.');
    }
    setIsSaving(false);
  };

  const addMission = () => {
    if (missionInput.trim()) {
      setInfo({ ...info, missions: [...info.missions, missionInput.trim()] });
      setMissionInput('');
    }
  };

  const removeMission = (index: number) => {
    setInfo({ ...info, missions: info.missions.filter((_, i) => i !== index) });
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
          <h1 className="text-3xl font-bold mb-2">Kelola Profil Dusun</h1>
          <p className="text-muted-foreground">Informasi umum tentang dusun</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Simpan Perubahan
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Dasar</CardTitle>
          <CardDescription>Data identitas dusun</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 'name', label: 'Nama Dusun', key: 'name' },
              { id: 'headOfHamlet', label: 'Nama Kepala Dusun', key: 'headOfHamlet' },
              { id: 'village', label: 'Desa', key: 'village' },
              { id: 'district', label: 'Kecamatan', key: 'district' },
              { id: 'regency', label: 'Kabupaten', key: 'regency' },
              { id: 'province', label: 'Provinsi', key: 'province' },
              { id: 'postalCode', label: 'Kode Pos', key: 'postalCode' },
            ].map(({ id, label, key }) => (
              <div key={id}>
                <Label htmlFor={id}>{label}</Label>
                <Input
                  id={id}
                  value={info[key as keyof VillageInfo] as string}
                  onChange={(e) => setInfo({ ...info, [key]: e.target.value })}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kontak</CardTitle>
          <CardDescription>Informasi kontak dusun</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={info.email} onChange={(e) => setInfo({ ...info, email: e.target.value })} />
            </div>
          </div>
          <div>
            <Label htmlFor="address">Alamat Lengkap</Label>
            <Textarea id="address" value={info.address} onChange={(e) => setInfo({ ...info, address: e.target.value })} rows={2} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visi</CardTitle>
          <CardDescription>Visi dusun untuk masa depan</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea value={info.vision} onChange={(e) => setInfo({ ...info, vision: e.target.value })} rows={3} placeholder="Tuliskan visi dusun..." />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Misi</CardTitle>
          <CardDescription>Misi untuk mencapai visi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {info.missions.map((mission, index) => (
              <div key={index} className="flex items-start gap-2 p-3 border rounded-lg">
                <span className="font-medium text-sm">{index + 1}.</span>
                <p className="flex-1 text-sm">{mission}</p>
                <Button variant="ghost" size="sm" onClick={() => removeMission(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={missionInput}
              onChange={(e) => setMissionInput(e.target.value)}
              placeholder="Tambahkan misi baru..."
              onKeyDown={(e) => e.key === 'Enter' && addMission()}
            />
            <Button onClick={addMission}>
              <Plus className="h-4 w-4 mr-2" />Tambah
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Peta (Google Maps Embed URL)</CardTitle>
          <CardDescription>URL embed dari Google Maps</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            value={info.mapEmbedUrl}
            onChange={(e) => setInfo({ ...info, mapEmbedUrl: e.target.value })}
            placeholder="https://www.google.com/maps/embed?pb=..."
          />
          <p className="text-xs text-muted-foreground mt-2">
            Cara mendapatkan URL: Google Maps → Bagikan → Sematkan peta → Copy URL dari src="..."
          </p>
        </CardContent>
      </Card>
    </div>
  );
}