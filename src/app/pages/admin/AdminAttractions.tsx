import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Plus, Edit, Trash2, X, Loader2, Upload, Link as LinkIcon } from 'lucide-react';
import { getTouristAttractions, saveAttraction, updateAttraction, deleteAttraction, type TouristAttraction } from '../../lib/data';
import { supabase } from '../../lib/supabase'; 
import { toast } from 'sonner';

type ImageMode = 'url' | 'upload'; //tambah
const emptyForm = { id: '', name: '', description: '', image: '', facilities: [] as string[] };

export function AdminAttractions() {
  const [attractions, setAttractions] = useState<TouristAttraction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingAttraction, setEditingAttraction] = useState<TouristAttraction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [facilityInput, setFacilityInput] = useState('');
  const [imageMode, setImageMode] = useState<ImageMode>('url');
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadAttractions(); }, []);

  const loadAttractions = async () => {
    setIsLoading(true);
    const data = await getTouristAttractions();
    setAttractions(data);
    setIsLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Ukuran file maksimal 2MB!'); return; }
    if (!file.type.startsWith('image/')) { toast.error('File harus berupa gambar!'); return; }

    setIsUploading(true);
    setPreviewUrl(URL.createObjectURL(file));

    try {
      const fileName = `attractions/${Date.now()}-${file.name.replace(/\s/g, '-')}`;
      const { error } = await supabase.storage.from('assets').upload(fileName, file, { upsert: true });
      if (error) throw error;

      const { data: publicData } = supabase.storage.from('assets').getPublicUrl(fileName);
      setFormData(prev => ({ ...prev, image: publicData.publicUrl }));
      setPreviewUrl(publicData.publicUrl);
      toast.success('Gambar berhasil diunggah!');
    } catch {
      toast.error('Gagal upload. Pastikan bucket "assets" sudah dibuat di Supabase Storage.');
      setPreviewUrl('');
      setFormData(prev => ({ ...prev, image: '' }));
    }
    setIsUploading(false);
  };

  const clearImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAdd = async () => {
    if (!formData.name.trim() || !formData.description.trim()) return;
    setIsSaving(true);
    const result = await saveAttraction({
      name: formData.name, description: formData.description,
      image: formData.image, facilities: formData.facilities,
    });
    if (result) { toast.success('Wisata berhasil ditambahkan!'); await loadAttractions(); resetDialog(); }
    else toast.error('Gagal menambahkan wisata.');
    setIsSaving(false);
  };

  const handleUpdate = async () => {
    if (!editingAttraction || !formData.name.trim()) return;
    setIsSaving(true);
    const ok = await updateAttraction(editingAttraction.id, {
      name: formData.name, description: formData.description,
      image: formData.image, facilities: formData.facilities,
    });
    if (ok) { toast.success('Wisata berhasil diperbarui!'); await loadAttractions(); resetDialog(); }
    else toast.error('Gagal memperbarui wisata.');
    setIsSaving(false);
  };

  const handleEdit = (attraction: TouristAttraction) => {
    setEditingAttraction(attraction);
    setFormData(attraction);
    setPreviewUrl(attraction.image);
    setImageMode('url');
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus tempat wisata ini?')) return;
    const ok = await deleteAttraction(id);
    if (ok) { toast.success('Wisata berhasil dihapus!'); await loadAttractions(); }
    else toast.error('Gagal menghapus wisata.');
  };

  const addFacility = () => {
    if (facilityInput.trim()) {
      setFormData({ ...formData, facilities: [...formData.facilities, facilityInput.trim()] });
      setFacilityInput('');
    }
  };

  const removeFacility = (index: number) => {
    setFormData({ ...formData, facilities: formData.facilities.filter((_, i) => i !== index) });
  };

  const resetDialog = () => {
    setEditingAttraction(null);
    setFormData(emptyForm);
    setFacilityInput('');
    setPreviewUrl('');
    setImageMode('url');
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Kelola Tempat Wisata</h1>
          <p className="text-muted-foreground">Destinasi wisata dan atraksi di dusun</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetDialog(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Tambah Wisata</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingAttraction ? 'Edit Tempat Wisata' : 'Tambah Tempat Wisata Baru'}</DialogTitle>
              <DialogDescription>{editingAttraction ? 'Perbarui informasi tempat wisata' : 'Tambahkan destinasi wisata baru'}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div>
                <Label>Nama Tempat Wisata</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="contoh: Curug Cigamea" />
              </div>
              <div>
                <Label>Deskripsi</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Deskripsikan tempat wisata..." rows={4} />
              </div>

              {/* Gambar */}
              <div className="space-y-3">
                <Label>Foto Tempat Wisata</Label>
                <div className="flex gap-2">
                  <Button type="button" variant={imageMode === 'url' ? 'default' : 'outline'} size="sm" onClick={() => setImageMode('url')} className="gap-2">
                    <LinkIcon className="h-4 w-4" />URL
                  </Button>
                  <Button type="button" variant={imageMode === 'upload' ? 'default' : 'outline'} size="sm" onClick={() => setImageMode('upload')} className="gap-2">
                    <Upload className="h-4 w-4" />Upload dari Lokal
                  </Button>
                </div>

                {imageMode === 'url' ? (
                  <Input
                    value={formData.image}
                    onChange={(e) => { setFormData({ ...formData, image: e.target.value }); setPreviewUrl(e.target.value); }}
                    placeholder="https://images.unsplash.com/..."
                  />
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

                {previewUrl && (
                  <div className="relative">
                    <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover rounded-lg border" onError={() => setPreviewUrl('')} />
                    <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={clearImage}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Fasilitas */}
              <div>
                <Label>Fasilitas</Label>
                <div className="space-y-2 mb-2">
                  {formData.facilities.map((facility, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded">
                      <span className="flex-1 text-sm">{facility}</span>
                      <Button variant="ghost" size="sm" onClick={() => removeFacility(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input value={facilityInput} onChange={(e) => setFacilityInput(e.target.value)} placeholder="Tambah fasilitas..." onKeyDown={(e) => e.key === 'Enter' && addFacility()} />
                  <Button onClick={addFacility} type="button"><Plus className="h-4 w-4" /></Button>
                </div>
              </div>

              <Button onClick={editingAttraction ? handleUpdate : handleAdd} className="w-full" disabled={isSaving || isUploading}>
                {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingAttraction ? 'Perbarui' : 'Tambah'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        </div>
      ) : attractions.length === 0 ? (
        <Card><CardContent className="py-16 text-center text-muted-foreground">Belum ada tempat wisata terdaftar.</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attractions.map((attraction) => (
            <Card key={attraction.id} className="overflow-hidden">
              <div className="aspect-video overflow-hidden bg-muted">
                {attraction.image
                  ? <img src={attraction.image} alt={attraction.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Belum ada foto</div>
                }
              </div>
              <CardHeader><CardTitle className="text-lg">{attraction.name}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm line-clamp-3">{attraction.description}</p>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Fasilitas:</p>
                  <div className="flex flex-wrap gap-1">
                    {attraction.facilities.map((facility, index) => (
                      <span key={index} className="text-xs bg-secondary/20 px-2 py-1 rounded">{facility}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(attraction)} className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(attraction.id)} className="flex-1">
                    <Trash2 className="h-4 w-4 mr-1" />Hapus
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}