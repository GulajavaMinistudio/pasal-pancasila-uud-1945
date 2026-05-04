/**
 * @file src/components/OfflineIndicator.js
 * @description OfflineIndicator — banner non-intrusif yang tampil saat koneksi terputus.
 *
 * Komponen ini:
 *   - Mendengarkan window events `offline` dan `online`
 *   - Menampilkan banner saat offline, menyembunyikannya saat kembali online
 *   - Mounted secara global dari src/main.js (bukan dari page/route manapun)
 *   - Membersihkan event listeners saat unmount() dipanggil
 *
 * Desain: toast kecil fixed di bagian bawah layar (di atas bottom nav mobile).
 * Transisi CSS smooth (slide up / fade in) untuk UX yang tidak mengganggu.
 *
 * Referensi planning: TASK-010, TASK-011 (Phase 3.1 — PWA)
 * Referensi spec: REQ-011 — indikator visual offline
 *
 * Aturan Clean Architecture (CS-1, CS-2):
 *   - Murni presentational — tidak ada fetch() atau business logic
 *   - Tidak menerima dependensi data — hanya membaca state browser (navigator.onLine)
 */

/** Durasi transisi CSS dalam milidetik (harus sinkron dengan variabel SCSS). */
const HIDE_TRANSITION_MS = 300;

export class OfflineIndicator {
  /**
   * @param {HTMLElement} containerEl - Element tempat banner di-render
   */
  constructor(containerEl) {
    this.container = containerEl;

    /** @type {HTMLElement | null} */
    this._bannerEl = null;

    // Bind event handlers ke instance agar bisa dilepas di unmount()
    this._handleOffline = this._handleOffline.bind(this);
    this._handleOnline = this._handleOnline.bind(this);
  }

  /**
   * Render banner ke DOM dan pasang event listeners jaringan.
   * Harus dipanggil setelah container ada di DOM.
   */
  mount() {
    this.container.innerHTML = this._buildHtml();
    this._bannerEl = this.container.querySelector('[data-offline-banner]');

    window.addEventListener('offline', this._handleOffline);
    window.addEventListener('online', this._handleOnline);

    // Handle kondisi offline yang sudah terjadi sebelum mount (jarang, tapi perlu)
    if (!navigator.onLine) {
      this._showBanner();
    }
  }

  /**
   * Lepas event listeners. Panggil saat aplikasi di-teardown.
   */
  unmount() {
    window.removeEventListener('offline', this._handleOffline);
    window.removeEventListener('online', this._handleOnline);
    this._bannerEl = null;
  }

  // ---------------------------------------------------------------------------
  // Private: Event handlers
  // ---------------------------------------------------------------------------

  _handleOffline() {
    this._showBanner();
  }

  _handleOnline() {
    this._hideBanner();
  }

  // ---------------------------------------------------------------------------
  // Private: Visibility control
  // ---------------------------------------------------------------------------

  _showBanner() {
    if (!this._bannerEl) return;
    this._bannerEl.removeAttribute('hidden');
    // Dua-frame animation trick: pertama hapus hidden, lalu tambahkan class visible
    // agar CSS transition bisa berjalan (tidak skip dari hidden ke visible sekaligus)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (this._bannerEl) {
          this._bannerEl.classList.add('offline-indicator--visible');
        }
      });
    });
  }

  _hideBanner() {
    if (!this._bannerEl) return;
    this._bannerEl.classList.remove('offline-indicator--visible');
    // Tunggu transisi CSS selesai sebelum set hidden
    setTimeout(() => {
      if (this._bannerEl) {
        this._bannerEl.setAttribute('hidden', '');
      }
    }, HIDE_TRANSITION_MS);
  }

  // ---------------------------------------------------------------------------
  // Private: HTML builder
  // ---------------------------------------------------------------------------

  _buildHtml() {
    return `
      <div
        class="offline-indicator"
        data-offline-banner
        hidden
        role="status"
        aria-live="polite"
        aria-atomic="true"
        aria-label="Status koneksi internet"
      >
        <i class="bi bi-wifi-off me-2" aria-hidden="true"></i>
        <span>Anda sedang <strong>offline</strong>. Konten yang sudah dimuat tetap tersedia.</span>
      </div>
    `;
  }
}
