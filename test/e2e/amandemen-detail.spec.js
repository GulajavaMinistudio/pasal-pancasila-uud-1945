/**
 * @file test/e2e/amandemen-detail.spec.js
 * @description E2E tests — halaman Perbandingan Amandemen (TASK-025 hingga TASK-029)
 *
 * Verifikasi:
 *   TASK-025: /amandemen/:nomor → pasal normal menampilkan dua kolom + badge amandemen
 *   TASK-026: /amandemen/:nomor → pasal baru (isNewPasal) menampilkan placeholder kolom kiri
 *   TASK-027: /amandemen → link "Lihat Perbandingan" berfungsi menavigasi ke detail
 *   TASK-028: /amandemen/:nomor → nomor tidak ditemukan → error inline + kembali ke list
 *   TASK-029: /pasal/:nomor → link "Bandingkan" mengarahkan ke /amandemen/:nomor
 */

import { expect, test } from '@playwright/test';

// Base path GitHub Pages — konsisten dengan vite.config.js
const BASE = '/pasal-pancasila-uud-1945';

// Pasal 1 ada di kedua sumber data → kasus normal side-by-side
const PASAL_NORMAL = '1';
// Pasal 6A hanya ada di KetAmandemen → kasus isNewPasal
const PASAL_BARU = '6A';

// =============================================================================
// TASK-025: Halaman Detail Amandemen — Pasal Normal (/amandemen/:nomor)
// =============================================================================

test.describe('Halaman Detail Amandemen — Pasal Normal ("/amandemen/1") — TASK-025', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/amandemen/${PASAL_NORMAL}`);
    await page.waitForSelector('[data-comparison-card]', { timeout: 10_000 });
  });

  test('menampilkan halaman perbandingan dengan data-comparison-card', async ({ page }) => {
    const card = page.locator('[data-comparison-card]');
    await expect(card).toBeVisible();
  });

  test('menampilkan judul pasal di header card', async ({ page }) => {
    const title = page.locator('.comparison-card__title');
    await expect(title).toBeVisible();
    await expect(title).toContainText('Pasal 1');
  });

  test('judul halaman browser mengandung "Perbandingan Pasal 1"', async ({ page }) => {
    await expect(page).toHaveTitle(/Perbandingan Pasal 1/);
  });

  test('menampilkan badge amandemen di header card', async ({ page }) => {
    const badge = page.locator('.comparison-card__amandemen-badge');
    await expect(badge).toBeVisible();
    // Pasal 1 diamandemen ke-3
    await expect(badge).toContainText('Amandemen III');
  });

  test('menampilkan grid perbandingan dua kolom', async ({ page }) => {
    const grid = page.locator('[data-comparison-grid]');
    await expect(grid).toBeVisible();
  });

  test('header grid menampilkan label "UUD 1945 Naskah Asli"', async ({ page }) => {
    const origLabel = page.locator('.comparison-col-label--original');
    await expect(origLabel).toBeVisible();
    await expect(origLabel).toContainText('UUD 1945 Naskah Asli');
  });

  test('header grid menampilkan label "Pasca-Amandemen"', async ({ page }) => {
    const amndLabel = page.locator('.comparison-col-label--amended');
    await expect(amndLabel).toBeVisible();
    await expect(amndLabel).toContainText('Pasca-Amandemen');
  });

  test('menampilkan setidaknya satu baris ayat dengan data-ayat-row', async ({ page }) => {
    const ayatRows = page.locator('[data-ayat-row]');
    const count = await ayatRows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('menampilkan badge ayat untuk ayat yang diubah/ditambah', async ({ page }) => {
    const badges = page.locator('[data-amandemen-badge]');
    const count = await badges.count();
    expect(count).toBeGreaterThan(0);
  });

  test('menampilkan notasi keterbatasan data', async ({ page }) => {
    const notice = page.locator('[data-comparison-notice]');
    await expect(notice).toBeVisible();
  });

  test('tombol kembali ada dan mengarah ke /amandemen', async ({ page }) => {
    const backLink = page.locator('.page-back-link');
    await expect(backLink).toBeVisible();
    const href = await backLink.getAttribute('href');
    expect(href).toContain('/amandemen');
    expect(href).not.toMatch(/\/amandemen\/\d/); // harus ke list, bukan detail lain
  });
});

// =============================================================================
// TASK-026: Halaman Detail Amandemen — Pasal Baru (/amandemen/6A)
// =============================================================================

test.describe('Halaman Detail Amandemen — Pasal Baru ("/amandemen/6A") — TASK-026', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/amandemen/${PASAL_BARU}`);
    await page.waitForSelector('[data-comparison-card]', { timeout: 10_000 });
  });

  test('menampilkan halaman perbandingan untuk pasal baru (isNewPasal)', async ({ page }) => {
    const card = page.locator('[data-comparison-card]');
    await expect(card).toBeVisible();
  });

  test('menampilkan judul "Pasal 6A" di header card', async ({ page }) => {
    const title = page.locator('.comparison-card__title');
    await expect(title).toContainText('Pasal 6A');
  });

  test('kolom kiri menampilkan placeholder "pasal tidak ada pada asli"', async ({ page }) => {
    const placeholder = page.locator('[data-new-pasal-placeholder]');
    await expect(placeholder).toBeVisible();
    await expect(placeholder).toContainText('tidak ada pada UUD 1945 asli');
  });

  test('data-comparison-new ada di DOM', async ({ page }) => {
    const newRow = page.locator('[data-comparison-new]');
    await expect(newRow).toBeAttached();
  });
});

// =============================================================================
// TASK-027: Link "Lihat Perbandingan" dari /amandemen ke /amandemen/:nomor
// =============================================================================

test.describe('Navigasi dari Amandemen List ke Detail — TASK-027', () => {
  test('klik link "Lihat Perbandingan" menavigasi ke /amandemen/:nomor', async ({ page }) => {
    await page.goto(`${BASE}/amandemen`);
    await page.waitForSelector('[data-compare-link]', { timeout: 10_000 });

    // Klik link perbandingan pertama
    const firstLink = page.locator('[data-compare-link]').first();
    await firstLink.click();

    // URL harus berubah ke /amandemen/:nomor
    await page.waitForURL(/\/amandemen\/.+/, { timeout: 8_000 });
    expect(page.url()).toMatch(/\/amandemen\/.+/);

    // Halaman perbandingan harus dirender
    await page.waitForSelector('[data-comparison-card]', { timeout: 10_000 });
    const card = page.locator('[data-comparison-card]');
    await expect(card).toBeVisible();
  });

  test('setelah navigasi ke detail, tombol kembali membawa ke daftar amandemen', async ({
    page,
  }) => {
    await page.goto(`${BASE}/amandemen`);
    await page.waitForSelector('[data-compare-link]', { timeout: 10_000 });

    const firstLink = page.locator('[data-compare-link]').first();
    await firstLink.click();
    await page.waitForURL(/\/amandemen\/.+/, { timeout: 8_000 });
    await page.waitForSelector('[data-comparison-card]', { timeout: 10_000 });

    const backLink = page.locator('.page-back-link');
    await backLink.click();

    await page.waitForURL(/\/amandemen$/, { timeout: 5_000 });
    await expect(page).toHaveURL(/\/amandemen$/);
  });
});

// =============================================================================
// TASK-028: Nomor Pasal Tidak Ditemukan (/amandemen/999)
// =============================================================================

test.describe('Pasal Tidak Ditemukan ("/amandemen/999") — TASK-028', () => {
  test('menampilkan error state inline jika pasal tidak ada', async ({ page }) => {
    await page.goto(`${BASE}/amandemen/999`);
    await page.waitForSelector('[data-action="retry"]', { timeout: 10_000 });

    const errorButton = page.locator('[data-action="retry"]');
    await expect(errorButton).toBeVisible();
  });

  test('tombol kembali pada error state mengarahkan ke /amandemen', async ({ page }) => {
    await page.goto(`${BASE}/amandemen/999`);
    await page.waitForSelector('[data-action="retry"]', { timeout: 10_000 });

    const retryButton = page.locator('[data-action="retry"]');
    await retryButton.click();

    await page.waitForURL(/\/amandemen$/, { timeout: 5_000 });
    await expect(page).toHaveURL(/\/amandemen$/);
    await page.waitForSelector('[data-amandemen-groups]', { timeout: 10_000 });
  });

  test('judul browser mengandung "Pasal Tidak Ditemukan"', async ({ page }) => {
    await page.goto(`${BASE}/amandemen/999`);
    await page.waitForSelector('[data-action="retry"]', { timeout: 10_000 });

    await expect(page).toHaveTitle(/Pasal Tidak Ditemukan/);
  });
});

// =============================================================================
// TASK-029: Link "Bandingkan" dari PasalDetailPage ke /amandemen/:nomor
// =============================================================================

test.describe('Link "Bandingkan" di PasalDetailPage — TASK-029', () => {
  test('Pasal 1 (diamandemen) menampilkan link "Bandingkan dengan UUD 1945 Asli"', async ({
    page,
  }) => {
    await page.goto(`${BASE}/pasal/1`);
    await page.waitForSelector('.pasal-detail-header', { timeout: 10_000 });

    const compareLink = page.locator('[data-compare-link]');
    await expect(compareLink).toBeVisible();
  });

  test('link "Bandingkan" mengarah ke URL /amandemen/1', async ({ page }) => {
    await page.goto(`${BASE}/pasal/1`);
    await page.waitForSelector('.pasal-detail-header', { timeout: 10_000 });

    const compareLink = page.locator('[data-compare-link]');
    const href = await compareLink.getAttribute('href');
    expect(href).toMatch(/\/amandemen\/1/);
  });

  test('klik link "Bandingkan" dari Pasal 1 mengarah ke halaman perbandingan', async ({
    page,
  }) => {
    await page.goto(`${BASE}/pasal/1`);
    await page.waitForSelector('.pasal-detail-header', { timeout: 10_000 });

    const compareLink = page.locator('[data-compare-link]');
    await compareLink.click();

    await page.waitForURL(/\/amandemen\/1/, { timeout: 5_000 });
    await page.waitForSelector('[data-comparison-card]', { timeout: 10_000 });

    const card = page.locator('[data-comparison-card]');
    await expect(card).toBeVisible();
  });

  test('Pasal 6A menampilkan link "Bandingkan" yang mengarah ke /amandemen/6A', async ({
    page,
  }) => {
    await page.goto(`${BASE}/pasal/6A`);
    await page.waitForSelector('.pasal-detail-header', { timeout: 10_000 });

    const compareLink = page.locator('[data-compare-link]');
    await expect(compareLink).toBeVisible();
    const href = await compareLink.getAttribute('href');
    expect(href).toMatch(/\/amandemen\/6A/);
  });
});
