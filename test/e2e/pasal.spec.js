/**
 * @file test/e2e/pasal.spec.js
 * @description E2E tests — halaman Pasal UUD 1945 (TASK-052, TASK-053, TASK-054)
 *
 * Verifikasi:
 *   TASK-052: /pasal → daftar semua pasal tampil dengan badge amandemen
 *   TASK-053: /pasal/:nomor → detail pasal tampil dengan ayat dan navigasi prev/next
 *   TASK-054: /pasal/:nomor (tidak ditemukan) → halaman error inline tampil
 */

import { expect, test } from '@playwright/test';

// Base path GitHub Pages — konsisten dengan vite.config.js
const BASE = '/pasal-pancasila-uud-1945';

// =============================================================================
// TASK-052: Daftar Pasal (/pasal)
// =============================================================================

test.describe('Halaman Daftar Pasal ("/pasal") — TASK-052', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/pasal`);
    await page.waitForSelector('.pasal-list', { timeout: 10_000 });
  });

  test('menampilkan daftar pasal dengan setidaknya 37 item', async ({ page }) => {
    const cards = page.locator('[data-pasal]');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(37);
  });

  test('setiap kartu pasal menampilkan judul pasal', async ({ page }) => {
    const firstCard = page.locator('[data-pasal]').first();
    await expect(firstCard).toContainText('Pasal');
  });

  test('menampilkan badge amandemen pada pasal yang diamandemen', async ({ page }) => {
    const badges = page.locator('.badge-amandemen');
    const count = await badges.count();
    expect(count).toBeGreaterThan(0);
  });

  test('menampilkan badge jumlah ayat pada setiap kartu', async ({ page }) => {
    const firstCard = page.locator('[data-pasal]').first();
    const badgeAyat = firstCard.locator('.badge-ayat');
    await expect(badgeAyat).toBeVisible();
    await expect(badgeAyat).toContainText('Ayat');
  });

  test('link hint pencarian mengarah ke route /cari', async ({ page }) => {
    const searchHint = page.locator('.pasal-search-hint');
    await expect(searchHint).toBeVisible();
    const href = await searchHint.getAttribute('href');
    expect(href).toContain('/cari');
  });

  test('judul halaman browser mengandung "Daftar Pasal UUD 1945"', async ({ page }) => {
    await expect(page).toHaveTitle(/Daftar Pasal UUD 1945/);
  });

  test('klik kartu "Pasal 1" mengarahkan ke halaman detail', async ({ page }) => {
    const pasal1 = page.locator('[data-pasal="Pasal 1"]');
    await pasal1.click();
    await expect(page).toHaveURL(/\/pasal\/1$/);
    await page.waitForSelector('.pasal-detail-header', { timeout: 10_000 });
  });
});

// =============================================================================
// TASK-053: Detail Pasal (/pasal/:nomor)
// =============================================================================

test.describe('Halaman Detail Pasal ("/pasal/:nomor") — TASK-053', () => {
  test('menampilkan halaman detail Pasal 1 dengan benar', async ({ page }) => {
    await page.goto(`${BASE}/pasal/1`);
    await page.waitForSelector('.pasal-detail-header', { timeout: 10_000 });

    // Judul pasal
    const title = page.locator('.pasal-detail-header__title');
    await expect(title).toBeVisible();
    await expect(title).toContainText('Pasal 1');
  });

  test('menampilkan daftar ayat dalam Pasal 1', async ({ page }) => {
    await page.goto(`${BASE}/pasal/1`);
    await page.waitForSelector('.pasal-ayat-list', { timeout: 10_000 });

    const ayatCards = page.locator('.pasal-ayat-card');
    const count = await ayatCards.count();
    // Pasal 1 memiliki 3 ayat
    expect(count).toBe(3);
  });

  test('nomor ayat ditampilkan di setiap kartu ayat', async ({ page }) => {
    await page.goto(`${BASE}/pasal/1`);
    await page.waitForSelector('.pasal-ayat-list', { timeout: 10_000 });

    const firstNumber = page.locator('.pasal-ayat-card__number').first();
    await expect(firstNumber).toBeVisible();
    await expect(firstNumber).toContainText('1');
  });

  test('menampilkan nama bab untuk Pasal 1', async ({ page }) => {
    await page.goto(`${BASE}/pasal/1`);
    await page.waitForSelector('.pasal-detail-header', { timeout: 10_000 });

    const babLabel = page.locator('.pasal-detail-header__bab');
    await expect(babLabel).toBeVisible();
    await expect(babLabel).toContainText('Bab I');
  });

  test('menampilkan badge amandemen untuk Pasal 1 (diamandemen 3 kali)', async ({ page }) => {
    await page.goto(`${BASE}/pasal/1`);
    await page.waitForSelector('.pasal-detail-header', { timeout: 10_000 });

    const badge = page.locator('.badge-amandemen');
    await expect(badge).toBeVisible();
    await expect(badge).toContainText('Amandemen');
  });

  test('tombol kembali ke daftar pasal tersedia', async ({ page }) => {
    await page.goto(`${BASE}/pasal/1`);
    await page.waitForSelector('.pasal-detail-header', { timeout: 10_000 });

    const backLink = page.locator('.page-back-link');
    await expect(backLink).toBeVisible();
    const href = await backLink.getAttribute('href');
    expect(href).toContain('/pasal');
  });

  test('navigasi "selanjutnya" ada dan mengarah ke pasal berikutnya', async ({ page }) => {
    await page.goto(`${BASE}/pasal/1`);
    await page.waitForSelector('.pasal-nav', { timeout: 10_000 });

    // Pasal 1 tidak punya prev, tapi punya next
    const nextLink = page.locator('.pasal-nav__next:not(.pasal-nav__next--empty)');
    await expect(nextLink).toBeVisible();
  });

  test('navigasi "sebelumnya" tersembunyi di Pasal 1 (pasal pertama)', async ({ page }) => {
    await page.goto(`${BASE}/pasal/1`);
    await page.waitForSelector('.pasal-nav', { timeout: 10_000 });

    const prevEmpty = page.locator('.pasal-nav__prev--empty');
    await expect(prevEmpty).toBeAttached();
  });

  test('mendukung deep link dengan huruf besar — pasal 6A', async ({ page }) => {
    await page.goto(`${BASE}/pasal/6A`);
    await page.waitForSelector('.pasal-detail-header', { timeout: 10_000 });

    const title = page.locator('.pasal-detail-header__title');
    await expect(title).toContainText('Pasal 6A');
  });

  test('mendukung deep link dengan huruf kecil — case insensitive', async ({ page }) => {
    await page.goto(`${BASE}/pasal/6a`);
    await page.waitForSelector('.pasal-detail-header', { timeout: 10_000 });

    const title = page.locator('.pasal-detail-header__title');
    await expect(title).toContainText('Pasal 6A');
  });

  test('judul halaman browser mengandung nama pasal', async ({ page }) => {
    await page.goto(`${BASE}/pasal/1`);
    await page.waitForSelector('.pasal-detail-header', { timeout: 10_000 });
    await expect(page).toHaveTitle(/Pasal 1/);
  });
});

// =============================================================================
// TASK-054: Pasal Tidak Ditemukan — error 404 inline
// =============================================================================

test.describe('Pasal Tidak Ditemukan ("/pasal/:nomor") — TASK-054', () => {
  test('menampilkan pesan error inline jika nomor pasal tidak ada', async ({ page }) => {
    await page.goto(`${BASE}/pasal/999`);
    // Tunggu hingga loading selesai
    await page.waitForSelector('[data-action="retry"]', { timeout: 10_000 });

    const errorEl = page.locator('[data-action="retry"]');
    await expect(errorEl).toBeVisible();
  });

  test('tombol kembali pada error state mengarahkan ke daftar pasal', async ({ page }) => {
    await page.goto(`${BASE}/pasal/999`);
    await page.waitForSelector('[data-action="retry"]', { timeout: 10_000 });

    const retryButton = page.locator('[data-action="retry"]');
    await retryButton.click();

    await expect(page).toHaveURL(/\/pasal$/);
    await page.waitForSelector('.pasal-list', { timeout: 10_000 });
  });
});
