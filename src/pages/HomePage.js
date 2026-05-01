/**
 * @file src/pages/HomePage.js
 * @description Landing page Phase 1.6.
 */

import {
  buildShareButton,
  configurePageContainer,
  setPageTitle,
  setSidebarContent,
  toAppHref,
} from './pageHelpers.js';

const QUICK_LINKS = [
  {
    path: '/pancasila',
    title: '5 Sila Pancasila',
    description:
      'Eksplorasi lima dasar falsafah negara yang menjadi pedoman kehidupan berbangsa dan bernegara.',
    icon: 'bi-star',
    featured: true,
  },
  {
    path: '/pembukaan',
    title: 'Pembukaan UUD 1945',
    description: 'Teks proklamasi kemerdekaan dan tujuan berdirinya negara.',
    icon: 'bi-book',
  },
  {
    path: '/pasal',
    title: 'Daftar Pasal',
    description: 'Akses cepat ke seluruh pasal dalam Undang-Undang Dasar 1945.',
    icon: 'bi-list-ol',
  },
  {
    path: '/butir-pancasila',
    title: 'Butir Pancasila',
    description: 'Pedoman penghayatan dan pengamalan Pancasila per sila.',
    icon: 'bi-card-checklist',
  },
  {
    path: '/bab-pasal',
    title: 'Struktur Bab',
    description: 'Navigasi konstitusi berdasarkan hierarki bab dan bagian.',
    icon: 'bi-diagram-3',
  },
  {
    path: '/uud-asli',
    title: 'UUD Asli',
    description: 'Naskah otentik sebelum perubahan konstitusi.',
    icon: 'bi-journal-bookmark',
  },
  {
    path: '/amandemen',
    title: 'Amandemen',
    description: 'Riwayat perubahan UUD 1945 dari Amandemen I sampai IV.',
    icon: 'bi-clock-history',
  },
];

export class HomePage {
  /**
   * @param {HTMLElement} containerEl
   * @param {{ sidebarEl: HTMLElement }} deps
   */
  constructor(containerEl, { sidebarEl }) {
    this.container = containerEl;
    this.sidebarEl = sidebarEl;
  }

  mount() {
    configurePageContainer(this.container, { wide: true });
    setSidebarContent(this.sidebarEl, { visible: false });
    setPageTitle('Beranda');
    this.container.innerHTML = this._buildHtml();
  }

  _buildHtml() {
    return `
      <div class="home-page">
        <section class="home-hero content-card">
          <div class="home-hero__orb home-hero__orb--right" aria-hidden="true"></div>
          <div class="home-hero__orb home-hero__orb--left" aria-hidden="true"></div>
          <div class="home-hero__actions">
            ${buildShareButton()}
          </div>
          <div class="home-hero__badge" aria-hidden="true">
            <i class="bi bi-shield-check"></i>
          </div>
          <h1 class="home-hero__title">Pancasila &amp; UUD 1945</h1>
          <p class="home-hero__subtitle">
            Portal resmi untuk mengeksplorasi landasan ideologi dan konstitusi negara Republik
            Indonesia. Pelajari butir-butir, pasal-pasal, dan sejarah amandemen dengan antarmuka
            yang bersih dan berwibawa.
          </p>
        </section>

        <section class="home-grid" aria-label="Navigasi cepat konten utama">
          ${QUICK_LINKS.map((item) => this._buildQuickLinkHtml(item)).join('')}
        </section>
      </div>
    `;
  }

  /**
   * @param {{ path: string; title: string; description: string; icon: string; featured?: boolean }} item
   * @returns {string}
   */
  _buildQuickLinkHtml(item) {
    return `
      <a class="home-card content-card${item.featured ? ' home-card--featured' : ''}"
         href="${toAppHref(item.path)}">
        <div class="home-card__body">
          <div class="home-card__icon" aria-hidden="true">
            <i class="bi ${item.icon}"></i>
          </div>
          <div>
            <h2 class="home-card__title">${item.title}</h2>
            <p class="home-card__description">${item.description}</p>
          </div>
        </div>
        <div class="home-card__action" aria-hidden="true">
          <i class="bi bi-arrow-right"></i>
        </div>
      </a>
    `;
  }
}
