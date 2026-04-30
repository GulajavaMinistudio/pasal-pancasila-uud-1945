---
goal: Master Implementation Plan — Pancasila & UUD 1945 Web App
version: 1.0
date_created: 2026-04-28
last_updated: 2026-04-28
owner: Development Team
status: 'Planned'
tags:
  - architecture
  - overview
  - planning
  - pwa
  - implementation
---

<!-- markdownlint-disable -->

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

Dokumen ini adalah **master plan** untuk migrasi aplikasi Android "Pancasila & UUD 1945" (v4.0.0)
ke Progressive Web App (PWA) berbasis Vanilla JavaScript + Vite + Bootstrap 5. Plan ini
mengorkestrasi keseluruhan 4 fase implementasi secara berurutan, dengan tiap fase memiliki dokumen
plan terpisah yang dapat dieksekusi secara independen.

**Dokumen Plan per Fase:**

| Fase | Dokumen | Durasi | Status |
| ---- | ------- | ------ | ------ |
| Phase 1 | [feature-phase1-fondasi-setup-1.md](./feature-phase1-fondasi-setup-1.md) | 1–2 minggu | Planned |
| Phase 2 | [feature-phase2-konten-pencarian-1.md](./feature-phase2-konten-pencarian-1.md) | 2–3 minggu | Planned |
| Phase 3 | [feature-phase3-pwa-sharing-seo-1.md](./feature-phase3-pwa-sharing-seo-1.md) | 1–2 minggu | Planned |
| Phase 4 | [feature-phase4-launch-monitoring-1.md](./feature-phase4-launch-monitoring-1.md) | 1 minggu | Planned |

**Total Estimasi:** 6–8 minggu

---

## 1. Requirements & Constraints

- **REQ-001**: Implementasi mengikuti urutan fase ketat: Phase 1 → Phase 2 → Phase 3 → Phase 4
- **REQ-002**: Setiap fase harus memenuhi exit criteria sebelum fase berikutnya dimulai
- **REQ-003**: Semua 14 Functional Requirements (F-01–F-14) dari PRD harus terimplementasi
- **REQ-004**: Semua quality gates dari `spec-process-workflow` harus terpenuhi sebelum deployment
- **CON-001**: Tech stack wajib: Vanilla JavaScript ES6+, Vite 5.0+, Bootstrap 5.3+, Node.js 20 LTS
- **CON-002**: Static site — tidak ada backend API atau database
- **CON-003**: Data bersumber dari 7 file JSON statis yang dimigrasi dari Android assets
- **GUD-001**: Branch per fitur, semua perubahan masuk `main` via Pull Request
- **GUD-002**: Conventional Commits format untuk semua commit messages
- **GUD-003**: CI pipeline (lint → type-check → test → build → lighthouse) harus pass di setiap PR

---

## 2. Implementation Steps

### Phase 1 — Fondasi & Setup

- GOAL-001: Membangun fondasi teknis proyek — project scaffold, CI/CD, migrasi data,
  design system, routing dasar, landing page `/`, dan 4 halaman konten awal (Pancasila,
  Sila Detail, Butir, Pembukaan).

| Task | Description | Completed | Date |
| ---- | ----------- | --------- | ---- |
| TASK-001 | Setup project Vite + Vanilla JS | | |
| TASK-002 | Install & konfigurasi Bootstrap 5.3+, Bootstrap Icons, Fuse.js | | |
| TASK-003 | Setup ESLint + Prettier + TypeScript type checking | | |
| TASK-004 | Setup Vitest + Playwright testing | | |
| TASK-005 | Setup GitHub Actions CI pipeline | | |
| TASK-006 | Konfigurasi Vercel/Netlify dengan SPA fallback | | |
| TASK-007 | Migrasi 7 file JSON ke `/public/data/` | | |
| TASK-008 | Implementasi design tokens (CSS custom properties + Bootstrap theme) | | |
| TASK-009 | Implementasi client-side router | | |
| TASK-010 | Implementasi base layout (Header, Tab Navigation, sidebar responsif) | | |
| TASK-011 | Landing page (`/`) + Halaman Pancasila (`/pancasila`, `/sila/:nomor`) | | |
| TASK-012 | Halaman Butir Pancasila (`/butir-pancasila`) | | |
| TASK-013 | Halaman Pembukaan UUD 1945 (`/pembukaan`) | | |
| TASK-014 | Unit + component + E2E tests untuk Phase 1 | | |

**Exit Criteria Phase 1:**

- [ ] CI pipeline pass (lint, test, build)
- [ ] Landing page dan halaman konten awal berfungsi dan responsif
- [ ] Routing dasar berjalan dengan benar
- [ ] Design tokens teraplikasikan

### Phase 2 — Konten Utama & Pencarian

- GOAL-002: Mengimplementasikan seluruh sisa konten aplikasi (5 halaman), fitur pencarian
  real-time dengan Fuse.js, deep link routing untuk semua 14 route, dan halaman 404.

| Task | Description | Completed | Date |
| ---- | ----------- | --------- | ---- |
| TASK-015 | Halaman Pasal UUD 1945 (`/pasal`, `/pasal/:nomor`) + badge amandemen | | |
| TASK-016 | Halaman Bab Pasal (`/bab-pasal`, `/bab-pasal/:nomor`) | | |
| TASK-017 | Halaman UUD Asli (`/uud-asli`) | | |
| TASK-018 | Halaman Amandemen (`/amandemen`) | | |
| TASK-019 | Halaman Tentang Aplikasi (`/tentang`) | | |
| TASK-020 | Halaman 404 Not Found (`*`) | | |
| TASK-021 | Implementasi fitur pencarian Fuse.js + debounce 300ms | | |
| TASK-022 | Sinkronisasi URL `/cari?q=` dengan input pencarian | | |
| TASK-023 | Highlight kata kunci pada hasil pencarian | | |
| TASK-024 | Deep link — semua 14 route dapat diakses langsung via URL | | |
| TASK-025 | Unit + integration + E2E tests untuk Phase 2 | | |

**Exit Criteria Phase 2:**

- [ ] Semua 14 route berfungsi dan dapat diakses langsung
- [ ] Pencarian real-time berjalan dengan highlight
- [ ] Badge amandemen tampil pada pasal yang benar
- [ ] Halaman 404 berfungsi

### Phase 3 — PWA, Sharing & SEO

- GOAL-003: Mengimplementasikan fitur PWA (Service Worker, offline), Web Share API,
  optimasi SEO lengkap (meta tags, JSON-LD, sitemap), Google Analytics 4, serta polish
  performa dan aksesibilitas hingga semua Lighthouse quality gates terpenuhi.

| Task | Description | Completed | Date |
| ---- | ----------- | --------- | ---- |
| TASK-026 | Konfigurasi `vite-plugin-pwa` + Workbox runtime caching untuk assets dan 7 file JSON | | |
| TASK-027 | Generate `manifest.json` + ikon PWA semua ukuran melalui konfigurasi Vite | | |
| TASK-028 | Registrasi service worker via `virtual:pwa-register`, offline indicator, dan verifikasi installability | | |
| TASK-029 | Web Share API + Clipboard API fallback | | |
| TASK-030 | `updateMetaTags()` utility + meta tags per 14 route | | |
| TASK-031 | Open Graph + Twitter Card meta tags per route | | |
| TASK-032 | JSON-LD Structured Data (WebPage, Article, BreadcrumbList) | | |
| TASK-033 | `scripts/generate-sitemap.js` + sitemap.xml build-time | | |
| TASK-034 | `public/robots.txt` | | |
| TASK-035 | Google Analytics 4 integration + event tracking | | |
| TASK-036 | Optimasi bundle size (< 200KB gzipped) | | |
| TASK-037 | Lighthouse CI audit — semua score harus pass | | |
| TASK-038 | Accessibility audit (Axe) + perbaikan | | |
| TASK-039 | Visual regression tests baseline | | |
| TASK-040 | E2E tests PWA, share, dan SEO | | |

**Exit Criteria Phase 3:**

- [ ] Lighthouse Performance >= 90, Accessibility >= 90, SEO >= 95, PWA >= 80
- [ ] Offline functionality dan indikator offline berjalan sesuai scope v1
- [ ] Bundle JS gzipped < 200KB
- [ ] Semua test suite pass

### Phase 4 — Launch & Monitoring

- GOAL-004: Melakukan User Acceptance Testing (UAT), final deployment ke production,
  konfigurasi monitoring, dan menjamin stabilitas pasca-launch.

| Task | Description | Completed | Date |
| ---- | ----------- | --------- | ---- |
| TASK-041 | UAT terhadap semua 14 Functional Requirements dari PRD | | |
| TASK-042 | Final Lighthouse audit (production build) | | |
| TASK-043 | Production deployment (Vercel/Netlify) + custom domain | | |
| TASK-044 | Google Search Console setup + submit sitemap | | |
| TASK-045 | Core Web Vitals monitoring dashboard | | |
| TASK-046 | Bug fix sprint pasca-launch | | |

**Exit Criteria Phase 4:**

- [ ] Semua F-01–F-14 lolos UAT
- [ ] Production URL live dan dapat diakses
- [ ] Sitemap tersubmit ke Google Search Console
- [ ] Monitoring aktif

---

## 3. Alternatives

- **ALT-001**: Menggunakan Next.js atau Astro (SSG) — ditolak karena menambah complexity
  dan overhead; Vanilla JS + Vite sudah cukup untuk static site tanpa server-side rendering
- **ALT-002**: Membuat satu plan dokumen besar — ditolak karena sulit dieksekusi secara
  bertahap; dokumen per fase lebih mudah ditrack dan di-delegate
- **ALT-003**: Menggunakan React atau Vue — ditolak per keputusan arsitektur di spec; bundle
  size lebih besar dan tidak diperlukan untuk use case ini

---

## 4. Dependencies

- **DEP-001**: PRD `prd_pasaluud1945_webapp.md` — sumber kebutuhan fungsional
- **DEP-002**: `spec/spec-architecture-pasaluud1945-webapp.md` — arsitektur, routing, tech stack
- **DEP-003**: `spec/spec-design-uiux-pasaluud1945.md` — design tokens, komponen UI
- **DEP-004**: `spec/spec-data-schema-pasaluud1945.md` — schema 7 JSON, TypeScript interfaces
- **DEP-005**: `spec/spec-process-workflow-pasaluud1945.md` — CI/CD, branching, quality gates
- **DEP-006**: `spec/spec-seo-pasaluud1945.md` — meta tags, JSON-LD, sitemap strategy
- **DEP-007**: Node.js 20 LTS — build environment
- **DEP-008**: GitHub repository — version control + CI/CD

---

## 5. Files

- **FILE-001**: `plan/architecture-overview-pasaluud1945-1.md` — dokumen ini (master plan)
- **FILE-002**: `plan/feature-phase1-fondasi-setup-1.md` — detail Phase 1
- **FILE-003**: `plan/feature-phase2-konten-pencarian-1.md` — detail Phase 2
- **FILE-004**: `plan/feature-phase3-pwa-sharing-seo-1.md` — detail Phase 3
- **FILE-005**: `plan/feature-phase4-launch-monitoring-1.md` — detail Phase 4

---

## 6. Testing

- **TEST-001**: Setiap fase memiliki test suite yang dieksekusi di CI sebelum fase berikutnya
- **TEST-002**: Unit test coverage minimal 80% (Vitest)
- **TEST-003**: E2E test mencakup semua 14 route dan user flows utama (Playwright)
- **TEST-004**: Lighthouse CI pass di setiap PR sejak pipeline Phase 1 aktif
- **TEST-005**: Visual regression baseline dibuat di Phase 3 sebelum launch

---

## 7. Risks & Assumptions

- **RISK-001**: JSON data dari Android mungkin perlu reformatting — mitigasi: validasi schema di
  TASK-007 dan tulis data loader yang toleran terhadap variasi format
- **RISK-002**: Web Share API tidak tersedia di semua browser desktop — mitigasi: Clipboard API
  fallback sudah direncanakan di TASK-029
- **RISK-003**: Bundle size melebihi 200KB — mitigasi: audit di TASK-036 sebelum launch
- **RISK-004**: Lighthouse SEO < 95 pada SPA tanpa pre-rendering — mitigasi: meta tags per route
  via `updateMetaTags()` dan JSON-LD sudah direncanakan di Phase 3
- **ASSUMPTION-001**: 7 file JSON dari aplikasi Android tersedia dan valid sesuai schema di
  `spec-data-schema-pasaluud1945.md`
- **ASSUMPTION-002**: Domain hosting sudah dipilih (Vercel atau Netlify) sebelum Phase 4 dimulai
- **ASSUMPTION-003**: Tim terdiri dari 1-2 developer frontend

---

## 8. Related Specifications / Further Reading

- [PRD: Pancasila & UUD 1945 Web App](../prd_pasaluud1945_webapp.md)
- [Spesifikasi Arsitektur](../spec/spec-architecture-pasaluud1945-webapp.md)
- [Spesifikasi Design System & UI/UX](../spec/spec-design-uiux-pasaluud1945.md)
- [Spesifikasi Data Schema](../spec/spec-data-schema-pasaluud1945.md)
- [Spesifikasi Process Workflow](../spec/spec-process-workflow-pasaluud1945.md)
- [Spesifikasi SEO & Metadata](../spec/spec-seo-pasaluud1945.md)
