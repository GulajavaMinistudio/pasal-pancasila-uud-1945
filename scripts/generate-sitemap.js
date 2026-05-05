#!/usr/bin/env node
/**
 * @file scripts/generate-sitemap.js
 * @description Generator sitemap.xml untuk SEO mesin pencari.
 *
 * Menghasilkan `public/sitemap.xml` yang mencakup:
 *   - Seluruh URL statis (14 route non-dinamis, kecuali /cari)
 *   - URL dinamis per sila (sila/1–5) dan per bab (bab-pasal/1–21)
 *   - URL dinamis per pasal — di-generate dari `public/data/pasaluud45.json`
 *
 * Route /cari dikecualikan dari sitemap karena tidak memiliki konten unik
 * yang berdiri sendiri (konten bergantung pada query parameter).
 *
 * Dijalankan sebagai bagian dari prebuild:
 *   "prebuild": "... && node scripts/generate-sitemap.js"
 *
 * Referensi planning: TASK-032–036 (Phase 3.5)
 * Referensi spec:     spec-seo-pasaluud1945.md §6.1
 * Jalankan: node scripts/generate-sitemap.js
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT_DIR = join(__dirname, '..');

const BASE_URL = 'https://pasaluud1945.web.app';
const OUTPUT_FILE = join(ROOT_DIR, 'public', 'sitemap.xml');
const PASAL_DATA_FILE = join(ROOT_DIR, 'public', 'data', 'pasaluud45.json');

// =============================================================================
// Definisi Route Statis
// Urutan: homepage dulu, lalu konten utama (priority tinggi), konten pendukung
// Catatan: /cari TIDAK dimasukkan — tidak ada konten unik per URL
// =============================================================================

/**
 * @typedef {{ path: string; priority: string; changefreq: string }} UrlEntry
 */

/** @type {UrlEntry[]} */
const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'monthly' },
  { path: '/pancasila', priority: '0.9', changefreq: 'yearly' },
  { path: '/pembukaan', priority: '0.9', changefreq: 'yearly' },
  { path: '/pasal', priority: '0.9', changefreq: 'yearly' },
  { path: '/sila/1', priority: '0.8', changefreq: 'yearly' },
  { path: '/sila/2', priority: '0.8', changefreq: 'yearly' },
  { path: '/sila/3', priority: '0.8', changefreq: 'yearly' },
  { path: '/sila/4', priority: '0.8', changefreq: 'yearly' },
  { path: '/sila/5', priority: '0.8', changefreq: 'yearly' },
  { path: '/butir-pancasila', priority: '0.8', changefreq: 'yearly' },
  { path: '/bab-pasal', priority: '0.8', changefreq: 'yearly' },
  { path: '/uud-asli', priority: '0.7', changefreq: 'yearly' },
  { path: '/amandemen', priority: '0.7', changefreq: 'yearly' },
  { path: '/tentang', priority: '0.4', changefreq: 'monthly' },
];

// =============================================================================
// Helpers
// =============================================================================

/**
 * Baca namapasal dari pasaluud45.json dan hasilkan URL entry per pasal.
 * Nomor pasal diekstrak dengan membuang prefix 'Pasal ' dari namapasal.
 *
 * @returns {UrlEntry[]}
 */
function buildDynamicPasalRoutes() {
  const raw = readFileSync(PASAL_DATA_FILE, 'utf-8');

  /** @type {{ data: Array<{ namapasal: string }> }} */
  const parsed = JSON.parse(raw);

  return parsed.data.map((pasal) => ({
    path: `/pasal/${pasal.namapasal.replace('Pasal ', '')}`,
    priority: '0.8',
    changefreq: 'yearly',
  }));
}

/**
 * Hasilkan URL entry untuk bab-pasal/1–21.
 *
 * @returns {UrlEntry[]}
 */
function buildBabPasalRoutes() {
  return Array.from({ length: 21 }, (_, i) => ({
    path: `/bab-pasal/${i + 1}`,
    priority: '0.7',
    changefreq: 'yearly',
  }));
}

/**
 * Render satu blok <url> XML.
 *
 * @param {UrlEntry} entry
 * @returns {string}
 */
function renderUrlBlock({ path, changefreq, priority }) {
  return [
    '  <url>',
    `    <loc>${BASE_URL}${path}</loc>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n');
}

// =============================================================================
// Main
// =============================================================================

/**
 * Generate isi XML sitemap dari semua route.
 *
 * @returns {string}
 */
function buildSitemapXml() {
  const dynamicPasalRoutes = buildDynamicPasalRoutes();
  const babPasalRoutes = buildBabPasalRoutes();

  const allRoutes = [...STATIC_ROUTES, ...dynamicPasalRoutes, ...babPasalRoutes];

  const urlBlocks = allRoutes.map(renderUrlBlock).join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlBlocks,
    '</urlset>',
    '',
  ].join('\n');
}

// Pastikan direktori public/ ada sebelum menulis file
mkdirSync(join(ROOT_DIR, 'public'), { recursive: true });

const xml = buildSitemapXml();
writeFileSync(OUTPUT_FILE, xml, 'utf-8');

const totalUrls = xml.split('<url>').length - 1;
console.log(`✅ sitemap.xml generated — ${totalUrls} URLs → public/sitemap.xml`);
