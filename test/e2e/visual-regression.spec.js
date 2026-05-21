/**
 * @file test/e2e/visual-regression.spec.js
 * @description E2E visual regression tests — screenshot baseline (TASK-059)
 *
 * Tujuan:
 *   Merekam tampilan visual halaman-halaman utama pada berbagai breakpoint
 *   sebagai baseline, kemudian mendeteksi perubahan visual yang tidak disengaja.
 *
 * Cara kerja:
 *   - Pertama kali dijalankan: buat snapshot baseline (--update-snapshots)
 *   - Selanjutnya: bandingkan terhadap baseline dan gagal jika berbeda
 *
 * Menjalankan pertama kali (membuat baseline):
 *   npx playwright test visual-regression.spec.js --update-snapshots
 *
 * Menjalankan perbandingan (deteksi regression):
 *   npx playwright test visual-regression.spec.js
 *
 * Referensi planning: TASK-059 (Phase 3.5 — Visual Regression Testing)
 */

import { expect, test } from '@playwright/test';

// Base path GitHub Pages — konsisten dengan vite.config.js
const BASE = '/pasal-pancasila-uud-1945';

/** Breakpoint yang diuji */
const VIEWPORTS = {
  mobile: { width: 375, height: 812 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 800 },
  wide: { width: 1440, height: 900 },
};

/** Toleransi pixel yang diizinkan untuk menghindari flakiness rendering halus */
const PIXEL_DIFF_THRESHOLD = 0.05; // 5% threshold

// =============================================================================
// Halaman Beranda (/) — Tampilan per breakpoint
// =============================================================================

test.describe('Visual Regression — Halaman Beranda', () => {
  for (const [breakpointName, viewport] of Object.entries(VIEWPORTS)) {
    test(`beranda (/) tampak konsisten di ${breakpointName} (${viewport.width}px)`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto(`${BASE}/`);
      await page.waitForSelector('.home-page', { timeout: 10_000 });

      // Tunggu font dan gambar ter-load agar screenshot konsisten
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot(`beranda-${breakpointName}.png`, {
        maxDiffPixelRatio: PIXEL_DIFF_THRESHOLD,
      });
    });
  }
});

// =============================================================================
// Halaman Daftar Pasal (/pasal) — Tampilan per breakpoint
// =============================================================================

test.describe('Visual Regression — Halaman Daftar Pasal', () => {
  for (const [breakpointName, viewport] of Object.entries(VIEWPORTS)) {
    test(`daftar pasal (/pasal) tampak konsisten di ${breakpointName} (${viewport.width}px)`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto(`${BASE}/pasal`);
      await page.waitForSelector('.pasal-list', { timeout: 10_000 });
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot(`pasal-list-${breakpointName}.png`, {
        maxDiffPixelRatio: PIXEL_DIFF_THRESHOLD,
      });
    });
  }
});

// =============================================================================
// Halaman Detail Pasal (/pasal/1) — Tampilan per breakpoint
// =============================================================================

test.describe('Visual Regression — Halaman Detail Pasal', () => {
  for (const [breakpointName, viewport] of Object.entries(VIEWPORTS)) {
    test(`detail pasal (/pasal/1) tampak konsisten di ${breakpointName} (${viewport.width}px)`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto(`${BASE}/pasal/1`);
      await page.waitForSelector('.pasal-detail-header', { timeout: 10_000 });
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot(`pasal-detail-${breakpointName}.png`, {
        maxDiffPixelRatio: PIXEL_DIFF_THRESHOLD,
      });
    });
  }
});

// =============================================================================
// Halaman Pancasila (/pancasila) — Tampilan per breakpoint
// =============================================================================

test.describe('Visual Regression — Halaman Pancasila', () => {
  for (const [breakpointName, viewport] of Object.entries(VIEWPORTS)) {
    test(`pancasila (/pancasila) tampak konsisten di ${breakpointName} (${viewport.width}px)`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto(`${BASE}/pancasila`);
      await page.waitForSelector('.pancasila-list', { timeout: 10_000 });
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot(`pancasila-${breakpointName}.png`, {
        maxDiffPixelRatio: PIXEL_DIFF_THRESHOLD,
      });
    });
  }
});
