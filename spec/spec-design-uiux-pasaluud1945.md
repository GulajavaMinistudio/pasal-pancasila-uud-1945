---
title: Spesifikasi Design System & UI/UX Aplikasi Web Pancasila & UUD 1945
version: 1.0.0
date_created: 2026-04-28
last_updated: 2026-04-29
owner: UI/UX & Development Team
status: final
tags:
  - design
  - uiux
  - webapp
  - pwa
  - specification
---
<!-- markdownlint-disable -->

# 1. Introduction

## 1.1 Purpose & Scope

Dokumen ini mendefinisikan *Design System* dan spesifikasi *User Interface / User Experience (UI/UX)* untuk aplikasi web **Pancasila & UUD 1945**. Spesifikasi ini mengacu pada identitas visual aplikasi Android existing (v4.0.0) dan memetakannya ke ekosistem web dengan mempertahankan konsistensi brand sekaligus mengoptimalkan pengalaman pengguna di berbagai perangkat dan ukuran layar.

**Scope:**

- Color palette dan sistem warna berbasis tema aplikasi Android
- Tipografi, hierarki teks, dan skala font untuk web
- Komponen UI reusable (header, card, list item, search bar, badge, button)
- Layout responsif untuk mobile, tablet, dan desktop
- Pola navigasi dan struktur halaman
- Animasi, transisi, dan micro-interactions
- Aksesibilitas visual (kontras, ukuran tap target, motion preferences)

**Target Audience:**

- UI/UX Designer (desain komponen dan layout)
- Frontend Developer (implementasi Bootstrap dan komponen)
- QA Engineer (verifikasi visual dan accessibility compliance)

---

## 2. Definitions

| Istilah                | Definisi                                                                            |
| ---------------------- | ----------------------------------------------------------------------------------- |
| **Design Token**       | Variabel desain abstrak (warna, ukuran, radius) yang digunakan di seluruh sistem UI |
| **Breakpoint**         | Titik lebar viewport di mana layout berubah (mobile, tablet, desktop)               |
| **Tap Target**         | Area minimum yang dapat diklik/ditap oleh pengguna (disarankan >= 44x44px)          |
| **Elevation / Shadow** | Efek bayangan yang memberikan kesan kedalaman pada elemen UI                        |
| **WCAG AA**            | Level kepatuhan aksesibilitas Web Content Accessibility Guidelines 2.1              |
| **Rem**                | Unit relatif pada CSS yang berbasis ukuran font root (default 16px)                 |
| **Hex Color**          | Notasi warna 6-digit dengan format `#RRGGBB`                                        |

---

## 3. Requirements, Constraints & Guidelines

### 3.1 Design Requirements

- **REQ-DES-001**: Warna primary harus identik dengan aplikasi Android: `#C62828` (merah tua)
- **REQ-DES-002**: Warna accent/indicator harus identik: `#FFB300` (kuning/emas) dan `#E64A19` (orange)
- **REQ-DES-003**: Background halaman utama harus putih `#ffffff`; background sekunder `#f2f2f2`
- **REQ-DES-004**: Teks konten utama menggunakan warna `#5d5d5d` (abu-abu gelap)
- **REQ-DES-005**: Teks sekunder/metainfo menggunakan warna `#989898` (abu-abu muda)
- **REQ-DES-006**: Ukuran font minimal pada konten teks adalah `16px` (setara 1rem) pada mobile
- **REQ-DES-007**: Header navigasi harus menggunakan background merah primary dengan teks putih
- **REQ-DES-008**: Setiap elemen interaktif harus memiliki tap target minimum `44x44px`
- **REQ-DES-009**: Badge keterangan amandemen menggunakan warna hijau `#53d397`
- **REQ-DES-010**: Border radius card mengikuti pola Material Design (8px)
- **REQ-DES-011**: Input pencarian menggunakan background `#ECEFF1` dengan border radius 4px
- **REQ-DES-012**: Divider/garis pemisah menggunakan warna `#dbdbdb` (1px solid)

### 3.2 Responsive Requirements

- **REQ-DES-013**: Layout mobile (< 768px): tab navigasi horizontal scroll, konten full-width, padding 16px
- **REQ-DES-014**: Layout tablet (768px - 1023px): sidebar navigasi collapsible, konten 2/3 width
- **REQ-DES-015**: Layout desktop (>= 1024px): sidebar navigasi fixed kiri, konten utama di kanan dengan max-width 900px
- **REQ-DES-016**: Font size heading menyesuaikan: mobile `1.25rem` (20px), tablet/desktop `1.5rem` (24px)
- **REQ-DES-017**: Tidak ada scroll horizontal pada viewport >= 320px

### 3.3 Accessibility Constraints

- **CON-DES-001**: Rasio kontras teks terhadap background minimal 4.5:1 (WCAG 2.1 AA)
- **CON-DES-002**: Konten harus tetap terbaca saat browser zoom 200%
- **CON-DES-003**: Animasi harus menghormati `prefers-reduced-motion`
- **CON-DES-004**: Semua elemen interaktif harus memiliki `:focus-visible` state yang jelas

### 3.4 Guidelines

- **GUD-DES-001**: Gunakan CSS custom properties (variables) untuk semua design token agar konsisten dan mudah di-maintain
- **GUD-DES-002**: Implementasikan dark mode sebagai enhancement opsional (fase berikutnya)
- **GUD-DES-003**: Gunakan `box-shadow` subtle untuk card agar tidak terlalu flat (elevation 1-2dp)
- **GUD-DES-004**: Berikan visual feedback pada hover dan active state untuk semua elemen klikabel
- **GUD-DES-005**: Pertahankan padding horizontal 16px (1rem) sebagai standar di seluruh halaman
- **GUD-DES-006**: Gunakan `rem` unit untuk semua ukuran agar mengikuti user browser preferences

---

## 4. Interfaces & Data Contracts

### 4.1 Design Token Interface (CSS Custom Properties untuk Bootstrap Customization)

Berikut adalah kontrak design token yang dapat di-override melalui CSS custom properties untuk kustomisasi tema Bootstrap:

```css
/*scss: src/assets/_variables.scss */

// Override Bootstrap default colors untuk menyesuaikan tema Android
$primary: #C62828;
$secondary: #5d5d5d;
$success: #53d397;
$warning: #FFB300;
$danger: #E64A19;
$light: #f2f2f2;
$dark: #212529;

// Custom colors untuk konsistensi dengan Android
$merah-primary: #C62828;
$merah-primary-dark: #B71C1C;
$orange-accent: #E64A19;
$orange-indicator: #FFB300;

$surface-variant: #ECEFF1;
$text-primary: #5d5d5d;
$text-secondary: #989898;
$divider-color: #dbdbdb;

/* CSS Custom Properties (fallback jika tidak menggunakan Sass) */
:root {
  --color-primary: #C62828;
  --color-primary-dark: #B71C1C;
  --color-primary-light: #E53935;
  --color-accent: #E64A19;
  --color-accent-indicator: #FFB300;
  --color-accent-orange: #E64A19;

  --color-background: #ffffff;
  --color-background-secondary: #f2f2f2;
  --color-surface: #ffffff;
  --color-surface-variant: #ECEFF1;

  --color-text-primary: #5d5d5d;
  --color-text-secondary: #989898;
  --color-text-on-primary: #ffffff;
  --color-text-on-accent: #ffffff;

  --color-divider: #dbdbdb;
  --color-border: #e0e0e0;

  --color-badge-amandemen: #53d397;
  --color-badge-amandemen-text: #ffffff;

  /* Typography (Bootstrap default: 1rem = 16px) */
  --font-family-base: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;

  /* Spacing menggunakan Bootstrap spacing scale */

  /* Border radius */
  --border-radius-sm: 0.25rem;  /* ~4px */
  --border-radius-md: 0.5rem;   /* ~8px - Bootstrap default */
  --border-radius-lg: 0.75rem; /* ~12px */
}
```

### 4.2 Bootstrap Configuration Contract

```javascript
// scss/bootstrap-custom.scss
// Kustomisasi Bootstrap 5 untuk menyesuaikan tema Android

// 1. Color system override
$primary: #C62828;
$secondary: #5d5d5d;
$success: #53d397;
$warning: #FFB300;
$danger: #E64A19;

// 2. Link color override
$link-color: #C62828;

// 3. Component overrides
$border-radius: 0.5rem;
$border-radius-sm: 0.25rem;
$border-radius-lg: 0.75rem;

// 4. Spacing override (mengikuti Android dp → rem conversion)
// Android 16dp = Bootstrap 1rem (16px base)
$spacer: 1rem;

// 5. Import Bootstrap
@import "bootstrap/scss/bootstrap";

// 6. Custom utilities untuk design tokens
$utilities: map-merge(
  $utilities,
  (
    "background-color": (
      class: bg,
      values: map-merge(
        $theme-colors,
        (
          "surface-variant": #ECEFF1,
          "white-soft": #f2f2f2,
        )
      )
    ),
    "text-color": (
      class: text-android,
      values: (
        "primary": #5d5d5d,
        "secondary": #989898,
      )
    )
  )
);
```

### 4.3 Bootstrap Component Usage Mapping

| Komponen Android     | Komponen Bootstrap  | Class/Attribute                                          |
| -------------------- | ------------------- | -------------------------------------------------------- |
| Toolbar/AppBar merah | Navbar              | `navbar navbar-dark bg-primary`                          |
| TabLayout            | Nav tabs atau Pills | `nav nav-tabs` atau `nav nav-pills`                      |
| Tab indicator kuning | Active state        | `.nav-tabs .nav-link.active` dengan border-bottom kuning |
| CardView             | Card                | `card`, `card-body`, `card-title`                        |
| RecyclerView (list)  | List group          | `list-group`, `list-group-item`                          |
| Search EditText      | Form input          | `form-control`                                           |
| FAB (tombol bulat)   | Button              | `btn btn-primary rounded-circle`                         |
| Badge                | Badge               | `badge bg-success`                                       |
| Dialog               | Modal               | `modal fade`, `modal-dialog`, `modal-content`            |
| Progress indicator   | Spinner             | `spinner-border text-primary`                            |

---

## 5. Acceptance Criteria

### 5.1 Warna dan Brand Identity

- **AC-DES-001**: Given halaman dimuat, When dicek dengan color picker, Then background header menggunakan `#C62828`
- **AC-DES-002**: Given tab navigasi aktif, When dicek, Then indicator aktif menggunakan `#FFB300` dengan ketebalan 3px
- **AC-DES-003**: Given badge amandemen ditampilkan, When dicek, Then background badge menggunakan `#53d397` dengan teks putih
- **AC-DES-004**: Given input pencarian dirender, When dicek, Then background input menggunakan `#ECEFF1`
- **AC-DES-005**: Given konten pasal ditampilkan, When dicek, Then teks isi pasal menggunakan `#5d5d5d` dengan ukuran `16px`

### 5.2 Tipografi

- **AC-DES-006**: Given halaman dibuka di mobile, When dicek, Then font size minimal konten adalah `16px` (1rem)
- **AC-DES-007**: Given heading halaman dirender, When dicek di desktop, Then ukuran heading adalah `24px` (1.5rem) dengan weight 700
- **AC-DES-008**: Given subjudul pasal ditampilkan, When dicek, Then menggunakan ukuran `15px` (0.9375rem) dengan warna `#989898`

### 5.3 Layout Responsif

- **AC-DES-009**: Given viewport lebar 375px, When halaman dimuat, Then tab navigasi horizontal scrollable dan konten full-width dengan padding 16px
- **AC-DES-010**: Given viewport lebar 1024px, When halaman dimuat, Then sidebar navigasi fixed di kiri dengan lebar 280px dan konten utama di kanan
- **AC-DES-011**: Given viewport di-resize dari desktop ke mobile, When transisi berlangsung, Then layout beralih ke mobile tanpa scroll horizontal

### 5.4 Komponen UI

- **AC-DES-012**: Given card konten dirender, When dicek, Then card memiliki background putih, border-radius 8px, dan shadow subtle
- **AC-DES-013**: Given tombol "Bagikan" ditampilkan, When dicek, Then memiliki tap target minimum 44x44px dan visual feedback pada hover
- **AC-DES-014**: Given search bar aktif, When dicek, Then memiliki icon search di kiri, placeholder `#989898`, dan teks input `#5d5d5d`

### 5.5 Aksesibilitas

- **AC-DES-015**: Given halaman diuji dengan Lighthouse, When audit accessibility berjalan, Then skor >= 90 dan kontras teks memenuhi WCAG AA
- **AC-DES-016**: Given pengguna mengaktifkan reduced motion, When animasi berlangsung, Then animasi di-disable atau di-substitusi dengan transisi instan

---

## 6. Test Automation Strategy

### 6.1 Visual Testing

- **Tools**: Playwright + `@playwright/test` dengan screenshot comparison
- **Scope**: Full-page screenshots pada breakpoint 375px, 768px, 1024px, dan 1440px
- **Threshold**: Perbedaan pixel maksimal 0.1% antar screenshot baseline

### 6.2 Accessibility Testing

- **Tools**: Axe Core (via Playwright) + Lighthouse CI
- **Checks**:
  - Color contrast ratio >= 4.5:1 untuk semua teks
  - Semua interactive elements memiliki accessible name
  - Heading hierarchy logis (h1 -> h2 -> h3 tanpa skip)
  - Focus order mengikuti DOM order

### 6.3 Responsive Testing

- **Tools**: Playwright device emulation + BrowserStack (manual smoke test)
- **Devices**:
  - Mobile: iPhone 12 Pro (390px), Samsung Galaxy S20 (360px)
  - Tablet: iPad Air (820px)
  - Desktop: 1440px viewport

---

## 7. Rationale & Context

### 7.1 Pemetaan Warna dari Android ke Web

Aplikasi Android menggunakan palet warna Material Design klasik dengan dominasi merah nasional Indonesia. Pemetaan ini dipertahankan untuk menjaga konsistensi brand dan memberikan rasa familiar kepada pengguna existing yang beralih ke web:

| Warna Android                | Hex       | Penggunaan di Web                                       |
| ---------------------------- | --------- | ------------------------------------------------------- |
| `colorPrimary`               | `#C62828` | Header, primary button, active tab indicator background |
| `colorPrimaryDark`           | `#B71C1C` | Header shadow, hover state primary elements             |
| `colorAccent`                | `#E64A19` | Secondary button, link hover, icon tint                 |
| `orange_indicator`           | `#FFB300` | Tab active indicator, highlight, progress indicator     |
| `warnateksjudul`             | `#5d5d5d` | Body text, heading, pasal content                       |
| `warnatekssubjudul`          | `#989898` | Subtitle, meta info, placeholder text                   |
| `putihabu`                   | `#f2f2f2` | Page background secondary, search page background       |
| `abubayangan`                | `#dbdbdb` | Divider, border, disabled state                         |
| `later_keterangan_amandemen` | `#53d397` | Amendment badge, success indicator                      |
| `latar_spinner`              | `#ECEFF1` | Search input background, card variant                   |

### 7.2 Tipografi: Dari SP ke REM

Aplikasi Android menggunakan unit `sp` (scale-independent pixels) yang terskala berdasarkan user font preference di sistem. Di web, unit `rem` memberikan behavior serupa karena berbasis root font size yang dapat diubah oleh user melalui browser settings:

| Android SP | Web REM   | Pixel (16px base) | Penggunaan                            |
| ---------- | --------- | ----------------- | ------------------------------------- |
| 12sp       | 0.75rem   | 12px              | Caption, badge text                   |
| 15sp       | 0.9375rem | 15px              | Subtitle, placeholder, tab text       |
| 16sp       | 1rem      | 16px              | Body text, list item, heading toolbar |
| 18sp       | 1.125rem  | 18px              | Section heading, dialog title         |
| 20sp       | 1.25rem   | 20px              | Page title mobile                     |

### 7.3 Layout Pattern: Dari Android ke Web

Aplikasi Android menggunakan pola:
- **Toolbar** merah dengan teks putih + TabLayout horizontal scrollable
- **Drawer** navigasi dari kiri untuk menu tambahan
- **CardView** sebagai container konten utama
- **RecyclerView** untuk daftar item yang panjang

Di web, pola ini diterjemahkan menjadi:
- **Sticky Header** merah dengan teks putih + horizontal scrollable tab nav
- **Sidebar / Off-canvas menu** di mobile (hamburger menu), sidebar fixed di desktop
- **Card component** dengan shadow dan border-radius
- **Virtual scrolling / pagination** tidak diperlukan karena dataset < 500 item

---

## 8. Dependencies & External Integrations

- **PLT-DES-001**: Bootstrap 5.3+ — CSS framework untuk UI components dan responsive grid
- **PLT-DES-002**: Bootstrap Icons — Icon library SVG untuk menggantikan icon Android drawable
- **PLT-DES-003**: Google Fonts (Opsional) — Font `Inter` di-load dari Google Fonts CDN (`https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap`) — bisa juga menggunakan Bootstrap default fonts
- **PLT-DES-004**: Popper.js (included with Bootstrap) — Untuk dropdown, tooltip, dan popover components

---

## 9. Component Specifications

### 9.1 App Header

```
+-------------------------------------------------------------+
|  [Menu]  Pancasila & UUD 1945              [Search] [Share] |
+-------------------------------------------------------------+
```

- **Height**: 56px (`--header-height`)
- **Background**: `var(--color-primary)` (#C62828)
- **Text**: Putih, 16px, weight 700
- **Shadow**: `var(--shadow-sm)` pada scroll
- **Position**: Sticky top, z-index 50
- **Tap Target**: Icon minimal 44x44px dengan padding

### 9.2 Tab Navigation

```
+-------------------------------------------------------------+
|  Pancasila | Butir | Pembukaan | Pasal | Bab | ...  |
+-------------------------------------------------------------+
           ^^^ Indicator kuning 3px
```

- **Background**: `var(--color-primary)` (#C62828)
- **Text Inactive**: Putih transparan 80% (`rgba(255,255,255,0.8)`)
- **Text Active**: Putih opaque, weight 700
- **Indicator**: `var(--color-accent-indicator)` (#FFB300), height 3px, border-radius full
- **Behavior**: Horizontal scroll pada mobile, flex-wrap pada desktop
- **Position**: Sticky di bawah header

### 9.3 Content Card

```
+------------------------------------------+
|                                          |
|  [Icon]  Judul Item                      |
|          Subjudul / deskripsi            |
|                                          |
+------------------------------------------+
```

- **Background**: `var(--color-surface)` (#ffffff)
- **Border Radius**: 8px (`--radius-md`)
- **Shadow**: `var(--shadow-sm)`
- **Padding**: 16px (`--space-4`)
- **Margin**: 8px vertical, 16px horizontal
- **Hover**: Shadow meningkat ke `--shadow-md`, translateY -1px

### 9.4 Search Bar

```
+------------------------------------------+
|  [Q]  Cari pasal UUD 1945...             |
+------------------------------------------+
```

- **Background**: `var(--color-surface-variant)` (#ECEFF1)
- **Border Radius**: 4px (`--radius-sm`)
- **Padding**: 10px 16px
- **Icon**: Search icon `#989898`, size 20px
- **Text**: `#5d5d5d`, 15px
- **Placeholder**: `#989898`, 15px
- **Focus**: Border 2px solid `#C62828`, shadow ring merah

### 9.5 Pasal List Item

```
+------------------------------------------+
|  [48dp]  Pasal 7A                        |
|  Icon    Isi singkat ayat pertama...     |
+------------------------------------------+
```

- **Icon Container**: 48x48px, background `var(--color-primary)`, border-radius 8px, teks putih bold
- **Title**: 16px, weight 700, `#5d5d5d`
- **Subtitle**: 15px, `#989898`
- **Divider**: 1px `#dbdbdb` di bawah item
- **Tap Target**: Full width, minimum height 64px

### 9.6 Ayat Detail Item

```
+------------------------------------------+
|  +---+  Isi ayat pasal yang panjang      |
|  | 1 |  dan mungkin multi-line...        |
|  +---+                                   |
+------------------------------------------+
```

- **Number Badge**: 36x36px, background `var(--color-primary)`, border-radius 4px, teks putih bold 16px
- **Text**: 16px, `#5d5d5d`, line-height 1.75
- **Margin**: 10px vertical, 16px horizontal

### 9.7 Badge Amandemen

```
+----------+
| Amandemen|
|    III   |
+----------+
```

- **Background**: `var(--color-badge-amandemen)` (#53d397)
- **Text**: Putih, 12px, weight 700
- **Border Radius**: 4px
- **Padding**: 4px 8px

---

## 10. Examples & Edge Cases

### 10.1 Contoh Bootstrap Implementation Header (Navbar)

```html
<!-- Menggunakan Bootstrap Navbar component -->
<nav class="navbar navbar-dark bg-primary sticky-top shadow-sm">
  <div class="container-fluid px-3">
    <button class="btn btn-link text-white p-2" type="button" aria-label="Menu">
      <i class="bi bi-list fs-4"></i>
    </button>
    <a class="navbar-brand fw-bold text-white" href="/">Pancasila & UUD 1945</a>
    <div class="d-flex gap-2">
      <button class="btn btn-link text-white p-2" type="button" aria-label="Search">
        <i class="bi bi-search"></i>
      </button>
      <button class="btn btn-link text-white p-2" type="button" aria-label="Share">
        <i class="bi bi-share"></i>
      </button>
    </div>
  </div>
</nav>
```

### 10.2 Contoh Bootstrap Card Implementation

```html
<!-- Menggunakan Bootstrap Card component -->
<article class="card shadow-sm mb-2 mx-3">
  <div class="card-body p-3">
    <div class="d-flex align-items-center gap-3">
      <div class="bg-primary text-white rounded-3 d-flex align-items-center justify-content"
           style="width: 48px; height: 48px; font-size: 1rem; font-weight: 700;">
        1
      </div>
      <div class="flex-grow-1">
        <h3 class="card-title text-android-primary fw-bold mb-1" style="font-size: 1rem; color: #5d5d5d;">
          Pasal 1
        </h3>
        <p class="card-text text-secondary small mb-0" style="color: #989898;">
          Negara Indonesia ialah Negara Kesatuan yang berbentuk Republik.
        </p>
      </div>
      <i class="bi bi-chevron-right text-secondary"></i>
    </div>
  </div>
</article>
```

### 10.3 Contoh Bootstrap Tabs Navigation

```html
<!-- Menggunakan Bootstrap Nav tabs dengan custom indicator -->
<ul class="nav nav-tabs border-0 overflow-auto" role="tablist"
    style="background-color: #C62828; white-space: nowrap;">
  <li class="nav-item">
    <a class="nav-link active text-white fw-bold" data-bs-toggle="tab" href="#pancasila"
       style="border-bottom: 3px solid #FFB300; background: transparent;">
      Pancasila
    </a>
  </li>
  <li class="nav-item">
    <a class="nav-link text-white-50" data-bs-toggle="tab" href="#butir"
       style="border-bottom: 3px solid transparent;">
      Butir
    </a>
  </li>
  <li class="nav-item">
    <a class="nav-link text-white-50" data-bs-toggle="tab" href="#pembukaan"
       style="border-bottom: 3px solid transparent;">
      Pembukaan
    </a>
  </li>
  <li class="nav-item">
    <a class="nav-link text-white-50" data-bs-toggle="tab" href="#pasal"
       style="border-bottom: 3px solid transparent;">
      Pasal
    </a>
  </li>
</ul>
```

### 10.4 Contoh Bootstrap Badge untuk Amandemen

```html
<!-- Menggunakan Bootstrap Badge -->
<span class="badge rounded-1" style="background-color: #53d397; font-size: 0.75rem; padding: 4px 8px;">
  Amandemen III
</span>
```

### 10.5 Contoh Bootstrap List Group untuk Pasal List

```html
<!-- Menggunakan Bootstrap List Group -->
<div class="list-group">
  <a href="/pasal/1" class="list-group-item list-group-item-action d-flex align-items-center gap-3 py-3">
    <div class="bg-primary text-white rounded-2 d-flex align-items-center justify-content flex-shrink-0"
         style="width: 36px; height: 36px; font-size: 0.875rem; font-weight: 700;">
      1
    </div>
    <div class="flex-grow-1">
      <h4 class="mb-0 fw-bold" style="font-size: 1rem; color: #5d5d5d;">Pasal 1</h4>
      <small class="text-secondary" style="color: #989898;">Negara Indonesia ialah...</small>
    </div>
    <i class="bi bi-chevron-right text-secondary"></i>
  </a>
  <a href="/pasal/2" class="list-group-item list-group-item-action d-flex align-items-center gap-3 py-3">
    <!-- ... -->
  </a>
</div>
```

### 10.3 Edge Cases

| Skenario                                   | Handling                                                                                                                                      |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Font `Inter` gagal dimuat                  | Fallback ke sistem font stack (`-apple-system`, `Segoe UI`, `Roboto`)                                                                         |
| User mengubah root font size ke 20px       | Semua ukuran `rem` menyesuaikan secara proporsional                                                                                           |
| Sistem mode gelap aktif                    | Tambahkan media query `prefers-color-scheme: dark` untuk mengubah background ke `#121212` dan text ke `#e0e0e0` (enhancement fase berikutnya) |
| Viewport < 320px                           | Padding horizontal berkurang ke 12px, font size tetap 16px minimum                                                                            |
| Scroll pada tab navigasi                   | Gunakan `overflow-x-auto` dengan `scrollbar-hide` dan indikator scroll shadow                                                                 |
| Badge amandemen pada pasal tanpa amandemen | Badge tidak dirender sama sekali (jangan render elemen kosong)                                                                                |

---

## 11. Related Specifications / Further Reading

- [Spesifikasi Arsitektur: Pancasila & UUD 1945 Web App](./spec-architecture-pasaluud1945-webapp.md)
- [Spesifikasi Data Schema](./spec-data-schema-pasaluud1945.md)
- [Spesifikasi Process Workflow](./spec-process-workflow-pasaluud1945.md)
- [Spesifikasi SEO & Metadata](./spec-seo-pasaluud1945.md)
- [PRD: Pancasila & UUD 1945 Web App](../prd_pasaluud1945_webapp.md)
- [Material Design 3 Color System](https://m3.material.io/styles/color/system/overview)
- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
- [WCAG 2.1 Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Google Fonts: Inter](https://fonts.google.com/specimen/Inter)

---

*Dokumen ini merupakan spesifikasi design system v1.0.0 dan harus direview bersama dengan spesifikasi arsitektur sebelum memasuki fase Implementation Planning.*
