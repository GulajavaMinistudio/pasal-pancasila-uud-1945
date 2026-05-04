/**
 * @file src/pages/UUDAsliPage.js
 * @description Halaman UUD 1945 versi asli sebelum amandemen.
 *
 * Menampilkan seluruh pasal UUD 1945 asli (1945) dari `pasaluud45noamandemen.json`
 * dengan filter berdasarkan bab (`babpasal` field) menggunakan dropdown.
 *
 * Referensi:
 *   - planning TASK-009, TASK-010
 *   - spec-architecture §4.2 route /uud-asli
 *   - data: public/data/pasaluud45noamandemen.json
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
} from './pageHelpers.js';

/** Sentinel untuk tampilkan semua bab */
const ALL_BAB_VALUE = '__all__';

export class UUDAsliPage {
  /**
   * @param {HTMLElement} containerEl
   * @param {{
   *   sidebarEl: HTMLElement;
   *   uudAsliRepository: {
   *     loadPasalUUDNoAmandemen: () => Promise<Array<{
   *       namapasal: string;
   *       arrayisi: Array<{ isi: string }>;
   *       babpasal: string;
   *     }>>;
   *   };
   * }} deps
   */
  constructor(containerEl, { sidebarEl, uudAsliRepository }) {
    this.container = containerEl;
    this.sidebarEl = sidebarEl;
    this.uudAsliRepository = uudAsliRepository;
    /** @type {string} */
    this._selectedBab = ALL_BAB_VALUE;
    /** @type {Array<{ namapasal: string; arrayisi: Array<{ isi: string }>; babpasal: string }>} */
    this._pasalList = [];
    /** @type {string[]} */
    this._babList = [];
  }

  async mount() {
    configurePageContainer(this.container);
    setSidebarContent(this.sidebarEl, {
      title: 'Navigasi Hukum',
      subtitle: 'UUD 1945 & Pancasila',
      items: buildPhaseOneSidebarItems('/uud-asli'),
    });

    setPageTitle('UUD 1945 Naskah Asli');
    renderLoadingState(this.container, 'Memuat naskah asli UUD 1945...');

    try {
      this._pasalList = await this.uudAsliRepository.loadPasalUUDNoAmandemen();
      this._babList = _extractUniqueBabList(this._pasalList);
      this._render();
      this._bindEvents();
    } catch {
      this.container.innerHTML = buildErrorStateHtml({
        message: 'Naskah asli tidak dapat dimuat. Silakan coba lagi.',
      });
      bindRetryAction(this.container, () => this.mount());
    }
  }

  // ---------------------------------------------------------------------------
  // Private: Render
  // ---------------------------------------------------------------------------

  _render() {
    const filtered = _filterPasalByBab(this._pasalList, this._selectedBab);
    this.container.innerHTML = this._buildHtml(filtered);
  }

  /**
   * @param {Array<{ namapasal: string; arrayisi: Array<{ isi: string }>; babpasal: string }>} pasalList
   * @returns {string}
   */
  _buildHtml(pasalList) {
    return `
      <div class="page-shell" data-uud-asli>
        ${_buildPageHeaderHtml(pasalList.length, this._pasalList.length)}
        ${_buildFilterDropdownHtml(this._babList, this._selectedBab)}
        <div class="uud-asli-list" role="list" aria-label="Daftar pasal UUD 1945 naskah asli">
          ${pasalList.map(_buildPasalItemHtml).join('')}
        </div>
      </div>
    `;
  }

  // ---------------------------------------------------------------------------
  // Private: Events
  // ---------------------------------------------------------------------------

  _bindEvents() {
    this.container.addEventListener('change', (e) => {
      const select = /** @type {HTMLSelectElement | null} */ (
        e.target instanceof HTMLSelectElement ? e.target : null
      );
      if (select?.dataset.babFilter !== undefined) {
        this._onBabFilterChange(select.value);
      }
    });
  }

  /**
   * @param {string} babValue
   */
  _onBabFilterChange(babValue) {
    this._selectedBab = babValue;
    const filtered = _filterPasalByBab(this._pasalList, this._selectedBab);
    const listEl = this.container.querySelector('.uud-asli-list');
    const countEl = this.container.querySelector('[data-pasal-count]');
    if (listEl) {
      listEl.innerHTML = filtered.map(_buildPasalItemHtml).join('');
    }
    if (countEl) {
      countEl.textContent = `${filtered.length} Pasal`;
    }
  }
}

// =============================================================================
// Private module-level helpers
// =============================================================================

/**
 * Ekstrak daftar bab unik dari data pasal, urut sesuai kemunculan pertama.
 *
 * @param {Array<{ babpasal: string }>} pasalList
 * @returns {string[]}
 */
function _extractUniqueBabList(pasalList) {
  /** @type {string[]} */
  const seen = [];
  for (const p of pasalList) {
    if (p.babpasal && !seen.includes(p.babpasal)) {
      seen.push(p.babpasal);
    }
  }
  return seen;
}

/**
 * Filter pasal berdasarkan bab. Jika `bab === ALL_BAB_VALUE`, kembalikan semua.
 *
 * @param {Array<{ namapasal: string; arrayisi: Array<{ isi: string }>; babpasal: string }>} pasalList
 * @param {string} bab
 * @returns {Array<{ namapasal: string; arrayisi: Array<{ isi: string }>; babpasal: string }>}
 */
function _filterPasalByBab(pasalList, bab) {
  if (bab === ALL_BAB_VALUE) return pasalList;
  return pasalList.filter((p) => p.babpasal === bab);
}

/**
 * @param {number} filteredCount
 * @param {number} totalCount
 * @returns {string}
 */
function _buildPageHeaderHtml(filteredCount, totalCount) {
  return `
    <div class="uud-asli-header">
      <div class="uud-asli-header__badge">
        <i class="bi bi-clock-history" aria-hidden="true"></i>
        UUD 1945 Naskah Asli
      </div>
      <div class="page-section-header">
        <h1 class="page-section-title">Naskah Asli UUD 1945</h1>
        <span class="page-section-count" data-pasal-count>${filteredCount} Pasal</span>
      </div>
      <p class="uud-asli-header__desc">
        Teks naskah asli Undang-Undang Dasar 1945 sebagaimana disahkan oleh PPKI
        pada 18 Agustus 1945, sebelum mengalami perubahan melalui proses amandemen.
        ${totalCount > 0 ? `Total <strong>${totalCount} pasal</strong>.` : ''}
      </p>
    </div>
  `;
}

/**
 * @param {string[]} babList
 * @param {string} selectedBab
 * @returns {string}
 */
function _buildFilterDropdownHtml(babList, selectedBab) {
  const options = [
    `<option value="${ALL_BAB_VALUE}" ${selectedBab === ALL_BAB_VALUE ? 'selected' : ''}>Semua Bab</option>`,
    ...babList.map(
      (bab) =>
        `<option value="${_escapeAttr(bab)}" ${selectedBab === bab ? 'selected' : ''}>${_escapeHtml(bab)}</option>`
    ),
  ].join('');

  return `
    <div class="uud-asli-filter">
      <label for="uud-asli-bab-select" class="uud-asli-filter__label">
        <i class="bi bi-funnel" aria-hidden="true"></i>
        Filter Bab:
      </label>
      <select
        id="uud-asli-bab-select"
        class="form-select form-select-sm uud-asli-filter__select"
        data-bab-filter
        aria-label="Filter berdasarkan bab"
      >
        ${options}
      </select>
    </div>
  `;
}

/**
 * @param {{ namapasal: string; arrayisi: Array<{ isi: string }>; babpasal: string }} pasal
 * @returns {string}
 */
function _buildPasalItemHtml(pasal) {
  const ayatCount = pasal.arrayisi.length;
  const firstAyat = pasal.arrayisi[0]?.isi ?? '';
  const excerpt = firstAyat.length > 120 ? `${firstAyat.slice(0, 120)}…` : firstAyat;

  return `
    <div class="uud-asli-card content-card" role="listitem" data-pasal="${_escapeAttr(pasal.namapasal)}">
      <div class="uud-asli-card__header">
        <div class="uud-asli-card__meta">
          <span class="uud-asli-card__bab-label">${_escapeHtml(pasal.babpasal)}</span>
          <h2 class="uud-asli-card__title">${_escapeHtml(pasal.namapasal)}</h2>
        </div>
      </div>
      <p class="uud-asli-card__excerpt">${_escapeHtml(excerpt)}</p>
      <div class="uud-asli-card__footer">
        <span class="badge-ayat">${ayatCount} Ayat</span>
        <span class="badge-asli">
          <i class="bi bi-archive" aria-hidden="true"></i>
          Naskah Asli
        </span>
      </div>
    </div>
  `;
}

/**
 * Escape HTML entities untuk output yang aman.
 *
 * @param {string} text
 * @returns {string}
 */
function _escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Escape untuk nilai atribut HTML.
 *
 * @param {string} text
 * @returns {string}
 */
function _escapeAttr(text) {
  return String(text).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
