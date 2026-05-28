---
goal: Panduan Persiapan & Tugas Phase 4 — Launch & Monitoring
version: 1.0
date_created: 2026-05-25
last_updated: 2026-05-25
owner: Development Team
status: 'Draft'
tags:
  - launch
  - monitoring
  - uat
  - deployment
  - checklist
---

<!-- markdownlint-disable -->

# Panduan Persiapan & Tugas Phase 4 (Launch & Monitoring)

Dokumen ini disusun untuk membantu Anda mempersiapkan dan menyelesaikan **Phase 4 — Launch & Monitoring** untuk aplikasi web Pancasila & UUD 1945. Fase ini berfokus pada pengujian penerimaan pengguna (UAT), penyebaran (*deployment*) ke produksi, konfigurasi pemantauan (*monitoring*), serta optimasi akhir.

---

## 1. Daftar Tugas Dokumen yang Perlu Dibuat di Folder `docs/`

Selama pelaksanaan Phase 4, ada beberapa dokumen penting yang harus Anda siapkan dan isi di folder `docs/`. Berikut adalah daftar tugas pembuatan dokumen beserta templatenya:

### Tugas 1: Membuat Catatan Pengujian UAT (`docs/uat-issues.md`)
Dokumen ini berfungsi untuk mencatat setiap *bug* atau ketidaksesuaian yang ditemukan selama UAT.

* **Status:** Belum dibuat
* **Template Isi Dokumen:**
  ```markdown
  # Catatan Isu Pengujian UAT (User Acceptance Testing)

  Dokumen ini digunakan untuk mencatat dan melacak isu/bug yang ditemukan selama UAT Phase 4.

  ## Daftar Isu Aktif

  | ID | Fitur/Halaman | Deskripsi Isu | Prioritas (P1/P2/P3) | Status (Open/Resolved) | Catatan Perbaikan |
  | --- | --- | --- | --- | --- | --- |
  | UAT-001 | Bab Pasal | Halaman detail Bab 14 tidak menampilkan pasal terkait | P1 (Blocker) | Open | - |

  ## Klasifikasi Prioritas:
  - **P1 (Blocker):** Isu kritis yang menghalangi deployment (misal: halaman blank, routing rusak).
  - **P2 (High):** Masalah fungsi utama tetapi ada workaround (misal: tombol share lambat merespons).
  - **P3 (Nice-to-have):** Masalah minor visual atau typo teks.
  ```

### Tugas 2: Membuat Informasi Teknis & Monitoring Produksi (`docs/production.md`)
Dokumen ini digunakan untuk menyimpan seluruh URL rilis produksi dan dasbor pemantauan. **PENTING:** Jangan pernah menyimpan kredensial/password di file ini.

* **Status:** Belum dibuat
* **Template Isi Dokumen:**
  ```markdown
  # Informasi Teknis & Dasbor Produksi

  Informasi resmi mengenai infrastruktur produksi aplikasi web Pancasila & UUD 1945.

  ## Detail Lingkungan Produksi

  - **URL Produksi:** `https://pasaluud1945.web.id` (atau sesuai domain Vercel/Netlify Anda)
  - **Platform Hosting:** Vercel / Netlify
  - **Status HTTPS:** Aktif (SSL Auto-managed)
  - **SPA Fallback Routing:** Konfigurasi `vercel.json` atau `_redirects` terverifikasi.

  ## Dasbor Pemantauan (Monitoring)

  - **Google Analytics 4:** [Link GA Dashboard](https://analytics.google.com/) (Tracking ID: `G-XXXXXXXXXX`)
  - **Google Search Console:** [Link GSC Dashboard](https://search.google.com/search-console)
  - **Uptime Monitoring:** UptimeRobot / Netlify Analytics

  ## Riwayat Deployments

  - **v1.0.0 (2026-05-25):** Rilis stabil pertama (Production Launch).
  ```

---

## 2. Checklist Langkah Persiapan Peluncuran (Launch Checklist)

Gunakan daftar checklist ini sebagai panduan langkah demi langkah yang dapat Anda ikuti dan centang ketika mempersiapkan Phase 4.

### Tahap A: UAT Fungsional (Berdasarkan PRD)
Lakukan pengujian secara manual di server lokal (`npm run dev`) atau preview build (`npm run preview`) untuk memverifikasi fitur berikut:

- [ ] **F-01 (Landing & Pancasila):** Homepage `/` tampil bersih, klik sila mengarah ke `/sila/:nomor` dengan teks lengkap.
- [ ] **F-02 (Butir Pancasila):** Accordion di `/butir-pancasila` dapat di-expand/collapse dengan mulus.
- [ ] **F-03 (Pembukaan UUD):** 4 alinea tampil berurutan tanpa ada potongan teks.
- [ ] **F-04 (Pasal UUD):** Halaman `/pasal` menampilkan daftar lengkap dan detail `/pasal/:nomor` menunjukkan ayat beserta lencana (*badge*) amandemen yang sesuai.
- [ ] **F-05 (Navigasi Bab):** Navigasi di `/bab-pasal` memetakan bab-bab UUD 1945 dengan benar.
- [ ] **F-06 (UUD Asli):** Mengakses `/uud-asli` menampilkan teks versi pra-amandemen secara akurat.
- [ ] **F-07 (Detail Amandemen):** Perbandingan teks asli vs amandemen di `/amandemen/:nomor` berjejer rapi (*side-by-side*).
- [ ] **F-08 (Pencarian):** Hasil pencarian Fuse.js muncul di `/cari?q=` dalam waktu kurang dari 300ms dengan sorotan (*highlight*) pada kata kunci.
- [ ] **F-09 (Sharing):** Tombol bagikan di halaman Pasal, Sila, dan Pembukaan berhasil memicu Web Share API di perangkat mobile atau menyalin ke *clipboard* di desktop.
- [ ] **F-10 (Deep Linking):** Buka URL langsung seperti `/pasal/28A` di tab baru. Konten harus langsung termuat dengan benar (bukan 404).
- [ ] **F-11 & F-12 (Tautan Koreksi & Tentang):** Tautan formulir koreksi dan informasi versi aplikasi di `/tentang` berfungsi.

### Tahap B: Verifikasi Kualitas Teknis & Build
Jalankan perintah pengujian dan build secara lokal untuk memastikan keandalan kode:

- [ ] **Type-check:** Jalankan `npm run type-check` dan pastikan tidak ada error tipe data TypeScript.
- [ ] **Linter:** Jalankan `npm run lint` untuk memastikan semua kode mematuhi standar kebersihan kode.
- [ ] **Unit Tests:** Jalankan `npm run test` untuk memverifikasi semua komponen lolos pengujian dengan cakupan (*coverage*) >= 80%.
- [ ] **E2E Tests:** Jalankan `npm run test:e2e` menggunakan Playwright dan pastikan semua skenario tes lolos tanpa ada kegagalan.
- [ ] **Verifikasi Sitemap & Robots:** Jalankan `npm run build` dan periksa folder `dist/` untuk memastikan `sitemap.xml` dan `robots.txt` berhasil dihasilkan dengan benar.

### Tahap C: Konfigurasi Layanan Pihak Ketiga (Third-Party)
Siapkan akun dan kredensial sebelum melakukan deployment final:

- [ ] **Google Analytics 4:** 
  1. Buat properti baru di Google Analytics Console.
  2. Dapatkan *Measurement ID* (contoh: `G-XXXXXXXXXX`).
  3. Siapkan ID ini untuk diatur sebagai *Environment Variable* di server hosting.
- [ ] **Google Search Console:**
  1. Siapkan akun Google Search Console.
  2. Bersiaplah untuk memverifikasi kepemilikan domain setelah website ditayangkan (melalui metode DNS TXT Record atau pengunggahan file HTML verifikasi).

---

## 3. Langkah Penyebaran (Deployment Steps)

Saat Anda siap mendeploy aplikasi ke platform pilihan Anda (misalnya Vercel atau Netlify):

1. **Hubungkan Repositori:** Hubungkan repositori GitHub proyek ini ke akun Vercel atau Netlify Anda.
2. **Konfigurasi Variabel Lingkungan:** Masukkan variabel lingkungan berikut pada dasbor penyebaran platform hosting Anda:
   - `GA_MEASUREMENT_ID` = (Masukkan ID Google Analytics Anda)
   - `BASE_URL` = `https://nama-domain-anda.com`
3. **Konfigurasi Perintah Build:**
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
4. **Setup SPA Fallback (PENTING):**
   - **Di Netlify:** Buat file `public/_redirects` berisi `/* /index.html 200`. (Sudah otomatis ditangani jika build menggunakan konfigurasi Vite yang sesuai).
   - **Di Vercel:** Pastikan konfigurasi `vercel.json` (jika ada) menangani penulisan ulang rute SPA ke `index.html`.
5. **Verifikasi HTTPS:** Pastikan sertifikat SSL gratis dari platform hosting Anda telah terbit dan aktif secara otomatis.
