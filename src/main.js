/**
 * @file src/main.js
 * @description Entry point aplikasi Pancasila & UUD 1945.
 *
 * Tanggung jawab file ini (Composition Root):
 *   1. Import global stylesheet (design system + Bootstrap + Bootstrap Icons)
 *   2. Bangun struktur shell HTML aplikasi (header, layout, bottom nav)
 *   3. Inisialisasi Router
 *   4. Mount semua komponen layout dengan constructor injection
 *   5. Pasang onNavigate callbacks untuk sinkronisasi active state
 *   6. Daftarkan 14 routes
 *   7. Start router (popstate, link interception, dispatch route awal)
 *
 * Referensi:
 *   - planning TASK-041
 *   - AGENTS.md CS-3: "komposisi dependensi HANYA terjadi di entry point"
 */

// =============================================================================
// 1. Global Stylesheet (wajib di-import sebelum komponen JS agar CSS tersedia)
// =============================================================================
import './assets/main.scss';

// =============================================================================
// 2. Import Komponen & Router
// =============================================================================
import { AppHeader } from './components/AppHeader.js';
import { BottomNavigation } from './components/BottomNavigation.js';
import { AppLayout } from './components/AppLayout.js';
import { PageContainer } from './components/PageContainer.js';
import { loadButirPancasila, loadPembukaanUUD, loadSilaPancasila } from './data/loader.js';
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

// 6e. Repository abstractions untuk page handlers Phase 1.6
const silaRepository = { loadSilaPancasila };
const butirRepository = { loadButirPancasila };
const pembukaanRepository = { loadPembukaanUUD };

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
  butirRepository,
  contentEl: pageContainer.getContentElement(),
  pembukaanRepository,
  silaRepository,
  sidebarEl: appLayout.getSidebarSlot(),
  router,
});

// =============================================================================
// 9. Start Router
// Dipanggil TERAKHIR — setelah semua route dan callbacks terdaftar.
// Akan: bind popstate, bind link interception, dispatch route awal.
// =============================================================================
router.init();
