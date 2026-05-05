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
import { updateMetaTags } from '../utils/seo.js';
import {
  createArticleSchema,
  createBreadcrumbSchema,
  createWebPageSchema,
  injectJsonLd,
  removeJsonLd,
} from '../utils/jsonld.js';

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
    updateMetaTags({
      title: 'Pancasila & UUD 1945 — Konstitusi Indonesia',
      description:
        'Baca Pancasila, Pembukaan UUD 1945, dan seluruh Pasal UUD 1945 secara online. Lengkap, akurat, dan dapat diakses kapan saja.',
      path: '/',
    });
    injectJsonLd([
      createWebPageSchema({
        name: 'Pancasila & UUD 1945 — Konstitusi Indonesia',
        description:
          'Baca Pancasila, Pembukaan UUD 1945, dan seluruh Pasal UUD 1945 secara online. Lengkap, akurat, dan dapat diakses kapan saja.',
        url: '/',
      }),
      createBreadcrumbSchema([{ name: 'Beranda', path: '/' }]),
    ]);
    const page = new HomePage(contentEl, { sidebarEl });
    page.mount();
  });

  router.addRoute('/pancasila', () => {
    updateMetaTags({
      title: '5 Sila Pancasila — Dasar Negara Indonesia',
      description:
        'Teks lengkap 5 Sila Pancasila sebagai dasar negara Republik Indonesia. Ketuhanan Yang Maha Esa hingga Keadilan Sosial.',
      path: '/pancasila',
    });
    injectJsonLd([
      createWebPageSchema({
        name: '5 Sila Pancasila — Dasar Negara Indonesia',
        description:
          'Teks lengkap 5 Sila Pancasila sebagai dasar negara Republik Indonesia. Ketuhanan Yang Maha Esa hingga Keadilan Sosial.',
        url: '/pancasila',
      }),
      createBreadcrumbSchema([
        { name: 'Beranda', path: '/' },
        { name: 'Pancasila', path: '/pancasila' },
      ]),
    ]);
    const page = new PancasilaPage(contentEl, {
      sidebarEl,
      silaRepository: deps.silaRepository,
    });
    void page.mount();
  });

  router.addRoute('/butir-pancasila', () => {
    updateMetaTags({
      title: 'Butir-Butir Pengamalan Pancasila — 45 Butir',
      description:
        'Daftar lengkap 45 butir pengamalan Pancasila per sila, pedoman perilaku warga negara Indonesia.',
      path: '/butir-pancasila',
    });
    injectJsonLd(
      createWebPageSchema({
        name: 'Butir-Butir Pengamalan Pancasila — 45 Butir',
        description:
          'Daftar lengkap 45 butir pengamalan Pancasila per sila, pedoman perilaku warga negara Indonesia.',
        url: '/butir-pancasila',
      })
    );
    const page = new ButirPancasilaPage(contentEl, {
      sidebarEl,
      butirRepository: deps.butirRepository,
    });
    void page.mount();
  });

  router.addRoute('/pembukaan', () => {
    updateMetaTags({
      title: 'Pembukaan UUD 1945 — Empat Alinea',
      description:
        'Teks lengkap Pembukaan Undang-Undang Dasar 1945 dalam 4 alinea. Dasar konstitusional Republik Indonesia.',
      path: '/pembukaan',
    });
    injectJsonLd(
      createWebPageSchema({
        name: 'Pembukaan UUD 1945 — Empat Alinea',
        description:
          'Teks lengkap Pembukaan Undang-Undang Dasar 1945 dalam 4 alinea. Dasar konstitusional Republik Indonesia.',
        url: '/pembukaan',
      })
    );
    const page = new PembukaanPage(contentEl, {
      sidebarEl,
      pembukaanRepository: deps.pembukaanRepository,
    });
    void page.mount();
  });

  router.addRoute('/pasal', () => {
    updateMetaTags({
      title: 'Pasal-Pasal UUD 1945 — Daftar Lengkap Pasca-Amandemen',
      description:
        'Daftar lengkap pasal-pasal UUD 1945 pasca amandemen (Pasal 1–37). Klik untuk membaca isi lengkap setiap pasal.',
      path: '/pasal',
    });
    injectJsonLd(
      createWebPageSchema({
        name: 'Pasal-Pasal UUD 1945 — Daftar Lengkap Pasca-Amandemen',
        description:
          'Daftar lengkap pasal-pasal UUD 1945 pasca amandemen (Pasal 1–37). Klik untuk membaca isi lengkap setiap pasal.',
        url: '/pasal',
      })
    );
    const page = new PasalListPage(contentEl, {
      sidebarEl,
      pasalRepository: deps.pasalRepository,
      pasalKetAmandemenRepository: deps.pasalKetAmandemenRepository,
    });
    void page.mount();
  });

  router.addRoute('/bab-pasal', () => {
    updateMetaTags({
      title: 'Bab-Bab UUD 1945 — Navigasi 21 Bab',
      description:
        'Navigasi pasal UUD 1945 berdasarkan 21 bab. Dari Bentuk Negara hingga Perubahan UUD.',
      path: '/bab-pasal',
    });
    injectJsonLd(
      createWebPageSchema({
        name: 'Bab-Bab UUD 1945 — Navigasi 21 Bab',
        description:
          'Navigasi pasal UUD 1945 berdasarkan 21 bab. Dari Bentuk Negara hingga Perubahan UUD.',
        url: '/bab-pasal',
      })
    );
    const page = new BabPasalListPage(contentEl, {
      sidebarEl,
      babRepository: deps.babRepository,
    });
    void page.mount();
  });

  router.addRoute('/uud-asli', () => {
    updateMetaTags({
      title: 'UUD 1945 Asli — Sebelum Amandemen',
      description:
        'Teks UUD 1945 dalam versi asli sebelum amandemen. Bandingkan dengan versi pasca-amandemen (1999–2002).',
      path: '/uud-asli',
    });
    injectJsonLd(
      createWebPageSchema({
        name: 'UUD 1945 Asli — Sebelum Amandemen',
        description:
          'Teks UUD 1945 dalam versi asli sebelum amandemen. Bandingkan dengan versi pasca-amandemen (1999–2002).',
        url: '/uud-asli',
      })
    );
    const page = new UUDAsliPage(contentEl, {
      sidebarEl,
      uudAsliRepository: deps.uudAsliRepository,
    });
    void page.mount();
  });

  router.addRoute('/amandemen', () => {
    updateMetaTags({
      title: 'Amandemen UUD 1945 — Riwayat Perubahan I–IV',
      description:
        'Daftar pasal UUD 1945 yang mengalami amandemen beserta keterangan Amandemen I (1999) hingga IV (2002).',
      path: '/amandemen',
    });
    injectJsonLd(
      createWebPageSchema({
        name: 'Amandemen UUD 1945 — Riwayat Perubahan I–IV',
        description:
          'Daftar pasal UUD 1945 yang mengalami amandemen beserta keterangan Amandemen I (1999) hingga IV (2002).',
        url: '/amandemen',
      })
    );
    const page = new AmandemenPage(contentEl, {
      sidebarEl,
      pasalKetAmandemenRepository: deps.pasalKetAmandemenRepository,
    });
    void page.mount();
  });

  router.addRoute('/cari', () => {
    updateMetaTags({
      title: 'Cari Pasal UUD 1945 — Pencarian Konstitusi',
      description:
        'Cari pasal UUD 1945 berdasarkan kata kunci. Temukan pasal tentang hak, kewajiban, pemerintahan, dan lainnya.',
      path: '/cari',
    });
    injectJsonLd(
      createWebPageSchema({
        name: 'Cari Pasal UUD 1945 — Pencarian Konstitusi',
        description:
          'Cari pasal UUD 1945 berdasarkan kata kunci. Temukan pasal tentang hak, kewajiban, pemerintahan, dan lainnya.',
        url: '/cari',
      })
    );
    const page = new CariPage(contentEl, {
      sidebarEl,
      router: deps.router,
      pasalRepository: deps.pasalRepository,
    });
    void page.mount();
  });

  router.addRoute('/tentang', () => {
    updateMetaTags({
      title: 'Tentang Aplikasi Pancasila & UUD 1945',
      description:
        'Informasi tentang aplikasi web Pancasila & UUD 1945. Referensi konstitusional Indonesia yang akurat dan mudah diakses.',
      path: '/tentang',
    });
    injectJsonLd(
      createWebPageSchema({
        name: 'Tentang Aplikasi Pancasila & UUD 1945',
        description:
          'Informasi tentang aplikasi web Pancasila & UUD 1945. Referensi konstitusional Indonesia yang akurat dan mudah diakses.',
        url: '/tentang',
      })
    );
    const page = new TentangPage(contentEl, { sidebarEl });
    page.mount();
  });

  // ── Dynamic Routes (with parameters) ───────────────────────────────────────

  router.addRoute('/sila/:nomor', ({ nomor }) => {
    updateMetaTags({
      title: `Sila ${nomor} Pancasila — Teks Lengkap & Butir Pengamalan`,
      description: `Teks lengkap dan butir-butir pengamalan Sila ke-${nomor} Pancasila sebagai dasar negara Indonesia.`,
      path: `/sila/${nomor}`,
    });
    injectJsonLd(
      createWebPageSchema({
        name: `Sila ${nomor} Pancasila — Teks Lengkap & Butir Pengamalan`,
        description: `Teks lengkap dan butir-butir pengamalan Sila ke-${nomor} Pancasila sebagai dasar negara Indonesia.`,
        url: `/sila/${nomor}`,
      })
    );
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
    updateMetaTags({
      title: `Pasal ${nomor} UUD 1945 — Isi Lengkap`,
      description: `Baca isi lengkap Pasal ${nomor} Undang-Undang Dasar 1945. Teks otentik pasca amandemen.`,
      path: `/pasal/${nomor}`,
      ogType: 'article',
    });
    injectJsonLd([
      createArticleSchema({
        headline: `Pasal ${nomor} Undang-Undang Dasar 1945`,
        description: `Isi lengkap Pasal ${nomor} UUD 1945 pasca-amandemen.`,
        url: `/pasal/${nomor}`,
      }),
      createBreadcrumbSchema([
        { name: 'Beranda', path: '/' },
        { name: 'Pasal UUD 1945', path: '/pasal' },
        { name: `Pasal ${nomor}`, path: `/pasal/${nomor}` },
      ]),
    ]);
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
    updateMetaTags({
      title: `Bab ${nomor} UUD 1945 — Daftar Pasal`,
      description: `Daftar pasal dalam Bab ${nomor} UUD 1945. Baca isi setiap pasal secara lengkap.`,
      path: `/bab-pasal/${nomor}`,
    });
    injectJsonLd(
      createWebPageSchema({
        name: `Bab ${nomor} UUD 1945 — Daftar Pasal`,
        description: `Daftar pasal dalam Bab ${nomor} UUD 1945. Baca isi setiap pasal secara lengkap.`,
        url: `/bab-pasal/${nomor}`,
      })
    );
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
    updateMetaTags({
      title: `Amandemen Pasal ${nomor} UUD 1945 — Perbandingan Teks`,
      description: `Perbandingan teks Pasal ${nomor} UUD 1945 antara versi asli dan pasca-amandemen I–IV (1999–2002).`,
      path: `/amandemen/${nomor}`,
      ogType: 'article',
    });
    injectJsonLd(
      createWebPageSchema({
        name: `Amandemen Pasal ${nomor} UUD 1945 — Perbandingan Teks`,
        description: `Perbandingan teks Pasal ${nomor} UUD 1945 antara versi asli dan pasca-amandemen I–IV (1999–2002).`,
        url: `/amandemen/${nomor}`,
      })
    );
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
    removeJsonLd();
    const page = new NotFoundPage(contentEl, { router: deps.router });
    page.mount();
  });
}
