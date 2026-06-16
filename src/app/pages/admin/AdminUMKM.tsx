import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Plus, Edit, Trash2, X, Loader2, Upload, Link as LinkIcon } from 'lucide-react';
import { getUMKM, saveUMKMItem, updateUMKMItem, deleteUMKMItem, type UMKM } from '../../lib/data';
import { supabase } from '../../lib/supabase'; 
import { toast } from 'sonner';

type ImageMode = 'url' | 'upload';
const emptyForm = { id: '', name: '', category: '', owner: '', description: '', image: '', contact: '' };

export function AdminUMKM() {
  const [umkmList, setUmkmList] = useState<UMKM[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingUMKM, setEditingUMKM] = useState<UMKM | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [imageMode, setImageMode] = useState<ImageMode>('url');
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadUMKM();
  }, []);

  const loadUMKM = async () => {
    setIsLoading(true);
    const data = await getUMKM();
    setUmkmList(data);
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
      const fileName = `umkm/${Date.now()}-${file.name.replace(/\s/g, '-')}`;
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
    const result = await saveUMKMItem({
      name: formData.name,
      category: formData.category,
      owner: formData.owner,
      description: formData.description,
      image: formData.image,
      contact: formData.contact,
    });
    if (result) { toast.success('UMKM berhasil ditambahkan!'); await loadUMKM(); resetDialog(); }
    else toast.error('Gagal menambahkan UMKM.');
    setIsSaving(false);
  };

  const handleUpdate = async () => {
    if (!editingUMKM || !formData.name.trim()) return;
    setIsSaving(true);
    const ok = await updateUMKMItem(editingUMKM.id, {
      name: formData.name,
      category: formData.category,
      owner: formData.owner,
      description: formData.description,
      image: formData.image,
      contact: formData.contact,
    });
    if (ok) {
      toast.success('UMKM berhasil diperbarui!');
      await loadUMKM();
      resetDialog();
    } else {
      toast.error('Gagal memperbarui UMKM.');
    }
    setIsSaving(false);
  };

  const handleEdit = (umkm: UMKM) => {
    setEditingUMKM(umkm);
    setFormData(umkm);
    setPreviewUrl(umkm.image);
    setImageMode('url');
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus UMKM ini?')) return;
    const ok = await deleteUMKMItem(id);
    if (ok) { toast.success('UMKM berhasil dihapus!'); await loadUMKM(); }
    else toast.error('Gagal menghapus UMKM.');
  };

  const resetDialog = () => {
    setEditingUMKM(null);
    setFormData(emptyForm);
    setPreviewUrl('');
    setImageMode('url');
    setIsDialogOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Kelola UMKM</h1>
          <p className="text-muted-foreground">Daftar usaha mikro kecil menengah di dusun</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetDialog(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Tambah UMKM</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingUMKM ? 'Edit UMKM' : 'Tambah UMKM Baru'}</DialogTitle>
              <DialogDescription>{editingUMKM ? 'Perbarui informasi UMKM' : 'Tambahkan UMKM baru ke daftar'}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div>
                <Label htmlFor="name">Nama UMKM</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="contoh: Keripik Singkong Bu Siti" />
              </div>
              <div>
                <Label htmlFor="category">Kategori</Label>
                <Input id="category" name="category" value={formData.category} onChange={handleChange} placeholder="contoh: Makanan & Minuman" />
              </div>
              <div>
                <Label htmlFor="owner">Pemilik</Label>
                <Input id="owner" name="owner" value={formData.owner} onChange={handleChange} placeholder="contoh: Ibu Siti Aminah" />
              </div>
              <div>
                <Label htmlFor="contact">Kontak</Label>
                <Input id="contact" name="contact" value={formData.contact} onChange={handleChange} placeholder="contoh: 081234567890" />
              </div>
              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Deskripsikan produk/jasa UMKM..." rows={3} />
              </div>

              {/* Gambar */}
              <div className="space-y-3">
                <Label>Foto UMKM</Label>
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
                    name="image"
                    value={formData.image}
                    onChange={(e) => { setFormData(prev => ({ ...prev, image: e.target.value })); setPreviewUrl(e.target.value); }}
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

              <Button onClick={editingUMKM ? handleUpdate : handleAdd} className="w-full" disabled={isSaving || isUploading}>
                {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingUMKM ? 'Perbarui' : 'Tambah'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        </div>
      ) : umkmList.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            Belum ada UMKM terdaftar. Klik tombol "Tambah UMKM" untuk menambahkan.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {umkmList.map((umkm) => (
            <Card key={umkm.id} className="overflow-hidden">
              <div className="aspect-video overflow-hidden bg-muted">
                {umkm.image
                  ? <img src={umkm.image} alt={umkm.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Belum ada foto</div>
                }
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{umkm.name}</CardTitle>
                <CardDescription>{umkm.category}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Pemilik:</p>
                  <p className="font-medium">{umkm.owner}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Kontak:</p>
                  <p className="font-medium">{umkm.contact}</p>
                </div>
                <p className="text-sm line-clamp-2">{umkm.description}</p>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(umkm)} className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(umkm.id)} className="flex-1">
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