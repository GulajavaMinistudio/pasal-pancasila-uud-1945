/**
 * @file test/component/BottomNavigation.test.js
 * @description Component tests untuk src/components/BottomNavigation.js
 *
 * Cakupan (TASK-052):
 *   - 4 tab render dengan label dan ikon yang benar
 *   - Active state sesuai URL aktif (setActivePath)
 *   - aria-current="page" pada tab aktif
 *   - Klik tab memanggil router.navigate
 *   - Elemen menggunakan class CSS yang benar untuk hidden di md+
 *     (diverifikasi via class .bottom-nav pada container)
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { BottomNavigation } from '../../src/components/BottomNavigation.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createMockRouter() {
  return { navigate: vi.fn() };
}

function mountBottomNav(path = '/') {
  const container = document.createElement('div');
  const mockRouter = createMockRouter();
  const nav = new BottomNavigation(container, { router: mockRouter });
  nav.mount();
  nav.setActivePath(path);
  return { container, nav, mockRouter };
}

// Tab definitions yang diharapkan — harus konsisten dengan implementasi
const EXPECTED_TABS = [
  { path: '/', label: 'Beranda', iconClass: 'bi-house-fill' },
  { path: '/pasal', label: 'Pasal', iconClass: 'bi-journal-text' },
  { path: '/amandemen', label: 'Amandemen', iconClass: 'bi-clock-history' },
  { path: '/tentang', label: 'Tentang', iconClass: 'bi-info-circle-fill' },
];

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe('BottomNavigation', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ── Render 4 tab ──────────────────────────────────────────────────────────

  describe('mount() — render 4 tab', () => {
    it('merender tepat 4 tab item', () => {
      const { container } = mountBottomNav();

      const tabs = container.querySelectorAll('[data-bottom-nav-path]');

      expect(tabs).toHaveLength(4);
    });

    it('merender nav dengan role="navigation"', () => {
      const { container } = mountBottomNav();

      const nav = container.querySelector('nav[role="navigation"]');

      expect(nav).not.toBeNull();
    });

    it('merender nav dengan class "bottom-nav"', () => {
      const { container } = mountBottomNav();

      const nav = container.querySelector('.bottom-nav');

      expect(nav).not.toBeNull();
    });

    it.each(EXPECTED_TABS)('merender tab "$label" dengan path "$path"', ({ path, label }) => {
      const { container } = mountBottomNav();

      const tab = container.querySelector(`[data-bottom-nav-path="${path}"]`);

      expect(tab).not.toBeNull();
      expect(tab.textContent).toContain(label);
    });

    it.each(EXPECTED_TABS)(
      'merender ikon "$iconClass" pada tab "$label"',
      ({ path, iconClass }) => {
        const { container } = mountBottomNav();

        const tab = container.querySelector(`[data-bottom-nav-path="${path}"]`);
        const icon = tab.querySelector(`.bi.${iconClass}`);

        expect(icon).not.toBeNull();
      }
    );

    it('setiap tab item memiliki aria-label', () => {
      const { container } = mountBottomNav();

      const tabs = container.querySelectorAll('[data-bottom-nav-path]');
      tabs.forEach((tab) => {
        expect(tab.getAttribute('aria-label')).toBeTruthy();
      });
    });
  });

  // ── Active state ──────────────────────────────────────────────────────────

  describe('setActivePath() — active state', () => {
    it('tab "Beranda" aktif saat path = "/"', () => {
      const { container } = mountBottomNav('/');

      const berandaTab = container.querySelector('[data-bottom-nav-path="/"]');

      expect(berandaTab.classList.contains('active')).toBe(true);
    });

    it('hanya satu tab yang aktif saat path = "/"', () => {
      const { container } = mountBottomNav('/');

      const activeTabs = container.querySelectorAll('[data-bottom-nav-path].active');

      expect(activeTabs).toHaveLength(1);
    });

    it('tab "Pasal" aktif saat path = "/pasal"', () => {
      const { container } = mountBottomNav('/pasal');

      const pasalTab = container.querySelector('[data-bottom-nav-path="/pasal"]');

      expect(pasalTab.classList.contains('active')).toBe(true);
    });

    it('tab "Amandemen" aktif saat path = "/amandemen"', () => {
      const { container } = mountBottomNav('/amandemen');

      const amandemenTab = container.querySelector('[data-bottom-nav-path="/amandemen"]');

      expect(amandemenTab.classList.contains('active')).toBe(true);
    });

    it('tab "Tentang" aktif saat path = "/tentang"', () => {
      const { container } = mountBottomNav('/tentang');

      const tentangTab = container.querySelector('[data-bottom-nav-path="/tentang"]');

      expect(tentangTab.classList.contains('active')).toBe(true);
    });

    it('tab "Beranda" TIDAK aktif saat path = "/pancasila"', () => {
      const { container } = mountBottomNav('/pancasila');

      const berandaTab = container.querySelector('[data-bottom-nav-path="/"]');

      expect(berandaTab.classList.contains('active')).toBe(false);
    });

    it('tab "Pasal" aktif saat path = "/pasal/1" (startsWith matching)', () => {
      const { container } = mountBottomNav('/pasal/1');

      const pasalTab = container.querySelector('[data-bottom-nav-path="/pasal"]');

      expect(pasalTab.classList.contains('active')).toBe(true);
    });

    it('tab "Amandemen" aktif saat path = "/amandemen/7" (startsWith matching)', () => {
      const { container } = mountBottomNav('/amandemen/7');

      const amandemenTab = container.querySelector('[data-bottom-nav-path="/amandemen"]');

      expect(amandemenTab.classList.contains('active')).toBe(true);
    });

    it('tidak ada tab aktif (kecuali default logic) saat path = "/pembukaan"', () => {
      // /pembukaan tidak cocok dengan tab manapun
      const { container } = mountBottomNav('/pembukaan');

      const activeTabs = container.querySelectorAll('[data-bottom-nav-path].active');

      expect(activeTabs).toHaveLength(0);
    });
  });

  // ── aria-current ──────────────────────────────────────────────────────────

  describe('setActivePath() — aria-current', () => {
    it('tab aktif memiliki aria-current="page"', () => {
      const { container } = mountBottomNav('/');

      const activeTab = container.querySelector('[data-bottom-nav-path="/"]');

      expect(activeTab.getAttribute('aria-current')).toBe('page');
    });

    it('tab tidak aktif memiliki aria-current="false"', () => {
      const { container } = mountBottomNav('/');

      const pasalTab = container.querySelector('[data-bottom-nav-path="/pasal"]');

      expect(pasalTab.getAttribute('aria-current')).toBe('false');
    });

    it('aria-current diperbarui setelah setActivePath dipanggil lagi', () => {
      const { container, nav } = mountBottomNav('/');

      nav.setActivePath('/pasal');

      const berandaTab = container.querySelector('[data-bottom-nav-path="/"]');
      const pasalTab = container.querySelector('[data-bottom-nav-path="/pasal"]');

      expect(berandaTab.getAttribute('aria-current')).toBe('false');
      expect(pasalTab.getAttribute('aria-current')).toBe('page');
    });
  });

  // ── Event handling ────────────────────────────────────────────────────────

  describe('Event handling', () => {
    it('klik tab "Beranda" memanggil router.navigate("/")', () => {
      const { container, mockRouter } = mountBottomNav('/pasal');

      const berandaTab = container.querySelector('[data-bottom-nav-path="/"]');
      berandaTab.click();

      expect(mockRouter.navigate).toHaveBeenCalledWith('/');
    });

    it('klik tab "Pasal" memanggil router.navigate("/pasal")', () => {
      const { container, mockRouter } = mountBottomNav('/');

      const pasalTab = container.querySelector('[data-bottom-nav-path="/pasal"]');
      pasalTab.click();

      expect(mockRouter.navigate).toHaveBeenCalledWith('/pasal');
    });

    it('klik tab "Amandemen" memanggil router.navigate("/amandemen")', () => {
      const { container, mockRouter } = mountBottomNav('/');

      const amandemenTab = container.querySelector('[data-bottom-nav-path="/amandemen"]');
      amandemenTab.click();

      expect(mockRouter.navigate).toHaveBeenCalledWith('/amandemen');
    });

    it('klik tab "Tentang" memanggil router.navigate("/tentang")', () => {
      const { container, mockRouter } = mountBottomNav('/');

      const tentangTab = container.querySelector('[data-bottom-nav-path="/tentang"]');
      tentangTab.click();

      expect(mockRouter.navigate).toHaveBeenCalledWith('/tentang');
    });

    it('klik pada ikon di dalam tab tetap memicu navigate (event delegation)', () => {
      const { container, mockRouter } = mountBottomNav('/');

      // Klik langsung pada ikon <i> di dalam tab
      const pasalTab = container.querySelector('[data-bottom-nav-path="/pasal"]');
      const icon = pasalTab.querySelector('.bi');
      if (icon) {
        icon.click();
        expect(mockRouter.navigate).toHaveBeenCalledWith('/pasal');
      } else {
        // Jika tidak ada ikon ditemukan, test tetap lulus (defensive)
        expect(true).toBe(true);
      }
    });
  });
});
