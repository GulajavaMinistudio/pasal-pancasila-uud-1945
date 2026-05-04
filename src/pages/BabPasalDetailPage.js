/**
 * @file src/pages/BabPasalDetailPage.js
 * @description Halaman detail satu Bab UUD 1945.
 *
 * Menampilkan: nomor bab, nama keterangan bab, daftar seluruh pasal dalam bab,
 * navigasi prev/next bab, dan link kembali ke daftar bab.
 * Jika nomor bab tidak valid atau di luar rentang → tampilkan halaman 404.
 *
 * Referensi:
 *   - planning TASK-007
 *   - spec-architecture §4.2 route /bab-pasal/:nomor
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
  buildShareButton,
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

/**
 * Mengonversi parameter URL (string "1"–"21") menjadi index 0-based.
 * Mengembalikan -1 jika parameter tidak valid.
 *
 * @param {string} param
 * @param {number} maxIndex
 * @returns {number}
 */
function parseBabNomor(param, maxIndex) {
  const n = parseInt(param, 10);
  if (isNaN(n) || n < 1 || n > maxIndex) return -1;
  return n - 1;
}

export class BabPasalDetailPage {
  /**
   * @param {HTMLElement} containerEl
   * @param {{
   *   nomor: string;
   *   sidebarEl: HTMLElement;
   *   router: { navigate: (path: string) => void };
   *   babRepository: {
   *     loadBabPasal: () => Promise<import('../types/data').BabPasalData>;
   *   };
   * }} deps
   */
  constructor(containerEl, { nomor, sidebarEl, router, babRepository }) {
    this.container = containerEl;
    this.nomor = nomor;
    this.sidebarEl = sidebarEl;
    this.router = router;
    this.babRepository = babRepository;
  }

  async mount() {
    configurePageContainer(this.container);
    setSidebarContent(this.sidebarEl, {
      title: 'Navigasi Hukum',
      subtitle: 'UUD 1945 & Pancasila',
      items: buildPhaseOneSidebarItems('/bab-pasal'),
    });

    setPageTitle('Detail Bab UUD 1945');
    renderLoadingState(this.container, 'Memuat detail bab...');

    try {
      const babData = await this.babRepository.loadBabPasal();
      const { bab_pasal, keterangan_bab_pasal, isi_bab_pasal } = babData;
      const index = parseBabNomor(this.nomor, isi_bab_pasal.length);

      if (index === -1) {
        this._renderNotFoundState();
        return;
      }

      const bab = isi_bab_pasal[index];
      const fullName = bab_pasal[index];
      const keterangan = keterangan_bab_pasal[index];
      const roman = ROMAN_NUMERALS[index] ?? String(index + 1);

      const prevBab = index > 0 ? { nomor: index, fullName: bab_pasal[index - 1] } : null;
      const nextBab =
        index < isi_bab_pasal.length - 1
          ? { nomor: index + 2, fullName: bab_pasal[index + 1] }
          : null;

      setPageTitle(`${fullName}`);
      this.container.innerHTML = this._buildHtml({
        bab,
        fullName,
        keterangan,
        roman,
        prevBab,
        nextBab,
      });
    } catch {
      this.container.innerHTML = buildErrorStateHtml({
        message: 'Konten bab tidak dapat dimuat. Silakan coba lagi.',
      });
      bindRetryAction(this.container, () => this.mount());
    }
  }

  /**
   * @param {{
   *   bab: { nama_bab: string; isi_bab: string[] };
   *   fullName: string;
   *   keterangan: string;
   *   roman: string;
   *   prevBab: { nomor: number; fullName: string } | null;
   *   nextBab: { nomor: number; fullName: string } | null;
   * }} params
   * @returns {string}
   */
  _buildHtml({ bab, fullName, keterangan, roman, prevBab, nextBab }) {
    return `
      <div class="page-shell">
        <a href="${toAppHref('/bab-pasal')}" class="page-back-link">
          <i class="bi bi-arrow-left" aria-hidden="true"></i>
          Kembali ke Daftar Bab
        </a>

        <div class="bab-detail-header content-card">
          <div class="bab-detail-header__top">
            <div class="bab-detail-header__badge" aria-hidden="true">
              <span class="bab-detail-header__roman">${roman}</span>
            </div>
            <div class="bab-detail-header__text">
              <h1 class="bab-detail-header__title">${fullName}</h1>
              <p class="bab-detail-header__subtitle">${keterangan}</p>
            </div>
          </div>
          <div class="page-heading__actions">
            ${buildShareButton(`Bagikan ${fullName}`)}
          </div>
        </div>

        <div class="page-section-header">
          <h2 class="page-section-title">Pasal dalam Bab Ini</h2>
          <span class="page-section-count">${bab.isi_bab.length} Pasal</span>
        </div>

        <div class="bab-detail-pasal-list" role="list" aria-label="Daftar pasal dalam ${fullName}">
          ${bab.isi_bab.map((namaPasal) => this._buildPasalItemHtml(namaPasal)).join('')}
        </div>

        ${this._buildBabNavHtml(prevBab, nextBab)}
      </div>
    `;
  }

  /**
   * @param {string} namaPasal
   * @returns {string}
   */
  _buildPasalItemHtml(namaPasal) {
    const isPasalDeleted = namaPasal.startsWith('Pasal sudah dihapus');
    if (isPasalDeleted) {
      return `
        <div class="bab-detail-pasal-item bab-detail-pasal-item--deleted" role="listitem">
          <span class="bab-detail-pasal-item__icon">
            <i class="bi bi-x-circle" aria-hidden="true"></i>
          </span>
          <span class="bab-detail-pasal-item__text">${namaPasal}</span>
        </div>
      `;
    }

    const nomorPasalUrl = namaPasal.replace('Pasal ', '');
    return `
      <a href="${toAppHref(`/pasal/${nomorPasalUrl}`)}"
         class="bab-detail-pasal-item content-card"
         role="listitem">
        <span class="bab-detail-pasal-item__icon">
          <i class="bi bi-file-text" aria-hidden="true"></i>
        </span>
        <span class="bab-detail-pasal-item__text">${namaPasal}</span>
        <i class="bi bi-chevron-right bab-detail-pasal-item__arrow" aria-hidden="true"></i>
      </a>
    `;
  }

  /**
   * @param {{ nomor: number; fullName: string } | null} prevBab
   * @param {{ nomor: number; fullName: string } | null} nextBab
   * @returns {string}
   */
  _buildBabNavHtml(prevBab, nextBab) {
    if (!prevBab && !nextBab) return '';

    const prevHtml = prevBab
      ? `
        <a href="${toAppHref(`/bab-pasal/${prevBab.nomor}`)}"
           class="bab-nav__prev"
           aria-label="Bab sebelumnya: ${prevBab.fullName}">
          <i class="bi bi-chevron-left" aria-hidden="true"></i>
          <span class="bab-nav__label">Sebelumnya</span>
          <span class="bab-nav__name">${prevBab.fullName}</span>
        </a>
      `
      : `<span class="bab-nav__placeholder"></span>`;

    const nextHtml = nextBab
      ? `
        <a href="${toAppHref(`/bab-pasal/${nextBab.nomor}`)}"
           class="bab-nav__next"
           aria-label="Bab berikutnya: ${nextBab.fullName}">
          <span class="bab-nav__name">${nextBab.fullName}</span>
          <span class="bab-nav__label">Berikutnya</span>
          <i class="bi bi-chevron-right" aria-hidden="true"></i>
        </a>
      `
      : `<span class="bab-nav__placeholder"></span>`;

    return `
      <nav class="bab-nav" aria-label="Navigasi bab">
        ${prevHtml}
        ${nextHtml}
      </nav>
    `;
  }

  _renderNotFoundState() {
    setPageTitle('Bab Tidak Ditemukan');
    this.container.innerHTML = buildErrorStateHtml({
      title: 'Bab tidak ditemukan',
      message: `Bab ke-${this.nomor} tidak terdapat dalam data UUD 1945. Pastikan nomor bab yang diakses benar (1–21).`,
      retryLabel: 'Kembali ke Daftar Bab',
    });

    const retryButton = this.container.querySelector('[data-action="retry"]');
    if (!retryButton) return;
    retryButton.addEventListener('click', () => {
      this.router.navigate('/bab-pasal');
    });
  }
}
