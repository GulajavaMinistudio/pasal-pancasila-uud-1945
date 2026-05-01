/**
 * @file test/e2e/beranda.spec.js
 * @description E2E test — halaman Beranda "/" (TASK-059)
 *
 * Verifikasi:
 *   - Halaman beranda tampil saat buka URL "/" langsung
 *   - 7 shortcut navigasi utama hadir dan mengarah ke route yang benar
 *   - Judul aplikasi "Pancasila & UUD 1945" tampil di hero section
 */

import { expect, test } from '@playwright/test';

// Base path GitHub Pages — konsisten dengan vite.config.js
const BASE = '/pasal-pancasila-uud-1945';

test.describe('Halaman Beranda ("/")', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/`);
    // Tunggu hingga konten utama tampil
    await page.waitForSelector('.home-page', { timeout: 10_000 });
  });

  test('menampilkan hero section dengan judul aplikasi', async ({ page }) => {
    const heroTitle = page.locator('.home-hero__title');

    await expect(heroTitle).toBeVisible();
    await expect(heroTitle).toContainText('Pancasila');
  });

  test('menampilkan 7 kartu quick-link navigasi utama', async ({ page }) => {
    const cards = page.locator('.home-card');

    await expect(cards).toHaveCount(7);
  });

  test('kartu "5 Sila Pancasila" mengarah ke route /pancasila', async ({ page }) => {
    const pancasilaCard = page.locator('.home-card').filter({ hasText: '5 Sila Pancasila' });

    await expect(pancasilaCard).toBeVisible();
    const href = await pancasilaCard.getAttribute('href');
    expect(href).toContain('/pancasila');
  });

  test('kartu "Pembukaan UUD 1945" mengarah ke route /pembukaan', async ({ page }) => {
    const pembukaanCard = page.locator('.home-card').filter({ hasText: 'Pembukaan UUD 1945' });

    await expect(pembukaanCard).toBeVisible();
    const href = await pembukaanCard.getAttribute('href');
    expect(href).toContain('/pembukaan');
  });

  test('kartu "Butir Pancasila" mengarah ke route /butir-pancasila', async ({ page }) => {
    const butirCard = page.locator('.home-card').filter({ hasText: 'Butir Pancasila' });

    await expect(butirCard).toBeVisible();
    const href = await butirCard.getAttribute('href');
    expect(href).toContain('/butir-pancasila');
  });

  test('kartu "Daftar Pasal" mengarah ke route /pasal', async ({ page }) => {
    const pasalCard = page.locator('.home-card').filter({ hasText: 'Daftar Pasal' });

    await expect(pasalCard).toBeVisible();
    const href = await pasalCard.getAttribute('href');
    expect(href).toContain('/pasal');
  });

  test('kartu "Amandemen" mengarah ke route /amandemen', async ({ page }) => {
    const amandemenCard = page.locator('.home-card').filter({ hasText: 'Amandemen' });

    await expect(amandemenCard).toBeVisible();
    const href = await amandemenCard.getAttribute('href');
    expect(href).toContain('/amandemen');
  });

  test('klik kartu Pancasila membuka halaman /pancasila (SPA — tidak reload)', async ({ page }) => {
    // Catat jumlah navigasi (reload akan menambah request baru)
    let reloadCount = 0;
    page.on('request', (req) => {
      if (req.resourceType() === 'document' && req.url().includes('/pancasila')) {
        reloadCount++;
      }
    });

    const pancasilaCard = page.locator('.home-card').filter({ hasText: '5 Sila Pancasila' });
    await pancasilaCard.click();

    // Navigasi SPA: URL berubah, tetapi tidak ada full page reload
    await expect(page).toHaveURL(/\/pancasila/);
    expect(reloadCount).toBe(0); // Tidak ada request dokumen baru
  });

  test('title halaman berisi "Beranda" setelah mount', async ({ page }) => {
    await expect(page).toHaveTitle(/Beranda/);
  });
});
