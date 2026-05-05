/**
 * @file test/component/OfflineIndicator.test.js
 * @description Component tests untuk src/components/OfflineIndicator.js
 *
 * Cakupan (TASK-010 — Phase 3.1 — PWA):
 *   - mount() me-render banner dengan [data-offline-banner] di DOM
 *   - Banner dimulai dalam keadaan hidden
 *   - window event 'offline' → banner tampil (hidden dihapus)
 *   - window event 'online' → banner disembunyikan
 *   - mount() menampilkan banner jika navigator.onLine === false saat mount
 *   - unmount() melepas event listeners dan mereset referensi _bannerEl
 *   - _showBanner() dan _hideBanner() bisa dipanggil berulang tanpa error
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OfflineIndicator } from '../../src/components/OfflineIndicator.js';

describe('components/OfflineIndicator', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
    vi.restoreAllMocks();
  });

  // ── mount() ────────────────────────────────────────────────────────────────

  describe('mount()', () => {
    it('me-render elemen [data-offline-banner] ke dalam container', () => {
      const indicator = new OfflineIndicator(container);
      indicator.mount();

      const banner = container.querySelector('[data-offline-banner]');
      expect(banner).not.toBeNull();
    });

    it('banner dimulai dalam keadaan hidden', () => {
      const indicator = new OfflineIndicator(container);
      indicator.mount();

      const banner = container.querySelector('[data-offline-banner]');
      expect(banner.hasAttribute('hidden')).toBe(true);
    });

    it('banner memiliki role="status" dan aria-live="polite" untuk aksesibilitas', () => {
      const indicator = new OfflineIndicator(container);
      indicator.mount();

      const banner = container.querySelector('[data-offline-banner]');
      expect(banner.getAttribute('role')).toBe('status');
      expect(banner.getAttribute('aria-live')).toBe('polite');
    });

    it('menampilkan banner segera jika navigator.onLine = false saat mount', () => {
      vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
      const showBannerSpy = vi.spyOn(OfflineIndicator.prototype, '_showBanner');

      const indicator = new OfflineIndicator(container);
      indicator.mount();

      expect(showBannerSpy).toHaveBeenCalledOnce();
    });

    it('tidak menampilkan banner jika navigator.onLine = true saat mount', () => {
      vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
      const showBannerSpy = vi.spyOn(OfflineIndicator.prototype, '_showBanner');

      const indicator = new OfflineIndicator(container);
      indicator.mount();

      expect(showBannerSpy).not.toHaveBeenCalled();
    });
  });

  // ── window events ─────────────────────────────────────────────────────────

  describe('window events', () => {
    it('window event "offline" memicu _showBanner()', () => {
      const indicator = new OfflineIndicator(container);
      indicator.mount();

      const showBannerSpy = vi.spyOn(indicator, '_showBanner');
      window.dispatchEvent(new Event('offline'));

      expect(showBannerSpy).toHaveBeenCalledOnce();
    });

    it('window event "online" memicu _hideBanner()', () => {
      const indicator = new OfflineIndicator(container);
      indicator.mount();

      const hideBannerSpy = vi.spyOn(indicator, '_hideBanner');
      window.dispatchEvent(new Event('online'));

      expect(hideBannerSpy).toHaveBeenCalledOnce();
    });
  });

  // ── _showBanner() ──────────────────────────────────────────────────────────

  describe('_showBanner()', () => {
    it('menghapus atribut hidden dari banner', () => {
      const indicator = new OfflineIndicator(container);
      indicator.mount();

      const banner = container.querySelector('[data-offline-banner]');
      expect(banner.hasAttribute('hidden')).toBe(true);

      indicator._showBanner();
      expect(banner.hasAttribute('hidden')).toBe(false);
    });

    it('tidak throw jika dipanggil sebelum mount()', () => {
      const indicator = new OfflineIndicator(container);
      expect(() => indicator._showBanner()).not.toThrow();
    });
  });

  // ── _hideBanner() ─────────────────────────────────────────────────────────

  describe('_hideBanner()', () => {
    it('menghapus class offline-indicator--visible dari banner', () => {
      const indicator = new OfflineIndicator(container);
      indicator.mount();

      const banner = container.querySelector('[data-offline-banner]');
      banner.classList.add('offline-indicator--visible');

      indicator._hideBanner();
      expect(banner.classList.contains('offline-indicator--visible')).toBe(false);
    });

    it('tidak throw jika dipanggil sebelum mount()', () => {
      const indicator = new OfflineIndicator(container);
      expect(() => indicator._hideBanner()).not.toThrow();
    });
  });

  // ── unmount() ─────────────────────────────────────────────────────────────

  describe('unmount()', () => {
    it('melepas window event listener "offline" saat unmount', () => {
      const indicator = new OfflineIndicator(container);
      indicator.mount();
      indicator.unmount();

      const showBannerSpy = vi.spyOn(indicator, '_showBanner');
      window.dispatchEvent(new Event('offline'));

      expect(showBannerSpy).not.toHaveBeenCalled();
    });

    it('melepas window event listener "online" saat unmount', () => {
      const indicator = new OfflineIndicator(container);
      indicator.mount();
      indicator.unmount();

      const hideBannerSpy = vi.spyOn(indicator, '_hideBanner');
      window.dispatchEvent(new Event('online'));

      expect(hideBannerSpy).not.toHaveBeenCalled();
    });

    it('mereset _bannerEl menjadi null setelah unmount', () => {
      const indicator = new OfflineIndicator(container);
      indicator.mount();

      expect(indicator._bannerEl).not.toBeNull();

      indicator.unmount();
      expect(indicator._bannerEl).toBeNull();
    });

    it('tidak throw jika dipanggil berulang kali', () => {
      const indicator = new OfflineIndicator(container);
      indicator.mount();

      expect(() => {
        indicator.unmount();
        indicator.unmount();
      }).not.toThrow();
    });
  });
});
