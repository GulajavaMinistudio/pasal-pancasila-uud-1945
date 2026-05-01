/**
 * @file src/router/routes.js
 * @description Registrasi semua 14 route aplikasi + fallback 404.
 *
 * Mendaftarkan route ke instance Router yang diberikan.
 * Setiap handler menerima `params` (parameter dinamis) dan `deps` (injected dependencies).
 *
 * PHASE 1.5 (saat ini):
 *   Handler menggunakan placeholder renderer sederhana yang menampilkan judul halaman.
 *
 * PHASE 1.6 (selanjutnya):
 *   Setiap handler akan digantikan dengan import actual page class:
 *   import { PancasilaPage } from '../pages/PancasilaPage.js';
 *   router.addRoute('/pancasila', () => {
 *     const page = new PancasilaPage(deps.contentEl, { silaRepository: deps.silaRepository });
 *     page.mount();
 *   });
 *
 * Referensi: spec-architecture §4.2 — 14 routes
 *            planning TASK-038
 *
 * 14 Routes yang terdaftar (sesuai spec-architecture §4.2):
 *   /                  → Halaman Beranda (landing page)
 *   /pancasila         → Daftar 5 Sila Pancasila
 *   /sila/:nomor       → Detail Sila ke-nomor (1–5)
 *   /butir-pancasila   → Butir-butir pengamalan Pancasila (semua sila)
 *   /pembukaan         → 4 Alinea Pembukaan UUD 1945
 *   /pasal             → Daftar semua Pasal UUD 1945 pasca-amandemen
 *   /pasal/:nomor      → Detail Pasal (nomor: '1', '6A', '7B', dsb.)
 *   /bab-pasal         → Navigasi 21 Bab UUD 1945
 *   /bab-pasal/:nomor  → Navigasi ke Bab tertentu (nomor: 1–21)
 *   /uud-asli          → Pasal UUD 1945 versi asli (sebelum amandemen)
 *   /amandemen         → Daftar pasal dengan keterangan amandemen I–IV
 *   /amandemen/:nomor  → Perbandingan side-by-side asli vs. pasca-amandemen
 *   /cari              → Halaman pencarian
 *   /tentang           → Halaman tentang aplikasi
 *   *                  → 404 Not Found
 */

import { ButirPancasilaPage } from '../pages/ButirPancasilaPage.js';
import { HomePage } from '../pages/HomePage.js';
import { NotFoundPage } from '../pages/NotFoundPage.js';
import { PancasilaPage } from '../pages/PancasilaPage.js';
import { PembukaanPage } from '../pages/PembukaanPage.js';
import { SilaDetailPage } from '../pages/SilaDetailPage.js';

/**
 * @typedef {{
 *   contentEl: HTMLElement;
 *   butirRepository: { loadButirPancasila: () => Promise<Array<{ namasila: string; arrayisi: Array<{ isi: string }> }>> };
 *   pembukaanRepository: { loadPembukaanUUD: () => Promise<readonly string[]> };
 *   silaRepository: { loadSilaPancasila: () => Promise<readonly string[]> };
 *   sidebarEl: HTMLElement;
 *   router: import('./router.js').Router;
 * }} RouteDeps
 */

/**
 * Daftarkan semua 14 route + fallback 404 ke router.
 * Dipanggil dari src/main.js saat inisialisasi aplikasi.
 *
 * CATATAN URUTAN: Route yang lebih spesifik HARUS didaftarkan SEBELUM yang lebih umum.
 * Router menggunakan first-match, sehingga '/pancasila' harus sebelum '/pasal/:nomor'.
 *
 * @param {import('./router.js').Router} router
 * @param {RouteDeps} deps
 */
export function registerRoutes(router, deps) {
  const { contentEl, sidebarEl } = deps;

  // ── Static Routes (no parameters) ──────────────────────────────────────────

  router.addRoute('/', () => {
    const page = new HomePage(contentEl, { sidebarEl });
    page.mount();
  });

  router.addRoute('/pancasila', () => {
    const page = new PancasilaPage(contentEl, {
      sidebarEl,
      silaRepository: deps.silaRepository,
    });
    void page.mount();
  });

  router.addRoute('/butir-pancasila', () => {
    const page = new ButirPancasilaPage(contentEl, {
      sidebarEl,
      butirRepository: deps.butirRepository,
    });
    void page.mount();
  });

  router.addRoute('/pembukaan', () => {
    const page = new PembukaanPage(contentEl, {
      sidebarEl,
      pembukaanRepository: deps.pembukaanRepository,
    });
    void page.mount();
  });

  router.addRoute('/pasal', () => {
    _renderPlaceholder(contentEl, 'Daftar Pasal UUD 1945', 'Pasal 1 — Pasal 37', [
      'Semua pasal UUD 1945 pasca-amandemen (Amandemen I–IV, 1999–2002).',
    ]);
  });

  router.addRoute('/bab-pasal', () => {
    _renderPlaceholder(contentEl, 'Bab & Pasal UUD 1945', '21 Bab UUD 1945', [
      'Navigasi berdasarkan 21 Bab struktur UUD 1945.',
    ]);
  });

  router.addRoute('/uud-asli', () => {
    _renderPlaceholder(contentEl, 'UUD 1945 Asli', 'Naskah Asli Sebelum Amandemen', [
      'Teks asli UUD 1945 sebagaimana disahkan pada 18 Agustus 1945.',
    ]);
  });

  router.addRoute('/amandemen', () => {
    _renderPlaceholder(contentEl, 'Amandemen UUD 1945', 'Riwayat 4 Amandemen (1999–2002)', [
      'Daftar pasal yang diamandemen, dikelompokkan per amandemen I–IV.',
    ]);
  });

  router.addRoute('/cari', () => {
    _renderPlaceholder(contentEl, 'Pencarian', 'Cari Konten', [
      'Pencarian real-time di seluruh konten Pancasila & UUD 1945.',
    ]);
  });

  router.addRoute('/tentang', () => {
    _renderPlaceholder(contentEl, 'Tentang Aplikasi', 'Pancasila & UUD 1945', [
      'Informasi tentang aplikasi, sumber data, dan versi.',
    ]);
  });

  // ── Dynamic Routes (with parameters) ───────────────────────────────────────

  router.addRoute('/sila/:nomor', ({ nomor }) => {
    const page = new SilaDetailPage(contentEl, {
      nomor,
      sidebarEl,
      router: deps.router,
      silaRepository: deps.silaRepository,
      butirRepository: deps.butirRepository,
    });
    void page.mount();
  });

  router.addRoute('/pasal/:nomor', ({ nomor }) => {
    _renderPlaceholder(contentEl, `Pasal ${nomor}`, `Detail Pasal ${nomor} UUD 1945`, [
      `Isi lengkap Pasal ${nomor} beserta keterangan amandemen.`,
    ]);
  });

  router.addRoute('/bab-pasal/:nomor', ({ nomor }) => {
    _renderPlaceholder(contentEl, `Bab ${nomor}`, `Pasal-pasal dalam Bab ${nomor}`, [
      `Daftar semua pasal dalam Bab ${nomor} UUD 1945.`,
    ]);
  });

  router.addRoute('/amandemen/:nomor', ({ nomor }) => {
    _renderPlaceholder(contentEl, `Amandemen Pasal ${nomor}`, `Perbandingan Pasal ${nomor}`, [
      `Teks asli UUD 1945 vs. Pasal ${nomor} pasca-amandemen (side-by-side).`,
    ]);
  });

  // ── 404 Fallback ────────────────────────────────────────────────────────────

  router.setNotFoundHandler(() => {
    const page = new NotFoundPage(contentEl, { router: deps.router });
    page.mount();
  });
}

// =============================================================================
// Private: Placeholder Renderer (Phase 1.5 only — akan dihapus di Phase 1.6)
// =============================================================================

/**
 * Render placeholder halaman ke contentEl.
 * contentEl sudah memiliki class .page-container dari PageContainer,
 * sehingga placeholder TIDAK perlu menambahkan wrapper tersebut.
 *
 * @param {HTMLElement} el
 * @param {string} title - Judul singkat (untuk <title> dan heading)
 * @param {string} subtitle - Subjudul halaman
 * @param {string[]} details - Keterangan tambahan (array of string)
 */
function _renderPlaceholder(el, title, subtitle, details = []) {
  el.innerHTML = `
    <div class="text-center py-5 px-3">
      <div class="mb-3" aria-hidden="true">
        <i class="bi bi-building-columns"
           style="font-size: 3rem; color: var(--color-primary); opacity: 0.4;"></i>
      </div>

      <h1 class="fs-3 fw-bold" style="color: var(--color-on-surface);">
        ${subtitle}
      </h1>

      ${details.map((d) => `<p class="mt-2 mb-1" style="color: var(--color-text-secondary);">${d}</p>`).join('')}

      <div class="mt-4 d-inline-flex align-items-center gap-2 px-3 py-2 rounded-3"
           style="background: var(--color-surface-container); color: var(--color-text-secondary);
                  font-size: 0.875rem;">
        <i class="bi bi-hourglass-split" aria-hidden="true"></i>
        <span>Konten sedang disiapkan — Phase 1.6</span>
      </div>
    </div>
  `;

  // Update document title untuk aksesibilitas dan tab browser
  document.title = `${title} — Pancasila & UUD 1945`;
}
