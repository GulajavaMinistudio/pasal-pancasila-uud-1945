/**
 * @file test/component/UUDAsliPage.test.js
 * @description Component tests untuk src/pages/UUDAsliPage.js
 *
 * Cakupan (TASK-009, TASK-010):
 *   - Render header "Naskah Asli UUD 1945" dan badge "UUD 1945 Naskah Asli"
 *   - Menampilkan semua pasal dari fixture setelah mount
 *   - Setiap pasal menampilkan nama pasal, bab, dan badge "Naskah Asli"
 *   - Dropdown filter bab berisi opsi "Semua Bab" + semua bab unik
 *   - Filter by bab — menampilkan hanya pasal dari bab yang dipilih
 *   - Filter "Semua Bab" kembali menampilkan seluruh pasal
 *   - Counter pasal diperbarui saat filter berubah
 *   - Error state tampil jika repository melempar error
 *   - Retry action memanggil mount ulang
 *
 * Prinsip F.I.R.S.T — tidak ada fetch() nyata, semua dependensi di-mock.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { UUDAsliPage } from '../../src/pages/UUDAsliPage.js';
import uudAsliFixture from '../../src/data/fixture/pasaluud45noamandemen.json';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Buat mock repository uudAsli. */
function createMockUUDAsliRepository(overrides = {}) {
  return {
    loadPasalUUDNoAmandemen: vi.fn().mockResolvedValue(uudAsliFixture.data),
    ...overrides,
  };
}

/** Buat container DOM dan mount UUDAsliPage. */
async function mountPage(repositoryOverrides = {}) {
  const container = document.createElement('div');
  const sidebarEl = document.createElement('div');
  const uudAsliRepository = createMockUUDAsliRepository(repositoryOverrides);

  const page = new UUDAsliPage(container, { sidebarEl, uudAsliRepository });
  await page.mount();

  return { container, sidebarEl, uudAsliRepository, page };
}

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe('UUDAsliPage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ── Render dasar ──────────────────────────────────────────────────────────

  it('merender badge "UUD 1945 Naskah Asli" setelah mount', async () => {
    const { container } = await mountPage();
    expect(container.querySelector('.uud-asli-header__badge')).not.toBeNull();
    expect(container.querySelector('.uud-asli-header__badge')?.textContent).toContain(
      'UUD 1945 Naskah Asli'
    );
  });

  it('merender heading halaman "Naskah Asli UUD 1945"', async () => {
    const { container } = await mountPage();
    const heading = container.querySelector('.page-section-title');
    expect(heading?.textContent).toBe('Naskah Asli UUD 1945');
  });

  it('merender semua pasal dari fixture setelah mount', async () => {
    const { container } = await mountPage();
    const cards = container.querySelectorAll('[data-pasal]');
    expect(cards.length).toBe(uudAsliFixture.data.length);
  });

  it('menampilkan nama pasal pada setiap card', async () => {
    const { container } = await mountPage();
    const firstCard = container.querySelector('[data-pasal]');
    expect(firstCard?.textContent).toContain(uudAsliFixture.data[0].namapasal);
  });

  it('menampilkan badge "Naskah Asli" pada setiap card', async () => {
    const { container } = await mountPage();
    const badges = container.querySelectorAll('.badge-asli');
    expect(badges.length).toBe(uudAsliFixture.data.length);
  });

  it('menampilkan label bab pada setiap card', async () => {
    const { container } = await mountPage();
    const babLabels = container.querySelectorAll('.uud-asli-card__bab-label');
    expect(babLabels.length).toBe(uudAsliFixture.data.length);
  });

  // ── Filter Dropdown ───────────────────────────────────────────────────────

  it('merender dropdown filter bab', async () => {
    const { container } = await mountPage();
    const select = container.querySelector('[data-bab-filter]');
    expect(select).not.toBeNull();
  });

  it('dropdown berisi opsi "Semua Bab" sebagai opsi pertama', async () => {
    const { container } = await mountPage();
    const select = container.querySelector('[data-bab-filter]');
    const firstOption = select?.querySelectorAll('option')[0];
    expect(firstOption?.textContent?.trim()).toBe('Semua Bab');
  });

  it('dropdown berisi opsi untuk setiap bab unik dari data', async () => {
    const { container } = await mountPage();
    const uniqueBabs = [...new Set(uudAsliFixture.data.map((p) => p.babpasal))];
    const select = container.querySelector('[data-bab-filter]');
    // +1 karena opsi "Semua Bab"
    expect(select?.querySelectorAll('option').length).toBe(uniqueBabs.length + 1);
  });

  // ── Filter Behavior ───────────────────────────────────────────────────────

  it('filter bab — menampilkan hanya pasal dari bab yang dipilih', async () => {
    const { container } = await mountPage();
    const targetBab = uudAsliFixture.data[0].babpasal;
    const expectedCount = uudAsliFixture.data.filter((p) => p.babpasal === targetBab).length;

    const select = /** @type {HTMLSelectElement} */ (container.querySelector('[data-bab-filter]'));
    select.value = targetBab;
    select.dispatchEvent(new Event('change', { bubbles: true }));

    const cards = container.querySelectorAll('[data-pasal]');
    expect(cards.length).toBe(expectedCount);
  });

  it('filter "Semua Bab" kembali menampilkan seluruh pasal', async () => {
    const { container } = await mountPage();

    // Pertama filter ke bab tertentu
    const select = /** @type {HTMLSelectElement} */ (container.querySelector('[data-bab-filter]'));
    select.value = uudAsliFixture.data[0].babpasal;
    select.dispatchEvent(new Event('change', { bubbles: true }));

    // Lalu kembali ke "Semua Bab"
    select.value = '__all__';
    select.dispatchEvent(new Event('change', { bubbles: true }));

    const cards = container.querySelectorAll('[data-pasal]');
    expect(cards.length).toBe(uudAsliFixture.data.length);
  });

  it('counter pasal diperbarui setelah filter bab berubah', async () => {
    const { container } = await mountPage();
    const targetBab = uudAsliFixture.data[0].babpasal;
    const expectedCount = uudAsliFixture.data.filter((p) => p.babpasal === targetBab).length;

    const select = /** @type {HTMLSelectElement} */ (container.querySelector('[data-bab-filter]'));
    select.value = targetBab;
    select.dispatchEvent(new Event('change', { bubbles: true }));

    const counter = container.querySelector('[data-pasal-count]');
    expect(counter?.textContent).toBe(`${expectedCount} Pasal`);
  });

  // ── Repository calls ──────────────────────────────────────────────────────

  it('memanggil loadPasalUUDNoAmandemen tepat satu kali saat mount', async () => {
    const { uudAsliRepository } = await mountPage();
    expect(uudAsliRepository.loadPasalUUDNoAmandemen).toHaveBeenCalledTimes(1);
  });

  // ── Error State ───────────────────────────────────────────────────────────

  it('menampilkan error state jika repository melempar error', async () => {
    const { container } = await mountPage({
      loadPasalUUDNoAmandemen: vi.fn().mockRejectedValue(new Error('Network error')),
    });
    expect(container.querySelector('[data-page-error]')).not.toBeNull();
  });

  it('menampilkan pesan error yang informatif', async () => {
    const { container } = await mountPage({
      loadPasalUUDNoAmandemen: vi.fn().mockRejectedValue(new Error('fail')),
    });
    expect(container.textContent).toContain('tidak dapat dimuat');
  });

  it('menampilkan tombol retry saat error', async () => {
    const { container } = await mountPage({
      loadPasalUUDNoAmandemen: vi.fn().mockRejectedValue(new Error('fail')),
    });
    expect(container.querySelector('[data-action="retry"]')).not.toBeNull();
  });

  it('retry action memanggil mount ulang', async () => {
    let callCount = 0;
    const mockFn = vi.fn().mockImplementation(() => {
      callCount++;
      if (callCount === 1) return Promise.reject(new Error('fail'));
      return Promise.resolve(uudAsliFixture.data);
    });

    const container = document.createElement('div');
    const sidebarEl = document.createElement('div');
    const page = new UUDAsliPage(container, {
      sidebarEl,
      uudAsliRepository: { loadPasalUUDNoAmandemen: mockFn },
    });

    await page.mount(); // gagal
    const retryBtn = container.querySelector('[data-action="retry"]');
    retryBtn?.click();
    await new Promise((r) => setTimeout(r, 0));

    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});
