/**
 * @file src/pages/ButirPancasilaPage.js
 * @description Halaman seluruh butir pengamalan Pancasila dengan accordion.
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
  SILA_SUMMARIES,
  toAppHref,
} from './pageHelpers.js';
import { ShareButton } from '../components/ShareButton.js';

export class ButirPancasilaPage {
  /**
   * @param {HTMLElement} containerEl
   * @param {{
   *   sidebarEl: HTMLElement;
   *   butirRepository: {
   *     loadButirPancasila: () => Promise<Array<{ namasila: string; arrayisi: Array<{ isi: string }> }>>;
   *   };
   * }} deps
   */
  constructor(containerEl, { sidebarEl, butirRepository }) {
    this.container = containerEl;
    this.sidebarEl = sidebarEl;
    this.butirRepository = butirRepository;
  }

  async mount() {
    configurePageContainer(this.container);
    setSidebarContent(this.sidebarEl, {
      title: 'Navigasi Hukum',
      subtitle: 'UUD 1945 & Pancasila',
      items: buildPhaseOneSidebarItems('/butir-pancasila'),
    });
    setPageTitle('Butir Pancasila');
    renderLoadingState(this.container, 'Memuat butir pengamalan Pancasila...');

    try {
      const butirList = await this.butirRepository.loadButirPancasila();
      this.container.innerHTML = this._buildHtml(butirList);
      this._bindAccordionEvents();
      this._mountShareButton();
    } catch {
      this.container.innerHTML = buildErrorStateHtml({
        message: 'Butir pengamalan Pancasila tidak dapat dimuat. Silakan coba lagi.',
      });
      bindRetryAction(this.container, () => this.mount());
    }
  }

  /**
   * @param {Array<{ namasila: string; arrayisi: Array<{ isi: string }> }>} butirList
   * @returns {string}
   */
  _buildHtml(butirList) {
    return `
      <div class="page-shell">
        <header class="page-heading page-heading--stack-mobile">
          <div class="page-heading__content">
            <p class="page-eyebrow">Pedoman Pengamalan Pancasila</p>
            <h1 class="page-title page-title--accent">Butir Pancasila</h1>
            <p class="page-subtitle">
              Seluruh butir pengamalan Pancasila disusun per sila agar mudah dibaca dan dijelajahi.
            </p>
          </div>
          <div class="page-heading__actions">
            ${buildShareButton()}
          </div>
        </header>

        <section class="butir-accordion" aria-label="Accordion butir Pancasila">
          ${butirList.map((item, index) => this._buildAccordionItemHtml(item, index)).join('')}
        </section>
      </div>
    `;
  }

  /**
   * @param {{ namasila: string; arrayisi: Array<{ isi: string }> }} item
   * @param {number} index
   * @returns {string}
   */
  _buildAccordionItemHtml(item, index) {
    const panelId = `butir-panel-${index + 1}`;
    const nomor = index + 1;
    const isOpen = index === 0;

    return `
      <article class="butir-accordion__item content-card">
        <button type="button"
                class="butir-accordion__trigger"
                data-accordion-trigger="${panelId}"
                aria-expanded="${isOpen ? 'true' : 'false'}">
          <span class="butir-accordion__number" aria-hidden="true">${nomor}</span>
          <span class="butir-accordion__meta">
            <span class="butir-accordion__title">${item.namasila.replace('Sila ', 'Sila ')}</span>
            <span class="butir-accordion__subtitle">${SILA_SUMMARIES[index]}</span>
          </span>
          <span class="butir-accordion__summary">${item.arrayisi.length} butir</span>
          <i class="bi bi-chevron-down butir-accordion__icon" aria-hidden="true"></i>
        </button>

        <div class="butir-accordion__panel" id="${panelId}" ${isOpen ? '' : 'hidden'}>
          <div class="butir-accordion__panel-actions">
            <a class="btn btn-link btn-sm px-0 text-decoration-none"
               href="${toAppHref(`/sila/${nomor}`)}">
              Lihat detail sila
              <i class="bi bi-arrow-right-short" aria-hidden="true"></i>
            </a>
          </div>
          <div class="butir-accordion__list">
            ${item.arrayisi
              .map(
                (butir, butirIndex) => `
                  <div class="butir-accordion__point">
                    <span class="butir-accordion__point-number" aria-hidden="true">${butirIndex + 1}</span>
                    <p class="butir-accordion__point-text">${butir.isi}</p>
                  </div>
                `
              )
              .join('')}
          </div>
        </div>
      </article>
    `;
  }

  _bindAccordionEvents() {
    this.container.addEventListener('click', (event) => {
      const trigger = event.target.closest('[data-accordion-trigger]');
      if (!trigger) return;

      const targetId = trigger.getAttribute('data-accordion-trigger');
      const targetPanel = this.container.querySelector(`#${targetId}`);
      if (!targetPanel) return;

      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      this.container.querySelectorAll('[data-accordion-trigger]').forEach((button) => {
        button.setAttribute('aria-expanded', 'false');
      });
      this.container.querySelectorAll('.butir-accordion__panel').forEach((panel) => {
        panel.setAttribute('hidden', '');
      });

      if (!isExpanded) {
        trigger.setAttribute('aria-expanded', 'true');
        targetPanel.removeAttribute('hidden');
      }
    });
  }

  /**
   * Mount ShareButton pada level halaman setelah HTML di-render.
   *
   * Share di level halaman — bukan per butir (sesuai planning TASK-017,
   * share per butir dicatat sebagai backlog v2 di luar scope v1).
   */
  _mountShareButton() {
    new ShareButton(this.container, {
      title: 'Butir-butir Pengamalan Pancasila',
      text: 'Butir-butir Pengamalan Pancasila — TAP MPR No. I/MPR/2003',
      url: window.location.href,
    }).mount();
  }
}
