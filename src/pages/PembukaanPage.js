/**
 * @file src/pages/PembukaanPage.js
 * @description Halaman Pembukaan UUD 1945.
 */

import {
  ALINEA_LABELS,
  bindRetryAction,
  buildErrorStateHtml,
  buildPhaseOneSidebarItems,
  buildShareButton,
  configurePageContainer,
  renderLoadingState,
  setPageTitle,
  setSidebarContent,
} from './pageHelpers.js';

export class PembukaanPage {
  /**
   * @param {HTMLElement} containerEl
   * @param {{
   *   sidebarEl: HTMLElement;
   *   pembukaanRepository: { loadPembukaanUUD: () => Promise<readonly string[]> };
   * }} deps
   */
  constructor(containerEl, { sidebarEl, pembukaanRepository }) {
    this.container = containerEl;
    this.sidebarEl = sidebarEl;
    this.pembukaanRepository = pembukaanRepository;
  }

  async mount() {
    configurePageContainer(this.container);
    setSidebarContent(this.sidebarEl, {
      title: 'Navigasi Hukum',
      subtitle: 'UUD 1945 & Pancasila',
      items: buildPhaseOneSidebarItems('/pembukaan'),
    });
    setPageTitle('Pembukaan');
    renderLoadingState(this.container, 'Memuat Pembukaan UUD 1945...');

    try {
      const alineaList = await this.pembukaanRepository.loadPembukaanUUD();
      this.container.innerHTML = this._buildHtml(alineaList);
    } catch {
      this.container.innerHTML = buildErrorStateHtml({
        message: 'Teks Pembukaan UUD 1945 tidak dapat dimuat. Silakan coba lagi.',
      });
      bindRetryAction(this.container, () => this.mount());
    }
  }

  /**
   * @param {readonly string[]} alineaList
   * @returns {string}
   */
  _buildHtml(alineaList) {
    return `
      <div class="page-shell">
        <div class="page-topbar page-topbar--end">
          <div class="page-heading__actions">
            ${buildShareButton()}
          </div>
        </div>

        <header class="pembukaan-hero">
          <p class="pembukaan-hero__headline d-none d-lg-block">
            UNDANG-UNDANG DASAR NEGARA REPUBLIK INDONESIA TAHUN 1945
          </p>
          <h1 class="page-title">Pembukaan</h1>
          <p class="page-subtitle pembukaan-hero__subtitle">
            Undang-Undang Dasar Negara Republik Indonesia Tahun 1945.
          </p>
        </header>

        <section class="alinea-list" aria-label="Empat alinea Pembukaan UUD 1945">
          ${alineaList.map((text, index) => this._buildAlineaCardHtml(text, index)).join('')}
        </section>
      </div>
    `;
  }

  /**
   * @param {string} text
   * @param {number} index
   * @returns {string}
   */
  _buildAlineaCardHtml(text, index) {
    return `
      <article class="alinea-card content-card">
        <span class="alinea-card__badge" aria-hidden="true">${index + 1}</span>
        <div class="alinea-card__content">
          <h2 class="alinea-card__title">Alinea ${ALINEA_LABELS[index]}</h2>
          <p class="alinea-card__text">${text}</p>
        </div>
      </article>
    `;
  }
}
