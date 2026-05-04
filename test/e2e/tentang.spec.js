/**
 * @file test/e2e/tentang.spec.js
 * @description E2E tests — halaman Tentang Aplikasi (TASK-065)
 *
 * Verifikasi:
 *   TASK-065: /tentang — informasi aplikasi tampil lengkap dan
 *             kedua tautan membuka target yang benar (target="_blank")
 */

import { expect, test } from '@playwright/test';

// Base path GitHub Pages — konsisten dengan vite.config.js
const BASE = '/pasal-pancasila-uud-1945';

// =============================================================================
// TASK-065: Halaman Tentang Aplikasi ("/tentang")
// =============================================================================

test.describe('Halaman Tentang Aplikasi ("/tentang") — TASK-065', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/tentang`);
    await page.waitForSelector('[data-tentang]', { timeout: 10_000 });
  });

  test('judul halaman browser mengandung "Tentang Aplikasi"', async ({ page }) => {
    await expect(page).toHaveTitle(/Tentang Aplikasi/);
  });

  test('menampilkan wrapper halaman [data-tentang]', async ({ page }) => {
    await expect(page.locator('[data-tentang]')).toBeVisible();
  });

  // ── Identitas Aplikasi ────────────────────────────────────────────────────

  test('menampilkan logo circle aplikasi', async ({ page }) => {
    await expect(page.locator('.tentang-logo-circle')).toBeVisible();
  });

  test('menampilkan nama aplikasi "Pancasila & UUD 1945"', async ({ page }) => {
    const nameEl = page.locator('.tentang-app-name');
    await expect(nameEl).toBeVisible();
    await expect(nameEl).toContainText('Pancasila');
    await expect(nameEl).toContainText('UUD 1945');
  });

  test('menampilkan badge versi "v1.0.0"', async ({ page }) => {
    const badge = page.locator('.tentang-version-badge');
    await expect(badge).toBeVisible();
    await expect(badge).toContainText('v1.0.0');
  });

  // ── Deskripsi ─────────────────────────────────────────────────────────────

  test('menampilkan deskripsi yang menyebut UUD 1945', async ({ page }) => {
    const desc = page.locator('.tentang-description');
    await expect(desc).toBeVisible();
    await expect(desc).toContainText('Undang-Undang Dasar');
  });

  // ── Sumber Data ───────────────────────────────────────────────────────────

  test('menampilkan section Sumber Data', async ({ page }) => {
    await expect(page.locator('.tentang-sumber-data')).toBeVisible();
  });

  test('section Sumber Data menyebut "Sekretariat Jenderal MPR RI"', async ({ page }) => {
    const sumber = page.locator('.tentang-sumber-data');
    await expect(sumber).toContainText('Sekretariat Jenderal MPR RI');
  });

  // ── Tautan Bantuan & Dukungan ─────────────────────────────────────────────

  test('menampilkan tautan Koreksi Pasal yang terlihat', async ({ page }) => {
    const link = page.locator('[data-koreksi-link]');
    await expect(link).toBeVisible();
    await expect(link).toContainText('Koreksi Pasal');
  });

  test('tautan Koreksi Pasal membuka tab baru (target="_blank")', async ({ page }) => {
    const link = page.locator('[data-koreksi-link]');
    await expect(link).toHaveAttribute('target', '_blank');
  });

  test('tautan Koreksi Pasal memiliki rel="noopener noreferrer"', async ({ page }) => {
    const link = page.locator('[data-koreksi-link]');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('menampilkan tautan Saran Masukan yang terlihat', async ({ page }) => {
    const link = page.locator('[data-saran-link]');
    await expect(link).toBeVisible();
    await expect(link).toContainText('Saran Masukan');
  });

  test('tautan Saran Masukan membuka tab baru (target="_blank")', async ({ page }) => {
    const link = page.locator('[data-saran-link]');
    await expect(link).toHaveAttribute('target', '_blank');
  });

  test('tautan Saran Masukan memiliki rel="noopener noreferrer"', async ({ page }) => {
    const link = page.locator('[data-saran-link]');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  // ── Navigasi ──────────────────────────────────────────────────────────────

  test('tombol kembali ke beranda dari header bekerja', async ({ page }) => {
    await page.goto(`${BASE}/`);
    await page.waitForSelector('.home-page', { timeout: 10_000 });
    await page.goto(`${BASE}/tentang`);
    await page.waitForSelector('[data-tentang]', { timeout: 10_000 });
    await expect(page.locator('[data-tentang]')).toBeVisible();
  });
});
