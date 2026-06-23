import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Save, Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { getOrganizationStructure, saveOrganizationStructure, type OrganizationMember } from '../../lib/data';
import { toast } from 'sonner';

export function AdminOrganization() {
  const [organization, setOrganization] = useState<OrganizationMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingMember, setEditingMember] = useState<OrganizationMember | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ position: '', name: '' });

  useEffect(() => {
    const loadOrg = async () => {
      setIsLoading(true);
      const data = await getOrganizationStructure();
      setOrganization(data);
      setIsLoading(false);
    };
    loadOrg();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const ok = await saveOrganizationStructure(organization);
    if (ok) {
      toast.success('Struktur organisasi berhasil diperbarui!');
    } else {
      toast.error('Gagal menyimpan struktur organisasi.');
    }
    setIsSaving(false);
  };

  const handleAdd = () => {
    if (formData.position.trim() && formData.name.trim()) {
      setOrganization([...organization, { ...formData }]);
      resetDialog();
      toast.success('Anggota berhasil ditambahkan! Klik Simpan untuk menyimpan ke database.');
    }
  };

  const handleEdit = (member: OrganizationMember) => {
    setEditingMember(member);
    setFormData({ position: member.position, name: member.name });
    setIsDialogOpen(true);
  };

  const handleUpdate = () => {
    if (editingMember && formData.position.trim() && formData.name.trim()) {
      setOrganization(organization.map(m =>
        m.position === editingMember.position && m.name === editingMember.name
          ? { ...m, ...formData }
          : m
      ));
      resetDialog();
      toast.success('Anggota berhasil diperbarui! Klik Simpan untuk menyimpan ke database.');
    }
  };

  const handleDelete = (member: OrganizationMember) => {
    if (confirm(`Hapus ${member.position} - ${member.name}?`)) {
      setOrganization(organization.filter(m =>
        !(m.position === member.position && m.name === member.name)
      ));
      toast.success('Anggota dihapus. Klik Simpan untuk menyimpan ke database.');
    }
  };

  const resetDialog = () => {
    setEditingMember(null);
    setFormData({ position: '', name: '' });
    setIsDialogOpen(false);
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
          <h1 className="text-3xl font-bold mb-2">Struktur Organisasi</h1>
          <p className="text-muted-foreground">Kelola kepala dusun dan jajaran pengurus</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetDialog(); }}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />Tambah Anggota</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingMember ? 'Edit Anggota' : 'Tambah Anggota Baru'}</DialogTitle>
                <DialogDescription>
                  {editingMember ? 'Perbarui data anggota organisasi' : 'Tambahkan anggota baru ke struktur organisasi'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="position">Jabatan</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="contoh: Kepala Dusun"
                  />
                </div>
                <div>
                  <Label htmlFor="name">Nama</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="contoh: Bapak Ahmad"
                  />
                </div>
                <Button onClick={editingMember ? handleUpdate : handleAdd} className="w-full">
                  {editingMember ? 'Perbarui' : 'Tambah'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Simpan
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengurus</CardTitle>
          <CardDescription>Struktur organisasi Dusun Tirtomoyo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {organization.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Belum ada anggota organisasi. Klik tombol "Tambah Anggota" untuk menambahkan.
              </div>
            ) : (
              organization.map((member, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold flex-shrink-0">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="font-medium">{member.position}</h4>
                      <p className="text-sm text-muted-foreground">{member.name}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(member)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(member)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}