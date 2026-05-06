---
post_title: "Panduan Konfigurasi Google Analytics 4"
author1: "Development Team"
post_slug: "panduan-konfigurasi-ga4"
microsoft_alias: "devteam"
featured_image: ""
categories:
  - documentation
tags:
  - ga4
  - analytics
  - setup
  - phase3
ai_note: "Dokumen ini disusun dengan bantuan AI dan telah ditinjau ulang oleh tim pengembang."
summary: "Panduan langkah demi langkah untuk menyiapkan Google Analytics 4 pada web app, termasuk konfigurasi di Google Analytics Console, environment variable, verifikasi event, dan troubleshooting."
post_date: "2026-05-06"
---

<!-- markdownlint-disable -->

# Tujuan

Dokumen ini menjadi panduan standar tim untuk menambahkan dan memverifikasi Google
Analytics 4 (GA4) pada aplikasi Pancasila dan UUD 1945.

Cakupan dokumen:

- Pembuatan property GA4 di Google Analytics Console
- Pengambilan Measurement ID
- Konfigurasi environment variable pada project
- Verifikasi data page view dan custom events
- Troubleshooting umum

## Ringkasan Implementasi di Project

Implementasi analytics pada project ini menggunakan Google Analytics 4 dengan
pendekatan gtag.js (bukan Firebase Analytics SDK).

Titik integrasi utama di codebase:

- Bootstrap gtag pada [index.html](../index.html)
- Wrapper analytics pada [src/utils/analytics.js](../src/utils/analytics.js)
- Tracking page view pada [src/main.js](../src/main.js)
- Tracking event share pada [src/components/ShareButton.js](../src/components/ShareButton.js)
- Tracking event search pada [src/pages/CariPage.js](../src/pages/CariPage.js)
- Tracking event navigation tab pada [src/components/AppHeader.js](../src/components/AppHeader.js) dan [src/components/BottomNavigation.js](../src/components/BottomNavigation.js)

## Prasyarat

Sebelum konfigurasi, pastikan:

- Memiliki akun Google yang akan digunakan untuk analytics tim
- Aplikasi sudah bisa dijalankan dan di-build
- Domain/URL production sudah ditentukan
- Deployment menggunakan HTTPS

## Langkah 1: Buat Property GA4 di Google Analytics Console

1. Buka https://analytics.google.com
2. Masuk dengan akun Google tim
3. Buka menu Admin
4. Pada kolom Account, klik Create Account jika belum ada
5. Pada kolom Property, klik Create Property
6. Isi nama property, timezone, dan currency
7. Lanjutkan sampai property selesai dibuat

## Langkah 2: Buat Data Stream Web

1. Masuk ke Admin > Data Streams
2. Klik Add stream > Web
3. Isi Website URL dengan URL production aplikasi
4. Isi Stream name, lalu klik Create stream
5. Setelah stream terbentuk, catat Measurement ID dengan format G-XXXXXXXXXX

## Langkah 3: Konfigurasi Environment Variable di Project

Project ini membaca Measurement ID dari environment variable berikut:

- VITE_GA_MEASUREMENT_ID

Contoh pengisian lokal:

- Buka file [.env](../.env)
- Isi nilai berikut:

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Catatan penting:

- Prefix VITE wajib untuk env yang dipakai di sisi browser pada Vite
- Jangan commit nilai production sensitif jika kebijakan repo melarangnya

## Langkah 4: Konfigurasi Environment Variable di CI/CD

Jika deploy melalui platform hosting atau CI:

1. Tambahkan variable VITE_GA_MEASUREMENT_ID pada environment production
2. Isi dengan Measurement ID dari GA4 stream
3. Jalankan ulang build/deploy agar nilai env terbaca

Jika pipeline saat ini menggunakan nama lama GA_MEASUREMENT_ID, lakukan mapping ke
VITE_GA_MEASUREMENT_ID di workflow deploy.

## Langkah 5: Build dan Deploy

1. Jalankan build production
2. Deploy ke environment production HTTPS
3. Pastikan file aplikasi terbaru sudah ter-publish

## Langkah 6: Verifikasi Data Masuk ke GA4

1. Buka aplikasi production di browser
2. Lakukan aksi berikut:
   - Pindah halaman beberapa kali
   - Klik tab navigasi utama
   - Lakukan pencarian
   - Klik tombol bagikan di halaman yang mendukung
3. Buka GA4 > Reports > Realtime (atau DebugView)
4. Pastikan event berikut muncul:
   - page_view
   - navigation_tab_click
   - search_query
   - share_click

## Daftar Event yang Digunakan

Event yang saat ini dikirim oleh aplikasi:

- page_view
  - Data utama: page_path, page_location, page_title
- navigation_tab_click
  - Data utama: event_category, event_label, page_path
- search_query
  - Data utama: event_category, event_label, page_path
- share_click
  - Data utama: event_category, event_label, page_path

## Privacy dan Mode Production

Sesuai planning Phase 3.6:

- Analytics aktif hanya pada mode production
- Konfigurasi gtag menggunakan anonymize_ip
- Jika ID tidak valid atau env kosong, tracking tidak dijalankan

## Troubleshooting

### Event tidak muncul di Realtime

Periksa hal berikut:

- VITE_GA_MEASUREMENT_ID sudah benar dan valid
- Aplikasi yang dibuka adalah hasil build/deploy terbaru
- Browser tidak memblokir request analytics (adblock/privacy extension)
- Tidak sedang menjalankan mode development saat pengujian tracking

### Measurement ID sudah benar tapi tetap kosong

- Coba verifikasi lewat DebugView
- Coba buka aplikasi dengan jaringan berbeda
- Pastikan stream URL di GA4 sesuai domain production

### Event hanya sebagian yang masuk

- Ulangi langkah verifikasi dengan jeda beberapa detik per aksi
- Cek konsol browser untuk error runtime
- Pastikan tidak ada perubahan pada file integrasi analytics

## Checklist Onboarding Developer

Gunakan checklist ini saat developer baru melakukan setup:

1. Memahami bahwa stack analytics menggunakan GA4 gtag.js
2. Mengetahui lokasi integrasi analytics di codebase
3. Mengetahui env yang dipakai: VITE_GA_MEASUREMENT_ID
4. Dapat menjalankan build tanpa error
5. Dapat memverifikasi event masuk di Realtime GA4

## Referensi

- [Plan Phase 3](../plan/feature-phase3-pwa-sharing-seo-1.md)
- [PRD Project](./prd_pasaluud1945_webapp.md)
- [Spesifikasi Arsitektur](../spec/spec-architecture-pasaluud1945-webapp.md)
- https://developers.google.com/tag-platform/gtagjs
