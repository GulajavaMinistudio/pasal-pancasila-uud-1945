/**
 * @file test/component/AmandemenPage.test.js
 * @description Component tests untuk src/pages/AmandemenPage.js
 *
 * Cakupan (TASK-011, TASK-012):
 *   - Render halaman dengan judul "Amandemen UUD 1945"
 *   - Menampilkan 4 section amandemen (I, II, III, IV)
 *   - Pasal dengan amandemen "0" tidak ditampilkan
 *   - Setiap section memiliki header dengan nama amandemen dan tahun
 *   - Setiap item pasal memiliki tombol "Lihat Perbandingan"
 *   - Tombol "Lihat Perbandingan" mengarah ke /amandemen/:nomor yang benar
 *   - Amandemen badge ditampilkan pada setiap item pasal
 *   - Error state tampil jika repository melempar error
 *   - Retry action memanggil mount ulang
 *
 * Prinsip F.I.R.S.T — tidak ada fetch() nyata, semua dependensi di-mock.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { AmandemenPage } from '../../src/pages/AmandemenPage.js';
import ketAmandemenFixture from '../../src/data/fixture/pasaluud45_ket_amandemen.json';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Buat mock repository pasalKetAmandemen. */
function createMockRepository(overrides = {}) {
  return {
    loadPasalUUDKetAmandemen: vi.fn().mockResolvedValue(ketAmandemenFixture.data),
    ...overrides,
  };
}

/** Buat container DOM dan mount AmandemenPage. */
async function mountPage(repositoryOverrides = {}) {
  const container = document.createElement('div');
  const sidebarEl = document.createElement('div');
  const pasalKetAmandemenRepository = createMockRepository(repositoryOverrides);

  const page = new AmandemenPage(container, { sidebarEl, pasalKetAmandemenRepository });
  await page.mount();

  return { container, sidebarEl, pasalKetAmandemenRepository, page };
}

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe('AmandemenPage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ── Render dasar ──────────────────────────────────────────────────────────

  it('merender judul halaman "Amandemen UUD 1945"', async () => {
    const { container } = await mountPage();
    const heading = container.querySelector('.page-section-title');
    expect(heading?.textContent).toBe('Amandemen UUD 1945');
  });

  it('merender deskripsi halaman', async () => {
    const { container } = await mountPage();
    expect(container.querySelector('.amandemen-page-desc')).not.toBeNull();
  });

  // ── Group Amandemen ───────────────────────────────────────────────────────

  it('merender section untuk Amandemen I', async () => {
    const { container } = await mountPage();
    const section = container.querySelector('[data-amandemen-section="1"]');
    expect(section).not.toBeNull();
  });

  it('merender section untuk Amandemen II', async () => {
    const { container } = await mountPage();
    const section = container.querySelector('[data-amandemen-section="2"]');
    expect(section).not.toBeNull();
  });

  it('merender section untuk Amandemen III', async () => {
    const { container } = await mountPage();
    const section = container.querySelector('[data-amandemen-section="3"]');
    expect(section).not.toBeNull();
  });

  it('merender section untuk Amandemen IV', async () => {
    const { container } = await mountPage();
    const section = container.querySelector('[data-amandemen-section="4"]');
    expect(section).not.toBeNull();
  });

  it('section Amandemen I menampilkan label "Amandemen I"', async () => {
    const { container } = await mountPage();
    const section = container.querySelector('[data-amandemen-section="1"]');
    expect(section?.querySelector('.amandemen-group__title')?.textContent).toContain('Amandemen I');
  });

  it('section Amandemen I menampilkan tahun 1999', async () => {
    const { container } = await mountPage();
    const section = container.querySelector('[data-amandemen-section="1"]');
    expect(section?.querySelector('.amandemen-group__year')?.textContent).toContain('1999');
  });

  it('section Amandemen II menampilkan tahun 2000', async () => {
    const { container } = await mountPage();
    const section = container.querySelector('[data-amandemen-section="2"]');
    expect(section?.querySelector('.amandemen-group__year')?.textContent).toContain('2000');
  });

  it('section Amandemen III menampilkan tahun 2001', async () => {
    const { container } = await mountPage();
    const section = container.querySelector('[data-amandemen-section="3"]');
    expect(section?.querySelector('.amandemen-group__year')?.textContent).toContain('2001');
  });

  it('section Amandemen IV menampilkan tahun 2002', async () => {
    const { container } = await mountPage();
    const section = container.querySelector('[data-amandemen-section="4"]');
    expect(section?.querySelector('.amandemen-group__year')?.textContent).toContain('2002');
  });

  // ── Pasal dengan amandemen "0" tidak tampil ───────────────────────────────

  it('pasal dengan amandemen "0" tidak ditampilkan', async () => {
    const { container } = await mountPage();
    const allPasal0 = ketAmandemenFixture.data.filter((p) => p.amandemen === '0');
    for (const pasal of allPasal0) {
      const item = container.querySelector(`[data-pasal="${pasal.namapasal}"]`);
      expect(item).toBeNull();
    }
  });

  // ── Item pasal di dalam section ───────────────────────────────────────────

  it('setiap item pasal memiliki tombol "Lihat Perbandingan"', async () => {
    const { container } = await mountPage();
    const compareLinks = container.querySelectorAll('[data-compare-link]');
    const amendedPasal = ketAmandemenFixture.data.filter((p) => p.amandemen !== '0');
    expect(compareLinks.length).toBe(amendedPasal.length);
  });

  it('tombol "Lihat Perbandingan" mengandung teks yang benar', async () => {
    const { container } = await mountPage();
    const firstLink = container.querySelector('[data-compare-link]');
    expect(firstLink?.textContent).toContain('Lihat Perbandingan');
  });

  it('link "Lihat Perbandingan" mengarah ke URL /amandemen/:nomor', async () => {
    const { container } = await mountPage();
    const links = container.querySelectorAll('[data-compare-link]');
    for (const link of Array.from(links)) {
      expect(link.getAttribute('href')).toMatch(/\/amandemen\//);
    }
  });

  it('setiap item pasal memiliki amandemen badge', async () => {
    const { container } = await mountPage();
    const badges = container.querySelectorAll('.amandemen-badge');
    const amendedPasal = ketAmandemenFixture.data.filter((p) => p.amandemen !== '0');
    expect(badges.length).toBe(amendedPasal.length);
  });

  // ── Repository calls ──────────────────────────────────────────────────────

  it('memanggil loadPasalUUDKetAmandemen tepat satu kali saat mount', async () => {
    const { pasalKetAmandemenRepository } = await mountPage();
    expect(pasalKetAmandemenRepository.loadPasalUUDKetAmandemen).toHaveBeenCalledTimes(1);
  });

  // ── Error State ───────────────────────────────────────────────────────────

  it('menampilkan error state jika repository melempar error', async () => {
    const { container } = await mountPage({
      loadPasalUUDKetAmandemen: vi.fn().mockRejectedValue(new Error('Network error')),
    });
    expect(container.querySelector('[data-page-error]')).not.toBeNull();
  });

  it('menampilkan pesan error yang informatif', async () => {
    const { container } = await mountPage({
      loadPasalUUDKetAmandemen: vi.fn().mockRejectedValue(new Error('fail')),
    });
    expect(container.textContent).toContain('tidak dapat dimuat');
  });

  it('menampilkan tombol retry saat error', async () => {
    const { container } = await mountPage({
      loadPasalUUDKetAmandemen: vi.fn().mockRejectedValue(new Error('fail')),
    });
    expect(container.querySelector('[data-action="retry"]')).not.toBeNull();
  });

  it('retry action memanggil mount ulang', async () => {
    let callCount = 0;
    const mockFn = vi.fn().mockImplementation(() => {
      callCount++;
      if (callCount === 1) return Promise.reject(new Error('fail'));
      return Promise.resolve(ketAmandemenFixture.data);
    });

    const container = document.createElement('div');
    const sidebarEl = document.createElement('div');
    const page = new AmandemenPage(container, {
      sidebarEl,
      pasalKetAmandemenRepository: { loadPasalUUDKetAmandemen: mockFn },
    });

    await page.mount(); // gagal
    const retryBtn = container.querySelector('[data-action="retry"]');
    retryBtn?.click();
    await new Promise((r) => setTimeout(r, 0));

    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});
