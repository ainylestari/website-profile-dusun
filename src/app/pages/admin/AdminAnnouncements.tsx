import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { Plus, Pencil, Trash2, Loader2, Bell, Upload, Link as LinkIcon, X, Eye, EyeOff } from 'lucide-react';
import { getAnnouncements, saveAnnouncement, updateAnnouncement, deleteAnnouncement, type Announcement } from '../../lib/data';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

type ImageMode = 'url' | 'upload';

const emptyForm = {
  title: '',
  content: '',
  image_url: '',
  is_active: true,
  show_popup: false,
  expired_at: null as string | null,
};

export function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [imageMode, setImageMode] = useState<ImageMode>('url');
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadAnnouncements(); }, []);

  const loadAnnouncements = async () => {
    setIsLoading(true);
    // Ambil semua termasuk yang tidak aktif untuk admin
    const { data } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });
    setAnnouncements(data ?? []);
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
      const fileName = `announcements/${Date.now()}-${file.name.replace(/\s/g, '-')}`;
      const { error } = await supabase.storage.from('assets').upload(fileName, file, { upsert: true });
      if (error) throw error;
      const { data: publicData } = supabase.storage.from('assets').getPublicUrl(fileName);
      setFormData(prev => ({ ...prev, image_url: publicData.publicUrl }));
      setPreviewUrl(publicData.publicUrl);
      toast.success('Gambar berhasil diunggah!');
    } catch {
      toast.error('Gagal upload gambar.');
      setPreviewUrl('');
      setFormData(prev => ({ ...prev, image_url: '' }));
    }
    setIsUploading(false);
  };

  const handleOpenDialog = (item?: Announcement) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        content: item.content,
        image_url: item.image_url,
        is_active: item.is_active,
        show_popup: item.show_popup,
        expired_at: item.expired_at,
      });
      setPreviewUrl(item.image_url);
    } else {
      setEditingItem(null);
      setFormData(emptyForm);
      setPreviewUrl('');
    }
    setImageMode('url');
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) { toast.error('Judul wajib diisi!'); return; }
    setIsSaving(true);

    if (editingItem) {
      const ok = await updateAnnouncement(editingItem.id, formData);
      if (ok) { toast.success('Pengumuman berhasil diperbarui!'); await loadAnnouncements(); resetDialog(); }
      else toast.error('Gagal memperbarui pengumuman.');
    } else {
      const result = await saveAnnouncement(formData);
      if (result) { toast.success('Pengumuman berhasil ditambahkan!'); await loadAnnouncements(); resetDialog(); }
      else toast.error('Gagal menyimpan pengumuman.');
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus pengumuman ini?')) return;
    const ok = await deleteAnnouncement(id);
    if (ok) { toast.success('Pengumuman berhasil dihapus!'); await loadAnnouncements(); }
    else toast.error('Gagal menghapus pengumuman.');
  };

  const handleToggleActive = async (item: Announcement) => {
    const ok = await updateAnnouncement(item.id, { is_active: !item.is_active });
    if (ok) { await loadAnnouncements(); }
  };

  const resetDialog = () => {
    setEditingItem(null);
    setFormData(emptyForm);
    setPreviewUrl('');
    setImageMode('url');
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Bell className="h-7 w-7 text-yellow-500" />
            Kelola Pengumuman
          </h1>
          <p className="text-muted-foreground">Tambah pengumuman yang ditampilkan di beranda dan popup</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetDialog(); }}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />Tambah Pengumuman
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Pengumuman' : 'Tambah Pengumuman Baru'}</DialogTitle>
              <DialogDescription>Isi judul, konten, dan/atau foto pengumuman</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Judul Pengumuman *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="contoh: Jadwal Kerja Bakti"
                />
              </div>

              <div>
                <Label>Isi Pengumuman (opsional)</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Tulis isi pengumuman di sini... (bisa dikosongkan jika hanya foto)"
                  rows={4}
                />
              </div>

              {/* Foto */}
              <div className="space-y-3">
                <Label>Foto (opsional)</Label>
                <div className="flex gap-2">
                  <Button type="button" variant={imageMode === 'url' ? 'default' : 'outline'} size="sm" onClick={() => setImageMode('url')} className="gap-2">
                    <LinkIcon className="h-4 w-4" />URL
                  </Button>
                  <Button type="button" variant={imageMode === 'upload' ? 'default' : 'outline'} size="sm" onClick={() => setImageMode('upload')} className="gap-2">
                    <Upload className="h-4 w-4" />Upload Lokal
                  </Button>
                </div>

                {imageMode === 'url' ? (
                  <Input
                    value={formData.image_url}
                    onChange={(e) => { setFormData(prev => ({ ...prev, image_url: e.target.value })); setPreviewUrl(e.target.value); }}
                    placeholder="https://..."
                  />
                ) : (
                  <div>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors" onClick={() => fileInputRef.current?.click()}>
                      {isUploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          <p className="text-sm text-muted-foreground">Mengunggah...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="h-6 w-6 text-muted-foreground" />
                          <p className="text-sm">Klik untuk pilih gambar</p>
                          <p className="text-xs text-muted-foreground">JPG, PNG — Maks. 2MB</p>
                        </div>
                      )}
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </div>
                )}

                {previewUrl && (
                  <div className="relative">
                    <img src={previewUrl} alt="Preview" className="w-full h-40 object-cover rounded-lg border" onError={() => setPreviewUrl('')} />
                    <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => { setPreviewUrl(''); setFormData(prev => ({ ...prev, image_url: '' })); }}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Toggle */}
              <div className="space-y-3 border rounded-lg p-4 bg-muted/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Tampilkan di Beranda</p>
                    <p className="text-xs text-muted-foreground">Muncul di section pengumuman halaman utama</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, is_active: !prev.is_active }))}
                    className={`w-11 h-6 rounded-full transition-colors ${formData.is_active ? 'bg-primary' : 'bg-gray-300'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${formData.is_active ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Tampilkan sebagai Popup</p>
                    <p className="text-xs text-muted-foreground">Muncul otomatis saat website dibuka</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, show_popup: !prev.show_popup }))}
                    className={`w-11 h-6 rounded-full transition-colors ${formData.show_popup ? 'bg-primary' : 'bg-gray-300'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${formData.show_popup ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" onClick={resetDialog}>Batal</Button>
                <Button onClick={handleSubmit} disabled={isSaving || isUploading}>
                  {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editingItem ? 'Perbarui' : 'Simpan'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        </div>
      ) : announcements.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            Belum ada pengumuman. Klik "Tambah Pengumuman" untuk membuat.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {announcements.map((item) => (
            <Card key={item.id} className={`${!item.is_active ? 'opacity-50' : ''}`}>
              <CardContent className="p-4">
                <div className="flex gap-4 items-start">
                  {item.image_url && (
                    <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold line-clamp-1">{item.title}</h3>
                      {item.is_active && <Badge className="bg-green-100 text-green-700 text-xs">Aktif</Badge>}
                      {item.show_popup && <Badge className="bg-blue-100 text-blue-700 text-xs">Popup</Badge>}
                      {!item.is_active && <Badge variant="secondary" className="text-xs">Nonaktif</Badge>}
                    </div>
                    {item.content && <p className="text-sm text-muted-foreground line-clamp-1">{item.content}</p>}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => handleToggleActive(item)} title={item.is_active ? 'Nonaktifkan' : 'Aktifkan'}>
                      {item.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}