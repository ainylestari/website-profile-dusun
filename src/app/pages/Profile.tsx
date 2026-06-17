import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { History, Target, Users, MapPin, Loader2 } from 'lucide-react';
import { getVillageInfo, getOrganizationStructure } from '../lib/data';
import type { VillageInfo, OrganizationMember } from '../lib/data';

export function Profile() {
  const [villageInfo, setVillageInfo] = useState<VillageInfo | null>(null);
  const [organizationStructure, setOrganizationStructure] = useState<OrganizationMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const [info, org] = await Promise.all([
        getVillageInfo(),
        getOrganizationStructure(),
      ]);
      setVillageInfo(info);
      setOrganizationStructure(org);
      setIsLoading(false);
    };
    loadData();
  }, []);

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
          <h1 className="text-4xl font-bold mb-2">Profil Dusun</h1>
          <p className="text-lg opacity-90">Mengenal lebih dekat {villageInfo?.name ?? 'Dusun Sukamaju'}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">

        {/* Vision & Mission */}
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Visi</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed italic border-l-4 border-primary pl-4">
                  {villageInfo?.vision || 'Belum ada data visi.'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Misi</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {villageInfo?.missions?.length ? (
                  <ol className="space-y-3">
                    {villageInfo.missions.map((mission, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <span className="leading-relaxed">{mission}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-muted-foreground">Belum ada data misi.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Organizational Structure */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Struktur Organisasi</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {organizationStructure.length === 0 ? (
                <p className="text-muted-foreground">Belum ada data struktur organisasi.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {organizationStructure.map((person, index) => (
                    <div key={index} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-primary truncate">{person.position}</p>
                          <p className="text-sm truncate">{person.name}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Location Map */}
        <section>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Lokasi Dusun</CardTitle>
                  <p className="text-muted-foreground mt-1">{villageInfo?.address}</p>
                </div>
              </div>
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
                    title="Lokasi Dusun"
                  />
                </div>
              ) : (
                <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Belum ada peta. Tambahkan URL embed Google Maps melalui panel admin.</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {[
                  { label: 'Desa', value: villageInfo?.village },
                  { label: 'Kecamatan', value: villageInfo?.district },
                  { label: 'Kabupaten', value: villageInfo?.regency },
                  { label: 'Provinsi', value: villageInfo?.province },
                ].map(({ label, value }) => (
                  <div key={label} className="border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">{label}</p>
                    <p className="font-medium">{value || '-'}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}