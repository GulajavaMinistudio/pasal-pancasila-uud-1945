/**
 * @file src/utils/jsonld.js
 * @description Adapter untuk JSON-LD structured data management pada SPA.
 *
 * Menyediakan:
 *   - injectJsonLd(schema)     — inject / perbarui <script type="application/ld+json"> ke <head>
 *   - removeJsonLd()           — hapus script JSON-LD dari <head>
 *   - createWebPageSchema()    — factory schema.org WebPage
 *   - createArticleSchema()    — factory schema.org Article (halaman detail pasal)
 *   - createBreadcrumbSchema() — factory schema.org BreadcrumbList
 *
 * Pola upsert: satu elemen <script id="__jsonld-page"> dikelola per navigasi.
 * Script WebSite di index.html menggunakan id="__jsonld-website" dan TIDAK dikelola
 * oleh modul ini — ia bersifat statis dan tidak pernah berubah.
 *
 * BASE_URL: baca dari VITE_CANONICAL_BASE_URL (env var untuk custom domain).
 *           Fallback: 'https://pasaluud1945.web.app'
 *
 * Referensi:
 *   - spec-seo-pasaluud1945.md §4.3–4.5
 *   - planning feature-phase3-pwa-sharing-seo-1.md TASK-026–029
 *   - AGENTS.md CS-1 — Adapter hanya boleh import src/types/
 */

/** @type {string} */
const BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CANONICAL_BASE_URL) ||
  'https://pasaluud1945.web.app';

/** ID elemen <script> JSON-LD yang dikelola secara dinamis per navigasi */
const JSONLD_SCRIPT_ID = '__jsonld-page';

// =============================================================================
// Public API — Inject / Remove
// =============================================================================

/**
 * Inject atau perbarui <script type="application/ld+json"> ke <head> (upsert).
 * Jika elemen belum ada, elemen baru dibuat dan di-append ke <head>.
 * Jika sudah ada, textContent diperbarui tanpa duplikasi.
 *
 * Terima single schema object atau array schema (untuk multiple types per halaman).
 *
 * @param {object | object[]} schemaOrArray - Schema.org object atau array of objects
 */
export function injectJsonLd(schemaOrArray) {
  let el = document.getElementById(JSONLD_SCRIPT_ID);
  if (!el) {
    el = document.createElement('script');
    el.setAttribute('type', 'application/ld+json');
    el.id = JSONLD_SCRIPT_ID;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(schemaOrArray);
}

/**
 * Hapus <script type="application/ld+json"> dari <head>.
 * Aman dipanggil meski elemen belum ada (no-op jika tidak ditemukan).
 */
export function removeJsonLd() {
  const el = document.getElementById(JSONLD_SCRIPT_ID);
  if (el) {
    el.remove();
  }
}

// =============================================================================
// Public API — Schema Creators
// =============================================================================

/**
 * Buat schema.org WebPage — untuk halaman statis (Pancasila, Pembukaan, Bab Pasal, dll).
 *
 * @param {{ name: string; description: string; url: string }} params
 *   url: path bersih tanpa BASE_URL (e.g. '/pancasila', '/')
 * @returns {object}
 */
export function createWebPageSchema({ name, description, url }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url: `${BASE_URL}${url}`,
    inLanguage: 'id',
  };
}

/**
 * Buat schema.org Article — untuk halaman detail pasal (/pasal/:nomor).
 *
 * Sesuai spesifikasi §4.3: menyertakan isPartOf (Book), publisher (Organization),
 * dan mainEntityOfPage (WebPage) sebagai rich result signals.
 *
 * @param {{ headline: string; description: string; url: string; dateModified?: string }} params
 *   url: path bersih (e.g. '/pasal/7A')
 *   dateModified: tanggal modifikasi terakhir format ISO 8601. Default: '2026-04-28'
 * @returns {object}
 */
export function createArticleSchema({ headline, description, url, dateModified = '2026-04-28' }) {
  const absoluteUrl = `${BASE_URL}${url}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    url: absoluteUrl,
    dateModified,
    inLanguage: 'id',
    isPartOf: {
      '@type': 'Book',
      name: 'Undang-Undang Dasar Negara Republik Indonesia Tahun 1945',
      url: `${BASE_URL}/pasal`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Pancasila & UUD 1945 Web App',
      url: BASE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl,
    },
  };
}

/**
 * Buat schema.org BreadcrumbList — untuk navigasi hierarki halaman.
 *
 * @param {Array<{ name: string; path: string }>} items
 *   path: route path bersih (e.g. '/pasal'). BASE_URL ditambahkan otomatis.
 * @returns {object}
 */
export function createBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.path}`,
    })),
  };
}
