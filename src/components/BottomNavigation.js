/**
 * @file src/components/BottomNavigation.js
 * @description BottomNavigation — bottom navigation bar untuk mobile only.
 *
 * Hanya tampil di viewport < md (768px). Di tablet dan desktop disembunyikan
 * via CSS `.bottom-nav { display: none !important }` saat breakpoint md+.
 *
 * 4 Tab:
 *   - Beranda   : bi-house-fill
 *   - Pasal     : bi-journal-text
 *   - Amandemen : bi-clock-history
 *   - Tentang   : bi-info-circle-fill
 *
 * State aktif: icon & label #C62828, background #FFEBEE
 * State tidak aktif: #989898
 *
 * Referensi visual:
 *   - docs/mockup_mobile_web/beranda_mobile/code.html
 *   - spec-design-uiux §4.3, planning TASK-031
 *
 * Aturan Clean Architecture (CS-1, CS-2):
 *   - Komponen murni presentational — tidak ada fetch()
 *   - Dependensi router diinjeksi via constructor
 */

/**
 * @typedef {{ path: string; label: string; icon: string }} NavTab
 */

/**
 * Definisi 4 tab bottom navigation.
 * Ikon menggunakan Bootstrap Icons sesuai planning TASK-031.
 * @type {NavTab[]}
 */
const NAV_TABS = [
  { path: '/', label: 'Beranda', icon: 'bi-house-fill' },
  { path: '/pasal', label: 'Pasal', icon: 'bi-journal-text' },
  { path: '/amandemen', label: 'Amandemen', icon: 'bi-clock-history' },
  { path: '/tentang', label: 'Tentang', icon: 'bi-info-circle-fill' },
];

export class BottomNavigation {
  /**
   * @param {HTMLElement} containerEl - Element tempat bottom nav di-render
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
   * Render bottom nav ke DOM dan bind events.
   */
  mount() {
    this.container.innerHTML = this._buildNavHtml();
    this._bindEvents();
  }

  /**
   * Update tab yang aktif saat router berpindah route.
   * Dipanggil oleh Router setelah setiap navigasi.
   * @param {string} path - Path baru yang aktif
   */
  setActivePath(path) {
    this._currentPath = path;
    const items = this.container.querySelectorAll('[data-bottom-nav-path]');
    items.forEach((item) => {
      const itemPath = item.getAttribute('data-bottom-nav-path');
      const isActive = this._isTabActive(itemPath);
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
  }

  // ---------------------------------------------------------------------------
  // Private: HTML builders
  // ---------------------------------------------------------------------------

  _buildNavHtml() {
    return `
      <nav class="bottom-nav"
           role="navigation"
           aria-label="Navigasi bawah">
        ${NAV_TABS.map((tab) => this._buildTabHtml(tab)).join('')}
      </nav>
    `;
  }

  /**
   * @param {NavTab} tab
   * @returns {string} HTML string satu tab item
   */
  _buildTabHtml(tab) {
    const isActive = this._isTabActive(tab.path);
    return `
      <a class="bottom-nav__item${isActive ? ' active' : ''}"
         href="${tab.path}"
         data-bottom-nav-path="${tab.path}"
         aria-current="${isActive ? 'page' : 'false'}"
         aria-label="${tab.label}">
        <i class="bi ${tab.icon}" aria-hidden="true"></i>
        <span class="bottom-nav__label">${tab.label}</span>
      </a>
    `;
  }

  /**
   * "/" aktif hanya ketika path persis "/".
   * Path lain aktif ketika currentPath startsWith tab path.
   * @param {string} tabPath
   * @returns {boolean}
   */
  _isTabActive(tabPath) {
    if (tabPath === '/') {
      return this._currentPath === '/';
    }
    return this._currentPath.startsWith(tabPath);
  }

  // ---------------------------------------------------------------------------
  // Private: Event binding — event delegation untuk performa
  // ---------------------------------------------------------------------------

  _bindEvents() {
    this.container.addEventListener('click', (e) => {
      const item = e.target.closest('[data-bottom-nav-path]');
      if (!item) return;

      e.preventDefault();
      this.router.navigate(item.getAttribute('data-bottom-nav-path'));
    });
  }
}
