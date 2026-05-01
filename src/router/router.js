/**
 * @file src/router/router.js
 * @description Client-side router berbasis history.pushState untuk SPA.
 *
 * Fitur:
 *   - Route registration dengan pattern matching (termasuk parameter dinamis)
 *   - Navigasi programmatic: navigate(), replace(), back()
 *   - popstate event listener (browser back/forward button) — TASK-036
 *   - Route parameter parsing: /sila/:nomor, /pasal/:nomor — TASK-037
 *   - Link interception global — klik <a> intra-app tidak reload halaman — TASK-039
 *   - onNavigate callback untuk sinkronisasi active state komponen (AppHeader, BottomNav)
 *   - Base path awareness — kompatibel dengan GitHub Pages sub-path
 *
 * BASE PATH (GitHub Pages):
 *   vite.config.js: base = '/pasal-pancasila-uud-1945/'
 *   window.location.pathname: '/pasal-pancasila-uud-1945/pancasila'
 *   Internal path (dipakai komponen & handler): '/pancasila'
 *   Router menstripkan base prefix otomatis di getCurrentPath() dan _normalizePath().
 *
 * Referensi: planning TASK-035, 036, 037, 039
 *            spec-architecture §4.2 — 14 routes
 *            AGENTS.md CS-1 (Dependency Rule) — Router hanya import src/types/
 */

/** Regex untuk mendeteksi segmen parameter route (`:nomor`, `:slug`, dll.) */
const PARAM_SEGMENT_RE = /^:([a-zA-Z_][a-zA-Z0-9_]*)$/;

export class Router {
  constructor() {
    /**
     * Daftar route yang terdaftar.
     * @type {Array<{ pattern: string; regex: RegExp; paramNames: string[]; handler: Function }>}
     */
    this._routes = [];

    /**
     * Handler untuk route yang tidak cocok (404).
     * @type {Function | null}
     */
    this._notFoundHandler = null;

    /**
     * Callbacks yang dipanggil setiap kali navigasi terjadi.
     * Digunakan AppHeader & BottomNavigation untuk sync active state.
     * @type {Array<(path: string) => void>}
     */
    this._onNavigateCallbacks = [];

    /**
     * Base path dari Vite, tanpa trailing slash.
     * Dev:  import.meta.env.BASE_URL = '/'                        → _basePath = ''
     * Prod: import.meta.env.BASE_URL = '/pasal-pancasila-uud-1945/' → _basePath = '/pasal-pancasila-uud-1945'
     */
    this._basePath = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  /**
   * Kembalikan internal path saat ini (tanpa base prefix).
   * Contoh (prod): '/pasal-pancasila-uud-1945/pancasila' → '/pancasila'
   * Contoh (dev):  '/pancasila'                          → '/pancasila'
   * @returns {string}
   */
  getCurrentPath() {
    return this._normalizePath(window.location.pathname);
  }

  /**
   * Daftarkan sebuah route beserta handler-nya.
   * Pattern mendukung parameter dinamis: '/sila/:nomor', '/pasal/:nomor'.
   * Route dievaluasi berurutan (first-match); daftarkan yang lebih spesifik lebih dulu.
   *
   * @param {string} pattern - Internal route pattern (e.g. '/pancasila', '/sila/:nomor')
   * @param {(params: Record<string, string>) => void} handler
   */
  addRoute(pattern, handler) {
    const { regex, paramNames } = this._buildRegex(pattern);
    this._routes.push({ pattern, regex, paramNames, handler });
  }

  /**
   * Daftarkan handler untuk route tidak ditemukan (404 fallback).
   * @param {() => void} handler
   */
  setNotFoundHandler(handler) {
    this._notFoundHandler = handler;
  }

  /**
   * Navigasi ke internal path — menambahkan entry baru ke browser history.
   * @param {string} path - Internal path (e.g. '/pancasila', '/pasal/7A')
   */
  navigate(path) {
    const fullUrl = this._toFullUrl(path);
    window.history.pushState(null, '', fullUrl);
    this._dispatch(path);
  }

  /**
   * Navigasi ke internal path — mengganti history entry saat ini (tidak menambah entry baru).
   * Cocok untuk redirect: misal, URL invalid → beranda.
   * @param {string} path - Internal path
   */
  replace(path) {
    const fullUrl = this._toFullUrl(path);
    window.history.replaceState(null, '', fullUrl);
    this._dispatch(path);
  }

  /**
   * Navigasi mundur ke history entry sebelumnya (browser back).
   */
  back() {
    window.history.back();
  }

  /**
   * Daftarkan callback yang dipanggil setiap kali navigasi terjadi.
   * Callback menerima internal path (e.g. '/pancasila').
   * @param {(path: string) => void} callback
   */
  onNavigate(callback) {
    this._onNavigateCallbacks.push(callback);
  }

  /**
   * Mulai router:
   *   1. Bind popstate listener (browser back/forward)
   *   2. Bind link interception listener (klik <a> intra-app)
   *   3. Dispatch route awal (current URL)
   *
   * WAJIB dipanggil SETELAH semua addRoute() dan onNavigate() dipasang.
   */
  init() {
    // TASK-036: popstate — menangani tombol back/forward browser
    window.addEventListener('popstate', () => {
      this._dispatch(this.getCurrentPath());
    });

    // TASK-039: Link interception — klik <a> intra-app tidak full-reload
    document.addEventListener('click', (e) => {
      // Biarkan modifier key (cmd+click, ctrl+click = buka tab baru)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = e.target.closest('a[href]');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      const internalPath = this._hrefToInternalPath(href);
      if (internalPath === null) return; // External URL → biarkan browser handle

      e.preventDefault();
      this.navigate(internalPath);
    });

    // Dispatch route awal berdasarkan URL saat ini
    this._dispatch(this.getCurrentPath());
  }

  // ---------------------------------------------------------------------------
  // Private: path utilities
  // ---------------------------------------------------------------------------

  /**
   * Strip base path prefix dari pathname untuk mendapatkan internal path.
   * Selalu mengembalikan string yang dimulai dengan '/'.
   * @param {string} pathname - window.location.pathname
   * @returns {string} Internal path
   */
  _normalizePath(pathname) {
    const base = this._basePath;
    if (base && pathname.startsWith(base)) {
      const rest = pathname.slice(base.length);
      // rest bisa berupa: '' → '/', '/pancasila' → '/pancasila'
      if (!rest) return '/';
      return rest.startsWith('/') ? rest : '/' + rest;
    }
    return pathname || '/';
  }

  /**
   * Ubah internal path menjadi full URL yang valid untuk pushState.
   * '/pancasila' → '/pasal-pancasila-uud-1945/pancasila'  (prod)
   * '/pancasila' → '/pancasila'                           (dev)
   * @param {string} path - Internal path
   * @returns {string} Full URL
   */
  _toFullUrl(path) {
    if (!this._basePath) return path;
    // path dimulai '/', basePath tidak berakhir '/' → hasilnya bersih
    return this._basePath + path;
  }

  /**
   * Tentukan apakah href adalah link internal (dalam aplikasi ini).
   * External URL, mailto:, tel:, fragment (#), dsb. dikembalikan sebagai null.
   * @param {string | null} href
   * @returns {string | null} Internal path atau null jika bukan internal
   */
  _hrefToInternalPath(href) {
    if (!href) return null;
    if (href.startsWith('//')) return null; // protocol-relative
    if (/^[a-z][a-z0-9+\-.]*:/.test(href)) return null; // http:, mailto:, tel:, dsb.
    if (href.startsWith('#')) return null; // fragment-only → biarkan browser

    if (!href.startsWith('/')) return null; // relatif — biarkan browser

    // href sudah mengandung base path → normalize
    if (this._basePath && href.startsWith(this._basePath)) {
      return this._normalizePath(href);
    }

    // href adalah internal path tanpa base (e.g. '/pancasila')
    return href;
  }

  // ---------------------------------------------------------------------------
  // Private: route matching (TASK-037)
  // ---------------------------------------------------------------------------

  /**
   * Bangun regex dari pattern route.
   * '/sila/:nomor' → RegExp yang menangkap satu grup (nilai nomor)
   *
   * Contoh:
   *   '/'             → /^\/\/?$/
   *   '/pancasila'    → /^\/pancasila\/?$/
   *   '/sila/:nomor'  → /^\/sila\/([^/]+)\/?$/  — param: ['nomor']
   *   '/pasal/:nomor' → /^\/pasal\/([^/]+)\/?$/  — param: ['nomor']
   *
   * @param {string} pattern - Route pattern
   * @returns {{ regex: RegExp; paramNames: string[] }}
   */
  _buildRegex(pattern) {
    const paramNames = [];

    const regexStr = pattern
      .split('/')
      .map((segment) => {
        if (!segment) return ''; // segmen kosong (sebelum '/' pertama atau setelah terakhir)

        const paramMatch = segment.match(PARAM_SEGMENT_RE);
        if (paramMatch) {
          paramNames.push(paramMatch[1]);
          return '([^/]+)'; // capture group: cocok dengan satu segmen non-slash
        }

        // Escape karakter spesial regex dalam segmen statis
        return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      })
      .join('/');

    // Tambahkan optional trailing slash agar '/pancasila' dan '/pancasila/' keduanya cocok
    return { regex: new RegExp('^' + regexStr + '\\/?$'), paramNames };
  }

  /**
   * Cari route pertama yang cocok dengan internal path.
   * @param {string} path - Internal path
   * @returns {{ handler: Function; params: Record<string, string> } | null}
   */
  _matchRoute(path) {
    for (const route of this._routes) {
      const match = path.match(route.regex);
      if (match) {
        /** @type {Record<string, string>} */
        const params = {};
        route.paramNames.forEach((name, i) => {
          params[name] = decodeURIComponent(match[i + 1]);
        });
        return { handler: route.handler, params };
      }
    }
    return null;
  }

  // ---------------------------------------------------------------------------
  // Private: dispatch
  // ---------------------------------------------------------------------------

  /**
   * Dispatch navigasi ke path:
   *   1. Scroll ke atas (UX: setiap halaman baru dimulai dari atas)
   *   2. Panggil semua onNavigate callbacks (sinkronisasi active state)
   *   3. Cari dan jalankan route handler, atau notFoundHandler jika tidak ada
   * @param {string} path - Internal path
   */
  _dispatch(path) {
    // Scroll ke atas untuk setiap navigasi halaman baru
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Notify semua listener (AppHeader, BottomNavigation) tentang navigasi
    this._onNavigateCallbacks.forEach((cb) => cb(path));

    const match = this._matchRoute(path);
    if (match) {
      match.handler(match.params);
    } else if (this._notFoundHandler) {
      this._notFoundHandler();
    }
  }
}
