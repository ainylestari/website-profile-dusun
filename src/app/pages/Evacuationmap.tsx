import { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Phone, Info, ZoomIn, ZoomOut, Download, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { getVillageInfo } from '../lib/data';
import { supabase } from '../lib/supabase';

const badgeColors: Record<string, string> = {
  assembly: 'bg-green-100 text-green-800 border-green-200',
  route: 'bg-blue-100 text-blue-800 border-blue-200',
  medical: 'bg-red-100 text-red-800 border-red-200',
};

const badgeLabels: Record<string, string> = {
  assembly: 'Titik Kumpul',
  route: 'Jalur Evakuasi',
  medical: 'Pos Medis',
};

interface EvacuationPoint { label: string; location: string; type: string; }
interface EmergencyContact { name: string; number: string; }
interface EvacuationData {
  map_image_url: string;
  evacuation_points: EvacuationPoint[];
  emergency_contacts: EmergencyContact[];
  procedures: string[];
}

const defaultData: EvacuationData = {
  map_image_url: '',
  evacuation_points: [
    { label: 'Titik Kumpul 1', location: 'Lapangan Dusun', type: 'assembly' },
    { label: 'Titik Kumpul 2', location: 'Halaman Masjid', type: 'assembly' },
    { label: 'Jalur Evakuasi Utama', location: 'Jl. Raya Sukamaju', type: 'route' },
    { label: 'Pos Medis', location: 'Balai Dusun', type: 'medical' },
  ],
  emergency_contacts: [
    { name: 'Kepala Dusun', number: '0812-3456-7890' },
    { name: 'BPBD Kabupaten', number: '119' },
    { name: 'Puskesmas Terdekat', number: '0263-1234567' },
    { name: 'Polsek Terdekat', number: '110' },
    { name: 'Pemadam Kebakaran', number: '113' },
  ],
  procedures: [
    'Tetap tenang dan jangan panik.',
    'Matikan listrik, gas, dan air sebelum meninggalkan rumah.',
    'Bawa dokumen penting (KTP, KK, dll) dalam tas siaga.',
    'Ikuti jalur evakuasi yang telah ditentukan.',
    'Menuju titik kumpul terdekat dan tunggu instruksi petugas.',
    'Bantu warga lansia, anak-anak, dan penyandang disabilitas.',
    'Jangan kembali ke rumah sebelum ada pernyataan aman dari petugas.',
  ],
};

export function EvacuationMap() {
  const [zoom, setZoom] = useState(1);
  const [villageName, setVillageName] = useState('Dusun');
  const [evacData, setEvacData] = useState<EvacuationData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const [info, { data: evac }] = await Promise.all([
        getVillageInfo(),
        supabase.from('evacuation_map').select('*').eq('id', 1).single(),
      ]);
      if (info?.name) setVillageName(info.name);
      if (evac) {
        setEvacData({
          map_image_url: evac.map_image_url ?? '',
          evacuation_points: evac.evacuation_points ?? defaultData.evacuation_points,
          emergency_contacts: evac.emergency_contacts ?? defaultData.emergency_contacts,
          procedures: evac.procedures ?? defaultData.procedures,
        });
      }
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
      <div className="bg-red-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="h-8 w-8" />
            <h1 className="text-4xl font-bold">Peta Evakuasi Bencana</h1>
          </div>
          <p className="text-lg opacity-90">Jalur evakuasi dan titik kumpul darurat {villageName}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 space-y-10">
        {/* Peta Utama */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <MapPin className="h-6 w-6 text-red-600" />Peta Evakuasi
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setZoom(z => Math.max(z - 0.25, 0.5))} disabled={zoom <= 0.5}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground w-12 text-center">{Math.round(zoom * 100)}%</span>
              <Button variant="outline" size="sm" onClick={() => setZoom(z => Math.min(z + 0.25, 2.5))} disabled={zoom >= 2.5}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              {evacData.map_image_url && (
                <a href={evacData.map_image_url} download="peta-evakuasi.jpg">
                  <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Unduh Peta</Button>
                </a>
              )}
            </div>
          </div>

          <div className="border-2 border-red-200 rounded-xl overflow-auto bg-gray-50 max-h-[600px] flex items-center justify-center p-4 min-h-48">
            {evacData.map_image_url ? (
              <img
                src={evacData.map_image_url}
                alt="Peta Evakuasi Bencana"
                className="rounded-lg shadow-md transition-transform duration-200"
                style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
              />
            ) : (
              <div className="flex flex-col items-center gap-4 py-12 text-center text-muted-foreground">
                <div className="text-6xl">🗺️</div>
                <div>
                  <p className="font-semibold text-lg">Peta belum diunggah</p>
                  <p className="text-sm mt-1">Upload gambar peta melalui panel Admin → Peta Evakuasi</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            {Object.entries(badgeLabels).map(([type, label]) => (
              <span key={type} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm border font-medium ${badgeColors[type]}`}>
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-600" />Titik Penting Evakuasi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {evacData.evacuation_points.map((point, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <span className={`mt-0.5 px-2 py-0.5 rounded-full text-xs font-medium border ${badgeColors[point.type] ?? 'bg-gray-100 text-gray-800'}`}>
                    {badgeLabels[point.type] ?? point.type}
                  </span>
                  <div>
                    <p className="font-medium text-sm">{point.label}</p>
                    <p className="text-xs text-muted-foreground">{point.location}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <Phone className="h-5 w-5" />Kontak Darurat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {evacData.emergency_contacts.map((contact, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-100">
                  <span className="text-sm font-medium">{contact.name}</span>
                  <a href={`tel:${contact.number.replace(/-/g, '')}`} className="text-sm font-bold text-red-700 hover:underline">
                    {contact.number}
                  </a>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <AlertTriangle className="h-5 w-5" />Prosedur Evakuasi Darurat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-sm text-orange-900">
              {evacData.procedures.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-orange-600 text-white text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}