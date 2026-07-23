# 🏘️ Website Resmi Dusun Tirtomoyo

Website profil resmi **Dusun Tirtomoyo, Desa Bumiharjo, Kecamatan Kemalang, Kabupaten Klaten, Jawa Tengah**.

Dikembangkan sebagai bagian dari program **Kuliah Kerja Nyata (KKN)** Universitas Pembangunan Nasional "Veteran" Yogyakarta.

🌐 **Live:** [tirtomoyo-klaten.id](https://tirtomoyo-klaten.id)

---

## 📋 Fitur

- **Profil Dusun** — Sejarah, visi misi, struktur organisasi, dan data kependudukan
- **Potensi Dusun** — UMKM lokal, pertanian & peternakan, budaya dan adat istiadat
- **Berita & Kegiatan** — Informasi dan dokumentasi kegiatan dusun
- **Kontak** — Form pesan yang langsung terkirim ke email perangkat desa
- **Panel Admin** — Kelola seluruh konten website tanpa keahlian IT khusus

---

## 🛠️ Teknologi

| Teknologi | Kegunaan |
|---|---|
| React + Vite | Framework frontend |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| shadcn/ui | Komponen UI |
| Supabase | Database & Authentication |
| EmailJS | Pengiriman pesan kontak |
| Vercel | Hosting & Deployment |

---

## 🚀 Menjalankan Project

### Prasyarat
- Node.js v18+
- Akun Supabase
- Akun EmailJS (opsional, untuk fitur kontak)

### Instalasi

```bash
# Clone repository
git clone https://github.com/ainylestari/website-profile-dusun

# Install dependencies
npm install
```

### Konfigurasi Environment

Buat file `.env.local` di root folder:

```env
VITE_SUPABASE_URL=https://xxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

### Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:5173](http://localhost:5173) di browser.

### Build Production

```bash
npm run build
```

---

## 🗄️ Setup Database

Jalankan SQL berikut di Supabase SQL Editor:

1. `supabase_schema.sql` — Membuat semua tabel utama

Buat akun admin di **Supabase → Authentication → Users → Add User**.

---

## 📁 Struktur Folder

```
src/
└── app/
    ├── components/     # Komponen reusable (Header, Footer, dll)
    ├── layouts/        # Layout publik
    ├── lib/            # Supabase client, data functions, auth
    └── pages/
        ├── admin/      # Halaman panel admin
        └── *.tsx       # Halaman publik
```

---

## 🌐 Deploy ke Vercel

1. Push kode ke GitHub
2. Import repository di [vercel.com](https://vercel.com)
3. Tambahkan environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
4. Deploy otomatis setiap `git push`

---

## 👥 Tim KKN UPN "Veteran" Yogyakarta

Dikembangkan oleh mahasiswa KKN UPN "Veteran" Yogyakarta yang bertugas di Dusun Tirtomoyo, Desa Bumiharjo, Kecamatan Kemalang, Kabupaten Klaten.

---

## 📄 Lisensi

Project ini dikembangkan untuk kepentingan masyarakat Dusun Tirtomoyo. Hak cipta konten dan data milik Dusun Tirtomoyo, Desa Bumiharjo.