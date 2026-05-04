/**
 * @file src/utils/share.js
 * @description Utility berbagi konten — Web Share API dengan Clipboard API sebagai fallback.
 *
 * Strategi fallback:
 *   1. navigator.share()              — Web Share API (mobile & beberapa desktop)
 *   2. navigator.clipboard.writeText() — Clipboard API (desktop modern)
 *   3. window.prompt()               — Last resort (copy manual oleh user)
 *
 * Referensi planning: TASK-012 (Phase 3.2 — Fitur Berbagi Konten)
 * Referensi spec: REQ-004, AC-013, AC-014
 * Referensi MDN: https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API
 *
 * Aturan Clean Architecture (CS-1):
 *   - Adapter layer (src/utils/) — tidak ada import dari src/pages/ atau src/data/
 *   - Hanya berinteraksi dengan Web APIs browser
 */

/**
 * @typedef {'shared' | 'copied' | 'prompted' | 'aborted'} ShareResult
 */

/**
 * Bagikan konten menggunakan Web Share API, Clipboard API, atau window.prompt sebagai fallback.
 *
 * Mengembalikan string yang mendeskripsikan cara share berhasil dilakukan:
 *   - 'shared'   — Web Share API berhasil
 *   - 'copied'   — Teks disalin ke clipboard
 *   - 'prompted' — window.prompt dibuka untuk copy manual
 *   - 'aborted'  — User membatalkan dialog share (bukan error)
 *
 * @param {{ title: string; text: string; url: string }} shareData
 * @returns {Promise<ShareResult>}
 */
export async function shareContent({ title, text, url }) {
  // ── 1. Web Share API ─────────────────────────────────────────────────────
  // Tersedia di mobile browsers dan Chrome/Edge desktop modern.
  // CON-001: hanya berfungsi di HTTPS (wajib di production).
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return 'shared';
    } catch (err) {
      // AbortError: user menutup dialog share — bukan error teknis
      if (err instanceof Error && err.name === 'AbortError') {
        return 'aborted';
      }
      // Error lain (NotAllowedError di desktop, dll) — fall through ke clipboard
    }
  }

  // ── 2. Clipboard API ─────────────────────────────────────────────────────
  // Tersedia di semua browser modern di HTTPS dan localhost.
  const clipboardText = text ? `${text}\n\n${url}` : url;
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(clipboardText);
      return 'copied';
    } catch {
      // NotAllowedError: permission denied atau document tidak focused
      // fall through ke window.prompt
    }
  }

  // ── 3. window.prompt (last resort) ────────────────────────────────────────
  // Membuka dialog yang memungkinkan user meng-copy URL secara manual.
  window.prompt('Salin tautan berikut:', url);
  return 'prompted';
}
