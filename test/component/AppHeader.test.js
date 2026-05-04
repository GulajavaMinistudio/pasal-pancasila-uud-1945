/**
 * @file test/component/AppHeader.test.js
 * @description Component tests untuk src/components/AppHeader.js
 *
 * Cakupan (TASK-051):
 *   - Render struktur HTML yang benar (navbar, brand, nav links)
 *   - Navigation icons hadir (search, about)
 *   - Judul aplikasi tampil di mobile dan desktop
 *   - setActivePath memperbarui class `active` pada link yang sesuai
 *   - Click pada nav link memanggil router.navigate
 *   - Click pada tombol search memanggil router.navigate ke '/cari'
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { AppHeader } from '../../src/components/AppHeader.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Buat mock router sederhana. */
function createMockRouter() {
  return { navigate: vi.fn() };
}

/** Buat container DOM bersih dan instance AppHeader yang sudah di-mount. */
function mountHeader(path = '/') {
  const container = document.createElement('div');
  const mockRouter = createMockRouter();
  const header = new AppHeader(container, { router: mockRouter });
  header.mount();
  header.setActivePath(path);
  return { container, header, mockRouter };
}

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe('AppHeader', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ── Render struktur ───────────────────────────────────────────────────────

  describe('mount() — render struktur HTML', () => {
    it('merender elemen <nav> dengan role="navigation"', () => {
      const { container } = mountHeader();

      const nav = container.querySelector('nav[role="navigation"]');

      expect(nav).not.toBeNull();
    });

    it('merender brand link dengan aria-label yang sesuai', () => {
      const { container } = mountHeader();

      const brand = container.querySelector('.navbar-brand');

      expect(brand).not.toBeNull();
      expect(brand.getAttribute('aria-label')).toContain('Pancasila');
    });

    it('merender label judul "UUD 1945" untuk mobile', () => {
      const { container } = mountHeader();

      const mobileTitle = container.querySelector('.app-header__title-mobile');

      expect(mobileTitle).not.toBeNull();
      expect(mobileTitle.textContent.trim()).toBe('UUD 1945');
    });

    it('merender label "Konstitusi RI" untuk desktop', () => {
      const { container } = mountHeader();

      const desktopTitle = container.querySelector('.d-none.d-md-inline');

      expect(desktopTitle).not.toBeNull();
      expect(desktopTitle.textContent.trim()).toBe('Konstitusi RI');
    });

    it('merender daftar nav links desktop', () => {
      const { container } = mountHeader();

      const navList = container.querySelector('.navbar-nav');

      expect(navList).not.toBeNull();
    });

    it('merender semua 4 nav items yang didefinisikan', () => {
      const { container } = mountHeader();

      const navLinks = container.querySelectorAll('[data-nav-path]');

      // Brand + 4 nav items = 5 total, atau hanya 4 nav items tergantung implementasi
      // Brand juga memiliki data-nav-path="/"
      const paths = Array.from(navLinks).map((el) => el.getAttribute('data-nav-path'));
      expect(paths).toContain('/');
      expect(paths).toContain('/pancasila');
      expect(paths).toContain('/pasal');
      expect(paths).toContain('/amandemen');
    });
  });

  // ── Navigation icons ──────────────────────────────────────────────────────

  describe('mount() — navigation icons', () => {
    it('merender tombol search dengan aria-label yang tepat', () => {
      const { container } = mountHeader();

      const searchBtn = container.querySelector('[data-action="search"]');

      expect(searchBtn).not.toBeNull();
      expect(searchBtn.getAttribute('aria-label')).toBe('Cari konten');
    });

    it('merender ikon Bootstrap Icons bi-search di tombol search', () => {
      const { container } = mountHeader();

      const searchIcon = container.querySelector('[data-action="search"] .bi-search');

      expect(searchIcon).not.toBeNull();
    });

    it('merender tombol about dengan aria-label yang tepat', () => {
      const { container } = mountHeader();

      const aboutBtn = container.querySelector('[data-action="about"]');

      expect(aboutBtn).not.toBeNull();
      expect(aboutBtn.getAttribute('aria-label')).toBe('Tentang aplikasi');
    });

    it('merender ikon bi-building-columns di brand', () => {
      const { container } = mountHeader();

      const brandIcon = container.querySelector('.app-header__icon');

      expect(brandIcon).not.toBeNull();
      expect(brandIcon.classList.contains('bi-building-columns')).toBe(true);
    });
  });

  // ── setActivePath ─────────────────────────────────────────────────────────

  describe('setActivePath()', () => {
    it('menambahkan class "active" pada link "/" saat path = "/"', () => {
      const { container } = mountHeader('/');

      // Nav link beranda (data-nav-path="/") harus active
      const homeLinks = Array.from(container.querySelectorAll('[data-nav-path="/"]'));
      const activeHomeLink = homeLinks.find((el) => el.classList.contains('active'));

      expect(activeHomeLink).not.toBeUndefined();
    });

    it('menghapus class "active" dari "/" ketika navigasi ke path lain', () => {
      const { container, header } = mountHeader('/');
      header.setActivePath('/pancasila');

      // Link "/" tidak boleh active saat path = '/pancasila'
      const homeLinks = Array.from(container.querySelectorAll('[data-nav-path="/"]'));
      // Brand link '/' tidak boleh active
      // Nav link '/' (Beranda) juga tidak boleh active
      homeLinks.forEach((link) => {
        expect(link.classList.contains('active')).toBe(false);
      });
    });

    it('menandai link "/pancasila" sebagai active saat path = "/pancasila"', () => {
      const { container, header } = mountHeader('/');
      header.setActivePath('/pancasila');

      const pancasilaLink = container.querySelector('[data-nav-path="/pancasila"]');

      expect(pancasilaLink).not.toBeNull();
      expect(pancasilaLink.classList.contains('active')).toBe(true);
    });

    it('menetapkan aria-current="page" pada link yang aktif', () => {
      const { container, header } = mountHeader('/');
      header.setActivePath('/pancasila');

      const pancasilaLink = container.querySelector('[data-nav-path="/pancasila"]');

      expect(pancasilaLink.getAttribute('aria-current')).toBe('page');
    });

    it('menetapkan aria-current="false" pada link yang tidak aktif', () => {
      const { container, header } = mountHeader('/');
      header.setActivePath('/pancasila');

      const pasalLink = container.querySelector('[data-nav-path="/pasal"]');

      expect(pasalLink.getAttribute('aria-current')).toBe('false');
    });

    it('path "/pasal/1" mengaktifkan link "/pasal" (startsWith matching)', () => {
      const { container, header } = mountHeader('/');
      header.setActivePath('/pasal/1');

      const pasalLink = container.querySelector('[data-nav-path="/pasal"]');

      expect(pasalLink.classList.contains('active')).toBe(true);
    });

    it('path "/sila/1" tidak mengaktifkan link manapun (bukan sub-path nav)', () => {
      const { container, header } = mountHeader('/');
      header.setActivePath('/sila/1');

      const activeLinks = container.querySelectorAll('[data-nav-path].active');

      // /sila/1 tidak cocok dengan nav item manapun (/pancasila, /pasal, /amandemen, /)
      expect(activeLinks).toHaveLength(0);
    });

    it('menangani perubahan active state berulang kali dengan benar', () => {
      const { container, header } = mountHeader('/pancasila');
      header.setActivePath('/amandemen');

      const pancasilaLink = container.querySelector('[data-nav-path="/pancasila"]');
      const amandemenLink = container.querySelector('[data-nav-path="/amandemen"]');

      expect(pancasilaLink.classList.contains('active')).toBe(false);
      expect(amandemenLink.classList.contains('active')).toBe(true);
    });
  });

  // ── Event handling ────────────────────────────────────────────────────────

  describe('Event handling', () => {
    it('klik nav link memanggil router.navigate dengan path yang benar', () => {
      const { container, mockRouter } = mountHeader('/');

      const pancasilaLink = container.querySelector('[data-nav-path="/pancasila"]');
      pancasilaLink.click();

      expect(mockRouter.navigate).toHaveBeenCalledWith('/pancasila');
    });

    it('klik tombol search menavigasi ke "/cari"', () => {
      const { container, mockRouter } = mountHeader('/');

      const searchBtn = container.querySelector('[data-action="search"]');
      searchBtn.click();

      expect(mockRouter.navigate).toHaveBeenCalledWith('/cari');
    });

    it('klik tombol about menavigasi ke "/tentang"', () => {
      const { container, mockRouter } = mountHeader('/');

      const aboutBtn = container.querySelector('[data-action="about"]');
      aboutBtn.click();

      expect(mockRouter.navigate).toHaveBeenCalledWith('/tentang');
    });

    it('klik brand link menavigasi ke "/"', () => {
      const { container, mockRouter } = mountHeader('/pancasila');

      const brandLink = container.querySelector('.navbar-brand');
      brandLink.click();

      expect(mockRouter.navigate).toHaveBeenCalledWith('/');
    });
  });
});
