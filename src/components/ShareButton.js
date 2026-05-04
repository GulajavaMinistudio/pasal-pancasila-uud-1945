/**
 * @file src/components/ShareButton.js
 * @description ShareButton — komponen tombol berbagi konten interaktif.
 *
 * Bertanggung jawab atas:
 *   - Menemukan elemen button [data-share-btn] di dalam containerEl
 *   - Menangani click → memanggil shareContent() dari src/utils/share.js
 *   - Menampilkan loading state (spinner) saat share sedang diproses
 *   - Menampilkan notifikasi "Tautan disalin!" saat clipboard copy berhasil (TASK-018)
 *   - Membersihkan event listener saat unmount() dipanggil
 *
 * Pola penggunaan di halaman:
 *   ```js
 *   this.container.innerHTML = this._buildHtml(data);
 *   new ShareButton(this.container, { title, text, url }).mount();
 *   ```
 *
 * Referensi planning: TASK-013, TASK-018 (Phase 3.2 — Fitur Berbagi Konten)
 * Referensi spec: REQ-004, AC-013, AC-014
 *
 * Aturan Clean Architecture (CS-1, CS-2):
 *   - Komponen presentational — menerima share data sebagai parameter
 *   - Tidak ada fetch() atau logika bisnis
 *   - Berinteraksi dengan DOM hanya di dalam containerEl (kecuali toast global di body)
 */

import { shareContent } from '../utils/share.js';

/** Durasi toast "Tautan disalin!" tampil sebelum mulai dismiss (ms). */
const TOAST_VISIBLE_MS = 2000;

/** Durasi transisi dismiss toast (ms) — harus sinkron dengan SCSS transition. */
const TOAST_DISMISS_MS = 300;

export class ShareButton {
  /**
   * @param {HTMLElement} containerEl - Element yang mengandung [data-share-btn]
   * @param {{ title: string; text: string; url: string }} shareData
   */
  constructor(containerEl, { title, text, url }) {
    this.container = containerEl;
    this.shareData = { title, text, url };

    /** @type {HTMLButtonElement | null} */
    this._btn = null;

    // Bind agar bisa dilepas dengan removeEventListener
    this._handleClick = this._handleClick.bind(this);
  }

  /**
   * Temukan [data-share-btn] dalam containerEl dan pasang event listener.
   * No-op jika tombol tidak ditemukan.
   */
  mount() {
    const btn = this.container.querySelector('[data-share-btn]');
    if (!btn) return;

    this._btn = /** @type {HTMLButtonElement} */ (btn);
    this._btn.addEventListener('click', this._handleClick);
  }

  /**
   * Lepas event listener dari tombol.
   * Panggil saat komponen di-unmount atau saat halaman di-navigate away.
   */
  unmount() {
    if (this._btn) {
      this._btn.removeEventListener('click', this._handleClick);
      this._btn = null;
    }
  }

  // ---------------------------------------------------------------------------
  // Private: Event handler
  // ---------------------------------------------------------------------------

  async _handleClick() {
    if (!this._btn || this._btn.disabled) return;

    this._setLoadingState(true);

    try {
      const result = await shareContent(this.shareData);

      if (result === 'copied') {
        _showCopiedToast();
      }
    } finally {
      // Selalu reset loading state, bahkan jika shareContent throw
      this._setLoadingState(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Private: Loading state
  // ---------------------------------------------------------------------------

  /**
   * @param {boolean} loading
   */
  _setLoadingState(loading) {
    if (!this._btn) return;

    this._btn.disabled = loading;

    const iconEl = this._btn.querySelector('i');
    if (!iconEl) return;

    if (loading) {
      this._btn.setAttribute('aria-busy', 'true');
      iconEl.className = 'spinner-border spinner-border-sm me-2';
      iconEl.setAttribute('role', 'status');
      iconEl.setAttribute('aria-label', 'Memproses...');
      iconEl.removeAttribute('aria-hidden');
    } else {
      this._btn.removeAttribute('aria-busy');
      iconEl.className = 'bi bi-share me-2';
      iconEl.removeAttribute('role');
      iconEl.removeAttribute('aria-label');
      iconEl.setAttribute('aria-hidden', 'true');
    }
  }
}

// =============================================================================
// Module-level helper — tidak di-export (private untuk modul ini)
// =============================================================================

/**
 * Tampilkan toast notifikasi "Tautan disalin!" di body.
 *
 * Toast muncul dengan transisi CSS slide-up + fade-in, lalu auto-dismiss
 * setelah TOAST_VISIBLE_MS. Jika ada toast dari klik sebelumnya, di-replace.
 *
 * Referensi planning: TASK-018
 */
function _showCopiedToast() {
  // Hapus toast yang mungkin masih tampil dari aksi sebelumnya
  const existingToast = document.querySelector('[data-share-toast]');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.setAttribute('data-share-toast', '');
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.className = 'share-toast';
  toast.innerHTML =
    '<i class="bi bi-check-circle-fill me-2" aria-hidden="true"></i>Tautan disalin!';

  document.body.appendChild(toast);

  // Dua-frame animation trick: pastikan browser selesai paint elemen dulu
  // sebelum menambahkan class --visible agar CSS transition berjalan
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.classList.add('share-toast--visible');
    });
  });

  setTimeout(() => {
    toast.classList.remove('share-toast--visible');
    setTimeout(() => toast.remove(), TOAST_DISMISS_MS);
  }, TOAST_VISIBLE_MS);
}
