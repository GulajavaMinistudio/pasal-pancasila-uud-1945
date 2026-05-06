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
const BAB_PASAL_DATA_FILE = join(ROOT_DIR, 'public', 'data', 'babpasal.json');

// =============================================================================
// Definisi Route Statis
// Sesuai TASK-033: hanya route statis utama tanpa route dinamis
// Catatan: /cari TIDAK dimasukkan — tidak ada konten unik per URL
// =============================================================================

/**
 * @typedef {{ path: string; priority: string; changefreq: string }} UrlEntry
 */

/** @type {UrlEntry[]} */
const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'monthly' },
  { path: '/pancasila', priority: '0.8', changefreq: 'monthly' },
  { path: '/butir-pancasila', priority: '0.8', changefreq: 'monthly' },
  { path: '/pembukaan', priority: '0.8', changefreq: 'monthly' },
  { path: '/pasal', priority: '0.8', changefreq: 'monthly' },
  { path: '/bab-pasal', priority: '0.8', changefreq: 'monthly' },
  { path: '/uud-asli', priority: '0.8', changefreq: 'monthly' },
  { path: '/amandemen', priority: '0.8', changefreq: 'monthly' },
  { path: '/tentang', priority: '0.8', changefreq: 'monthly' },
];

// =============================================================================
// Helpers
// =============================================================================

/**
 * Hasilkan URL entry untuk sila/1–sila/5.
 *
 * @returns {UrlEntry[]}
 */
function buildDynamicSilaRoutes() {
  return Array.from({ length: 5 }, (_, i) => ({
    path: `/sila/${i + 1}`,
    priority: '0.8',
    changefreq: 'monthly',
  }));
}

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
    changefreq: 'monthly',
  }));
}

/**
 * Hasilkan URL entry untuk bab-pasal/1–21 berdasarkan data babpasal.json.
 *
 * @returns {UrlEntry[]}
 */
function buildBabPasalRoutes() {
  const raw = readFileSync(BAB_PASAL_DATA_FILE, 'utf-8');

  /** @type {{ isi_bab_pasal: Array<unknown> }} */
  const parsed = JSON.parse(raw);

  return parsed.isi_bab_pasal.map((_, index) => ({
    path: `/bab-pasal/${index + 1}`,
    priority: '0.8',
    changefreq: 'monthly',
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
  const dynamicSilaRoutes = buildDynamicSilaRoutes();
  const dynamicPasalRoutes = buildDynamicPasalRoutes();
  const babPasalRoutes = buildBabPasalRoutes();

  const allRoutes = [
    ...STATIC_ROUTES,
    ...dynamicSilaRoutes,
    ...dynamicPasalRoutes,
    ...babPasalRoutes,
  ];

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
