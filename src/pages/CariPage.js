/**
 * @file src/pages/CariPage.js
 * @description Halaman pencarian real-time pasal UUD 1945 berbasis Fuse.js.
 *
 * TASK-034 s.d. TASK-041:
 *   - Render halaman cari + area hasil
 *   - Debounce 300ms via komponen SearchPasal
 *   - Highlight kata kunci menggunakan <mark>
 *   - Sinkronisasi URL /cari?q=... via history.replaceState
 *   - Pre-fill query dari URL ketika deep link dibuka
 *   - Empty state saat hasil tidak ditemukan
 *   - Klik hasil menuju /pasal/:nomor
 *   - Tampilkan jumlah hasil pencarian
 */

import { SearchPasal } from '../components/SearchPasal.js';
import { initializePasalSearchIndex, searchPasal } from '../utils/search.js';
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

const SEARCH_DEBOUNCE_MS = 300;

export class CariPage {
  /**
   * @param {HTMLElement} containerEl
   * @param {{
   *   sidebarEl: HTMLElement;
   *   router: { navigate: (path: string) => void };
   *   pasalRepository: {
   *     loadPasalUUD: () => Promise<Array<{ namapasal: string; arrayisi: Array<{ isi: string }> }>;
   *   };
   * }} deps
   */
  constructor(containerEl, { sidebarEl, router, pasalRepository }) {
    this.container = containerEl;
    this.sidebarEl = sidebarEl;
    this.router = router;
    this.pasalRepository = pasalRepository;

    /** @type {Array<{ namapasal: string; arrayisi: Array<{ isi: string }> }>} */
    this._pasalList = [];
    /** @type {Array<import('fuse.js').FuseResult<{ namapasal: string; arrayisi: Array<{ isi: string }> }>>} */
    this._results = [];
    /** @type {string} */
    this._query = '';
    /** @type {SearchPasal | null} */
    this._searchComponent = null;
  }

  async mount() {
    configurePageContainer(this.container);
    setSidebarContent(this.sidebarEl, {
      title: 'Navigasi Hukum',
      subtitle: 'UUD 1945 & Pancasila',
      items: buildPhaseOneSidebarItems('/cari'),
    });

    setPageTitle('Cari Pasal UUD 1945');
    renderLoadingState(this.container, 'Memuat data pencarian...');

    try {
      this._pasalList = await this.pasalRepository.loadPasalUUD();
      initializePasalSearchIndex(this._pasalList);

      this._query = _readQueryFromUrl();
      this._renderShell();
      this._mountSearchBar();

      if (this._query) {
        this._runSearch(this._query);
      } else {
        this._updateSearchView();
      }
    } catch {
      this.container.innerHTML = buildErrorStateHtml({
        message: 'Fitur pencarian tidak dapat dimuat. Silakan coba lagi.',
      });
      bindRetryAction(this.container, () => this.mount());
    }
  }

  _renderShell() {
    this.container.innerHTML = `
      <div class="page-shell cari-page" data-cari-page>
        <div class="page-section-header">
          <h1 class="page-section-title">Pencarian Pasal</h1>
          <span class="page-section-count" data-search-count>0 Hasil</span>
        </div>

        <div class="cari-search-slot" data-search-slot></div>

        <p class="cari-search-note text-secondary mb-0">
          Ketik kata kunci untuk mencari pasal dan ayat terkait.
        </p>

        <div class="cari-search-state text-secondary" data-search-state></div>

        <div
          class="cari-result-list"
          role="list"
          aria-label="Hasil pencarian pasal"
          data-search-results
        ></div>
      </div>
    `;
  }

  _mountSearchBar() {
    const slot = this.container.querySelector('[data-search-slot]');
    if (!slot) return;

    this._searchComponent?.destroy();
    this._searchComponent = new SearchPasal({
      initialQuery: this._query,
      debounceMs: SEARCH_DEBOUNCE_MS,
      onSearch: (query) => this._runSearch(query),
    });
    this._searchComponent.mount(slot);
  }

  /**
   * @param {string} query
   */
  _runSearch(query) {
    this._query = query.trim();
    _replaceQueryInUrl(this._query);

    if (!this._query) {
      this._results = [];
      this._updateSearchView();
      return;
    }

    this._results = searchPasal(this._query, { limit: 50 });
    this._updateSearchView();
  }

  _updateSearchView() {
    const countEl = this.container.querySelector('[data-search-count]');
    const stateEl = this.container.querySelector('[data-search-state]');
    const resultsEl = this.container.querySelector('[data-search-results]');
    if (!countEl || !stateEl || !resultsEl) return;

    countEl.textContent = `${this._results.length} Hasil`;

    if (!this._query) {
      stateEl.textContent = 'Masukkan kata kunci untuk memulai pencarian.';
      resultsEl.innerHTML = '';
      return;
    }

    if (this._results.length === 0) {
      stateEl.textContent = 'Tidak ada pasal yang mengandung kata kunci tersebut. Coba kata lain.';
      resultsEl.innerHTML = `
        <div class="cari-empty-state" data-search-empty>
          <i class="bi bi-search" aria-hidden="true"></i>
          <p class="mb-0">Tidak ada pasal yang mengandung kata kunci tersebut.</p>
        </div>
      `;
      return;
    }

    stateEl.textContent = `Ditemukan ${this._results.length} pasal yang mengandung "${this._query}"`;
    resultsEl.innerHTML = this._results.map((result) => _buildResultCardHtml(result)).join('');
  }
}

/**
 * @param {import('fuse.js').FuseResult<{ namapasal: string; arrayisi: Array<{ isi: string }> }>} result
 * @returns {string}
 */
function _buildResultCardHtml(result) {
  const item = result.item;
  const pasalNomor = item.namapasal.replace('Pasal ', '');
  const titleMatch = _findMatch(result, 'namapasal');
  const ayatMatch = _findMatch(result, 'arrayisi.isi');

  const titleHtml = titleMatch
    ? _buildHighlightedText(titleMatch.value, titleMatch.indices)
    : _escapeHtml(item.namapasal);

  const excerptSource = ayatMatch ? ayatMatch.value : _buildDefaultExcerpt(item.arrayisi);
  const excerptHtml = ayatMatch
    ? _buildHighlightedText(excerptSource, ayatMatch.indices)
    : _escapeHtml(excerptSource);

  return `
    <a
      class="pasal-card content-card cari-result-card"
      href="${toAppHref(`/pasal/${encodeURIComponent(pasalNomor)}`)}"
      role="listitem"
      data-search-result
      data-pasal="${_escapeAttr(item.namapasal)}"
    >
      <div class="pasal-card__header">
        <div class="pasal-card__meta">
          <h2 class="pasal-card__title">${titleHtml}</h2>
        </div>
        <div class="pasal-card__arrow" aria-hidden="true">
          <i class="bi bi-arrow-right"></i>
        </div>
      </div>
      <p class="pasal-card__excerpt cari-result-card__excerpt">${excerptHtml}</p>
    </a>
  `;
}

/**
 * @param {import('fuse.js').FuseResult<{ namapasal: string; arrayisi: Array<{ isi: string }> }>} result
 * @param {string} keyName
 */
function _findMatch(result, keyName) {
  if (!result.matches) return null;

  const match = result.matches.find((entry) => String(entry.key) === keyName);
  if (match) return match;

  if (keyName === 'arrayisi.isi') {
    return result.matches.find((entry) => String(entry.key).includes('arrayisi')) ?? null;
  }

  return null;
}

/**
 * @param {Array<{ isi: string }>} ayatList
 * @returns {string}
 */
function _buildDefaultExcerpt(ayatList) {
  if (ayatList.length === 0) return '';
  if (ayatList.length === 1) return ayatList[0].isi;

  return ayatList
    .slice(0, 2)
    .map((ayat, index) => `(${index + 1}) ${ayat.isi}`)
    .join(' ');
}

/**
 * @param {string} text
 * @param {Array<[number, number]>} indices
 * @returns {string}
 */
function _buildHighlightedText(text, indices) {
  if (!Array.isArray(indices) || indices.length === 0) {
    return _escapeHtml(text);
  }

  let cursor = 0;
  let html = '';

  for (const [start, end] of indices) {
    const safeStart = Math.max(0, start);
    const safeEnd = Math.max(safeStart, end);

    html += _escapeHtml(text.slice(cursor, safeStart));
    html += `<mark class="cari-mark">${_escapeHtml(text.slice(safeStart, safeEnd + 1))}</mark>`;
    cursor = safeEnd + 1;
  }

  html += _escapeHtml(text.slice(cursor));
  return html;
}

function _readQueryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return (params.get('q') ?? '').trim();
}

/**
 * @param {string} query
 */
function _replaceQueryInUrl(query) {
  const params = new URLSearchParams(window.location.search);
  if (query) {
    params.set('q', query);
  } else {
    params.delete('q');
  }

  const searchPart = params.toString();
  const path = searchPart ? `/cari?${searchPart}` : '/cari';
  window.history.replaceState(null, '', toAppHref(path));
}

/**
 * @param {string} value
 */
function _escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/**
 * @param {string} value
 */
function _escapeAttr(value) {
  return _escapeHtml(value).replaceAll('"', '&quot;');
}
