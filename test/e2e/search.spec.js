/**
 * @file test/e2e/search.spec.js
 * @description E2E tests — fitur pencarian (TASK-059 s.d. TASK-062)
 */

import { expect, test } from '@playwright/test';

const BASE = '/pasal-pancasila-uud-1945';

test.describe('Fitur pencarian ("/cari")', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/cari`);
    await page.waitForSelector('[data-cari-page]', { timeout: 10_000 });
    await page.waitForSelector('[data-search-input]', { timeout: 10_000 });
  });

  test('TASK-059: query "kedaulatan" menampilkan hasil dan highlight', async ({ page }) => {
    const input = page.locator('[data-search-input]');
    await input.fill('kedaulatan');

    await expect(page.locator('[data-search-state]')).toContainText('Ditemukan');
    await expect(page.locator('[data-search-result]').first()).toBeVisible();
    await expect(page.locator('.cari-mark').first()).toBeVisible();
  });

  test('TASK-060: deep link /cari?q=kedaulatan pre-fill input dan tampilkan hasil', async ({
    page,
  }) => {
    await page.goto(`${BASE}/cari?q=kedaulatan`);
    await page.waitForSelector('[data-search-input]', { timeout: 10_000 });

    await expect(page.locator('[data-search-input]')).toHaveValue('kedaulatan');
    await expect(page.locator('[data-search-result]').first()).toBeVisible();
  });

  test('TASK-061: query tanpa hasil menampilkan empty state', async ({ page }) => {
    const input = page.locator('[data-search-input]');
    await input.fill('zzzzzzzzzzzzzzzzzz');

    await expect(page.locator('[data-search-empty]')).toBeVisible();
    await expect(page.locator('[data-search-state]')).toContainText('Tidak ada pasal');
  });

  test('TASK-062: klik hasil pencarian menavigasi ke halaman detail pasal', async ({ page }) => {
    const input = page.locator('[data-search-input]');
    await input.fill('kedaulatan');

    const firstResult = page.locator('[data-search-result]').first();
    await expect(firstResult).toBeVisible();
    await firstResult.click();

    await expect(page).toHaveURL(/\/pasal\//);
    await expect(page.locator('.pasal-detail-header__title')).toBeVisible();
  });
});
