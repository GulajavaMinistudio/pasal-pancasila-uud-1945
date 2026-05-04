/**
 * @file src/pages/PasalDetailPage.js
 * @description Halaman detail satu Pasal UUD 1945.
 *
 * Menampilkan: judul pasal, badge amandemen, nama bab, semua ayat dengan
 * penomoran, tombol "Bagikan" placeholder, navigasi prev/next.
 * Jika nomor pasal tidak ditemukan di data → tampilkan halaman 404.
 *
 * Referensi:
 *   - planning TASK-002, TASK-005
 *   - spec-architecture §4.2 route /pasal/:nomor
 *   - mockup detail_pasal_1_uud_1945/code.html (desktop)
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
import { buildAmandemenBadgeHtml, buildAmandemenMap, parsePasalNomor } from '../utils/pasal.js';

export class PasalDetailPage {
  /**
   * @param {HTMLElement} containerEl
   * @param {{
   *   nomor: string;
   *   sidebarEl: HTMLElement;
   *   router: { navigate: (path: string) => void };
   *   pasalRepository: {
   *     loadPasalUUD: () => Promise<Array<{ namapasal: string; arrayisi: Array<{ isi: string }> }>>;
   *   };
   *   pasalKetAmandemenRepository: {
   *     loadPasalUUDKetAmandemen: () => Promise<Array<{ namapasal: string; amandemen: string; babpasal: string }>>;
   *   };
   * }} deps
   */
  constructor(
    containerEl,
    { nomor, sidebarEl, router, pasalRepository, pasalKetAmandemenRepository }
  ) {
    this.container = containerEl;
    this.nomor = nomor;
    this.sidebarEl = sidebarEl;
    this.router = router;
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

    const namapasal = parsePasalNomor(this.nomor);
    setPageTitle(namapasal || 'Pasal UUD 1945');
    renderLoadingState(this.container, `Memuat ${namapasal}...`);

    try {
      const [pasalList, ketAmandemenList] = await Promise.all([
        this.pasalRepository.loadPasalUUD(),
        this.pasalKetAmandemenRepository.loadPasalUUDKetAmandemen(),
      ]);

      const pasal = _findPasalByNama(pasalList, namapasal);
      if (!pasal) {
        this._renderNotFoundState(namapasal);
        return;
      }

      const amandemenMap = buildAmandemenMap(ketAmandemenList);
      const ketAmandemen = amandemenMap.get(pasal.namapasal);
      const currentIndex = pasalList.findIndex(
        (p) => p.namapasal.toUpperCase() === pasal.namapasal.toUpperCase()
      );
      const prevPasal = currentIndex > 0 ? pasalList[currentIndex - 1] : null;
      const nextPasal = currentIndex < pasalList.length - 1 ? pasalList[currentIndex + 1] : null;

      setPageTitle(pasal.namapasal);
      this.container.innerHTML = this._buildHtml({ pasal, ketAmandemen, prevPasal, nextPasal });
    } catch {
      this.container.innerHTML = buildErrorStateHtml({
        message: 'Konten pasal tidak dapat dimuat. Silakan coba lagi.',
      });
      bindRetryAction(this.container, () => this.mount());
    }
  }

  /**
   * Render halaman 404 inline untuk pasal yang tidak ditemukan (TASK-005).
   *
   * @param {string} namapasal
   */
  _renderNotFoundState(namapasal) {
    setPageTitle('Pasal Tidak Ditemukan');
    this.container.innerHTML = buildErrorStateHtml({
      title: 'Pasal tidak ditemukan',
      message: `${namapasal} tidak terdapat dalam data UUD 1945. Pastikan nomor pasal yang dimasukkan benar.`,
      retryLabel: 'Kembali ke Daftar Pasal',
    });

    const retryButton = this.container.querySelector('[data-action="retry"]');
    if (!retryButton) return;
    retryButton.addEventListener('click', () => {
      this.router.navigate('/pasal');
    });
  }

  /**
   * @param {{
   *   pasal: { namapasal: string; arrayisi: Array<{ isi: string }> };
   *   ketAmandemen: { amandemen: string; babpasal: string } | undefined;
   *   prevPasal: { namapasal: string } | null;
   *   nextPasal: { namapasal: string } | null;
   * }} state
   * @returns {string}
   */
  _buildHtml({ pasal, ketAmandemen, prevPasal, nextPasal }) {
    const amandemenBadge = buildAmandemenBadgeHtml(ketAmandemen?.amandemen);
    const babLabel = ketAmandemen?.babpasal ?? '';
    const isPasalDiamandemen =
      ketAmandemen?.amandemen !== undefined &&
      ketAmandemen.amandemen !== '0' &&
      ketAmandemen.amandemen !== '';
    const nomorUrl = pasal.namapasal.replace('Pasal ', '');
    const ayatListHtml = pasal.arrayisi
      .map((ayat, i) => this._buildAyatCardHtml(ayat.isi, i + 1))
      .join('');

    return `
      <div class="page-shell">
        <div class="page-topbar">
          <a class="page-back-link" href="${toAppHref('/pasal')}">
            <i class="bi bi-arrow-left" aria-hidden="true"></i>
            <span>Kembali ke Daftar Pasal</span>
          </a>
          <div class="page-heading__actions">
            ${buildShareButton()}
          </div>
        </div>

        <div class="pasal-detail-header content-card">
          <div class="d-flex align-items-center gap-2 flex-wrap mb-2">
            <h1 class="pasal-detail-header__title">${pasal.namapasal}</h1>
            ${amandemenBadge}
          </div>
          ${babLabel ? `<p class="pasal-detail-header__bab">${babLabel}</p>` : ''}
        </div>

        <div class="pasal-ayat-list" role="list" aria-label="Ayat-ayat ${pasal.namapasal}">
          ${ayatListHtml}
        </div>

        ${isPasalDiamandemen ? _buildCompareLink(nomorUrl, pasal.namapasal) : ''}

        ${this._buildNavHtml(prevPasal, nextPasal)}
      </div>
    `;
  }

  /**
   * @param {string} isiAyat
   * @param {number} nomor - 1-based
   * @returns {string}
   */
  _buildAyatCardHtml(isiAyat, nomor) {
    return `
      <div class="pasal-ayat-card content-card" role="listitem">
        <div class="pasal-ayat-card__inner">
          <div class="pasal-ayat-card__number" aria-hidden="true">${nomor}</div>
          <p class="pasal-ayat-card__text">${isiAyat}</p>
        </div>
        <div class="pasal-ayat-card__ghost" aria-hidden="true">${nomor}</div>
      </div>
    `;
  }

  /**
   * @param {{ namapasal: string } | null} prevPasal
   * @param {{ namapasal: string } | null} nextPasal
   * @returns {string}
   */
  _buildNavHtml(prevPasal, nextPasal) {
    const prevNomorUrl = prevPasal?.namapasal.replace('Pasal ', '') ?? null;
    const nextNomorUrl = nextPasal?.namapasal.replace('Pasal ', '') ?? null;

    const prevHtml = prevNomorUrl
      ? `<a class="pasal-nav__prev"
            href="${toAppHref(`/pasal/${prevNomorUrl}`)}"
            aria-label="Pasal sebelumnya: ${prevPasal?.namapasal}">
           <i class="bi bi-arrow-left" aria-hidden="true"></i>
           <span>Sebelumnya</span>
         </a>`
      : `<span class="pasal-nav__prev pasal-nav__prev--empty" aria-hidden="true">
           <i class="bi bi-arrow-left" aria-hidden="true"></i>
           <span>Sebelumnya</span>
         </span>`;

    const nextHtml = nextNomorUrl
      ? `<a class="pasal-nav__next"
            href="${toAppHref(`/pasal/${nextNomorUrl}`)}"
            aria-label="Pasal selanjutnya: ${nextPasal?.namapasal}">
           <span>${nextPasal?.namapasal}</span>
           <i class="bi bi-arrow-right" aria-hidden="true"></i>
         </a>`
      : `<span class="pasal-nav__next pasal-nav__next--empty" aria-hidden="true">
           <span>Pasal Selanjutnya</span>
           <i class="bi bi-arrow-right" aria-hidden="true"></i>
         </span>`;

    return `
      <nav class="pasal-nav" aria-label="Navigasi antar pasal">
        ${prevHtml}
        ${nextHtml}
      </nav>
    `;
  }
}

// =============================================================================
// Private helpers
// =============================================================================

/**
 * Cari pasal berdasarkan namapasal (case-insensitive).
 *
 * @param {Array<{ namapasal: string; arrayisi: Array<{ isi: string }> }>} pasalList
 * @param {string} namapasal
 * @returns {{ namapasal: string; arrayisi: Array<{ isi: string }> } | null}
 */
function _findPasalByNama(pasalList, namapasal) {
  const target = namapasal.toUpperCase();
  return pasalList.find((p) => p.namapasal.toUpperCase() === target) ?? null;
}

/**
 * Bangun HTML link "Bandingkan dengan UUD 1945 Asli" (TASK-021).
 * Hanya ditampilkan jika pasal memiliki data amandemen (amandemen !== "0").
 *
 * @param {string} nomorUrl - Nomor pasal untuk URL, contoh: "7", "7A"
 * @param {string} namapasal - Nama pasal lengkap untuk aria-label
 * @returns {string}
 */
function _buildCompareLink(nomorUrl, namapasal) {
  return `
    <div class="pasal-compare-section" data-compare-section>
      <a
        class="pasal-compare-link"
        href="${toAppHref(`/amandemen/${encodeURIComponent(nomorUrl)}`)}"
        aria-label="Bandingkan ${namapasal} dengan UUD 1945 asli"
        data-compare-link
      >
        <i class="bi bi-columns-gap me-2" aria-hidden="true"></i>
        Bandingkan dengan UUD 1945 Asli
        <i class="bi bi-arrow-right ms-2" aria-hidden="true"></i>
      </a>
    </div>
  `;
}
