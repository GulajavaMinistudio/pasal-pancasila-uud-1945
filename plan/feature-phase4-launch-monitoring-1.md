---
goal: Phase 4 — Launch & Monitoring Pancasila & UUD 1945 Web App
version: 1.0
date_created: 2026-04-28
last_updated: 2026-04-28
owner: Development Team
status: 'Planned'
tags:
  - feature
  - phase4
  - launch
  - monitoring
  - deployment
  - uat
  - production
---

<!-- markdownlint-disable -->

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

Phase 4 adalah fase final sebelum dan sesudah aplikasi diluncurkan ke publik. Phase ini mencakup
User Acceptance Testing (UAT) menyeluruh terhadap seluruh scope v1 yang telah disetujui dalam
dokumen plan, final Lighthouse audit, deployment ke production, setup monitoring, dan bug fix
sprint pasca-launch.

**Prerequisite:** Phase 3 selesai — Lighthouse CI pass, PWA berfungsi, SEO terimplementasi. ✅

**Estimasi Durasi:** 1 minggu

**Gate Wajib:** Semua requirement v1 yang sudah disepakati di dokumen plan lolos UAT sebelum deployment.

---

## 1. Requirements & Constraints

- **REQ-001**: Semua requirement v1 yang disetujui pada plan harus lolos UAT; approved scope v1 mencakup landing page `/`, link F-11 dipusatkan di `/tentang`, dan share per butir Pancasila ditunda ke backlog v2
- **REQ-002**: Lighthouse Production score: Performance ≥ 90, Accessibility ≥ 90, SEO ≥ 95, PWA ≥ 80
- **REQ-003**: Deployment ke production menggunakan HTTPS dengan custom domain (jika ada)
- **REQ-004**: SPA fallback harus aktif di production (semua route mengembalikan `index.html`)
- **REQ-005**: Google Search Console harus di-setup dan sitemap.xml tersubmit sebelum dianggap launch
- **REQ-006**: Uptime monitoring harus aktif (≥ 99.5% availability target dari PRD)
- **REQ-007**: Bug fixes pasca-launch harus melalui proses hotfix branch → PR → merge → deploy
- **SEC-001**: Production deployment hanya boleh dilakukan via manual trigger atau tag release
  (sesuai REQ-PRC-014 dari spec-process-workflow)
- **SEC-002**: Environment variables (GA4 ID, domain) harus dikonfigurasi di platform hosting,
  bukan di-hardcode di kode
- **CON-001**: Deployment ke production menggunakan platform static hosting (Vercel atau Netlify)
- **CON-002**: Tidak ada downtime deployment — static hosting memiliki atomic deployment
- **GUD-001**: Buat release tag `v1.0.0` di GitHub saat production deployment pertama
- **GUD-002**: Update `CHANGELOG.md` dengan semua perubahan dari Phase 1–4

---

## 2. Implementation Steps

### Implementation Phase 4.1 — User Acceptance Testing (UAT)

- GOAL-001: Memverifikasi bahwa seluruh scope v1 yang disetujui pada plan telah
  terimplementasi dengan benar sebelum deployment ke production.

| Task | Description | Completed | Date |
| ---- | ----------- | --------- | ---- |
| TASK-001 | **UAT Navigasi Awal + F-01**: Buka `/` — verifikasi landing page tampil dan semua shortcut navigasi utama bekerja. Lanjut buka `/pancasila` — verifikasi 5 sila tampil dengan nomor urut dan teks lengkap. Klik sila → buka `/sila/:nomor` dengan detail | | |
| TASK-002 | **UAT F-02** (Butir Pancasila): Buka `/butir-pancasila` — verifikasi butir per sila tampil, accordion expand/collapse berfungsi, dan tombol bagikan level halaman berfungsi; share per butir tidak diuji karena di luar scope v1 | | |
| TASK-003 | **UAT F-03** (Pembukaan UUD): Buka `/pembukaan` — verifikasi 4 alinea tampil berurutan dengan label yang benar, tombol bagikan berfungsi | | |
| TASK-004 | **UAT F-04** (Pasal UUD Pasca-Amandemen): Buka `/pasal` — verifikasi semua pasal (Pasal 1–37+) tampil. Klik pasal → detail dengan ayat-ayat dan badge amandemen yang benar | | |
| TASK-005 | **UAT F-05** (Navigasi Bab): Buka `/bab-pasal` — verifikasi 21 Bab tampil dengan keterangan. Klik bab → `/bab-pasal/:nomor` dengan daftar pasal dalam bab tersebut | | |
| TASK-006 | **UAT F-06** (UUD Asli): Buka `/uud-asli` — verifikasi pasal UUD asli tampil dengan penanda "UUD 1945 Asli", filter berdasarkan bab berfungsi | | |
| TASK-007 | **UAT F-07** (Detail Amandemen): Buka `/amandemen` — verifikasi pasal yang diamandemen tampil dengan keterangan amandemen I–IV yang benar, grouped per amandemen | | |
| TASK-008 | **UAT F-08** (Pencarian): Buka `/cari` dan ketik keyword — verifikasi hasil muncul dalam 300ms, highlight terlihat, klik hasil navigasi ke pasal yang benar. Buka `/cari?q=kedaulatan` langsung | | |
| TASK-009 | **UAT F-09** (Berbagi): Klik tombol "Bagikan" di halaman Pasal, Sila, Pembukaan — verifikasi Web Share API muncul (mobile) atau clipboard copy berfungsi (desktop) | | |
| TASK-010 | **UAT F-10** (Deep Link): Buka 5 URL acak secara langsung di tab baru (tanpa navigasi dari home). Contoh: `/pasal/28C`, `/sila/3`, `/bab-pasal/14` — verifikasi konten langsung tampil | | |
| TASK-011 | **UAT F-11** (Koreksi & Saran): Buka `/tentang` — verifikasi link Google Forms koreksi pasal dan link Google Forms saran masukan berfungsi dan mengarah ke form yang benar; untuk v1 kedua link memang dipusatkan di halaman ini | | |
| TASK-012 | **UAT F-12** (Tentang Aplikasi): Buka `/tentang` — verifikasi nama aplikasi, versi, deskripsi, dan informasi sumber data tampil lengkap | | |
| TASK-013 | **UAT F-13** (Mode Offline/PWA): Aktifkan "Offline" di DevTools → refresh halaman — verifikasi semua halaman masih bisa diakses, indikator visual offline tampil, dan pencarian tetap berfungsi. Test juga di mobile (Chrome Android) | | |
| TASK-014 | **UAT F-14** (Tampilan Responsif): Test di 3 breakpoint nyata — mobile (375px/iPhone), tablet (768px/iPad), desktop (1440px). Verifikasi tidak ada scroll horizontal, teks terbaca, layout sesuai spec | | |
| TASK-015 | Catat semua bug/isu yang ditemukan saat UAT di `docs/uat-issues.md` dengan prioritas: P1 (blocker), P2 (high), P3 (nice-to-have) | | |
| TASK-016 | Fix semua bug P1 (blocker) yang ditemukan saat UAT sebelum lanjut ke deployment | | |

### Implementation Phase 4.2 — Final Pre-Launch Verification

- GOAL-002: Menjalankan semua quality checks final untuk memastikan aplikasi siap
  untuk production deployment.

| Task | Description | Completed | Date |
| ---- | ----------- | --------- | ---- |
| TASK-017 | Jalankan full E2E test suite (`npm run test:e2e`) — semua test harus pass (0 failures) | | |
| TASK-018 | Jalankan unit test suite (`npm run test`) — coverage harus ≥ 80% semua metrics | | |
| TASK-019 | Jalankan `npm run build` dan `npm run preview` — verifikasi production build berjalan tanpa error | | |
| TASK-020 | Jalankan Lighthouse audit manual di Chrome DevTools pada production build (`npm run preview`): Performance ≥ 90, Accessibility ≥ 90, SEO ≥ 95, PWA ≥ 80 | | |
| TASK-021 | Verifikasi bundle size melalui output `vite build` dan report visualizer — total JS gzipped harus < 200KB | | |
| TASK-022 | Verifikasi `dist/sitemap.xml` tersedia pada output build dan berisi semua URL yang benar (bersumber dari `public/sitemap.xml` yang dibuat saat `prebuild`) | | |
| TASK-023 | Verifikasi `dist/robots.txt` ada dan berisi konfigurasi yang benar | | |
| TASK-024 | Verifikasi `dist/manifest.json` valid: `name`, `icons`, `start_url`, `display: standalone` | | |
| TASK-025 | Cross-browser smoke test: buka production build di Chrome, Firefox, Safari (jika tersedia), Edge — verifikasi halaman utama berfungsi | | |

### Implementation Phase 4.3 — Production Deployment

- GOAL-003: Mendeploy aplikasi ke production, mengkonfigurasi custom domain (jika ada),
  dan membuat release tag v1.0.0 di GitHub.

| Task | Description | Completed | Date |
| ---- | ----------- | --------- | ---- |
| TASK-026 | Konfigurasi environment variables di Vercel/Netlify: `GA_MEASUREMENT_ID`, `BASE_URL`, `VITE_APP_VERSION=1.0.0` | | |
| TASK-027 | Trigger production deployment via GitHub Actions `workflow_dispatch` atau buat tag `v1.0.0` di GitHub | | |
| TASK-028 | Verifikasi production deployment berhasil: buka URL production dan verifikasi landing page `/` tampil dengan benar | | |
| TASK-029 | Konfigurasi custom domain di Vercel/Netlify (jika domain sudah disiapkan) | | |
| TASK-030 | Verifikasi HTTPS aktif di production URL (padlock hijau di browser) | | |
| TASK-031 | Verifikasi SPA fallback berfungsi di production: buka URL `/pasal/1` langsung → konten tampil tanpa 404 | | |
| TASK-032 | Verifikasi Service Worker aktif di production: DevTools → Application → Service Workers → status "activated and running" | | |
| TASK-033 | Buat GitHub Release: tag `v1.0.0`, release notes berisi fitur utama yang di-launch | | |
| TASK-034 | Update `CHANGELOG.md` dengan semua perubahan dari Phase 1–4 | | |

### Implementation Phase 4.4 — Setup Monitoring

- GOAL-004: Menyiapkan infrastruktur monitoring untuk Core Web Vitals, uptime,
  dan Google Search Console agar performa dapat dipantau pasca-launch.

| Task | Description | Completed | Date |
| ---- | ----------- | --------- | ---- |
| TASK-035 | Buka Google Search Console (search.google.com/search-console) — tambahkan property dengan domain production | | |
| TASK-036 | Verifikasi domain ownership di Google Search Console (via DNS TXT record atau HTML file) | | |
| TASK-037 | Submit `sitemap.xml` ke Google Search Console: Sitemaps → Add new sitemap → `https://[BASE_URL]/sitemap.xml` | | |
| TASK-038 | Setup Core Web Vitals monitoring: Google Search Console → Core Web Vitals report (data mulai terkumpul setelah ~2 minggu) | | |
| TASK-039 | Verifikasi GA4 data masuk: Google Analytics → Realtime report → buka production URL di browser → verifikasi page view tercatat | | |
| TASK-040 | Setup uptime monitoring: gunakan UptimeRobot (gratis) atau Vercel/Netlify built-in monitoring untuk alert jika site down | | |
| TASK-041 | Dokumentasikan production URLs, monitoring dashboards, dan credentials di `docs/production.md` (JANGAN simpan credentials di repository) | | |

### Implementation Phase 4.5 — Post-Launch Bug Fix Sprint

- GOAL-005: Memantau dan memperbaiki bug-bug yang ditemukan dalam 1–2 minggu pertama
  pasca-launch, serta menyelesaikan isu P2 dari UAT yang belum diperbaiki.

| Task | Description | Completed | Date |
| ---- | ----------- | --------- | ---- |
| TASK-042 | Monitor GA4 analytics selama minggu pertama: page views, bounce rate, search queries populer | | |
| TASK-043 | Monitor error di browser console (via Sentry atau manual review GA4 exception tracking) | | |
| TASK-044 | Fix bug P2 yang tertunda dari UAT (TASK-015) jika ada | | |
| TASK-045 | Fix bug yang dilaporkan pengguna (via Google Forms saran masukan dari F-11) | | |
| TASK-046 | Cek Google Search Console setelah 1 minggu: verifikasi halaman mulai terindeks, tidak ada coverage errors | | |
| TASK-047 | Jalankan Lighthouse audit kedua di production setelah 1 minggu: verifikasi scores tidak menurun | | |
| TASK-048 | Review Core Web Vitals setelah 2 minggu (jika data sudah tersedia di GSC) | | |

---

## 3. Alternatives

- **ALT-001**: Soft launch ke subset pengguna (feature flags) — tidak diperlukan karena aplikasi
  tidak memiliki auth/personalization; semua konten publik dan statis
- **ALT-002**: Blue-green deployment — tidak diperlukan; Vercel/Netlify sudah memiliki
  atomic deployment bawaan yang zero-downtime
- **ALT-003**: Monitoring dengan Datadog atau New Relic — overkill untuk project ini;
  UptimeRobot gratis + GA4 + Google Search Console sudah mencukupi

---

## 4. Dependencies

- **DEP-001**: Phase 3 selesai — Lighthouse CI pass, semua fitur PWA + SEO terimplementasi
- **DEP-002**: Akun Vercel atau Netlify aktif dengan billing yang sesuai
- **DEP-003**: Custom domain (opsional) — perlu dikonfigurasi di DNS provider sebelum TASK-029
- **DEP-004**: Google Analytics 4 account aktif dengan Measurement ID
- **DEP-005**: Google Search Console account aktif
- **DEP-006**: Google Forms URLs (koreksi pasal + saran masukan) — sudah ada dari PRD
- **DEP-007**: GitHub tag/release mechanism — untuk trigger production deployment

---

## 5. Files

File baru yang dibuat di Phase 4:

- **FILE-001**: `docs/uat-issues.md` — catatan bug/isu dari UAT dengan prioritas
- **FILE-002**: `docs/production.md` — production URLs, monitoring dashboards (tanpa credentials)
- **FILE-003**: `CHANGELOG.md` — changelog lengkap Phase 1–4

File yang dimodifikasi di Phase 4:

- **FILE-004**: `package.json` — bump versi ke `1.0.0`
- **FILE-005**: `README.md` — update status SDLC badge (Deployment ✅), tambah production URL

---

## 6. Testing

- **TEST-001**: Full E2E test suite pass — 0 failures (Playwright)
- **TEST-002**: Unit test coverage ≥ 80% (Vitest)
- **TEST-003**: UAT checklist scope v1 yang disetujui — semua ✅
- **TEST-004**: Lighthouse Production audit — Performance≥90, Accessibility≥90, SEO≥95, PWA≥80
- **TEST-005**: Cross-browser smoke test — Chrome, Firefox, Edge, Safari
- **TEST-006**: Mobile responsif test — iPhone 375px + Android 360px
- **TEST-007**: Offline mode test di production URL (Chrome DevTools → Network → Offline)
- **TEST-008**: SPA fallback test — buka 3 route secara langsung di production

---

## 7. Risks & Assumptions

- **RISK-001**: Bug blocker (P1) ditemukan saat UAT yang membutuhkan banyak waktu fix
  — **Mitigasi**: Alokasikan buffer 2–3 hari untuk bug fix sebelum deployment date; jika
  tidak dapat diselesaikan, pertimbangkan launch dengan bug P1 di-track sebagai known issue
- **RISK-002**: Lighthouse SEO score turun di production karena redirect domain
  — **Mitigasi**: Set canonical URL dengan benar di `updateMetaTags()` menggunakan domain production
- **RISK-003**: Google Search Console verification gagal (DNS propagation lambat)
  — **Mitigasi**: Setup verification minimal 24–48 jam sebelum launch date untuk memberikan
  waktu DNS propagasi
- **RISK-004**: Service worker hasil build lama masih ter-cache di browser tester
  — **Mitigasi**: Gunakan `registerType: 'autoUpdate'` di `vite-plugin-pwa`, lakukan hard refresh,
  dan clear Service Worker di DevTools sebelum testing production bila diperlukan
- **ASSUMPTION-001**: Domain/hosting sudah dipilih dan dikonfigurasi sebelum TASK-027
- **ASSUMPTION-002**: GA4 Measurement ID sudah tersedia sebelum production deployment
- **ASSUMPTION-003**: Tim sudah melakukan internal review dan setuju aplikasi siap launch
  sebelum TASK-015 (UAT) dimulai

---

## 8. Related Specifications / Further Reading

- [PRD: Pancasila & UUD 1945 Web App](../prd_pasaluud1945_webapp.md) — §7 Success Metrics, §9 Milestones
- [Spesifikasi Arsitektur](../spec/spec-architecture-pasaluud1945-webapp.md) — §5 Acceptance Criteria (AC-001 s.d. AC-024)
- [Spesifikasi Process Workflow](../spec/spec-process-workflow-pasaluud1945.md) — §6.5 Phase 4 Launch, §7 Deployment Workflow
- [Spesifikasi SEO & Metadata](../spec/spec-seo-pasaluud1945.md) — §10 Monitoring & Maintenance
- [Master Plan](./architecture-overview-pasaluud1945-1.md)
- [Phase 3 Plan](./feature-phase3-pwa-sharing-seo-1.md)
- [Google Search Console Help](https://support.google.com/webmasters/answer/9128668)
- [Vercel Deployment Documentation](https://vercel.com/docs/deployments/overview)
- [Netlify Deployment Documentation](https://docs.netlify.com/site-deploys/overview/)
