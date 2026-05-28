---
goal: Remediasi Keamanan & Arsitektur (Hasil Code Review Phase 1 & 2)
version: 1.0
date_created: 2026-05-25
last_updated: 2026-05-25
owner: Code Review Specialist
status: "Completed"
tags: ["refactor", "clean-code", "architecture", "security"]
---

# Introduction

![Status: Completed](https://img.shields.io/badge/status-Completed-green)

<!-- markdownlint-disable -->

Dokumen ini merupakan tindak lanjut dari hasil code review terhadap implementasi Phase 1 (Fondasi & Setup) dan Phase 2 (Konten & Pencarian) dari aplikasi web Pancasila & UUD 1945. Secara keseluruhan kualitas kode sangat baik (skor 8.5/10), namun terdapat beberapa kerentanan keamanan (XSS via unescaped `innerHTML`), kesalahan urutan registrasi rute, dan isu *Don't Repeat Yourself* (DRY) yang perlu ditangani sebelum melanjutkan ke Phase 3.

Tujuan dari plan ini adalah menambal *vulnerabilities* tersebut dan merapikan sisa-sisa implementasi yang tidak sesuai dengan spesifikasi awal (seperti tautan `href` statis pada halaman `NotFoundPage`).

## 1. Requirements & Constraints (Architecture & Security Focus)

- **SEC-001**: Mengimplementasikan *defense-in-depth* dengan menerapkan `HTML escaping` pada seluruh data yang disisipkan melalui `innerHTML`, guna mencegah serangan Cross-Site Scripting (XSS).
- **REQ-001**: Registrasi *dynamic routes* harus ditempatkan sebelum *static routes* yang memiliki pola sama pada modul router, demi menjamin presisi pemetaan URI.
- **REQ-002**: Komponen dan halaman tidak boleh me-render tautan `href` dengan absolute paths secara *hardcoded* untuk memastikan kompatibilitas hosting via GitHub Pages (wajib menggunakan utilitas `toAppHref()`).
- **PRN-001**: Mematuhi prinsip *Don't Repeat Yourself* (DRY) dengan memindahkan logika atau konstanta yang sama (seperti `ROMAN_NUMERALS`) ke file utilitas berbagi.

## 2. Implementation Steps

### Implementation Phase 1: Security Remediation & Routing Fix

- GOAL-001: Menambal celah XSS dan memperbaiki inkonsistensi routing.

| Task     | Description                                                                                                                                   | Completed | Date       |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-001 | Buat `src/utils/sanitize.js` dengan fungsi `escapeHtml()` dan `escapeAttr()`.                                                                 | ✅         | 2026-05-25 |
| TASK-002 | Refaktor 8 file di `src/pages/` (PancasilaPage, SilaDetailPage, dll.) agar menggunakan `escapeHtml()` saat merender data JSON ke `innerHTML`. | ✅         | 2026-05-25 |
| TASK-003 | Perbaiki `src/router/routes.js`: Pindahkan rute `/amandemen/:nomor` agar dideklarasikan sebelum `/amandemen`.                                 | ✅         | 2026-05-25 |
| TASK-004 | Perbaiki `src/pages/NotFoundPage.js` agar semua `href` keluar menggunakan utilitas `toAppHref()`, dan gunakan `setPageTitle()`.               | ✅         | 2026-05-25 |

### Implementation Phase 2: Core Architectural Refactoring & Cleanup

- GOAL-002: Memperbaiki isu DRY dan merapikan komponen agar lebih konsisten.

| Task     | Description                                                                                                       | Completed | Date       |
| -------- | ----------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-005 | Ekstrak konstanta array `ROMAN_NUMERALS` dari `BabPasalListPage` dan `BabPasalDetailPage` ke `pageHelpers.js`.    | ✅         | 2026-05-25 |
| TASK-006 | Tambahkan validasi parameter `nomor` di `AmandemenDetailPage.js` untuk konsistensi dengan halaman detail lainnya. | ✅         | 2026-05-25 |
| TASK-007 | Konsolidasi fungsi `_escapeAttr()` dari komponen (seperti `SearchPasal`) agar mengimpor dari `sanitize.js`.       | ✅         | 2026-05-25 |

## 3. Alternatives

- **ALT-001**: Menggunakan library eksternal `DOMPurify` untuk sanitasi HTML yang masuk ke `innerHTML`. *Keputusan:* Ditolak karena data JSON bersifat statis dan *controlled*, sehingga fungsi *escaping* native Vanilla JS dalam `sanitize.js` sudah cukup dan menjaga arsitektur *zero dependency*.
- **ALT-002**: Memisahkan route registrasi antara *static* dan *dynamic* ke konfigurasi file terpisah. *Keputusan:* Ditolak agar tidak merusak kesederhanaan *router logic* saat ini, cukup di-*reorder* baris kodenya.

## 4. Dependencies

- **DEP-001**: Tidak ada dependensi eksternal baru yang diperkenalkan dalam perbaikan ini.

## 5. Files Affected

- **FILE-001**: `src/utils/sanitize.js` (New)
- **FILE-002**: `src/router/routes.js` (Modify)
- **FILE-003**: `src/pages/NotFoundPage.js` (Modify)
- **FILE-004**: `src/pages/PancasilaPage.js` (Modify)
- **FILE-005**: `src/pages/SilaDetailPage.js` (Modify)
- **FILE-006**: `src/pages/ButirPancasilaPage.js` (Modify)
- **FILE-007**: `src/pages/PembukaanPage.js` (Modify)
- **FILE-008**: `src/pages/PasalListPage.js` (Modify)
- **FILE-009**: `src/pages/PasalDetailPage.js` (Modify)
- **FILE-010**: `src/pages/BabPasalListPage.js` (Modify)
- **FILE-011**: `src/pages/BabPasalDetailPage.js` (Modify)
- **FILE-012**: `src/pages/AmandemenDetailPage.js` (Modify)
- **FILE-013**: `src/components/SearchPasal.js` (Modify)
- **FILE-014**: `src/components/PasalComparisonCard.js` (Modify)
- **FILE-015**: `src/pages/pageHelpers.js` (Modify)
- **FILE-016**: `src/pages/AmandemenPage.js` (Modify)
- **FILE-017**: `src/pages/CariPage.js` (Modify)
- **FILE-018**: `src/pages/UUDAsliPage.js` (Modify)

## 6. Testing

- **TEST-001**: *Unit testing* khusus untuk file `sanitize.js` guna memastikan seluruh karakter khusus terganti dengan entity HTML yang tepat.
- **TEST-002**: Jalankan *E2E testing* Playwright setelah re-ordering route pada halaman Amandemen, pastikan navigasi tetap bekerja tanpa error.
- **TEST-003**: Uji coba unit tests untuk memastikan halaman seperti `NotFoundPage` mengeluarkan tag `href` dengan string *URL path* GitHub Pages yang benar.

## 7. Risks & Assumptions

- **RISK-001**: Fungsi `escapeHtml()` bisa jadi me-render tag HTML yang sah sebagai *plain text*. *Asumsi:* Data dari *source* `public/data/*.json` tidak mengandung *rich text formatting* (HTML), semua bersifat string mentah.
- **RISK-002**: Pemindahan logika ke `sanitize.js` berpotensi menimbulkan error referensi jika ekspor/impor ES6 tidak dilakukan dengan tepat di 8 halaman berbeda.
