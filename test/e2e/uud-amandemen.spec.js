/**
 * @file test/e2e/uud-amandemen.spec.js
 * @description E2E tests — halaman UUD Asli dan Amandemen (TASK-057, TASK-058)
 *
 * Verifikasi:
 *   TASK-057: /uud-asli → pasal versi asli ditampilkan, filter bab berfungsi
 *   TASK-058: /amandemen → pasal amandemen digroup per Amandemen I-IV
 */

import { expect, test } from '@playwright/test';

// Base path GitHub Pages — konsisten dengan vite.config.js
const BASE = '/pasal-pancasila-uud-1945';

// =============================================================================
// TASK-057: Halaman UUD Asli (/uud-asli)
// =============================================================================

test.describe('Halaman UUD 1945 Asli ("/uud-asli") — TASK-057', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/uud-asli`);
    await page.waitForSelector('.uud-asli-list', { timeout: 10_000 });
  });

  test('menampilkan badge "UUD 1945 Naskah Asli"', async ({ page }) => {
    const badge = page.locator('.uud-asli-header__badge');
    await expect(badge).toBeVisible();
    await expect(badge).toContainText('UUD 1945 Naskah Asli');
  });

  test('menampilkan heading "Naskah Asli UUD 1945"', async ({ page }) => {
    const heading = page.locator('.page-section-title');
    await expect(heading).toContainText('Naskah Asli UUD 1945');
  });

  test('judul halaman browser mengandung "UUD 1945 Naskah Asli"', async ({ page }) => {
    await expect(page).toHaveTitle(/UUD 1945 Naskah Asli/);
  });

  test('menampilkan pasal pertama "Pasal 1"', async ({ page }) => {
    const firstCard = page.locator('[data-pasal="Pasal 1"]');
    await expect(firstCard).toBeVisible();
  });

  test('setiap card menampilkan badge "Naskah Asli"', async ({ page }) => {
    const badges = page.locator('.badge-asli');
    const count = await badges.count();
    expect(count).toBeGreaterThan(0);
    await expect(badges.first()).toBeVisible();
  });

  test('menampilkan dropdown filter bab', async ({ page }) => {
    const select = page.locator('[data-bab-filter]');
    await expect(select).toBeVisible();
  });

  test('dropdown filter berisi opsi "Semua Bab"', async ({ page }) => {
    const select = page.locator('[data-bab-filter]');
    const allOption = select.locator('option[value="__all__"]');
    await expect(allOption).toBeAttached();
    expect(await allOption.textContent()).toContain('Semua Bab');
  });

  test('filter bab mengurangi jumlah pasal yang ditampilkan', async ({ page }) => {
    const allCards = page.locator('[data-pasal]');
    const totalCount = await allCards.count();

    // Pilih bab pertama (Bab I)
    const select = page.locator('[data-bab-filter]');
    const options = select.locator('option');
    const secondOptionValue = await options.nth(1).getAttribute('value');
    await select.selectOption(secondOptionValue ?? '');

    const filteredCards = page.locator('[data-pasal]');
    const filteredCount = await filteredCards.count();

    expect(filteredCount).toBeLessThan(totalCount);
    expect(filteredCount).toBeGreaterThan(0);
  });

  test('filter ke "Semua Bab" kembali menampilkan semua pasal', async ({ page }) => {
    const allCards = page.locator('[data-pasal]');
    const totalCount = await allCards.count();

    const select = page.locator('[data-bab-filter]');
    const options = select.locator('option');
    const secondOptionValue = await options.nth(1).getAttribute('value');

    // Filter ke bab tertentu
    await select.selectOption(secondOptionValue ?? '');
    // Kembali ke semua bab
    await select.selectOption('__all__');

    const restoredCount = await allCards.count();
    expect(restoredCount).toBe(totalCount);
  });

  test('counter pasal diperbarui setelah filter bab berubah', async ({ page }) => {
    const counter = page.locator('[data-pasal-count]');
    const initialText = await counter.textContent();

    const select = page.locator('[data-bab-filter]');
    const options = select.locator('option');
    const secondOptionValue = await options.nth(1).getAttribute('value');
    await select.selectOption(secondOptionValue ?? '');

    const updatedText = await counter.textContent();
    expect(updatedText).not.toBe(initialText);
  });
});

// =============================================================================
// TASK-058: Halaman Amandemen (/amandemen)
// =============================================================================

test.describe('Halaman Amandemen UUD 1945 ("/amandemen") — TASK-058', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/amandemen`);
    await page.waitForSelector('[data-amandemen-groups]', { timeout: 10_000 });
  });

  test('menampilkan judul "Amandemen UUD 1945"', async ({ page }) => {
    const heading = page.locator('.page-section-title');
    await expect(heading).toContainText('Amandemen UUD 1945');
  });

  test('judul halaman browser mengandung "Amandemen UUD 1945"', async ({ page }) => {
    await expect(page).toHaveTitle(/Amandemen UUD 1945/);
  });

  test('menampilkan section Amandemen I dengan tahun 1999', async ({ page }) => {
    const section = page.locator('[data-amandemen-section="1"]');
    await expect(section).toBeVisible();
    await expect(section.locator('.amandemen-group__title')).toContainText('Amandemen I');
    await expect(section.locator('.amandemen-group__year')).toContainText('1999');
  });

  test('menampilkan section Amandemen II dengan tahun 2000', async ({ page }) => {
    const section = page.locator('[data-amandemen-section="2"]');
    await expect(section).toBeVisible();
    await expect(section.locator('.amandemen-group__year')).toContainText('2000');
  });

  test('menampilkan section Amandemen III dengan tahun 2001', async ({ page }) => {
    const section = page.locator('[data-amandemen-section="3"]');
    await expect(section).toBeVisible();
    await expect(section.locator('.amandemen-group__year')).toContainText('2001');
  });

  test('menampilkan section Amandemen IV dengan tahun 2002', async ({ page }) => {
    const section = page.locator('[data-amandemen-section="4"]');
    await expect(section).toBeVisible();
    await expect(section.locator('.amandemen-group__year')).toContainText('2002');
  });

  test('Amandemen I mengandung pasal yang diamandemen pertama (mis. Pasal 5)', async ({ page }) => {
    const section = page.locator('[data-amandemen-section="1"]');
    const pasalItem = section.locator('[data-pasal="Pasal 5"]');
    await expect(pasalItem).toBeVisible();
  });

  test('setiap item pasal memiliki tombol "Lihat Perbandingan"', async ({ page }) => {
    const compareLinks = page.locator('[data-compare-link]');
    const count = await compareLinks.count();
    expect(count).toBeGreaterThan(0);
    await expect(compareLinks.first()).toBeVisible();
  });

  test('tombol "Lihat Perbandingan" mengarah ke URL yang benar', async ({ page }) => {
    const firstLink = page.locator('[data-compare-link]').first();
    const href = await firstLink.getAttribute('href');
    expect(href).toMatch(/\/amandemen\//);
  });

  test('tidak ada pasal dengan amandemen "0" yang ditampilkan', async ({ page }) => {
    // Pasal 4, 10, 12 adalah contoh pasal amandemen "0"
    // Pastikan tidak ada item row dengan namapasal tersebut
    const pasal4 = page.locator('[data-amandemen-item][data-pasal="Pasal 4"]');
    await expect(pasal4).toHaveCount(0);
  });

  test('setiap item pasal menampilkan nama bab', async ({ page }) => {
    const firstBabLabel = page.locator('.amandemen-row__bab').first();
    await expect(firstBabLabel).toBeVisible();
    const text = await firstBabLabel.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test('klik tombol "Lihat Perbandingan" menavigasi ke halaman amandemen detail', async ({
    page,
  }) => {
    // Ambil link pertama dan klik
    const firstLink = page.locator('[data-compare-link]').first();
    await firstLink.click();

    // URL harus berubah ke /amandemen/:nomor (placeholder saat ini)
    await page.waitForURL(/\/amandemen\/.+/, { timeout: 5_000 });
    expect(page.url()).toMatch(/\/amandemen\/.+/);
  });
});
