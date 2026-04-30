# Pancasila & UUD 1945 Web App

> Aplikasi referensi konstitusional Indonesia berbasis Progressive Web App (PWA) yang menyajikan isi Pancasila, Butir-butir Pancasila, Pembukaan UUD 1945, serta seluruh Pasal UUD 1945.

<!-- markdownlint-disable -->

## Ringkasan Produk

Aplikasi **Pancasila & UUD 1945** merupakan migrasi dari aplikasi Android (v4.0.0, package `gulajava.uud`) ke platform web. Tujuan migrasi ini agar konten hukum dasar negara dapat diakses oleh siapa saja, kapan saja, dan dari perangkat apa pun — termasuk pengguna desktop, laptop, iOS, dan perangkat non-Android — tanpa perlu mengunduh aplikasi.

Produk ini ditargetkan sebagai **Progressive Web App (PWA)** agar tetap dapat diakses secara offline setelah dikunjungi pertama kali, memberikan pengalaman yang mendekati aplikasi native pada perangkat mobile maupun desktop.

## Fitur Utama

| ID   | Fitur                                         | Prioritas |
| ---- | --------------------------------------------- | --------- |
| F-01 | Tampilan 5 Sila Pancasila                     | Tinggi    |
| F-02 | Tampilan Butir-Butir Pancasila per Sila       | Tinggi    |
| F-03 | Tampilan Pembukaan UUD 1945 (4 Alinea)        | Tinggi    |
| F-04 | Daftar dan Isi Pasal UUD 1945 Pasca-Amandemen | Tinggi    |
| F-05 | Navigasi Berdasarkan 21 Bab UUD 1945          | Tinggi    |
| F-06 | Tampilan UUD 1945 Asli (Sebelum Amandemen)    | Sedang    |
| F-07 | Tampilan Detail Amandemen (I-IV)              | Sedang    |
| F-08 | Pencarian Pasal Real-time (Fuse.js)           | Tinggi    |
| F-09 | Berbagi Konten (Web Share API + Clipboard)    | Sedang    |
| F-10 | Deep Link / URL per Pasal                     | Tinggi    |
| F-11 | Koreksi Pasal & Saran Masukan (Google Forms)  | Rendah    |
| F-12 | Halaman Tentang Aplikasi                      | Rendah    |
| F-13 | Mode Offline (PWA)                            | Sedang    |
| F-14 | Tampilan Responsif (Mobile, Tablet, Desktop)  | Tinggi    |

## Tech Stack

| Komponen          | Teknologi                           | Versi  |
| ----------------- | ----------------------------------- | ------ |
| Bahasa            | Vanilla JavaScript (ES6+)           | —      |
| Build Tool        | Vite                                | 5.0+   |
| CSS Framework     | Bootstrap                           | 5.3+   |
| Ikon              | Bootstrap Icons                     | 5.3+   |
| Pencarian         | Fuse.js                             | Latest |
| Type Safety       | TypeScript (opsional)               | 5.0+   |
| Unit Test         | Vitest                              | Latest |
| E2E Test          | Playwright                          | Latest |
| Performance Audit | Lighthouse CI                       | Latest |
| CI/CD             | GitHub Actions                      | —      |
| Hosting           | Vercel / Netlify / Cloudflare Pages | —      |

## Sumber Data

Seluruh konten aplikasi bersifat **statis** dan bersumber dari 7 file JSON yang dimigrasi dari aplikasi Android:

| #   | File                            | Konten                       | Estimasi Ukuran |
| --- | ------------------------------- | ---------------------------- | --------------- |
| 1   | `silapancasila.json`            | 5 Sila Pancasila             | ~1KB            |
| 2   | `butir_pancasila.json`          | Butir-butir per Sila (45+)   | ~8KB            |
| 3   | `pembukaanuud.json`             | 4 Alinea Pembukaan UUD       | ~2KB            |
| 4   | `pasaluud45.json`               | Pasal pasca-amandemen (37+)  | ~30KB           |
| 5   | `pasaluud45noamandemen.json`    | Pasal asli sebelum amandemen | ~25KB           |
| 6   | `pasaluud45_ket_amandemen.json` | Keterangan amandemen (I-IV)  | ~35KB           |
| 7   | `babpasal.json`                 | Struktur 21 Bab UUD 1945     | ~3KB            |

Tidak ada backend API atau database server-side. Seluruh data dikemas bersama aplikasi sebagai static assets.

## Routing

| Route               | Konten                                   |
| ------------------- | ---------------------------------------- |
| `/`                 | Halaman utama (redirect ke `/pancasila`) |
| `/pancasila`        | Daftar 5 Sila Pancasila                  |
| `/sila/:nomor`      | Detail dan Butir-butir Sila tertentu     |
| `/butir-pancasila`  | Butir-butir Pancasila per Sila           |
| `/pembukaan`        | 4 Alinea Pembukaan UUD 1945              |
| `/pasal`            | Daftar semua Pasal UUD 1945              |
| `/pasal/:nomor`     | Detail isi Pasal tertentu                |
| `/bab-pasal`        | Navigasi 21 Bab UUD 1945                 |
| `/bab-pasal/:nomor` | Navigasi langsung ke Bab tertentu        |
| `/uud-asli`         | Daftar Pasal UUD 1945 versi asli         |
| `/amandemen`        | Daftar Pasal dengan keterangan amandemen |
| `/cari`             | Halaman pencarian (`?q=kata-kunci`)      |
| `/tentang`          | Halaman informasi aplikasi               |

## Design System

Aplikasi mengikuti identitas visual aplikasi Android existing dengan palet warna merah-putih yang mencerminkan identitas nasional Indonesia:

| Token                | Warna     | Penggunaan                        |
| -------------------- | --------- | --------------------------------- |
| Primary              | `#C62828` | Header, primary button, tab aktif |
| Primary Dark         | `#B71C1C` | Hover state, header shadow        |
| Accent Indicator     | `#FFB300` | Tab indicator, highlight          |
| Accent Orange        | `#E64A19` | Secondary button, icon tint       |
| Text Primary         | `#5d5d5d` | Body text, heading, konten pasal  |
| Text Secondary       | `#989898` | Subtitle, meta info, placeholder  |
| Background           | `#ffffff` | Halaman utama                     |
| Background Secondary | `#f2f2f2` | Halaman sekunder, search page     |
| Surface Variant      | `#ECEFF1` | Search input background           |
| Badge Amandemen      | `#53d397` | Badge keterangan amandemen        |
| Divider              | `#dbdbdb` | Garis pemisah, border             |

### Responsif Breakpoint

| Breakpoint            | Layout                                      |
| --------------------- | ------------------------------------------- |
| Mobile (< 768px)      | Tab horizontal scroll, konten full-width    |
| Tablet (768px–1023px) | Sidebar collapsible, konten 2/3 width       |
| Desktop (>= 1024px)   | Sidebar fixed kiri (280px), konten di kanan |

## Target Performa

| Metrik                         | Target      |
| ------------------------------ | ----------- |
| Lighthouse Performance         | >= 90       |
| Lighthouse Accessibility       | >= 90       |
| Lighthouse SEO                 | >= 95       |
| Lighthouse PWA                 | >= 80       |
| LCP (Largest Contentful Paint) | < 2.5 detik |
| CLS (Cumulative Layout Shift)  | < 0.1       |
| TTI (Time to Interactive)      | < 3 detik   |
| Initial Bundle JS (gzipped)    | < 200KB     |
| Offline Functionality          | 100% konten |

## Milestone Pengembangan

| Fase | Nama                     | Durasi     | Fokus Utama                                                              |
| ---- | ------------------------ | ---------- | ------------------------------------------------------------------------ |
| 1    | Fondasi & Setup          | 1–2 minggu | Project setup, migrasi JSON, navigasi, halaman Pancasila/Butir/Pembukaan |
| 2    | Konten Utama & Pencarian | 2–3 minggu | Halaman Pasal, Bab, UUD Asli, Amandemen, pencarian, deep link            |
| 3    | PWA, Sharing & Polish    | 1–2 minggu | Service Worker, berbagi, responsif, SEO, Google Analytics                |
| 4    | Launch & Monitoring      | 1 minggu   | UAT, soft launch, monitoring Core Web Vitals, bug fixes                  |

## Dokumentasi Proyek

### Product Requirements

- [PRD: Pancasila & UUD 1945 Web App](./prd_pasaluud1945_webapp.md) — Kebutuhan produk, user stories, dan acceptance criteria

### Spesifikasi Teknis

- [Spesifikasi Arsitektur](./spec/spec-architecture-pasaluud1945-webapp.md) — Arsitektur sistem, routing, PWA, SEO, hosting, dan test strategy
- [Spesifikasi Data Schema](./spec/spec-data-schema-pasaluud1945.md) — Schema lengkap 7 file JSON, TypeScript interfaces, relasi antar data, dan transformasi
- [Spesifikasi Design System & UI/UX](./spec/spec-design-uiux-pasaluud1945.md) — Color palette, tipografi, komponen UI, layout responsif, dan aksesibilitas
- [Spesifikasi Process Workflow](./spec/spec-process-workflow-pasaluud1945.md) — SDLC, git branching, CI/CD pipeline, quality gates, dan release management
- [Spesifikasi SEO & Metadata](./spec/spec-seo-pasaluud1945.md) — Meta tags per route, Open Graph, JSON-LD Structured Data, sitemap, pre-rendering SPA

### Panduan Development

- [AGENTS.md](./AGENTS.md) — Konvensi komunikasi, workflow SDLC, dan gaya dokumentasi

## Alur SDLC

Pengembangan mengikuti alur ketat tanpa melompat fase:

```
PRD → Specification → Planning → Implementation → Testing → Deployment → Monitoring
 ✅       ✅            ❌             ❌             ❌          ❌           ❌
```

## Lisensi

Lihat [LICENSE.md](./LICENSE.md).
