/**
 * @file test/e2e/pancasila.spec.js
 * @description E2E tests untuk halaman-halaman Pancasila
 *
 * Cakupan:
 *   - TASK-053: /pancasila — 5 sila ditampilkan
 *   - TASK-054: /sila/1 — Sila 1 dan butir-butirnya ditampilkan
 *   - TASK-055: /butir-pancasila — accordion berfungsi (expand/collapse)
 */

import { expect, test } from '@playwright/test';

const BASE = '/pasal-pancasila-uud-1945';

// ── /pancasila ────────────────────────────────────────────────────────────

test.describe('Halaman Daftar Sila Pancasila (/pancasila)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/pancasila`);
    await page.waitForSelector('.pancasila-card', { timeout: 10_000 });
  });

  test('menampilkan tepat 5 kartu sila', async ({ page }) => {
    const cards = page.locator('.pancasila-card');

    await expect(cards).toHaveCount(5);
  });

  test('setiap kartu sila menampilkan nomor urut (1–5)', async ({ page }) => {
    const cards = page.locator('.pancasila-card');

    for (let i = 1; i <= 5; i++) {
      const card = cards.nth(i - 1);
      const numberEl = card.locator('.pancasila-card__number');
      await expect(numberEl).toContainText(String(i));
    }
  });

  test('kartu Sila 1 memuat teks "Ketuhanan Yang Maha Esa"', async ({ page }) => {
    const firstCard = page.locator('.pancasila-card').first();

    await expect(firstCard).toContainText('Ketuhanan Yang Maha Esa');
  });

  test('kartu Sila 5 memuat teks "Keadilan Sosial"', async ({ page }) => {
    const lastCard = page.locator('.pancasila-card').last();

    await expect(lastCard).toContainText('Keadilan Sosial');
  });

  test('setiap kartu sila adalah link ke /sila/:nomor', async ({ page }) => {
    const cards = page.locator('.pancasila-card');

    for (let i = 1; i <= 5; i++) {
      const card = cards.nth(i - 1);
      const href = await card.getAttribute('href');
      expect(href).toContain(`/sila/${i}`);
    }
  });

  test('klik kartu Sila 1 membuka halaman /sila/1 (SPA)', async ({ page }) => {
    const firstCard = page.locator('.pancasila-card').first();
    await firstCard.click();

    await expect(page).toHaveURL(/\/sila\/1/);
    await expect(page.locator('.sila-hero')).toBeVisible();
  });

  test('judul halaman berisi "Pancasila"', async ({ page }) => {
    await expect(page).toHaveTitle(/Pancasila/);
  });
});

// ── /sila/1 ──────────────────────────────────────────────────────────────

test.describe('Halaman Detail Sila (/sila/1)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/sila/1`);
    await page.waitForSelector('.sila-hero', { timeout: 10_000 });
  });

  test('menampilkan hero section sila dengan nomor "Sila 1"', async ({ page }) => {
    const silaOrdinal = page.locator('.sila-hero__ordinal');

    await expect(silaOrdinal).toBeVisible();
    await expect(silaOrdinal).toContainText('Sila 1');
  });

  test('menampilkan teks "Ketuhanan Yang Maha Esa"', async ({ page }) => {
    const silaTitle = page.locator('.sila-hero__title');

    await expect(silaTitle).toContainText('Ketuhanan Yang Maha Esa');
  });

  test('menampilkan setidaknya 1 butir pengamalan', async ({ page }) => {
    const butirCards = page.locator('.sila-point-card');

    await expect(butirCards.first()).toBeVisible();
    const count = await butirCards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('menampilkan judul seksi "Butir-butir Pengamalan"', async ({ page }) => {
    const sectionTitle = page.locator('.page-section-title');

    await expect(sectionTitle).toContainText('Butir-butir Pengamalan');
  });

  test('terdapat tombol "Kembali ke Daftar Sila"', async ({ page }) => {
    const backLink = page.locator('.page-back-link');

    await expect(backLink).toBeVisible();
    await expect(backLink).toContainText('Kembali ke Daftar Sila');
  });

  test('klik tombol kembali membuka /pancasila (SPA)', async ({ page }) => {
    const backLink = page.locator('.page-back-link');
    await backLink.click();

    await expect(page).toHaveURL(/\/pancasila/);
    await expect(page.locator('.pancasila-card').first()).toBeVisible();
  });

  test('judul halaman berisi "Sila 1"', async ({ page }) => {
    await expect(page).toHaveTitle(/Sila 1/);
  });

  test('/sila/6 (tidak valid) redirect ke halaman 404', async ({ page }) => {
    await page.goto(`${BASE}/sila/6`);

    await expect(page).toHaveURL(/\/404$/);
    await expect(page.locator('body')).toContainText(/404|tidak ditemukan/i, { timeout: 10_000 });
  });
});

// ── /butir-pancasila ──────────────────────────────────────────────────────

test.describe('Halaman Butir Pancasila (/butir-pancasila)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/butir-pancasila`);
    await page.waitForSelector('.butir-accordion__item', { timeout: 10_000 });
  });

  test('menampilkan tepat 5 accordion item (satu per sila)', async ({ page }) => {
    const items = page.locator('.butir-accordion__item');

    await expect(items).toHaveCount(5);
  });

  test('accordion item pertama terbuka secara default (aria-expanded="true")', async ({ page }) => {
    const firstTrigger = page.locator('[data-accordion-trigger]').first();

    await expect(firstTrigger).toHaveAttribute('aria-expanded', 'true');
  });

  test('accordion item kedua tertutup secara default (aria-expanded="false")', async ({ page }) => {
    const triggers = page.locator('[data-accordion-trigger]');
    const secondTrigger = triggers.nth(1);

    await expect(secondTrigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('klik trigger accordion kedua membuka panelnya', async ({ page }) => {
    const secondTrigger = page.locator('[data-accordion-trigger]').nth(1);
    await secondTrigger.click();

    await expect(secondTrigger).toHaveAttribute('aria-expanded', 'true');
  });

  test('klik trigger accordion yang sudah terbuka menutupnya kembali', async ({ page }) => {
    const firstTrigger = page.locator('[data-accordion-trigger]').first();

    // Sudah terbuka — klik untuk tutup
    await firstTrigger.click();

    await expect(firstTrigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('hanya satu accordion panel terbuka pada satu waktu', async ({ page }) => {
    const secondTrigger = page.locator('[data-accordion-trigger]').nth(1);
    await secondTrigger.click();

    // Setelah buka item ke-2, item pertama harus tertutup
    const firstTrigger = page.locator('[data-accordion-trigger]').first();
    await expect(firstTrigger).toHaveAttribute('aria-expanded', 'false');
    await expect(secondTrigger).toHaveAttribute('aria-expanded', 'true');
  });

  test('panel accordion pertama berisi setidaknya satu butir', async ({ page }) => {
    const firstPanel = page.locator('.butir-accordion__panel').first();
    const points = firstPanel.locator('.butir-accordion__point');

    await expect(points.first()).toBeVisible();
    const count = await points.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('setiap accordion item memiliki link ke halaman detail sila', async ({ page }) => {
    const firstPanel = page.locator('.butir-accordion__panel').first();
    const silaLink = firstPanel.locator('a[href*="/sila/"]');

    await expect(silaLink).toBeVisible();
  });

  test('judul halaman berisi "Butir Pancasila"', async ({ page }) => {
    await expect(page).toHaveTitle(/Butir Pancasila/);
  });
});
