/**
 * @file test/component/BabPasalListPage.test.js
 * @description Component tests untuk src/pages/BabPasalListPage.js
 *
 * Cakupan (TASK-006, TASK-008):
 *   - Render sidebar dan judul halaman setelah mount
 *   - Menampilkan 21 bab accordion setelah data dimuat
 *   - Setiap accordion menampilkan nama bab dan badge pasal count
 *   - Expand/collapse accordion berfungsi (TASK-008)
 *   - Error state tampil jika repository melempar error
 *   - Retry action memanggil mount ulang
 *
 * Prinsip F.I.R.S.T — tidak ada fetch() nyata, semua dependensi di-mock.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { BabPasalListPage } from '../../src/pages/BabPasalListPage.js';
import babFixture from '../../src/data/fixture/babpasal.json';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Buat mock repository babpasal. */
function createMockBabRepository(overrides = {}) {
  return {
    loadBabPasal: vi.fn().mockResolvedValue(babFixture),
    ...overrides,
  };
}

/** Buat container DOM dan mount BabPasalListPage. */
async function mountPage(repositoryOverrides = {}) {
  const container = document.createElement('div');
  const sidebarEl = document.createElement('div');
  const babRepository = createMockBabRepository(repositoryOverrides);

  const page = new BabPasalListPage(container, { sidebarEl, babRepository });
  await page.mount();

  return { container, sidebarEl, babRepository, page };
}

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe('BabPasalListPage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ── Render struktur utama ─────────────────────────────────────────────────

  describe('mount() — render struktur halaman', () => {
    it('merender container dengan class page-shell', async () => {
      const { container } = await mountPage();

      expect(container.querySelector('.page-shell')).not.toBeNull();
    });

    it('merender section header dengan judul "Daftar Bab"', async () => {
      const { container } = await mountPage();

      const title = container.querySelector('.page-section-title');

      expect(title).not.toBeNull();
      expect(title.textContent.trim()).toBe('Daftar Bab');
    });

    it('merender page-section-count dengan jumlah bab dari fixture', async () => {
      const { container } = await mountPage();

      const count = container.querySelector('.page-section-count');
      const expectedCount = babFixture.isi_bab_pasal.length;

      expect(count).not.toBeNull();
      expect(count.textContent.trim()).toContain(String(expectedCount));
    });

    it('merender sidebar dengan navigasi', async () => {
      const { sidebarEl } = await mountPage();

      const nav = sidebarEl.querySelector('nav');

      expect(nav).not.toBeNull();
    });
  });

  // ── Render daftar bab ─────────────────────────────────────────────────────

  describe('mount() — daftar bab accordion', () => {
    it('merender accordion untuk setiap bab dalam fixture', async () => {
      const { container } = await mountPage();

      const accordions = container.querySelectorAll('.bab-accordion');

      expect(accordions.length).toBe(babFixture.isi_bab_pasal.length);
    });

    it('accordion pertama menampilkan nama bab dari bab_pasal[0]', async () => {
      const { container } = await mountPage();

      const firstLabel = container.querySelector('.bab-accordion__label');

      expect(firstLabel).not.toBeNull();
      expect(firstLabel.textContent.trim()).toBe(babFixture.bab_pasal[0]);
    });

    it('accordion pertama menampilkan keterangan dari keterangan_bab_pasal[0]', async () => {
      const { container } = await mountPage();

      const firstKeterangan = container.querySelector('.bab-accordion__keterangan');

      expect(firstKeterangan).not.toBeNull();
      expect(firstKeterangan.textContent.trim()).toBe(babFixture.keterangan_bab_pasal[0]);
    });

    it('setiap accordion memiliki tombol dengan aria-expanded="false" pada awal', async () => {
      const { container } = await mountPage();

      const buttons = container.querySelectorAll('[data-bab-toggle]');

      buttons.forEach((btn) => {
        expect(btn.getAttribute('aria-expanded')).toBe('false');
      });
    });

    it('setiap accordion body tersembunyi (hidden) pada awal', async () => {
      const { container } = await mountPage();

      const bodies = container.querySelectorAll('.bab-accordion__body');

      bodies.forEach((body) => {
        expect(body.hidden).toBe(true);
      });
    });
  });

  // ── Expand/Collapse (TASK-008) ────────────────────────────────────────────

  describe('expand/collapse accordion — TASK-008', () => {
    it('klik accordion header mengubah aria-expanded menjadi "true"', async () => {
      const { container } = await mountPage();

      const firstButton = container.querySelector('[data-bab-toggle]');
      firstButton.click();

      expect(firstButton.getAttribute('aria-expanded')).toBe('true');
    });

    it('klik accordion header menampilkan accordion body', async () => {
      const { container } = await mountPage();

      const firstButton = container.querySelector('[data-bab-toggle]');
      const bodyId = firstButton.getAttribute('aria-controls');
      const body = container.querySelector(`#${bodyId}`);

      firstButton.click();

      expect(body.hidden).toBe(false);
    });

    it('klik kedua pada accordion header menyembunyikan body kembali', async () => {
      const { container } = await mountPage();

      const firstButton = container.querySelector('[data-bab-toggle]');
      const bodyId = firstButton.getAttribute('aria-controls');
      const body = container.querySelector(`#${bodyId}`);

      firstButton.click(); // buka
      firstButton.click(); // tutup

      expect(body.hidden).toBe(true);
      expect(firstButton.getAttribute('aria-expanded')).toBe('false');
    });

    it('membuka accordion menambahkan class is-open pada .bab-accordion', async () => {
      const { container } = await mountPage();

      const firstAccordion = container.querySelector('.bab-accordion');
      const firstButton = firstAccordion.querySelector('[data-bab-toggle]');

      firstButton.click();

      expect(firstAccordion.classList.contains('is-open')).toBe(true);
    });

    it('menutup accordion menghapus class is-open', async () => {
      const { container } = await mountPage();

      const firstAccordion = container.querySelector('.bab-accordion');
      const firstButton = firstAccordion.querySelector('[data-bab-toggle]');

      firstButton.click(); // buka
      firstButton.click(); // tutup

      expect(firstAccordion.classList.contains('is-open')).toBe(false);
    });
  });

  // ── Link navigasi ─────────────────────────────────────────────────────────

  describe('link navigasi', () => {
    it('accordion body menampilkan link ke /bab-pasal/:nomor', async () => {
      const { container } = await mountPage();

      const firstDetailLink = container.querySelector('.bab-accordion__detail-link');

      expect(firstDetailLink).not.toBeNull();
      const href = firstDetailLink.getAttribute('href');
      expect(href).toContain('/bab-pasal/1');
    });

    it('accordion body menampilkan link pasal yang valid', async () => {
      const { container } = await mountPage();

      // Buka accordion pertama
      const firstButton = container.querySelector('[data-bab-toggle]');
      firstButton.click();

      const pasalLinks = container.querySelectorAll('.bab-accordion__pasal-link');

      expect(pasalLinks.length).toBeGreaterThan(0);
      const firstLink = pasalLinks[0];
      expect(firstLink.getAttribute('href')).toContain('/pasal/');
    });
  });

  // ── Error state ───────────────────────────────────────────────────────────

  describe('mount() — error state', () => {
    it('menampilkan error state jika repository melempar error', async () => {
      const { container } = await mountPage({
        loadBabPasal: vi.fn().mockRejectedValue(new Error('Network error')),
      });

      expect(container.querySelector('[data-page-error]')).not.toBeNull();
    });

    it('error state menampilkan pesan yang informatif', async () => {
      const { container } = await mountPage({
        loadBabPasal: vi.fn().mockRejectedValue(new Error('Network error')),
      });

      expect(container.textContent).toContain('tidak dapat dimuat');
    });

    it('error state memiliki tombol retry', async () => {
      const { container } = await mountPage({
        loadBabPasal: vi.fn().mockRejectedValue(new Error('Network error')),
      });

      const retryBtn = container.querySelector('[data-action="retry"]');

      expect(retryBtn).not.toBeNull();
    });

    it('klik tombol retry memanggil loadBabPasal kembali', async () => {
      const loadBabPasal = vi.fn().mockRejectedValue(new Error('Network error'));
      const { container } = await mountPage({ loadBabPasal });

      const retryBtn = container.querySelector('[data-action="retry"]');
      retryBtn.click();

      // Pemanggilan kedua (retry) terjadi
      expect(loadBabPasal).toHaveBeenCalledTimes(2);
    });
  });
});
