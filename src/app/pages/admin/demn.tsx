import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Plus, Edit, Trash2, X, Loader2 } from 'lucide-react';
import { getTouristAttractions, saveAttraction, updateAttraction, deleteAttraction, type TouristAttraction } from '../../lib/data';
import { toast } from 'sonner';

const emptyForm = { id: '', name: '', description: '', image: '', facilities: [] as string[] };

export function AdminAttractions() {
  const [attractions, setAttractions] = useState<TouristAttraction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingAttraction, setEditingAttraction] = useState<TouristAttraction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [facilityInput, setFacilityInput] = useState('');

  useEffect(() => {
    loadAttractions();
  }, []);

  const loadAttractions = async () => {
    setIsLoading(true);
    const data = await getTouristAttractions();
    setAttractions(data);
    setIsLoading(false);
  };

  const handleAdd = async () => {
    if (!formData.name.trim() || !formData.description.trim()) return;
    setIsSaving(true);
    const result = await saveAttraction({
      name: formData.name,
      description: formData.description,
      image: formData.image,
      facilities: formData.facilities,
    });
    if (result) {
      toast.success('Wisata berhasil ditambahkan!');
      await loadAttractions();
      resetDialog();
    } else {
      toast.error('Gagal menambahkan wisata.');
    }
    setIsSaving(false);
  };

  const handleUpdate = async () => {
    if (!editingAttraction || !formData.name.trim()) return;
    setIsSaving(true);
    const ok = await updateAttraction(editingAttraction.id, {
      name: formData.name,
      description: formData.description,
      image: formData.image,
      facilities: formData.facilities,
    });
    if (ok) {
      toast.success('Wisata berhasil diperbarui!');
      await loadAttractions();
      resetDialog();
    } else {
      toast.error('Gagal memperbarui wisata.');
    }
    setIsSaving(false);
  };

  const handleEdit = (attraction: TouristAttraction) => {
    setEditingAttraction(attraction);
    setFormData(attraction);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus tempat wisata ini?')) return;
    const ok = await deleteAttraction(id);
    if (ok) {
      toast.success('Wisata berhasil dihapus!');
      await loadAttractions();
    } else {
      toast.error('Gagal menghapus wisata.');
    }
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
              <div>
                <Label>URL Gambar</Label>
                <Input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://images.unsplash.com/..." />
              </div>
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
                  <Input
                    value={facilityInput}
                    onChange={(e) => setFacilityInput(e.target.value)}
                    placeholder="Tambah fasilitas..."
                    onKeyDown={(e) => e.key === 'Enter' && addFacility()}
                  />
                  <Button onClick={addFacility} type="button"><Plus className="h-4 w-4" /></Button>
                </div>
              </div>
              <Button onClick={editingAttraction ? handleUpdate : handleAdd} className="w-full" disabled={isSaving}>
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
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            Belum ada tempat wisata terdaftar. Klik tombol "Tambah Wisata" untuk menambahkan.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attractions.map((attraction) => (
            <Card key={attraction.id} className="overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img src={attraction.image} alt={attraction.name} className="w-full h-full object-cover" />
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{attraction.name}</CardTitle>
              </CardHeader>
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