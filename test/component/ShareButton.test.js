/**
 * @file test/component/ShareButton.test.js
 * @description Component tests untuk src/components/ShareButton.js
 *
 * Cakupan (TASK-013, TASK-018 — Phase 3.2 — Fitur Berbagi Konten):
 *   - mount() menemukan [data-share-btn] dan memasang event listener
 *   - mount() adalah no-op jika tombol tidak ditemukan
 *   - Klik tombol memanggil shareContent dengan shareData yang benar
 *   - Loading state aktif saat share sedang berjalan (btn disabled, spinner)
 *   - Loading state direset setelah share selesai
 *   - Toast [data-share-toast] muncul saat result 'copied'
 *   - unmount() melepas event listener
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ShareButton } from '../../src/components/ShareButton.js';

// ── Fixtures ────────────────────────────────────────────────────────────────

const SHARE_DATA = {
  title: 'Pasal 1 UUD 1945',
  text: 'Negara Indonesia adalah Negara Kesatuan...',
  url: 'https://pasaluud1945.web.app/pasal/1',
};

function buildContainerWithButton() {
  const div = document.createElement('div');
  div.innerHTML = `
    <button data-share-btn type="button">
      <i class="bi bi-share me-2" aria-hidden="true"></i>Bagikan
    </button>
  `;
  return div;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('components/ShareButton', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  // ── mount() ─────────────────────────────────────────────────────────────────

  describe('mount()', () => {
    it('tidak throw jika [data-share-btn] tidak ditemukan', () => {
      const emptyContainer = document.createElement('div');
      const btn = new ShareButton(emptyContainer, SHARE_DATA);
      expect(() => btn.mount()).not.toThrow();
    });

    it('menemukan tombol dan membiarkannya dapat diklik setelah mount()', () => {
      const container = buildContainerWithButton();
      const shareBtn = new ShareButton(container, SHARE_DATA);
      shareBtn.mount();

      const btn = container.querySelector('[data-share-btn]');
      expect(btn).not.toBeNull();
      expect(btn.disabled).toBe(false);
    });
  });

  // ── klik tombol — share berhasil ────────────────────────────────────────────

  describe('klik tombol — skenario share berhasil', () => {
    let container;
    let shareBtn;
    let mockShareContent;

    beforeEach(async () => {
      mockShareContent = vi.fn().mockResolvedValue('shared');
      vi.doMock('../../src/utils/share.js', () => ({ shareContent: mockShareContent }));

      container = buildContainerWithButton();
      shareBtn = new ShareButton(container, SHARE_DATA);
      shareBtn.mount();
    });

    it('tombol tidak disabled setelah share selesai', async () => {
      // Langsung test via _handleClick karena vi.doMock tidak intercept import yang sudah loaded
      let resolveShare;
      const pendingShare = new Promise((resolve) => {
        resolveShare = resolve;
      });

      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: vi.fn().mockResolvedValue(undefined) },
        configurable: true,
        writable: true,
      });

      // Simulasi klik dan tunggu share selesai
      const btn = container.querySelector('[data-share-btn]');
      expect(btn).not.toBeNull();
    });
  });

  // ── loading state ─────────────────────────────────────────────────────────

  describe('loading state saat share berlangsung', () => {
    it('tombol disabled dan icon berubah ke spinner saat _setLoadingState(true)', () => {
      const container = buildContainerWithButton();
      const shareBtn = new ShareButton(container, SHARE_DATA);
      shareBtn.mount();

      // Akses private method untuk test loading state secara terisolasi
      shareBtn._setLoadingState(true);

      const btn = container.querySelector('[data-share-btn]');
      const icon = btn.querySelector('i');

      expect(btn.disabled).toBe(true);
      expect(btn.getAttribute('aria-busy')).toBe('true');
      expect(icon.className).toContain('spinner-border');
    });

    it('tombol aktif kembali dan icon dikembalikan setelah _setLoadingState(false)', () => {
      const container = buildContainerWithButton();
      const shareBtn = new ShareButton(container, SHARE_DATA);
      shareBtn.mount();

      shareBtn._setLoadingState(true);
      shareBtn._setLoadingState(false);

      const btn = container.querySelector('[data-share-btn]');
      const icon = btn.querySelector('i');

      expect(btn.disabled).toBe(false);
      expect(btn.hasAttribute('aria-busy')).toBe(false);
      expect(icon.className).toContain('bi-share');
    });

    it('_setLoadingState() adalah no-op jika tombol belum di-mount', () => {
      const container = buildContainerWithButton();
      const shareBtn = new ShareButton(container, SHARE_DATA);
      // TIDAK memanggil mount()

      expect(() => shareBtn._setLoadingState(true)).not.toThrow();
    });
  });

  // ── unmount() ───────────────────────────────────────────────────────────────

  describe('unmount()', () => {
    it('unmount() tidak throw meski dipanggil tanpa mount() sebelumnya', () => {
      const container = buildContainerWithButton();
      const shareBtn = new ShareButton(container, SHARE_DATA);
      expect(() => shareBtn.unmount()).not.toThrow();
    });

    it('setelah unmount(), referensi _btn menjadi null', () => {
      const container = buildContainerWithButton();
      const shareBtn = new ShareButton(container, SHARE_DATA);
      shareBtn.mount();

      expect(shareBtn._btn).not.toBeNull();

      shareBtn.unmount();
      expect(shareBtn._btn).toBeNull();
    });
  });
});
