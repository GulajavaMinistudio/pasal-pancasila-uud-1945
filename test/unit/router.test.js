/**
 * @file test/unit/router.test.js
 * @description Unit tests untuk src/router/router.js
 *
 * Cakupan (TASK-049):
 *   - Route matching: static route, dynamic route, trailing slash
 *   - Parameter parsing: /sila/:nomor, /pasal/:nomor (termasuk alfanumerik)
 *   - navigate() — pushState dan onNavigate callback
 *   - replace() — replaceState dan route handler
 *   - setNotFoundHandler — dipanggil ketika route tidak cocok
 *   - onNavigate — callback dipanggil pada setiap navigasi
 *   - getCurrentPath — mengembalikan internal path dari window.location
 *   - popstate event — dispatch route saat tombol back/forward browser
 *   - Link interception — klik <a href> internal tidak reload halaman
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Router } from '../../src/router/router.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Buat Router baru dengan window.scrollTo di-mock agar tidak error di jsdom.
 * @returns {Router}
 */
function createRouter() {
  return new Router();
}

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe('Router', () => {
  let router;

  beforeEach(() => {
    router = createRouter();
    // jsdom tidak mengimplementasikan scrollTo — stub agar tidak error
    vi.stubGlobal('scrollTo', vi.fn());
    // Reset lokasi ke root sebelum tiap test
    window.history.replaceState(null, '', '/');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  // ── Route matching ────────────────────────────────────────────────────────

  describe('addRoute — static route matching', () => {
    it('cocok dengan route "/" dan memanggil handler', () => {
      const handler = vi.fn();
      router.addRoute('/', handler);

      router.navigate('/');

      expect(handler).toHaveBeenCalledOnce();
    });

    it('cocok dengan route "/pancasila"', () => {
      const handler = vi.fn();
      router.addRoute('/pancasila', handler);

      router.navigate('/pancasila');

      expect(handler).toHaveBeenCalledOnce();
    });

    it('cocok dengan route "/butir-pancasila"', () => {
      const handler = vi.fn();
      router.addRoute('/butir-pancasila', handler);

      router.navigate('/butir-pancasila');

      expect(handler).toHaveBeenCalledOnce();
    });

    it('cocok dengan route yang memiliki trailing slash', () => {
      const handler = vi.fn();
      router.addRoute('/pancasila', handler);

      router.navigate('/pancasila/');

      expect(handler).toHaveBeenCalledOnce();
    });

    it('menggunakan first-match — hanya handler pertama yang dipanggil', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      router.addRoute('/pancasila', handler1);
      router.addRoute('/pancasila', handler2);

      router.navigate('/pancasila');

      expect(handler1).toHaveBeenCalledOnce();
      expect(handler2).not.toHaveBeenCalled();
    });

    it('tidak memanggil handler route lain yang tidak cocok', () => {
      const handlerPancasila = vi.fn();
      const handlerPembukaan = vi.fn();
      router.addRoute('/pancasila', handlerPancasila);
      router.addRoute('/pembukaan', handlerPembukaan);

      router.navigate('/pancasila');

      expect(handlerPancasila).toHaveBeenCalledOnce();
      expect(handlerPembukaan).not.toHaveBeenCalled();
    });
  });

  // ── Parameter parsing ─────────────────────────────────────────────────────

  describe('addRoute — dynamic route & parameter parsing', () => {
    it('mengekstrak parameter nomor dari "/sila/:nomor"', () => {
      const handler = vi.fn();
      router.addRoute('/sila/:nomor', handler);

      router.navigate('/sila/1');

      expect(handler).toHaveBeenCalledWith({ nomor: '1' });
    });

    it('mengekstrak nomor sila 3 dengan benar', () => {
      const handler = vi.fn();
      router.addRoute('/sila/:nomor', handler);

      router.navigate('/sila/3');

      expect(handler).toHaveBeenCalledWith({ nomor: '3' });
    });

    it('mengekstrak nomor alfanumerik dari "/pasal/:nomor"', () => {
      const handler = vi.fn();
      router.addRoute('/pasal/:nomor', handler);

      router.navigate('/pasal/6A');

      expect(handler).toHaveBeenCalledWith({ nomor: '6A' });
    });

    it('mengekstrak parameter dari "/bab-pasal/:nomor"', () => {
      const handler = vi.fn();
      router.addRoute('/bab-pasal/:nomor', handler);

      router.navigate('/bab-pasal/5');

      expect(handler).toHaveBeenCalledWith({ nomor: '5' });
    });

    it('mengekstrak parameter dari "/amandemen/:nomor"', () => {
      const handler = vi.fn();
      router.addRoute('/amandemen/:nomor', handler);

      router.navigate('/amandemen/7B');

      expect(handler).toHaveBeenCalledWith({ nomor: '7B' });
    });

    it('mendekode URL-encoded karakter dalam parameter', () => {
      const handler = vi.fn();
      router.addRoute('/pasal/:nomor', handler);

      // Simulasi URL dengan encoded karakter (e.g., spasi = %20)
      router.navigate('/pasal/7%20A');

      expect(handler).toHaveBeenCalledWith({ nomor: '7 A' });
    });

    it('tidak cocok dengan route statis yang serupa', () => {
      const staticHandler = vi.fn();
      const dynamicHandler = vi.fn();
      router.addRoute('/sila/spesial', staticHandler);
      router.addRoute('/sila/:nomor', dynamicHandler);

      router.navigate('/sila/spesial');

      expect(staticHandler).toHaveBeenCalledOnce();
      expect(dynamicHandler).not.toHaveBeenCalled();
    });
  });

  // ── setNotFoundHandler ────────────────────────────────────────────────────

  describe('setNotFoundHandler', () => {
    it('dipanggil ketika tidak ada route yang cocok', () => {
      const notFoundHandler = vi.fn();
      router.setNotFoundHandler(notFoundHandler);

      router.navigate('/halaman-tidak-ada');

      expect(notFoundHandler).toHaveBeenCalledOnce();
    });

    it('dipanggil untuk path yang sangat berbeda', () => {
      const notFoundHandler = vi.fn();
      router.setNotFoundHandler(notFoundHandler);

      router.navigate('/xyz/abc/def');

      expect(notFoundHandler).toHaveBeenCalledOnce();
    });

    it('tidak dipanggil ketika route yang cocok ditemukan', () => {
      const handler = vi.fn();
      const notFoundHandler = vi.fn();
      router.addRoute('/pancasila', handler);
      router.setNotFoundHandler(notFoundHandler);

      router.navigate('/pancasila');

      expect(notFoundHandler).not.toHaveBeenCalled();
    });

    it('tidak error ketika tidak ada notFoundHandler dan route tidak ditemukan', () => {
      // Tidak ada notFoundHandler yang di-set, tidak boleh throw
      expect(() => router.navigate('/tidak-ada')).not.toThrow();
    });
  });

  // ── navigate ──────────────────────────────────────────────────────────────

  describe('navigate()', () => {
    it('memanggil history.pushState dengan path yang benar', () => {
      const pushStateSpy = vi.spyOn(window.history, 'pushState');

      router.navigate('/pancasila');

      expect(pushStateSpy).toHaveBeenCalledWith(null, '', '/pancasila');
    });

    it('memperbarui window.location.pathname ke path baru', () => {
      router.navigate('/pembukaan');

      expect(window.location.pathname).toBe('/pembukaan');
    });

    it('memicu semua onNavigate callbacks dengan path baru', () => {
      const cb1 = vi.fn();
      const cb2 = vi.fn();
      router.onNavigate(cb1);
      router.onNavigate(cb2);

      router.navigate('/pancasila');

      expect(cb1).toHaveBeenCalledWith('/pancasila');
      expect(cb2).toHaveBeenCalledWith('/pancasila');
    });

    it('memicu onNavigate sebelum route handler (urutan callbacks)', () => {
      const callOrder = [];
      router.onNavigate(() => callOrder.push('onNavigate'));
      router.addRoute('/pancasila', () => callOrder.push('handler'));

      router.navigate('/pancasila');

      expect(callOrder).toEqual(['onNavigate', 'handler']);
    });

    it('bisa navigate ke path berbeda secara berurutan', () => {
      const callback = vi.fn();
      router.onNavigate(callback);

      router.navigate('/pancasila');
      router.navigate('/pembukaan');

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenNthCalledWith(1, '/pancasila');
      expect(callback).toHaveBeenNthCalledWith(2, '/pembukaan');
    });
  });

  // ── replace ───────────────────────────────────────────────────────────────

  describe('replace()', () => {
    it('memanggil history.replaceState dengan path yang benar', () => {
      const replaceStateSpy = vi.spyOn(window.history, 'replaceState');

      router.replace('/pancasila');

      expect(replaceStateSpy).toHaveBeenCalledWith(null, '', '/pancasila');
    });

    it('memicu route handler yang sesuai', () => {
      const handler = vi.fn();
      router.addRoute('/pancasila', handler);

      router.replace('/pancasila');

      expect(handler).toHaveBeenCalledOnce();
    });

    it('memicu onNavigate callback', () => {
      const cb = vi.fn();
      router.onNavigate(cb);

      router.replace('/pembukaan');

      expect(cb).toHaveBeenCalledWith('/pembukaan');
    });
  });

  // ── getCurrentPath ────────────────────────────────────────────────────────

  describe('getCurrentPath()', () => {
    it('mengembalikan "/" untuk root URL', () => {
      window.history.replaceState(null, '', '/');

      expect(router.getCurrentPath()).toBe('/');
    });

    it('mengembalikan path tanpa base prefix saat di dev (BASE_URL = "/")', () => {
      window.history.replaceState(null, '', '/pancasila');

      expect(router.getCurrentPath()).toBe('/pancasila');
    });

    it('mengembalikan path dengan parameter dinamis', () => {
      window.history.replaceState(null, '', '/sila/3');

      expect(router.getCurrentPath()).toBe('/sila/3');
    });
  });

  // ── onNavigate ────────────────────────────────────────────────────────────

  describe('onNavigate()', () => {
    it('callback dipanggil pada setiap navigate', () => {
      const callback = vi.fn();
      router.onNavigate(callback);

      router.navigate('/pancasila');
      router.navigate('/pembukaan');

      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('beberapa callbacks dapat didaftarkan dan semua dipanggil', () => {
      const cb1 = vi.fn();
      const cb2 = vi.fn();
      const cb3 = vi.fn();
      router.onNavigate(cb1);
      router.onNavigate(cb2);
      router.onNavigate(cb3);

      router.navigate('/pancasila');

      expect(cb1).toHaveBeenCalledOnce();
      expect(cb2).toHaveBeenCalledOnce();
      expect(cb3).toHaveBeenCalledOnce();
    });
  });

  // ── init — popstate ───────────────────────────────────────────────────────

  describe('init() — popstate event', () => {
    it('mendispatch route yang sesuai saat popstate event diterima', () => {
      const handler = vi.fn();
      router.addRoute('/pancasila', handler);
      router.init();

      // Simulasi: user navigasi ke /pancasila via pushState, lalu tekan tombol back
      window.history.pushState(null, '', '/pancasila');
      window.dispatchEvent(new PopStateEvent('popstate'));

      // Handler dipanggil minimal satu kali (bisa lebih karena init dispatch awal)
      expect(handler).toHaveBeenCalled();
    });

    it('mendispatch route awal (path saat init dipanggil)', () => {
      window.history.replaceState(null, '', '/pembukaan');
      const handler = vi.fn();
      router.addRoute('/pembukaan', handler);

      router.init();

      expect(handler).toHaveBeenCalledOnce();
    });
  });

  // ── init — link interception ──────────────────────────────────────────────

  describe('init() — link interception', () => {
    afterEach(() => {
      // Bersihkan elemen yang ditambahkan ke document.body
      document.body.innerHTML = '';
    });

    it('mencegat klik pada link internal dan memanggil navigate', () => {
      const handler = vi.fn();
      router.addRoute('/pancasila', handler);
      router.addRoute('/', vi.fn()); // untuk absorb init dispatch
      router.init();

      const link = document.createElement('a');
      link.href = '/pancasila';
      document.body.appendChild(link);
      link.click();

      expect(handler).toHaveBeenCalled();
    });

    it('tidak memanggil navigate untuk link eksternal (http://)', () => {
      const pushStateSpy = vi.spyOn(window.history, 'pushState');
      router.addRoute('/', vi.fn());
      router.init();
      const callsBeforeClick = pushStateSpy.mock.calls.length;

      const link = document.createElement('a');
      link.href = 'https://example.com/test';
      document.body.appendChild(link);
      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      link.dispatchEvent(clickEvent);

      // pushState tidak dipanggil tambahan untuk link eksternal
      expect(pushStateSpy.mock.calls.length).toBe(callsBeforeClick);
    });

    it('tidak mencegat Ctrl+Click (buka tab baru)', () => {
      const handler = vi.fn();
      router.addRoute('/pancasila', handler);
      router.addRoute('/', vi.fn());
      router.init();

      const link = document.createElement('a');
      link.href = '/pancasila';
      document.body.appendChild(link);
      const ctrlClick = new MouseEvent('click', { bubbles: true, ctrlKey: true });
      link.dispatchEvent(ctrlClick);

      // Handler dipanggil dari init() dispatch (untuk '/'), bukan dari Ctrl+Click '/pancasila'
      expect(handler).not.toHaveBeenCalled();
    });

    it('tidak mencegat link fragment (#)', () => {
      const pushStateSpy = vi.spyOn(window.history, 'pushState');
      router.addRoute('/', vi.fn());
      router.init();
      const callsBeforeClick = pushStateSpy.mock.calls.length;

      const link = document.createElement('a');
      link.href = '#bagian-1';
      document.body.appendChild(link);
      link.click();

      expect(pushStateSpy.mock.calls.length).toBe(callsBeforeClick);
    });
  });
});
