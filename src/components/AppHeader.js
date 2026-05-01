/**
 * @file src/components/AppHeader.js
 * @description AppHeader — sticky navbar merah yang konsisten di seluruh halaman.
 *
 * Desktop: brand (kiri) + nav links (tengah/kanan) + action icons (kanan)
 * Mobile:  icon (kiri) + judul "UUD 1945" (tengah) + search icon (kanan)
 *
 * Referensi visual:
 *   - docs/mockup_desktop_web/beranda_pancasila_uud_1945/code.html
 *   - docs/mockup_mobile_web/beranda_mobile/code.html
 *
 * Aturan Clean Architecture (CS-1, CS-2):
 *   - Komponen ini murni presentational — tidak ada fetch(), tidak ada logika bisnis
 *   - Dependensi router diinjeksi via constructor
 */

/**
 * Definisi item navigasi utama (desktop nav + desktop breadcrumb).
 * @type {Array<{ path: string; label: string }>}
 */
const NAV_ITEMS = [
  { path: '/', label: 'Beranda' },
  { path: '/pancasila', label: 'Pancasila' },
  { path: '/pasal', label: 'UUD 1945' },
  { path: '/amandemen', label: 'Amandemen' },
];

export class AppHeader {
  /**
   * @param {HTMLElement} containerEl - Element tempat header di-render
   * @param {{ router: { navigate: (path: string) => void } }} deps
   */
  constructor(containerEl, { router }) {
    this.container = containerEl;
    this.router = router;
    // Inisialisasi dengan '/' sebagai default aman.
    // Router akan memanggil setActivePath(path) segera setelah init()
    // dengan internal path yang sudah di-normalisasi (tanpa base prefix).
    this._currentPath = '/';
  }

  /**
   * Render header ke DOM dan bind events.
   */
  mount() {
    this.container.innerHTML = this._buildHeaderHtml();
    this._bindEvents();
  }

  /**
   * Update active nav item saat router berpindah route.
   * Dipanggil oleh Router setelah setiap navigasi.
   * @param {string} path - Path baru yang aktif
   */
  setActivePath(path) {
    this._currentPath = path;
    const links = this.container.querySelectorAll('[data-nav-path]');
    links.forEach((link) => {
      const linkPath = link.getAttribute('data-nav-path');
      link.classList.toggle('active', this._isPathActive(linkPath));
      link.setAttribute('aria-current', this._isPathActive(linkPath) ? 'page' : 'false');
    });
  }

  // ---------------------------------------------------------------------------
  // Private: HTML builders
  // ---------------------------------------------------------------------------

  _buildHeaderHtml() {
    return `
      <nav class="app-header navbar navbar-dark sticky-top px-0"
           role="navigation"
           aria-label="Navigasi utama">
        <div class="container-fluid d-flex align-items-center h-100 px-3 gap-0">

          <!-- Brand: ikon + nama app -->
          <a class="navbar-brand d-flex align-items-center gap-2 me-0 me-md-3 text-decoration-none"
             href="/"
             data-nav-path="/"
             aria-label="Pancasila &amp; UUD 1945 — Halaman Utama">
            <i class="bi bi-building-columns app-header__icon" aria-hidden="true"></i>
            <!-- Desktop: "Konstitusi RI", Mobile: "UUD 1945" -->
            <span class="d-none d-md-inline">Konstitusi RI</span>
            <span class="d-inline d-md-none app-header__title-mobile">UUD 1945</span>
          </a>

          <!-- Desktop Nav Links (tersembunyi di mobile) -->
          <ul class="navbar-nav d-none d-md-flex flex-row align-items-stretch h-100 flex-grow-1 mb-0"
              role="list">
            ${NAV_ITEMS.map((item) => this._buildNavLinkHtml(item)).join('')}
          </ul>

          <!-- Spacer (mendorong action icons ke kanan pada mobile) -->
          <div class="flex-grow-1 d-md-none" aria-hidden="true"></div>

          <!-- Action Icons: search + about (about hanya desktop) -->
          <div class="d-flex align-items-center gap-1">
            <button class="app-header__action-btn"
                    aria-label="Cari konten"
                    data-action="search"
                    type="button">
              <i class="bi bi-search" aria-hidden="true"></i>
            </button>
            <button class="app-header__action-btn d-none d-md-flex"
                    aria-label="Tentang aplikasi"
                    data-action="about"
                    type="button">
              <i class="bi bi-info-circle" aria-hidden="true"></i>
            </button>
          </div>

        </div>
      </nav>
    `;
  }

  /**
   * @param {{ path: string; label: string }} item
   * @returns {string} HTML string satu nav link
   */
  _buildNavLinkHtml(item) {
    const isActive = this._isPathActive(item.path);
    return `
      <li class="nav-item h-100 d-flex align-items-stretch" role="listitem">
        <a class="app-header__nav-link${isActive ? ' active' : ''}"
           href="${item.path}"
           data-nav-path="${item.path}"
           aria-current="${isActive ? 'page' : 'false'}">
          ${item.label}
        </a>
      </li>
    `;
  }

  /**
   * Path "/" hanya aktif ketika currentPath persis "/".
   * Path lain aktif ketika currentPath starts with path tersebut.
   * @param {string} path
   * @returns {boolean}
   */
  _isPathActive(path) {
    if (path === '/') {
      return this._currentPath === '/';
    }
    return this._currentPath.startsWith(path);
  }

  // ---------------------------------------------------------------------------
  // Private: Event binding
  // ---------------------------------------------------------------------------

  _bindEvents() {
    this.container.addEventListener('click', (e) => {
      const navLink = e.target.closest('[data-nav-path]');
      if (navLink) {
        e.preventDefault();
        this.router.navigate(navLink.getAttribute('data-nav-path'));
        return;
      }

      const actionBtn = e.target.closest('[data-action]');
      if (actionBtn) {
        this._handleAction(actionBtn.getAttribute('data-action'));
      }
    });
  }

  /** @param {string} action */
  _handleAction(action) {
    if (action === 'search') {
      this.router.navigate('/cari');
    } else if (action === 'about') {
      this.router.navigate('/tentang');
    }
  }
}
