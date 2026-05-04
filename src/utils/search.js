/**
 * @file src/utils/search.js
 * @description Utilitas pencarian pasal berbasis Fuse.js (module singleton).
 *
 * TASK-033:
 *   - keys: ['namapasal', 'arrayisi.isi']
 *   - threshold: 0.3
 *   - includeMatches: true
 *   - instance Fuse dibuat sekali dan di-cache
 *
 * Layer: Adapter (src/utils/) — tanpa akses fetch langsung.
 */

import Fuse from 'fuse.js';

/**
 * @typedef {{ namapasal: string; arrayisi: Array<{ isi: string }> }} PasalSearchItem
 */

const FUSE_OPTIONS = {
  keys: ['namapasal', 'arrayisi.isi'],
  threshold: 0.3,
  includeMatches: true,
  includeScore: true,
  ignoreLocation: true,
  shouldSort: true,
};

/** @type {Fuse<PasalSearchItem> | null} */
let _fuseInstance = null;
/** @type {PasalSearchItem[] | null} */
let _indexedSource = null;

/**
 * Inisialisasi (atau ambil cache) instance Fuse untuk data pasal.
 *
 * @param {PasalSearchItem[]} pasalList
 * @returns {Fuse<PasalSearchItem>}
 */
export function initializePasalSearchIndex(pasalList) {
  if (!Array.isArray(pasalList)) {
    throw new Error('initializePasalSearchIndex membutuhkan array pasal.');
  }

  if (_fuseInstance && _indexedSource === pasalList) {
    return _fuseInstance;
  }

  _indexedSource = pasalList;
  _fuseInstance = new Fuse(pasalList, FUSE_OPTIONS);
  return _fuseInstance;
}

/**
 * Jalankan pencarian fuzzy terhadap index pasal.
 *
 * @param {string} query
 * @param {{ limit?: number }} [options]
 * @returns {Array<Fuse.FuseResult<PasalSearchItem>>}
 */
export function searchPasal(query, options = {}) {
  const normalizedQuery = typeof query === 'string' ? query.trim() : '';
  if (!normalizedQuery) {
    return [];
  }

  if (!_fuseInstance) {
    throw new Error(
      'Search index belum diinisialisasi. Panggil initializePasalSearchIndex() dulu.'
    );
  }

  const { limit = 50 } = options;
  return _fuseInstance.search(normalizedQuery, { limit });
}

/**
 * Utility untuk testing: reset singleton cache.
 */
export function resetPasalSearchIndex() {
  _fuseInstance = null;
  _indexedSource = null;
}
