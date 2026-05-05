/**
 * @file src/pages/SilaDetailPage.js
 * @description Halaman detail satu sila dan butir pengamalannya.
 */

import {
  bindRetryAction,
  buildBreadcrumbHtml,
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
import { ShareButton } from '../components/ShareButton.js';
import { updateMetaTags } from '../utils/seo.js';

export class SilaDetailPage {
  /**
   * @param {HTMLElement} containerEl
   * @param {{
   *   nomor: string;
   *   sidebarEl: HTMLElement;
   *   router: { navigate: (path: string) => void };
   *   silaRepository: { loadSilaPancasila: () => Promise<readonly string[]> };
   *   butirRepository: {
   *     loadButirPancasila: () => Promise<Array<{ namasila: string; arrayisi: Array<{ isi: string }> }>>;
   *   };
   * }} deps
   */
  constructor(containerEl, { nomor, sidebarEl, router, silaRepository, butirRepository }) {
    this.container = containerEl;
    this.nomor = nomor;
    this.sidebarEl = sidebarEl;
    this.router = router;
    this.silaRepository = silaRepository;
    this.butirRepository = butirRepository;
  }

  async mount() {
    configurePageContainer(this.container);
    setSidebarContent(this.sidebarEl, {
      title: 'Navigasi Hukum',
      subtitle: 'UUD 1945 & Pancasila',
      items: buildPhaseOneSidebarItems(`/sila/${this.nomor}`),
    });

    const nomorSila = _parseSilaNumber(this.nomor);
    if (nomorSila === null) {
      this._redirectToNotFound();
      return;
    }

    setPageTitle(`Sila ${nomorSila}`);
    renderLoadingState(this.container, `Memuat detail Sila ${nomorSila}...`);

    try {
      const [silaList, butirList] = await Promise.all([
        this.silaRepository.loadSilaPancasila(),
        this.butirRepository.loadButirPancasila(),
      ]);

      const silaText = silaList[nomorSila - 1];
      const butirSila = butirList[nomorSila - 1];

      if (!silaText || !butirSila) {
        this._redirectToNotFound();
        return;
      }

      this.container.innerHTML = this._buildHtml({
        nomorSila,
        silaText,
        butirSila,
      });
      this._updateSeoMeta(nomorSila, silaText);
      this._mountShareButton(nomorSila, silaText);
    } catch {
      this.container.innerHTML = buildErrorStateHtml({
        message: 'Detail sila tidak dapat dimuat. Silakan coba lagi.',
      });
      bindRetryAction(this.container, () => this.mount());
    }
  }

  /**
   * Perbarui SEO meta tags dengan teks sila aktual setelah data dimuat.
   * Override nilai template yang sudah di-set di routes.js.
   *
   * @param {number} nomorSila
   * @param {string} silaText
   */
  _updateSeoMeta(nomorSila, silaText) {
    const silaShort = silaText.replace(/\.$/, '');
    updateMetaTags({
      title: `Sila ${nomorSila} Pancasila — ${silaShort}`,
      description: `Teks lengkap dan butir-butir pengamalan Sila ke-${nomorSila} Pancasila: "${silaShort}". Dasar negara Indonesia.`,
      path: `/sila/${nomorSila}`,
    });
  }

  /**
   * Mount ShareButton setelah HTML halaman di-render.
   *
   * Share text: "Sila ke-[N]\n[Teks Sila]" sesuai planning TASK-015.
   *
   * @param {number} nomorSila
   * @param {string} silaText
   */
  _mountShareButton(nomorSila, silaText) {
    new ShareButton(this.container, {
      title: `Sila ke-${nomorSila} Pancasila`,
      text: `Sila ke-${nomorSila}: ${silaText}`,
      url: window.location.href,
    }).mount();
  }

  _redirectToNotFound() {
    this.router.navigate('/404');
  }

  /**
   * @param {{
   *   nomorSila: number;
   *   silaText: string;
   *   butirSila: { namasila: string; arrayisi: Array<{ isi: string }> };
   * }} state
   * @returns {string}
   */
  _buildHtml(state) {
    const titleText = state.silaText.replace(/\.$/, '');

    return `
      <div class="page-shell">
        ${buildBreadcrumbHtml([
          { label: 'Pancasila', path: '/pancasila' },
          { label: `Sila ${state.nomorSila}` },
        ])}

        <div class="page-topbar">
          <a class="page-back-link" href="${toAppHref('/pancasila')}">
            <i class="bi bi-arrow-left" aria-hidden="true"></i>
            <span>Kembali ke Daftar Sila</span>
          </a>
          <div class="page-heading__actions">
            ${buildShareButton()}
          </div>
        </div>

        <section class="sila-hero content-card">
          <div class="sila-hero__accent" aria-hidden="true"></div>
          <div class="sila-hero__ghost" aria-hidden="true">
            <i class="bi ${SILA_DECORATIVE_ICONS[state.nomorSila - 1]}"></i>
          </div>

          <div class="sila-hero__body">
            <div class="sila-hero__icon d-none d-md-inline-flex" aria-hidden="true">
              <i class="bi ${SILA_DECORATIVE_ICONS[state.nomorSila - 1]}"></i>
            </div>

            <div class="sila-hero__content">
              <span class="sila-hero__chip">Pancasila</span>
              <h1 class="sila-hero__ordinal">Sila ${state.nomorSila}</h1>
              <p class="sila-hero__title">${titleText}</p>
              <p class="sila-hero__description">${SILA_SUMMARIES[state.nomorSila - 1]}</p>
            </div>
          </div>
        </section>

        <section class="page-section">
          <div class="page-section-header">
            <div>
              <h2 class="page-section-title">Butir-butir Pengamalan</h2>
            </div>
            <span class="page-section-count">${state.butirSila.arrayisi.length} Poin Tap MPR</span>
          </div>

          <div class="sila-points">
            ${state.butirSila.arrayisi
              .map((butir, index) =>
                this._buildButirCardHtml(butir.isi, index, state.butirSila.arrayisi.length)
              )
              .join('')}
          </div>
        </section>
      </div>
    `;
  }

  /**
   * @param {string} text
   * @param {number} index
   * @param {number} total
   * @returns {string}
   */
  _buildButirCardHtml(text, index, total) {
    const isLastOddItem = total % 2 === 1 && index === total - 1;
    return `
      <article class="sila-point-card content-card${isLastOddItem ? ' sila-point-card--full' : ''}">
        <span class="sila-point-card__check d-md-none" aria-hidden="true">
          <i class="bi bi-check-circle-fill"></i>
        </span>
        <span class="sila-point-card__number d-none d-md-inline-flex" aria-hidden="true">${index + 1}</span>
        <p class="sila-point-card__text">${text}</p>
      </article>
    `;
  }
}

/**
 * @param {string} rawNomor
 * @returns {number | null}
 */
function _parseSilaNumber(rawNomor) {
  const parsed = Number(rawNomor);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 5) {
    return null;
  }
  return parsed;
}
