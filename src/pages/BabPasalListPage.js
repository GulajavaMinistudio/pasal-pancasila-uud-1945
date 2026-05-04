/**
 * @file src/pages/BabPasalListPage.js
 * @description Halaman daftar 21 Bab UUD 1945 dengan expand/collapse per bab.
 *
 * Setiap bab menampilkan: nomor bab (Romawi), nama keterangan bab, jumlah pasal,
 * dan daftar pasal yang dapat diperluas/diciutkan. Tersedia juga link ke halaman
 * detail bab (`/bab-pasal/:nomor`).
 *
 * Referensi:
 *   - planning TASK-006, TASK-008
 *   - spec-architecture §4.2 route /bab-pasal
 *   - data: public/data/babpasal.json
 *
 * Aturan Clean Architecture (CS-2):
 *   - Data load via repository injection, tidak ada fetch() langsung
 *   - Render DOM hanya pada this.container
 */

import {
  bindRetryAction,
  buildErrorStateHtml,
  buildPhaseOneSidebarItems,
  configurePageContainer,
  renderLoadingState,
  setPageTitle,
  setSidebarContent,
  toAppHref,
} from './pageHelpers.js';

/** @type {readonly string[]} */
const ROMAN_NUMERALS = [
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X',
  'XI',
  'XII',
  'XIII',
  'XIV',
  'XV',
  'XVI',
  'XVII',
  'XVIII',
  'XIX',
  'XX',
  'XXI',
];

export class BabPasalListPage {
  /**
   * @param {HTMLElement} containerEl
   * @param {{
   *   sidebarEl: HTMLElement;
   *   babRepository: {
   *     loadBabPasal: () => Promise<import('../types/data').BabPasalData>;
   *   };
   * }} deps
   */
  constructor(containerEl, { sidebarEl, babRepository }) {
    this.container = containerEl;
    this.sidebarEl = sidebarEl;
    this.babRepository = babRepository;
  }

  async mount() {
    configurePageContainer(this.container);
    setSidebarContent(this.sidebarEl, {
      title: 'Navigasi Hukum',
      subtitle: 'UUD 1945 & Pancasila',
      items: buildPhaseOneSidebarItems('/bab-pasal'),
    });

    setPageTitle('Daftar Bab UUD 1945');
    renderLoadingState(this.container, 'Memuat daftar bab...');

    try {
      const babData = await this.babRepository.loadBabPasal();
      this.container.innerHTML = this._buildHtml(babData);
      this._bindToggleEvents();
    } catch {
      this.container.innerHTML = buildErrorStateHtml({
        message: 'Daftar bab tidak dapat dimuat. Silakan coba lagi.',
      });
      bindRetryAction(this.container, () => this.mount());
    }
  }

  /**
   * @param {import('../types/data').BabPasalData} babData
   * @returns {string}
   */
  _buildHtml(babData) {
    const { bab_pasal, keterangan_bab_pasal, isi_bab_pasal } = babData;

    const listHtml = isi_bab_pasal
      .map((bab, index) =>
        this._buildBabAccordionHtml(bab, bab_pasal[index], keterangan_bab_pasal[index], index)
      )
      .join('');

    return `
      <div class="page-shell">
        <div class="page-section-header">
          <h1 class="page-section-title">Daftar Bab</h1>
          <span class="page-section-count">${isi_bab_pasal.length} Bab</span>
        </div>

        <div class="bab-list" role="list" aria-label="Daftar bab UUD 1945">
          ${listHtml}
        </div>
      </div>
    `;
  }

  /**
   * @param {{ nama_bab: string; isi_bab: string[] }} bab
   * @param {string} fullName
   * @param {string} keterangan
   * @param {number} index
   * @returns {string}
   */
  _buildBabAccordionHtml(bab, fullName, keterangan, index) {
    const nomor = index + 1;
    const roman = ROMAN_NUMERALS[index] ?? String(nomor);
    const pasalCount = bab.isi_bab.length;
    const accordionId = `bab-body-${nomor}`;
    const headerId = `bab-header-${nomor}`;

    const pasalListHtml = bab.isi_bab
      .map((namaPasal) => {
        const isPasalDeleted = namaPasal.startsWith('Pasal sudah dihapus');
        if (isPasalDeleted) {
          return `
            <li class="bab-accordion__pasal-item bab-accordion__pasal-item--deleted">
              <i class="bi bi-x-circle" aria-hidden="true"></i>
              <span>${namaPasal}</span>
            </li>
          `;
        }
        const nomorPasalUrl = namaPasal.replace('Pasal ', '');
        return `
          <li class="bab-accordion__pasal-item" role="listitem">
            <a href="${toAppHref(`/pasal/${nomorPasalUrl}`)}"
               class="bab-accordion__pasal-link">
              <i class="bi bi-file-text" aria-hidden="true"></i>
              <span>${namaPasal}</span>
            </a>
          </li>
        `;
      })
      .join('');

    return `
      <div class="bab-accordion content-card" role="listitem" data-bab-nomor="${nomor}">
        <button
          class="bab-accordion__header"
          type="button"
          id="${headerId}"
          aria-expanded="false"
          aria-controls="${accordionId}"
          data-bab-toggle>
          <span class="bab-accordion__badge" aria-hidden="true">
            <span class="bab-accordion__roman">${roman}</span>
          </span>
          <span class="bab-accordion__info">
            <span class="bab-accordion__label">${fullName}</span>
            <span class="bab-accordion__keterangan">${keterangan}</span>
          </span>
          <span class="bab-accordion__meta">
            <span class="badge badge-pasal-count">${pasalCount} Pasal</span>
            <i class="bi bi-chevron-down bab-accordion__chevron" aria-hidden="true"></i>
          </span>
        </button>

        <div class="bab-accordion__body"
             id="${accordionId}"
             role="region"
             aria-labelledby="${headerId}"
             hidden>
          <ul class="bab-accordion__pasal-list" role="list" aria-label="Pasal dalam ${fullName}">
            ${pasalListHtml}
          </ul>
          <div class="bab-accordion__footer">
            <a href="${toAppHref(`/bab-pasal/${nomor}`)}"
               class="bab-accordion__detail-link">
              <i class="bi bi-arrow-right-circle" aria-hidden="true"></i>
              Lihat Detail Bab
            </a>
          </div>
        </div>
      </div>
    `;
  }

  _bindToggleEvents() {
    this.container.addEventListener('click', (e) => {
      const button = e.target.closest('[data-bab-toggle]');
      if (!button) return;

      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      const bodyId = button.getAttribute('aria-controls');
      const body = this.container.querySelector(`#${bodyId}`);

      if (!body) return;

      button.setAttribute('aria-expanded', String(!isExpanded));
      body.hidden = isExpanded;

      const accordion = button.closest('.bab-accordion');
      if (accordion) {
        accordion.classList.toggle('is-open', !isExpanded);
      }
    });
  }
}
