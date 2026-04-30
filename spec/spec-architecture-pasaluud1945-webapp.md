---
title: Spesifikasi Teknis Aplikasi Web Pancasila & UUD 1945
version: 1.0.0
date_created: 2026-04-28
last_updated: 2026-04-29
owner: Development Team
status: final
tags:
  - architecture
  - webapp
  - pwa
  - frontend
  - specification
---
<!-- markdownlint-disable -->

# 1. Introduction

## 1.1 Purpose & Scope

Dokumen ini merupakan spesifikasi teknis untuk pengembangan aplikasi web **Pancasila & UUD 1945** berdasarkan *Product Requirements Document (PRD)* v1.0.0. Spesifikasi ini mendefinisikan arsitektur sistem, kontrak data, antarmuka, kebutuhan teknis, dan kriteria penerimaan yang harus dipenuhi dalam implementasi.

**Scope:**

- Migrasi konten dari 7 file JSON assets aplikasi Android ke aplikasi web statis
- Implementasi Progressive Web App (PWA) dengan dukungan offline penuh
- Deep linking dan shareable URL untuk setiap konten (Sila, Pasal, Bab, dsb.)
- Pencarian real-time client-side pada seluruh pasal UUD 1945
- Tampilan responsif untuk mobile, tablet, dan desktop
- Optimasi SEO untuk indeksasi mesin pencari

**Target Audience:**

- Frontend Developer (implementasi)
- UI/UX Designer (referensi constraint dan behaviour)
- QA Engineer (referensi acceptance criteria dan test strategy)

---

## 2. Definitions

| Istilah            | Definisi                                                                                                   |
| ------------------ | ---------------------------------------------------------------------------------------------------------- |
| **PWA**            | Progressive Web App — aplikasi web yang dapat diinstal dan berfungsi secara offline melalui Service Worker |
| **SSG**            | Static Site Generation — proses prerender halaman HTML statis pada saat build time                         |
| **SPA**            | Single Page Application — aplikasi web yang berinteraksi tanpa page reload penuh                           |
| **Deep Link**      | URL spesifik yang mengarah langsung ke konten tertentu (misal: `/pasal/7A`)                                |
| **Service Worker** | Script yang berjalan di background browser untuk caching dan fungsi offline                                |
| **Web Share API**  | API native browser untuk berbagi konten ke aplikasi lain                                                   |
| **Debounce**       | Teknik penundaan eksekusi fungsi sampai user berhenti mengetik dalam jeda waktu tertentu                   |
| **LCP**            | Largest Contentful Paint — metrik Core Web Vital untuk kecepatan render konten utama                       |
| **CLS**            | Cumulative Layout Shift — metrik stabilitas layout saat halaman dimuat                                     |
| **INP**            | Interaction to Next Paint — metrik Core Web Vitals untuk responsivitas interaksi pengguna (menggantikan FID sejak Maret 2024) |
| **Fuse.js**        | Library pencarian fuzzy (approximate string matching) berbasis client-side                                 |
| **JSON**           | JavaScript Object Notation — format data teks yang digunakan untuk semua konten aplikasi                   |

---

## 3. Requirements, Constraints & Guidelines

### 3.1 Functional Requirements

- **REQ-001**: Aplikasi harus menampilkan 5 Sila Pancasila dengan nomor urut dan teks lengkap
- **REQ-002**: Aplikasi harus menampilkan butir-butir pengamalan Pancasila per sila dengan kemampuan expand/collapse
- **REQ-003**: Aplikasi harus menampilkan 4 alinea Pembukaan UUD 1945 secara berurutan
- **REQ-004**: Aplikasi harus menampilkan daftar dan isi lengkap Pasal UUD 1945 pasca-amandemen (Pasal 1–37)
- **REQ-005**: Aplikasi harus menyediakan navigasi hierarki Berdasarkan 21 Bab UUD 1945
- **REQ-006**: Aplikasi harus menampilkan Pasal UUD 1945 versi asli sebelum amandemen
- **REQ-007**: Aplikasi harus menampilkan keterangan amandemen (I–IV) pada pasal yang diamandemen
- **REQ-008**: Aplikasi harus menyediakan fitur pencarian real-time dengan debounce pada seluruh isi pasal
- **REQ-009**: Aplikasi harus mendukung berbagi konten via Web Share API atau fallback Clipboard API
- **REQ-010**: Setiap konten harus memiliki URL unik yang dapat di-bookmark dan dibagikan
- **REQ-011**: Aplikasi harus menyediakan tautan ke formulir Google Forms untuk koreksi pasal dan saran masukan
- **REQ-012**: Aplikasi harus menyediakan halaman informasi tentang aplikasi
- **REQ-013**: Aplikasi harus dapat diakses secara offline setelah kunjungan pertama (PWA)
- **REQ-014**: Aplikasi harus responsif pada breakpoint mobile (320px+), tablet (768px+), dan desktop (1024px+)

### 3.2 Non-Functional Requirements

- **REQ-015**: Initial bundle JavaScript harus < 200KB (gzipped)
- **REQ-016**: Lighthouse Performance Score >= 90
- **REQ-017**: Lighthouse Accessibility Score >= 90
- **REQ-018**: Lighthouse SEO Score >= 95
- **REQ-019**: Lighthouse PWA Score >= 80
- **REQ-020**: LCP < 2.5 detik pada koneksi 4G
- **REQ-021**: CLS < 0.1
- **REQ-022**: Time to Interactive (TTI) < 3 detik
- **REQ-023**: 100% konten dapat diakses offline setelah kunjungan pertama

### 3.3 Constraints

- **CON-001**: Tidak ada backend API — seluruh data bersifat statis dari file JSON lokal
- **CON-002**: Tidak ada fitur login/autentikasi pengguna
- **CON-003**: Tidak ada database server-side
- **CON-004**: Browser target: Chrome 90+, Firefox 90+, Safari 14+, Edge 90+
- **CON-005**: Semua data pribadi pengguna harus tetap di perangkat (tidak ada tracking selain analytics anonim)
- **CON-006**: Aplikasi harus tetap fungsional meskipun Web Share API tidak tersedia (graceful degradation)
- **CON-007**: Service Worker tidak boleh caching data pribadi atau sensitif

### 3.4 Guidelines

- **GUD-001**: Gunakan semantic HTML untuk aksesibilitas dan SEO
- **GUD-002**: Implementasikan lazy loading untuk komponen non-kritis
- **GUD-003**: Gunakan `aria-label` dan `role` yang tepat pada elemen interaktif
- **GUD-004**: Pastikan kontras warna memenuhi WCAG 2.1 AA (rasio minimal 4.5:1)
- **GUD-005**: Gunakan format WebP/SVG untuk semua aset gambar
- **GUD-006**: Implementasikan `prefers-reduced-motion` untuk animasi
- **GUD-007**: Gunakan TypeScript strict mode untuk type safety
- **GUD-008**: Kode harus mengikuti prinsip Clean Code dan Clean Architecture

---

## 4. Interfaces & Data Contracts

### 4.1 Data Schema (JSON Contracts)

Semua data konten berasal dari 7 file JSON yang dimigrasi dari aplikasi Android. Struktur schema harus dipertahankan agar kompatibel dengan data existing.

#### 4.1.1 `silapancasila.json`

```typescript
interface SilaPancasilaData {
  data: string[]; // Array 5 elemen, masing-masing adalah teks lengkap sila
}
```

**Contoh:**

```json
{
  "data": [
    "Ketuhanan Yang Maha Esa.",
    "Kemanusiaan Yang Adil Dan Beradab.",
    "Persatuan Indonesia.",
    "Kerakyatan Yang Dipimpin Oleh Hikmat Kebijaksanaan Dalam Permusyawaratan/Perwakilan.",
    "Keadilan Sosial Bagi Seluruh Rakyat Indonesia."
  ]
}
```

#### 4.1.2 `butir_pancasila.json`

```typescript
interface ButirPancasilaItem {
  isi: string;
}

interface ButirPancasilaData {
  data: {
    namasila: string;     // Format: "Sila 1" s.d. "Sila 5"
    arrayisi: ButirPancasilaItem[];
  }[];
}
```

#### 4.1.3 `pembukaanuud.json`

```typescript
interface PembukaanUUDData {
  data: string[]; // Array 4 elemen, masing-masing adalah alinea
}
```

#### 4.1.4 `pasaluud45.json` (Pasca-Amandemen)

```typescript
interface PasalUUDItem {
  namapasal: string;    // Format: "Pasal 1", "Pasal 6A", dsb.
  arrayisi: { isi: string }[];
}

interface PasalUUDData {
  data: PasalUUDItem[];
}
```

#### 4.1.5 `pasaluud45noamandemen.json` (Asli Sebelum Amandemen)

```typescript
interface PasalUUDNoAmandemenItem {
  namapasal: string;
  babpasal: string;     // Contoh: "Bab I Bentuk dan Kedaulatan"
  arrayisi: { isi: string }[];
}

interface PasalUUDNoAmandemenData {
  data: PasalUUDNoAmandemenItem[];
}
```

#### 4.1.6 `pasaluud45_ket_amandemen.json` (Keterangan Amandemen)

```typescript
interface PasalUUDKetAmandemenItem {
  namapasal: string;
  babpasal: string;
  amandemen: string;    // "0", "1", "2", "3", "4", "1/2", "3/4", dsb.
  arrayisi: { isi: string }[];
}

interface PasalUUDKetAmandemenData {
  data: PasalUUDKetAmandemenItem[];
}
```

#### 4.1.7 `babpasal.json`

```typescript
interface BabPasalItem {
  nama_bab: string;     // Contoh: "Bab I", "BAB II", "Bab III"
  isi_bab: string[];    // Contoh: ["Pasal 1"], ["Pasal 2", "Pasal 3"]
}

interface BabPasalData {
  bab_pasal: string[];              // Nama bab lengkap
  keterangan_bab_pasal: string[];   // Keterangan singkat bab
  isi_bab_pasal: BabPasalItem[];
}
```

### 4.2 Routing Interface

Aplikasi menggunakan client-side routing dengan URL yang bersifat shareable dan deep-linkable.

| Route              | Konten                                             | Parameter                        |
| ------------------ | -------------------------------------------------- | -------------------------------- |
| `/`                | Halaman utama / Landing page dengan navigasi ke 7 konten utama | —                                |
| `/pancasila`       | Daftar 5 Sila Pancasila                            | —                                |
| `/sila/:nomor`     | Detail dan Butir-butir Sila tertentu               | `nomor`: `1` s.d. `5`            |
| `/butir-pancasila` | Butir-butir Pancasila per Sila (semua sila)        | —                                |
| `/pembukaan`       | 4 Alinea Pembukaan UUD 1945                        | —                                |
| `/pasal`           | Daftar semua Pasal UUD 1945                        | —                                |
| `/pasal/:nomor`    | Detail isi Pasal tertentu                          | `nomor`: `1`, `6A`, `7B`, dsb.   |
| `/bab-pasal`       | Navigasi 21 Bab UUD 1945 (semua bab)               | —                                |
| `/bab-pasal/:nomor`| Navigasi langsung ke Bab tertentu                  | `nomor`: `1` s.d. `21`           |
| `/uud-asli`        | Daftar Pasal UUD 1945 versi asli                   | —                                |
| `/amandemen`       | Daftar Pasal dengan keterangan amandemen           | —                                |
| `/cari`            | Halaman pencarian                                  | `q`: query string (optional)     |
| `/tentang`         | Halaman informasi aplikasi                         | —                                |
| `*`                | Halaman 404 Not Found                              | —                                |

### 4.3 API Interfaces

#### 4.3.1 Web Share API

```typescript
interface ShareData {
  title: string;
  text: string;
  url: string;
}

// Usage
if (navigator.share) {
  await navigator.share(shareData);
}
```

**Constraint:** Hanya tersedia pada secure context (HTTPS) dan browser yang mendukung.

#### 4.3.2 Clipboard API

```typescript
interface ClipboardAPI {
  writeText(data: string): Promise<void>;
}

// Fallback untuk browser tanpa Web Share API
await navigator.clipboard.writeText(shareText);
```

#### 4.3.3 Service Worker API

```typescript
// Register service worker untuk PWA dan caching
if ('serviceWorker' in navigator) {
  await navigator.serviceWorker.register('/sw.js');
}
```

**Catatan v1**: Registrasi Service Worker dikelola secara otomatis oleh `vite-plugin-pwa` (Workbox). Developer tidak perlu memanggil `navigator.serviceWorker.register()` secara manual.
```

---

## 5. Acceptance Criteria

### 5.1 Konten dan Navigasi

- **AC-001**: Given pengguna membuka `/pancasila`, When halaman dimuat, Then sistem menampilkan 5 Sila Pancasila dengan nomor urut 1–5 dan teks lengkap masing-masing sila
- **AC-002**: Given pengguna membuka `/butir-pancasila`, When halaman dimuat, Then sistem menampilkan daftar butir per sila dengan kemampuan expand/collapse, dan jumlah butir per sila akurat
- **AC-003**: Given pengguna membuka `/pembukaan`, When halaman dimuat, Then keempat alinea ditampilkan berurutan dengan label "Alinea 1" s.d. "Alinea 4"
- **AC-004**: Given pengguna membuka `/pasal`, When halaman dimuat, Then daftar seluruh pasal (Pasal 1 s.d. Pasal 37) ditampilkan
- **AC-005**: Given pengguna mengklik "Pasal 7A" pada daftar pasal, When navigasi berlangsung, Then halaman `/pasal/7A` menampilkan isi lengkap Pasal 7A beserta ayat-ayatnya
- **AC-006**: Given pengguna membuka `/bab-pasal`, When halaman dimuat, Then 21 Bab ditampilkan dengan daftar pasal di dalamnya, dan Bab dapat di-expand/collapse
- **AC-007**: Given pengguna membuka `/uud-asli`, When halaman dimuat, Then daftar pasal versi asli ditampilkan dengan filter berdasarkan Bab
- **AC-008**: Given pengguna membuka `/amandemen`, When halaman dimuat, Then daftar pasal yang diamandemen ditampilkan beserta keterangan amandemen I–IV

### 5.2 Pencarian

- **AC-009**: Given pengguna mengetik "kedaulatan" di input pencarian, When debounce 300ms tercapai, Then hasil pencarian menampilkan semua pasal yang mengandung kata "kedaulatan" dengan cuplikan teks dan highlight kata kunci
- **AC-010**: Given pencarian tidak menemukan hasil, When hasil ditampilkan, Then sistem menampilkan pesan "Tidak ada pasal yang mengandung kata kunci tersebut"
- **AC-011**: Given pengguna mengklik hasil pencarian, When navigasi berlangsung, Then pengguna diarahkan ke detail pasal yang dimaksud
- **AC-012**: Given URL `/cari?q=kedaulatan` dibuka langsung, When halaman dimuat, Then input pencarian terisi "kedaulatan" dan hasil pencarian langsung ditampilkan

### 5.3 Berbagi dan Deep Link

- **AC-013**: Given pengguna berada di detail Pasal 5, When menekan tombol "Bagikan", Then pada perangkat mobile yang mendukung Web Share API, native share sheet muncul dengan judul, teks, dan URL pasal
- **AC-014**: Given perangkat tidak mendukung Web Share API, When tombol "Bagikan" ditekan, Then opsi "Salin Tautan" dan "Salin Teks" ditampilkan
- **AC-015**: Given pengguna membuka URL `/pasal/7A` langsung di browser baru, When halaman dimuat, Then konten Pasal 7A langsung ditampilkan tanpa navigasi dari halaman utama
- **AC-016**: Given URL `/pasal/999` dibuka (pasal tidak ada), When halaman dimuat, Then halaman 404 informatif ditampilkan

### 5.4 PWA dan Offline

- **AC-017**: Given pengguna pertama kali mengakses aplikasi dengan koneksi internet, When seluruh konten dimuat, Then Service Worker meng-cache seluruh assets dan data JSON
- **AC-018**: Given pengguna mengaktifkan mode offline, When mengakses aplikasi kembali, Then seluruh konten tetap dapat diakses termasuk fitur pencarian
- **AC-019**: Given pengguna mengakses dari perangkat mobile, When memenuhi kriteria PWA, Then browser menampilkan prompt "Add to Home Screen"
- **AC-020**: Given aplikasi diinstal ke home screen, When dibuka, Then aplikasi berjalan dalam standalone mode tanpa address bar

### 5.5 Responsif dan Aksesibilitas

- **AC-021**: Given pengguna mengakses dari perangkat mobile (lebar 375px), When halaman dimuat, Then layout menyesuaikan, teks terbaca, dan tidak ada scroll horizontal
- **AC-022**: Given pengguna menggunakan screen reader, When berada di halaman konten, Then elemen-elemen utama memiliki label ARIA yang tepat
- **AC-023**: Given pengguna menavigasi dengan keyboard (Tab), When fokus berpindah, Then outline fokus terlihat jelas pada semua elemen interaktif
- **AC-024**: Given pengguna mengakses dari desktop (lebar 1440px), When halaman dimuat, Then layout menampilkan sidebar navigasi dan konten utama secara side-by-side

### 5.6 Homepage & Offline Indicator

- **AC-025**: Given pengguna membuka `/`, When halaman dimuat, Then landing page menampilkan navigasi ke minimal 7 konten utama (Pancasila, Butir Pancasila, Pembukaan UUD, Daftar Pasal, Bab Pasal, UUD Asli, Amandemen)
- **AC-026**: Given perangkat dalam mode offline setelah kunjungan pertama, When status koneksi terputus, Then komponen `OfflineIndicator` menampilkan notifikasi yang visible pada semua halaman
- **AC-027**: Given pengguna mengakses halaman manapun selain `/tentang`, When halaman dimuat, Then tidak ada tautan atau tombol Google Forms yang muncul

---

## 6. Test Automation Strategy

### 6.1 Test Levels

| Level                 | Scope                                                        | Tools                            |
| --------------------- | ------------------------------------------------------------ | -------------------------------- |
| **Unit Test**         | Fungsi utilitas (pencarian, formatting, URL parsing, router) | Vitest                           |
| **Component Test**    | Render dan interaksi komponen UI individual (DOM)            | Vitest + @vitest/browser         |
| **Integration Test**  | Alur navigasi, pencarian, dan berbagi                        | Playwright                       |
| **E2E Test**          | Skenario lengkap dari landing sampai detail pasal            | Playwright                       |
| **Visual Regression** | Perbandingan screenshot antar versi                          | Playwright + Argos CI (opsional) |
| **Performance Test**  | Lighthouse CI untuk Core Web Vitals                          | Lighthouse CI                    |

### 6.2 Framework dan Tools

- **Test Runner**: Vitest (kompatibel dengan Vite, support ESM native, dan browser testing)
- **Browser Testing**: Playwright (cross-browser compatibility: Chrome, Firefox, Safari, Edge)
- **E2E Testing**: Playwright (full user journey testing, mobile emulation, PWA testing)
- **Performance**: Lighthouse CI (automasi audit pada setiap PR)
- **Coverage**: `v8` coverage provider dengan threshold minimum:
  - Statements: 80%
  - Branches: 75%
  - Functions: 80%
  - Lines: 80%

**Catatan**: Tidak menggunakan React Testing Library karena proyek menggunakan Vanilla JavaScript. Testing komponen DOM menggunakan native DOM API dan Vitest browser mode.

### 6.3 Test Data Management

- Gunakan fixture files untuk mock data JSON (salinan dari assets asli)
- Setiap test menggunakan data fixture yang immutable
- Cleanup otomatis via `beforeEach` / `afterEach` hooks

### 6.4 CI/CD Integration

- **Pull Request**: Unit tests, component tests, dan Lighthouse audit otomatis
- **Main Branch**: Full E2E test suite + Lighthouse CI + deployment ke staging
- **Pre-deployment**: Manual smoke test pada perangkat mobile dan desktop

### 6.5 PWA Testing Checklist

- [ ] Service Worker ter-register dengan benar
- [ ] Manifest JSON valid dan lengkap
- [ ] Aplikasi dapat diinstal (manifest meets installability criteria)
- [ ] Offline mode berfungsi (network throttling ke "Offline" di DevTools)
- [ ] Splash screen dan icons tampil pada instalasi

---

## 7. Rationale & Context

### 7.1 Pemilihan Tech Stack: Vanilla JavaScript + Vite + Bootstrap

Stack **Vanilla JavaScript + Vite + Bootstrap** dipilih untuk proyek ini karena:

- **Vanilla JavaScript (ES6+)**: Tidak menggunakan framework JS seperti React, Vue, atau Angular. seluruh logika aplikasi ditulis dalam JavaScript murni dengan modular architecture. Ini mengurangi bundle size, menghilangkan dependency overhead, dan memudahkan maintenance jangka panjang.
- **Vite**: Module bundler modern yang mendukung ESM native, hot module replacement (HMR) yang sangat cepat, dan konfigurasi yang simpel. ecosystem Vite yang luas memungkinkan integrasi dengan plugin-plugin untuk PWA, SSG, dan tool lainnya.
- **Bootstrap 5**: CSS framework yang sudah mature dan lengkap dengan komponen UI ready-use (navbar, cards, tabs, modals, forms). Responsive grid system-nya sudah teruji dan kompatibel dengan berbagai browser. Tidak perlu membuat CSS dari nol sehingga development lebih cepat.
- **Single Page Application (SPA)**: Dengan vanilla JS dan Vite, kita dapat mengimplementasikan client-side routing menggunakan `history.pushState` API tanpa perlu framework besar. Ini memberikan pengalaman navigasi yang smooth tanpa page reload.

### 7.2 Pemilihan Fuse.js untuk Pencarian

Fuse.js dipilih untuk client-side search karena:

- Library lightweight (~10KB gzipped) dan tidak memerlukan setup复杂
- Mendukung fuzzy search dan partial matching yang robust
- Tidak memerlukan indexing backend atau service eksternal
- Performa yang cukup untuk dataset < 500KB (37+ pasal dengan banyak ayat)
- Compatible dengan vanilla JavaScript module system

### 7.3 Pemilihan PWA Strategy

PWA diimplementasikan menggunakan **`vite-plugin-pwa`** yang secara otomatis men-generate Service Worker berbasis **Workbox** pada saat `vite build`. Pendekatan ini dipilih karena:

- **Zero manual Service Worker code**: Workbox mengurus caching strategy, cache versioning, dan update lifecycle secara otomatis
- **Native Vite integration**: Plugin terintegrasi langsung ke Vite build pipeline tanpa konfigurasi tambahan
- **Workbox strategies**: Mendukung `CacheFirst`, `NetworkFirst`, dan `StaleWhileRevalidate` per resource type
- **PWA manifest auto-injection**: `manifest.json` di-inject ke `index.html` secara otomatis

**Catatan**: Contoh manual Service Worker di §9.2 merupakan referensi untuk memahami konsep caching. Implementasi aktual menggunakan `vite-plugin-pwa` yang menghasilkan SW setara via Workbox.

---

## 8. Dependencies & External Integrations

### 8.1 External Systems

- **EXT-001**: Browser Client — Runtime environment utama; harus mendukung ES2020+, Service Worker, dan Clipboard API
- **EXT-002**: Hosting/CDN — Vercel/Netlify/Cloudflare Pages untuk serving static files dan SPA fallback (`index.html` untuk semua routes)

### 8.2 Third-Party Services

- **SVC-001**: Google Analytics 4 (GA4) — Tracking page views dan event clicks (share, search, navigation). Implementasi via `gtag.js` dengan mode anonim.
- **SVC-002**: Google Forms — Formulir koreksi pasal dan saran masukan (tautan eksternal)

### 8.3 Infrastructure Dependencies

- **INF-001**: HTTPS — Wajib untuk Service Worker registration, Web Share API, dan PWA installability
- **INF-002**: Static File Hosting — Server harus dikonfigurasi untuk SPA fallback (semua routes mengembalikan `index.html`)

### 8.4 Data Dependencies

- **DAT-001**: 7 File JSON Statis — Data konten aplikasi yang di-bundle bersama kode. Tidak ada dependency ke API eksternal.

### 8.5 Technology Platform Dependencies

- **PLT-001**: Node.js 20 LTS — Build environment requirement
- **PLT-002**: TypeScript 5.0+ — Bahasa utama untuk type safety (opsional, bisa plain JS)
- **PLT-003**: Vite 5.0+ — Module bundler dan dev server
- **PLT-004**: Bootstrap 5.3+ — CSS framework untuk UI components

### 8.6 Compliance Dependencies

- **COM-001**: GDPR/EPrivacy — Jika analytics digunakan, harus menyertakan cookie consent banner. Namun karena data statis dan tidak ada autentikasi, risiko privacy minimal.
- **COM-002**: WCAG 2.1 Level AA — Standard aksesibilitas web yang harus dipenuhi

---

## 9. Examples & Edge Cases

### 9.1 Contoh Implementasi Komponen Pencarian (Vanilla JS + Bootstrap)

```javascript
// Komponen Search: src/components/SearchPasal.js
import Fuse from 'fuse.js';
import { getPasalData } from '../data/loader.js';

export class SearchPasal {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.query = '';
    this.results = [];
    this.debounceTimer = null;
    this.fuse = null;

    this.init();
  }

  init() {
    const data = getPasalData();
    this.fuse = new Fuse(data, {
      keys: ['namapasal', 'arrayisi.isi'],
      threshold: 0.3,
      includeMatches: true,
    });
    this.render();
    this.bindEvents();
  }

  bindEvents() {
    const input = this.container.querySelector('#search-input');
    input.addEventListener('input', (e) => {
      this.query = e.target.value;
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => this.search(), 300);
    });
  }

  search() {
    if (!this.query.trim()) {
      this.results = [];
      this.renderResults();
      return;
    }
    this.results = this.fuse.search(this.query);
    this.renderResults();
  }

  render() {
    this.container.innerHTML = `
      <div class="mb-3">
        <div class="input-group">
          <span class="input-group-text bg-surface-variant border-0">
            <i class="bi bi-search text-secondary"></i>
          </span>
          <input
            type="search"
            id="search-input"
            class="form-control bg-surface-variant border-0"
            placeholder="Cari pasal UUD 1945..."
            aria-label="Cari pasal UUD 1945"
          />
        </div>
      </div>
      <div id="search-results" class="list-group"></div>
    `;
  }

  renderResults() {
    const resultsEl = this.container.querySelector('#search-results');
    if (this.results.length === 0 && this.query) {
      resultsEl.innerHTML = '<p class="text-secondary">Tidak ada pasal yang mengandung kata kunci tersebut</p>';
      return;
    }

    resultsEl.innerHTML = this.results.map(result => `
      <a href="/pasal/${result.item.namapasal.replace('Pasal ', '')}"
         class="list-group-item list-group-item-action">
        <strong>${result.item.namapasal}</strong>
        <p class="mb-0 text-secondary small">${result.item.arrayisi[0]?.isi.substring(0, 80)}...</p>
      </a>
    `).join('');
  }
}
```

### 9.2 Contoh Service Worker (PWA Vanilla JS)

```javascript
// public/sw.js - Service Worker untuk offline support
const CACHE_NAME = 'pasaluud1945-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/data/silapancasila.json',
  '/data/butir_pancasila.json',
  '/data/pembukaanuud.json',
  '/data/pasaluud45.json',
  '/data/pasaluud45noamandemen.json',
  '/data/pasaluud45_ket_amandemen.json',
  '/data/babpasal.json',
  '/assets/main.css',
  '/assets/main.js',
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached response and update cache in background
        event.waitUntil(
          fetch(event.request).then((response) => {
            if (response.ok) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, response);
              });
            }
          }).catch(() => {})
        );
        return cachedResponse;
      }

      // No cache, fetch from network
      return fetch(event.request).then((response) => {
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        // Fallback for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
        return new Response('Offline', { status: 503 });
      });
    })
  );
});
```

### 9.3 Contoh Implementasi Web Share dengan Fallback (Vanilla JS)

```javascript
// src/utils/share.js
export async function shareContent(title, text, url) {
  const shareData = { title, text, url };

  if (navigator.share && navigator.canShare?.(shareData)) {
    try {
      await navigator.share(shareData);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Share failed:', err);
        fallbackCopyToClipboard(text, url);
      }
    }
  } else {
    fallbackCopyToClipboard(text, url);
  }
}

function fallbackCopyToClipboard(text, url) {
  const fullText = `${text}\n\n${url}`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(fullText).then(() => {
      showToast('Teks berhasil disalin ke clipboard');
    }).catch(() => {
      showToast('Browser tidak mendukung fitur salin');
    });
  } else {
    // Fallback untuk browser lama
    const textarea = document.createElement('textarea');
    textarea.value = fullText;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast('Teks berhasil disalin ke clipboard');
  }
}

function showToast(message) {
  // Menggunakan Bootstrap toast component
  const toastEl = document.createElement('div');
  toastEl.className = 'toast align-items-center text-bg-success position-fixed bottom-0 end-0 m-3';
  toastEl.setAttribute('role', 'alert');
  toastEl.innerHTML = `<div class="d-flex"><div class="toast-body">${message}</div></div>`;
  document.body.appendChild(toastEl);
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
  toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}
```

### 9.4 Edge Cases

| Skenario                                         | Handling                                                                                 |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| JavaScript dinonaktifkan                         | Tampilkan `<noscript>` message: "Aplikasi memerlukan JavaScript untuk berfungsi optimal" |
| Pasal tidak ditemukan (e.g., `/pasal/999`)       | Render halaman 404 dengan daftar pasal yang tersedia                                     |
| Web Share API tidak tersedia                     | Tampilkan tombol "Salin Teks" dan "Salin Tautan"                                         |
| Clipboard API tidak tersedia (HTTP/non-secure)   | Fallback ke `document.execCommand('copy')` atau sembunyikan fitur salin                  |
| Pencarian dengan karakter khusus (`*`, `?`, `/`) | Escape regex characters sebelum diproses Fuse.js                                         |
| File JSON gagal dimuat                           | Tampilkan error message dengan tombol "Muat Ulang"                                       |
| Browser tidak mendukung Service Worker           | Aplikasi tetap berfungsi online tanpa fitur offline                                      |
| Akses dari embedded browser (Instagram, FB)      | Deep link tetap berfungsi; share button fallback ke clipboard                            |

---

## 10. Validation Criteria

Dokumen spesifikasi ini dianggap valid dan siap untuk implementasi apabila memenuhi kriteria berikut:

- [ ] **VAL-001**: Semua 14 Functional Requirements (REQ-001 s.d. REQ-014) telah terdefinisi dengan jelas
- [ ] **VAL-002**: Semua 7 schema JSON data telah didokumentasikan dengan type definition lengkap
- [ ] **VAL-003**: Routing table mencakup seluruh halaman yang disebutkan di PRD beserta parameter dinamis
- [ ] **VAL-004**: Acceptance Criteria mencakup seluruh user stories dari PRD (GH-001 s.d. GH-014)
- [ ] **VAL-005**: Test Automation Strategy mencakup unit, integration, E2E, dan performance testing
- [ ] **VAL-006**: Dependencies & External Integrations telah mengidentifikasi seluruh third-party services
- [ ] **VAL-007**: Edge cases telah didokumentasikan dengan handling strategy yang jelas
- [ ] **VAL-008**: Tech stack yang dipilih memiliki justifikasi rationale yang sesuai dengan kebutuhan produk
- [ ] **VAL-009**: Semua constraint (CON-001 s.d. CON-007) telah tercatat dan dapat diverifikasi
- [ ] **VAL-010**: Spesifikasi telah direview dan disetujui oleh stakeholder sebelum masuk fase Planning

---

## 11. Related Specifications / Further Reading

- [PRD: Pancasila & UUD 1945 Web App](../prd_pasaluud1945_webapp.md)
- [Spesifikasi Data Schema](./spec-data-schema-pasaluud1945.md)
- [Spesifikasi Design System & UI/UX](./spec-design-uiux-pasaluud1945.md)
- [Spesifikasi Process Workflow](./spec-process-workflow-pasaluud1945.md)
- [Spesifikasi SEO & Metadata](./spec-seo-pasaluud1945.md)
- [Vite Documentation](https://vitejs.dev/)
- [Bootstrap 5 Documentation](https://getbootstrap.com/)
- [Fuse.js Documentation](https://www.fusejs.io/)
- [Web Share API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API)
- [Service Worker API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Progressive Web App Checklist](https://web.dev/pwa-checklist/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Core Web Vitals - web.dev](https://web.dev/vitals/)

---

*Dokumen ini merupakan spesifikasi teknis v1.0.0 dan harus direview serta disetujui sebelum memasuki fase Implementation Planning.*
