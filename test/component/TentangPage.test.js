/**
 * @file test/component/TentangPage.test.js
 * @description Component tests untuk src/pages/TentangPage.js
 *
 * Cakupan (TASK-030):
 *   - Halaman merender tanpa error
 *   - Nama aplikasi ditampilkan
 *   - Badge versi ditampilkan
 *   - Deskripsi aplikasi ditampilkan
 *   - Section Sumber Data ditampilkan
 *   - Tautan Koreksi Pasal ada dan membuka tab baru
 *   - Tautan Saran Masukan ada dan membuka tab baru
 *   - Kedua tautan memiliki rel="noopener noreferrer" (keamanan)
 *
 * Prinsip F.I.R.S.T — tidak ada fetch() nyata; TentangPage adalah halaman statis.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { TentangPage } from '../../src/pages/TentangPage.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Buat container DOM dan mount TentangPage. */
function mountPage() {
  const container = document.createElement('div');
  const sidebarEl = document.createElement('div');

  const page = new TentangPage(container, { sidebarEl });
  page.mount();

  return { container, sidebarEl, page };
}

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe('TentangPage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ── Render dasar ──────────────────────────────────────────────────────────

  it('merender wrapper halaman [data-tentang] setelah mount', () => {
    const { container } = mountPage();
    expect(container.querySelector('[data-tentang]')).not.toBeNull();
  });

  it('menampilkan nama aplikasi "Pancasila & UUD 1945"', () => {
    const { container } = mountPage();
    const nameEl = container.querySelector('.tentang-app-name');
    expect(nameEl).not.toBeNull();
    expect(nameEl?.textContent).toContain('Pancasila');
    expect(nameEl?.textContent).toContain('UUD 1945');
  });

  it('menampilkan badge versi yang mengandung "v1.0.0"', () => {
    const { container } = mountPage();
    const badge = container.querySelector('.tentang-version-badge');
    expect(badge).not.toBeNull();
    expect(badge?.textContent?.trim()).toContain('v1.0.0');
  });

  it('menampilkan logo circle aplikasi', () => {
    const { container } = mountPage();
    expect(container.querySelector('.tentang-logo-circle')).not.toBeNull();
  });

  // ── Deskripsi ─────────────────────────────────────────────────────────────

  it('menampilkan deskripsi aplikasi yang mengandung kata "Pancasila"', () => {
    const { container } = mountPage();
    const desc = container.querySelector('.tentang-description');
    expect(desc).not.toBeNull();
    expect(desc?.textContent).toContain('Pancasila');
  });

  it('deskripsi mengandung kata "Undang-Undang Dasar"', () => {
    const { container } = mountPage();
    const desc = container.querySelector('.tentang-description');
    expect(desc?.textContent).toContain('Undang-Undang Dasar');
  });

  // ── Sumber Data ───────────────────────────────────────────────────────────

  it('menampilkan section Sumber Data', () => {
    const { container } = mountPage();
    expect(container.querySelector('.tentang-sumber-data')).not.toBeNull();
  });

  it('section Sumber Data menyebut "Sekretariat Jenderal MPR RI"', () => {
    const { container } = mountPage();
    const sumber = container.querySelector('.tentang-sumber-data');
    expect(sumber?.textContent).toContain('Sekretariat Jenderal MPR RI');
  });

  // ── Tautan Bantuan & Dukungan ─────────────────────────────────────────────

  it('menampilkan tautan Koreksi Pasal [data-koreksi-link]', () => {
    const { container } = mountPage();
    const link = container.querySelector('[data-koreksi-link]');
    expect(link).not.toBeNull();
  });

  it('tautan Koreksi Pasal mengandung teks "Koreksi Pasal"', () => {
    const { container } = mountPage();
    const link = container.querySelector('[data-koreksi-link]');
    expect(link?.textContent?.trim()).toContain('Koreksi Pasal');
  });

  it('tautan Koreksi Pasal membuka tab baru (target="_blank")', () => {
    const { container } = mountPage();
    const link = container.querySelector('[data-koreksi-link]');
    expect(link?.getAttribute('target')).toBe('_blank');
  });

  it('tautan Koreksi Pasal memiliki rel="noopener noreferrer"', () => {
    const { container } = mountPage();
    const link = container.querySelector('[data-koreksi-link]');
    expect(link?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('menampilkan tautan Saran Masukan [data-saran-link]', () => {
    const { container } = mountPage();
    const link = container.querySelector('[data-saran-link]');
    expect(link).not.toBeNull();
  });

  it('tautan Saran Masukan mengandung teks "Saran Masukan"', () => {
    const { container } = mountPage();
    const link = container.querySelector('[data-saran-link]');
    expect(link?.textContent?.trim()).toContain('Saran Masukan');
  });

  it('tautan Saran Masukan membuka tab baru (target="_blank")', () => {
    const { container } = mountPage();
    const link = container.querySelector('[data-saran-link]');
    expect(link?.getAttribute('target')).toBe('_blank');
  });

  it('tautan Saran Masukan memiliki rel="noopener noreferrer"', () => {
    const { container } = mountPage();
    const link = container.querySelector('[data-saran-link]');
    expect(link?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  // ── Section Bantuan ───────────────────────────────────────────────────────

  it('menampilkan section Bantuan & Dukungan', () => {
    const { container } = mountPage();
    expect(container.querySelector('.tentang-bantuan')).not.toBeNull();
  });
});
