/**
 * @file src/pages/AmandemenDetailPage.js
 * @description Halaman perbandingan side-by-side pasal UUD 1945 versi asli
 * vs. versi pasca-amandemen terakhir.
 *
 * Route: /amandemen/:nomor
 *
 * Alur:
 *   1. Ekstrak parameter :nomor dari constructor
 *   2. Load kedua data secara paralel (Promise.all)
 *   3. Panggil buildPasalComparison(nomor, ...)
 *   4. Jika null → tampilkan 404 inline
 *   5. Render PasalComparisonCard dengan data hasil perbandingan
 *
 * Referensi:
 *   - planning TASK-018, TASK-019
 *   - spec-architecture §4.2 route /amandemen/:nomor, AC-008a–AC-008d
 *   - spec-data-schema §7.4
 *
 * Aturan Clean Architecture (CS-2):
 *   - Data load via repository injection, tidak ada fetch() langsung
 *   - Render DOM hanya pada this.container
 *   - Komponen PasalComparisonCard diinstansiasi sebagai dependensi presentational
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
import { buildPasalComparison } from '../utils/comparison.js';
import { PasalComparisonCard } from '../components/PasalComparisonCard.js';

export class AmandemenDetailPage {
  /**
   * @param {HTMLElement} containerEl
   * @param {{\r
   *   nomor: string;\r
   *   sidebarEl: HTMLElement;\r
   *   router: { navigate: (path: string) => void };\r
   *   uudAsliRepository: {\r
   *     loadPasalUUDNoAmandemen: () => Promise<readonly import('../types/data').PasalUUDNoAmandemenItem[]>;\r
   *   };\r
   *   pasalKetAmandemenRepository: {\r
   *     loadPasalUUDKetAmandemen: () => Promise<readonly import('../types/data').PasalUUDKetAmandemenItem[]>;\r
   *   };\r
   * }} deps
   */
  constructor(containerEl, { nomor, sidebarEl, router, uudAsliRepository, pasalKetAmandemenRepository }) {
    this.container = containerEl;
    this.nomor = nomor;
    this.sidebarEl = sidebarEl;
    this.router = router;
    this.uudAsliRepository = uudAsliRepository;
    this.pasalKetAmandemenRepository = pasalKetAmandemenRepository;
    this._comparisonCard = new PasalComparisonCard();
  }

  async mount() {
    configurePageContainer(this.container, { wide: true });
    setSidebarContent(this.sidebarEl, {
      title: 'Navigasi Hukum',
      subtitle: 'UUD 1945 & Pancasila',
      items: buildPhaseOneSidebarItems('/amandemen'),
    });

    const namapasal = `Pasal ${this.nomor}`;
    setPageTitle(`Perbandingan ${namapasal}`);
    renderLoadingState(this.container, `Memuat perbandingan ${namapasal}...`);

    try {
      const [noAmandemenData, ketAmandemenData] = await Promise.all([
        this.uudAsliRepository.loadPasalUUDNoAmandemen(),
        this.pasalKetAmandemenRepository.loadPasalUUDKetAmandemen(),
      ]);

      const comparisonView = buildPasalComparison(this.nomor, noAmandemenData, ketAmandemenData);

      if (!comparisonView) {
        this._renderNotFoundState(namapasal);
        return;
      }

      setPageTitle(`Perbandingan ${comparisonView.namapasal}`);
      this.container.innerHTML = this._buildHtml(comparisonView);
    } catch {
      this.container.innerHTML = buildErrorStateHtml({
        message: 'Data perbandingan tidak dapat dimuat. Silakan coba lagi.',
      });
      bindRetryAction(this.container, () => this.mount());
    }
  }

  // ---------------------------------------------------------------------------
  // Private: Render
  // ---------------------------------------------------------------------------

  /**
   * @param {import('../types/comparison').PasalComparisonView} comparisonView
   * @returns {string}
   */
  _buildHtml(comparisonView) {
    return `
      <div class="page-shell" data-amandemen-detail>
        <div class="page-topbar">
          <a class="page-back-link" href="${toAppHref('/amandemen')}">
            <i class="bi bi-arrow-left" aria-hidden="true"></i>
            <span>Kembali ke Daftar Amandemen</span>
          </a>
        </div>
        ${this._comparisonCard.render(comparisonView)}
      </div>
    `;
  }

  /**
   * Render 404 inline jika pasal tidak ditemukan di data manapun.
   *
   * @param {string} namapasal
   */
  _renderNotFoundState(namapasal) {
    setPageTitle('Pasal Tidak Ditemukan');
    this.container.innerHTML = buildErrorStateHtml({
      title: 'Pasal tidak ditemukan',
      message: `${namapasal} tidak memiliki data perbandingan amandemen. Pastikan nomor pasal yang dimasukkan benar.`,
      retryLabel: 'Kembali ke Daftar Amandemen',
    });

    const retryButton = this.container.querySelector('[data-action="retry"]');
    if (!retryButton) return;
    retryButton.addEventListener('click', () => {
      this.router.navigate('/amandemen');
    });
  }
}
