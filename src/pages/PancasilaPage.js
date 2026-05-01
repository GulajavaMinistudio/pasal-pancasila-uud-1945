/**
 * @file src/pages/PancasilaPage.js
 * @description Halaman daftar 5 Sila Pancasila.
 */

import {
  bindRetryAction,
  buildErrorStateHtml,
  buildPhaseOneSidebarItems,
  buildShareButton,
  configurePageContainer,
  renderLoadingState,
  setPageTitle,
  setSidebarContent,
  SILA_DECORATIVE_ICONS,
  SILA_SUMMARIES,
  toAppHref,
} from './pageHelpers.js';

export class PancasilaPage {
  /**
   * @param {HTMLElement} containerEl
   * @param {{
   *   sidebarEl: HTMLElement;
   *   silaRepository: { loadSilaPancasila: () => Promise<readonly string[]> };
   * }} deps
   */
  constructor(containerEl, { sidebarEl, silaRepository }) {
    this.container = containerEl;
    this.sidebarEl = sidebarEl;
    this.silaRepository = silaRepository;
  }

  async mount() {
    configurePageContainer(this.container);
    setSidebarContent(this.sidebarEl, {
      title: 'Navigasi Hukum',
      subtitle: 'UUD 1945 & Pancasila',
      items: buildPhaseOneSidebarItems('/pancasila'),
    });
    setPageTitle('Pancasila');
    renderLoadingState(this.container, 'Memuat daftar sila Pancasila...');

    try {
      const silaList = await this.silaRepository.loadSilaPancasila();
      this.container.innerHTML = this._buildHtml(silaList);
    } catch {
      this.container.innerHTML = buildErrorStateHtml({
        message: 'Daftar sila tidak dapat dimuat. Silakan coba lagi.',
      });
      bindRetryAction(this.container, () => this.mount());
    }
  }

  /**
   * @param {readonly string[]} silaList
   * @returns {string}
   */
  _buildHtml(silaList) {
    return `
      <div class="page-shell">
        <header class="page-heading page-heading--stack-mobile page-heading--center-mobile">
          <div class="page-heading__content">
            <h1 class="page-title page-title--accent">Pancasila</h1>
            <p class="page-subtitle">Dasar Negara Republik Indonesia</p>
          </div>
          <div class="page-heading__actions">
            ${buildShareButton()}
          </div>
        </header>

        <section class="pancasila-list" aria-label="Daftar sila Pancasila">
          ${silaList.map((silaText, index) => this._buildSilaCardHtml(silaText, index)).join('')}
        </section>
      </div>
    `;
  }

  /**
   * @param {string} silaText
   * @param {number} index
   * @returns {string}
   */
  _buildSilaCardHtml(silaText, index) {
    const nomor = index + 1;
    const cleanTitle = silaText.replace(/\.$/, '');

    return `
      <a class="pancasila-card content-card"
         href="${toAppHref(`/sila/${nomor}`)}"
         aria-label="Lihat detail Sila ${nomor}">
        <span class="pancasila-card__icon" aria-hidden="true">
          <i class="bi ${SILA_DECORATIVE_ICONS[index]}"></i>
        </span>

        <div class="pancasila-card__number" aria-hidden="true">${nomor}</div>

        <div class="pancasila-card__content">
          <h2 class="pancasila-card__title">${cleanTitle}</h2>
          <p class="pancasila-card__summary">${SILA_SUMMARIES[index]}</p>
        </div>

        <span class="pancasila-card__arrow" aria-hidden="true">
          <i class="bi bi-arrow-right"></i>
        </span>
      </a>
    `;
  }
}
