/**
 * @file src/components/PasalComparisonCard.js
 * @description Komponen card dua kolom untuk perbandingan side-by-side
 * pasal UUD 1945 versi asli vs. versi pasca-amandemen.
 *
 * Menerima `PasalComparisonView` sebagai parameter, murni presentational.
 * Tidak ada pemanggilan data, tidak ada logika bisnis.
 *
 * State tampilan khusus (TASK-016):
 *   - isNewPasal  → kolom kiri: card abu-abu "Pasal ini tidak ada pada UUD 1945 asli"
 *   - isDeletedPasal → kolom kanan: card merah muda "Pasal ini telah dihapus"
 *
 * Badge berwarna per amandemen (TASK-017):
 *   Pill kecil "Amandemen I/II/III/IV" dengan warna dari AMANDEMEN_BADGE_COLOR.
 *   Ditempatkan di header baris ayat kolom kanan jika status 'added' atau 'modified'.
 *
 * Referensi: planning TASK-015, TASK-016, TASK-017
 * Layer: Presentation/Components — tidak ada fetch, tidak ada data loading
 */

/**
 * Konstanta warna badge sesuai TASK-017 dan comparison.ts.
 * @type {Record<number, string>}
 */
const BADGE_COLOR = {
  1: '#1565C0',
  2: '#2E7D32',
  3: '#E65100',
  4: '#4A148C',
};

/**
 * Label teks per nomor amandemen.
 * @type {Record<number, string>}
 */
const AMANDEMEN_LABEL = {
  1: 'Amandemen I',
  2: 'Amandemen II',
  3: 'Amandemen III',
  4: 'Amandemen IV',
};

export class PasalComparisonCard {
  /**
   * Render komponen card perbandingan sebagai HTML string.
   *
   * @param {import('../types/comparison').PasalComparisonView} comparisonView
   * @returns {string} HTML string untuk di-inject ke container
   */
  render(comparisonView) {
    const { namapasal, amandemenNumber, isNewPasal, isDeletedPasal, ayatComparisons } =
      comparisonView;

    return `
      <div class="comparison-card" data-comparison-card>
        ${_buildCardHeaderHtml(namapasal, amandemenNumber)}
        ${_buildDataLimitationNoticeHtml()}
        <div class="comparison-grid" data-comparison-grid>
          <div class="comparison-grid__header" aria-hidden="true">
            <div class="comparison-col-label comparison-col-label--original">
              <i class="bi bi-archive me-2" aria-hidden="true"></i>
              UUD 1945 Naskah Asli
            </div>
            <div class="comparison-col-label comparison-col-label--amended">
              <i class="bi bi-check-circle me-2" aria-hidden="true"></i>
              Pasca-Amandemen
            </div>
          </div>
          <div class="comparison-grid__body">
            ${_buildComparisonBodyHtml(isNewPasal, isDeletedPasal, ayatComparisons)}
          </div>
        </div>
      </div>
    `;
  }
}

// =============================================================================
// Private helper functions (module-level)
// =============================================================================

/**
 * @param {string} namapasal
 * @param {import('../types/comparison').AmandemenNumber | null} amandemenNumber
 * @returns {string}
 */
function _buildCardHeaderHtml(namapasal, amandemenNumber) {
  const badgeHtml = amandemenNumber
    ? `<span
        class="comparison-card__amandemen-badge"
        style="background-color: ${BADGE_COLOR[amandemenNumber] ?? '#666'};"
        aria-label="${AMANDEMEN_LABEL[amandemenNumber] ?? ''}"
      >
        ${AMANDEMEN_LABEL[amandemenNumber] ?? ''}
      </span>`
    : '';

  return `
    <div class="comparison-card__header">
      <h2 class="comparison-card__title">${_escapeHtml(namapasal)}</h2>
      ${badgeHtml}
    </div>
  `;
}

/**
 * Notasi keterbatasan data sesuai REQ-009.
 * @returns {string}
 */
function _buildDataLimitationNoticeHtml() {
  return `
    <div class="comparison-notice" role="note" data-comparison-notice>
      <i class="bi bi-info-circle me-2" aria-hidden="true"></i>
      <span>
        Perbandingan ini menampilkan <strong>versi asli (1945)</strong> vs.
        <strong>versi akhir pasca-amandemen (2002)</strong>.
        Perubahan per-tahapan amandemen tidak dapat ditampilkan karena
        keterbatasan data yang tersedia.
      </span>
    </div>
  `;
}

/**
 * @param {boolean} isNewPasal
 * @param {boolean} isDeletedPasal
 * @param {readonly import('../types/comparison').AyatComparisonItem[]} ayatComparisons
 * @returns {string}
 */
function _buildComparisonBodyHtml(isNewPasal, isDeletedPasal, ayatComparisons) {
  // Pasal baru: kolom kiri = placeholder abu-abu, kolom kanan = isi pasal
  if (isNewPasal) {
    const ayatRowsHtml = ayatComparisons
      .map((ayat) => _buildNewPasalRowHtml(ayat))
      .join('');
    return `
      <div class="comparison-row comparison-row--new-pasal" data-comparison-new>
        <div class="comparison-cell comparison-cell--original">
          <div class="comparison-placeholder comparison-placeholder--new" data-new-pasal-placeholder>
            <i class="bi bi-plus-circle" aria-hidden="true"></i>
            <p>Pasal ini tidak ada pada UUD 1945 asli.</p>
            <p>Pasal ini ditambahkan melalui proses amandemen.</p>
          </div>
        </div>
        <div class="comparison-cell comparison-cell--amended">
          <div class="comparison-ayat-list">
            ${ayatRowsHtml}
          </div>
        </div>
      </div>
    `;
  }

  // Pasal dihapus: kolom kiri = isi ayat kosong, kolom kanan = placeholder merah muda
  if (isDeletedPasal) {
    return `
      <div class="comparison-row comparison-row--deleted-pasal" data-comparison-deleted>
        <div class="comparison-cell comparison-cell--original">
          <div class="comparison-placeholder comparison-placeholder--deleted-original">
            <i class="bi bi-archive" aria-hidden="true"></i>
            <p>Pasal ini tersedia dalam UUD 1945 asli (naskah 1945).</p>
          </div>
        </div>
        <div class="comparison-cell comparison-cell--amended">
          <div class="comparison-placeholder comparison-placeholder--deleted" data-deleted-pasal-placeholder>
            <i class="bi bi-trash3" aria-hidden="true"></i>
            <p>Pasal ini telah dihapus melalui proses amandemen.</p>
          </div>
        </div>
      </div>
    `;
  }

  // Perbandingan normal: render setiap baris ayat
  if (ayatComparisons.length === 0) {
    return `
      <div class="comparison-row">
        <div class="comparison-cell comparison-cell--original">
          <em class="text-muted">Tidak ada data ayat.</em>
        </div>
        <div class="comparison-cell comparison-cell--amended">
          <em class="text-muted">Tidak ada data ayat.</em>
        </div>
      </div>
    `;
  }

  return ayatComparisons.map((ayat) => _buildAyatRowHtml(ayat)).join('');
}

/**
 * @param {import('../types/comparison').AyatComparisonItem} ayat
 * @returns {string}
 */
function _buildAyatRowHtml(ayat) {
  const { index, originalText, amendedText, status, amandemenNumber } = ayat;

  const rowClass = `comparison-row comparison-row--${status}`;
  const origCellContent = originalText
    ? `<p class="comparison-ayat__text">${_escapeHtml(originalText)}</p>`
    : `<span class="comparison-ayat__empty" aria-label="Tidak ada teks">—</span>`;

  const amndCellContent = amendedText
    ? `${_buildAyatAmandemenBadgeHtml(amandemenNumber, status)}
       <p class="comparison-ayat__text">${_escapeHtml(amendedText)}</p>`
    : `<span class="comparison-ayat__empty" aria-label="Tidak ada teks">—</span>`;

  return `
    <div class="${rowClass}" data-ayat-row="${index}" data-status="${status}">
      <div class="comparison-cell comparison-cell--original">
        <span class="comparison-ayat__index" aria-label="Ayat ${index}">${index}</span>
        ${origCellContent}
      </div>
      <div class="comparison-cell comparison-cell--amended">
        <span class="comparison-ayat__index" aria-label="Ayat ${index}">${index}</span>
        ${amndCellContent}
      </div>
    </div>
  `;
}

/**
 * Render baris ayat untuk pasal baru (isNewPasal = true).
 * Hanya kolom kanan yang memiliki konten.
 *
 * @param {import('../types/comparison').AyatComparisonItem} ayat
 * @returns {string}
 */
function _buildNewPasalRowHtml(ayat) {
  const { index, amendedText, status, amandemenNumber } = ayat;
  const badgeHtml = _buildAyatAmandemenBadgeHtml(amandemenNumber, status);
  const textHtml = amendedText
    ? `<p class="comparison-ayat__text">${_escapeHtml(amendedText)}</p>`
    : '';

  return `
    <div class="comparison-ayat-item" data-ayat-row="${index}">
      <span class="comparison-ayat__index" aria-label="Ayat ${index}">${index}</span>
      ${badgeHtml}
      ${textHtml}
    </div>
  `;
}

/**
 * Render badge pill amandemen untuk satu ayat.
 * Hanya dirender jika status 'added' atau 'modified' DAN ada amandemenNumber.
 *
 * @param {import('../types/comparison').AmandemenNumber | null} amandemenNumber
 * @param {import('../types/comparison').AyatStatus} status
 * @returns {string}
 */
function _buildAyatAmandemenBadgeHtml(amandemenNumber, status) {
  if (amandemenNumber === null) return '';
  if (status !== 'added' && status !== 'modified') return '';

  const color = BADGE_COLOR[amandemenNumber] ?? '#666';
  const label = AMANDEMEN_LABEL[amandemenNumber] ?? '';

  return `
    <span
      class="comparison-ayat__badge"
      style="background-color: ${color};"
      aria-label="${_escapeAttr(label)}"
      data-amandemen-badge="${amandemenNumber}"
    >
      ${_escapeHtml(label)}
    </span>
  `;
}

/**
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
 * @param {string} text
 * @returns {string}
 */
function _escapeAttr(text) {
  return String(text).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
