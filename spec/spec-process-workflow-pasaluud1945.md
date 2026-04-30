---
title: Spesifikasi Process Workflow Pengembangan Aplikasi Web Pancasila & UUD 1945
version: 1.0.0
date_created: 2026-04-28
last_updated: 2026-04-29
owner: Development Team
status: final
tags:
  - process
  - workflow
  - sdlc
  - cicd
  - git
  - specification
---

<!-- markdownlint-disable -->
# 1. Introduction

## 1.1 Purpose & Scope

Dokumen ini mendefinisikan alur kerja pengembangan (*process workflow*) untuk proyek **Pancasila & UUD 1945 Web App**. Spesifikasi ini mencakup seluruh siklus hidup pengembangan perangkat lunak (SDLC) mulai dari persiapan hingga deployment dan monitoring, dengan memperhatikan struktur tim kecil (1-2 developer) dan karakteristik proyek static site PWA.

Workflow ini mengacu pada ketentuan di `AGENTS.md` yang mensyaratkan alur SDLC ketat: **PRD → Spec → Plan → Code**, tanpa melompat fase. Setiap fase harus selesai dan diverifikasi sebelum melanjutkan ke fase berikutnya.

**Scope:**

- Alur SDLC dan gating antar fase
- Git branching strategy dan commit conventions
- CI/CD pipeline untuk build, test, dan deployment
- Code review dan quality gates
- Release management dan versioning
- Rollback strategy
- Dokumentasi dan maintenance workflow

**Target Audience:**

- Developer / Implementer
- QA Engineer
- DevOps / Deployment Manager
- Project Lead / Technical Coordinator

---

## 2. Definitions

| Istilah          | Definisi                                                                    |
| ---------------- | --------------------------------------------------------------------------- |
| **SDLC**         | Software Development Life Cycle — siklus hidup pengembangan perangkat lunak |
| **PRD**          | Product Requirements Document — dokumen kebutuhan produk                    |
| **Spec**         | Specification Document — dokumen spesifikasi teknis                         |
| **Plan**         | Implementation Plan — dokumen rencana implementasi dan task breakdown       |
| **Gate**         | Titik verifikasi yang harus dilewati sebelum melanjutkan ke fase berikutnya |
| **UAT**          | User Acceptance Testing — pengujian penerimaan oleh pengguna                |
| **CI**           | Continuous Integration — integrasi kode otomatis                            |
| **CD**           | Continuous Deployment — deployment otomatis ke production                   |
| **PR**           | Pull Request — permintaan penggabungan kode ke branch utama                 |
| **SPA Fallback** | Konfigurasi server untuk mengarahkan semua routes ke `index.html`           |
| **Hotfix**       | Perbaikan kritis yang langsung di-deploy ke production                      |

---

## 3. Requirements, Constraints & Guidelines

### 3.1 SDLC Requirements

- **REQ-PRC-001**: Pengembangan harus mengikuti urutan fase: **PRD → Specification → Planning → Implementation → Testing → Deployment → Monitoring**
- **REQ-PRC-002**: Tidak boleh melompat fase; setiap fase harus memiliki status "Complete" sebelum fase berikutnya dimulai
- **REQ-PRC-003**: Setiap fase harus memiliki dokumen output yang jelas dan terverifikasi
- **REQ-PRC-004**: Perubahan requirements di tengah fase Implementation harus melalui change request yang direview dan diapprove
- **REQ-PRC-005**: Output setiap fase harus diverifikasi terhadap dokumen fase sebelumnya (traceability)

### 3.2 Version Control Requirements

- **REQ-PRC-006**: Setiap perubahan kode harus melalui Pull Request (PR) sebelum digabungkan ke branch utama
- **REQ-PRC-007**: Branch utama (`main`) harus selalu dalam keadaan deployable
- **REQ-PRC-008**: Commit message harus mengikuti konvensi Conventional Commits (`type(scope): description`)
- **REQ-PRC-009**: Setiap PR harus di-review minimal oleh 1 reviewer sebelum di-merge
- **REQ-PRC-010**: Merge ke branch `main` hanya diperbolehkan menggunakan metode **squash and merge** atau **rebase and merge** untuk menjaga history linear

### 3.3 CI/CD Requirements

- **REQ-PRC-011**: Setiap PR harus menjalankan pipeline: lint → type-check → unit-test → build → lighthouse-ci
- **REQ-PRC-012**: Deployment ke production hanya boleh dilakukan dari branch `main` setelah semua checks pass
- **REQ-PRC-013**: Deployment ke staging environment harus otomatis pada setiap merge ke `main`
- **REQ-PRC-014**: Production deployment harus menggunakan manual trigger (workflow_dispatch) atau tag release

### 3.4 Quality Gates

- **REQ-PRC-015**: Lighthouse Performance Score harus >= 90 sebelum deployment
- **REQ-PRC-016**: Lighthouse Accessibility Score harus >= 90 sebelum deployment
- **REQ-PRC-017**: Lighthouse SEO Score harus >= 95 sebelum deployment
- **REQ-PRC-018**: Code coverage unit test minimal 80% (statements, functions, lines)
- **REQ-PRC-019**: Tidak ada TypeScript compilation errors (`tsc --noEmit` harus pass)
- **REQ-PRC-020**: Tidak ada ESLint errors (warning diperbolehkan jika documented)

### 3.5 Constraints

- **CON-PRC-001**: Tim terdiri dari 1-2 developer; workflow harus ringan dan tidak over-engineered
- **CON-PRC-002**: Proyek bersifat static site; tidak ada backend server atau database
- **CON-PRC-003**: Deployment target adalah platform static hosting (Vercel/Netlify/Cloudflare Pages)
- **CON-PRC-004**: Tidak ada environment staging yang kompleks; cukup preview deployment dari platform hosting
- **CON-PRC-005**: Semua data bersifat publik; tidak ada concern keamanan data sensitif

### 3.6 Guidelines

- **GUD-PRC-001**: Gunakan feature branch dengan nama format: `feature/[fase-id]-[deskripsi-singkat]`
- **GUD-PRC-002**: Gunakan prefix commit: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`
- **GUD-PRC-003**: Update `CHANGELOG.md` pada setiap release
- **GUD-PRC-004**: Dokumentasikan decision log di `docs/decisions/` untuk keputusan arsitektur penting
- **GUD-PRC-005**: Gunakan semantic versioning (SemVer) untuk release tag: `v{major}.{minor}.{patch}`

---

## 4. Interfaces & Data Contracts

### 4.1 SDLC Phase Interface

```typescript
/**
 * Interface untuk tracking status fase SDLC
 */
interface SdlcPhase {
  readonly id: 'prd' | 'spec' | 'plan' | 'implement' | 'test' | 'deploy' | 'monitor';
  readonly name: string;
  readonly status: 'pending' | 'in_progress' | 'complete' | 'blocked';
  readonly outputDocument: string;
  readonly exitCriteria: readonly string[];
  readonly verifiedBy: string;
  readonly dateStarted?: string;  // ISO 8601
  readonly dateCompleted?: string; // ISO 8601
}

interface ProjectLifecycle {
  readonly projectName: string;
  readonly phases: readonly SdlcPhase[];
  readonly currentPhase: SdlcPhase['id'];
}
```

### 4.2 Git Commit Convention

```typescript
/**
 * Conventional Commits Pattern
 * Format: <type>(<scope>): <description>
 *
 * Types:
 * - feat     : Fitur baru
 * - fix      : Perbaikan bug
 * - docs     : Dokumentasi
 * - style    : Formatting, missing semicolons, dll (bukan perubahan logic)
 * - refactor : Refactor kode tanpa perubahan fungsional
 * - test     : Menambah atau memperbarui test
 * - chore    : Maintenance, build process, dependency update
 *
 * Scopes (contoh):
 * - pancasila
 * - pasal
 * - search
 * - pwa
 * - ui
 * - data
 * - ci
 */

type CommitType = 'feat' | 'fix' | 'docs' | 'style' | 'refactor' | 'test' | 'chore';
type CommitScope = 'pancasila' | 'pasal' | 'search' | 'pwa' | 'ui' | 'data' | 'ci' | 'all';

interface CommitMessage {
  readonly type: CommitType;
  readonly scope?: CommitScope;
  readonly description: string;
  readonly breaking?: boolean; // Tambahkan ! setelah scope untuk breaking change
  readonly body?: string;
  readonly footer?: string;
}
```

### 4.3 Pull Request Template Contract

```markdown
## Deskripsi
<!-- Jelaskan perubahan yang dilakukan -->

## Tipe Perubahan
- [ ] Fitur baru
- [ ] Perbaikan bug
- [ ] Refactor
- [ ] Dokumentasi
- [ ] Maintenance

## Checklist
- [ ] Kode telah di-test secara lokal
- [ ] Tidak ada error TypeScript (`tsc --noEmit`)
- [ ] Tidak ada error ESLint
- [ ] Lighthouse score tidak menurun
- [ ] Dokumentasi diperbarui (jika diperlukan)

## Fase SDLC
- Fase: <!-- contoh: Fase 2 -->
- Fitur: <!-- contoh: Pencarian Pasal -->

## Screenshot (jika ada perubahan UI)
```

---

## 5. Acceptance Criteria

### 5.1 SDLC Compliance

- **AC-PRC-001**: Given project dimulai, When fase PRD selesai, Then dokumen PRD signed-off sebelum fase Specification dimulai
- **AC-PRC-002**: Given fase Specification selesai, When dicek, Then output minimal 5 dokumen spec (`spec-architecture`, `spec-design`, `spec-data`, `spec-process-workflow`, `spec-seo`) tersimpan di `/spec/`
- **AC-PRC-003**: Given fase Planning selesai, When dicek, Then 5 dokumen implementation plan di `/plan/` berisi task breakdown per fase dengan estimasi waktu dan acceptance criteria yang jelas
- **AC-PRC-004**: Given ada perubahan requirements di fase Implementation, When dicek, Then ada change request document yang direview dan diapprove

### 5.2 Version Control Compliance

- **AC-PRC-005**: Given setiap perubahan kode, When dicek di repository, Then perubahan hanya masuk ke `main` melalui Pull Request
- **AC-PRC-006**: Given branch `main`, When dicek commit history, Then tidak ada direct push ke `main` (kecuali initial commit)
- **AC-PRC-007**: Given commit message, When dicek, Then mengikuti format Conventional Commits
- **AC-PRC-008**: Given feature branch, When dicek, Then nama branch mengikuti format `feature/[fase-id]-[deskripsi]`

### 5.3 CI/CD Compliance

- **AC-PRC-009**: Given PR dibuat, When pipeline berjalan, Then status checks (lint, type-check, test, build, lighthouse) harus pass sebelum merge
- **AC-PRC-010**: Given merge ke `main`, When deployment berjalan, Then otomatis deploy ke staging/preview environment
- **AC-PRC-011**: Given production deployment, When dicek, Then hanya dilakukan melalui manual trigger atau tag release
- **AC-PRC-012**: Given deployment gagal, When dicek, Then pipeline menampilkan error log yang informatif dan deployment ke production di-cancel

### 5.4 Quality Gates Compliance

- **AC-PRC-013**: Given build berhasil, When Lighthouse CI berjalan, Then score Performance >= 90, Accessibility >= 90, SEO >= 95, PWA >= 80
- **AC-PRC-014**: Given test berjalan, When coverage dihitung, Then minimal 80% untuk statements, functions, dan lines
- **AC-PRC-015**: Given TypeScript check, When `tsc --noEmit` berjalan, Then tidak ada error compilation

---

## 6. SDLC Phase Detail

### 6.1 Phase 0: PRD (Product Requirements Document)

| Atribut           | Detail                                       |
| ----------------- | -------------------------------------------- |
| **Status**        | Complete                                     |
| **Output**        | `prd_pasaluud1945_webapp.md`                 |
| **Owner**         | @ProductManagerPRD                           |
| **Exit Criteria** | PRD di-review dan disetujui oleh stakeholder |

**Aktivitas:**

1. Analisis aplikasi Android existing
2. Definisi goals, user personas, dan functional requirements
3. Definisi non-goals dan scope batasan
4. Definisi success metrics dan milestones
5. Review dan approval stakeholder

### 6.2 Phase 1: Specification (Spesifikasi Teknis)

| Atribut           | Detail                                             |
| ----------------- | -------------------------------------------------- |
| **Status**        | Complete                                           |
| **Output**        | 5 dokumen di `/spec/`                              |
| **Owner**         | @SpecificationArchitect                            |
| **Exit Criteria** | Semua spec lolos validation criteria dan disetujui |

**Aktivitas:**

1. Investigasi codebase Android (assets JSON, layout XML, colors, dimens)
2. Draft spesifikasi arsitektur (`spec-architecture-pasaluud1945-webapp.md`)
3. Draft spesifikasi design system (`spec-design-uiux-pasaluud1945.md`)
4. Draft spesifikasi data schema (`spec-data-schema-pasaluud1945.md`)
5. Draft spesifikasi SEO & metadata (`spec-seo-pasaluud1945.md`)
6. Draft spesifikasi process workflow (`spec-process-workflow-pasaluud1945.md`)
7. Review bersama tim dan approval

**Gate ke Phase 2:**

- [ ] Semua spec file tersimpan di `/spec/`
- [ ] Semua spec lolos validation criteria masing-masing
- [ ] Spec di-review dan disetujui oleh minimal 1 reviewer

### 6.3 Phase 2: Planning (Rencana Implementasi)

| Atribut           | Detail                                |
| ----------------- | ------------------------------------- |
| **Status**        | Complete                              |
| **Output**        | 5 dokumen di `/plan/`: `architecture-overview-pasaluud1945-1.md`, `feature-phase1-fondasi-setup-1.md`, `feature-phase2-konten-pencarian-1.md`, `feature-phase3-pwa-sharing-seo-1.md`, `feature-phase4-launch-monitoring-1.md` |
| **Owner**         | @PlannerArchitect                     |
| **Exit Criteria** | Plan disetujui dan siap dieksekusi    |

**Aktivitas:**

1. Breakdown PRD dan spec ke dalam task implementasi
2. Estimasi waktu dan resource per task
3. Definisi urutan implementasi dan dependencies antar task
4. Definisi branch strategy dan release plan
5. Identifikasi risiko dan mitigation plan

**Gate ke Phase 3:**

- [x] Plan berisi task breakdown per fase (Fase 1-4 dari PRD) — 5 dokumen plan tersimpan di `/plan/`
- [x] Setiap task memiliki estimasi dan acceptance criteria yang jelas
- [ ] Plan disetujui oleh tim development

### 6.4 Phase 3: Implementation (Pengembangan)

| Atribut           | Detail                                             |
| ----------------- | -------------------------------------------------- |
| **Status**        | Pending                                            |
| **Output**        | Kode aplikasi web                                  |
| **Owner**         | @BeastModeDev / @GodModeDev / @MiniBeast           |
| **Exit Criteria** | Semua task implementasi selesai dan unit test pass |

**Fase Implementasi (berdasarkan PRD):**

#### Fase 3a: Fondasi & Setup (1-2 minggu)

- Setup project Vite + Vanilla JavaScript + Bootstrap + TypeScript (opsional)
- Setup routing dan konfigurasi PWA
- Migrasi dan validasi 7 file JSON data
- Implementasi komponen navigasi utama (header, tab, sidebar)
- Implementasi halaman: Pancasila, Butir Pancasila, Pembukaan UUD

#### Fase 3b: Konten Utama & Pencarian (2-3 minggu)

- Implementasi halaman: Pasal UUD, Bab Pasal, UUD Asli, Detail Amandemen
- Implementasi fitur Pencarian Pasal (real-time filter dengan Fuse.js)
- Implementasi Deep Link / URL per pasal
- Implementasi detail pasal dengan ayat-ayat

#### Fase 3c: PWA, Sharing & Polish (1-2 minggu)

- Implementasi Service Worker (offline support, PWA)
- Implementasi fitur Berbagi (Web Share API + Clipboard fallback)
- Responsif design untuk semua breakpoint
- SEO optimization (meta tags, Open Graph, sitemap)
- Integrasi Google Analytics (GA4)

**Branch Naming:**

```
feature/fase1-foundation-setup
feature/fase1-pancasila-page
feature/fase1-butir-page
feature/fase1-pembukaan-page
feature/fase2-pasal-list
feature/fase2-bab-navigation
feature/fase2-search-pasal
feature/fase2-deep-link
feature/fase3-pwa-offline
feature/fase3-share-feature
feature/fase3-responsive-design
feature/fase3-seo-optimization
```

### 6.5 Phase 4: Testing (Pengujian)

| Atribut           | Detail                                                              |
| ----------------- | ------------------------------------------------------------------- |
| **Status**        | Pending                                                             |
| **Output**        | Test report, bug fixes                                              |
| **Owner**         | @QATestArchitect                                                    |
| **Exit Criteria** | Semua acceptance criteria terpenuhi, bug critical dan high resolved |

**Aktivitas:**

1. Unit testing (Vitest)
2. Component testing (Vitest browser mode + native DOM API)
3. Integration & E2E testing (Playwright)
4. Performance testing (Lighthouse CI)
5. Cross-browser testing (Chrome, Firefox, Safari, Edge)
6. Cross-device testing (mobile, tablet, desktop)
7. PWA testing (installability, offline functionality)
8. UAT (User Acceptance Testing)

**Testing Checklist:**

- [ ] Unit test coverage >= 80%
- [ ] Semua functional requirements (REQ-001 s.d. REQ-014) tervalidasi
- [ ] Lighthouse score memenuhi target
- [ ] Tidak ada bug critical atau high priority
- [ ] PWA installable dan offline functional
- [ ] Deep link berfungsi di semua routes
- [ ] Share feature berfungsi di mobile dan desktop
- [ ] Responsif di semua breakpoint

### 6.6 Phase 5: Deployment (Peluncuran)

| Atribut           | Detail                                          |
| ----------------- | ----------------------------------------------- |
| **Status**        | Pending                                         |
| **Output**        | Aplikasi live di production                     |
| **Owner**         | DevOps / Developer                              |
| **Exit Criteria** | Aplikasi live, DNS propagated, monitoring aktif |

**Aktivitas:**

1. Final build production (`vite build`)
2. Deploy ke staging/preview untuk final verification
3. Deploy ke production
4. Konfigurasi DNS dan custom domain (jika ada)
5. Verifikasi SPA fallback (semua routes ke `index.html`)
6. Verifikasi PWA manifest dan service worker
7. Submit sitemap ke Google Search Console
8. Setup monitoring (Core Web Vitals, uptime)

### 6.7 Phase 6: Monitoring & Maintenance

| Atribut           | Detail                                             |
| ----------------- | -------------------------------------------------- |
| **Status**        | Pending                                            |
| **Output**        | Monitoring dashboard, incident logs                |
| **Owner**         | Developer                                          |
| **Exit Criteria** | Monitoring aktif, dokumentasi maintenance tersedia |

**Aktivitas:**

1. Monitoring Lighthouse score via PageSpeed Insights API
2. Monitoring Google Analytics (traffic, engagement)
3. Monitoring error logs (browser console errors)
4. Perbaikan bug minor dan polish berkelanjutan
5. Update konten (jika ada koreksi pasal dari user)

---

## 7. Git Branching Strategy

### 7.1 Branch Structure

```
main ...................................... (production-ready, deployable)
  │
  ├── feature/fase1-foundation-setup
  ├── feature/fase1-pancasila-page
  ├── feature/fase2-search-pasal
  ├── feature/fase3-pwa-offline
  │
  ├── release/v1.0.0 ...................... (preparation for release, optional)
  │
  └── hotfix/search-bug-fix ............... (critical fix from main)
```

### 7.2 Branch Rules

| Branch      | Tujuan             | Dari   | Ke     | Protected      |
| ----------- | ------------------ | ------ | ------ | -------------- |
| `main`      | Production code    | —      | —      | Yes            |
| `feature/*` | Pengembangan fitur | `main` | `main` | No             |
| `release/*` | Persiapan release  | `main` | `main` | Yes (opsional) |
| `hotfix/*`  | Perbaikan kritis   | `main` | `main` | No             |

### 7.3 Workflow Per Branch Type

#### Feature Branch

```bash
# 1. Checkout dari main yang terbaru
git checkout main
git pull origin main

# 2. Buat feature branch
git checkout -b feature/fase2-search-pasal

# 3. Commit dengan Conventional Commits
git commit -m "feat(search): implement real-time pasal search with Fuse.js"
git commit -m "feat(search): add highlight keyword in search results"
git commit -m "test(search): add unit test for search filter logic"

# 4. Push branch
git push origin feature/fase2-search-pasal

# 5. Buat Pull Request ke main (via GitHub UI)
# 6. Review dan approval
# 7. Merge setelah CI pass
```

#### Hotfix Branch

```bash
# 1. Checkout dari main
git checkout main
git pull origin main

# 2. Buat hotfix branch
git checkout -b hotfix/search-debounce-bug

# 3. Commit perbaikan
git commit -m "fix(search): resolve debounce timing issue causing duplicate requests"

# 4. Push dan buat PR (prioritas tinggi, fast-track review)
# 5. Merge ke main dan deploy segera
```

---

## 8. CI/CD Pipeline

### 8.1 Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     PULL REQUEST PIPELINE                    │
├─────────────────────────────────────────────────────────────┤
│  1. Checkout Code                                           │
│  2. Setup Node.js 18+                                       │
│  3. Install Dependencies (npm ci)                           │
│  4. Run ESLint (npm run lint)                               │
│  5. Run TypeScript Check (tsc --noEmit)                     │
│  6. Run Unit Tests (vitest run --coverage)                  │
│  7. Build Production (vite build)                          │
│  8. Run Lighthouse CI (mobile + desktop)                    │
│  9. Upload Coverage Report (codecov/artifact)               │
│  10. PR Status Check                                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ (Merge ke main)
┌─────────────────────────────────────────────────────────────┐
│                     DEPLOYMENT PIPELINE                      │
├─────────────────────────────────────────────────────────────┤
│  1. Checkout Code                                           │
│  2. Setup Node.js 18+                                       │
│  3. Install Dependencies                                    │
│  4. Run Full Test Suite                                     │
│  5. Build Production                                        │
│  6. Deploy to Staging/Preview (automatic)                   │
│  7. Manual Approval Gate (production only)                  │
│  8. Deploy to Production                                    │
│  9. Post-deploy Smoke Test                                  │
│  10. Update Changelog & Release Notes                       │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test:unit -- --coverage
      - run: npm run build
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli@0.12.x
          lhci autorun
```

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      environment:
        description: 'Deployment environment'
        required: true
        default: 'production'
        type: choice
        options:
          - preview
          - production

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run test:unit
      - run: npm run build

      - name: Deploy to Preview (Staging)
        if: github.event.inputs.environment == 'preview' || github.event_name == 'push'
        run: echo "Deploy to Vercel/Netlify Preview"

      - name: Deploy to Production
        if: github.event.inputs.environment == 'production'
        run: echo "Deploy to Vercel/Netlify Production"
```

### 8.3 Lighthouse CI Configuration

```json
// lighthouserc.json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:4173/", "http://localhost:4173/pasal/1"],
      "startServerCommand": "npm run preview",
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["warn", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["warn", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.95 }],
        "categories:pwa": ["warn", { "minScore": 0.8 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

---

## 9. Release Management

### 9.1 Release Strategy

| Jenis Release | Trigger         | Contoh   | Proses                       |
| ------------- | --------------- | -------- | ---------------------------- |
| **Major**     | Breaking change | `v2.0.0` | UAT lengkap, announcement    |
| **Minor**     | Fitur baru      | `v1.1.0` | Smoke test, changelog update |
| **Patch**     | Bug fix         | `v1.0.1` | Quick smoke test, deploy     |

### 9.2 Release Checklist

- [ ] Semua task di milestone selesai
- [ ] Semua PR merged ke `main`
- [ ] CI/CD pipeline pass (lint, test, build, lighthouse)
- [ ] Changelog diperbarui
- [ ] Version di `package.json` di-update
- [ ] Tag release dibuat: `git tag -a v1.0.0 -m "Release v1.0.0"`
- [ ] Release notes di GitHub dibuat
- [ ] Deploy ke production
- [ ] Post-deploy smoke test
- [ ] Monitoring aktif

### 9.3 Rollback Strategy

| Skenario                 | Rollback Method                            | Recovery Time |
| ------------------------ | ------------------------------------------ | ------------- |
| Deployment gagal         | Platform hosting rollback (Vercel/Netlify) | < 5 menit     |
| Bug kritis pasca-release | Revert commit + hotfix deploy              | < 30 menit    |
| Data corruption          | Restore dari backup (Git) + redeploy       | < 15 menit    |
| Performance degradation  | Revert ke tag release sebelumnya           | < 10 menit    |

**Rollback Command (Vercel):**

```bash
# Rollback ke deployment sebelumnya
vercel --prod
# atau via Vercel Dashboard: Projects → Deployments → Promote
```

---

## 10. Rationale & Context

### 10.1 Pemilihan GitHub Flow (dengan modifikasi)

Proyek ini menggunakan variasi **GitHub Flow** (simplified Git Flow) karena:

- Tim kecil (1-2 developer); Git Flow formal terlalu kompleks
- Deployment frequent; tidak perlu release branch yang panjang
- Static site; tidak ada environment staging yang kompleks
- Preview deployment dari platform hosting (Vercel/Netlify) sudah cukup untuk QA

Modifikasi: menambahkan `release/*` branch opsional untuk milestone besar dan `hotfix/*` untuk perbaikan kritis.

### 10.2 Pemilihan Conventional Commits

Conventional Commits dipilih karena:

- Otomatis generate CHANGELOG.md
- Otomatis determine versi (SemVer) berdasarkan tipe commit
- Readable history yang mudah dipahami AI dan manusia
- Kompatibel dengan automated release tools (semantic-release)

### 10.3 Pemilihan CI/CD Platform

**GitHub Actions** dipilih karena:

- Native integration dengan repository
- Free tier cukup untuk proyek kecil
- Marketplace actions untuk Lighthouse CI, Codecov, dsb.
- Tidak perlu setup infrastructure CI/CD terpisah

---

## 11. Dependencies & External Integrations

### External Systems

- **EXT-PRC-001**: GitHub — Version control, PR review, issue tracking
- **EXT-PRC-002**: Vercel/Netlify/Cloudflare Pages — Static hosting dan CDN
- **EXT-PRC-003**: Google Search Console — SEO monitoring dan sitemap submission

### Third-Party Services

- **SVC-PRC-001**: Lighthouse CI — Automated performance auditing
- **SVC-PRC-002**: Codecov — Coverage report hosting
- **SVC-PRC-003**: Google Analytics 4 — Traffic dan engagement monitoring

### Infrastructure Dependencies

- **INF-PRC-001**: Node.js 20 — Build environment
- **INF-PRC-002**: npm/pnpm — Package manager

### Technology Platform Dependencies

- **PLT-PRC-001**: Git — Version control system
- **PLT-PRC-002**: GitHub Actions — CI/CD runner

---

## 12. Examples & Edge Cases

### 12.1 Contoh Complete Workflow: Menambah Fitur Pencarian

```bash
# Step 1: Sync dengan main
git checkout main
git pull origin main

# Step 2: Buat feature branch
git checkout -b feature/fase2-search-pasal

# Step 3: Implementasi
# ... coding ...

# Step 4: Commit
git add .
git commit -m "feat(search): implement Fuse.js search index builder"
git commit -m "feat(search): add debounced search input component"
git commit -m "feat(search): add search results list with highlight"
git commit -m "test(search): add unit tests for search filter logic"

# Step 5: Push
git push origin feature/fase2-search-pasal

# Step 6: Buat Pull Request
# Title: feat(search): implement real-time pasal search
# Description: sesuai template PR

# Step 7: CI berjalan otomatis
# - Lint pass
# - Type-check pass
# - Unit test pass (coverage >= 80%)
# - Build pass
# - Lighthouse pass

# Step 8: Code review oleh reviewer
# Step 9: Merge squash ke main setelah approval
# Step 10: Auto-deploy ke preview environment
```

### 12.2 Contoh Hotfix Workflow

```bash
# Bug kritis: Search crash saat input kosong

git checkout main
git pull origin main
git checkout -b hotfix/search-empty-input-crash

# Fix bug
git add .
git commit -m "fix(search): handle empty input to prevent Fuse.js crash"
git push origin hotfix/search-empty-input-crash

# Buat PR dengan label "hotfix" dan "priority: critical"
# Fast-track review (bypass normal queue jika diperlukan)
# Merge ke main
# Deploy segera ke production
```

### 12.3 Edge Cases

| Skenario                                  | Handling                                                                |
| ----------------------------------------- | ----------------------------------------------------------------------- |
| CI pipeline fail di PR                    | Perbaiki error, push ulang, pipeline otomatis re-run                    |
| Lighthouse score turun di PR              | PR tidak boleh di-merge sampai score kembali memenuhi threshold         |
| Merge conflict saat PR                    | Rebase branch ke main terbaru, resolve conflict, force-push             |
| Commit message tidak mengikuti convention | Amend commit atau squash dengan pesan yang benar                        |
| Deployment ke production gagal            | Platform hosting otomatis rollback ke deployment terakhir yang sukses   |
| Bug ditemukan pasca-release               | Buat hotfix branch dari `main`, fix, PR, merge, deploy                  |
| Perubahan requirements di tengah fase     | Buat change request document, review dengan tim, update spec jika perlu |

---

## 13. Validation Criteria

Dokumen process workflow dianggap valid apabila:

- [ ] **VAL-PRC-001**: Alur SDLC terdefinisi lengkap dari PRD hingga Monitoring
- [ ] **VAL-PRC-002**: Git branching strategy sesuai dengan ukuran tim (1-2 developer)
- [ ] **VAL-PRC-003**: CI/CD pipeline mencakup lint, type-check, test, build, dan lighthouse
- [ ] **VAL-PRC-004**: Quality gates terdefinisi dengan threshold yang jelas
- [ ] **VAL-PRC-005**: Release management dan rollback strategy terdokumentasi
- [ ] **VAL-PRC-006**: Commit convention dan PR template tersedia
- [ ] **VAL-PRC-007**: Contoh workflow (feature dan hotfix) tersedia untuk referensi
- [ ] **VAL-PRC-008**: Dokumen ini telah direview dan disetujui oleh tim development

---

## 14. Related Specifications / Further Reading

- [Spesifikasi Arsitektur: Pancasila & UUD 1945 Web App](./spec-architecture-pasaluud1945-webapp.md)
- [Spesifikasi Design System & UI/UX](./spec-design-uiux-pasaluud1945.md)
- [Spesifikasi Data Schema](./spec-data-schema-pasaluud1945.md)
- [Spesifikasi SEO & Metadata](./spec-seo-pasaluud1945.md)
- [PRD: Pancasila & UUD 1945 Web App](../prd_pasaluud1945_webapp.md)
- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [GitHub Flow Documentation](https://docs.github.com/en/get-started/quickstart/github-flow)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)

---

*Dokumen ini merupakan spesifikasi process workflow v1.0.0 dan harus direview bersama dengan spesifikasi lainnya sebelum memasuki fase Implementation Planning.*
