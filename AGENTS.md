# AGENTS.md — Aplikasi Pancasila dan UUD 1945

## Repository Overview
<!-- markdownlint-disable -->

Aplikasi web **Pancasila & UUD 1945** adalah Progressive Web App (PWA) statis berbasis
Vanilla JavaScript + Vite + Bootstrap 5 yang memigrasi konten dari aplikasi Android (v4.0.0)
ke web. Seluruh data bersumber dari 7 file JSON statis — tidak ada backend API atau database.

### Struktur Direktori Proyek

```text
pasaluud1945web/
├── index.html                    # HTML entry point
├── vite.config.js                # Konfigurasi Vite bundler
├── tsconfig.json                 # TypeScript (type-check only, tidak transpile)
├── package.json
├── src/                          # Source code aplikasi (dibuat di Phase 1)
│   ├── main.js                   # Entry point — init router, mount layout
│   ├── types/
│   │   └── data.ts               # TypeScript interfaces untuk 7 schema JSON
│   ├── data/
│   │   ├── loader.js             # Fungsi async loader + in-memory cache
│   │   └── fixture/              # Salinan JSON immutable untuk testing
│   ├── router/
│   │   ├── router.js             # Router class (history.pushState, popstate)
│   │   └── routes.js             # Definisi 14 route dengan handler mapping
│   ├── components/               # UI components reusable
│   │   ├── AppHeader.js          # Navbar (Bootstrap), judul, ikon search/share
│   │   ├── BottomNavigation.js   # Bottom nav bar — mobile only (d-md-none)
│   │   ├── AppLayout.js          # Layout container (sidebar desktop, full mobile)
│   │   └── PageContainer.js      # Wrapper konten dengan padding standar
│   ├── pages/                    # Page handlers — satu file per route
│   │   ├── HomePage.js           # /
│   │   ├── PancasilaPage.js      # /pancasila
│   │   ├── SilaDetailPage.js     # /sila/:nomor
│   │   ├── ButirPancasilaPage.js # /butir-pancasila
│   │   ├── PembukaanPage.js      # /pembukaan
│   │   ├── PasalListPage.js      # /pasal
│   │   ├── PasalDetailPage.js    # /pasal/:nomor
│   │   ├── BabPasalListPage.js   # /bab-pasal
│   │   ├── BabPasalDetailPage.js # /bab-pasal/:nomor
│   │   ├── UUDAsliPage.js        # /uud-asli
│   │   ├── AmandemenPage.js      # /amandemen
│   │   ├── AmandemenDetailPage.js# /amandemen/:nomor (perbandingan side-by-side)
│   │   ├── CariPage.js           # /cari?q=...
│   │   ├── TentangPage.js        # /tentang
│   │   └── NotFoundPage.js       # 404 fallback
│   ├── utils/
│   │   └── share.js              # Web Share API + Clipboard API fallback
│   └── assets/
│       ├── _variables.scss       # Bootstrap overrides dan design tokens
│       └── main.scss             # Main stylesheet (import Bootstrap + tokens)
├── public/
│   └── data/                     # 7 file JSON data (migrasi dari Android assets)
├── test/
│   ├── unit/                     # Unit tests (Vitest) — fungsi utilitas, router
│   ├── component/                # Component tests (Vitest browser mode) — DOM
│   └── e2e/                      # End-to-end tests (Playwright)
├── assets/                       # File JSON sumber (Android origin, pre-migration)
├── spec/                         # 5 dokumen spesifikasi teknis
├── plan/                         # 5 dokumen implementation plan (4 fase)
└── docs/                         # PRD, project brief, dan mockup HTML
    ├── mockup_desktop_web/       # 12 mockup desktop (HTML)
    └── mockup_mobile_web/        # 9 mockup mobile (HTML)
```

### Arsitektur: Clean Architecture (Vanilla JS)

```text
Presentation   src/components/ + src/pages/
               ↑ Render UI, event binding, delegasi ke layer bawah
Application    src/router/
               ↑ Orkestrasi navigasi dan alur antar halaman
Domain         src/types/
               ↑ Kontrak data (TypeScript interfaces), aturan bisnis
Infrastructure src/data/
               ↑ Data loading, caching, fixtures — tidak ada import ke Presentation
```

**Pattern**: ES6 Module pattern — setiap komponen/halaman adalah ES6 module (class atau
factory function). Constructor injection manual tanpa dependency injection container.
Tidak ada framework JS (React/Vue/Angular) — pure Vanilla JavaScript.

### Routing (14 Routes)

| Route               | Konten                                        |
| ------------------- | --------------------------------------------- |
| `/`                 | Landing page — navigasi ke 7 konten utama     |
| `/pancasila`        | Daftar 5 Sila Pancasila                       |
| `/sila/:nomor`      | Detail dan butir-butir sila (1–5)             |
| `/butir-pancasila`  | Semua sila dengan butir expand/collapse       |
| `/pembukaan`        | 4 Alinea Pembukaan UUD 1945                   |
| `/pasal`            | Daftar semua Pasal UUD 1945 pasca-amandemen   |
| `/pasal/:nomor`     | Detail isi pasal tertentu                     |
| `/bab-pasal`        | Navigasi 21 Bab UUD 1945                      |
| `/bab-pasal/:nomor` | Navigasi langsung ke bab tertentu             |
| `/uud-asli`         | Pasal UUD 1945 versi asli sebelum amandemen   |
| `/amandemen`        | Daftar pasal dengan keterangan amandemen I–IV |
| `/amandemen/:nomor` | Perbandingan side-by-side asli vs amandemen   |
| `/cari`             | Pencarian real-time (Fuse.js, debounce 300ms) |
| `/tentang`          | Informasi tentang aplikasi                    |

### Data Files (`public/data/`)

| File                            | Konten                                         |
| ------------------------------- | ---------------------------------------------- |
| `silapancasila.json`            | 5 Sila Pancasila (teks lengkap)                |
| `butir_pancasila.json`          | Butir-butir pengamalan Pancasila per sila      |
| `pembukaanuud.json`             | 4 Alinea Pembukaan UUD 1945                    |
| `pasaluud45.json`               | Pasal 1–37 UUD 1945 pasca-amandemen            |
| `pasaluud45noamandemen.json`    | Pasal UUD 1945 versi asli (sebelum amandemen)  |
| `pasaluud45_ket_amandemen.json` | Keterangan amandemen (I–IV) per pasal          |
| `babpasal.json`                 | Navigasi 21 Bab UUD 1945 beserta pasal per bab |

### Tech Stack

| Kategori          | Teknologi                                         |
| ----------------- | ------------------------------------------------- |
| **Bundler**       | Vite 7.3.2                                        |
| **Language**      | Vanilla JavaScript ES6+ (TypeScript type-check)   |
| **CSS Framework** | Bootstrap 5.3.3 + Bootstrap Icons 1.11.3          |
| **Search**        | Fuse.js (fuzzy search client-side)                |
| **PWA**           | vite-plugin-pwa (Workbox — auto Service Worker)   |
| **Testing**       | Vitest 3.2.4 (unit/component) + Playwright (E2E)  |
| **Hosting**       | GitHub Pages (manual deploy ke branch `gh-pages`) |
| **Runtime**       | Node.js 24.14.1 (build only)                      |

### Implementation Status

| Fase    | Dokumen                                      | Status        | Tanggal Selesai |
| ------- | -------------------------------------------- | ------------- | --------------- |
| Phase 1 | `plan/feature-phase1-fondasi-setup-1.md`     | ✅ Completed   | 2026-05-02      |
| Phase 2 | `plan/feature-phase2-konten-pencarian-1.md`  | ✅ Completed   | 2026-05-04      |
| Phase 3 | `plan/feature-phase3-pwa-sharing-seo-1.md`   | ⏳ Not Started | —               |
| Phase 4 | `plan/feature-phase4-launch-monitoring-1.md` | ⏳ Not Started | —               |

**Phase 1 Test Results (2026-05-02):**

- Unit/Component tests: 149 passed — coverage 98.87% lines, 97.82% functions, 91.6% branches
- E2E tests: 116 passed (Chromium + Firefox)
- CI pipeline: semua jobs hijau ✅

**Phase 2 Test Results (2026-05-04):**

- Unit/Component tests: 309 passed
- E2E tests: 354 passed (Chromium + Firefox)
- Verifikasi pipeline lokal (`lint`, `type-check`, `test`, `test:e2e`, `build`): semua lulus ✅

**Phase 3 — Fokus berikutnya:**

1. Eksekusi `plan/feature-phase3-pwa-sharing-seo-1.md`
2. Prioritaskan task fondasi PWA/service worker terlebih dahulu
3. Lanjutkan ke fitur sharing dan SEO sesuai urutan planning

### Local Workflow

```bash
npm install            # Install dependencies
npm run dev            # Dev server (http://localhost:5173)
npm run build          # Build produksi ke dist/
npm run preview        # Preview build lokal (http://localhost:4173)
npm run test           # Unit + component tests (Vitest)
npm run test:e2e       # E2E tests (Playwright)
npm run lint           # ESLint check
npm run type-check     # TypeScript tsc --noEmit
```

---

## Coding Standards

Standar ini **wajib** diikuti oleh semua developer dan AI agent yang berkontribusi pada proyek ini.
Tujuannya adalah memastikan setiap kode yang dihasilkan bersifat maintainable, testable,
dan mengikuti prinsip **Clean Code & Clean Architecture** secara konsisten.

---

### CS-1. Aturan Dependensi Antar Layer (The Dependency Rule)

Ini adalah **aturan paling kritis** — pelanggaran terhadap aturan ini adalah bug arsitektur.

**Arah dependensi harus selalu ke dalam (inward):**

```text
src/pages/ + src/components/   ← Presentation (layer terluar)
         ↓ hanya boleh mengimpor ke bawah
src/data/loader.js             ← Infrastructure (data access)
         ↓ hanya boleh mengimpor ke bawah
src/types/data.ts              ← Domain Contracts (layer terdalam)

src/router/ dan src/utils/     ← Adapters (hanya boleh mengimpor src/types/)
```

**Tabel aturan impor per layer:**

| Layer          | Folder                          | Boleh Mengimpor                         | Dilarang Mengimpor                             |
| -------------- | ------------------------------- | --------------------------------------- | ---------------------------------------------- |
| Presentation   | `src/pages/`, `src/components/` | `src/data/`, `src/utils/`, `src/types/` | —                                              |
| Infrastructure | `src/data/`                     | `src/types/`                            | `src/pages/`, `src/components/`, `src/router/` |
| Adapter        | `src/utils/`                    | `src/types/`                            | `src/pages/`, `src/data/`                      |
| Router         | `src/router/`                   | `src/pages/`, `src/types/`              | `src/data/` secara langsung                    |

**Contoh konkret:**

```javascript
// ✅ BENAR — Presentation mengimpor Infrastructure
// src/pages/PasalPage.js
import { loadPasalUUD } from '../data/loader.js';

// ❌ DILARANG KERAS — Infrastructure mengimpor Presentation
// src/data/loader.js
import { PasalPage } from '../pages/PasalPage.js'; // melanggar Dependency Rule
```

---

### CS-2. Tanggung Jawab per Layer

#### Layer Infrastructure: `src/data/loader.js`

- **Satu-satunya** titik masuk untuk semua data JSON — tidak ada `fetch()` di tempat lain
- Bertanggung jawab atas: pemanggilan `fetch()`, caching in-memory, dan validasi respons HTTP
- **Tidak boleh** berisi logika UI, formatting teks, atau kondisi rendering apa pun

```javascript
// ✅ BENAR — loader hanya fetch, cache, dan validasi respons HTTP
const _cache = {};

export async function loadPasalUUD() {
  if (_cache.pasalUUD) return _cache.pasalUUD;

  const response = await fetch('/data/pasaluud45.json');
  if (!response.ok) {
    throw new Error(`Gagal memuat data pasal: HTTP ${response.status}`);
  }

  _cache.pasalUUD = (await response.json()).data;
  return _cache.pasalUUD;
}

// ❌ SALAH — loader tidak boleh memformat data untuk kebutuhan UI
export async function loadPasalForDropdown() {
  const data = await loadPasalUUD();
  return data.map(p => ({ label: `📄 ${p.namapasal}`, value: p })); // ❌ logika UI bocor ke Infrastructure
}
```

#### Layer Presentation: `src/pages/*.js`

- Satu file = satu route — page handler bertanggung jawab pada **satu halaman saja**
- Wajib memisahkan tiga tanggung jawab: **load data**, **render DOM**, **bind events**
- Tidak boleh memanggil `fetch()` secara langsung — selalu via `src/data/loader.js`
- Hanya memanipulasi DOM di dalam `containerElement` yang diterimanya

```javascript
// ✅ BENAR — page memisahkan load, render, bind secara eksplisit
export class PasalPage {
  constructor(containerEl, { pasalRepository }) {
    this.container = containerEl;
    this.pasalRepository = pasalRepository;
  }

  async mount() {
    const pasalList = await this._loadData();
    this._render(pasalList);
    this._bindEvents();
  }

  async _loadData() {
    return this.pasalRepository.loadPasalUUD();
  }

  _render(pasalList) {
    this.container.innerHTML = this._buildListHtml(pasalList);
  }

  _buildListHtml(pasalList) {
    return pasalList
      .map(pasal => `
        <a href="/pasal/${pasal.namapasal.replace('Pasal ', '')}"
           class="list-group-item list-group-item-action"
           data-pasal="${pasal.namapasal}">
          ${pasal.namapasal}
        </a>
      `)
      .join('');
  }

  _bindEvents() {
    this.container.addEventListener('click', (e) => {
      const item = e.target.closest('[data-pasal]');
      if (item) this._onPasalSelected(item.dataset.pasal);
    });
  }

  _onPasalSelected(nomorPasal) {
    window.history.pushState(null, '', `/pasal/${nomorPasal}`);
  }
}

// ❌ SALAH — fetch langsung, dan semua tanggung jawab dicampur dalam satu fungsi
export async function renderPasalPage(container) {
  const res = await fetch('/data/pasaluud45.json');          // ❌ fetch langsung di page
  const { data } = await res.json();
  container.innerHTML = data.map(p => `...`).join('');       // ❌ load + render campur
  container.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {})); // ❌ bind juga di sini
}
```

#### Layer Presentation: `src/components/*.js`

- **Murni presentational** — tidak ada pemanggilan data, tidak ada logika bisnis
- Menerima data sebagai parameter, tidak mengambilnya sendiri
- Satu komponen = satu tanggung jawab visual yang dapat digunakan ulang

```javascript
// ✅ BENAR — komponen murni presentational, data diterima sebagai parameter
export class PasalCard {
  /**
   * @param {{ namapasal: string, ringkasan: string }} pasalItem
   * @returns {string} HTML string
   */
  render({ namapasal, ringkasan }) {
    return `
      <div class="card mb-2">
        <div class="card-body">
          <h6 class="card-title">${namapasal}</h6>
          <p class="card-text text-muted small">${ringkasan}</p>
        </div>
      </div>
    `;
  }
}

// ❌ SALAH — komponen mengambil data sendiri
export class PasalCard {
  async render(nomorPasal) {
    const res = await fetch('/data/pasaluud45.json'); // ❌ komponen tidak boleh fetch
    const { data } = await res.json();
    return `<div>${data.find(p => p.namapasal === nomorPasal).namapasal}</div>`;
  }
}
```

#### Adapter: `src/utils/share.js`

- Bertindak sebagai **Adapter** untuk Web Share API dan Clipboard API
- Mengisolasi detail platform — pages tidak tahu implementasi share yang digunakan
- Tidak boleh mengandung logika bisnis, kondisi routing, atau manipulasi DOM halaman

---

### CS-3. Dependency Injection via Constructor

Setiap Page menerima dependensinya melalui constructor, tidak menciptakan atau mengimpor
langsung di dalam method. Pola ini memastikan setiap Page dapat diuji secara isolated
tanpa side effects dari `fetch()` nyata.

```javascript
// ✅ BENAR — dependensi diinjeksi melalui constructor
export class SilaDetailPage {
  constructor(containerEl, { silaRepository, router }) {
    this.container = containerEl;
    this.silaRepository = silaRepository; // bisa diganti mock saat testing
    this.router = router;
  }
}

// Di src/main.js — komposisi dependensi HANYA terjadi di entry point
import { loadSilaPancasila, loadButirPancasila } from './data/loader.js';
import { SilaDetailPage } from './pages/SilaDetailPage.js';

const silaRepository = { loadSilaPancasila, loadButirPancasila };
const page = new SilaDetailPage(document.getElementById('app'), { silaRepository, router });

// Saat unit testing — injeksi mock, tidak ada fetch nyata
const mockRepository = {
  loadSilaPancasila: async () => silaFixture.data,
  loadButirPancasila: async () => butirFixture.data,
};
const page = new SilaDetailPage(container, { silaRepository: mockRepository, router: mockRouter });
```

---

### CS-4. Naming Conventions (Intent-Revealing Names)

Nama harus menjawab: _"mengapa ada, apa yang dilakukan, dan bagaimana digunakan."_

```javascript
// ✅ BENAR — nama mengungkap niat secara eksplisit
const pasalMengandungKedaulatan = filterPasalByKeyword(pasalList, 'kedaulatan');
async function loadPasalUUDPascaAmandemen() { /* ... */ }
function buildPasalCardHtml(pasal) { /* ... */ }
function handleSearchInputChange(event) { /* ... */ }
function isPasalDiamandemen(pasal) { return pasal.amandemen !== '0'; }

// ❌ SALAH — samar, tidak informatif, tidak mengungkap niat
const result = filter(list, q);
async function getData() { /* ... */ }
function build(p) { /* ... */ }
function handle(e) { /* ... */ }
function check(pasal) { /* ... */ }
```

**Konvensi penamaan per jenis:**

| Jenis                | Konvensi                              | Contoh                                            |
| -------------------- | ------------------------------------- | ------------------------------------------------- |
| Fungsi data loader   | `load[DomainObject]`                  | `loadPasalUUD`, `loadSilaPancasila`               |
| Fungsi render HTML   | `build[Subject]Html`                  | `buildPasalCardHtml`, `buildSilaListHtml`         |
| Fungsi render ke DOM | `render[Subject]`                     | `renderErrorState`, `renderEmptyState`            |
| Fungsi event handler | `handle[Subject][Action]`             | `handleSearchInputChange`, `handlePasalCardClick` |
| Fungsi filter/query  | `find[Object]By[Criteria]`            | `findPasalByNomor`, `filterSilaByAmandemen`       |
| Fungsi boolean       | `is[Condition]` atau `has[Condition]` | `isPasalDiamandemen`, `hasSearchResults`          |
| Konstanta global     | `UPPER_SNAKE_CASE`                    | `DEBOUNCE_DELAY_MS`, `MAX_SEARCH_RESULTS`         |
| Class                | `PascalCase` + domain noun            | `PasalDetailPage`, `ButirPancasilaAccordion`      |

---

### CS-5. Desain Fungsi (Single Responsibility per Function)

- **Satu fungsi = satu tanggung jawab** — jika nama perlu kata "dan" (`loadAndRender`), pecah menjadi dua
- **Maksimal 2 parameter posisional** — jika lebih dari 2, gunakan satu object parameter
- **Tidak ada boolean flag** sebagai parameter — ekstrak menjadi dua fungsi terpisah yang namanya eksplisit
- **Command-Query Separation** — fungsi yang mengubah state tidak mengembalikan nilai;
  fungsi yang mengembalikan nilai tidak mengubah state

```javascript
// ✅ BENAR — parameter object jika > 2 argumen
function renderSearchResults({ results, query, containerEl }) {
  if (!hasSearchResults(results)) {
    renderEmptyState({ query, containerEl });
    return;
  }
  containerEl.innerHTML = buildResultListHtml(results, query);
}

// ✅ BENAR — Command-Query Separation
function setCurrentRoute(path) { routerState.currentPath = path; } // command: tidak return nilai
function getCurrentRoute() { return routerState.currentPath; }      // query: tidak ubah state

// ❌ SALAH — terlalu banyak tanggung jawab dan boolean flag
function renderPasal(container, pasal, isDetail, showAmandemen) { /* ... */ } // ❌ 4 param + boolean flag
function loadAndRenderPasalList(container) { /* ... */ }                       // ❌ dua tanggung jawab
```

---

### CS-6. Error Handling

Lempar `Error` dari Infrastructure, tangkap di Presentation, tampilkan error state ke user.
Jangan pernah menelan error dengan silent catch atau mengembalikan `null`.

```javascript
// ✅ BENAR — error dilempar dari loader, ditangkap dan ditampilkan di page

// src/data/loader.js
export async function loadBabPasal() {
  const response = await fetch('/data/babpasal.json');
  if (!response.ok) {
    throw new Error(`Gagal memuat data bab: HTTP ${response.status}`);
  }
  return (await response.json()).isi_bab_pasal;
}

// src/pages/BabPasalPage.js
async mount() {
  try {
    const babList = await this.babRepository.loadBabPasal();
    this._render(babList);
  } catch (error) {
    this._renderErrorState('Konten tidak dapat dimuat. Silakan muat ulang halaman.');
  }
}

_renderErrorState(message) {
  this.container.innerHTML = `
    <div class="alert alert-danger" role="alert" data-error>
      <i class="bi bi-exclamation-triangle me-2"></i>${message}
      <button class="btn btn-sm btn-outline-danger ms-3"
              onclick="location.reload()">Muat Ulang</button>
    </div>
  `;
}

// ❌ SALAH — error ditelan, caller tidak tahu apakah gagal atau data memang kosong
export async function loadBabPasal() {
  try {
    return await fetch('/data/babpasal.json').then(r => r.json());
  } catch (e) {
    return null; // ❌ null menyembunyikan kegagalan, menyulitkan debugging
  }
}
```

---

### CS-7. Type Safety — Tidak Ada Raw Object Tanpa Kontrak

Semua data yang mengalir antar fungsi harus conform ke TypeScript interfaces di `src/types/data.ts`.
Gunakan JSDoc `@param` dengan type import untuk type checking tanpa transpile.

```javascript
// ✅ BENAR — JSDoc terhubung ke TypeScript interfaces di src/types/data.ts
/**
 * @param {import('../types/data').PasalUUDItem} pasal
 * @returns {string}
 */
function buildPasalCardHtml(pasal) {
  return `
    <div class="list-group-item" data-pasal="${pasal.namapasal}">
      <strong>${pasal.namapasal}</strong>
    </div>
  `;
}

// ❌ SALAH — raw object tanpa kontrak, typo tidak terdeteksi oleh TypeScript
function buildPasalCardHtml(pasal) {
  return `<div>${pasal.nama}</div>`; // ❌ 'nama' tidak ada di schema, harusnya 'namapasal'
}
```

---

### CS-8. Testing Standards (F.I.R.S.T)

**Pola test unit untuk setiap Page** — tidak ada `fetch()` nyata, semua dependensi di-mock:

```javascript
// test/component/pages/PasalPage.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { PasalPage } from '../../../src/pages/PasalPage.js';
import pasalFixture from '../../../src/data/fixture/pasaluud45.json';

describe('PasalPage', () => {
  let container;
  let mockRepository;

  beforeEach(() => {
    container = document.createElement('div');
    mockRepository = {
      loadPasalUUD: async () => pasalFixture.data, // tidak ada fetch nyata
    };
  });

  it('merender semua pasal setelah mount', async () => {
    const page = new PasalPage(container, { pasalRepository: mockRepository });
    await page.mount();
    expect(container.querySelectorAll('[data-pasal]').length).toBe(pasalFixture.data.length);
  });

  it('menampilkan error state jika repository melempar error', async () => {
    mockRepository.loadPasalUUD = async () => { throw new Error('Network error'); };
    const page = new PasalPage(container, { pasalRepository: mockRepository });
    await page.mount();
    expect(container.querySelector('[data-error]')).not.toBeNull();
  });
});
```

**Prinsip F.I.R.S.T untuk semua test:**

| Prinsip             | Aturan Konkret                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------ |
| **Fast**            | Tidak ada `fetch()` nyata — gunakan fixture dan mock repository                            |
| **Independent**     | Setiap `it()` tidak bergantung pada state `it()` lain — gunakan `beforeEach` untuk reset   |
| **Repeatable**      | Hasil identik di environment manapun — mock tanggal/waktu dinamis jika diperlukan          |
| **Self-validating** | Setiap `it()` memiliki minimal satu `expect()` yang jelas — tidak ada test tanpa assertion |
| **Timely**          | Test ditulis bersamaan dengan kode implementasi, bukan setelah semua selesai               |

---

### CS-9. Larangan Absolut (Never Do)

Pelanggaran berikut **tidak dapat diterima** dan harus diperbaiki segera saat ditemukan:

| Larangan                                            | Alasan                                         | Alternatif Wajib                                                          |
| --------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------- |
| `fetch()` di `src/pages/` atau `src/components/`    | Melanggar Dependency Rule                      | Gunakan fungsi dari `src/data/loader.js`                                  |
| `document.querySelector()` di luar `this.container` | Melanggar isolasi komponen                     | Gunakan `this.container.querySelector()`                                  |
| `import` dari `src/pages/` di dalam `src/data/`     | Circular dependency, melanggar Dependency Rule | Redesign alur — data tidak perlu tahu tentang pages                       |
| Fungsi lebih dari 30 baris kode                     | Terlalu banyak tanggung jawab                  | Pecah menjadi fungsi-fungsi kecil yang terfokus                           |
| Magic number atau magic string tanpa named constant | Tidak maintainable, sulit diubah               | Ekstrak ke konstanta `UPPER_SNAKE_CASE` di atas file                      |
| `console.log()` di kode produksi                    | Debug artifact yang ter-commit ke repository   | Hapus sebelum commit; gunakan `console.error()` hanya untuk error genuine |
| `catch (e) { return null; }`                        | Menelan error, menyulitkan debugging dan UX    | Lempar ulang atau render error state yang informatif ke user              |
| Boolean flag sebagai parameter fungsi               | Melanggar Open-Closed Principle                | Ekstrak menjadi dua fungsi terpisah dengan nama yang eksplisit            |

---

## Komunikasi

- **Bahasa**: Komunikasi harus menggunakan bahasa Indonesia yang jelas dan baku
- **Gaya**: Formal namun tetap ramah dan profesional
- **Format**: Gunakan struktur yang rapi dengan bullet points dan code blocks sesuai kebutuhan

## Penjelasan dan Dokumentasi

- **Kejelasan**: Penjelasan harus jelas, terstruktur, dan mudah dipahami
- **Struktur**: Gunakan format bertingkat dengan heading, subheading, dan poin-poin yang logis
- **Dokumentasi**: Semua dokumentasi yang dibuat harus jelas, komprehensif, dan mudah dimengerti
- **Detail**: Berikan konteks yang cukup tanpa terlalu bertele-tele
- **Contoh**: Sertakan contoh praktis jika diperlukan untuk memperjelas konsep

## Gaya Komunikasi User

- Menggunakan bahasa Indonesia formal tapi santai
- Suka detail teknis dan penjelasan komprehensif
- Meminta dokumentasi yang lengkap dan terstruktur
- Memperhatikan kualitas kode dan testing standards

## Workflow & Metodologi

- **SDLC Strict Adherence**: User mengikuti alur SDLC yang ketat dan terstruktur
- **Sequential Development**: Harus mengikuti urutan: PRD → Spec → Plan → Code
- **No Skip Phases**: Tidak boleh melompat fase, setiap tahap harus selesai sebelum lanjut
- **Documentation First**: Dokumentasi lengkap dan terstruktur harus ada sebelum mulai coding
- **Custom Agents Usage**: User menggunakan custom GitHub Copilot Agents sesuai dengan fase development:
  - `@ProductManagerPRD` untuk Requirements (PRD)
  - `@SpecificationArchitect` untuk Technical Specification
  - `@PlannerArchitect` untuk Implementation Planning
  - `@BeastModeDev`, `@GodModeDev`, atau `@MiniBeast` untuk Coding/Implementation
  - `@QATestArchitect` untuk Testing
  - `@DocumentationWriter` untuk User Documentation
  - `@CodeReviewSpecialist` untuk Code Review

- **New Session per Phase**: User prefer memulai sesi chat baru saat berpindah fase untuk menjaga fokus konteks
- **Verification Mindset**: Setiap output harus diverifikasi terhadap PRD dan Spec sebelum lanjut
- **Phase Completion Pattern**: Setelah fase selesai, user meminta pemisahan planning untuk fase berikutnya ke dokumen terpisah untuk review tim

## Format Markdown

- **Markdown Lint**: Semua file markdown harus mengikuti aturan markdown lint
- **Konsistensi**: Pastikan format heading, list, dan struktur konsisten
- **Standar**: Ikuti best practices markdown untuk readability dan maintainability
- **Validasi**: Pastikan markdown yang dibuat lolos validasi lint checker
- **Elemen**: Gunakan elemen markdown seperti heading, subheading, bullet points, code blocks sesuai kebutuhan
- **Pemformatan**: Gunakan pemformatan teks seperti bold, italic, dan inline code untuk menekankan poin penting
- **Tabel**: Gunakan tabel untuk menyajikan data terstruktur jika diperlukan
- **Blok Kode**: Gunakan blok kode untuk menyajikan contoh kode dengan penyorotan sintaks yang sesuai
