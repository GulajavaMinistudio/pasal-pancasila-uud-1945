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

import { AmandemenDetailPage } from '../pages/AmandemenDetailPage.js';
import { AmandemenPage } from '../pages/AmandemenPage.js';
import { BabPasalDetailPage } from '../pages/BabPasalDetailPage.js';
import { BabPasalListPage } from '../pages/BabPasalListPage.js';
import { ButirPancasilaPage } from '../pages/ButirPancasilaPage.js';
import { CariPage } from '../pages/CariPage.js';
import { HomePage } from '../pages/HomePage.js';
import { NotFoundPage } from '../pages/NotFoundPage.js';
import { PancasilaPage } from '../pages/PancasilaPage.js';
import { PasalDetailPage } from '../pages/PasalDetailPage.js';
import { PasalListPage } from '../pages/PasalListPage.js';
import { PembukaanPage } from '../pages/PembukaanPage.js';
import { SilaDetailPage } from '../pages/SilaDetailPage.js';
import { TentangPage } from '../pages/TentangPage.js';
import { UUDAsliPage } from '../pages/UUDAsliPage.js';

/**
 * @typedef {{
 *   contentEl: HTMLElement;
 *   babRepository: { loadBabPasal: () => Promise<import('../types/data').BabPasalData> };
 *   butirRepository: { loadButirPancasila: () => Promise<Array<{ namasila: string; arrayisi: Array<{ isi: string }> }>> };
 *   pasalRepository: { loadPasalUUD: () => Promise<Array<{ namapasal: string; arrayisi: Array<{ isi: string }> }>> };
 *   pasalKetAmandemenRepository: { loadPasalUUDKetAmandemen: () => Promise<Array<{ namapasal: string; amandemen: string; babpasal: string }>> };
 *   uudAsliRepository: { loadPasalUUDNoAmandemen: () => Promise<Array<{ namapasal: string; arrayisi: Array<{ isi: string }>; babpasal: string }>> };
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
    const page = new PasalListPage(contentEl, {
      sidebarEl,
      pasalRepository: deps.pasalRepository,
      pasalKetAmandemenRepository: deps.pasalKetAmandemenRepository,
    });
    void page.mount();
  });

  router.addRoute('/bab-pasal', () => {
    const page = new BabPasalListPage(contentEl, {
      sidebarEl,
      babRepository: deps.babRepository,
    });
    void page.mount();
  });

  router.addRoute('/uud-asli', () => {
    const page = new UUDAsliPage(contentEl, {
      sidebarEl,
      uudAsliRepository: deps.uudAsliRepository,
    });
    void page.mount();
  });

  router.addRoute('/amandemen', () => {
    const page = new AmandemenPage(contentEl, {
      sidebarEl,
      pasalKetAmandemenRepository: deps.pasalKetAmandemenRepository,
    });
    void page.mount();
  });

  router.addRoute('/cari', () => {
    const page = new CariPage(contentEl, {
      sidebarEl,
      router: deps.router,
      pasalRepository: deps.pasalRepository,
    });
    void page.mount();
  });

  router.addRoute('/tentang', () => {
    const page = new TentangPage(contentEl, { sidebarEl });
    page.mount();
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
    const page = new PasalDetailPage(contentEl, {
      nomor,
      sidebarEl,
      router: deps.router,
      pasalRepository: deps.pasalRepository,
      pasalKetAmandemenRepository: deps.pasalKetAmandemenRepository,
    });
    void page.mount();
  });

  router.addRoute('/bab-pasal/:nomor', ({ nomor }) => {
    const page = new BabPasalDetailPage(contentEl, {
      nomor,
      sidebarEl,
      router: deps.router,
      babRepository: deps.babRepository,
    });
    void page.mount();
  });

  // CATATAN URUTAN: /amandemen/:nomor HARUS didaftarkan SEBELUM /amandemen
  // agar router (first-match) tidak mencocokkan "/amandemen/7" ke route statis "/amandemen".
  router.addRoute('/amandemen/:nomor', ({ nomor }) => {
    const page = new AmandemenDetailPage(contentEl, {
      nomor,
      sidebarEl,
      router: deps.router,
      uudAsliRepository: deps.uudAsliRepository,
      pasalKetAmandemenRepository: deps.pasalKetAmandemenRepository,
    });
    void page.mount();
  });

  // ── 404 Fallback ────────────────────────────────────────────────────────────

  router.setNotFoundHandler(() => {
    const page = new NotFoundPage(contentEl, { router: deps.router });
    page.mount();
  });
}
