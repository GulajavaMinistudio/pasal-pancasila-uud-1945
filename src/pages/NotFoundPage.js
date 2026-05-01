/**
 * @file src/pages/NotFoundPage.js
 * @description Halaman 404 Not Found — placeholder untuk Phase 1.5.
 *
 * Akan dikembangkan lebih lanjut di Phase 2 dengan:
 *   - Saran halaman yang mungkin dituju
 *   - Pencarian cepat dari halaman 404
 *
 * Referensi visual:
 *   - Konsisten dengan design system (merah, Bootstrap, Public Sans)
 *   - planning TASK-040
 *
 * Aturan Clean Architecture (CS-2):
 *   - Komponen murni presentational — tidak ada fetch()
 *   - Tidak menerima dependensi eksternal
 */

/** Daftar tautan pintasan yang ditampilkan di halaman 404 */
const SHORTCUT_LINKS = [
  { path: '/', label: 'Beranda', icon: 'bi-house-fill' },
  { path: '/pancasila', label: 'Pancasila', icon: 'bi-star-fill' },
  { path: '/pasal', label: 'Daftar Pasal', icon: 'bi-journal-text' },
];

export class NotFoundPage {
  /**
   * @param {HTMLElement} containerEl - Element slot konten (dari PageContainer.getContentElement())
   * @param {{ router: { navigate: (path: string) => void } }} deps
   */
  constructor(containerEl, { router }) {
    this.container = containerEl;
    this.router = router;
  }

  /**
   * Render halaman 404 ke DOM dan bind events.
   */
  mount() {
    this.container.innerHTML = this._buildHtml();
    document.title = '404 — Halaman Tidak Ditemukan | Pancasila & UUD 1945';
    this._bindEvents();
  }

  // ---------------------------------------------------------------------------
  // Private: HTML builder
  // ---------------------------------------------------------------------------

  _buildHtml() {
    return `
      <div class="text-center py-5 px-3">

        <!-- Ilustrasi 404 -->
        <div aria-hidden="true"
             style="font-size: 5rem; font-weight: 800; line-height: 1;
                    color: var(--color-primary); opacity: 0.15; user-select: none;">
          404
        </div>
        <div class="mt-2 mb-1" aria-hidden="true">
          <i class="bi bi-map" style="font-size: 3rem; color: var(--color-primary); opacity: 0.5;"></i>
        </div>

        <!-- Pesan -->
        <h1 class="fs-3 fw-bold mt-3" style="color: var(--color-on-surface);">
          Halaman Tidak Ditemukan
        </h1>
        <p class="mt-2 mb-4" style="color: var(--color-text-secondary); max-width: 400px; margin-inline: auto;">
          Halaman yang Anda cari tidak ada atau telah dipindahkan.
          Coba navigasi ke salah satu halaman berikut:
        </p>

        <!-- Pintasan navigasi -->
        <div class="d-flex flex-wrap justify-content-center gap-2 mb-4">
          ${SHORTCUT_LINKS.map((link) => this._buildShortcutHtml(link)).join('')}
        </div>

        <!-- Tombol kembali ke beranda -->
        <a href="/"
           class="btn fw-semibold px-4 py-2 text-white"
           style="background-color: var(--color-primary);"
           data-nav-to="/">
          <i class="bi bi-house-fill me-2" aria-hidden="true"></i>
          Kembali ke Beranda
        </a>

      </div>
    `;
  }

  /**
   * @param {{ path: string; label: string; icon: string }} link
   * @returns {string}
   */
  _buildShortcutHtml(link) {
    return `
      <a class="btn btn-outline-secondary btn-sm fw-semibold"
         href="${link.path}"
         data-nav-to="${link.path}">
        <i class="bi ${link.icon} me-1" aria-hidden="true"></i>
        ${link.label}
      </a>
    `;
  }

  // ---------------------------------------------------------------------------
  // Private: Event binding
  // ---------------------------------------------------------------------------

  _bindEvents() {
    this.container.addEventListener('click', (e) => {
      const navEl = e.target.closest('[data-nav-to]');
      if (!navEl) return;
      e.preventDefault();
      this.router.navigate(navEl.getAttribute('data-nav-to'));
    });
  }
}
