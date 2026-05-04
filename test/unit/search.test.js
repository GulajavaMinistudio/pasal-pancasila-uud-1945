/**
 * @file test/unit/search.test.js
 * @description Unit tests untuk src/utils/search.js
 *
 * Cakupan (TASK-049):
 *   - Inisialisasi index Fuse.js
 *   - Singleton cache tidak re-instantiate untuk source yang sama
 *   - Search mengembalikan hasil relevan
 *   - includeMatches tersedia untuk highlight
 *   - Query kosong mengembalikan []
 */

import { afterEach, describe, expect, it } from 'vitest';
import pasalFixture from '../../src/data/fixture/pasaluud45.json';
import {
  initializePasalSearchIndex,
  resetPasalSearchIndex,
  searchPasal,
} from '../../src/utils/search.js';

const PASAL_LIST = pasalFixture.data;

describe('utils/search', () => {
  afterEach(() => {
    resetPasalSearchIndex();
  });

  it('menginisialisasi index Fuse.js dari data pasal', () => {
    const fuse = initializePasalSearchIndex(PASAL_LIST);
    expect(fuse).toBeDefined();
    expect(typeof fuse.search).toBe('function');
  });

  it('mengembalikan instance cache yang sama untuk source yang sama', () => {
    const first = initializePasalSearchIndex(PASAL_LIST);
    const second = initializePasalSearchIndex(PASAL_LIST);
    expect(second).toBe(first);
  });

  it('search query "kedaulatan" mengembalikan hasil yang relevan', () => {
    initializePasalSearchIndex(PASAL_LIST);
    const results = searchPasal('kedaulatan');

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].item.namapasal).toBe('Pasal 1');
  });

  it('hasil search menyertakan matches untuk kebutuhan highlight', () => {
    initializePasalSearchIndex(PASAL_LIST);
    const results = searchPasal('presiden');

    expect(results.length).toBeGreaterThan(0);
    expect(Array.isArray(results[0].matches)).toBe(true);
  });

  it('query kosong mengembalikan array kosong', () => {
    initializePasalSearchIndex(PASAL_LIST);

    expect(searchPasal('')).toEqual([]);
    expect(searchPasal('   ')).toEqual([]);
  });

  it('melempar error jika search dipanggil sebelum index diinisialisasi', () => {
    expect(() => searchPasal('kedaulatan')).toThrow(/belum diinisialisasi/i);
  });
});
