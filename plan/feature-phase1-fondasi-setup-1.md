---
goal: Phase 1 — Fondasi & Setup Proyek Pancasila & UUD 1945 Web App
version: 1.0
date_created: 2026-04-28
last_updated: 2026-04-28
owner: Development Team
status: 'Planned'
tags:
  - feature
  - phase1
  - setup
  - foundation
  - pwa
  - implementation
---

<!-- markdownlint-disable -->

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

Phase 1 adalah fase fondasi proyek yang membangun seluruh infrastruktur teknis yang dibutuhkan
oleh Phase 2, 3, dan 4. Output Phase 1 adalah aplikasi yang sudah memiliki project scaffold
yang berjalan, CI/CD pipeline, design system, client-side router, landing page `/`, dan
4 halaman konten awal (Pancasila, Sila Detail, Butir Pancasila, Pembukaan UUD 1945).

**Prerequisite:** Semua 5 dokumen spec di `/spec/` sudah final dan disetujui. ✅

**Estimasi Durasi:** 1–2 minggu

**PRD Features yang dicakup:** F-01, F-02, F-03, F-10 (parsial), F-14 (parsial)

---

## 1. Requirements & Constraints

- **REQ-001**: Project Vite 5.0+ harus berhasil di-build dan di-serve secara lokal sebelum lanjut
- **REQ-002**: Bootstrap 5.3+ harus dikustomisasi dengan design tokens dari `spec-design-uiux`
- **REQ-003**: Semua 7 file JSON harus tersedia di `/public/data/` dan dapat di-load oleh app
- **REQ-004**: Client-side router harus menangani semua 14 route dari `spec-architecture §4.2`
- **REQ-005**: Layout responsif (mobile, tablet, desktop) harus berfungsi sejak awal
- **REQ-006**: CI pipeline (lint → type-check → test → build → lighthouse-ci) harus pass di setiap PR
- **SEC-001**: HTTPS wajib aktif di deployment preview (Vercel/Netlify auto-provide)
- **SEC-002**: Content Security Policy header dikonfigurasi dari awal
- **CON-001**: Stack wajib: Vanilla JavaScript ES6+, Vite 5.0+, Bootstrap 5.3+, Node.js 20 LTS
- **CON-002**: Tidak ada framework JS (React/Vue/Angular) — pure Vanilla JS module pattern
- **CON-003**: Tidak ada backend API — semua data dari 7 JSON statis
- **GUD-001**: Setiap perubahan melalui Pull Request dengan nama branch `feature/phase1-[deskripsi]`
- **GUD-002**: Commit mengikuti Conventional Commits: `feat(scope): description`
- **GUD-003**: TypeScript digunakan minimal untuk type interfaces dan `tsc --noEmit` check
- **PAT-001**: Module pattern: setiap komponen/halaman adalah ES6 module yang di-import
- **PAT-002**: Komponen UI adalah class atau factory function yang menerima container element

---

## 2. Implementation Steps

### Implementation Phase 1.1 — Project Scaffold & Tooling

- GOAL-001: Menyiapkan project scaffold Vite, semua dependencies, tooling (ESLint, Prettier,
  TypeScript, Vitest, Playwright), dan GitHub repository dengan branch protection.

| Task     | Description                                                                                                                       | Completed | Date |
| -------- | --------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-001 | Initialize Vite project: `npm create vite@latest pasaluud1945web -- --template vanilla`                                           |           |      |
| TASK-002 | Install dependencies produksi: `bootstrap@5.3`, `bootstrap-icons`, `fuse.js`                                                      |           |      |
| TASK-003 | Install devDependencies: `typescript`, `vitest`, `@vitest/browser`, `playwright`, `eslint`, `prettier`, `sass`, `vite-plugin-pwa` |           |      |
| TASK-004 | Konfigurasi `tsconfig.json` dengan strict mode (untuk type checking, bukan transpile)                                             |           |      |
| TASK-005 | Konfigurasi ESLint (`eslint.config.js`) dengan rules: `no-unused-vars`, `no-console`, `prefer-const`                              |           |      |
| TASK-006 | Konfigurasi Prettier (`.prettierrc`) dengan `singleQuote: true`, `semi: true`, `tabWidth: 2`                                      |           |      |
| TASK-007 | Konfigurasi Vitest (`vitest.config.js`) dengan coverage provider `v8`, threshold 80%                                              |           |      |
| TASK-008 | Konfigurasi Playwright (`playwright.config.js`) dengan browsers: Chromium, Firefox, WebKit                                        |           |      |
| TASK-009 | Konfigurasi `vite.config.js`: base path, output dir `dist/`, SASS preprocessor                                                    |           |      |
| TASK-010 | Buat `package.json` scripts: `dev`, `build`, `preview`, `test`, `test:e2e`, `lint`, `type-check`                                  |           |      |
| TASK-011 | Inisialisasi GitHub repository + branch `main` + branch protection rule (require PR + CI pass)                                    |           |      |
| TASK-012 | Konfigurasi `.gitignore`: `node_modules/`, `dist/`, `.env*`, `coverage/`                                                          |           |      |

### Implementation Phase 1.2 — CI/CD Pipeline & Hosting

- GOAL-002: Menyiapkan GitHub Actions CI pipeline otomatis dan konfigurasi deployment ke
  Vercel atau Netlify dengan SPA fallback yang benar.

| Task     | Description                                                                                                               | Completed | Date |
| -------- | ------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-013 | Buat `.github/workflows/ci.yml` dengan jobs: `lint`, `type-check`, `unit-test`, `build`                                   |           |      |
| TASK-014 | Konfigurasi Lighthouse CI: `lighthouserc.json` dengan URL `http://localhost:4173`, thresholds P≥90, A≥90, SEO≥95, PWA≥80  |           |      |
| TASK-015 | Tambahkan job `lighthouse-ci` ke CI pipeline (berjalan setelah `build`)                                                   |           |      |
| TASK-016 | Konfigurasi Vercel: `vercel.json` dengan `rewrites: [{ source: "/(.*)", destination: "/index.html" }]` untuk SPA fallback |           |      |
| TASK-017 | Alternatif Netlify: buat `public/_redirects` dengan konten `/* /index.html 200`                                           |           |      |
| TASK-018 | Setup GitHub Secrets: `VERCEL_TOKEN` (atau `NETLIFY_AUTH_TOKEN`), `GA_MEASUREMENT_ID`                                     |           |      |
| TASK-019 | Verifikasi CI pipeline pass pada initial commit (kosong)                                                                  |           |      |

### Implementation Phase 1.3 — Migrasi Data & Data Layer

- GOAL-003: Memindahkan 7 file JSON dari Android assets ke `/public/data/`, membuat
  TypeScript interfaces untuk semua schema, dan data loader functions.

| Task     | Description                                                                                                                                                                                                                                  | Completed | Date |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-020 | Copy 7 file JSON ke `public/data/`: `silapancasila.json`, `butir_pancasila.json`, `pembukaanuud.json`, `pasaluud45.json`, `pasaluud45noamandemen.json`, `pasaluud45_ket_amandemen.json`, `babpasal.json`                                     |           |      |
| TASK-021 | Format ulang dan validasi JSON (pastikan valid JSON, tidak ada trailing commas)                                                                                                                                                              |           |      |
| TASK-022 | Buat `src/types/data.ts` dengan semua TypeScript interfaces dari `spec-data-schema §4`: `SilaPancasilaData`, `ButirPancasilaData`, `PembukaanUUDData`, `PasalUUDData`, `PasalUUDNoAmandemenData`, `PasalUUDKetAmandemenData`, `BabPasalData` |           |      |
| TASK-023 | Buat `src/data/loader.js` dengan fungsi async: `loadSilaPancasila()`, `loadButirPancasila()`, `loadPembukaanUUD()`, `loadPasalUUD()`, `loadPasalUUDNoAmandemen()`, `loadPasalUUDKetAmandemen()`, `loadBabPasal()`                            |           |      |
| TASK-024 | Implementasi caching in-memory di data loader (fetch sekali, simpan di module-level cache)                                                                                                                                                   |           |      |
| TASK-025 | Buat `src/data/fixture/` dengan copy JSON untuk testing (immutable test fixtures)                                                                                                                                                            |           |      |
| TASK-026 | Validasi semua 7 JSON dapat di-load dan data-nya sesuai TypeScript interfaces                                                                                                                                                                |           |      |

### Implementation Phase 1.4 — Design System & Base Layout

- GOAL-004: Mengimplementasikan design tokens dari `spec-design-uiux §4.1`, mengkustomisasi
  Bootstrap 5, dan membangun base layout (Header, **Bottom Navigation** (mobile), Sidebar (desktop), konten area responsif).

| Task     | Description                                                                                                                                                                                                                                                                                                                                                                                        | Completed | Date |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-027 | Buat `src/assets/_variables.scss` dengan semua Bootstrap overrides: `$primary: #C62828`, `$success: #53d397`, `$warning: #FFB300`, `$danger: #E64A19`, `$secondary: #5d5d5d`                                                                                                                                                                                                                       |           |      |
| TASK-028 | Buat `src/assets/main.scss`: import `_variables.scss`, import `bootstrap/scss/bootstrap`, tambah CSS custom properties (`:root { --color-primary: #C62828; ... }`)                                                                                                                                                                                                                                 |           |      |
| TASK-029 | Buat `index.html` dengan struktur dasar: `<html lang="id">`, meta charset, viewport, favicon placeholder, link ke manifest (placeholder), mount point `<div id="app">`                                                                                                                                                                                                                             |           |      |
| TASK-030 | Buat `src/components/AppHeader.js` — Bootstrap Navbar: background `#C62828`, judul app, tombol menu (mobile), ikon search dan share                                                                                                                                                                                                                                                                |           |      |
| TASK-031 | Buat `src/components/BottomNavigation.js` — Bootstrap Bottom Navigation Bar untuk **mobile only** (`d-md-none`): 4 tab (Beranda, Pasal, Amandemen, Tentang), fixed bottom, background putih, shadow atas. Tab aktif: icon & label `#C62828`, background `#FFEBEE`. Tab tidak aktif: `#989898`. Icon Bootstrap Icons: `bi-house-fill`, `bi-journal-text`, `bi-clock-history`, `bi-info-circle-fill` |           |      |
| TASK-032 | Buat `src/components/AppLayout.js` — layout container responsif: full-width mobile, sidebar fixed desktop (280px), main content area                                                                                                                                                                                                                                                               |           |      |
| TASK-033 | Buat `src/components/PageContainer.js` — wrapper untuk konten halaman dengan padding standar 16px                                                                                                                                                                                                                                                                                                  |           |      |
| TASK-034 | Verifikasi layout di 3 breakpoint: mobile 375px, tablet 768px, desktop 1024px                                                                                                                                                                                                                                                                                                                      |           |      |

### Implementation Phase 1.5 — Client-Side Router

- GOAL-005: Mengimplementasikan client-side router berbasis `history.pushState` yang
  menangani semua 14 route, parameter dinamis, dan 404 fallback.

| Task     | Description                                                                                                                          | Completed | Date |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------- | ---- |
| TASK-035 | Buat `src/router/router.js` — Router class dengan `navigate(path)`, `back()`, `addRoute(pattern, handler)`                           |           |      |
| TASK-036 | Implementasi `popstate` event listener untuk browser back/forward button                                                             |           |      |
| TASK-037 | Implementasi route matching dengan parameter dinamis: `/pasal/:nomor`, `/sila/:nomor`, `/bab-pasal/:nomor` menggunakan regex parsing |           |      |
| TASK-038 | Daftarkan semua 14 route dari `spec-architecture §4.2` di `src/router/routes.js`                                                     |           |      |
| TASK-039 | Implementasi link interception — klik `<a href="...">` yang intra-app tidak reload halaman                                           |           |      |
| TASK-040 | Implementasi halaman 404 placeholder (akan dikembangkan di Phase 2)                                                                  |           |      |
| TASK-041 | Buat `src/main.js` sebagai entry point: init router, mount AppHeader, BottomNavigation, render halaman awal                          |           |      |

### Implementation Phase 1.6 — Landing Page & Halaman Konten Phase 1

- GOAL-006: Mengimplementasikan landing page `/` dan 4 halaman konten awal yang dapat
  dikunjungi via URL langsung: Pancasila (`/pancasila`), Sila Detail (`/sila/:nomor`),
  Butir Pancasila (`/butir-pancasila`), dan Pembukaan UUD 1945 (`/pembukaan`).

| Task     | Description                                                                                                                                                          | Completed | Date |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-042 | Buat `src/pages/PancasilaPage.js` — menampilkan 5 Sila dengan nomor urut, teks lengkap, dan link ke detail sila. Data dari `loadSilaPancasila()`                     |           |      |
| TASK-043 | Buat `src/pages/SilaDetailPage.js` — detail satu sila berdasarkan parameter `/:nomor` (1–5), tampilkan teks sila + daftar butir-butirnya dari `loadButirPancasila()` |           |      |
| TASK-044 | Buat `src/pages/ButirPancasilaPage.js` — semua sila dengan daftar butir yang dapat di-expand/collapse (Bootstrap Accordion). Data dari `loadButirPancasila()`        |           |      |
| TASK-045 | Buat `src/pages/PembukaanPage.js` — 4 alinea Pembukaan UUD 1945 berurutan dengan label "Alinea 1" s.d. "Alinea 4". Data dari `loadPembukaanUUD()`                    |           |      |
| TASK-046 | Implementasi tombol "Bagikan" placeholder (UI hanya, fungsionalitas di Phase 3) pada setiap halaman                                                                  |           |      |
| TASK-047 | Implementasi loading state (Bootstrap spinner) dan error state saat data gagal dimuat                                                                                |           |      |
| TASK-048 | Buat `src/pages/HomePage.js` sebagai landing page `/` yang menampilkan ringkasan aplikasi dan navigasi cepat ke 7 konten utama; daftarkan route `/` di router        |           |      |

### Implementation Phase 1.7 — Testing Phase 1

- GOAL-007: Memastikan semua komponen dan halaman Phase 1 teruji dengan unit test,
  component test, dan E2E test sebelum Phase 2 dimulai.

| Task     | Description                                                                                                                        | Completed | Date |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-049 | Unit test `src/router/router.js`: route matching, parameter parsing, navigate, popstate                                            |           |      |
| TASK-050 | Unit test `src/data/loader.js`: data loading, caching, error handling                                                              |           |      |
| TASK-051 | Component test `AppHeader.js`: render, navigation icons, title                                                                     |           |      |
| TASK-052 | Component test `BottomNavigation.js`: 4 tab render, active state sesuai URL aktif, hidden di viewport >= 768px                     |           |      |
| TASK-053 | E2E test: buka `/pancasila` langsung via URL, verifikasi 5 sila ditampilkan                                                        |           |      |
| TASK-054 | E2E test: buka `/sila/1` via URL, verifikasi Sila 1 dan butirnya ditampilkan                                                       |           |      |
| TASK-055 | E2E test: buka `/butir-pancasila` via URL, verifikasi accordion berfungsi                                                          |           |      |
| TASK-056 | E2E test: buka `/pembukaan` via URL, verifikasi 4 alinea ditampilkan                                                               |           |      |
| TASK-057 | E2E test: navigasi via bottom navigation tidak melakukan page reload (SPA behavior), active tab sinkron dengan URL                 |           |      |
| TASK-058 | Verifikasi CI pipeline pass (semua jobs hijau)                                                                                     |           |      |
| TASK-059 | E2E test: buka `/` langsung via URL, verifikasi landing page tampil dan semua shortcut navigasi utama mengarah ke route yang benar |           |      |

---

## 3. Alternatives

- **ALT-001**: Menggunakan Sass modules per komponen (CSS Modules) — tidak dipilih karena
  Vanilla JS tidak memiliki build-time CSS scoping; global CSS dengan BEM naming cukup
- **ALT-002**: Menggunakan `import.meta.glob` Vite untuk load JSON — tidak dipilih karena
  JSON di `public/` harus di-fetch via `fetch()` agar tersedia untuk Service Worker caching
- **ALT-003**: Menggunakan Hash-based routing (`#/pancasila`) — tidak dipilih karena hash
  tidak terindex oleh mesin pencari (SEO requirement dari PRD)
- **ALT-004**: Memasukkan semua 7 JSON ke bundle JS — tidak dipilih karena meningkatkan
  bundle size dan menghalangi Service Worker caching secara independen

---

## 4. Dependencies

- **DEP-001**: Node.js 20 LTS — build environment (wajib terinstall)
- **DEP-002**: `vite@5.0+` — build tool dan dev server
- **DEP-003**: `bootstrap@5.3+` — CSS framework
- **DEP-004**: `bootstrap-icons` — icon library SVG
- **DEP-005**: `fuse.js` — client-side search (diinstall di Phase 1, digunakan di Phase 2)
- **DEP-006**: `sass` — SCSS preprocessor untuk Bootstrap customization
- **DEP-007**: `typescript` — type checking (`tsc --noEmit`)
- **DEP-008**: `vitest`, `@vitest/browser` — unit & component testing
- **DEP-009**: `playwright`, `@playwright/test` — E2E testing
- **DEP-010**: `eslint`, `prettier` — linting dan formatting
- **DEP-011**: `lighthouseCI` — performance audit (GitHub Action)
- **DEP-012**: 7 file JSON dari Android assets — data konten aplikasi

---

## 5. Files

Struktur file yang akan dibuat di Phase 1:

- **FILE-001**: `index.html` — entry point HTML aplikasi
- **FILE-002**: `src/main.js` — entry point JavaScript, init app
- **FILE-003**: `src/assets/main.scss` — global styles + Bootstrap import
- **FILE-004**: `src/assets/_variables.scss` — Bootstrap overrides + design tokens
- **FILE-005**: `src/types/data.ts` — TypeScript interfaces untuk 7 JSON schemas
- **FILE-006**: `src/data/loader.js` — async data loading functions
- **FILE-007**: `src/data/fixture/` — fixture JSON untuk testing
- **FILE-008**: `src/router/router.js` — client-side router
- **FILE-009**: `src/router/routes.js` — route definitions
- **FILE-010**: `src/components/AppHeader.js` — komponen header/navbar
- **FILE-011**: `src/components/BottomNavigation.js` — komponen bottom navigation bar (mobile only)
- **FILE-012**: `src/components/AppLayout.js` — layout wrapper responsif
- **FILE-013**: `src/components/PageContainer.js` — page content wrapper
- **FILE-014**: `src/pages/PancasilaPage.js` — halaman Pancasila
- **FILE-015**: `src/pages/SilaDetailPage.js` — halaman detail Sila
- **FILE-016**: `src/pages/ButirPancasilaPage.js` — halaman Butir Pancasila
- **FILE-017**: `src/pages/PembukaanPage.js` — halaman Pembukaan UUD
- **FILE-018**: `public/data/` — 7 file JSON statis
- **FILE-019**: `.github/workflows/ci.yml` — GitHub Actions CI pipeline
- **FILE-020**: `lighthouserc.json` — Lighthouse CI config
- **FILE-021**: `vercel.json` atau `public/_redirects` — SPA fallback config
- **FILE-022**: `vite.config.js` — Vite configuration
- **FILE-023**: `tsconfig.json` — TypeScript configuration
- **FILE-024**: `eslint.config.js` — ESLint configuration
- **FILE-025**: `vitest.config.js` — Vitest configuration
- **FILE-026**: `playwright.config.js` — Playwright configuration
- **FILE-027**: `tests/unit/` — unit test files
- **FILE-028**: `tests/e2e/` — E2E test files
- **FILE-029**: `src/pages/HomePage.js` — landing page aplikasi pada route `/`

---

## 6. Testing

- **TEST-001**: Unit test router — route matching & parameter parsing (Vitest)
- **TEST-002**: Unit test data loader — fetch, cache, error handling (Vitest + mock fetch)
- **TEST-003**: Component test AppHeader — render struktur HTML yang benar (Vitest browser)
- **TEST-004**: Component test BottomNavigation — 4 tab render, active state, hidden di tablet/desktop (Vitest browser)
- **TEST-005**: E2E — `/pancasila` direct URL load, tampilkan 5 sila (Playwright)
- **TEST-006**: E2E — `/sila/1` direct URL, parameter parsing benar (Playwright)
- **TEST-007**: E2E — `/butir-pancasila` accordion expand/collapse (Playwright)
- **TEST-008**: E2E — `/pembukaan` 4 alinea berurutan (Playwright)
- **TEST-009**: E2E — navigasi via bottom navigation tidak reload halaman, active state sinkron URL (Playwright)
- **TEST-010**: CI pipeline pass (lint, type-check, unit test, build, lighthouse-ci) (GitHub Actions)
- **TEST-011**: E2E — `/` direct URL menampilkan landing page dan shortcut navigasi utama (Playwright)

---

## 7. Risks & Assumptions

- **RISK-001**: JSON dari Android mungkin tidak valid (encoding issue, format tidak konsisten)
  — **Mitigasi**: Validasi di TASK-021 sebelum lanjut; buat script formatter jika diperlukan
- **RISK-002**: Bootstrap SCSS compilation memerlukan konfigurasi tambahan di Vite
  — **Mitigasi**: Ikuti dokumentasi Vite + Sass; ada banyak contoh di komunitas
- **RISK-003**: History API routing tidak bekerja saat file dibuka langsung dari filesystem
  — **Mitigasi**: Selalu gunakan `vite dev` server atau deployment dengan SPA fallback
- **ASSUMPTION-001**: 7 file JSON tersedia dan memiliki struktur yang sesuai spec-data-schema
- **ASSUMPTION-002**: GitHub repository sudah dibuat sebelum TASK-011
- **ASSUMPTION-003**: Developer memiliki akun Vercel atau Netlify yang aktif

---

## 8. Related Specifications / Further Reading

- [PRD: Pancasila & UUD 1945 Web App](../prd_pasaluud1945_webapp.md) — F-01, F-02, F-03, F-10, F-14
- [Spesifikasi Arsitektur](../spec/spec-architecture-pasaluud1945-webapp.md) — §4.1 Data Schema, §4.2 Routing, §7.1 Tech Stack
- [Spesifikasi Design System & UI/UX](../spec/spec-design-uiux-pasaluud1945.md) — §4.1 Design Tokens, §9.1–9.3 Component Specs
- [Spesifikasi Data Schema](../spec/spec-data-schema-pasaluud1945.md) — TypeScript interfaces semua JSON
- [Spesifikasi Process Workflow](../spec/spec-process-workflow-pasaluud1945.md) — §4.2 Git Convention, §8 CI/CD
- [Master Plan](./architecture-overview-pasaluud1945-1.md)
- [Vite Documentation — Getting Started](https://vitejs.dev/guide/)
- [Bootstrap 5 — Customize with Sass](https://getbootstrap.com/docs/5.3/customize/sass/)
