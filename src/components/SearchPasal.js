/**
 * @file src/components/SearchPasal.js
 * @description Komponen search bar dengan debounce 300ms.
 *
 * TASK-035:
 *   - input type=search
 *   - ikon search di kiri
 *   - placeholder "Cari pasal UUD 1945..."
 *   - debounce default 300ms
 *
 * Komponen murni presentational + input handling.
 */

const DEFAULT_PLACEHOLDER = 'Cari pasal UUD 1945...';
const DEFAULT_DEBOUNCE_MS = 300;

export class SearchPasal {
  /**
   * @param {{
   *   initialQuery?: string;
   *   placeholder?: string;
   *   debounceMs?: number;
   *   onSearch?: (query: string) => void;
   * }} [options]
   */
  constructor(options = {}) {
    this.initialQuery = options.initialQuery ?? '';
    this.placeholder = options.placeholder ?? DEFAULT_PLACEHOLDER;
    this.debounceMs = options.debounceMs ?? DEFAULT_DEBOUNCE_MS;
    this.onSearch = options.onSearch ?? (() => {});

    /** @type {HTMLElement | null} */
    this.container = null;
    /** @type {HTMLInputElement | null} */
    this.inputEl = null;
    /** @type {number | null} */
    this._debounceTimer = null;

    this._handleInput = this._handleInput.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);
  }

  /**
   * @param {HTMLElement} containerEl
   */
  mount(containerEl) {
    this.container = containerEl;
    this.container.innerHTML = this._buildHtml();

    this.inputEl = /** @type {HTMLInputElement | null} */ (
      this.container.querySelector('[data-search-input]')
    );

    if (!this.inputEl) {
      throw new Error('SearchPasal gagal mount: input tidak ditemukan.');
    }

    this.inputEl.addEventListener('input', this._handleInput);
    this.inputEl.addEventListener('keydown', this._handleKeyDown);
  }

  destroy() {
    if (this.inputEl) {
      this.inputEl.removeEventListener('input', this._handleInput);
      this.inputEl.removeEventListener('keydown', this._handleKeyDown);
    }
    if (this._debounceTimer !== null) {
      window.clearTimeout(this._debounceTimer);
      this._debounceTimer = null;
    }
  }

  /**
   * @param {string} query
   * @param {{ emit?: boolean }} [options]
   */
  setValue(query, options = {}) {
    if (!this.inputEl) return;

    const value = typeof query === 'string' ? query : '';
    this.inputEl.value = value;

    if (options.emit) {
      this.onSearch(value);
    }
  }

  _buildHtml() {
    return `
      <div class="search-pasal" data-search-pasal>
        <div class="search-pasal__input-wrap">
          <i class="bi bi-search search-pasal__icon" aria-hidden="true"></i>
          <input
            type="search"
            class="search-pasal__input"
            placeholder="${_escapeAttr(this.placeholder)}"
            value="${_escapeAttr(this.initialQuery)}"
            aria-label="Pencarian pasal"
            data-search-input
          />
        </div>
      </div>
    `;
  }

  /** @param {Event} event */
  _handleInput(event) {
    const target = /** @type {HTMLInputElement | null} */ (
      event.target instanceof HTMLInputElement ? event.target : null
    );
    if (!target) return;

    if (this._debounceTimer !== null) {
      window.clearTimeout(this._debounceTimer);
    }

    this._debounceTimer = window.setTimeout(() => {
      this.onSearch(target.value);
    }, this.debounceMs);
  }

  /** @param {KeyboardEvent} event */
  _handleKeyDown(event) {
    if (event.key !== 'Enter') return;
    if (!this.inputEl) return;

    if (this._debounceTimer !== null) {
      window.clearTimeout(this._debounceTimer);
      this._debounceTimer = null;
    }

    this.onSearch(this.inputEl.value);
  }
}

/**
 * @param {string} value
 * @returns {string}
 */
function _escapeAttr(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}
