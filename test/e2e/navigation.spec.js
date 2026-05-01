/**
 * @file test/e2e/navigation.spec.js
 * @description E2E tests — SPA navigation behavior dan bottom navigation (TASK-057)
 *
 * Verifikasi:
 *   - Navigasi via bottom navigation tidak melakukan full page reload
 *   - Active tab bottom navigation sinkron dengan URL aktif
 *   - Navigasi browser back/forward bekerja dengan benar
 *   - Deep link (URL langsung) untuk setiap route Phase 1.6 bekerja
 */

import { expect, test } from '@playwright/test';

const BASE = '/pasal-pancasila-uud-1945';

// ── SPA behavior ──────────────────────────────────────────────────────────

test.describe('SPA Navigation — tidak ada full page reload', () => {
  test('navigasi dari "/" ke "/pancasila" tidak melakukan page reload', async ({ page }) => {
    await page.goto(`${BASE}/`);
    await page.waitForSelector('.home-page', { timeout: 10_000 });

    let domContentLoadedCount = 0;
    page.on('request', (req) => {
      if (req.resourceType() === 'document') {
        domContentLoadedCount++;
      }
    });

    // Klik kartu Pancasila dari halaman beranda
    const pancasilaCard = page.locator('.home-card').filter({ hasText: '5 Sila Pancasila' });
    await pancasilaCard.click();

    await expect(page).toHaveURL(/\/pancasila/);
    await page.waitForSelector('.pancasila-card');

    // Tidak ada document request baru (tidak ada full reload)
    expect(domContentLoadedCount).toBe(0);
  });

  test('navigasi dari "/pancasila" ke "/sila/1" tidak melakukan page reload', async ({ page }) => {
    await page.goto(`${BASE}/pancasila`);
    await page.waitForSelector('.pancasila-card', { timeout: 10_000 });

    let documentRequests = 0;
    page.on('request', (req) => {
      if (req.resourceType() === 'document') documentRequests++;
    });

    const firstCard = page.locator('.pancasila-card').first();
    await firstCard.click();

    await expect(page).toHaveURL(/\/sila\/1/);
    expect(documentRequests).toBe(0);
  });

  test('tombol browser back berfungsi dalam SPA (popstate)', async ({ page }) => {
    // 1. Mulai di beranda
    await page.goto(`${BASE}/`);
    await page.waitForSelector('.home-page', { timeout: 10_000 });

    // 2. Navigasi ke /pancasila
    const pancasilaCard = page.locator('.home-card').filter({ hasText: '5 Sila Pancasila' });
    await pancasilaCard.click();
    await expect(page).toHaveURL(/\/pancasila/);
    await page.waitForSelector('.pancasila-card');

    // 3. Tekan tombol Back browser
    await page.goBack();

    // 4. Harus kembali ke beranda
    await expect(page).toHaveURL(new RegExp(`${BASE}/?$`));
    await page.waitForSelector('.home-page');
  });

  test('tombol browser forward berfungsi setelah back', async ({ page }) => {
    await page.goto(`${BASE}/`);
    await page.waitForSelector('.home-page', { timeout: 10_000 });

    // Navigasi ke /pancasila
    const pancasilaCard = page.locator('.home-card').filter({ hasText: '5 Sila Pancasila' });
    await pancasilaCard.click();
    await expect(page).toHaveURL(/\/pancasila/);

    // Back ke beranda
    await page.goBack();
    await expect(page).toHaveURL(new RegExp(`${BASE}/?$`));

    // Forward kembali ke /pancasila
    await page.goForward();
    await expect(page).toHaveURL(/\/pancasila/);
    await page.waitForSelector('.pancasila-card');
  });
});

// ── Bottom Navigation active state ───────────────────────────────────────

test.describe('Bottom Navigation — active tab sinkron dengan URL', () => {
  // Bottom nav hanya tampil pada viewport mobile (< 992px)
  test.use({ viewport: { width: 390, height: 844 } });

  test('tab Beranda aktif saat URL adalah "/"', async ({ page }) => {
    await page.goto(`${BASE}/`);
    await page.waitForSelector('.bottom-nav', { timeout: 10_000 });

    const berandaTab = page.locator('[data-bottom-nav-path="/"]');

    await expect(berandaTab).toHaveClass(/active/);
  });

  test('tab Pasal aktif saat URL adalah "/pasal"', async ({ page }) => {
    await page.goto(`${BASE}/pasal`);
    await page.waitForSelector('.bottom-nav', { timeout: 10_000 });

    const pasalTab = page.locator('[data-bottom-nav-path="/pasal"]');

    await expect(pasalTab).toHaveClass(/active/);
  });

  test('tab Amandemen aktif saat URL adalah "/amandemen"', async ({ page }) => {
    await page.goto(`${BASE}/amandemen`);
    await page.waitForSelector('.bottom-nav', { timeout: 10_000 });

    const amandemenTab = page.locator('[data-bottom-nav-path="/amandemen"]');

    await expect(amandemenTab).toHaveClass(/active/);
  });

  test('tab Beranda tidak aktif saat navigasi ke /pancasila', async ({ page }) => {
    await page.goto(`${BASE}/`);
    await page.waitForSelector('.home-page', { timeout: 10_000 });

    // Navigasi ke pancasila
    const pancasilaCard = page.locator('.home-card').filter({ hasText: '5 Sila Pancasila' });
    await pancasilaCard.click();
    await expect(page).toHaveURL(/\/pancasila/);

    // Tab beranda harus tidak aktif
    const berandaTab = page.locator('[data-bottom-nav-path="/"]');
    const classes = await berandaTab.getAttribute('class');
    expect(classes).not.toContain('active');
  });

  test('klik tab bottom nav tidak melakukan full page reload', async ({ page }) => {
    await page.goto(`${BASE}/`);
    await page.waitForSelector('.bottom-nav', { timeout: 10_000 });

    let documentRequests = 0;
    page.on('request', (req) => {
      if (req.resourceType() === 'document') documentRequests++;
    });

    // Klik tab Pasal pada bottom navigation
    const pasalTab = page.locator('[data-bottom-nav-path="/pasal"]');
    await pasalTab.click();

    await expect(page).toHaveURL(/\/pasal/);
    expect(documentRequests).toBe(0);
  });

  test('active state bottom nav diperbarui setelah klik tab', async ({ page }) => {
    await page.goto(`${BASE}/`);
    await page.waitForSelector('.bottom-nav', { timeout: 10_000 });

    // Klik tab Amandemen
    const amandemenTab = page.locator('[data-bottom-nav-path="/amandemen"]');
    await amandemenTab.click();

    await expect(page).toHaveURL(/\/amandemen/);

    // Tab Amandemen harus aktif, tab Beranda tidak aktif
    await expect(amandemenTab).toHaveClass(/active/);

    const berandaTab = page.locator('[data-bottom-nav-path="/"]');
    const berandaClasses = await berandaTab.getAttribute('class');
    expect(berandaClasses).not.toContain('active');
  });
});

// ── Deep link support ─────────────────────────────────────────────────────

test.describe('Deep link — URL langsung ke setiap route Phase 1.6', () => {
  test('URL langsung ke "/pancasila" menampilkan 5 sila', async ({ page }) => {
    await page.goto(`${BASE}/pancasila`);

    await page.waitForSelector('.pancasila-card', { timeout: 10_000 });
    const cards = page.locator('.pancasila-card');
    await expect(cards).toHaveCount(5);
  });

  test('URL langsung ke "/sila/2" menampilkan Sila 2', async ({ page }) => {
    await page.goto(`${BASE}/sila/2`);

    await page.waitForSelector('.sila-hero', { timeout: 10_000 });
    await expect(page.locator('.sila-hero__ordinal')).toContainText('Sila 2');
  });

  test('URL langsung ke "/butir-pancasila" menampilkan accordion', async ({ page }) => {
    await page.goto(`${BASE}/butir-pancasila`);

    await page.waitForSelector('.butir-accordion__item', { timeout: 10_000 });
    const items = page.locator('.butir-accordion__item');
    await expect(items).toHaveCount(5);
  });

  test('URL langsung ke "/pembukaan" menampilkan 4 alinea', async ({ page }) => {
    await page.goto(`${BASE}/pembukaan`);

    await page.waitForSelector('.alinea-card', { timeout: 10_000 });
    const cards = page.locator('.alinea-card');
    await expect(cards).toHaveCount(4);
  });

  test('URL yang tidak dikenal menampilkan halaman 404', async ({ page }) => {
    await page.goto(`${BASE}/halaman-tidak-ada-xyz`);

    // NotFoundPage harus tampil — biasanya memiliki class atau teks 404
    await expect(page.locator('body')).toContainText(/404|tidak ditemukan/i, { timeout: 10_000 });
  });
});
