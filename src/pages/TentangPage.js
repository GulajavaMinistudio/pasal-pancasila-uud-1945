/**
 * @file src/pages/TentangPage.js
 * @description Halaman tentang aplikasi Pancasila & UUD 1945.
 *
 * Menampilkan:
 *   - Identitas aplikasi (nama, versi, logo)
 *   - Deskripsi singkat
 *   - Sumber data (Sekretariat Jenderal MPR RI)
 *   - Tautan Bantuan & Dukungan (Koreksi Pasal + Saran Masukan via Google Forms)
 *
 * REQ-008: Kedua tautan harus membuka tab baru (target="_blank") dan
 *          dilengkapi rel="noopener noreferrer" untuk keamanan.
 *
 * Referensi:
 *   - planning TASK-030
 *   - spec-architecture §4.2 route /tentang
 *   - mockup: docs/mockup_mobile_web/tentang_aplikasi_mobile/code.html
 *
 * Tidak ada pemuatan data async — halaman ini sepenuhnya statis.
 * Constructor injection dipertahankan agar pola konsisten dengan page lain.
 */

import {
  buildPhaseOneSidebarItems,
  configurePageContainer,
  setPageTitle,
  setSidebarContent,
} from './pageHelpers.js';

/** Versi aplikasi yang ditampilkan di halaman Tentang */
const APP_VERSION = 'v1.0.0';

/** Nama resmi aplikasi */
const APP_NAME = 'Pancasila &amp; UUD 1945';

/**
 * URL tautan Google Forms — placeholder untuk v1.
 * Ganti dengan URL aktual saat form sudah dibuat.
 *
 * @type {{ koreksi: string; saran: string }}
 */
const FORM_URLS = {
  koreksi: '#',
  saran: '#',
};

export class TentangPage {
  /**
   * @param {HTMLElement} containerEl
   * @param {{ sidebarEl: HTMLElement }} deps
   */
  constructor(containerEl, { sidebarEl }) {
    this.container = containerEl;
    this.sidebarEl = sidebarEl;
  }

  mount() {
    configurePageContainer(this.container);
    setSidebarContent(this.sidebarEl, {
      title: 'Navigasi Hukum',
      subtitle: 'Pancasila & UUD 1945',
      items: buildPhaseOneSidebarItems('/tentang'),
    });
    setPageTitle('Tentang Aplikasi');
    this.container.innerHTML = _buildHtml();
  }
}

// =============================================================================
// Private: HTML Builder (pure function, no side effects)
// =============================================================================

/**
 * @returns {string}
 */
function _buildHtml() {
  return `
    <div class="page-shell tentang-page" data-tentang>

      ${_buildHeroSectionHtml()}
      ${_buildDescriptionSectionHtml()}
      ${_buildSumberDataSectionHtml()}
      ${_buildBantuanSectionHtml()}

    </div>
  `;
}

/**
 * @returns {string}
 */
function _buildHeroSectionHtml() {
  return `
    <section class="tentang-hero text-center mb-4" aria-label="Identitas aplikasi">
      <div
        class="tentang-logo-circle mx-auto mb-3"
        role="img"
        aria-label="Logo aplikasi Pancasila dan UUD 1945"
      >
        <i class="bi bi-shield-fill tentang-logo-icon" aria-hidden="true"></i>
      </div>
      <h1 class="tentang-app-name h4 fw-bold mb-2">${APP_NAME}</h1>
      <span class="tentang-version-badge badge rounded-pill border">
        <i class="bi bi-patch-check me-1" aria-hidden="true"></i>
        ${APP_VERSION}
      </span>
    </section>
  `;
}

/**
 * @returns {string}
 */
function _buildDescriptionSectionHtml() {
  return `
    <section class="card border rounded-3 mb-4" aria-label="Deskripsi aplikasi">
      <div class="card-body">
        <p class="tentang-description mb-0 text-secondary text-center lh-lg">
          Aplikasi ini menyediakan akses digital yang mudah dan terstruktur
          untuk membaca naskah otentik Pancasila dan Undang-Undang Dasar
          Negara Republik Indonesia Tahun 1945 beserta amandemennya.
        </p>
      </div>
    </section>
  `;
}

/**
 * @returns {string}
 */
function _buildSumberDataSectionHtml() {
  return `
    <section
      class="card border rounded-3 mb-4 tentang-sumber-data"
      aria-label="Sumber data aplikasi"
    >
      <div class="card-header bg-transparent border-bottom d-flex align-items-center gap-2 py-3">
        <i class="bi bi-bank text-primary" aria-hidden="true"></i>
        <h2 class="h6 fw-semibold mb-0">Sumber Data</h2>
      </div>
      <div class="card-body d-flex align-items-start gap-3">
        <div
          class="tentang-source-icon flex-shrink-0 rounded-2 border p-2
                 d-flex align-items-center justify-content-center"
          aria-hidden="true"
        >
          <i class="bi bi-journal-bookmark-fill text-secondary fs-5"></i>
        </div>
        <div>
          <p class="fw-semibold small mb-1">Sekretariat Jenderal MPR RI</p>
          <p class="text-secondary small mb-0">
            Naskah komprehensif merujuk pada publikasi resmi
            Majelis Permusyawaratan Rakyat Republik Indonesia.
          </p>
        </div>
      </div>
    </section>
  `;
}

/**
 * @returns {string}
 */
function _buildBantuanSectionHtml() {
  return `
    <section class="tentang-bantuan" aria-label="Bantuan dan dukungan">
      <h2 class="h6 fw-bold mb-3">Bantuan &amp; Dukungan</h2>
      <div class="d-flex flex-column gap-2">
        <a
          class="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2"
          href="${FORM_URLS.koreksi}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Kirim koreksi pasal melalui Google Forms (membuka tab baru)"
          data-koreksi-link
        >
          <i class="bi bi-file-earmark-text" aria-hidden="true"></i>
          Koreksi Pasal
        </a>
        <a
          class="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2"
          href="${FORM_URLS.saran}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Kirim saran masukan melalui Google Forms (membuka tab baru)"
          data-saran-link
        >
          <i class="bi bi-chat-square-text" aria-hidden="true"></i>
          Saran Masukan
        </a>
      </div>
    </section>
  `;
}
