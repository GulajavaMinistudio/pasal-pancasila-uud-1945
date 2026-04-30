---
goal: Phase 2 — Konten Utama & Pencarian Pancasila & UUD 1945 Web App
version: 1.1
date_created: 2026-04-28
last_updated: 2026-04-30
owner: Development Team
status: 'Planned'
tags:
  - feature
  - phase2
  - content
  - search
  - deep-link
  - comparison
  - implementation
---

<!-- markdownlint-disable -->

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

Phase 2 melengkapi seluruh konten aplikasi yang belum diimplementasikan di Phase 1. Phase ini
mengimplementasikan 5 halaman konten utama UUD 1945, fitur pencarian real-time menggunakan
Fuse.js, deep link routing untuk semua 14 route, dan halaman 404 yang informatif.

**Prerequisite:** Phase 1 selesai dan CI pipeline pass. ✅

**Estimasi Durasi:** 2–3 minggu

**PRD Features yang dicakup:** F-04, F-05, F-06, F-07, F-07b, F-08, F-10, F-11, F-12

---

## 1. Requirements & Constraints

- **REQ-001**: Semua 14 route dari `spec-architecture §4.2` harus dapat diakses langsung via URL
- **REQ-002**: Pencarian harus menggunakan Fuse.js dengan debounce 300ms (REQ-008 dari spec-arch)
- **REQ-003**: URL `/cari?q=keyword` harus langsung menampilkan hasil pencarian (deep link search)
- **REQ-004**: Badge amandemen harus ditampilkan hanya pada pasal yang memiliki data amandemen
- **REQ-005**: Navigasi Bab harus hierarki: Bab List → klik Bab → daftar pasal dalam bab tersebut
- **REQ-006**: Halaman 404 harus informatif dengan link kembali ke halaman utama
- **REQ-007**: AC-009 s.d. AC-016 dari `spec-architecture §5.2–5.3` harus terpenuhi
- **REQ-008**: Halaman `/tentang` harus menampilkan informasi aplikasi dan 2 tautan Google Forms; untuk v1, tautan koreksi pasal dan saran masukan dipusatkan di halaman ini
- **REQ-009**: Fitur perbandingan side-by-side menggunakan **hanya dua snapshot data** yang tersedia: `pasaluud45noamandemen.json` (UUD asli) dan `pasaluud45_ket_amandemen.json` (pasca-amandemen terakhir). Perbandingan per-step per amandemen **tidak dapat dilakukan** karena data intermediate tidak tersedia — keterbatasan ini harus dikomunikasikan kepada pengguna secara eksplisit di halaman perbandingan
- **CON-001**: Tidak ada backend search — pencarian 100% client-side menggunakan Fuse.js
- **CON-002**: Semua data sudah tersedia di `/public/data/` (migrasi dilakukan di Phase 1)
- **GUD-001**: Branch naming: `feature/phase2-[deskripsi]` untuk setiap fitur baru
- **GUD-002**: Setiap halaman baru harus memiliki minimal 1 E2E test sebelum di-merge
- **PAT-001**: Pola konsisten dengan Phase 1: setiap page adalah JS module, data via loader
- **PAT-002**: Fuse.js instance dibuat sekali dan di-cache (tidak re-instantiate per search)

---

## 2. Implementation Steps

### Implementation Phase 2.1 — Halaman Pasal UUD 1945

- GOAL-001: Mengimplementasikan halaman daftar pasal dan halaman detail pasal dengan
  badge amandemen, navigasi antar pasal, dan tombol bagikan placeholder.

| Task     | Description                                                                                                                                                                                                                       | Completed | Date |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-001 | Buat `src/pages/PasalListPage.js` — daftar semua pasal (Pasal 1–37+) dari `loadPasalUUD()`. Setiap item menampilkan nomor pasal, cuplikan ayat pertama, dan badge amandemen jika ada. Klik → navigasi ke `/pasal/:nomor`          |           |      |
| TASK-002 | Buat `src/pages/PasalDetailPage.js` — detail satu pasal berdasarkan parameter `/:nomor`. Tampilkan: nama pasal, semua ayat dengan penomoran, badge amandemen (jika ada), tombol "Bagikan" placeholder, tombol "Kembali ke Daftar" |           |      |
| TASK-003 | Implementasi badge amandemen: cross-reference antara `pasaluud45.json` dan `pasaluud45_ket_amandemen.json`. Badge hanya dirender jika pasal memiliki data amandemen                                                               |           |      |
| TASK-004 | Implementasi helper `parsePasalNomor(param)` — konversi URL param (`7A`, `28C`) ke nama pasal yang sesuai di JSON (`Pasal 7A`, `Pasal 28C`). Case-insensitive matching                                                            |           |      |
| TASK-005 | Implementasi halaman 404 untuk `/pasal/:nomor` yang tidak ada di data                                                                                                                                                             |           |      |

### Implementation Phase 2.2 — Halaman Bab Pasal

- GOAL-002: Mengimplementasikan navigasi hierarki berdasarkan 21 Bab UUD 1945 —
  daftar semua bab, navigasi ke bab tertentu, dan daftar pasal dalam bab.

| Task     | Description                                                                                                                                                                                                 | Completed | Date |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-006 | Buat `src/pages/BabPasalListPage.js` — daftar 21 Bab UUD 1945 dari `loadBabPasal()`. Setiap bab menampilkan nama bab, keterangan bab, daftar pasal, dan link ke `/bab-pasal/:nomor`                         |           |      |
| TASK-007 | Buat `src/pages/BabPasalDetailPage.js` — detail satu bab berdasarkan parameter `/:nomor`. Tampilkan nama bab, keterangan bab, dan daftar pasal dalam bab tersebut. Klik pasal → navigasi ke `/pasal/:nomor` |           |      |
| TASK-008 | Implementasi expand/collapse untuk daftar pasal per bab di `BabPasalListPage` (Bootstrap Accordion atau custom toggle)                                                                                      |           |      |

### Implementation Phase 2.3 — Halaman UUD Asli & Amandemen

- GOAL-003: Mengimplementasikan halaman UUD 1945 versi asli sebelum amandemen
  dan halaman keterangan amandemen pasal.

| Task     | Description                                                                                                                                                                                                                                                                                     | Completed | Date |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-009 | Buat `src/pages/UUDAsliPage.js` — daftar pasal UUD 1945 asli dari `loadPasalUUDNoAmandemen()`. Tampilkan dengan penanda "UUD 1945 Asli" yang jelas dan filter berdasarkan bab (`babpasal` field di data)                                                                                        |           |      |
| TASK-010 | Implementasi filter bab pada `UUDAsliPage` — dropdown atau tab berisi daftar bab untuk filter konten                                                                                                                                                                                            |           |      |
| TASK-011 | Buat `src/pages/AmandemenPage.js` — daftar pasal yang mengalami amandemen dari `loadPasalUUDKetAmandemen()`. Tampilkan badge amandemen (I, II, III, IV) sesuai field `amandemen` di data. Setiap baris pasal memiliki tombol/link **"Lihat Perbandingan"** yang mengarah ke `/amandemen/:nomor` |           |      |
| TASK-012 | Implementasi group-by amandemen di `AmandemenPage`: section terpisah per Amandemen I, II, III, IV dengan daftar pasalnya dan badge warna sesuai color scheme (I=biru, II=hijau, III=oranye, IV=ungu). Pasal dengan `amandemen: "0"` tidak ditampilkan di halaman ini                            |           |      |

### Implementation Phase 2.3b — Halaman Perbandingan Pasal Side-by-Side

- GOAL-003b: Mengimplementasikan halaman perbandingan side-by-side untuk setiap pasal yang
  diamandemen. Halaman ini menampilkan teks versi asli (kiri) dan teks pasca-amandemen (kanan)
  dengan badge berwarna per ayat yang menunjukkan nomor amandemen yang mengubahnya.

**Referensi spec:** `spec-data-schema §7.4`, `spec-architecture §4.2` route `/amandemen/:nomor`,
AC-008a, AC-008b, AC-008c, AC-008d

| Task     | Description                                                                                                                                                                                                                                                                                                                                                                                                     | Completed | Date |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-049 | Buat `src/utils/comparison.js` — implementasi tiga fungsi dari `spec-data-schema §7.4`: `parseAmandemenFromText(text)`, `stripAmandemenLabel(text)`, dan `buildPasalComparison(nomor, noAmandemenData, ketAmandemenData)`. Fungsi harus mengembalikan `PasalComparisonView` sesuai interface yang sudah didefinisikan                                                                                           |           |      |
| TASK-050 | Buat `src/types/comparison.ts` — definisi TypeScript interfaces dan tipe dari `spec-data-schema §7.4`: `AmandemenNumber`, `AmandemenLabel`, `AMANDEMEN_BADGE_COLOR`, `AyatComparisonItem`, `PasalComparisonView`                                                                                                                                                                                                |           |      |
| TASK-051 | Buat `src/components/PasalComparisonCard.js` — komponen card dua kolom yang menerima `PasalComparisonView` dan merender: (a) header dengan nama pasal + badge amandemen, (b) notasi keterbatasan data ("Perbandingan ini menampilkan versi asli vs. versi akhir..."), (c) tabel/grid dua kolom per ayat, (d) badge warna per ayat sesuai `amandemenNumber`                                                      |           |      |
| TASK-052 | Implementasi state tampilan untuk kasus-kasus khusus di `PasalComparisonCard`: (a) `isNewPasal = true` → kolom kiri tampilkan card abu-abu bertuliskan "Pasal ini tidak ada pada UUD 1945 asli. Pasal ini ditambahkan melalui proses amandemen."; (b) `isDeletedPasal = true` → kolom kanan tampilkan card merah muda bertuliskan "Pasal ini telah dihapus melalui proses amandemen."                           |           |      |
| TASK-053 | Implementasi badge berwarna per amandemen di `PasalComparisonCard`: badge berbentuk pill kecil dengan teks "Amandemen I/II/III/IV" menggunakan warna token dari `AMANDEMEN_BADGE_COLOR` (I = `#1565C0`, II = `#2E7D32`, III = `#E65100`, IV = `#4A148C`). Badge diposisikan di sudut kanan atas setiap baris ayat kolom kanan yang berstatus `added` atau `modified`                                            |           |      |
| TASK-054 | Buat `src/pages/AmandemenDetailPage.js` — halaman `/amandemen/:nomor`: (a) ekstrak parameter `:nomor` dari URL, (b) load kedua data via `loadPasalUUDNoAmandemen()` dan `loadPasalUUDKetAmandemen()` secara paralel (`Promise.all`), (c) panggil `buildPasalComparison(nomor, ...)`, (d) jika `null` (pasal tidak ditemukan) → redirect ke 404, (e) render `PasalComparisonCard` dengan data hasil perbandingan |           |      |
| TASK-055 | Daftarkan route `/amandemen/:nomor` di `src/router/routes.js` dengan handler `AmandemenDetailPage`. Route ini didaftarkan **sebelum** route `/amandemen` agar tidak tertimpa (lebih spesifik duluan)                                                                                                                                                                                                            |           |      |
| TASK-056 | Update `src/pages/AmandemenPage.js` — tambahkan tombol/link "Lihat Perbandingan" di setiap baris pasal menggunakan Bootstrap Button (`btn-sm btn-outline-secondary`), mengarah ke `/amandemen/:nomor` sesuai `namapasal` masing-masing pasal                                                                                                                                                                    |           |      |
| TASK-057 | Tambahkan link "Lihat Perbandingan" di `src/pages/PasalDetailPage.js` jika pasal yang sedang dilihat memiliki data amandemen (`amandemen !== "0"`). Link ditempatkan di bagian bawah konten pasal dengan teks "Bandingkan dengan UUD 1945 Asli" dan ikon panah                                                                                                                                                  |           |      |

### Implementation Phase 2.3c — Testing Perbandingan Pasal

- GOAL-003c: Memastikan fitur perbandingan teruji secara unit dan E2E, mencakup kasus normal,
  pasal baru, pasal dihapus, dan pasal tidak valid.

| Task     | Description                                                                                                                                                                                                                             | Completed | Date |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-058 | Unit test `src/utils/comparison.js` — `parseAmandemenFromText`: semua 4 label amandemen, teks tanpa label (return null), teks dengan kombinasi label                                                                                    |           |      |
| TASK-059 | Unit test `src/utils/comparison.js` — `stripAmandemenLabel`: hapus suffix label dari teks, teks tanpa label tidak berubah, teks dengan spasi ekstra sebelum kurung                                                                      |           |      |
| TASK-060 | Unit test `src/utils/comparison.js` — `buildPasalComparison`: (a) Pasal 7 → `isNewPasal: false`, ayat diisi benar; (b) Pasal 7A → `isNewPasal: true`; (c) Pasal di Bab IV → `isDeletedPasal: true`; (d) nomor tidak valid → return null |           |      |
| TASK-061 | E2E test: `/amandemen/7` — halaman perbandingan tampil, dua kolom terbentuk, kolom kiri berisi teks asli Pasal 7, kolom kanan berisi teks pasca-amandemen Pasal 7, badge amandemen terlihat                                             |           |      |
| TASK-062 | E2E test: `/amandemen/7A` — kolom kiri tampilkan pesan "Pasal ini tidak ada pada UUD 1945 asli", kolom kanan berisi isi Pasal 7A dengan badge amandemen                                                                                 |           |      |
| TASK-063 | E2E test: halaman `/amandemen` (list) — setiap baris pasal memiliki tombol "Lihat Perbandingan" yang dapat diklik dan mengarah ke URL yang benar                                                                                        |           |      |
| TASK-064 | E2E test: `/amandemen/999` — halaman 404 informatif tampil                                                                                                                                                                              |           |      |
| TASK-065 | E2E test: Dari `PasalDetailPage` pasal yang diamandemen (contoh: `/pasal/7`) — link "Bandingkan dengan UUD 1945 Asli" tampil dan berfungsi                                                                                              |           |      |

### Implementation Phase 2.4 — Halaman Tentang & 404

- GOAL-004: Mengimplementasikan halaman informasi aplikasi dan halaman 404 yang
  informatif sebagai safety net untuk route yang tidak dikenali.

| Task     | Description                                                                                                                                                                                                                                                                                                               | Completed | Date |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-013 | Buat `src/pages/TentangPage.js` — halaman tentang aplikasi: nama aplikasi, versi web (`1.0.0`), deskripsi, sumber data (UUD 1945 resmi), link koreksi pasal (Google Forms), link saran masukan (Google Forms), kredit developer, dan pastikan kedua link membuka tab baru; untuk v1, ini menjadi lokasi tunggal link F-11 |           |      |
| TASK-014 | Buat `src/pages/NotFoundPage.js` — halaman 404: pesan informatif "Halaman tidak ditemukan", link kembali ke `/`, dan saran navigasi ke halaman lain                                                                                                                                                                       |           |      |
| TASK-015 | Register `NotFoundPage` sebagai catch-all route `*` di `src/router/routes.js`                                                                                                                                                                                                                                             |           |      |

### Implementation Phase 2.5 — Fitur Pencarian Real-time

- GOAL-005: Mengimplementasikan pencarian client-side penuh menggunakan Fuse.js dengan
  debounce, highlight kata kunci, sinkronisasi URL, dan hasil pencarian yang navigable.

| Task     | Description                                                                                                                                                                                                          | Completed | Date |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-016 | Buat `src/utils/search.js` — inisialisasi Fuse.js dengan `pasaluud45.json` data. Config: `keys: ['namapasal', 'arrayisi.isi']`, `threshold: 0.3`, `includeMatches: true`. Instance di-cache sebagai module singleton |           |      |
| TASK-017 | Buat `src/pages/CariPage.js` — halaman pencarian dengan search bar (komponen SearchPasal) dan area hasil pencarian                                                                                                   |           |      |
| TASK-018 | Buat `src/components/SearchPasal.js` — komponen search bar dengan: input type=search, debounce 300ms, ikon search di kiri (Bootstrap Icons), placeholder "Cari pasal UUD 1945...", background `#ECEFF1`              |           |      |
| TASK-019 | Implementasi highlight kata kunci pada hasil pencarian: wrap matching text dengan `<mark>` tag yang distyle sesuai tema                                                                                              |           |      |
| TASK-020 | Implementasi sinkronisasi URL: saat user mengetik, URL diupdate ke `/cari?q=keyword` via `history.replaceState` (tanpa push ke history)                                                                              |           |      |
| TASK-021 | Implementasi pre-fill dari URL: saat `/cari?q=keyword` dibuka langsung, input terisi otomatis dan pencarian dijalankan                                                                                               |           |      |
| TASK-022 | Implementasi empty state: jika tidak ada hasil, tampilkan pesan "Tidak ada pasal yang mengandung kata kunci tersebut" dengan saran penulisan yang berbeda                                                            |           |      |
| TASK-023 | Implementasi klik hasil pencarian: navigasi ke `/pasal/:nomor` dari halaman hasil                                                                                                                                    |           |      |
| TASK-024 | Tampilkan jumlah hasil pencarian: "Ditemukan X pasal yang mengandung '...'"                                                                                                                                          |           |      |
| TASK-025 | Integrasikan `SearchPasal` di `AppHeader` — klik ikon search di header navigasi ke `/cari`                                                                                                                           |           |      |

### Implementation Phase 2.6 — Deep Link & URL Routing Polish

- GOAL-006: Memastikan semua 14 route dapat diakses langsung via URL (deep link),
  termasuk kasus edge yang memerlukan validasi parameter.

| Task     | Description                                                                                                                       | Completed | Date |
| -------- | --------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-026 | Audit semua 14 route: buka setiap URL langsung di browser baru, verifikasi konten muncul tanpa navigasi dari halaman utama        |           |      |
| TASK-027 | Implementasi validasi parameter `/sila/:nomor` — jika nomor bukan 1–5, redirect ke halaman 404                                    |           |      |
| TASK-028 | Implementasi validasi parameter `/bab-pasal/:nomor` — jika nomor bukan 1–21, redirect ke halaman 404                              |           |      |
| TASK-029 | Implementasi validasi parameter `/pasal/:nomor` — jika nomor tidak ditemukan di data, tampilkan halaman 404 dengan pesan spesifik |           |      |
| TASK-030 | Update `BottomNavigation.js` — tab yang aktif harus sinkron dengan URL saat ini (termasuk navigasi via browser back/forward)      |           |      |
| TASK-031 | Implementasi breadcrumb sederhana di halaman detail (Pasal Detail, Sila Detail, Bab Detail) untuk UX navigasi                     |           |      |

### Implementation Phase 2.7 — Testing Phase 2

- GOAL-007: Memastikan semua halaman dan fitur Phase 2 teruji secara komprehensif
  sebelum Phase 3 dimulai.

| Task     | Description                                                                                                    | Completed | Date |
| -------- | -------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-032 | Unit test `src/utils/search.js`: Fuse.js init, search dengan berbagai query, empty results                     |           |      |
| TASK-033 | Unit test `parsePasalNomor()`: berbagai format nomor pasal (1, 6A, 28C, 37)                                    |           |      |
| TASK-034 | Component test `SearchPasal.js`: render, debounce, input event                                                 |           |      |
| TASK-035 | E2E test: `/pasal` — daftar pasal tampil, badge amandemen muncul pada pasal yang benar                         |           |      |
| TASK-036 | E2E test: `/pasal/7A` direct URL — konten Pasal 7A tampil                                                      |           |      |
| TASK-037 | E2E test: `/pasal/999` — halaman 404 tampil dengan link kembali                                                |           |      |
| TASK-038 | E2E test: `/bab-pasal` — 21 bab ditampilkan, expand/collapse berfungsi                                         |           |      |
| TASK-039 | E2E test: `/bab-pasal/3` direct URL — bab 3 tampil dengan daftar pasalnya                                      |           |      |
| TASK-040 | E2E test: `/uud-asli` — pasal versi asli ditampilkan, filter bab berfungsi                                     |           |      |
| TASK-041 | E2E test: `/amandemen` — pasal amandemen digroup per Amandemen I-IV                                            |           |      |
| TASK-042 | E2E test: pencarian "kedaulatan" — hasil muncul dalam 300ms, highlight terlihat                                |           |      |
| TASK-043 | E2E test: `/cari?q=kedaulatan` direct URL — input terisi dan hasil langsung muncul                             |           |      |
| TASK-044 | E2E test: pencarian tanpa hasil — pesan empty state tampil                                                     |           |      |
| TASK-045 | E2E test: klik hasil pencarian — navigasi ke halaman detail pasal                                              |           |      |
| TASK-046 | E2E test: browser back/forward — bottom navigation active tab sinkron dengan URL                               |           |      |
| TASK-047 | Verifikasi CI pipeline pass (semua 14 route, search, 404)                                                      |           |      |
| TASK-048 | E2E test: `/tentang` — informasi aplikasi tampil lengkap dan kedua link Google Forms membuka target yang benar |           |      |

---

## 3. Alternatives

- **ALT-001**: Menggunakan virtual scrolling untuk daftar pasal yang panjang — tidak dipilih
  karena dataset < 100 pasal; rendering biasa dengan Bootstrap List Group sudah cukup efisien
- **ALT-002**: Server-side search dengan Algolia atau Meilisearch — ditolak karena CON-001
  (static site, tidak ada backend); Fuse.js client-side search sudah cukup untuk dataset ini
- **ALT-003**: Membuat satu halaman "super search" yang mencakup semua JSON — tidak dipilih
  karena kompleksitas; Phase 2 search fokus pada `pasaluud45.json` sesuai PRD F-08

---

## 4. Dependencies

- **DEP-001**: Phase 1 selesai — project scaffold, router, data loader, design system, CI/CD
- **DEP-002**: `fuse.js` — sudah diinstall di Phase 1, digunakan di Phase 2
- **DEP-003**: `public/data/pasaluud45.json` — data utama untuk pencarian
- **DEP-004**: `public/data/pasaluud45_ket_amandemen.json` — data badge amandemen
- **DEP-005**: `public/data/babpasal.json` — data navigasi bab
- **DEP-006**: `public/data/pasaluud45noamandemen.json` — data UUD asli
- **DEP-007**: `src/data/loader.js` (Phase 1) — semua data loading functions
- **DEP-008**: `src/router/router.js` (Phase 1) — route registration dan navigation
- **DEP-009**: `src/components/AppHeader.js` (Phase 1) — untuk integrasi search icon

---

## 5. Files

File baru yang dibuat di Phase 2:

- **FILE-001**: `src/pages/PasalListPage.js` — daftar semua pasal
- **FILE-002**: `src/pages/PasalDetailPage.js` — detail satu pasal
- **FILE-003**: `src/pages/BabPasalListPage.js` — daftar 21 bab
- **FILE-004**: `src/pages/BabPasalDetailPage.js` — detail satu bab
- **FILE-005**: `src/pages/UUDAsliPage.js` — UUD 1945 versi asli
- **FILE-006**: `src/pages/AmandemenPage.js` — keterangan amandemen
- **FILE-007**: `src/pages/TentangPage.js` — halaman tentang aplikasi
- **FILE-008**: `src/pages/NotFoundPage.js` — halaman 404
- **FILE-009**: `src/utils/search.js` — Fuse.js singleton + search logic
- **FILE-010**: `src/components/SearchPasal.js` — komponen search bar
- **FILE-011**: `src/utils/pasal.js` — helper functions (parsePasalNomor, dll)
- **FILE-012**: `tests/unit/search.test.js` — unit tests pencarian
- **FILE-013**: `tests/unit/pasal.test.js` — unit tests helper functions
- **FILE-014**: `tests/e2e/pasal.spec.js` — E2E tests halaman pasal
- **FILE-015**: `tests/e2e/search.spec.js` — E2E tests pencarian
- **FILE-016**: `tests/e2e/navigation.spec.js` — E2E tests navigasi & deep link
- **FILE-020**: `src/utils/comparison.js` — fungsi `buildPasalComparison`, `parseAmandemenFromText`, `stripAmandemenLabel`
- **FILE-021**: `src/types/comparison.ts` — TypeScript interfaces `PasalComparisonView`, `AyatComparisonItem`, tipe `AmandemenNumber`, `AmandemenLabel`, konstanta `AMANDEMEN_BADGE_COLOR`
- **FILE-022**: `src/components/PasalComparisonCard.js` — komponen card dua kolom perbandingan side-by-side
- **FILE-023**: `src/pages/AmandemenDetailPage.js` — halaman `/amandemen/:nomor`
- **FILE-024**: `tests/unit/comparison.test.js` — unit tests untuk semua fungsi di `comparison.js`
- **FILE-025**: `tests/e2e/amandemen.spec.js` — E2E tests halaman perbandingan amandemen

File yang dimodifikasi di Phase 2:

- **FILE-017**: `src/router/routes.js` — tambah 10 route baru + catch-all 404 (termasuk `/amandemen/:nomor`)
- **FILE-018**: `src/components/AppHeader.js` — tambah klik search icon → `/cari`
- **FILE-019**: `src/components/BottomNavigation.js` — sinkronisasi active tab dengan URL

---

## 6. Testing

- **TEST-001**: Unit test Fuse.js search — query matching, threshold, includeMatches (Vitest)
- **TEST-002**: Unit test `parsePasalNomor` — semua format nomor pasal yang valid (Vitest)
- **TEST-003**: Component test `SearchPasal` — debounce 300ms, input event, render (Vitest)
- **TEST-004**: E2E — 14 route semua dapat dibuka langsung via URL (Playwright)
- **TEST-005**: E2E — `/pasal/7A` menampilkan konten yang benar (Playwright)
- **TEST-006**: E2E — `/pasal/999` menampilkan halaman 404 (Playwright)
- **TEST-007**: E2E — pencarian real-time dengan debounce dan highlight (Playwright)
- **TEST-008**: E2E — `/cari?q=keyword` deep link langsung menampilkan hasil (Playwright)
- **TEST-009**: E2E — badge amandemen muncul hanya pada pasal yang benar (Playwright)
- **TEST-010**: E2E — browser back/forward navigasi berfungsi (Playwright)
- **TEST-011**: E2E — `/tentang` menampilkan metadata aplikasi dan dua link Google Forms yang valid (Playwright)
- **TEST-012**: Unit test `comparison.js` — `parseAmandemenFromText` mengenali semua 4 label, null jika tidak ada label (Vitest)
- **TEST-013**: Unit test `comparison.js` — `stripAmandemenLabel` membersihkan suffix dengan benar, tidak mengubah teks yang tidak memiliki label (Vitest)
- **TEST-014**: Unit test `comparison.js` — `buildPasalComparison`: pasal normal, pasal baru (`isNewPasal`), pasal dihapus (`isDeletedPasal`), nomor tidak valid (return null) (Vitest)
- **TEST-015**: E2E — `/amandemen/7` dua kolom tampil, badge amandemen terlihat di kolom kanan (Playwright)
- **TEST-016**: E2E — `/amandemen/7A` kolom kiri menampilkan pesan pasal baru, kolom kanan berisi isi pasal (Playwright)

---

## 7. Risks & Assumptions

- **RISK-001**: Fuse.js threshold terlalu rendah/tinggi — hasil tidak relevan atau terlalu ketat
  — **Mitigasi**: Tuning threshold di development dengan test queries representatif; default 0.3
- **RISK-002**: Parsing nomor pasal dari URL bisa kompleks (contoh: `28C`, `6A`, `33A`)
  — **Mitigasi**: Implementasi `parsePasalNomor` dengan mapping lengkap dan test coverage 100%
- **RISK-003**: Halaman dengan data besar (PasalListPage) lambat di mobile
  — **Mitigasi**: Render list dengan fragment DOM (tidak re-render seluruh list), pagination
  opsional jika ditemukan masalah performa
- **RISK-004**: Parsing label amandemen inline dari teks ayat bisa gagal jika format teks di JSON tidak konsisten
  — **Mitigasi**: `parseAmandemenFromText` menggunakan exact string matching pada 4 label yang diketahui; unit test mencakup semua variasi format yang ditemukan di data
- **RISK-005**: Pencocokan pasal antara `pasaluud45noamandemen.json` dan `pasaluud45_ket_amandemen.json` bisa gagal jika kapitalisasi `namapasal` tidak konsisten
  — **Mitigasi**: `buildPasalComparison` menggunakan `toLowerCase()` pada kedua sisi saat lookup
- **ASSUMPTION-001**: Fuse.js dapat menangani dataset `pasaluud45.json` (~30KB) tanpa masalah
  performa di mobile (sudah terbukti di spec-architecture §7.2)
- **ASSUMPTION-002**: Format nomor pasal di URL menggunakan huruf kapital sesuai data JSON
  (contoh: `/pasal/7A` bukan `/pasal/7a`) — router harus normalize ke uppercase
- **ASSUMPTION-003**: Semua pasal yang perlu dibandingkan tersedia di kedua file JSON; pasal yang ada di `pasaluud45_ket_amandemen.json` tetapi tidak ada di `pasaluud45noamandemen.json` dianggap sebagai pasal baru (`isNewPasal: true`)

---

## 8. Related Specifications / Further Reading

- [PRD: Pancasila & UUD 1945 Web App](../prd_pasaluud1945_webapp.md) — F-04, F-05, F-06, F-07, F-07b, F-08, F-10, F-11, F-12
- [Spesifikasi Arsitektur](../spec/spec-architecture-pasaluud1945-webapp.md) — §4.2 Routing (route `/amandemen/:nomor`), §5.1 AC-008a–AC-008d, §5.2 Pencarian
- [Spesifikasi Data Schema](../spec/spec-data-schema-pasaluud1945.md) — §7.4 Transformasi Perbandingan Pasal, interface `PasalComparisonView`, fungsi `buildPasalComparison`
- [Spesifikasi Design System & UI/UX](../spec/spec-design-uiux-pasaluud1945.md) — §9.4 Search Bar, §9.5 Pasal List Item, §9.7 Badge Amandemen
- [Master Plan](./architecture-overview-pasaluud1945-1.md)
- [Phase 1 Plan](./feature-phase1-fondasi-setup-1.md)
- [Fuse.js Documentation](https://www.fusejs.io/)
