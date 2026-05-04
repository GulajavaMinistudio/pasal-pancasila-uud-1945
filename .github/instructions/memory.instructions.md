---
applyTo: '**'
---

# Memory - Preferensi Pengguna

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

## Implementation Progress

### Phase 1 — SELESAI ✅ (2026-05-02)

- Semua TASK-001 s.d. TASK-059 selesai
- Unit/Component tests: **149 passed**, coverage 98.87% lines, 97.82% functions, 91.6% branches
- E2E tests: **116 passed** (Chromium + Firefox)
- Dokumen: `plan/feature-phase1-fondasi-setup-1.md` — status `Completed`

### Phase 2 — SELESAI ✅ (2026-05-04)

- Dokumen planning: `plan/feature-phase2-konten-pencarian-1.md` — status `Completed`
- Semua TASK-001 s.d. TASK-065 selesai
- Unit/Component tests: **309 passed**
- E2E tests: **354 passed** (Chromium + Firefox)
- Verifikasi pipeline lokal (`npm run lint`, `npm run type-check`, `npm run test`, `npx playwright test --project=chromium --project=firefox`, `npm run build`) lulus semua
- Perilaku final penting: `/sila/:nomor` invalid redirect ke 404 (bukan inline error state)

### Phase 3 — BELUM DIMULAI ⏳ (2026-05-04)

- Dokumen planning: `plan/feature-phase3-pwa-sharing-seo-1.md`
- Fokus berikutnya: PWA foundation, sharing features, SEO implementation sesuai urutan task di planning
- **CATATAN PENTING**: Saat memulai sesi baru Phase 3, gunakan `@BeastModeDev` atau `@GodModeDev` dan referensikan `plan/feature-phase3-pwa-sharing-seo-1.md` sebagai panduan utama
