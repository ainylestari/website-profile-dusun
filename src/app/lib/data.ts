import { supabase } from './supabase';

// ============================================
// INTERFACES
// ============================================

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  date: string;
  thumbnail: string;
  author: string;
}

export interface VillageStats {
  population: number;
  families: number;
  umkm: number;
  area: string;
}

export interface UMKM {
  id: string;
  name: string;
  category: string;
  owner: string;
  description: string;
  image: string;
  contact: string;
}

export interface VillageInfo {
  name: string;
  village: string;
  district: string;
  regency: string;
  province: string;
  postalCode: string;
  headOfHamlet: string;
  phone: string;
  email: string;
  address: string;
  history: string;
  vision: string;
  missions: string[];
  mapEmbedUrl: string;
}

export interface OrganizationMember {
  id?: string;
  position: string;
  name: string;
  sort_order?: number;
}

export interface TouristAttraction {
  id: string;
  name: string;
  description: string;
  image: string;
  facilities: string[];
}

// ============================================
// BERITA
// ============================================

export const getNewsArticles = async (): Promise<NewsArticle[]> => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('date', { ascending: false });

  if (error) { console.error('Error fetching news:', error); return []; }

  return data.map(item => ({
    id: item.id,
    title: item.title,
    summary: item.summary ?? '',
    content: item.content ?? '',
    category: item.category ?? 'Umum',
    date: item.date,
    thumbnail: item.thumbnail ?? '',
    author: item.author ?? 'Admin',
  }));
};

export const saveNewsArticle = async (article: Omit<NewsArticle, 'id'>): Promise<NewsArticle | null> => {
  const { data, error } = await supabase
    .from('news')
    .insert([article])
    .select()
    .single();

  if (error) { console.error('Error saving news:', error); return null; }
  return data;
};

export const updateNewsArticle = async (id: string, article: Partial<NewsArticle>): Promise<boolean> => {
  const { error } = await supabase.from('news').update(article).eq('id', id);
  if (error) { console.error('Error updating news:', error); return false; }
  return true;
};

export const deleteNewsArticle = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('news').delete().eq('id', id);
  if (error) { console.error('Error deleting news:', error); return false; }
  return true;
};

// ============================================
// UMKM
// ============================================

export const getUMKM = async (): Promise<UMKM[]> => {
  const { data, error } = await supabase
    .from('umkm')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) { console.error('Error fetching UMKM:', error); return []; }
  return data;
};

export const saveUMKMItem = async (item: Omit<UMKM, 'id'>): Promise<UMKM | null> => {
  const { data, error } = await supabase.from('umkm').insert([item]).select().single();
  if (error) { console.error('Error saving UMKM:', error); return null; }
  return data;
};

export const updateUMKMItem = async (id: string, item: Partial<UMKM>): Promise<boolean> => {
  const { error } = await supabase.from('umkm').update(item).eq('id', id);
  if (error) { console.error('Error updating UMKM:', error); return false; }
  return true;
};

export const deleteUMKMItem = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('umkm').delete().eq('id', id);
  if (error) { console.error('Error deleting UMKM:', error); return false; }
  return true;
};

// ============================================
// PROFIL DESA
// ============================================

export const getVillageInfo = async (): Promise<VillageInfo | null> => {
  const { data, error } = await supabase
    .from('village_info')
    .select('*')
    .eq('id', 1)
    .single();

  if (error) { console.error('Error fetching village info:', error); return null; }

  return {
    name: data.name ?? '',
    village: data.village ?? '',
    district: data.district ?? '',
    regency: data.regency ?? '',
    province: data.province ?? '',
    postalCode: data.postal_code ?? '',
    headOfHamlet: data.head_of_hamlet ?? '',
    phone: data.phone ?? '',
    email: data.email ?? '',
    address: data.address ?? '',
    history: data.history ?? '',
    vision: data.vision ?? '',
    missions: data.missions ?? [],
    mapEmbedUrl: data.map_embed_url ?? '',
  };
};

export const saveVillageInfo = async (info: VillageInfo): Promise<boolean> => {
  const { error } = await supabase.from('village_info').upsert({
    id: 1,
    name: info.name,
    village: info.village,
    district: info.district,
    regency: info.regency,
    province: info.province,
    postal_code: info.postalCode,
    head_of_hamlet: info.headOfHamlet,
    phone: info.phone,
    email: info.email,
    address: info.address,
    history: info.history,
    vision: info.vision,
    missions: info.missions,
    map_embed_url: info.mapEmbedUrl,
    updated_at: new Date().toISOString(),
  });

  if (error) { console.error('Error saving village info:', error); return false; }
  return true;
};

// ============================================
// STATISTIK DESA
// ============================================

export const getVillageStats = async (): Promise<VillageStats> => {
  const { data, error } = await supabase
    .from('village_stats')
    .select('*')
    .eq('id', 1)
    .single();

  if (error || !data) return { population: 0, families: 0, umkm: 0, area: '0 Ha' };

  return {
    population: data.population ?? 0,
    families: data.families ?? 0,
    umkm: data.umkm_count ?? 0,
    area: data.area ?? '0 Ha',
  };
};

export const saveVillageStats = async (stats: VillageStats): Promise<boolean> => {
  const { error } = await supabase.from('village_stats').upsert({
    id: 1,
    population: stats.population,
    families: stats.families,
    umkm_count: stats.umkm,
    area: stats.area,
    updated_at: new Date().toISOString(),
  });

  if (error) { console.error('Error saving stats:', error); return false; }
  return true;
};

// ============================================
// ORGANISASI
// ============================================

export const getOrganizationStructure = async (): Promise<OrganizationMember[]> => {
  const { data, error } = await supabase
    .from('organization')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) { console.error('Error fetching organization:', error); return []; }
  return data;
};

export const saveOrganizationStructure = async (members: OrganizationMember[]): Promise<boolean> => {
  const { error: deleteError } = await supabase
    .from('organization')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (deleteError) { console.error('Error clearing organization:', deleteError); return false; }

  const rows = members.map((m, i) => ({
    position: m.position,
    name: m.name,
    sort_order: i,
  }));

  const { error } = await supabase.from('organization').insert(rows);
  if (error) { console.error('Error saving organization:', error); return false; }
  return true;
};

// ============================================
// OBJEK WISATA / POTENSI
// ============================================

export const getTouristAttractions = async (): Promise<TouristAttraction[]> => {
  const { data, error } = await supabase
    .from('attractions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) { console.error('Error fetching attractions:', error); return []; }
  return data;
};

export const saveAttraction = async (item: Omit<TouristAttraction, 'id'>): Promise<TouristAttraction | null> => {
  const { data, error } = await supabase.from('attractions').insert([item]).select().single();
  if (error) { console.error('Error saving attraction:', error); return null; }
  return data;
};

export const updateAttraction = async (id: string, item: Partial<TouristAttraction>): Promise<boolean> => {
  const { error } = await supabase.from('attractions').update(item).eq('id', id);
  if (error) { console.error('Error updating attraction:', error); return false; }
  return true;
};

export const deleteAttraction = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('attractions').delete().eq('id', id);
  if (error) { console.error('Error deleting attraction:', error); return false; }
  return true;
};

// Tambahkan ke src/app/lib/data.ts

export interface Announcement {
  id: string;
  title: string;
  content: string;
  image_url: string;
  is_active: boolean;
  show_popup: boolean;
  created_at: string;
  expired_at: string | null;
}

export const getAnnouncements = async (): Promise<Announcement[]> => {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) { console.error('Error fetching announcements:', error); return []; }
  return data;
};

export const saveAnnouncement = async (item: Omit<Announcement, 'id' | 'created_at'>): Promise<Announcement | null> => {
  const { data, error } = await supabase
    .from('announcements')
    .insert([item])
    .select()
    .single();

  if (error) { console.error('Error saving announcement:', error); return null; }
  return data;
};

export const updateAnnouncement = async (id: string, item: Partial<Announcement>): Promise<boolean> => {
  const { error } = await supabase
    .from('announcements')
    .update(item)
    .eq('id', id);

  if (error) { console.error('Error updating announcement:', error); return false; }
  return true;
};

export const deleteAnnouncement = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('announcements')
    .delete()
    .eq('id', id);

  if (error) { console.error('Error deleting announcement:', error); return false; }
  return true;
};