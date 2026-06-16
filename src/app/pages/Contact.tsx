import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { MapPin, Phone, Mail, Clock, Loader2 } from 'lucide-react';
import { getVillageInfo } from '../lib/data';
import type { VillageInfo } from '../lib/data';
import { toast } from 'sonner';

export function Contact() {
  const [villageInfo, setVillageInfo] = useState<VillageInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const info = await getVillageInfo();
      setVillageInfo(info);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Pesan Anda telah terkirim! Kami akan segera menghubungi Anda.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
          <h1 className="text-4xl font-bold mb-2">Kontak Kami</h1>
          <p className="text-lg opacity-90">Hubungi kami untuk informasi lebih lanjut</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Kirim Pesan</CardTitle>
              <CardDescription>Isi formulir di bawah ini dan kami akan menghubungi Anda secepatnya</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Masukkan nama lengkap" required />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="nama@email.com" required />
                </div>
                <div>
                  <Label htmlFor="subject">Subjek</Label>
                  <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="Subjek pesan" required />
                </div>
                <div>
                  <Label htmlFor="message">Pesan</Label>
                  <Textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Tulis pesan Anda di sini..." rows={6} required />
                </div>
                <Button type="submit" className="w-full">Kirim Pesan</Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Informasi Kontak</CardTitle>
                <CardDescription>Berikut informasi kontak yang dapat Anda hubungi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Alamat</h4>
                    <p className="text-muted-foreground">{villageInfo?.address || '-'}</p>
                    <p className="text-muted-foreground">{villageInfo?.district}, {villageInfo?.regency}</p>
                    <p className="text-muted-foreground">{villageInfo?.province} {villageInfo?.postalCode}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Telepon</h4>
                    {villageInfo?.phone
                      ? <a href={`tel:${villageInfo.phone}`} className="text-muted-foreground hover:text-primary">{villageInfo.phone}</a>
                      : <p className="text-muted-foreground">-</p>
                    }
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Email</h4>
                    {villageInfo?.email
                      ? <a href={`mailto:${villageInfo.email}`} className="text-muted-foreground hover:text-primary">{villageInfo.email}</a>
                      : <p className="text-muted-foreground">-</p>
                    }
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Jam Operasional</h4>
                    <p className="text-muted-foreground">Senin - Jumat: 08:00 - 16:00 WIB</p>
                    <p className="text-muted-foreground">Sabtu: 08:00 - 12:00 WIB</p>
                    <p className="text-muted-foreground">Minggu & Libur: Tutup</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">Kepala Dusun</h3>
                <p className="text-xl mb-1">{villageInfo?.headOfHamlet || '-'}</p>
                <p className="opacity-90">Dusun Sukamaju</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Lokasi</CardTitle>
            <CardDescription>Temukan kami di peta</CardDescription>
          </CardHeader>
          <CardContent>
            {villageInfo?.mapEmbedUrl ? (
              <div className="rounded-lg overflow-hidden border border-border">
                <iframe
                  src={villageInfo.mapEmbedUrl}
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi Dusun Ngrancah"
                />
              </div>
            ) : (
              <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Belum ada peta. Tambahkan URL embed Google Maps melalui panel admin.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}