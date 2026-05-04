/**
 * @file src/pages/AmandemenPage.js
 * @description Halaman daftar pasal yang mengalami amandemen, dikelompokkan per Amandemen I–IV.
 *
 * Menampilkan pasal-pasal dari `pasaluud45_ket_amandemen.json` yang memiliki
 * `amandemen !== "0"`, dikelompokkan dalam section per amandemen. Setiap item
 * memiliki badge warna dan tombol "Lihat Perbandingan" → `/amandemen/:nomor`.
 *
 * Color scheme per amandemen (TASK-012):
 *   I   = biru   (#1565C0)
 *   II  = hijau  (#2E7D32)
 *   III = oranye (#E65100)
 *   IV  = ungu   (#4A148C)
 *
 * Referensi:
 *   - planning TASK-011, TASK-012
 *   - spec-architecture §4.2 route /amandemen
 *   - data: public/data/pasaluud45_ket_amandemen.json
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

/** Urutan tampilan amandemen */
const AMANDEMEN_ORDER = ['1', '2', '3', '4'];

/** Metadata tiap kelompok amandemen */
const AMANDEMEN_META = {
  1: { label: 'Amandemen I', year: '1999' },
  2: { label: 'Amandemen II', year: '2000' },
  3: { label: 'Amandemen III', year: '2001' },
  4: { label: 'Amandemen IV', year: '2002' },
};

/**
 * Lebar kolom Bootstrap per amandemen:
 * I & II tampil berdampingan pada layar besar (col-lg-6);
 * III & IV selalu full-width karena memiliki lebih banyak item.
 */
const AMANDEMEN_COL_CLASS = {
  1: 'col-12 col-lg-6',
  2: 'col-12 col-lg-6',
  3: 'col-12',
  4: 'col-12',
};

export class AmandemenPage {
  /**
   * @param {HTMLElement} containerEl
   * @param {{
   *   sidebarEl: HTMLElement;
   *   pasalKetAmandemenRepository: {
   *     loadPasalUUDKetAmandemen: () => Promise<Array<{
   *       namapasal: string;
   *       arrayisi: Array<{ isi: string }>;
   *       babpasal: string;
   *       amandemen: string;
   *     }>>;
   *   };
   * }} deps
   */
  constructor(containerEl, { sidebarEl, pasalKetAmandemenRepository }) {
    this.container = containerEl;
    this.sidebarEl = sidebarEl;
    this.pasalKetAmandemenRepository = pasalKetAmandemenRepository;
  }

  async mount() {
    configurePageContainer(this.container);
    setSidebarContent(this.sidebarEl, {
      title: 'Navigasi Hukum',
      subtitle: 'UUD 1945 & Pancasila',
      items: buildPhaseOneSidebarItems('/amandemen'),
    });

    setPageTitle('Amandemen UUD 1945');
    renderLoadingState(this.container, 'Memuat data amandemen...');

    try {
      const allPasal = await this.pasalKetAmandemenRepository.loadPasalUUDKetAmandemen();
      const grouped = _groupByAmandemen(allPasal);
      this.container.innerHTML = this._buildHtml(grouped);
    } catch {
      this.container.innerHTML = buildErrorStateHtml({
        message: 'Data amandemen tidak dapat dimuat. Silakan coba lagi.',
      });
      bindRetryAction(this.container, () => this.mount());
    }
  }

  // ---------------------------------------------------------------------------
  // Private: Render
  // ---------------------------------------------------------------------------

  /**
   * @param {Map<string, Array<{ namapasal: string; arrayisi: Array<{ isi: string }>; babpasal: string; amandemen: string }>>} grouped
   * @returns {string}
   */
  _buildHtml(grouped) {
    const totalCount = Array.from(grouped.values()).reduce((sum, arr) => sum + arr.length, 0);

    const sectionsHtml = AMANDEMEN_ORDER.filter((key) => grouped.has(key))
      .map((key) => {
        const pasalList = grouped.get(key) ?? [];
        return _buildAmandemenSectionHtml(key, pasalList);
      })
      .join('');

    return `
      <div class="page-shell" data-amandemen>
        <div class="page-section-header">
          <h1 class="page-section-title">Amandemen UUD 1945</h1>
          <span class="page-section-count">${totalCount} Pasal</span>
        </div>
        <p class="amandemen-page-desc">
          Daftar pasal yang mengalami perubahan melalui empat tahapan amandemen
          Undang-Undang Dasar 1945 (1999–2002). Klik "Lihat Perbandingan" untuk
          melihat teks asli vs. teks pasca-amandemen secara berdampingan.
        </p>
        <div class="row g-4" data-amandemen-groups>
          ${sectionsHtml}
        </div>
      </div>
    `;
  }
}

// =============================================================================
// Private module-level helpers
// =============================================================================

/**
 * Kelompokkan pasal berdasarkan field `amandemen`.
 * Pasal dengan `amandemen === "0"` dibuang.
 * Pasal dengan nilai gabungan (mis. "3/4") dimasukkan ke kelompok TERAKHIR yang disebutkan.
 *
 * @param {Array<{ namapasal: string; arrayisi: Array<{ isi: string }>; babpasal: string; amandemen: string }>} pasalList
 * @returns {Map<string, Array<{ namapasal: string; arrayisi: Array<{ isi: string }>; babpasal: string; amandemen: string }>>}
 */
function _groupByAmandemen(pasalList) {
  /** @type {Map<string, Array<{ namapasal: string; arrayisi: Array<{ isi: string }>; babpasal: string; amandemen: string }>>} */
  const map = new Map();

  for (const pasal of pasalList) {
    if (!pasal.amandemen || pasal.amandemen === '0') continue;
    // Untuk nilai gabungan mis. "3/4", masukkan ke kelompok terakhir
    const parts = pasal.amandemen.split('/');
    const key = parts[parts.length - 1];
    if (!map.has(key)) map.set(key, []);
    map.get(key)?.push(pasal);
  }

  return map;
}

/**
 * @param {string} amandemenKey - "1", "2", "3", atau "4"
 * @param {Array<{ namapasal: string; arrayisi: Array<{ isi: string }>; babpasal: string; amandemen: string }>} pasalList
 * @returns {string}
 */
function _buildAmandemenSectionHtml(amandemenKey, pasalList) {
  const meta = AMANDEMEN_META[amandemenKey];
  if (!meta) return '';

  const colClass = AMANDEMEN_COL_CLASS[amandemenKey] ?? 'col-12';
  const itemsHtml = pasalList.map((pasal) => _buildPasalRowHtml(pasal, amandemenKey)).join('');

  return `
    <div class="${colClass}">
      <section
        class="card amandemen-group border rounded-3 shadow-sm overflow-hidden h-100"
        data-amandemen-section="${amandemenKey}"
        aria-label="${meta.label}"
      >
        <div class="amandemen-group__header card-header border-bottom p-3 p-md-4">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <h2 class="amandemen-group__title h5 mb-0">${meta.label}</h2>
            <span class="amandemen-group__year badge rounded-pill border">${meta.year}</span>
          </div>
          <span class="amandemen-group__count text-muted small">${pasalList.length} pasal diubah</span>
        </div>
        <div class="card-body amandemen-group__body p-3 d-flex flex-column gap-3">
          ${itemsHtml}
        </div>
      </section>
    </div>
  `;
}

/**
 * @param {{ namapasal: string; arrayisi: Array<{ isi: string }>; babpasal: string; amandemen: string }} pasal
 * @param {string} amandemenKey
 * @returns {string}
 */
function _buildPasalRowHtml(pasal, amandemenKey) {
  const urlSafe = encodeURIComponent(pasal.namapasal.replace('Pasal ', ''));
  const meta = AMANDEMEN_META[amandemenKey];

  return `
    <article
      class="card amandemen-card border rounded-3"
      data-pasal="${_escapeAttr(pasal.namapasal)}"
      data-amandemen-item
    >
      <div class="card-body p-3">
        <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
          <div class="flex-grow-1 min-w-0">
            <span class="amandemen-row__bab d-block text-uppercase small lh-sm mb-1">
              ${_escapeHtml(pasal.babpasal)}
            </span>
            <h3 class="amandemen-row__title h6 fw-bold mb-0">
              ${_escapeHtml(pasal.namapasal)}
            </h3>
          </div>
          <span
            class="amandemen-badge amandemen-badge--${amandemenKey} flex-shrink-0"
            aria-label="${meta?.label ?? ''}"
          >
            ${meta?.label ?? ''}
          </span>
        </div>
        <div class="border-top pt-2 mt-1">
          <a
            class="amandemen-compare-link"
            href="${toAppHref(`/amandemen/${urlSafe}`)}"
            aria-label="Lihat perbandingan ${_escapeAttr(pasal.namapasal)}"
            data-compare-link
          >
            <i class="bi bi-arrow-left-right d-md-none me-2" aria-hidden="true"></i>
            <span>Lihat Perbandingan</span>
            <i class="bi bi-arrow-right-short ms-1 d-none d-md-inline" aria-hidden="true"></i>
          </a>
        </div>
      </div>
    </article>
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
