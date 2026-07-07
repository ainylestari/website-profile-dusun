import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { Plus, Pencil, Trash2, Calendar, Loader2, Upload, Link as LinkIcon, X } from 'lucide-react';
import { getNewsArticles, saveNewsArticle, updateNewsArticle, deleteNewsArticle, NewsArticle } from '../../lib/data';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

type ImageMode = 'url' | 'upload';

export function AdminNews() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [imageMode, setImageMode] = useState<ImageMode>('url');
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: '', summary: '', content: '', category: '', thumbnail: ''
  });

  useEffect(() => { loadNews(); }, []);

  const loadNews = async () => {
    setIsLoading(true);
    const data = await getNewsArticles();
    setNews(data);
    setIsLoading(false);
  };

  const handleOpenDialog = (article?: NewsArticle) => {
    if (article) {
      setEditingNews(article);
      setFormData({
        title: article.title, summary: article.summary,
        content: article.content, category: article.category, thumbnail: article.thumbnail
      });
      setPreviewUrl(article.thumbnail);
    } else {
      setEditingNews(null);
      setFormData({ title: '', summary: '', content: '', category: '', thumbnail: '' });
      setPreviewUrl('');
    }
    setImageMode('url');
    setIsDialogOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi ukuran (max 2MB) dan tipe file
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 2MB!');
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar (JPG, PNG, WebP)!');
      return;
    }

    setIsUploading(true);

    // Preview lokal dulu
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    try {
      const fileName = `news/${Date.now()}-${file.name.replace(/\s/g, '-')}`;
      const { error } = await supabase.storage
        .from('assets')
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data: publicData } = supabase.storage
        .from('assets')
        .getPublicUrl(fileName);

      const publicUrl = publicData.publicUrl;
      setFormData(prev => ({ ...prev, thumbnail: publicUrl }));
      setPreviewUrl(publicUrl);
      toast.success('Gambar berhasil diunggah!');
    } catch (err) {
      toast.error('Gagal upload gambar. Pastikan bucket "assets" sudah dibuat di Supabase Storage.');
      setPreviewUrl('');
      setFormData(prev => ({ ...prev, thumbnail: '' }));
    }

    setIsUploading(false);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, thumbnail: url }));
    setPreviewUrl(url);
  };

  const clearImage = () => {
    setFormData(prev => ({ ...prev, thumbnail: '' }));
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (editingNews) {
      const ok = await updateNewsArticle(editingNews.id, formData);
      if (ok) { toast.success('Berita berhasil diperbarui!'); await loadNews(); }
      else toast.error('Gagal memperbarui berita.');
    } else {
      const result = await saveNewsArticle({
        ...formData,
        date: new Date().toISOString().split('T')[0],
        author: 'Admin Dusun'
      });
      if (result) { toast.success('Berita berhasil ditambahkan!'); await loadNews(); }
      else toast.error('Gagal menyimpan berita.');
    }

    setIsSaving(false);
    setIsDialogOpen(false);
    setFormData({ title: '', summary: '', content: '', category: '', thumbnail: '' });
    setPreviewUrl('');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
      const ok = await deleteNewsArticle(id);
      if (ok) { toast.success('Berita berhasil dihapus!'); await loadNews(); }
      else toast.error('Gagal menghapus berita.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Kelola Berita</h1>
          <p className="text-muted-foreground">Tambah, edit, atau hapus berita dan kegiatan</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />Tambah Berita
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingNews ? 'Edit Berita' : 'Tambah Berita Baru'}</DialogTitle>
              <DialogDescription>
                Isi formulir di bawah ini untuk {editingNews ? 'memperbarui' : 'menambahkan'} berita
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Judul Berita</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="Masukkan judul berita" required />
              </div>
              <div>
                <Label htmlFor="category">Kategori</Label>
                <Input id="category" name="category" value={formData.category} onChange={handleChange} placeholder="Contoh: Kegiatan, UMKM, Pertanian" required />
              </div>
              <div>
                <Label htmlFor="summary">Ringkasan</Label>
                <Textarea id="summary" name="summary" value={formData.summary} onChange={handleChange} placeholder="Ringkasan singkat berita (1-2 kalimat)" rows={3} required />
              </div>
              <div>
                <Label htmlFor="content">Isi Berita</Label>
                <Textarea id="content" name="content" value={formData.content} onChange={handleChange} placeholder="Tulis isi berita lengkap di sini..." rows={8} required />
              </div>

              {/* Thumbnail - mode selector */}
              <div className="space-y-3">
                <Label>Thumbnail / Foto Berita</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={imageMode === 'url' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setImageMode('url')}
                    className="gap-2"
                  >
                    <LinkIcon className="h-4 w-4" />URL
                  </Button>
                  <Button
                    type="button"
                    variant={imageMode === 'upload' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setImageMode('upload')}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />Upload dari Lokal
                  </Button>
                </div>

                {imageMode === 'url' ? (
                  <div>
                    <Input
                      name="thumbnail"
                      value={formData.thumbnail}
                      onChange={handleUrlChange}
                      placeholder="https://images.unsplash.com/..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">Masukkan URL gambar dari Unsplash atau sumber lainnya</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div
                      className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
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
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <p className="text-xs text-muted-foreground">
                      Gambar akan diunggah ke Supabase Storage (bucket: <code>assets</code>)
                    </p>
                  </div>
                )}

                {/* Preview gambar */}
                {previewUrl && (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border"
                      onError={() => setPreviewUrl('')}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={clearImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
                <Button type="submit" disabled={isSaving || isUploading}>
                  {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editingNews ? 'Perbarui' : 'Simpan'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Berita</CardTitle>
          <CardDescription>Total {news.length} berita</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Belum ada berita. Klik tombol "Tambah Berita" untuk membuat berita baru.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((article) => (
                <Card key={article.id} className="overflow-hidden">
                  <div className="aspect-video overflow-hidden bg-muted">
                    {article.thumbnail
                      ? <img src={article.thumbnail} alt={article.title} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No img</div>
                    }
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary">{article.category}</Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(article.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">{article.summary}</p>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" onClick={() => handleOpenDialog(article)} className="flex-1">
                        <Pencil className="h-4 w-4 mr-1" />Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(article.id)} className="flex-1">
                        <Trash2 className="h-4 w-4 mr-1 text-destructive" />Hapus
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}