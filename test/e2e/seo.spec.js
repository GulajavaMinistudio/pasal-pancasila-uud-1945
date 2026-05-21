/**
 * @file test/e2e/seo.spec.js
 * @description E2E tests — SEO dan Structured Data (TASK-070 sampai TASK-074)
 *
 * Verifikasi:
 *   TASK-070: Meta tags title & description diperbarui secara dinamis per route
 *   TASK-071: JSON-LD structured data tersedia di halaman detail
 *   TASK-072: sitemap.xml valid dan mengandung URL konten utama
 *   TASK-073: robots.txt melarang crawl halaman /cari
 *   TASK-074: Konfigurasi Lighthouse CI (lighthouserc.json) berisi threshold yang tepat
 */

import { expect, test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Base path GitHub Pages — konsisten dengan vite.config.js
const BASE = '/pasal-pancasila-uud-1945';

// =============================================================================
// TASK-070: Meta Tags dinamis per route
// =============================================================================

test.describe('Meta Tags Dinamis — TASK-070', () => {
  test('halaman beranda (/) memiliki title yang bermakna', async ({ page }) => {
    await page.goto(`${BASE}/`);
    await page.waitForSelector('.home-page', { timeout: 10_000 });

    const title = await page.title();
    expect(title.length).toBeGreaterThan(10);
    // Judul beranda harus menyebut "Pancasila" atau "UUD 1945"
    expect(title.toLowerCase()).toMatch(/pancasila|uud/i);
  });

  test('halaman beranda (/) memiliki meta description yang tidak kosong', async ({ page }) => {
    await page.goto(`${BASE}/`);
    await page.waitForSelector('.home-page', { timeout: 10_000 });

    const desc = await page.$eval(
      'meta[name="description"]',
      (el) => el.getAttribute('content') ?? ''
    );
    expect(desc.length).toBeGreaterThan(50);
  });

  test('halaman /pasal/1 memiliki title yang mengandung "Pasal 1"', async ({ page }) => {
    await page.goto(`${BASE}/pasal/1`);
    // Tunggu konten dinamis tersedia
    await page.waitForSelector('.pasal-detail-header', { timeout: 10_000 });
    // Tunggu title diperbarui oleh updateMetaTags
    await page.waitForFunction(
      () => document.title.includes('Pasal 1') || document.title.includes('pasal'),
      { timeout: 5000 }
    );

    const title = await page.title();
    expect(title).toMatch(/pasal\s*1/i);
  });

  test('halaman /pasal/1 memiliki meta description tidak kosong', async ({ page }) => {
    await page.goto(`${BASE}/pasal/1`);
    await page.waitForSelector('.pasal-detail-header', { timeout: 10_000 });

    const desc = await page.$eval(
      'meta[name="description"]',
      (el) => el.getAttribute('content') ?? ''
    );
    expect(desc.length).toBeGreaterThan(20);
  });

  test('halaman /pancasila memiliki title yang mengandung "Pancasila"', async ({ page }) => {
    await page.goto(`${BASE}/pancasila`);
    await page.waitForSelector('[data-share-btn]', { timeout: 10_000 });
    await page.waitForFunction(() => document.title.toLowerCase().includes('pancasila'), {
      timeout: 5000,
    });

    const title = await page.title();
    expect(title.toLowerCase()).toContain('pancasila');
  });

  test('halaman /sila/1 memiliki title yang mengandung "Sila"', async ({ page }) => {
    await page.goto(`${BASE}/sila/1`);
    await page.waitForSelector('[data-share-btn]', { timeout: 10_000 });
    await page.waitForFunction(() => document.title.toLowerCase().includes('sila'), {
      timeout: 5000,
    });

    const title = await page.title();
    expect(title.toLowerCase()).toContain('sila');
  });

  test('meta og:title sinkron dengan document.title', async ({ page }) => {
    await page.goto(`${BASE}/pasal/1`);
    await page.waitForSelector('.pasal-detail-header', { timeout: 10_000 });
    await page.waitForFunction(() => document.title.includes('Pasal 1'), { timeout: 5000 });

    const ogTitle = await page.$eval(
      'meta[property="og:title"]',
      (el) => el.getAttribute('content') ?? ''
    );
    const pageTitle = await page.title();
    expect(ogTitle).toBe(pageTitle);
  });

  test('canonical URL di-update sesuai route /pasal/1', async ({ page }) => {
    await page.goto(`${BASE}/pasal/1`);
    await page.waitForSelector('.pasal-detail-header', { timeout: 10_000 });

    const canonical = await page.$eval(
      'link[rel="canonical"]',
      (el) => el.getAttribute('href') ?? ''
    );
    expect(canonical).toContain('/pasal/1');
  });
});

// =============================================================================
// TASK-071: JSON-LD Structured Data
// =============================================================================

test.describe('JSON-LD Structured Data — TASK-071', () => {
  test('index.html memiliki JSON-LD WebSite schema statis', async ({ page }) => {
    await page.goto(`${BASE}/`);
    await page.waitForSelector('.home-page', { timeout: 10_000 });

    // JSON-LD statis di index.html — id="__jsonld-website"
    const jsonldContent = await page.$eval('#__jsonld-website', (el) => el.textContent ?? '');
    expect(jsonldContent.length).toBeGreaterThan(10);

    // Verifikasi format JSON valid
    const parsed = JSON.parse(jsonldContent);
    expect(parsed['@context']).toBe('https://schema.org');
    expect(parsed['@type']).toBe('WebSite');
  });

  test('halaman /pasal/1 memiliki JSON-LD Article schema dinamis', async ({ page }) => {
    await page.goto(`${BASE}/pasal/1`);
    await page.waitForSelector('.pasal-detail-header', { timeout: 10_000 });

    // Tunggu JSON-LD dinamis di-inject — gunakan state:'attached' karena <script> selalu hidden
    await page.waitForSelector('#__jsonld-page', { state: 'attached', timeout: 8000 });

    const jsonldContent = await page.$eval('#__jsonld-page', (el) => el.textContent ?? '');

    const parsed = JSON.parse(jsonldContent);
    // injectJsonLd menyimpan data sebagai array schema
    const schemas = Array.isArray(parsed) ? parsed : [parsed];
    expect(schemas.some((s) => s['@context'] === 'https://schema.org')).toBe(true);
    expect(schemas.some((s) => s['@type'])).toBe(true);
  });

  test('halaman /pancasila memiliki JSON-LD schema dinamis', async ({ page }) => {
    await page.goto(`${BASE}/pancasila`);
    await page.waitForSelector('[data-share-btn]', { timeout: 10_000 });
    // Gunakan state:'attached' karena <script> selalu berstatus hidden di DOM
    await page.waitForSelector('#__jsonld-page', { state: 'attached', timeout: 8000 });

    const jsonldContent = await page.$eval('#__jsonld-page', (el) => el.textContent ?? '');
    const parsed = JSON.parse(jsonldContent);
    // injectJsonLd menyimpan data sebagai array schema
    const schemas = Array.isArray(parsed) ? parsed : [parsed];
    expect(schemas.some((s) => s['@context'] === 'https://schema.org')).toBe(true);
  });

  test('JSON-LD statis WebSite memiliki SearchAction (sitelinks search)', async ({ page }) => {
    await page.goto(`${BASE}/`);
    await page.waitForSelector('.home-page', { timeout: 10_000 });

    const jsonldContent = await page.$eval('#__jsonld-website', (el) => el.textContent ?? '');
    const parsed = JSON.parse(jsonldContent);
    expect(parsed.potentialAction).toBeTruthy();
    expect(parsed.potentialAction['@type']).toBe('SearchAction');
  });

  test('JSON-LD BreadcrumbList ada di halaman /pasal/1', async ({ page }) => {
    await page.goto(`${BASE}/pasal/1`);
    await page.waitForSelector('.pasal-detail-header', { timeout: 10_000 });
    // Gunakan state:'attached' karena <script> selalu berstatus hidden di DOM
    await page.waitForSelector('#__jsonld-page', { state: 'attached', timeout: 8000 });

    const jsonldContent = await page.$eval('#__jsonld-page', (el) => el.textContent ?? '');
    const parsed = JSON.parse(jsonldContent);

    // Bisa berupa single schema atau array
    const schemas = Array.isArray(parsed) ? parsed : [parsed];
    const hasBreadcrumb = schemas.some((s) => s['@type'] === 'BreadcrumbList');
    expect(hasBreadcrumb).toBe(true);
  });
});

// =============================================================================
// TASK-072: sitemap.xml
// =============================================================================

test.describe('Sitemap XML — TASK-072', () => {
  test('sitemap.xml dapat diakses dan berformat XML valid', async ({ page }) => {
    const response = await page.request.get(`${BASE}/sitemap.xml`);
    expect(response.status()).toBe(200);

    const contentType = response.headers()['content-type'] ?? '';
    // Content-type bisa berupa text/xml atau application/xml
    expect(contentType).toMatch(/xml/i);
  });

  test('sitemap.xml mengandung URL halaman Pancasila', async ({ page }) => {
    const response = await page.request.get(`${BASE}/sitemap.xml`);
    const body = await response.text();
    expect(body).toContain('/pancasila');
  });

  test('sitemap.xml mengandung URL halaman Pasal', async ({ page }) => {
    const response = await page.request.get(`${BASE}/sitemap.xml`);
    const body = await response.text();
    expect(body).toContain('/pasal');
  });

  test('sitemap.xml mengandung URL halaman Pembukaan UUD', async ({ page }) => {
    const response = await page.request.get(`${BASE}/sitemap.xml`);
    const body = await response.text();
    expect(body).toContain('/pembukaan');
  });

  test('sitemap.xml tidak mengandung URL halaman /cari (halaman pencarian)', async ({ page }) => {
    const response = await page.request.get(`${BASE}/sitemap.xml`);
    const body = await response.text();
    // Halaman cari tidak perlu di-crawl, sesuai robots.txt
    expect(body).not.toContain('>/cari<');
  });

  test('sitemap.xml mempunyai tag <urlset> (XML namespace sitemap valid)', async ({ page }) => {
    const response = await page.request.get(`${BASE}/sitemap.xml`);
    const body = await response.text();
    expect(body).toContain('<urlset');
    expect(body).toContain('sitemaps.org/schemas/sitemap');
  });
});

// =============================================================================
// TASK-073: robots.txt
// =============================================================================

test.describe('Robots.txt — TASK-073', () => {
  test('robots.txt dapat diakses', async ({ page }) => {
    const response = await page.request.get(`${BASE}/robots.txt`);
    expect(response.status()).toBe(200);
  });

  test('robots.txt melarang crawl halaman /cari', async ({ page }) => {
    const response = await page.request.get(`${BASE}/robots.txt`);
    const body = await response.text();
    expect(body).toContain('Disallow: /cari');
  });

  test('robots.txt mengizinkan crawl halaman umum', async ({ page }) => {
    const response = await page.request.get(`${BASE}/robots.txt`);
    const body = await response.text();
    expect(body).toContain('Allow: /');
  });

  test('robots.txt memuat link Sitemap', async ({ page }) => {
    const response = await page.request.get(`${BASE}/robots.txt`);
    const body = await response.text();
    expect(body.toLowerCase()).toContain('sitemap:');
  });

  test('robots.txt berisi User-agent directive', async ({ page }) => {
    const response = await page.request.get(`${BASE}/robots.txt`);
    const body = await response.text();
    expect(body).toContain('User-agent:');
  });
});

// =============================================================================
// TASK-074: Lighthouse CI Config (konfigurasi threshold)
// =============================================================================

test.describe('Lighthouse CI Konfigurasi — TASK-074', () => {
  test('lighthouserc.json ada di root proyek', () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const rootDir = path.resolve(__dirname, '../../');
    const lhrcPath = path.join(rootDir, 'lighthouserc.json');

    expect(fs.existsSync(lhrcPath)).toBe(true);
  });

  test('lighthouserc.json berisi threshold Performance >= 90', () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const rootDir = path.resolve(__dirname, '../../');
    const lhrcPath = path.join(rootDir, 'lighthouserc.json');

    const config = JSON.parse(fs.readFileSync(lhrcPath, 'utf-8'));
    const assertions = config?.ci?.assert?.assertions;
    expect(assertions).toBeTruthy();

    // Performance threshold
    const perfScore = assertions['categories:performance'];
    expect(perfScore).toBeTruthy();
    // Bisa berupa array [type, options] atau langsung object
    const perfMin = Array.isArray(perfScore) ? perfScore[1]?.minScore : perfScore?.minScore;
    expect(perfMin).toBeGreaterThanOrEqual(0.9);
  });

  test('lighthouserc.json berisi threshold Accessibility >= 90', () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const rootDir = path.resolve(__dirname, '../../');
    const lhrcPath = path.join(rootDir, 'lighthouserc.json');

    const config = JSON.parse(fs.readFileSync(lhrcPath, 'utf-8'));
    const assertions = config?.ci?.assert?.assertions;

    const a11yScore = assertions['categories:accessibility'];
    expect(a11yScore).toBeTruthy();
    const a11yMin = Array.isArray(a11yScore) ? a11yScore[1]?.minScore : a11yScore?.minScore;
    expect(a11yMin).toBeGreaterThanOrEqual(0.9);
  });

  test('lighthouserc.json berisi threshold SEO >= 95', () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const rootDir = path.resolve(__dirname, '../../');
    const lhrcPath = path.join(rootDir, 'lighthouserc.json');

    const config = JSON.parse(fs.readFileSync(lhrcPath, 'utf-8'));
    const assertions = config?.ci?.assert?.assertions;

    const seoScore = assertions['categories:seo'];
    expect(seoScore).toBeTruthy();
    const seoMin = Array.isArray(seoScore) ? seoScore[1]?.minScore : seoScore?.minScore;
    expect(seoMin).toBeGreaterThanOrEqual(0.95);
  });
});
