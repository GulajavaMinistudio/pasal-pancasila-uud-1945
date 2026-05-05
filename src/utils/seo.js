/**
 * @file src/utils/seo.js
 * @description Adapter untuk dynamic SEO meta tag management pada SPA.
 *
 * Setiap kali pengguna berpindah route, panggil `updateMetaTags()` agar
 * `<title>`, `<meta name="description">`, `<link rel="canonical">`, Open Graph,
 * dan Twitter Card tags selalu sinkron dengan konten yang ditampilkan.
 *
 * Pola "upsert": jika tag belum ada di <head>, akan dibuat baru. Jika sudah ada,
 * atribut `content` / `href` diperbarui tanpa menambah elemen duplikat.
 *
 * BASE_URL: baca dari VITE_CANONICAL_BASE_URL (env var untuk custom domain).
 *           Fallback: 'https://pasaluud1945.web.app'
 *
 * Referensi:
 *   - spec-seo-pasaluud1945.md §3.1, §4.1, §5.1
 *   - planning feature-phase3-pwa-sharing-seo-1.md TASK-019
 *   - AGENTS.md CS-1 — Adapter hanya boleh import src/types/
 */

/** @type {string} */
const BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CANONICAL_BASE_URL) ||
  'https://pasaluud1945.web.app';

/** @type {string} */
const DEFAULT_OG_IMAGE = `${BASE_URL}/images/og-banner.png`;

/**
 * @typedef {Object} MetaConfig
 * @property {string} title       - Judul halaman lengkap (sudah termasuk konteks, e.g. "5 Sila Pancasila — Dasar Negara Indonesia")
 * @property {string} description - Deskripsi halaman (120–160 karakter)
 * @property {string} path        - Path route bersih tanpa base prefix (e.g. '/pancasila', '/pasal/1')
 * @property {string} [ogImage]   - URL absolut OG image. Default: og-banner.png
 * @property {string} [ogType]    - OG type. Default: 'website'. Gunakan 'article' untuk /pasal/:nomor
 */

/**
 * Perbarui semua SEO meta tags untuk route yang aktif.
 * Dipanggil di setiap route change dari routes.js, dan opsional dari page.mount()
 * setelah data dinamis tersedia.
 *
 * @param {MetaConfig} config
 */
export function updateMetaTags({ title, description, path, ogImage, ogType = 'website' }) {
  const canonicalUrl = `${BASE_URL}${path}`;
  const imageUrl = ogImage ?? DEFAULT_OG_IMAGE;

  // ── Primary SEO ─────────────────────────────────────────────────────────────
  document.title = title;
  _setMeta('name', 'description', description);
  _setLink('canonical', canonicalUrl);

  // ── Open Graph ──────────────────────────────────────────────────────────────
  _setMeta('property', 'og:title', title);
  _setMeta('property', 'og:description', description);
  _setMeta('property', 'og:url', canonicalUrl);
  _setMeta('property', 'og:image', imageUrl);
  _setMeta('property', 'og:type', ogType);

  // ── Twitter Card ────────────────────────────────────────────────────────────
  _setMeta('name', 'twitter:title', title);
  _setMeta('name', 'twitter:description', description);
  _setMeta('name', 'twitter:image', imageUrl);
}

// =============================================================================
// Private helpers
// =============================================================================

/**
 * Upsert sebuah <meta> tag di <head>.
 * Jika belum ada, elemen baru dibuat dan di-append ke <head>.
 *
 * @param {string} attrName   - Nama atribut selector ('name' atau 'property')
 * @param {string} attrValue  - Nilai atribut selector (e.g. 'description', 'og:title')
 * @param {string} content    - Nilai yang diset ke atribut 'content'
 */
function _setMeta(attrName, attrValue, content) {
  let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Upsert sebuah <link> tag di <head>.
 * Jika belum ada, elemen baru dibuat dan di-append ke <head>.
 *
 * @param {string} rel   - Nilai atribut 'rel' (e.g. 'canonical')
 * @param {string} href  - Nilai yang diset ke atribut 'href'
 */
function _setLink(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}
