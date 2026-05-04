/**
 * @file test/component/BabPasalDetailPage.test.js
 * @description Component tests untuk src/pages/BabPasalDetailPage.js
 *
 * Cakupan (TASK-007):
 *   - Render header bab dengan nama dan keterangan yang benar
 *   - Render daftar pasal dalam bab yang dipilih
 *   - Navigasi prev/next bab
 *   - Error state 404 untuk nomor bab tidak valid
 *   - Error state untuk kegagalan load data
 *   - Retry action memanggil mount ulang
 *
 * Prinsip F.I.R.S.T — tidak ada fetch() nyata, semua dependensi di-mock.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { BabPasalDetailPage } from '../../src/pages/BabPasalDetailPage.js';
import babFixture from '../../src/data/fixture/babpasal.json';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Buat mock router sederhana. */
function createMockRouter() {
  return { navigate: vi.fn() };
}

/** Buat mock repository babpasal. */
function createMockBabRepository(overrides = {}) {
  return {
    loadBabPasal: vi.fn().mockResolvedValue(babFixture),
    ...overrides,
  };
}

/**
 * Buat container DOM dan mount BabPasalDetailPage dengan nomor tertentu.
 * @param {string} nomor
 * @param {object} repositoryOverrides
 */
async function mountPage(nomor, repositoryOverrides = {}) {
  const container = document.createElement('div');
  const sidebarEl = document.createElement('div');
  const router = createMockRouter();
  const babRepository = createMockBabRepository(repositoryOverrides);

  const page = new BabPasalDetailPage(container, {
    nomor,
    sidebarEl,
    router,
    babRepository,
  });
  await page.mount();

  return { container, sidebarEl, router, babRepository, page };
}

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe('BabPasalDetailPage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ── Render bab pertama ────────────────────────────────────────────────────

  describe('mount("1") — render Bab I', () => {
    it('merender container dengan class page-shell', async () => {
      const { container } = await mountPage('1');

      expect(container.querySelector('.page-shell')).not.toBeNull();
    });

    it('merender header bab dengan nama bab dari fixture', async () => {
      const { container } = await mountPage('1');

      const title = container.querySelector('.bab-detail-header__title');

      expect(title).not.toBeNull();
      expect(title.textContent.trim()).toBe(babFixture.bab_pasal[0]);
    });

    it('merender subtitle bab dengan keterangan dari fixture', async () => {
      const { container } = await mountPage('1');

      const subtitle = container.querySelector('.bab-detail-header__subtitle');

      expect(subtitle).not.toBeNull();
      expect(subtitle.textContent.trim()).toBe(babFixture.keterangan_bab_pasal[0]);
    });

    it('merender nomor romawi "I" dalam badge', async () => {
      const { container } = await mountPage('1');

      const roman = container.querySelector('.bab-detail-header__roman');

      expect(roman).not.toBeNull();
      expect(roman.textContent.trim()).toBe('I');
    });

    it('merender daftar pasal Bab I', async () => {
      const { container } = await mountPage('1');

      const pasalItems = container.querySelectorAll('.bab-detail-pasal-item');
      const expectedCount = babFixture.isi_bab_pasal[0].isi_bab.length;

      expect(pasalItems.length).toBe(expectedCount);
    });

    it('item pasal menampilkan link ke halaman detail pasal', async () => {
      const { container } = await mountPage('1');

      const firstLink = container.querySelector('a.bab-detail-pasal-item');

      expect(firstLink).not.toBeNull();
      expect(firstLink.getAttribute('href')).toContain('/pasal/');
    });

    it('merender link kembali ke /bab-pasal', async () => {
      const { container } = await mountPage('1');

      const backLink = container.querySelector('.page-back-link');

      expect(backLink).not.toBeNull();
      expect(backLink.getAttribute('href')).toContain('/bab-pasal');
    });

    it('tidak merender navigasi "Sebelumnya" untuk bab pertama', async () => {
      const { container } = await mountPage('1');

      const prevLink = container.querySelector('.bab-nav__prev');

      // Bab pertama tidak punya prev
      expect(prevLink).toBeNull();
    });

    it('merender navigasi "Berikutnya" untuk bab pertama', async () => {
      const { container } = await mountPage('1');

      const nextLink = container.querySelector('.bab-nav__next');

      expect(nextLink).not.toBeNull();
      expect(nextLink.getAttribute('href')).toContain('/bab-pasal/2');
    });
  });

  // ── Render bab tengah ─────────────────────────────────────────────────────

  describe('mount("2") — render Bab II (bab tengah di fixture)', () => {
    it('merender header bab dengan nama Bab II', async () => {
      const { container } = await mountPage('2');

      const title = container.querySelector('.bab-detail-header__title');

      expect(title.textContent.trim()).toBe(babFixture.bab_pasal[1]);
    });

    it('merender nomor romawi "II" dalam badge', async () => {
      const { container } = await mountPage('2');

      const roman = container.querySelector('.bab-detail-header__roman');

      expect(roman.textContent.trim()).toBe('II');
    });

    it('merender navigasi "Sebelumnya" dan "Berikutnya"', async () => {
      const { container } = await mountPage('2');

      const prevLink = container.querySelector('.bab-nav__prev');
      const nextLink = container.querySelector('.bab-nav__next');

      expect(prevLink).not.toBeNull();
      expect(nextLink).not.toBeNull();
    });

    it('link Sebelumnya mengarah ke bab 1', async () => {
      const { container } = await mountPage('2');

      const prevLink = container.querySelector('.bab-nav__prev');

      expect(prevLink.getAttribute('href')).toContain('/bab-pasal/1');
    });

    it('link Berikutnya mengarah ke bab 3', async () => {
      const { container } = await mountPage('2');

      const nextLink = container.querySelector('.bab-nav__next');

      expect(nextLink.getAttribute('href')).toContain('/bab-pasal/3');
    });
  });

  // ── Render bab dengan pasal dihapus ──────────────────────────────────────

  describe('bab dengan pasal dihapus', () => {
    it('menampilkan item pasal deleted jika isi_bab dimulai dengan "Pasal sudah dihapus"', async () => {
      // Gunakan inline mock yang berisi bab dengan pasal dihapus
      const mockDataWithDeleted = {
        bab_pasal: ['Bab I Bentuk dan Kedaulatan', 'Bab IV Dewan Pertimbangan Agung (Dihapus)'],
        keterangan_bab_pasal: ['Bentuk dan Kedaulatan', 'Dewan Pertimbangan Agung (Dihapus)'],
        isi_bab_pasal: [
          { nama_bab: 'Bab I', isi_bab: ['Pasal 1'] },
          {
            nama_bab: 'Bab IV',
            isi_bab: ['Pasal sudah dihapus pada amendemen keempat Undang-Undang Dasar'],
          },
        ],
      };

      const container = document.createElement('div');
      const sidebarEl = document.createElement('div');
      const router = createMockRouter();
      const babRepository = {
        loadBabPasal: vi.fn().mockResolvedValue(mockDataWithDeleted),
      };

      const page = new BabPasalDetailPage(container, {
        nomor: '2',
        sidebarEl,
        router,
        babRepository,
      });
      await page.mount();

      const deletedItem = container.querySelector('.bab-detail-pasal-item--deleted');

      expect(deletedItem).not.toBeNull();
    });
  });

  // ── Error state 404 ───────────────────────────────────────────────────────

  describe('mount() — error state 404', () => {
    it('menampilkan error state 404 untuk nomor bab "0"', async () => {
      const { container } = await mountPage('0');

      expect(container.querySelector('[data-page-error]')).not.toBeNull();
    });

    it('menampilkan error state 404 untuk nomor bab "99"', async () => {
      const { container } = await mountPage('99');

      expect(container.querySelector('[data-page-error]')).not.toBeNull();
    });

    it('menampilkan error state 404 untuk nomor bab non-numerik', async () => {
      const { container } = await mountPage('abc');

      expect(container.querySelector('[data-page-error]')).not.toBeNull();
    });

    it('tombol retry pada 404 memanggil router.navigate("/bab-pasal")', async () => {
      const { container, router } = await mountPage('0');

      const retryBtn = container.querySelector('[data-action="retry"]');
      retryBtn.click();

      expect(router.navigate).toHaveBeenCalledWith('/bab-pasal');
    });
  });

  // ── Error state load gagal ────────────────────────────────────────────────

  describe('mount() — error state load gagal', () => {
    it('menampilkan error state jika repository melempar error', async () => {
      const { container } = await mountPage('1', {
        loadBabPasal: vi.fn().mockRejectedValue(new Error('Network error')),
      });

      expect(container.querySelector('[data-page-error]')).not.toBeNull();
    });

    it('klik retry memanggil loadBabPasal kembali', async () => {
      const loadBabPasal = vi.fn().mockRejectedValue(new Error('Network error'));
      const { container } = await mountPage('1', { loadBabPasal });

      const retryBtn = container.querySelector('[data-action="retry"]');
      retryBtn.click();

      expect(loadBabPasal).toHaveBeenCalledTimes(2);
    });
  });
});
