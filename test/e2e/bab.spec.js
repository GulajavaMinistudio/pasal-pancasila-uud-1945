/**
 * @file test/e2e/bab.spec.js
 * @description E2E tests — halaman Bab & Pasal UUD 1945 (TASK-055, TASK-056)
 *
 * Verifikasi:
 *   TASK-055: /bab-pasal → daftar 21 bab tampil, expand/collapse berfungsi
 *   TASK-056: /bab-pasal/:nomor → detail bab tampil dengan daftar pasalnya
 */

import { expect, test } from '@playwright/test';

// Base path GitHub Pages — konsisten dengan vite.config.js
const BASE = '/pasal-pancasila-uud-1945';

// =============================================================================
// TASK-055: Daftar Bab (/bab-pasal)
// =============================================================================

test.describe('Halaman Daftar Bab ("/bab-pasal") — TASK-055', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/bab-pasal`);
    await page.waitForSelector('.bab-list', { timeout: 10_000 });
  });

  test('menampilkan 21 bab accordion', async ({ page }) => {
    const accordions = page.locator('.bab-accordion');
    const count = await accordions.count();
    expect(count).toBe(21);
  });

  test('setiap accordion menampilkan nama bab', async ({ page }) => {
    const firstLabel = page.locator('.bab-accordion__label').first();
    await expect(firstLabel).toBeVisible();
    await expect(firstLabel).toContainText('Bab I');
  });

  test('judul halaman browser mengandung "Daftar Bab UUD 1945"', async ({ page }) => {
    await expect(page).toHaveTitle(/Daftar Bab UUD 1945/);
  });

  test('accordion body tersembunyi pada awal', async ({ page }) => {
    const firstBody = page.locator('.bab-accordion__body').first();
    await expect(firstBody).toBeHidden();
  });

  test('klik accordion header menampilkan daftar pasal', async ({ page }) => {
    const firstHeader = page.locator('[data-bab-toggle]').first();
    await firstHeader.click();

    const firstBody = page.locator('.bab-accordion__body').first();
    await expect(firstBody).toBeVisible();
  });

  test('daftar pasal yang terbuka menampilkan link pasal', async ({ page }) => {
    const firstHeader = page.locator('[data-bab-toggle]').first();
    await firstHeader.click();

    const pasalLinks = page.locator('.bab-accordion__pasal-link');
    await expect(pasalLinks.first()).toBeVisible();
  });

  test('klik accordion kedua kali menyembunyikan daftar pasal', async ({ page }) => {
    const firstHeader = page.locator('[data-bab-toggle]').first();

    await firstHeader.click(); // buka
    await firstHeader.click(); // tutup

    const firstBody = page.locator('.bab-accordion__body').first();
    await expect(firstBody).toBeHidden();
  });

  test('link "Lihat Detail Bab" mengarah ke /bab-pasal/1', async ({ page }) => {
    const firstHeader = page.locator('[data-bab-toggle]').first();
    await firstHeader.click();

    const detailLink = page.locator('.bab-accordion__detail-link').first();
    await expect(detailLink).toBeVisible();

    const href = await detailLink.getAttribute('href');
    expect(href).toContain('/bab-pasal/1');
  });

  test('link pasal di dalam accordion mengarah ke /pasal/:nomor', async ({ page }) => {
    const firstHeader = page.locator('[data-bab-toggle]').first();
    await firstHeader.click();

    const firstPasalLink = page.locator('.bab-accordion__pasal-link').first();
    const href = await firstPasalLink.getAttribute('href');
    expect(href).toContain('/pasal/');
  });

  test('sidebar menampilkan "Daftar Bab" sebagai item aktif', async ({ page }) => {
    const activeItem = page.locator('.app-sidebar__nav-item.active');
    await expect(activeItem).toBeVisible();
    await expect(activeItem).toContainText('Daftar Bab');
  });
});

// =============================================================================
// TASK-056: Detail Bab (/bab-pasal/:nomor)
// =============================================================================

test.describe('Halaman Detail Bab ("/bab-pasal/:nomor") — TASK-056', () => {
  test('menampilkan detail Bab I dengan header yang benar', async ({ page }) => {
    await page.goto(`${BASE}/bab-pasal/1`);
    await page.waitForSelector('.bab-detail-header', { timeout: 10_000 });

    const title = page.locator('.bab-detail-header__title');
    await expect(title).toBeVisible();
    await expect(title).toContainText('Bab I');
  });

  test('menampilkan keterangan bab Bab I', async ({ page }) => {
    await page.goto(`${BASE}/bab-pasal/1`);
    await page.waitForSelector('.bab-detail-header', { timeout: 10_000 });

    const subtitle = page.locator('.bab-detail-header__subtitle');
    await expect(subtitle).toBeVisible();
    await expect(subtitle).toContainText('Bentuk dan Kedaulatan');
  });

  test('menampilkan nomor romawi "I" dalam badge bab', async ({ page }) => {
    await page.goto(`${BASE}/bab-pasal/1`);
    await page.waitForSelector('.bab-detail-header', { timeout: 10_000 });

    const roman = page.locator('.bab-detail-header__roman');
    await expect(roman).toContainText('I');
  });

  test('menampilkan daftar pasal Bab I', async ({ page }) => {
    await page.goto(`${BASE}/bab-pasal/1`);
    await page.waitForSelector('.bab-detail-pasal-list', { timeout: 10_000 });

    const pasalItems = page.locator('.bab-detail-pasal-item');
    const count = await pasalItems.count();
    // Bab I hanya memiliki 1 pasal (Pasal 1)
    expect(count).toBe(1);
  });

  test('item pasal dapat diklik dan mengarah ke /pasal/:nomor', async ({ page }) => {
    await page.goto(`${BASE}/bab-pasal/1`);
    await page.waitForSelector('.bab-detail-pasal-list', { timeout: 10_000 });

    const firstPasalLink = page.locator('a.bab-detail-pasal-item').first();
    const href = await firstPasalLink.getAttribute('href');
    expect(href).toContain('/pasal/1');
  });

  test('menampilkan detail Bab III dengan banyak pasal', async ({ page }) => {
    await page.goto(`${BASE}/bab-pasal/3`);
    await page.waitForSelector('.bab-detail-pasal-list', { timeout: 10_000 });

    const pasalItems = page.locator('.bab-detail-pasal-item');
    const count = await pasalItems.count();
    // Bab III memiliki 17 pasal
    expect(count).toBe(17);
  });

  test('menampilkan link kembali ke /bab-pasal', async ({ page }) => {
    await page.goto(`${BASE}/bab-pasal/3`);
    await page.waitForSelector('.bab-detail-header', { timeout: 10_000 });

    const backLink = page.locator('.page-back-link');
    await expect(backLink).toBeVisible();

    const href = await backLink.getAttribute('href');
    expect(href).toContain('/bab-pasal');
  });

  test('navigasi "Berikutnya" tampil pada bab pertama', async ({ page }) => {
    await page.goto(`${BASE}/bab-pasal/1`);
    await page.waitForSelector('.bab-detail-header', { timeout: 10_000 });

    const nextNav = page.locator('.bab-nav__next');
    await expect(nextNav).toBeVisible();
    await expect(nextNav).toContainText('Bab II');
  });

  test('navigasi "Sebelumnya" dan "Berikutnya" tampil pada bab tengah', async ({ page }) => {
    await page.goto(`${BASE}/bab-pasal/3`);
    await page.waitForSelector('.bab-detail-header', { timeout: 10_000 });

    const prevNav = page.locator('.bab-nav__prev');
    const nextNav = page.locator('.bab-nav__next');

    await expect(prevNav).toBeVisible();
    await expect(nextNav).toBeVisible();
  });

  test('klik item "Pasal 1" membawa ke halaman detail pasal', async ({ page }) => {
    await page.goto(`${BASE}/bab-pasal/1`);
    await page.waitForSelector('.bab-detail-pasal-list', { timeout: 10_000 });

    const firstLink = page.locator('a.bab-detail-pasal-item').first();
    await firstLink.click();

    await expect(page).toHaveURL(/\/pasal\/1$/);
    await page.waitForSelector('.pasal-detail-header', { timeout: 10_000 });
  });

  test('judul halaman mengandung nama bab saat mengakses /bab-pasal/3', async ({ page }) => {
    await page.goto(`${BASE}/bab-pasal/3`);
    await page.waitForSelector('.bab-detail-header', { timeout: 10_000 });

    await expect(page).toHaveTitle(/Bab III/);
  });

  test('menampilkan error 404 untuk nomor bab yang tidak valid', async ({ page }) => {
    await page.goto(`${BASE}/bab-pasal/99`);
    await page.waitForSelector('[data-page-error]', { timeout: 10_000 });

    const error = page.locator('[data-page-error]');
    await expect(error).toBeVisible();
    await expect(error).toContainText('tidak ditemukan');
  });
});
