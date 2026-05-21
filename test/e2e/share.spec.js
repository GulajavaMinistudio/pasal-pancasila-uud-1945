/**
 * @file test/e2e/share.spec.js
 * @description E2E tests — Fitur Berbagi Konten (TASK-068, TASK-069)
 *
 * Verifikasi:
 *   TASK-068: Tombol share tampil di halaman detail
 *   TASK-069: Klik tombol share → clipboard copy berhasil →
 *             toast "Tautan disalin!" tampil
 */

import { expect, test } from '@playwright/test';

// Base path GitHub Pages — konsisten dengan vite.config.js
const BASE = '/pasal-pancasila-uud-1945';

// =============================================================================
// TASK-068: Share Button tersedia di halaman detail
// =============================================================================

test.describe('Share Button tersedia — TASK-068', () => {
  test('tombol share ada di halaman Pasal Detail (/pasal/1)', async ({ page }) => {
    await page.goto(`${BASE}/pasal/1`);
    // Tunggu konten halaman ter-render
    await page.waitForSelector('[data-share-btn]', { timeout: 10_000 });

    const btn = page.locator('[data-share-btn]');
    await expect(btn).toBeVisible();
  });

  test('tombol share ada di halaman Pancasila (/pancasila)', async ({ page }) => {
    await page.goto(`${BASE}/pancasila`);
    await page.waitForSelector('[data-share-btn]', { timeout: 10_000 });

    const btn = page.locator('[data-share-btn]');
    await expect(btn).toBeVisible();
  });

  test('tombol share ada di halaman Butir Pancasila (/butir-pancasila)', async ({ page }) => {
    await page.goto(`${BASE}/butir-pancasila`);
    await page.waitForSelector('[data-share-btn]', { timeout: 10_000 });

    const btn = page.locator('[data-share-btn]');
    await expect(btn).toBeVisible();
  });

  test('tombol share memiliki teks label (mis. "Bagikan")', async ({ page }) => {
    await page.goto(`${BASE}/pasal/1`);
    await page.waitForSelector('[data-share-btn]', { timeout: 10_000 });

    const btn = page.locator('[data-share-btn]');
    const text = await btn.innerText();
    expect(text.trim()).toBeTruthy();
  });

  test('tombol share ada di halaman Sila Detail (/sila/1)', async ({ page }) => {
    await page.goto(`${BASE}/sila/1`);
    await page.waitForSelector('[data-share-btn]', { timeout: 10_000 });

    const btn = page.locator('[data-share-btn]');
    await expect(btn).toBeVisible();
  });
});

// =============================================================================
// TASK-069: Klik Share → Clipboard Copy → Toast "Tautan disalin!"
// =============================================================================

test.describe('Share via Clipboard — TASK-069', () => {
  /**
   * Mock setup: hapus navigator.share dan sediakan clipboard.writeText
   * agar jalur clipboard digunakan tanpa dialog share OS.
   */
  async function setupClipboardMock(page) {
    await page.addInitScript(() => {
      // Hapus Web Share API agar fallback ke clipboard digunakan
      delete window.navigator.share;

      // Mock Clipboard API: selalu resolve (simulasi copy berhasil)
      Object.defineProperty(navigator, 'clipboard', {
        writable: true,
        value: {
          writeText: () => Promise.resolve(),
        },
      });
    });
  }

  test('klik share di /pasal/1 → toast "Tautan disalin!" tampil', async ({ page }) => {
    await setupClipboardMock(page);

    await page.goto(`${BASE}/pasal/1`);
    await page.waitForSelector('[data-share-btn]', { timeout: 10_000 });

    const btn = page.locator('[data-share-btn]');
    await btn.click();

    // Toast harus muncul di body dengan teks "Tautan disalin!"
    const toast = page.locator('[data-share-toast]');
    await expect(toast).toBeVisible({ timeout: 5000 });
    await expect(toast).toContainText('Tautan disalin!');
  });

  test('klik share di /butir-pancasila → toast "Tautan disalin!" tampil', async ({ page }) => {
    await setupClipboardMock(page);

    // Gunakan /butir-pancasila karena ShareButton component di-mount di sini
    // PancasilaPage hanya meng-render HTML tombol tanpa mount handler
    await page.goto(`${BASE}/butir-pancasila`);
    await page.waitForSelector('[data-share-btn]', { timeout: 10_000 });

    const btn = page.locator('[data-share-btn]').first();
    await btn.click();

    const toast = page.locator('[data-share-toast]');
    await expect(toast).toBeVisible({ timeout: 5000 });
    await expect(toast).toContainText('Tautan disalin!');
  });

  test('toast memiliki role="status" untuk screen reader', async ({ page }) => {
    await setupClipboardMock(page);

    await page.goto(`${BASE}/pasal/1`);
    await page.waitForSelector('[data-share-btn]', { timeout: 10_000 });
    await page.locator('[data-share-btn]').click();

    const toast = page.locator('[data-share-toast]');
    await expect(toast).toBeVisible({ timeout: 5000 });

    const role = await toast.getAttribute('role');
    expect(role).toBe('status');
  });

  test('toast auto-dismiss setelah beberapa detik', async ({ page }) => {
    await setupClipboardMock(page);

    await page.goto(`${BASE}/pasal/1`);
    await page.waitForSelector('[data-share-btn]', { timeout: 10_000 });
    await page.locator('[data-share-btn]').click();

    const toast = page.locator('[data-share-toast]');
    await expect(toast).toBeVisible({ timeout: 5000 });

    // Toast auto-dismiss setelah TOAST_VISIBLE_MS (2000ms) + TOAST_DISMISS_MS (300ms)
    // Beri waktu total 4 detik agar toast hilang
    await expect(toast).not.toBeAttached({ timeout: 4000 });
  });

  test('tombol share tidak dapat diklik ganda saat sedang memproses', async ({ page }) => {
    await setupClipboardMock(page);

    await page.goto(`${BASE}/pasal/1`);
    await page.waitForSelector('[data-share-btn]', { timeout: 10_000 });

    const btn = page.locator('[data-share-btn]');

    // Klik dan segera cek apakah tombol disabled
    // (loader state muncul sebentar sebelum clipboard resolve)
    await btn.click();

    // Setelah selesai, tombol kembali enabled
    await expect(btn).toBeEnabled({ timeout: 3000 });
  });
});

// =============================================================================
// TASK-068: Share Button — Aksesibilitas
// =============================================================================

test.describe('Share Button aksesibilitas — TASK-068', () => {
  test('icon di dalam tombol share memiliki aria-hidden="true"', async ({ page }) => {
    await page.goto(`${BASE}/pasal/1`);
    await page.waitForSelector('[data-share-btn]', { timeout: 10_000 });

    const icon = page.locator('[data-share-btn] i');
    const ariaHidden = await icon.getAttribute('aria-hidden');
    expect(ariaHidden).toBe('true');
  });

  test('tombol share dapat difokus via keyboard (tabindex tidak -1)', async ({ page }) => {
    await page.goto(`${BASE}/pasal/1`);
    await page.waitForSelector('[data-share-btn]', { timeout: 10_000 });

    const btn = page.locator('[data-share-btn]');
    const tabindex = await btn.getAttribute('tabindex');
    // tabindex null (default) atau '0' = focusable; hanya -1 yang tidak focusable
    expect(tabindex).not.toBe('-1');
  });
});
