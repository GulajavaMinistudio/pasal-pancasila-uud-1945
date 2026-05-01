/**
 * @file src/components/PageContainer.js
 * @description PageContainer — wrapper konten dengan padding responsif standar.
 *
 * Semua halaman (pages) me-render kontennya ke dalam element yang dikembalikan
 * oleh `getContentElement()`, bukan langsung ke #main-slot dari AppLayout.
 * Ini memastikan padding standar konsisten di seluruh halaman.
 *
 * Padding:
 *   - Mobile (<md)       : 16px (1rem)
 *   - Tablet (md–lg)     : 24px (1.5rem)
 *   - Desktop (lg+)      : 32px (2rem)
 *
 * Didefinisikan via `.page-container` di src/assets/main.scss.
 *
 * API publik:
 *   - getContentElement() → HTMLElement  (slot untuk konten halaman)
 *
 * Referensi visual: semua mockup — konten di dalam area putih berpadding
 * Referensi planning: TASK-033
 *
 * Aturan Clean Architecture (CS-2):
 *   - Komponen ini murni presentational — tidak ada logika bisnis
 *   - Tidak menerima dependensi eksternal
 */

export class PageContainer {
  /**
   * @param {HTMLElement} containerEl - Element slot dari AppLayout.getMainSlot()
   */
  constructor(containerEl) {
    this.container = containerEl;
    /** @type {HTMLElement | null} */
    this._contentEl = null;
  }

  /**
   * Render wrapper ke DOM dan simpan referensi content element.
   * Harus dipanggil sebelum getContentElement().
   */
  mount() {
    this.container.innerHTML = `
      <div class="page-container" id="page-content" role="main">
      </div>
    `;
    this._contentEl = this.container.querySelector('#page-content');
  }

  /**
   * Mengembalikan element konten yang sudah memiliki padding standar.
   * Page handler me-render HTML-nya ke dalam element ini.
   * @returns {HTMLElement}
   */
  getContentElement() {
    if (!this._contentEl) {
      throw new Error('PageContainer.getContentElement() dipanggil sebelum mount()');
    }
    return this._contentEl;
  }
}
