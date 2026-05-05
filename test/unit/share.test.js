/**
 * @file test/unit/share.test.js
 * @description Unit tests untuk src/utils/share.js
 *
 * Cakupan (TASK-012 — Phase 3.2 — Fitur Berbagi Konten):
 *   - shareContent() menggunakan Web Share API jika tersedia
 *   - shareContent() mengembalikan 'aborted' jika user membatalkan share
 *   - shareContent() fallback ke Clipboard API jika Web Share tidak tersedia
 *   - shareContent() fallback ke window.prompt jika Clipboard API tidak tersedia
 *   - shareContent() mengembalikan result string yang benar untuk setiap skenario
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { shareContent } from '../../src/utils/share.js';

const SHARE_DATA = {
  title: 'Pasal 1 UUD 1945',
  text: 'Pasal 1\nAyat 1: Negara Indonesia adalah Negara Kesatuan...',
  url: 'https://pasaluud1945.web.app/pasal/1',
};

describe('utils/share — shareContent()', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('skenario: Web Share API tersedia', () => {
    beforeEach(() => {
      navigator.share = vi.fn().mockResolvedValue(undefined);
    });

    afterEach(() => {
      delete navigator.share;
    });

    it('memanggil navigator.share() dengan data yang benar', async () => {
      await shareContent(SHARE_DATA);

      expect(navigator.share).toHaveBeenCalledOnce();
      expect(navigator.share).toHaveBeenCalledWith({
        title: SHARE_DATA.title,
        text: SHARE_DATA.text,
        url: SHARE_DATA.url,
      });
    });

    it('mengembalikan "shared" setelah Web Share API berhasil', async () => {
      const result = await shareContent(SHARE_DATA);
      expect(result).toBe('shared');
    });

    it('mengembalikan "aborted" jika user membatalkan dialog share', async () => {
      const abortError = new Error('Share aborted');
      abortError.name = 'AbortError';
      navigator.share = vi.fn().mockRejectedValue(abortError);

      const result = await shareContent(SHARE_DATA);
      expect(result).toBe('aborted');
    });

    it('fallback ke Clipboard API jika navigator.share() melempar error bukan AbortError', async () => {
      const notAllowedError = new Error('Permission denied');
      notAllowedError.name = 'NotAllowedError';
      navigator.share = vi.fn().mockRejectedValue(notAllowedError);

      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: vi.fn().mockResolvedValue(undefined) },
        configurable: true,
      });

      const result = await shareContent(SHARE_DATA);
      expect(result).toBe('copied');

      delete navigator.clipboard;
    });
  });

  describe('skenario: Clipboard API tersedia (tanpa Web Share)', () => {
    beforeEach(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: vi.fn().mockResolvedValue(undefined) },
        configurable: true,
        writable: true,
      });
    });

    afterEach(() => {
      delete navigator.clipboard;
    });

    it('mengembalikan "copied" setelah Clipboard API berhasil', async () => {
      const result = await shareContent(SHARE_DATA);
      expect(result).toBe('copied');
    });

    it('menyalin gabungan text dan url ke clipboard', async () => {
      await shareContent(SHARE_DATA);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        `${SHARE_DATA.text}\n\n${SHARE_DATA.url}`
      );
    });

    it('fallback ke window.prompt jika Clipboard API gagal', async () => {
      navigator.clipboard.writeText = vi.fn().mockRejectedValue(new Error('NotAllowed'));
      window.prompt = vi.fn();

      const result = await shareContent(SHARE_DATA);
      expect(result).toBe('prompted');
      expect(window.prompt).toHaveBeenCalledWith('Salin tautan berikut:', SHARE_DATA.url);
    });
  });

  describe('skenario: window.prompt sebagai last resort', () => {
    it('memanggil window.prompt dan mengembalikan "prompted"', async () => {
      window.prompt = vi.fn();

      const result = await shareContent(SHARE_DATA);
      expect(result).toBe('prompted');
      expect(window.prompt).toHaveBeenCalledWith('Salin tautan berikut:', SHARE_DATA.url);
    });
  });
});
