# Dicoding Jobs: Vacancy System

Sistem lowongan kerja sederhana: recruiter membuat lowongan, job seeker mencari lowongan berdasarkan judul.

**Stack:** Laravel 12 (PHP 8.3) + PostgreSQL, Next.js (App Router, TypeScript, Tailwind, TanStack Query), Playwright.

```
backend/    Laravel REST API
frontend/   Next.js app
```

## Prasyarat

- PHP 8.3+ dengan ekstensi `pdo_pgsql` dan `pgsql` aktif, Composer
- PostgreSQL 14+
- Node.js 20+ dan npm

## Menjalankan Backend

```bash
cd backend
composer install
cp .env.example .env        # Windows CMD: copy .env.example .env
php artisan key:generate
```

Buat database PostgreSQL (mis. `dicoding-test-intern`), isi `DB_*` di `.env`, lalu:

```bash
php artisan migrate:fresh --seed
php artisan serve           # http://localhost:8000
```

## Menjalankan Frontend

```bash
cd frontend
npm install
cp .env.example .env.local  # Windows CMD: copy .env.example .env.local
npm run dev                 # http://localhost:3000
```

Halaman:

| Route | Fungsi |
|---|---|
| `/` | List lowongan + pencarian berdasarkan judul |
| `/jobs/{id}` | Detail lowongan |
| `/dashboard` | Lowongan saya (edit, hapus) |
| `/dashboard/create` | Form buat lowongan |

## Menjalankan Test

**Backend (unit + integration).** Buat database kosong `dicoding-test-intern-testing`, lalu:

```bash
cd backend
php artisan test
```

**Frontend (end-to-end, Playwright).** Backend harus sudah berjalan (`php artisan serve`) dan database sudah di-seed:

```bash
cd frontend
npx playwright install chromium
npm run test:e2e
```

Skenario E2E: membuka list lowongan, mencari berdasarkan judul, melihat detail lowongan.

## API

Gunakan header `Accept: application/json`.

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/vacancies?search=&page=` | List (10 per halaman) + cari berdasarkan judul |
| GET | `/api/vacancies/{id}` | Detail lowongan |
| POST | `/api/vacancies` | Buat lowongan (422 jika tidak valid) |
| PUT/PATCH | `/api/vacancies/{id}` | Ubah lowongan |
| DELETE | `/api/vacancies/{id}` | Hapus lowongan |

## Keputusan dan Asumsi

- Tidak ada autentikasi (di luar scope). Semua lowongan dimiliki satu company hasil seeder (Dicoding Indonesia); dashboard menampilkan semua lowongan.
- Pencarian memakai `ILIKE` (case-insensitive, khusus PostgreSQL).
- List API mengembalikan semua lowongan dengan pagination, termasuk yang sudah melewati tanggal "Aktif hingga".
- Gaji hanya dikembalikan API jika `show_salary` bernilai true.
- Deskripsi disimpan sebagai HTML dan disanitasi dengan DOMPurify saat ditampilkan.
- Opsi dropdown Posisi dan Lokasi ditetapkan di frontend (`lib/format.ts`).