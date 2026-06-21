{/*import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { AlertTriangle, Save, Loader2, Plus, Trash2, MapPin, Phone, X, Upload, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';

interface EvacuationPoint {
  label: string;
  location: string;
  type: 'assembly' | 'route' | 'medical';
}

interface EmergencyContact {
  name: string;
  number: string;
}

interface EvacuationData {
  map_image_url: string;
  evacuation_points: EvacuationPoint[];
  emergency_contacts: EmergencyContact[];
  procedures: string[];
}

type ImageMode = 'url' | 'upload';

const defaultData: EvacuationData = {
  map_image_url: '',
  evacuation_points: [
    { label: 'Titik Kumpul 1', location: 'Lapangan Dusun', type: 'assembly' },
    { label: 'Jalur Evakuasi Utama', location: 'Jl. Raya Sukamaju', type: 'route' },
    { label: 'Pos Medis', location: 'Balai Dusun', type: 'medical' },
  ],
  emergency_contacts: [
    { name: 'Kepala Dusun', number: '0812-3456-7890' },
    { name: 'BPBD Kabupaten', number: '119' },
    { name: 'Pemadam Kebakaran', number: '113' },
  ],
  procedures: [
    'Tetap tenang dan jangan panik.',
    'Matikan listrik, gas, dan air sebelum meninggalkan rumah.',
    'Bawa dokumen penting (KTP, KK, dll) dalam tas siaga.',
    'Ikuti jalur evakuasi yang telah ditentukan.',
    'Menuju titik kumpul terdekat dan tunggu instruksi petugas.',
  ],
};

export function AdminEvacuationMap() {
  const [data, setData] = useState<EvacuationData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageMode, setImageMode] = useState<ImageMode>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const { data: row } = await supabase
      .from('evacuation_map')
      .select('*')
      .eq('id', 1)
      .single();

    if (row) {
      setData({
        map_image_url: row.map_image_url ?? '',
        evacuation_points: row.evacuation_points ?? defaultData.evacuation_points,
        emergency_contacts: row.emergency_contacts ?? defaultData.emergency_contacts,
        procedures: row.procedures ?? defaultData.procedures,
      });
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const { error } = await supabase.from('evacuation_map').upsert({
      id: 1,
      map_image_url: data.map_image_url,
      evacuation_points: data.evacuation_points,
      emergency_contacts: data.emergency_contacts,
      procedures: data.procedures,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      toast.error('Gagal menyimpan data.');
    } else {
      toast.success('Data peta evakuasi berhasil disimpan!');
    }
    setIsSaving(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Ukuran file maksimal 2MB!'); return; }
    if (!file.type.startsWith('image/')) { toast.error('File harus berupa gambar!'); return; }

    setIsUploading(true);

    try {
      const fileName = `evacuation/${Date.now()}-${file.name.replace(/\s/g, '-')}`;
      const { error } = await supabase.storage.from('assets').upload(fileName, file, { upsert: true });
      if (error) throw error;

      const { data: publicData } = supabase.storage.from('assets').getPublicUrl(fileName);
      setData(prev => ({ ...prev, map_image_url: publicData.publicUrl }));
      toast.success('Gambar berhasil diunggah!');
    } catch {
      toast.error('Gagal upload. Pastikan bucket "assets" sudah dibuat di Supabase Storage.');
    }
    setIsUploading(false);
  };

  const clearImage = () => {
    setData(prev => ({ ...prev, map_image_url: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const addPoint = () => {
    setData(prev => ({
      ...prev,
      evacuation_points: [...prev.evacuation_points, { label: '', location: '', type: 'assembly' }],
    }));
  };

  const removePoint = (i: number) => {
    setData(prev => ({
      ...prev,
      evacuation_points: prev.evacuation_points.filter((_, idx) => idx !== i),
    }));
  };

  const updatePoint = (i: number, field: keyof EvacuationPoint, value: string) => {
    setData(prev => {
      const points = [...prev.evacuation_points];
      points[i] = { ...points[i], [field]: value } as EvacuationPoint;
      return { ...prev, evacuation_points: points };
    });
  };

  const addContact = () => {
    setData(prev => ({
      ...prev,
      emergency_contacts: [...prev.emergency_contacts, { name: '', number: '' }],
    }));
  };

  const removeContact = (i: number) => {
    setData(prev => ({
      ...prev,
      emergency_contacts: prev.emergency_contacts.filter((_, idx) => idx !== i),
    }));
  };

  const updateContact = (i: number, field: keyof EmergencyContact, value: string) => {
    setData(prev => {
      const contacts = [...prev.emergency_contacts];
      contacts[i] = { ...contacts[i], [field]: value };
      return { ...prev, emergency_contacts: contacts };
    });
  };

  const updateProcedure = (i: number, value: string) => {
    setData(prev => {
      const procs = [...prev.procedures];
      procs[i] = value;
      return { ...prev, procedures: procs };
    });
  };

  const addProcedure = () => {
    setData(prev => ({ ...prev, procedures: [...prev.procedures, ''] }));
  };

  const removeProcedure = (i: number) => {
    setData(prev => ({ ...prev, procedures: prev.procedures.filter((_, idx) => idx !== i) }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <AlertTriangle className="h-7 w-7 text-red-600" />
            Kelola Peta Evakuasi
          </h1>
          <p className="text-muted-foreground">Atur gambar peta, titik evakuasi, dan kontak darurat</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Simpan Semua
        </Button>
      </div>

      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Gambar Peta Evakuasi
          </CardTitle>
          <CardDescription>
            Pilih sumber gambar peta evakuasi: masukkan URL atau upload langsung dari perangkat
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button type="button" variant={imageMode === 'url' ? 'default' : 'outline'} size="sm" onClick={() => setImageMode('url')} className="gap-2">
              <LinkIcon className="h-4 w-4" />URL
            </Button>
            <Button type="button" variant={imageMode === 'upload' ? 'default' : 'outline'} size="sm" onClick={() => setImageMode('upload')} className="gap-2">
              <Upload className="h-4 w-4" />Upload dari Lokal
            </Button>
          </div>

          {imageMode === 'url' ? (
            <div>
              <Label>URL Gambar Peta</Label>
              <Input
                value={data.map_image_url}
                onChange={(e) => setData(prev => ({ ...prev, map_image_url: e.target.value }))}
                placeholder="https://... (URL gambar JPG/PNG peta evakuasi)"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors" onClick={() => fileInputRef.current?.click()}>
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Mengunggah gambar...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium">Klik untuk pilih gambar</p>
                    <p className="text-xs text-muted-foreground">JPG, PNG, WebP — Maks. 2MB</p>
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </div>
          )}

          {data.map_image_url && (
            <div className="relative border rounded-lg overflow-hidden max-h-64">
              <img src={data.map_image_url} alt="Preview peta" className="w-full object-contain" onError={() => toast.error('Gagal memuat gambar.')} />
              <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={clearImage}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Titik Penting Evakuasi</CardTitle>
          <CardDescription>Tambah atau edit titik kumpul, jalur, dan pos medis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.evacuation_points.map((point, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="grid grid-cols-3 gap-2 flex-1">
                <Input
                  value={point.label}
                  onChange={(e) => updatePoint(i, 'label', e.target.value)}
                  placeholder="Nama titik"
                />
                <Input
                  value={point.location}
                  onChange={(e) => updatePoint(i, 'location', e.target.value)}
                  placeholder="Lokasi"
                />
                <select
                  value={point.type}
                  onChange={(e) => updatePoint(i, 'type', e.target.value)}
                  className="border border-input rounded-md px-3 py-2 text-sm bg-background"
                >
                  <option value="assembly">Titik Kumpul</option>
                  <option value="route">Jalur Evakuasi</option>
                  <option value="medical">Pos Medis</option>
                </select>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removePoint(i)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addPoint}>
            <Plus className="h-4 w-4 mr-2" /> Tambah Titik
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-red-600" />
            Kontak Darurat
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.emergency_contacts.map((contact, i) => (
            <div key={i} className="flex gap-3 items-center">
              <Input
                value={contact.name}
                onChange={(e) => updateContact(i, 'name', e.target.value)}
                placeholder="Nama kontak"
                className="flex-1"
              />
              <Input
                value={contact.number}
                onChange={(e) => updateContact(i, 'number', e.target.value)}
                placeholder="Nomor telepon"
                className="flex-1"
              />
              <Button variant="ghost" size="sm" onClick={() => removeContact(i)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addContact}>
            <Plus className="h-4 w-4 mr-2" /> Tambah Kontak
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prosedur Evakuasi</CardTitle>
          <CardDescription>Langkah-langkah yang ditampilkan di halaman publik</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.procedures.map((proc, i) => (
            <div key={i} className="flex gap-3 items-center">
              <span className="w-7 h-7 rounded-full bg-orange-600 text-white text-xs flex items-center justify-center font-bold shrink-0">
                {i + 1}
              </span>
              <Input
                value={proc}
                onChange={(e) => updateProcedure(i, e.target.value)}
                placeholder="Langkah prosedur..."
                className="flex-1"
              />
              <Button variant="ghost" size="sm" onClick={() => removeProcedure(i)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addProcedure}>
            <Plus className="h-4 w-4 mr-2" /> Tambah Langkah
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} size="lg">
          {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Simpan Semua Perubahan
        </Button>
      </div>
    </div>
  );
}
*/}
