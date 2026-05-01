/**
 * @file test/component/AppLayout.test.js
 * @description Component tests untuk src/components/AppLayout.js
 *
 * Cakupan:
 *   - mount() merender struktur layout dua kolom
 *   - getSidebarSlot() mengembalikan element sidebar yang dapat diisi
 *   - getMainSlot() mengembalikan element main yang dapat diisi
 *   - Footer merender copyright dan tautan cepat
 *   - Guard: getSidebarSlot/getMainSlot throw sebelum mount()
 */

import { afterEach, describe, expect, it } from 'vitest';
import { AppLayout } from '../../src/components/AppLayout.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mountLayout() {
  const container = document.createElement('div');
  const layout = new AppLayout(container);
  layout.mount();
  return { container, layout };
}

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe('AppLayout', () => {
  afterEach(() => {
    // Cleanup DOM
  });

  // ── mount() — struktur layout ─────────────────────────────────────────────

  describe('mount() — render struktur layout', () => {
    it('merender elemen .app-layout sebagai wrapper utama', () => {
      const { container } = mountLayout();

      const layoutEl = container.querySelector('.app-layout');

      expect(layoutEl).not.toBeNull();
    });

    it('merender sidebar <aside> dengan role="complementary"', () => {
      const { container } = mountLayout();

      const sidebar = container.querySelector('aside[role="complementary"]');

      expect(sidebar).not.toBeNull();
    });

    it('merender sidebar dengan class "app-sidebar"', () => {
      const { container } = mountLayout();

      const sidebar = container.querySelector('.app-sidebar');

      expect(sidebar).not.toBeNull();
    });

    it('merender main content area dengan class "app-main"', () => {
      const { container } = mountLayout();

      const mainArea = container.querySelector('.app-main');

      expect(mainArea).not.toBeNull();
    });

    it('merender element #sidebar-slot di dalam sidebar', () => {
      const { container } = mountLayout();

      const sidebarSlot = container.querySelector('#sidebar-slot');

      expect(sidebarSlot).not.toBeNull();
    });

    it('merender element #main-slot di dalam app-main', () => {
      const { container } = mountLayout();

      const mainSlot = container.querySelector('#main-slot');

      expect(mainSlot).not.toBeNull();
    });

    it('merender footer dengan role="contentinfo"', () => {
      const { container } = mountLayout();

      const footer = container.querySelector('footer[role="contentinfo"]');

      expect(footer).not.toBeNull();
    });

    it('footer memiliki class "app-footer"', () => {
      const { container } = mountLayout();

      const footer = container.querySelector('.app-footer');

      expect(footer).not.toBeNull();
    });
  });

  // ── getSidebarSlot() ──────────────────────────────────────────────────────

  describe('getSidebarSlot()', () => {
    it('mengembalikan element HTMLElement yang valid', () => {
      const { layout } = mountLayout();

      const sidebarSlot = layout.getSidebarSlot();

      expect(sidebarSlot).toBeInstanceOf(HTMLElement);
    });

    it('slot sidebar dapat menerima konten', () => {
      const { layout } = mountLayout();

      const slot = layout.getSidebarSlot();
      slot.innerHTML = '<nav id="sidebar-nav">Nav</nav>';

      expect(layout.getSidebarSlot().querySelector('#sidebar-nav')).not.toBeNull();
    });

    it('throw Error jika dipanggil sebelum mount()', () => {
      const container = document.createElement('div');
      const layout = new AppLayout(container);

      expect(() => layout.getSidebarSlot()).toThrow(
        'AppLayout.getSidebarSlot() dipanggil sebelum mount()'
      );
    });
  });

  // ── getMainSlot() ─────────────────────────────────────────────────────────

  describe('getMainSlot()', () => {
    it('mengembalikan element HTMLElement yang valid', () => {
      const { layout } = mountLayout();

      const mainSlot = layout.getMainSlot();

      expect(mainSlot).toBeInstanceOf(HTMLElement);
    });

    it('slot main dapat menerima konten halaman', () => {
      const { layout } = mountLayout();

      const slot = layout.getMainSlot();
      slot.innerHTML = '<div class="page-container">Konten</div>';

      expect(layout.getMainSlot().querySelector('.page-container')).not.toBeNull();
    });

    it('throw Error jika dipanggil sebelum mount()', () => {
      const container = document.createElement('div');
      const layout = new AppLayout(container);

      expect(() => layout.getMainSlot()).toThrow(
        'AppLayout.getMainSlot() dipanggil sebelum mount()'
      );
    });
  });

  // ── Footer content ────────────────────────────────────────────────────────

  describe('Footer', () => {
    it('footer mengandung brand "Konstitusi RI"', () => {
      const { container } = mountLayout();

      const footer = container.querySelector('.app-footer');

      expect(footer?.textContent).toContain('Konstitusi RI');
    });

    it('footer mengandung tahun copyright', () => {
      const { container } = mountLayout();

      const footer = container.querySelector('.app-footer');
      const currentYear = new Date().getFullYear().toString();

      expect(footer?.textContent).toContain(currentYear);
    });

    it('footer mengandung tautan "Tentang"', () => {
      const { container } = mountLayout();

      const tentangLink = container.querySelector('footer a[href*="tentang"]');

      expect(tentangLink).not.toBeNull();
    });

    it('footer mengandung tautan "Pencarian"', () => {
      const { container } = mountLayout();

      const cariLink = container.querySelector('footer a[href*="cari"]');

      expect(cariLink).not.toBeNull();
    });
  });
});
