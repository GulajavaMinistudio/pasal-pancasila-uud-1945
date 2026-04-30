---
title: Spesifikasi SEO & Metadata Aplikasi Web Pancasila & UUD 1945
version: 1.0.0
date_created: 2026-04-28
last_updated: 2026-04-29
owner: Development Team
status: final
tags:
  - seo
  - metadata
  - opengraph
  - structured-data
  - pwa
  - specification
---
<!-- markdownlint-disable -->

# 1. Introduction

## 1.1 Purpose & Scope

Dokumen ini mendefinisikan strategi dan spesifikasi teknis **Search Engine Optimization (SEO)** untuk aplikasi web **Pancasila & UUD 1945**. SEO merupakan salah satu *business goal* utama produk ini (PRD §2.1), dengan target muncul di halaman 1 Google untuk query konstitusional Indonesia dalam 6 bulan sejak launch.

Karena aplikasi ini adalah **Single Page Application (SPA)** berbasis Vanilla JavaScript + Vite, penanganan SEO memerlukan perhatian khusus agar setiap halaman/route dapat di-index oleh mesin pencari secara optimal.

**Scope:**

- Strategi SEO untuk arsitektur SPA dengan Vite
- Spesifikasi `<meta>` tags per route (title, description, canonical)
- Spesifikasi Open Graph & Twitter Card tags
- Spesifikasi JSON-LD Structured Data (Schema.org)
- Spesifikasi `sitemap.xml` dan `robots.txt`
- Strategi SEO untuk SPA (dynamic meta tags via `updateMetaTags()`; pre-rendering adalah backlog v2)
- Core Web Vitals sebagai faktor SEO teknis

**Target Audience:**

- Frontend Developer (implementasi meta tags, sitemap, structured data)
- QA Engineer (verifikasi SEO compliance)
- DevOps (konfigurasi sitemap submission dan monitoring)

---

## 2. Definitions

| Istilah               | Definisi                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------ |
| **SEO**               | Search Engine Optimization — praktik meningkatkan visibilitas halaman di hasil mesin pencari     |
| **Meta Tag**          | Elemen HTML `<meta>` di `<head>` yang menyediakan metadata halaman untuk browser dan crawler     |
| **Open Graph**        | Protokol metadata yang digunakan Facebook/media sosial untuk preview tautan yang dibagikan       |
| **Twitter Card**      | Metadata khusus Twitter/X untuk preview tautan di platform tersebut                             |
| **JSON-LD**           | JSON-based Linked Data — format structured data yang direkomendasikan Google (Schema.org)        |
| **Structured Data**   | Markup terstandar yang membantu mesin pencari memahami konten halaman secara semantik            |
| **Canonical URL**     | URL resmi/utama suatu halaman, mencegah duplikasi konten di indeks Google                        |
| **Sitemap**           | File XML yang mendaftarkan semua URL halaman untuk memudahkan crawler menemukan konten           |
| **robots.txt**        | File teks yang mengatur izin akses crawler terhadap konten aplikasi                             |
| **Pre-rendering**     | Proses men-generate HTML statis dari halaman SPA pada saat build time untuk keperluan SEO        |
| **Core Web Vitals**   | Metrik kecepatan dan UX Google (LCP, CLS, INP) yang digunakan sebagai faktor ranking            |
| **SPA SEO**           | Tantangan SEO pada Single Page Application karena konten di-render via JavaScript                |

---

## 3. Requirements, Constraints & Guidelines

### 3.1 SEO Requirements

- **REQ-SEO-001**: Setiap route harus memiliki `<title>` tag yang unik dan deskriptif
- **REQ-SEO-002**: Setiap route harus memiliki `<meta name="description">` yang unik (panjang 120–160 karakter)
- **REQ-SEO-003**: Setiap route harus memiliki `<link rel="canonical">` yang menunjuk ke URL absolutnya
- **REQ-SEO-004**: Open Graph tags (`og:title`, `og:description`, `og:url`, `og:image`, `og:type`) harus ada di setiap route
- **REQ-SEO-005**: Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`) harus ada di setiap route
- **REQ-SEO-006**: Halaman detail pasal (`/pasal/:nomor`) harus memiliki JSON-LD Structured Data tipe `Article` atau `LegislativeDocument`
- **REQ-SEO-007**: File `sitemap.xml` harus mencakup semua routes statis dan semua URL pasal dinamis
- **REQ-SEO-008**: File `robots.txt` harus memperbolehkan semua crawler dan mencantumkan URL sitemap
- **REQ-SEO-009**: Heading hierarchy HTML harus logis: satu `<h1>` per halaman, diikuti `<h2>`, `<h3>` tanpa skip
- **REQ-SEO-010**: Semua gambar harus memiliki atribut `alt` yang deskriptif
- **REQ-SEO-011**: Semua link internal harus menggunakan elemen `<a href>` (bukan hanya event listener JavaScript)
- **REQ-SEO-012**: Helper function `updateMetaTags()` harus dipanggil pada setiap route change agar meta tags (`<title>`, `<meta name="description">`, `og:url`, `<link rel="canonical">`) selalu sinkron dengan konten yang ditampilkan

### 3.2 Non-Functional SEO Requirements

- **REQ-SEO-013**: Lighthouse SEO Score harus >= 95 pada semua route utama
- **REQ-SEO-014**: Core Web Vitals: LCP < 2.5 detik, CLS < 0.1 (faktor ranking Google)
- **REQ-SEO-015**: Sitemap harus di-submit ke Google Search Console setelah launch
- **REQ-SEO-016**: Structured data harus valid — tidak ada error saat diuji di Google Rich Results Test

### 3.3 Constraints

- **CON-SEO-001**: Aplikasi adalah SPA (client-side rendered) — meta tags diperbarui secara dinamis via `updateMetaTags()` pada setiap navigasi; pre-rendering ditunda ke backlog v2
- **CON-SEO-002**: Tidak ada backend server — sitemap harus di-generate secara statis pada saat build time via script `prebuild` (`scripts/generate-sitemap.js`)

### 3.4 Guidelines

- **GUD-SEO-001**: Panggil `updateMetaTags(config)` pada setiap route change di router untuk memastikan meta tags selalu sinkron dengan konten yang ditampilkan (SPA approach v1)
- **GUD-SEO-002**: Kelola meta tags secara dinamis menggunakan helper function `updateMetaTags(route)` yang dipanggil setiap navigasi
- **GUD-SEO-003**: Gunakan URL absolut pada `og:url`, `og:image`, dan `<link rel="canonical">` — hindari path relatif
- **GUD-SEO-004**: Gambar Open Graph sebaiknya berukuran 1200×630px untuk tampilan optimal di media sosial
- **GUD-SEO-005**: Tambahkan `<link rel="alternate" hreflang="id">` untuk memperjelas bahasa konten ke Google

---

## 4. Per-Route SEO Specification

### 4.1 Template Meta Tags Dasar

Setiap route harus mengisi template berikut di `<head>`:

```html
<!-- Primary SEO -->
<title>{PAGE_TITLE} | Pancasila & UUD 1945</title>
<meta name="description" content="{PAGE_DESCRIPTION}" />
<link rel="canonical" href="https://pasaluud1945.web.app{ROUTE_PATH}" />
<meta name="robots" content="index, follow" />
<meta name="language" content="Indonesian" />
<meta name="author" content="Pancasila & UUD 1945 Web App" />

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://pasaluud1945.web.app{ROUTE_PATH}" />
<meta property="og:title" content="{PAGE_TITLE} | Pancasila & UUD 1945" />
<meta property="og:description" content="{PAGE_DESCRIPTION}" />
<meta property="og:image" content="https://pasaluud1945.web.app/assets/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:locale" content="id_ID" />
<meta property="og:site_name" content="Pancasila & UUD 1945" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{PAGE_TITLE} | Pancasila & UUD 1945" />
<meta name="twitter:description" content="{PAGE_DESCRIPTION}" />
<meta name="twitter:image" content="https://pasaluud1945.web.app/assets/og-image.png" />
```

### 4.2 Spesifikasi Per Route

| Route              | `<title>`                                              | `<meta name="description">`                                                                      |
| ------------------ | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| `/`                | Pancasila & UUD 1945 — Konstitusi Indonesia            | Baca Pancasila, Pembukaan UUD 1945, dan seluruh Pasal UUD 1945 secara online. Lengkap, akurat, dan dapat diakses kapan saja. |
| `/pancasila`       | 5 Sila Pancasila — Dasar Negara Indonesia              | Teks lengkap 5 Sila Pancasila sebagai dasar negara Republik Indonesia. Ketuhanan Yang Maha Esa hingga Keadilan Sosial. |
| `/sila/:nomor`     | Sila {nomor} Pancasila — {teks singkat sila}           | Teks lengkap dan butir-butir pengamalan Sila ke-{nomor} Pancasila sebagai dasar negara Indonesia. |
| `/butir-pancasila` | Butir-Butir Pengamalan Pancasila — 45 Butir            | Daftar lengkap 45 butir pengamalan Pancasila per sila, pedoman perilaku warga negara Indonesia.  |
| `/pembukaan`       | Pembukaan UUD 1945 — Empat Alinea                      | Teks lengkap Pembukaan Undang-Undang Dasar 1945 dalam 4 alinea. Dasar konstitusional Republik Indonesia. |
| `/pasal`           | Pasal-Pasal UUD 1945 — Daftar Lengkap Pasca-Amandemen  | Daftar lengkap pasal-pasal UUD 1945 pasca amandemen (Pasal 1–37). Klik untuk membaca isi lengkap setiap pasal. |
| `/pasal/:nomor`    | Pasal {nomor} UUD 1945 — Isi Lengkap                   | Baca isi lengkap Pasal {nomor} Undang-Undang Dasar 1945. Teks otentik pasca amandemen.           |
| `/bab-pasal`       | Bab-Bab UUD 1945 — Navigasi 21 Bab                     | Navigasi pasal UUD 1945 berdasarkan 21 bab. Dari Bentuk Negara hingga Perubahan UUD.             |
| `/bab-pasal/:nomor`| Bab {nomor} UUD 1945 — {nama bab}                      | Daftar pasal dalam Bab {nomor} UUD 1945: {nama bab}. Baca isi setiap pasal secara lengkap.      |
| `/uud-asli`        | UUD 1945 Asli — Sebelum Amandemen                      | Teks UUD 1945 dalam versi asli sebelum amandemen. Bandingkan dengan versi pasca-amandemen (1999–2002). |
| `/amandemen`       | Amandemen UUD 1945 — Riwayat Perubahan I–IV            | Daftar pasal UUD 1945 yang mengalami amandemen beserta keterangan Amandemen I (1999) hingga IV (2002). |
| `/cari`            | Cari Pasal UUD 1945 — Pencarian Konstitusi             | Cari pasal UUD 1945 berdasarkan kata kunci. Temukan pasal tentang hak, kewajiban, pemerintahan, dan lainnya. |
| `/tentang`         | Tentang Aplikasi Pancasila & UUD 1945                  | Informasi tentang aplikasi web Pancasila & UUD 1945. Referensi konstitusional Indonesia yang akurat dan mudah diakses. |

### 4.3 Structured Data JSON-LD: Halaman Detail Pasal

Setiap halaman `/pasal/:nomor` harus menyertakan structured data JSON-LD berikut:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Pasal {nomor} Undang-Undang Dasar 1945",
  "description": "Isi lengkap Pasal {nomor} UUD 1945 pasca-amandemen.",
  "url": "https://pasaluud1945.web.app/pasal/{nomor}",
  "dateModified": "2026-04-28",
  "inLanguage": "id",
  "isPartOf": {
    "@type": "Book",
    "name": "Undang-Undang Dasar Negara Republik Indonesia Tahun 1945",
    "url": "https://pasaluud1945.web.app/pasal"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Pancasila & UUD 1945 Web App",
    "url": "https://pasaluud1945.web.app"
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://pasaluud1945.web.app/pasal/{nomor}"
  }
}
</script>
```

### 4.4 Structured Data JSON-LD: Halaman Pancasila

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "5 Sila Pancasila — Dasar Negara Indonesia",
  "description": "Teks lengkap 5 Sila Pancasila sebagai dasar negara Republik Indonesia.",
  "url": "https://pasaluud1945.web.app/pancasila",
  "inLanguage": "id",
  "about": {
    "@type": "Thing",
    "name": "Pancasila",
    "description": "Dasar negara dan ideologi nasional Republik Indonesia yang terdiri dari 5 sila."
  }
}
</script>
```

### 4.5 Structured Data JSON-LD: Halaman Utama (BreadcrumbList)

Untuk halaman dengan navigasi hierarki, tambahkan BreadcrumbList:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Beranda",
      "item": "https://pasaluud1945.web.app/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Pasal UUD 1945",
      "item": "https://pasaluud1945.web.app/pasal"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Pasal {nomor}",
      "item": "https://pasaluud1945.web.app/pasal/{nomor}"
    }
  ]
}
</script>
```

---

## 5. Implementasi: Dynamic Meta Tag Management

### 5.1 Helper Function `updateMetaTags`

Karena aplikasi adalah SPA, meta tags harus diperbarui setiap kali pengguna berpindah route. Gunakan helper function berikut:

```javascript
// src/utils/seo.js

const BASE_URL = 'https://pasaluud1945.web.app';
const DEFAULT_OG_IMAGE = `${BASE_URL}/assets/og-image.png`;

/**
 * @typedef {Object} MetaConfig
 * @property {string} title
 * @property {string} description
 * @property {string} path
 * @property {string} [ogImage]
 * @property {string} [ogType]
 * @property {Object} [jsonLd]
 */

/**
 * Update semua meta tags untuk route yang aktif.
 * @param {MetaConfig} config
 */
export function updateMetaTags({ title, description, path, ogImage, ogType = 'website', jsonLd }) {
  const fullTitle = `${title} | Pancasila & UUD 1945`;
  const canonicalUrl = `${BASE_URL}${path}`;
  const imageUrl = ogImage ?? DEFAULT_OG_IMAGE;

  // Primary
  document.title = fullTitle;
  setMeta('name', 'description', description);
  setLink('canonical', canonicalUrl);

  // Open Graph
  setMeta('property', 'og:title', fullTitle);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:url', canonicalUrl);
  setMeta('property', 'og:image', imageUrl);
  setMeta('property', 'og:type', ogType);

  // Twitter Card
  setMeta('name', 'twitter:title', fullTitle);
  setMeta('name', 'twitter:description', description);
  setMeta('name', 'twitter:image', imageUrl);

  // JSON-LD
  if (jsonLd) {
    setJsonLd(jsonLd);
  }
}

function setMeta(attrName, attrValue, content) {
  let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function setJsonLd(data) {
  let el = document.querySelector('script[type="application/ld+json"]');
  if (!el) {
    el = document.createElement('script');
    el.setAttribute('type', 'application/ld+json');
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data, null, 2);
}
```

### 5.2 Contoh Penggunaan di Router

```javascript
// src/router.js — contoh pemanggilan updateMetaTags saat navigasi

import { updateMetaTags } from './utils/seo.js';
import pasalData from './data/pasaluud45.json';

const routes = {
  '/pancasila': () => {
    updateMetaTags({
      title: '5 Sila Pancasila — Dasar Negara Indonesia',
      description: 'Teks lengkap 5 Sila Pancasila sebagai dasar negara Republik Indonesia.',
      path: '/pancasila',
    });
  },

  '/pasal/:nomor': (params) => {
    const pasal = pasalData.data.find(p => p.namapasal === `Pasal ${params.nomor}`);
    const cuplikan = pasal?.arrayisi[0]?.isi?.substring(0, 120) ?? '';

    updateMetaTags({
      title: `Pasal ${params.nomor} UUD 1945 — Isi Lengkap`,
      description: `Baca isi lengkap Pasal ${params.nomor} UUD 1945. ${cuplikan}`,
      path: `/pasal/${params.nomor}`,
      ogType: 'article',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: `Pasal ${params.nomor} Undang-Undang Dasar 1945`,
        url: `https://pasaluud1945.web.app/pasal/${params.nomor}`,
        inLanguage: 'id',
        isPartOf: {
          '@type': 'Book',
          name: 'Undang-Undang Dasar Negara Republik Indonesia Tahun 1945',
        },
      },
    });
  },
};
```

---

## 6. Sitemap & robots.txt

### 6.1 Spesifikasi `sitemap.xml`

File sitemap harus di-generate secara statis pada saat build time menggunakan script Node.js. Sitemap mencakup seluruh URL statis dan semua URL pasal dinamis.

**Lokasi file:** `public/sitemap.xml`

**Format:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Route statis -->
  <url>
    <loc>https://pasaluud1945.web.app/</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://pasaluud1945.web.app/pancasila</loc>
    <changefreq>yearly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://pasaluud1945.web.app/sila/1</loc>
    <changefreq>yearly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- ... sila/2 s.d. sila/5 ... -->
  <url>
    <loc>https://pasaluud1945.web.app/butir-pancasila</loc>
    <changefreq>yearly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://pasaluud1945.web.app/pembukaan</loc>
    <changefreq>yearly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://pasaluud1945.web.app/pasal</loc>
    <changefreq>yearly</changefreq>
    <priority>0.9</priority>
  </url>
  <!-- URL dinamis pasal — di-generate dari pasaluud45.json -->
  <url>
    <loc>https://pasaluud1945.web.app/pasal/1</loc>
    <changefreq>yearly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- ... pasal/2 s.d. pasal/37 + alfanumerik ... -->
  <url>
    <loc>https://pasaluud1945.web.app/bab-pasal</loc>
    <changefreq>yearly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://pasaluud1945.web.app/uud-asli</loc>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://pasaluud1945.web.app/amandemen</loc>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://pasaluud1945.web.app/tentang</loc>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>
</urlset>
```

**Script Generator (build time):**

```javascript
// scripts/generate-sitemap.js
import pasalData from '../src/data/pasaluud45.json' assert { type: 'json' };

const BASE_URL = 'https://pasaluud1945.web.app';
const STATIC_ROUTES = [
  { path: '/',              priority: '1.0', changefreq: 'monthly' },
  { path: '/pancasila',     priority: '0.9', changefreq: 'yearly' },
  { path: '/sila/1',        priority: '0.8', changefreq: 'yearly' },
  { path: '/sila/2',        priority: '0.8', changefreq: 'yearly' },
  { path: '/sila/3',        priority: '0.8', changefreq: 'yearly' },
  { path: '/sila/4',        priority: '0.8', changefreq: 'yearly' },
  { path: '/sila/5',        priority: '0.8', changefreq: 'yearly' },
  { path: '/butir-pancasila', priority: '0.8', changefreq: 'yearly' },
  { path: '/pembukaan',     priority: '0.9', changefreq: 'yearly' },
  { path: '/pasal',         priority: '0.9', changefreq: 'yearly' },
  { path: '/bab-pasal',     priority: '0.8', changefreq: 'yearly' },
  { path: '/uud-asli',      priority: '0.7', changefreq: 'yearly' },
  { path: '/amandemen',     priority: '0.7', changefreq: 'yearly' },
  { path: '/tentang',       priority: '0.4', changefreq: 'monthly' },
];

function generateSitemap() {
  const dynamicRoutes = pasalData.data.map(pasal => ({
    path: `/pasal/${pasal.namapasal.replace('Pasal ', '')}`,
    priority: '0.8',
    changefreq: 'yearly',
  }));

  const allRoutes = [...STATIC_ROUTES, ...dynamicRoutes];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(r => `  <url>
    <loc>${BASE_URL}${r.path}</loc>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xml;
}

import { writeFileSync } from 'fs';
writeFileSync('public/sitemap.xml', generateSitemap(), 'utf-8');
console.log('✅ sitemap.xml generated successfully');
```

### 6.2 Spesifikasi `robots.txt`

**Lokasi file:** `public/robots.txt`

```
User-agent: *
Allow: /

# Tidak perlu di-crawl — halaman pencarian tidak memiliki konten unik
Disallow: /cari

Sitemap: https://pasaluud1945.web.app/sitemap.xml
```

---

## 7. SPA SEO Strategy (v1)

### 7.1 Pendekatan v1: Dynamic Meta Tags

Untuk v1, aplikasi menggunakan pendekatan **SPA dengan dynamic meta tags** tanpa pre-rendering. Meta tags diperbarui secara client-side setiap kali pengguna berpindah route menggunakan helper function `updateMetaTags()` (lihat §5).

**Rasional v1:**

- Pre-rendering memerlukan plugin tambahan (`vite-plugin-ssg` atau `vite-plugin-prerender`) yang menambah kompleksitas build pipeline
- Googlebot modern (2024+) sudah dapat menjalankan JavaScript dan mengindeks konten SPA dalam waktu yang wajar
- Data konten bersifat statis — `sitemap.xml` yang valid sudah membantu crawler menemukan semua URL
- Fokus v1 adalah delivery konten yang cepat dan offline; optimasi SEO lanjutan adalah target v2

**Trade-off yang diterima:**

- Googlebot mungkin membutuhkan waktu sedikit lebih lama untuk mengindeks konten baru dibanding pre-rendered HTML
- Social media crawlers (WhatsApp, Telegram) yang tidak menjalankan JavaScript hanya akan mendapatkan default meta tags dari `index.html` untuk sharing preview

### 7.2 Backlog v2: Pre-rendering

Pre-rendering akan dievaluasi di v2 menggunakan salah satu strategi berikut:

| Opsi | Plugin | Kompatibilitas | Catatan |
| ---- | ------ | -------------- | ------- |
| **Opsi A** | `vite-plugin-prerender` | Vanilla JS + Vite | Fleksibel; tidak memerlukan perubahan arsitektur router |
| **Opsi B** | `vite-plugin-ssg` | Vanilla JS + Vite | Memerlukan refactor router ke pattern yang kompatibel |

Implementasi v2 harus melalui **Spec update** dan **Plan baru** sebelum dieksekusi.

---

## 8. Core Web Vitals sebagai Faktor SEO

Google menggunakan Core Web Vitals sebagai faktor ranking sejak 2021. Target wajib dipenuhi:

| Metrik | Target      | Faktor SEO |
| ------ | ----------- | ---------- |
| LCP    | < 2.5 detik | Ya — faktor ranking langsung |
| CLS    | < 0.1       | Ya — faktor ranking langsung |
| INP    | < 200ms     | Ya — menggantikan FID sejak 2024 |

### Strategi Optimasi

- **LCP**: Preload font `Inter` + gunakan `loading="lazy"` untuk gambar non-kritis + minimalkan blocking scripts
- **CLS**: Tetapkan dimensi eksplisit pada semua gambar dan elemen media, hindari konten yang muncul dinamis di atas fold
- **INP**: Debounce pada event listener input (sudah ada pada komponen pencarian), hindari blocking main thread

---

## 9. Acceptance Criteria

### 9.1 Meta Tags

- **AC-SEO-001**: Given halaman `/pancasila` dibuka, When HTML di-inspect, Then `<title>` berisi "5 Sila Pancasila" dan `<meta name="description">` terisi dan panjangnya antara 120–160 karakter
- **AC-SEO-002**: Given halaman `/pasal/7A` dibuka, When HTML di-inspect, Then `<title>` berisi "Pasal 7A", `og:url` berisi URL absolut yang benar, dan `<link rel="canonical">` menunjuk ke URL yang sama
- **AC-SEO-003**: Given halaman manapun dibuka, When HTML di-inspect, Then tidak ada dua elemen `<title>` atau dua `<link rel="canonical">` yang berbeda
- **AC-SEO-004**: Given pengguna membagikan URL `/pasal/1` ke WhatsApp, When preview link muncul, Then menampilkan judul dan deskripsi yang relevan dari Open Graph tags

### 9.2 Structured Data

- **AC-SEO-005**: Given halaman `/pasal/1` dibuka, When diuji di Google Rich Results Test, Then structured data JSON-LD valid tanpa error
- **AC-SEO-006**: Given breadcrumb JSON-LD di halaman `/pasal/1` di-inspect, When divalidasi, Then berisi 3 level: Beranda → Pasal UUD 1945 → Pasal 1

### 9.3 Sitemap & robots.txt

- **AC-SEO-007**: Given `GET https://pasaluud1945.web.app/sitemap.xml`, When di-request, Then response valid XML dan mencakup semua URL pasal
- **AC-SEO-008**: Given `GET https://pasaluud1945.web.app/robots.txt`, When di-request, Then `Sitemap:` directive menunjuk ke URL sitemap yang benar dan `Allow: /` ada
- **AC-SEO-009**: Given Lighthouse SEO audit dijalankan pada route utama, When hasil keluar, Then score >= 95

### 9.4 Dynamic Meta Tags

- **AC-SEO-010**: Given pengguna navigasi dari `/pancasila` ke `/pasal/1`, When route berubah, Then `<title>`, `<meta name="description">`, `og:url`, dan `<link rel="canonical">` diperbarui sesuai route `/pasal/1` tanpa halaman di-reload
- **AC-SEO-011**: Given `index.html` build output, When di-inspect tanpa menjalankan JavaScript, Then `<meta name="description">` default untuk halaman utama sudah ada di HTML sebagai fallback untuk crawler yang tidak menjalankan JS

---

## 10. Test Automation Strategy

### 10.1 SEO Tests (Playwright)

```javascript
// tests/e2e/seo.spec.js
import { test, expect } from '@playwright/test';

test.describe('SEO Meta Tags', () => {
  test('halaman /pancasila memiliki title dan description yang tepat', async ({ page }) => {
    await page.goto('/pancasila');
    const title = await page.title();
    expect(title).toContain('Pancasila');
    const description = await page.$eval('meta[name="description"]', el => el.content);
    expect(description.length).toBeGreaterThan(50);
    expect(description.length).toBeLessThan(170);
  });

  test('halaman /pasal/:nomor memiliki canonical URL yang benar', async ({ page }) => {
    await page.goto('/pasal/1');
    const canonical = await page.$eval('link[rel="canonical"]', el => el.href);
    expect(canonical).toBe('https://pasaluud1945.web.app/pasal/1');
  });

  test('halaman detail pasal memiliki JSON-LD structured data', async ({ page }) => {
    await page.goto('/pasal/1');
    const jsonLd = await page.$eval('script[type="application/ld+json"]', el => JSON.parse(el.textContent));
    expect(jsonLd['@type']).toBe('Article');
    expect(jsonLd.headline).toContain('Pasal 1');
  });

  test('setiap route memiliki og:url yang benar', async ({ page }) => {
    const routes = ['/pancasila', '/pembukaan', '/pasal', '/pasal/5'];
    for (const route of routes) {
      await page.goto(route);
      const ogUrl = await page.$eval('meta[property="og:url"]', el => el.content);
      expect(ogUrl).toContain(route);
    }
  });
});
```

### 10.2 Sitemap Validation

```javascript
// tests/unit/sitemap.test.js
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';

describe('sitemap.xml', () => {
  it('harus mencakup URL pasal utama', () => {
    const sitemap = readFileSync('public/sitemap.xml', 'utf-8');
    expect(sitemap).toContain('/pasal/1');
    expect(sitemap).toContain('/pasal/37');
    expect(sitemap).toContain('/pancasila');
    expect(sitemap).toContain('/pembukaan');
  });

  it('harus mencakup URL pasal alfanumerik', () => {
    const sitemap = readFileSync('public/sitemap.xml', 'utf-8');
    expect(sitemap).toContain('/pasal/6A');
    expect(sitemap).toContain('/pasal/7B');
  });
});
```

---

## 11. Validation Criteria

Dokumen spesifikasi SEO ini dianggap valid dan siap untuk implementasi apabila memenuhi kriteria berikut:

- [ ] **VAL-SEO-001**: Semua 16 SEO Requirements (REQ-SEO-001 s.d. REQ-SEO-016) telah terdefinisi dengan jelas
- [ ] **VAL-SEO-002**: Spesifikasi meta tags per route telah lengkap untuk semua 14 route yang terdefinisi
- [ ] **VAL-SEO-003**: JSON-LD structured data template tersedia untuk halaman pasal dan pancasila
- [ ] **VAL-SEO-004**: Strategi SEO v1 (SPA + dynamic meta tags) dan backlog v2 (pre-rendering) telah didokumentasikan dengan jelas
- [ ] **VAL-SEO-005**: Spesifikasi `sitemap.xml` mencakup script generator yang dapat dieksekusi saat build
- [ ] **VAL-SEO-006**: Acceptance criteria SEO mencakup skenario meta tags, structured data, dan sitemap
- [ ] **VAL-SEO-007**: Spesifikasi telah direview dan disetujui sebelum masuk fase Planning

---

## 12. Related Specifications / Further Reading

- [Spesifikasi Arsitektur: Pancasila & UUD 1945 Web App](./spec-architecture-pasaluud1945-webapp.md)
- [Spesifikasi Data Schema](./spec-data-schema-pasaluud1945.md)
- [PRD: Pancasila & UUD 1945 Web App](../prd_pasaluud1945_webapp.md)
- [Google Search Central: SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Open Graph Protocol](https://ogp.me/)
- [Schema.org: Article](https://schema.org/Article)
- [Core Web Vitals — web.dev](https://web.dev/vitals/)
- [Google Search Console](https://search.google.com/search-console)

---

*Dokumen ini merupakan spesifikasi SEO v1.0.0 dan harus direview serta disetujui sebelum memasuki fase Implementation Planning.*
