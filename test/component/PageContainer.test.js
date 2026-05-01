/**
 * @file test/component/PageContainer.test.js
 * @description Component tests untuk src/components/PageContainer.js
 *
 * Cakupan:
 *   - mount() merender wrapper .page-container
 *   - getContentElement() mengembalikan element konten yang dapat diisi
 *   - Guard: getContentElement throw sebelum mount()
 */

import { describe, expect, it } from 'vitest';
import { PageContainer } from '../../src/components/PageContainer.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mountPageContainer() {
  const container = document.createElement('div');
  const pageContainer = new PageContainer(container);
  pageContainer.mount();
  return { container, pageContainer };
}

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe('PageContainer', () => {
  // ── mount() ────────────────────────────────────────────────────────────

  describe('mount() — render wrapper konten', () => {
    it('merender element .page-container', () => {
      const { container } = mountPageContainer();

      const wrapperEl = container.querySelector('.page-container');

      expect(wrapperEl).not.toBeNull();
    });

    it('merender element dengan id="page-content"', () => {
      const { container } = mountPageContainer();

      const contentEl = container.querySelector('#page-content');

      expect(contentEl).not.toBeNull();
    });

    it('merender element dengan role="main"', () => {
      const { container } = mountPageContainer();

      const mainEl = container.querySelector('[role="main"]');

      expect(mainEl).not.toBeNull();
    });
  });

  // ── getContentElement() ─────────────────────────────────────────────────

  describe('getContentElement()', () => {
    it('mengembalikan HTMLElement yang valid', () => {
      const { pageContainer } = mountPageContainer();

      const contentEl = pageContainer.getContentElement();

      expect(contentEl).toBeInstanceOf(HTMLElement);
    });

    it('element konten memiliki id="page-content"', () => {
      const { pageContainer } = mountPageContainer();

      const contentEl = pageContainer.getContentElement();

      expect(contentEl.id).toBe('page-content');
    });

    it('element konten memiliki class "page-container"', () => {
      const { pageContainer } = mountPageContainer();

      const contentEl = pageContainer.getContentElement();

      expect(contentEl.classList.contains('page-container')).toBe(true);
    });

    it('content element dapat menerima konten halaman', () => {
      const { pageContainer } = mountPageContainer();

      const contentEl = pageContainer.getContentElement();
      contentEl.innerHTML = '<div class="home-page">Konten</div>';

      expect(pageContainer.getContentElement().querySelector('.home-page')).not.toBeNull();
    });

    it('mengembalikan element yang sama setiap kali dipanggil', () => {
      const { pageContainer } = mountPageContainer();

      const firstCall = pageContainer.getContentElement();
      const secondCall = pageContainer.getContentElement();

      expect(firstCall).toBe(secondCall);
    });

    it('throw Error jika dipanggil sebelum mount()', () => {
      const container = document.createElement('div');
      const pageContainer = new PageContainer(container);

      expect(() => pageContainer.getContentElement()).toThrow(
        'PageContainer.getContentElement() dipanggil sebelum mount()'
      );
    });
  });
});
