/**
 * @file src/pages/PasalListPage.js
 * @description Halaman daftar semua Pasal UUD 1945 pasca-amandemen.
 *
 * Menampilkan setiap pasal dengan: nomor pasal, cuplikan ayat pertama,
 * badge amandemen (jika ada), jumlah ayat, dan label bab.
 *
 * Referensi:
 *   - planning TASK-001, TASK-003
 *   - spec-architecture §4.2 route /pasal
 *   - mockup daftar_pasal_mobile/code.html
 *   - mockup daftar_pasal_uud_1945_1/code.html (desktop)
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
import { buildAmandemenBadgeHtml, buildAmandemenMap } from '../utils/pasal.js';

export class PasalListPage {
  /**
   * @param {HTMLElement} containerEl
   * @param {{
   *   sidebarEl: HTMLElement;
   *   pasalRepository: {
   *     loadPasalUUD: () => Promise<Array<{ namapasal: string; arrayisi: Array<{ isi: string }> }>>;
   *   };
   *   pasalKetAmandemenRepository: {
   *     loadPasalUUDKetAmandemen: () => Promise<Array<{ namapasal: string; amandemen: string; babpasal: string }>>;
   *   };
   * }} deps
   */
  constructor(containerEl, { sidebarEl, pasalRepository, pasalKetAmandemenRepository }) {
    this.container = containerEl;
    this.sidebarEl = sidebarEl;
    this.pasalRepository = pasalRepository;
    this.pasalKetAmandemenRepository = pasalKetAmandemenRepository;
  }

  async mount() {
    configurePageContainer(this.container);
    setSidebarContent(this.sidebarEl, {
      title: 'Navigasi Hukum',
      subtitle: 'UUD 1945 & Pancasila',
      items: buildPhaseOneSidebarItems('/pasal'),
    });

    setPageTitle('Daftar Pasal UUD 1945');
    renderLoadingState(this.container, 'Memuat daftar pasal...');

    try {
      const [pasalList, ketAmandemenList] = await Promise.all([
        this.pasalRepository.loadPasalUUD(),
        this.pasalKetAmandemenRepository.loadPasalUUDKetAmandemen(),
      ]);

      const amandemenMap = buildAmandemenMap(ketAmandemenList);
      this.container.innerHTML = this._buildHtml(pasalList, amandemenMap);
    } catch {
      this.container.innerHTML = buildErrorStateHtml({
        message: 'Daftar pasal tidak dapat dimuat. Silakan coba lagi.',
      });
      bindRetryAction(this.container, () => this.mount());
    }
  }

  /**
   * @param {Array<{ namapasal: string; arrayisi: Array<{ isi: string }> }>} pasalList
   * @param {Map<string, { amandemen: string; babpasal: string }>} amandemenMap
   * @returns {string}
   */
  _buildHtml(pasalList, amandemenMap) {
    const listHtml = pasalList
      .map((pasal) => {
        const ketAmandemen = amandemenMap.get(pasal.namapasal);
        return this._buildPasalCardHtml(pasal, ketAmandemen);
      })
      .join('');

    return `
      <div class="page-shell">
        <a class="pasal-search-hint"
           href="${toAppHref('/cari')}"
           aria-label="Cari pasal atau kata kunci">
          <i class="bi bi-search" aria-hidden="true"></i>
          <span>Cari pasal, bab, atau kata kunci...</span>
        </a>

        <div class="page-section-header">
          <h1 class="page-section-title">Daftar Pasal</h1>
          <span class="page-section-count">${pasalList.length} Pasal</span>
        </div>

        <div class="pasal-list" role="list" aria-label="Daftar pasal UUD 1945">
          ${listHtml}
        </div>
      </div>
    `;
  }

  /**
   * @param {{ namapasal: string; arrayisi: Array<{ isi: string }> }} pasal
   * @param {{ amandemen: string; babpasal: string } | undefined} ketAmandemen
   * @returns {string}
   */
  _buildPasalCardHtml(pasal, ketAmandemen) {
    const nomorUrl = pasal.namapasal.replace('Pasal ', '');
    const ayatCount = pasal.arrayisi.length;
    const excerpt = _buildExcerpt(pasal.arrayisi);
    const babLabel = ketAmandemen?.babpasal ?? '';
    const amandemenBadge = buildAmandemenBadgeHtml(ketAmandemen?.amandemen);

    return `
      <a class="pasal-card content-card"
         href="${toAppHref(`/pasal/${nomorUrl}`)}"
         role="listitem"
         data-pasal="${pasal.namapasal}">
        <div class="pasal-card__header">
          <div class="pasal-card__meta">
            ${babLabel ? `<span class="pasal-card__bab-label">${babLabel}</span>` : ''}
            <h2 class="pasal-card__title">${pasal.namapasal}</h2>
          </div>
          <div class="pasal-card__arrow" aria-hidden="true">
            <i class="bi bi-arrow-right"></i>
          </div>
        </div>
        <p class="pasal-card__excerpt">${excerpt}</p>
        <div class="pasal-card__footer">
          <span class="badge-ayat">${ayatCount} Ayat</span>
          ${amandemenBadge}
        </div>
      </a>
    `;
  }
}

// =============================================================================
// Private helpers
// =============================================================================

/**
 * Bangun teks cuplikan singkat dari array ayat.
 * Single-ayat: teks itu sendiri.
 * Multi-ayat: gabung 2 ayat pertama dengan penomoran "(1) ... (2) ..."
 *
 * @param {Array<{ isi: string }>} arrayisi
 * @returns {string}
 */
function _buildExcerpt(arrayisi) {
  if (arrayisi.length === 1) {
    return arrayisi[0].isi;
  }
  return arrayisi
    .slice(0, 2)
    .map((a, i) => `(${i + 1}) ${a.isi}`)
    .join(' ');
}
