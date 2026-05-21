/**
 * @file test/e2e/pwa.spec.js
 * @description E2E tests — Progressive Web App (TASK-066, TASK-067, TASK-011)
 *
 * Verifikasi:
 *   TASK-066: manifest.json valid dan Service Worker ter-register
 *   TASK-067: Offline mode — OfflineIndicator muncul saat koneksi terputus
 *   TASK-011: Offline indicator tampil/hilang sesuai status koneksi
 */

import { expect, test } from '@playwright/test';

// Base path GitHub Pages — konsisten dengan vite.config.js
const BASE = '/pasal-pancasila-uud-1945';

// =============================================================================
// TASK-066: Web App Manifest Valid
// =============================================================================

test.describe('Web App Manifest — TASK-066', () => {
  test('manifest.json dapat diakses dan berformat JSON valid', async ({ page }) => {
    const response = await page.request.get(`${BASE}/manifest.json`);
    expect(response.status()).toBe(200);
    const manifest = await response.json();
    expect(manifest).toBeTruthy();
  });

  test('manifest.json memiliki field name yang benar', async ({ page }) => {
    const response = await page.request.get(`${BASE}/manifest.json`);
    const manifest = await response.json();
    expect(manifest.name).toBe('Pancasila & UUD 1945');
  });

  test('manifest.json memiliki field short_name', async ({ page }) => {
    const response = await page.request.get(`${BASE}/manifest.json`);
    const manifest = await response.json();
    expect(manifest.short_name).toBeTruthy();
  });

  test('manifest.json memiliki start_url yang benar', async ({ page }) => {
    const response = await page.request.get(`${BASE}/manifest.json`);
    const manifest = await response.json();
    expect(manifest.start_url).toBeTruthy();
    expect(manifest.start_url).toContain('pasal-pancasila-uud-1945');
  });

  test('manifest.json memiliki display: standalone', async ({ page }) => {
    const response = await page.request.get(`${BASE}/manifest.json`);
    const manifest = await response.json();
    expect(manifest.display).toBe('standalone');
  });

  test('manifest.json memiliki theme_color merah (#C62828)', async ({ page }) => {
    const response = await page.request.get(`${BASE}/manifest.json`);
    const manifest = await response.json();
    expect(manifest.theme_color?.toUpperCase()).toBe('#C62828');
  });

  test('manifest.json memiliki minimal 2 ikon (192px dan 512px)', async ({ page }) => {
    const response = await page.request.get(`${BASE}/manifest.json`);
    const manifest = await response.json();
    expect(Array.isArray(manifest.icons)).toBe(true);
    expect(manifest.icons.length).toBeGreaterThanOrEqual(2);

    const sizes = manifest.icons.map((icon) => icon.sizes);
    expect(sizes.some((s) => s && s.includes('192'))).toBe(true);
    expect(sizes.some((s) => s && s.includes('512'))).toBe(true);
  });

  test('manifest.json memiliki maskable icon (512px)', async ({ page }) => {
    const response = await page.request.get(`${BASE}/manifest.json`);
    const manifest = await response.json();
    const maskable = manifest.icons.find(
      (icon) => icon.purpose && icon.purpose.includes('maskable')
    );
    expect(maskable).toBeTruthy();
  });
});

// =============================================================================
// TASK-066: Service Worker Registration
// =============================================================================

test.describe('Service Worker Registration — TASK-066', () => {
  test('Service Worker script dapat diakses (sw.js tersedia)', async ({ page }) => {
    // Kunjungi halaman utama terlebih dahulu agar SW registration diinisiasi
    await page.goto(`${BASE}/`);
    await page.waitForSelector('.home-page', { timeout: 10_000 });

    // Cek apakah file sw.js bisa diakses (tersedia di dist setelah build)
    const swResponse = await page.request.get(`${BASE}/sw.js`);
    expect(swResponse.status()).toBe(200);
  });

  test('navigator.serviceWorker tersedia di browser', async ({ page }) => {
    await page.goto(`${BASE}/`);
    await page.waitForSelector('.home-page', { timeout: 10_000 });

    const hasSW = await page.evaluate(() => 'serviceWorker' in navigator);
    expect(hasSW).toBe(true);
  });

  test('meta theme-color terdapat di halaman', async ({ page }) => {
    await page.goto(`${BASE}/`);
    const themeColor = await page.$eval('meta[name="theme-color"]', (el) =>
      el.getAttribute('content')
    );
    expect(themeColor).toBe('#C62828');
  });

  test('apple-touch-icon link terdapat di halaman', async ({ page }) => {
    await page.goto(`${BASE}/`);
    const appleIcon = await page.$eval('link[rel="apple-touch-icon"]', (el) =>
      el.getAttribute('href')
    );
    expect(appleIcon).toBeTruthy();
    expect(appleIcon).toContain('icon-180');
  });
});

// =============================================================================
// TASK-067 & TASK-011: Offline Indicator
// =============================================================================

test.describe('Offline Indicator — TASK-067, TASK-011', () => {
  test('OfflineIndicator component ter-render di halaman (hidden saat online)', async ({
    page,
  }) => {
    await page.goto(`${BASE}/`);
    await page.waitForSelector('.home-page', { timeout: 10_000 });

    // Banner ada di DOM tapi tersembunyi saat online
    const banner = page.locator('[data-offline-banner]');
    await expect(banner).toBeAttached();

    // Saat online: elemen harus memiliki atribut hidden
    const isHidden = await banner.getAttribute('hidden');
    expect(isHidden).not.toBeNull();
  });

  test('OfflineIndicator tampil saat context offline disimulasikan', async ({ context, page }) => {
    await page.goto(`${BASE}/`);
    await page.waitForSelector('.home-page', { timeout: 10_000 });

    // Simulasikan kondisi offline di level context
    await context.setOffline(true);

    // Tunggu browser mengirim event 'offline' ke halaman
    // dan OfflineIndicator meresponsnya
    await page.evaluate(() => window.dispatchEvent(new Event('offline')));

    // Tunggu banner muncul (hapus hidden + tambah class visible)
    const banner = page.locator('[data-offline-banner]');
    await expect(banner).not.toHaveAttribute('hidden', { timeout: 2000 });

    // Restore online
    await context.setOffline(false);
  });

  test('OfflineIndicator memiliki role="status" untuk screen readers', async ({ page }) => {
    await page.goto(`${BASE}/`);
    await page.waitForSelector('.home-page', { timeout: 10_000 });

    const banner = page.locator('[data-offline-banner]');
    const role = await banner.getAttribute('role');
    expect(role).toBe('status');
  });

  test('OfflineIndicator memiliki aria-live="polite"', async ({ page }) => {
    await page.goto(`${BASE}/`);
    await page.waitForSelector('.home-page', { timeout: 10_000 });

    const banner = page.locator('[data-offline-banner]');
    const ariaLive = await banner.getAttribute('aria-live');
    expect(ariaLive).toBe('polite');
  });
});

// =============================================================================
// TASK-066: PWA Icons dapat diakses
// =============================================================================

test.describe('PWA Icons dapat diakses — TASK-066', () => {
  test('icon-192.png dapat diakses', async ({ page }) => {
    const response = await page.request.get(`${BASE}/icons/icon-192.png`);
    expect(response.status()).toBe(200);
  });

  test('icon-512.png dapat diakses', async ({ page }) => {
    const response = await page.request.get(`${BASE}/icons/icon-512.png`);
    expect(response.status()).toBe(200);
  });

  test('icon-180.png (Apple touch icon) dapat diakses', async ({ page }) => {
    const response = await page.request.get(`${BASE}/icons/icon-180.png`);
    expect(response.status()).toBe(200);
  });

  test('favicon icon-32.png dapat diakses', async ({ page }) => {
    const response = await page.request.get(`${BASE}/icons/icon-32.png`);
    expect(response.status()).toBe(200);
  });
});
