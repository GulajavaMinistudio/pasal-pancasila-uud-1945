/**
 * @file test/e2e/pembukaan.spec.js
 * @description E2E test — halaman Pembukaan UUD 1945 "/pembukaan" (TASK-056)
 *
 * Verifikasi:
 *   - 4 alinea berurutan ditampilkan
 *   - Setiap alinea memiliki label urutan (Pertama, Kedua, Ketiga, Keempat)
 *   - Teks alinea tidak kosong
 *   - Judul halaman sesuai
 */

import { expect, test } from '@playwright/test';

const BASE = '/pasal-pancasila-uud-1945';

const ALINEA_LABELS = ['Pertama', 'Kedua', 'Ketiga', 'Keempat'];

test.describe('Halaman Pembukaan UUD 1945 (/pembukaan)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/pembukaan`);
    await page.waitForSelector('.alinea-card', { timeout: 10_000 });
  });

  test('menampilkan tepat 4 kartu alinea', async ({ page }) => {
    const cards = page.locator('.alinea-card');

    await expect(cards).toHaveCount(4);
  });

  for (const [index, label] of ALINEA_LABELS.entries()) {
    test(`alinea ke-${index + 1} memiliki label "Alinea ${label}"`, async ({ page }) => {
      const card = page.locator('.alinea-card').nth(index);
      const title = card.locator('.alinea-card__title');

      await expect(title).toContainText(`Alinea ${label}`);
    });
  }

  test('alinea pertama memuat teks Kemerdekaan (konten alinea 1)', async ({ page }) => {
    const firstCard = page.locator('.alinea-card').first();
    const text = firstCard.locator('.alinea-card__text');

    // Alinea pertama berisi teks tentang kemerdekaan
    await expect(text).toContainText('Kemerdekaan');
  });

  test('setiap kartu alinea memiliki teks yang tidak kosong', async ({ page }) => {
    const cards = page.locator('.alinea-card');
    const count = await cards.count();

    for (let i = 0; i < count; i++) {
      const text = cards.nth(i).locator('.alinea-card__text');
      const content = await text.textContent();
      expect(content?.trim().length).toBeGreaterThan(0);
    }
  });

  test('badge nomor urut tampil pada setiap kartu (1–4)', async ({ page }) => {
    const cards = page.locator('.alinea-card');

    for (let i = 1; i <= 4; i++) {
      const badge = cards.nth(i - 1).locator('.alinea-card__badge');
      await expect(badge).toContainText(String(i));
    }
  });

  test('judul halaman berisi "Pembukaan"', async ({ page }) => {
    await expect(page).toHaveTitle(/Pembukaan/);
  });

  test('URL langsung ke /pembukaan menampilkan konten (deep link)', async ({ page }) => {
    // Sudah dilakukan di beforeEach — verifikasi ulang bahwa halaman fully loaded
    const cards = page.locator('.alinea-card');
    await expect(cards.first()).toBeVisible();
  });
});
