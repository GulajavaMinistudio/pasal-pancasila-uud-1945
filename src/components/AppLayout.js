/**
 * @file src/components/AppLayout.js
 * @description AppLayout — layout container dua-kolom (sidebar + main).
 *
 * Desktop (md+):
 *   ┌────────────────────────────────────┐
 *   │  .app-sidebar (280px, sticky)      │  .app-main (flex-grow)   │
 *   └────────────────────────────────────┘
 *
 * Mobile (<md):
 *   .app-sidebar disembunyikan via CSS,
 *   .app-main memenuhi seluruh lebar layar.
 *
 * API publik:
 *   - getSidebarSlot()  → HTMLElement  (slot untuk sidebar nav)
 *   - getMainSlot()     → HTMLElement  (slot untuk konten halaman)
 *
 * Konten footer di-embed di dalam .app-main (bawah konten, atas bottom-nav clearance).
 *
 * Referensi visual:
 *   - docs/mockup_desktop_web/beranda_pancasila_uud_1945/code.html
 *   - docs/mockup_desktop_web/daftar_pasal_uud_1945_1/code.html
 *   - spec-design-uiux §4.2 Layout System
 *   - planning TASK-032
 *
 * Aturan Clean Architecture (CS-1, CS-2):
 *   - Komponen ini murni presentational — tidak ada fetch()
 *   - Tidak menerima dependensi eksternal — hanya mengatur layout
 */

/** Tahun copyright, diambil dynamis agar tidak perlu di-update manual. */
const CURRENT_YEAR = new Date().getFullYear();

export class AppLayout {
  /**
   * @param {HTMLElement} containerEl - Element tempat layout di-render (biasanya #app)
   */
  constructor(containerEl) {
    this.container = containerEl;
    /** @type {HTMLElement | null} */
    this._sidebarSlotEl = null;
    /** @type {HTMLElement | null} */
    this._mainSlotEl = null;
  }

  /**
   * Render layout ke DOM dan simpan referensi slot.
   * Harus dipanggil sebelum getSidebarSlot() atau getMainSlot().
   */
  mount() {
    this.container.innerHTML = this._buildLayoutHtml();
    this._sidebarSlotEl = this.container.querySelector('#sidebar-slot');
    this._mainSlotEl = this.container.querySelector('#main-slot');
  }

  /**
   * Mengembalikan element slot sidebar untuk diisi oleh komponen lain.
   * @returns {HTMLElement}
   */
  getSidebarSlot() {
    if (!this._sidebarSlotEl) {
      throw new Error('AppLayout.getSidebarSlot() dipanggil sebelum mount()');
    }
    return this._sidebarSlotEl;
  }

  /**
   * Mengembalikan element slot main content untuk diisi oleh PageContainer.
   * @returns {HTMLElement}
   */
  getMainSlot() {
    if (!this._mainSlotEl) {
      throw new Error('AppLayout.getMainSlot() dipanggil sebelum mount()');
    }
    return this._mainSlotEl;
  }

  // ---------------------------------------------------------------------------
  // Private: HTML builders
  // ---------------------------------------------------------------------------

  _buildLayoutHtml() {
    return `
      <div class="app-layout">

        <!-- Sidebar (only visible on desktop md+) -->
        <aside class="app-sidebar d-none d-md-flex flex-column"
               role="complementary"
               aria-label="Navigasi sidebar">
          <div id="sidebar-slot"></div>
        </aside>

        <!-- Main content area -->
        <div class="app-main">
          <!-- Slot diisi oleh PageContainer atau halaman aktif -->
          <div id="main-slot"></div>

          <!-- Footer -->
          ${this._buildFooterHtml()}
        </div>

      </div>
    `;
  }

  _buildFooterHtml() {
    return `
      <footer class="app-footer" role="contentinfo">
        <div class="container-fluid">
          <div class="d-flex flex-column flex-md-row align-items-center justify-content-between gap-2">

            <!-- Brand footer -->
            <div class="d-flex align-items-center gap-2">
              <i class="bi bi-building-columns" aria-hidden="true"></i>
              <span class="fw-semibold">Konstitusi RI</span>
            </div>

            <!-- Copyright -->
            <p class="mb-0 text-center" style="font-size: 0.8125rem;">
              &copy; ${CURRENT_YEAR} Pancasila &amp; UUD 1945.
              Data bersumber dari dokumen resmi negara.
            </p>

            <!-- Tautan cepat -->
            <div class="d-flex gap-3">
              <a href="/tentang"
                 class="text-decoration-none"
                 style="font-size: 0.8125rem;"
                 aria-label="Tentang aplikasi">
                Tentang
              </a>
              <a href="/cari"
                 class="text-decoration-none"
                 style="font-size: 0.8125rem;"
                 aria-label="Cari konten">
                Pencarian
              </a>
            </div>

          </div>
        </div>
      </footer>
    `;
  }
}
