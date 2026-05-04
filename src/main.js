/**
 * @file src/main.js
 * @description Entry point aplikasi Pancasila & UUD 1945.
 *
 * Tanggung jawab file ini (Composition Root):
 *   1. Import global stylesheet (design system + Bootstrap + Bootstrap Icons)
 *   2. Registrasi Service Worker via virtual:pwa-register (Phase 3.1)
 *   3. Bangun struktur shell HTML aplikasi (header, layout, bottom nav)
 *   4. Inisialisasi Router
 *   5. Mount semua komponen layout dengan constructor injection
 *   6. Mount OfflineIndicator sebagai komponen global (Phase 3.1)
 *   7. Pasang onNavigate callbacks untuk sinkronisasi active state
 *   8. Daftarkan 14 routes
 *   9. Start router (popstate, link interception, dispatch route awal)
 *
 * Referensi:
 *   - planning TASK-041
 *   - planning TASK-006 (Phase 3.1 — SW registration)
 *   - AGENTS.md CS-3: "komposisi dependensi HANYA terjadi di entry point"
 */

// =============================================================================
// 1. Global Stylesheet (wajib di-import sebelum komponen JS agar CSS tersedia)
// =============================================================================
import './assets/main.scss';

// =============================================================================
// 2. Service Worker Registration (Phase 3.1 — TASK-006)
// Menggunakan virtual:pwa-register dari vite-plugin-pwa.
// registerSW dipanggil di sini (bukan auto-injected) agar kita bisa
// mendaftarkan callback onNeedRefresh dan onOfflineReady.
// =============================================================================
import { registerSW } from 'virtual:pwa-register';

registerSW({
  onNeedRefresh() {
    // Versi baru SW tersedia — dengan registerType: 'autoUpdate',
    // halaman akan di-reload otomatis oleh Workbox. Tidak perlu prompt manual.
  },
  onOfflineReady() {
    // Aplikasi sudah di-cache dan siap digunakan offline.
  },
  onRegisteredSW(_swUrl) {
    // SW berhasil terdaftar.
  },
  onRegisterError(error) {
    console.error('[PWA] Gagal mendaftarkan Service Worker:', error);
  },
});

// =============================================================================
// 3. Import Komponen & Router
// =============================================================================
import { AppHeader } from './components/AppHeader.js';
import { BottomNavigation } from './components/BottomNavigation.js';
import { AppLayout } from './components/AppLayout.js';
import { PageContainer } from './components/PageContainer.js';
import { OfflineIndicator } from './components/OfflineIndicator.js';
import {
  loadBabPasal,
  loadButirPancasila,
  loadPasalUUD,
  loadPasalUUDKetAmandemen,
  loadPasalUUDNoAmandemen,
  loadPembukaanUUD,
  loadSilaPancasila,
} from './data/loader.js';
import { Router } from './router/router.js';
import { registerRoutes } from './router/routes.js';

// =============================================================================
// 3. Root Element
// =============================================================================
const appEl = document.getElementById('app');

// =============================================================================
// 4. Inisialisasi Router (sebelum mount komponen agar router tersedia saat konstruksi)
// =============================================================================
const router = new Router();

// =============================================================================
// 5. Bangun App Shell Structure
//
// Struktur DOM yang dihasilkan di dalam #app:
//
//  #app
//   ├── #app-header        ← AppHeader (sticky, full-width)
//   ├── #app-layout        ← AppLayout (sidebar + main content + footer)
//   │    ├── .app-sidebar  ← sidebar slot (desktop only, diisi oleh page di Phase 1.6)
//   │    └── .app-main
//   │         ├── #main-slot → PageContainer → #page-content  ← konten halaman aktif
//   │         └── footer.app-footer
//   └── #app-bottom-nav    ← BottomNavigation (mobile only, fixed bottom)
// =============================================================================

// 5a. Header container — di luar layout karena header adalah sticky full-width
const headerContainerEl = document.createElement('div');
headerContainerEl.id = 'app-header';
appEl.appendChild(headerContainerEl);

// 5b. Layout container (sidebar + main + footer)
const layoutContainerEl = document.createElement('div');
layoutContainerEl.id = 'app-layout';
appEl.appendChild(layoutContainerEl);

// 5c. Bottom nav container — di luar layout karena fixed position
const bottomNavContainerEl = document.createElement('div');
bottomNavContainerEl.id = 'app-bottom-nav';
appEl.appendChild(bottomNavContainerEl);

// 5d. OfflineIndicator container — global, fixed position (Phase 3.1 TASK-010)
const offlineIndicatorContainerEl = document.createElement('div');
offlineIndicatorContainerEl.id = 'app-offline-indicator';
document.body.appendChild(offlineIndicatorContainerEl);

// =============================================================================
// 6. Mount Komponen
// =============================================================================

// 6a. AppHeader — sticky navbar merah (desktop: nav links; mobile: icon + title + search)
const appHeader = new AppHeader(headerContainerEl, { router });
appHeader.mount();

// 6b. AppLayout — layout container dua-kolom (sidebar desktop + main area)
const appLayout = new AppLayout(layoutContainerEl);
appLayout.mount();

// 6c. PageContainer — wrapper konten dengan padding standar (di dalam main slot)
const pageContainer = new PageContainer(appLayout.getMainSlot());
pageContainer.mount();

// 6d. BottomNavigation — 4-tab bottom nav, mobile only (d-none di md+)
const bottomNav = new BottomNavigation(bottomNavContainerEl, { router });
bottomNav.mount();

// 6e. OfflineIndicator — indikator status jaringan global (Phase 3.1 TASK-010)
const offlineIndicator = new OfflineIndicator(offlineIndicatorContainerEl);
offlineIndicator.mount();

// 6f. Repository abstractions untuk page handlers Phase 1.6
const silaRepository = { loadSilaPancasila };
const butirRepository = { loadButirPancasila };
const pembukaanRepository = { loadPembukaanUUD };
const pasalRepository = { loadPasalUUD };
const pasalKetAmandemenRepository = { loadPasalUUDKetAmandemen };
const babRepository = { loadBabPasal };
const uudAsliRepository = { loadPasalUUDNoAmandemen };

// =============================================================================
// 7. Sinkronisasi Active State via onNavigate
// Dipanggil oleh router._dispatch() setiap kali navigasi terjadi (termasuk awal).
// =============================================================================
router.onNavigate((path) => {
  appHeader.setActivePath(path);
  bottomNav.setActivePath(path);
});

// =============================================================================
// 8. Daftarkan Semua 14 Routes + 404 Fallback
// =============================================================================
registerRoutes(router, {
  babRepository,
  butirRepository,
  contentEl: pageContainer.getContentElement(),
  pasalKetAmandemenRepository,
  pasalRepository,
  pembukaanRepository,
  silaRepository,
  uudAsliRepository,
  sidebarEl: appLayout.getSidebarSlot(),
  router,
});

// =============================================================================
// 9. Start Router
// Dipanggil TERAKHIR — setelah semua route dan callbacks terdaftar.
// Akan: bind popstate, bind link interception, dispatch route awal.
// =============================================================================
router.init();
