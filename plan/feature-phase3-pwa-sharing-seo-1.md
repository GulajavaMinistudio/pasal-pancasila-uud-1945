---
goal: Phase 3 — PWA, Sharing & SEO Pancasila & UUD 1945 Web App
version: 1.0
date_created: 2026-04-28
last_updated: 2026-04-28
owner: Development Team
status: 'In Progress'
tags:
  - feature
  - phase3
  - pwa
  - seo
  - sharing
  - performance
  - accessibility
  - implementation
---

<!-- markdownlint-disable -->

# Introduction

![Status: In Progress](https://img.shields.io/badge/status-In%20Progress-orange)

Phase 3 mengimplementasikan fitur-fitur non-konten yang menjadikan aplikasi ini production-ready:
Progressive Web App (PWA) dengan offline support, fitur berbagi konten (Web Share API),
optimasi SEO lengkap (meta tags, Open Graph, JSON-LD), Google Analytics 4, dan
polish performa + aksesibilitas hingga semua Lighthouse quality gates terpenuhi.

**Prerequisite:** Phase 2 selesai — semua 14 route berfungsi dan pencarian berjalan. ✅

**Estimasi Durasi:** 1–2 minggu

**PRD Features yang dicakup:** F-09, F-13 (Service Worker), F-14 (aksesibilitas polish)

**PRD Business Goals:** Lighthouse SEO ≥ 95, Organic Traffic ≥ 70%, halaman 1 Google

---

## 1. Requirements & Constraints

- **REQ-001**: Service Worker harus cache semua 7 JSON + seluruh static assets (REQ-023 spec-arch)
- **REQ-002**: Aplikasi harus berfungsi 100% offline setelah kunjungan pertama (AC-018 spec-arch)
- **REQ-003**: Web App Manifest harus valid dan aplikasi memenuhi PWA installability criteria
- **REQ-004**: Web Share API harus tersedia dengan Clipboard API fallback (AC-013, AC-014)
- **REQ-005**: Meta tags `<title>` dan `<meta name="description">` harus unik per 14 route
- **REQ-006**: Open Graph dan Twitter Card meta tags harus ada di setiap route
- **REQ-007**: JSON-LD Structured Data harus ada untuk halaman Pasal, Sila, dan Pembukaan
- **REQ-008**: `sitemap.xml` harus dihasilkan otomatis saat build time
- **REQ-009**: Lighthouse Performance ≥ 90, Accessibility ≥ 90, SEO ≥ 95, PWA ≥ 80
- **REQ-010**: Bundle JavaScript initial (gzipped) harus < 200KB (REQ-015 spec-arch)
- **REQ-011**: Indikator visual offline harus tampil saat koneksi pengguna terputus dan hilang saat koneksi kembali tersedia
- **SEC-001**: Service Worker tidak boleh cache data sensitif; hanya konten publik statis
- **SEC-002**: Google Analytics harus menggunakan mode anonim; tidak ada data PII yang dikumpulkan
- **SEC-003**: Content Security Policy harus mencakup domain Google Fonts dan gtag.js
- **CON-001**: Web Share API hanya tersedia pada HTTPS — deployment harus HTTPS (auto di Vercel/Netlify)
- **CON-002**: HTTPS wajib untuk Service Worker registration (PWA requirement)
- **GUD-001**: `updateMetaTags()` dipanggil di setiap route handler, bukan hanya di halaman awal
- **GUD-002**: JSON-LD harus di-inject ke `<head>` sebagai `<script type="application/ld+json">`
- **PAT-001**: Cache strategy: Cache-First untuk static assets, Network-First untuk JSON data dengan
  fallback ke cache jika offline

---

## 2. Implementation Steps

### Implementation Phase 3.1 — Progressive Web App (PWA)

- GOAL-001: Mengimplementasikan PWA menggunakan `vite-plugin-pwa` dengan konfigurasi
  Workbox yang benar, Web App Manifest, offline indicator, app icons, dan memenuhi semua
  kriteria PWA installability.

| Task     | Description                                                                                                                                                                                                                     | Completed | Date       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-001 | Konfigurasi `VitePWA` di `vite.config.js` dengan `strategies: 'generateSW'`, `registerType: 'autoUpdate'`, `injectRegister: 'auto'`, dan `manifestFilename: 'manifest.json'`                                                    | ✅         | 2026-05-05 |
| TASK-002 | Definisikan manifest aplikasi di `vite.config.js`: `name: "Pancasila & UUD 1945"`, `short_name: "UUD 1945"`, `start_url: "/"`, `display: "standalone"`, `theme_color: "#C62828"`, `background_color: "#ffffff"`, `icons: [...]` | ✅         | 2026-05-05 |
| TASK-003 | Konfigurasi `workbox.globPatterns` agar precache mencakup HTML, CSS, JS, ikon PWA, dan seluruh 7 file JSON di `/data/`                                                                                                          | ✅         | 2026-05-05 |
| TASK-004 | Konfigurasi `runtimeCaching` Workbox: `NetworkFirst` untuk `/data/*.json`, `CacheFirst` untuk aset statis, dan fallback ke cache saat offline                                                                                   | ✅         | 2026-05-05 |
| TASK-005 | Konfigurasi SPA fallback di Workbox melalui `navigateFallback: '/index.html'` agar direct access semua route tetap berfungsi saat offline                                                                                       | ✅         | 2026-05-05 |
| TASK-006 | Integrasikan registrasi service worker di `src/main.js` menggunakan `registerSW` dari `virtual:pwa-register`, termasuk callback untuk update aplikasi                                                                           | ✅         | 2026-05-05 |
| TASK-007 | Buat app icons semua ukuran: `192x192`, `512x512` (maskable), `180x180` (Apple touch icon), `32x32` (favicon) — format PNG                                                                                                      | ✅         | 2026-05-05 |
| TASK-008 | Tambahkan Apple meta tags dan theme color di `index.html`; pastikan manifest link dan registration diinject oleh `vite-plugin-pwa` saat build                                                                                   | ✅         | 2026-05-05 |
| TASK-009 | Verifikasi build menghasilkan `dist/manifest.json` dan service worker generated tanpa error; cek installability di Chrome DevTools → Application → Manifest                                                                     | ✅         | 2026-05-05 |
| TASK-010 | Buat `src/components/OfflineIndicator.js` — banner/toast non-intrusif yang tampil saat event `offline` dan hilang saat event `online`; mount di layout global                                                                   | ✅         | 2026-05-05 |
| TASK-011 | Test offline mode: aktifkan "Offline" di DevTools Network → semua halaman dan pencarian masih berfungsi, serta indikator offline tampil sesuai status jaringan                                                                  | ⏳         | —          |

### Implementation Phase 3.2 — Fitur Berbagi Konten

- GOAL-002: Mengimplementasikan tombol "Bagikan" yang fungsional di semua halaman
  konten menggunakan Web Share API dengan Clipboard API sebagai fallback.

| Task     | Description                                                                                                                                                                                                         | Completed | Date       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-012 | Buat `src/utils/share.js` — utility `shareContent({ title, text, url })`: coba `navigator.share()`, fallback ke `navigator.clipboard.writeText()`, fallback ke `window.prompt()` jika clipboard juga tidak tersedia | ✅         | 2026-05-05 |
| TASK-013 | Buat `src/components/ShareButton.js` — komponen tombol "Bagikan" dengan ikon Bootstrap Icons `bi-share`, tooltip "Salin Tautan" sebagai fallback, loading state saat share aktif                                    | ✅         | 2026-05-05 |
| TASK-014 | Integrasi `ShareButton` di `PasalDetailPage.js` — share text: `"[Nama Pasal]\n[Isi Ayat 1]\n...\n[URL]"`, share URL: `window.location.href`                                                                         | ✅         | 2026-05-05 |
| TASK-015 | Integrasi `ShareButton` di `SilaDetailPage.js` — share text: `"[Sila ke-N]\n[Teks Sila]\n[URL]"`                                                                                                                    | ✅         | 2026-05-05 |
| TASK-016 | Integrasi `ShareButton` di `PembukaanPage.js` — share per alinea: `"Pembukaan UUD 1945 - Alinea [N]\n[Teks Alinea]\n[URL]"`                                                                                         | ✅         | 2026-05-05 |
| TASK-017 | Integrasi `ShareButton` di `ButirPancasilaPage.js` pada level halaman (bukan per butir); share per butir dicatat sebagai backlog v2 di luar scope v1                                                                | ✅         | 2026-05-05 |
| TASK-018 | Tampilkan notifikasi singkat "Tautan disalin!" setelah clipboard copy berhasil (Bootstrap Toast atau simple CSS transition)                                                                                         | ✅         | 2026-05-05 |

### Implementation Phase 3.3 — SEO: Meta Tags Per Route

- GOAL-003: Mengimplementasikan `updateMetaTags()` utility dan memastikan setiap
  dari 14 route memiliki meta tags yang unik dan optimal untuk mesin pencari.

| Task     | Description                                                                                                                                                                                                                                                             | Completed | Date       |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-019 | Buat `src/utils/seo.js` — fungsi `updateMetaTags({ title, description, canonicalUrl, ogImage })`: update `document.title`, `<meta name="description">`, `<link rel="canonical">`, dan semua OG/Twitter tags                                                             | ✅         | 2026-05-05 |
| TASK-020 | Implementasi meta tags dasar di `index.html`: `<meta name="description">` default, `<meta property="og:site_name">`, `<meta name="twitter:card" content="summary_large_image">`                                                                                         | ✅         | 2026-05-05 |
| TASK-021 | Panggil `updateMetaTags()` di route handler setiap halaman. Template title per route (dari `spec-seo §5`): `/pancasila` → `"Pancasila - 5 Sila Dasar Negara Indonesia \| UUD 1945"`, `/pasal/:nomor` → `"[Nama Pasal] UUD 1945 - Teks Lengkap & Ayat \| UUD 1945"`, dst | ✅         | 2026-05-05 |
| TASK-022 | Implementasi dynamic meta description per halaman pasal: `"Teks lengkap [Nama Pasal] UUD 1945 beserta ayat-ayatnya. [Isi ayat 1, max 120 karakter]..."`                                                                                                                 | ✅         | 2026-05-05 |
| TASK-023 | Implementasi Open Graph tags per route: `og:title`, `og:description`, `og:url` (canonical), `og:type: "article"` untuk pasal, `og:type: "website"` untuk halaman lain, `og:image` (placeholder: banner statis 1200x630)                                                 | ✅         | 2026-05-05 |
| TASK-024 | Implementasi Twitter Card tags: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`                                                                                                                                                                 | ✅         | 2026-05-05 |
| TASK-025 | Buat banner image statis `public/images/og-banner.png` — 1200x630px, desain merah-putih dengan teks "Pancasila & UUD 1945" untuk digunakan sebagai default og:image                                                                                                     | ✅         | 2026-05-05 |

### Implementation Phase 3.4 — SEO: JSON-LD Structured Data

- GOAL-004: Mengimplementasikan JSON-LD Structured Data untuk meningkatkan rich
  results di Google Search dan mendukung business goal SEO ranking halaman 1.

| Task     | Description                                                                                                                                                                     | Completed | Date       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-026 | Buat `src/utils/jsonld.js` — fungsi `injectJsonLd(schema)` yang inject `<script type="application/ld+json">` ke `<head>`, dan `removeJsonLd()` untuk cleanup saat route berubah | ✅         | 2026-05-05 |
| TASK-027 | Implementasi `createWebPageSchema({ name, description, url })` — schema `WebPage` untuk halaman statis (Pancasila, Pembukaan, Bab Pasal, dll)                                   | ✅         | 2026-05-05 |
| TASK-028 | Implementasi `createArticleSchema({ headline, description, url, dateModified })` — schema `Article` untuk halaman detail pasal (`/pasal/:nomor`)                                | ✅         | 2026-05-05 |
| TASK-029 | Implementasi `createBreadcrumbSchema(items)` — schema `BreadcrumbList` untuk halaman detail: `Home > Pasal > Pasal 7A`                                                          | ✅         | 2026-05-05 |
| TASK-030 | Integrasikan JSON-LD di route handlers: `/pasal/:nomor` inject Article + Breadcrumb, `/` dan `/pancasila` inject WebPage + Breadcrumb, halaman lain inject WebPage              | ✅         | 2026-05-05 |
| TASK-031 | Tambahkan `WebSite` schema dengan `SearchAction` di `index.html` (sitewide): `"@type": "SearchAction"`, `"target": "https://[BASE_URL]/cari?q={search_term_string}"`            | ✅         | 2026-05-05 |

### Implementation Phase 3.5 — Sitemap & robots.txt

- GOAL-005: Mengimplementasikan sitemap.xml yang dihasilkan otomatis saat build time
  dan robots.txt yang benar untuk crawling mesin pencari.

| Task     | Description                                                                                                                                                                                            | Completed | Date       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ---------- |
| TASK-032 | Buat `scripts/generate-sitemap.js` — Node.js script yang membaca 7 JSON data, generate semua URL dinamis (per pasal, per sila, per bab), dan output `public/sitemap.xml` sebelum proses build          | ✅         | 2026-05-05 |
| TASK-033 | Daftar URL statis di sitemap: `/`, `/pancasila`, `/butir-pancasila`, `/pembukaan`, `/pasal`, `/bab-pasal`, `/uud-asli`, `/amandemen`, `/tentang`                                                       | ✅         | 2026-05-05 |
| TASK-034 | Daftar URL dinamis di sitemap: `/sila/1`–`/sila/5`, `/pasal/[semua nomor pasal]`, `/bab-pasal/1`–`/bab-pasal/21`                                                                                       | ✅         | 2026-05-05 |
| TASK-035 | Set `<priority>` dan `<changefreq>` per URL: homepage `1.0 monthly`, konten `0.8 monthly`, `/cari` dikecualikan dari sitemap                                                                           | ✅         | 2026-05-05 |
| TASK-036 | Tambahkan script `generate-sitemap` ke `package.json` dan integrasi ke `prebuild`: `"prebuild": "node scripts/generate-sitemap.js"` agar `public/sitemap.xml` tersedia sebelum `vite build` dijalankan | ✅         | 2026-05-05 |
| TASK-037 | Buat `public/robots.txt`: `User-agent: *`, `Disallow: /cari`, `Allow: /`, `Sitemap: https://[BASE_URL]/sitemap.xml` (ganti BASE_URL dengan domain production)                                          | ✅         | 2026-05-05 |

### Implementation Phase 3.6 — Google Analytics 4

- GOAL-006: Mengintegrasikan Google Analytics 4 untuk tracking page views dan events,
  dengan mode anonim yang mematuhi privasi pengguna.

| Task     | Description                                                                                                                                                     | Completed | Date |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-038 | Tambahkan Google Analytics 4 `gtag.js` script ke `index.html` dengan Measurement ID dari environment variable: `GA_MEASUREMENT_ID` (via Vite `import.meta.env`) |           |      |
| TASK-039 | Buat `src/utils/analytics.js` — wrapper functions: `trackPageView(path)`, `trackEvent(category, action, label)`                                                 |           |      |
| TASK-040 | Panggil `trackPageView(path)` di setiap route navigation di router                                                                                              |           |      |
| TASK-041 | Implementasi event tracking: `trackEvent('share', 'click', pagePath)` saat share button diklik                                                                  |           |      |
| TASK-042 | Implementasi event tracking: `trackEvent('search', 'query', query)` saat hasil pencarian muncul                                                                 |           |      |
| TASK-043 | Implementasi event tracking: `trackEvent('navigation', 'tab_click', tabName)` saat tab diklik                                                                   |           |      |
| TASK-044 | Pastikan analytics hanya aktif di production build (bukan development): `if (import.meta.env.PROD)`                                                             |           |      |

### Implementation Phase 3.7 — Performa & Bundle Optimization

- GOAL-007: Memastikan bundle JavaScript gzipped < 200KB dan semua Lighthouse
  Performance thresholds terpenuhi.

| Task     | Description                                                                                                                                                   | Completed | Date |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-045 | Jalankan `vite build` dan analisis bundle size dengan `npx vite-bundle-visualizer` atau `rollup-plugin-visualizer`                                            |           |      |
| TASK-046 | Implementasi dynamic import untuk page modules: `const { PasalDetailPage } = await import('./pages/PasalDetailPage.js')` — hanya load halaman saat dibutuhkan |           |      |
| TASK-047 | Konfigurasi `vite.config.js` untuk code splitting: setiap halaman sebagai chunk terpisah                                                                      |           |      |
| TASK-048 | Verifikasi total bundle < 200KB gzipped (Bootstrap ~30KB + Fuse.js ~10KB + app code ~50KB = estimasi ~90KB)                                                   |           |      |
| TASK-049 | Tambahkan `<link rel="preconnect">` untuk Google Fonts dan `<link rel="dns-prefetch">`                                                                        |           |      |
| TASK-050 | Implementasi `loading="lazy"` pada semua gambar (jika ada)                                                                                                    |           |      |
| TASK-051 | Pastikan tidak ada render-blocking CSS atau JS di critical path                                                                                               |           |      |

### Implementation Phase 3.8 — Aksesibilitas & Polish

- GOAL-008: Memenuhi semua aksesibilitas requirements (WCAG 2.1 AA, Lighthouse A≥90)
  dan melakukan visual polish final sebelum launch.

| Task     | Description                                                                                                             | Completed | Date |
| -------- | ----------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-052 | Jalankan Axe accessibility audit (via Playwright atau browser extension) pada semua halaman utama                       |           |      |
| TASK-053 | Fix semua Axe violations: missing `alt` text, incorrect heading hierarchy, missing ARIA labels                          |           |      |
| TASK-054 | Verifikasi keyboard navigation: Tab key berpindah di semua elemen interaktif dengan `:focus-visible` yang terlihat      |           |      |
| TASK-055 | Verifikasi kontras warna semua teks memenuhi WCAG AA (4.5:1) menggunakan Chrome DevTools                                |           |      |
| TASK-056 | Implementasi `prefers-reduced-motion` — semua animasi/transisi dihentikan jika user mengaktifkan reduced motion         |           |      |
| TASK-057 | Verifikasi semua gambar/ikon memiliki `aria-label` atau `alt` text yang deskriptif                                      |           |      |
| TASK-058 | Verifikasi semantik HTML: `<nav>`, `<main>`, `<header>`, `<article>`, `<section>` digunakan dengan benar                |           |      |
| TASK-059 | Visual regression test: buat baseline screenshots di 4 breakpoint (375px, 768px, 1024px, 1440px) menggunakan Playwright |           |      |

### Implementation Phase 3.9 — Lighthouse CI Final Audit

- GOAL-009: Menjalankan Lighthouse CI audit dan memastikan semua 4 scores terpenuhi
  sebelum Phase 4 dimulai.

| Task     | Description                                                                                 | Completed | Date |
| -------- | ------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-060 | Jalankan `npm run build && npm run preview` lalu Lighthouse audit manual di Chrome DevTools |           |      |
| TASK-061 | Fix semua isu Performance: lazy loading, code splitting, resource hints                     |           |      |
| TASK-062 | Fix semua isu Accessibility: ARIA, kontras, keyboard nav, semantic HTML                     |           |      |
| TASK-063 | Fix semua isu SEO: meta tags, canonical URLs, robots.txt, sitemap                           |           |      |
| TASK-064 | Fix semua isu PWA: manifest, icons, HTTPS, Service Worker                                   |           |      |
| TASK-065 | Verifikasi Lighthouse CI pass di GitHub Actions (semua 4 scores memenuhi threshold)         |           |      |

### Implementation Phase 3.10 — Testing Phase 3

- GOAL-010: Memastikan semua fitur Phase 3 teruji dengan test otomatis sebelum launch.

| Task     | Description                                                                                                                  | Completed | Date |
| -------- | ---------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-066 | E2E test PWA: Service Worker ter-register, manifest valid (Playwright)                                                       |           |      |
| TASK-067 | E2E test offline: aktifkan offline mode, semua 14 route masih bisa diakses (Playwright)                                      |           |      |
| TASK-068 | E2E test share: klik tombol bagikan di halaman pasal, verifikasi Web Share API dipanggil (Playwright + mock navigator.share) |           |      |
| TASK-069 | E2E test share fallback: clipboard copy berhasil di browser yang tidak support Web Share API                                 |           |      |
| TASK-070 | E2E test SEO: buka `/pasal/1`, verifikasi `<title>` dan `<meta name="description">` berisi konten pasal (Playwright)         |           |      |
| TASK-071 | E2E test JSON-LD: buka `/pasal/1`, verifikasi `<script type="application/ld+json">` ada dan valid                            |           |      |
| TASK-072 | E2E test sitemap: buka `/sitemap.xml`, verifikasi berisi URL yang benar dan valid XML                                        |           |      |
| TASK-073 | E2E test robots.txt: buka `/robots.txt`, verifikasi `Disallow: /cari` ada                                                    |           |      |
| TASK-074 | Lighthouse CI pass di CI pipeline (Performance≥90, Accessibility≥90, SEO≥95, PWA≥80)                                         |           |      |

---

## 3. Alternatives

- **ALT-001**: Menulis manual `public/sw.js` tanpa `vite-plugin-pwa` — tidak dipilih karena
  meningkatkan maintenance cost, rawan kesalahan cache invalidation, dan tidak terintegrasi
  native dengan pipeline build Vite
- **ALT-002**: Pre-rendering SPA dengan `vite-plugin-prerender` — tidak dipilih untuk v1 karena
  scope yang disetujui adalah SPA + dynamic meta tags; pre-rendering dicatat sebagai backlog v2
- **ALT-003**: Menggunakan Google Tag Manager (GTM) — tidak dipilih karena menambah latency
  dan kompleksitas; `gtag.js` langsung lebih sederhana untuk analytics minimal
- **ALT-004**: Menggunakan `next-sitemap` atau plugin sitemap Vite — tidak dipilih karena
  custom script memberikan kontrol penuh atas URL dinamis dari data JSON

---

## 4. Dependencies

- **DEP-001**: Phase 2 selesai — semua 14 route berfungsi, deep link working
- **DEP-002**: HTTPS hosting (Vercel/Netlify) — wajib untuk Service Worker dan PWA
- **DEP-003**: Google Analytics 4 Measurement ID — perlu dibuat di Google Analytics console
- **DEP-004**: Domain / BASE_URL yang sudah dikonfirmasi — untuk canonical URLs, sitemap, robots.txt
- **DEP-005**: App icon assets (PNG) — perlu dibuat sebelum TASK-008
- **DEP-006**: OG banner image — perlu dibuat sebelum TASK-025
- **DEP-007**: Google Forms URLs untuk koreksi dan saran — sudah ada dari PRD
- **DEP-008**: `vite-plugin-pwa` — sudah diinstall di Phase 1 dan digunakan sebagai integrasi PWA resmi di Vite

---

## 5. Files

File baru yang dibuat di Phase 3:

- **FILE-001**: `public/icons/` — semua ukuran app icon (192, 512, 180, 32)
- **FILE-002**: `public/images/og-banner.png` — OG image default 1200x630
- **FILE-003**: `public/robots.txt` — robots.txt
- **FILE-004**: `src/utils/seo.js` — `updateMetaTags()` utility
- **FILE-005**: `src/utils/jsonld.js` — JSON-LD inject/remove utilities
- **FILE-006**: `src/utils/share.js` — Web Share API + Clipboard fallback
- **FILE-007**: `src/utils/analytics.js` — GA4 wrapper functions
- **FILE-008**: `src/components/ShareButton.js` — komponen tombol bagikan
- **FILE-009**: `src/components/OfflineIndicator.js` — indikator status offline/online
- **FILE-010**: `scripts/generate-sitemap.js` — sitemap generator script
- **FILE-011**: `tests/e2e/pwa.spec.js` — E2E tests PWA
- **FILE-012**: `tests/e2e/share.spec.js` — E2E tests sharing
- **FILE-013**: `tests/e2e/seo.spec.js` — E2E tests SEO meta tags

File yang dimodifikasi di Phase 3:

- **FILE-014**: `index.html` — tambah Apple meta tags, GA4 script, dan WebSite JSON-LD
- **FILE-015**: `src/main.js` — registrasi SW via `virtual:pwa-register` dan listener status jaringan
- **FILE-016**: `src/router/routes.js` — panggil `updateMetaTags()` dan `injectJsonLd()` di setiap route
- **FILE-017**: `src/components/AppLayout.js` — mount `OfflineIndicator` secara global
- **FILE-018**: `src/pages/PasalDetailPage.js` — integrasi ShareButton dan JSON-LD Article
- **FILE-019**: `src/pages/SilaDetailPage.js` — integrasi ShareButton
- **FILE-020**: `src/pages/PembukaanPage.js` — integrasi ShareButton
- **FILE-021**: `src/pages/ButirPancasilaPage.js` — integrasi ShareButton level halaman
- **FILE-022**: `package.json` — tambah `generate-sitemap` ke `prebuild`
- **FILE-023**: `vite.config.js` — konfigurasi `VitePWA`, manifest, Workbox caching, dan code splitting
- **FILE-024**: `lighthouserc.json` — update thresholds

---

## 6. Testing

- **TEST-001**: E2E — service worker hasil `vite-plugin-pwa` ter-register dan cache assets berjalan (Playwright)
- **TEST-002**: E2E — Offline mode semua halaman berfungsi (Playwright + network throttle)
- **TEST-003**: E2E — `manifest.json` hasil build valid dan aplikasi memenuhi installability criteria (Chrome DevTools audit)
- **TEST-004**: E2E — Web Share API dipanggil saat share button klik (Playwright + mock)
- **TEST-005**: E2E — Clipboard API fallback berfungsi (Playwright)
- **TEST-006**: E2E — Meta title dan description unik per route (Playwright)
- **TEST-007**: E2E — JSON-LD ada dan valid di halaman pasal (Playwright)
- **TEST-008**: E2E — sitemap.xml berisi semua URL yang benar (Playwright)
- **TEST-009**: E2E — robots.txt berisi `Disallow: /cari` (Playwright)
- **TEST-010**: Lighthouse CI — Performance≥90, Accessibility≥90, SEO≥95, PWA≥80 (GitHub Actions)

---

## 7. Risks & Assumptions

- **RISK-001**: Konfigurasi `navigateFallback` Workbox berpotensi konflik dengan SPA routing
  — **Mitigasi**: Test menyeluruh semua 14 route dalam mode offline sebelum Phase 4
- **RISK-002**: Lighthouse SEO < 95 karena SPA tidak pre-render
  — **Mitigasi**: `updateMetaTags()` dipanggil pada setiap route change; jika target belum tercapai,
  catat pre-rendering sebagai pekerjaan v2 terpisah setelah launch v1
- **RISK-003**: Bundle size melebihi 200KB setelah semua fitur ditambahkan
  — **Mitigasi**: Dynamic import dan code splitting di TASK-046–TASK-048
- **RISK-004**: GA4 Measurement ID tidak tersedia saat development Phase 3
  — **Mitigasi**: Gunakan ID dummy di dev; pastikan ID production ada sebelum Phase 4
- **ASSUMPTION-001**: Domain/BASE_URL sudah dikonfirmasi sebelum TASK-032 (sitemap)
- **ASSUMPTION-002**: App icons akan dibuat oleh developer atau designer sebelum TASK-008
- **ASSUMPTION-003**: Google bisa render JavaScript untuk indexing (sudah terkonfirmasi oleh Google)

---

## 8. Related Specifications / Further Reading

- [PRD: Pancasila & UUD 1945 Web App](../prd_pasaluud1945_webapp.md) — F-09, F-13, §7.2 Business Goals SEO
- [Spesifikasi Arsitektur](../spec/spec-architecture-pasaluud1945-webapp.md) — §5.4 PWA, §6.5 PWA Checklist, §9.2 Service Worker
- [Spesifikasi SEO & Metadata](../spec/spec-seo-pasaluud1945.md) — meta tags per route, JSON-LD templates, sitemap strategy
- [Spesifikasi Design System & UI/UX](../spec/spec-design-uiux-pasaluud1945.md) — §6.1 Visual Testing, §6.2 Accessibility Testing
- [Spesifikasi Process Workflow](../spec/spec-process-workflow-pasaluud1945.md) — §3.4 Quality Gates, §8.3 Lighthouse CI config
- [Master Plan](./architecture-overview-pasaluud1945-1.md)
- [Phase 2 Plan](./feature-phase2-konten-pencarian-1.md)
- [Web Share API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API)
- [Progressive Web App Checklist — web.dev](https://web.dev/pwa-checklist/)
- [JSON-LD Structured Data — Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
