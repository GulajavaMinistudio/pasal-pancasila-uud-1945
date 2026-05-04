/**
 * @file test/unit/pasal.test.js
 * @description Unit tests untuk src/utils/pasal.js
 *
 * Cakupan (TASK-004):
 *   - parsePasalNomor: konversi URL param ke nama pasal
 *   - buildAmandemenMap: bangun Map dari array ket amandemen
 *   - getAmandemenBadgeLabel: ambil label badge dari nilai amandemen
 *   - buildAmandemenBadgeHtml: render HTML badge amandemen
 *
 * Prinsip F.I.R.S.T — semua test bersifat pure, tidak ada I/O.
 */

import { describe, expect, it } from 'vitest';
import {
  buildAmandemenBadgeHtml,
  buildAmandemenMap,
  getAmandemenBadgeLabel,
  parsePasalNomor,
} from '../../src/utils/pasal.js';

// =============================================================================
// parsePasalNomor
// =============================================================================

describe('parsePasalNomor', () => {
  it('mengkonversi angka sederhana', () => {
    expect(parsePasalNomor('1')).toBe('Pasal 1');
    expect(parsePasalNomor('37')).toBe('Pasal 37');
  });

  it('mengkonversi huruf ke UPPERCASE', () => {
    expect(parsePasalNomor('7a')).toBe('Pasal 7A');
    expect(parsePasalNomor('28c')).toBe('Pasal 28C');
    expect(parsePasalNomor('6A')).toBe('Pasal 6A');
  });

  it('memotong whitespace di awal dan akhir', () => {
    expect(parsePasalNomor('  7  ')).toBe('Pasal 7');
  });

  it('mengembalikan string kosong jika param falsy', () => {
    expect(parsePasalNomor('')).toBe('');
    expect(parsePasalNomor(null)).toBe('');
    expect(parsePasalNomor(undefined)).toBe('');
  });

  it('mengembalikan string kosong jika param bukan string', () => {
    expect(parsePasalNomor(123)).toBe('');
  });
});

// =============================================================================
// buildAmandemenMap
// =============================================================================

describe('buildAmandemenMap', () => {
  const fixture = [
    { namapasal: 'Pasal 1', amandemen: '3', babpasal: 'Bab I Bentuk dan Kedaulatan' },
    { namapasal: 'Pasal 2', amandemen: '0', babpasal: 'Bab II MPR' },
    { namapasal: 'Pasal 6A', amandemen: '3', babpasal: 'Bab III Kekuasaan Pemerintahan Negara' },
  ];

  it('membangun Map dengan kunci namapasal', () => {
    const map = buildAmandemenMap(fixture);
    expect(map.has('Pasal 1')).toBe(true);
    expect(map.has('Pasal 6A')).toBe(true);
  });

  it('menyimpan nilai amandemen dan babpasal dengan benar', () => {
    const map = buildAmandemenMap(fixture);
    expect(map.get('Pasal 1')).toEqual({
      amandemen: '3',
      babpasal: 'Bab I Bentuk dan Kedaulatan',
    });
  });

  it('mengembalikan Map kosong untuk input array kosong', () => {
    const map = buildAmandemenMap([]);
    expect(map.size).toBe(0);
  });

  it('ukuran Map sesuai jumlah item', () => {
    const map = buildAmandemenMap(fixture);
    expect(map.size).toBe(3);
  });
});

// =============================================================================
// getAmandemenBadgeLabel
// =============================================================================

describe('getAmandemenBadgeLabel', () => {
  it('mengembalikan null untuk nilai "0"', () => {
    expect(getAmandemenBadgeLabel('0')).toBeNull();
  });

  it('mengembalikan null untuk nilai falsy', () => {
    expect(getAmandemenBadgeLabel(undefined)).toBeNull();
    expect(getAmandemenBadgeLabel('')).toBeNull();
    expect(getAmandemenBadgeLabel(null)).toBeNull();
  });

  it('mengembalikan label amandemen tunggal dengan benar', () => {
    expect(getAmandemenBadgeLabel('1')).toBe('Amandemen I');
    expect(getAmandemenBadgeLabel('2')).toBe('Amandemen II');
    expect(getAmandemenBadgeLabel('3')).toBe('Amandemen III');
    expect(getAmandemenBadgeLabel('4')).toBe('Amandemen IV');
  });

  it('mengembalikan label amandemen terakhir untuk multi-amandemen', () => {
    expect(getAmandemenBadgeLabel('1/2')).toBe('Amandemen II');
    expect(getAmandemenBadgeLabel('3/4')).toBe('Amandemen IV');
    expect(getAmandemenBadgeLabel('1/3')).toBe('Amandemen III');
  });

  it('mengembalikan null untuk nilai yang tidak dikenal', () => {
    expect(getAmandemenBadgeLabel('5')).toBeNull();
    expect(getAmandemenBadgeLabel('abc')).toBeNull();
  });
});

// =============================================================================
// buildAmandemenBadgeHtml
// =============================================================================

describe('buildAmandemenBadgeHtml', () => {
  it('mengembalikan string kosong jika tidak ada amandemen', () => {
    expect(buildAmandemenBadgeHtml('0')).toBe('');
    expect(buildAmandemenBadgeHtml(undefined)).toBe('');
    expect(buildAmandemenBadgeHtml('')).toBe('');
  });

  it('menghasilkan elemen span dengan class badge-amandemen', () => {
    const html = buildAmandemenBadgeHtml('3');
    expect(html).toContain('badge-amandemen');
    expect(html).toContain('Amandemen III');
  });

  it('mengandung icon Bootstrap Icons bi-clock-history', () => {
    const html = buildAmandemenBadgeHtml('1');
    expect(html).toContain('bi-clock-history');
  });

  it('mengandung aria-label untuk aksesibilitas', () => {
    const html = buildAmandemenBadgeHtml('2');
    expect(html).toContain('aria-label="Amandemen II"');
  });

  it('menampilkan label amandemen terakhir untuk multi-amandemen', () => {
    const html = buildAmandemenBadgeHtml('1/2');
    expect(html).toContain('Amandemen II');
    // Gunakan aria-label untuk memastikan label yang ditampilkan adalah "Amandemen II", bukan "Amandemen I"
    expect(html).toContain('aria-label="Amandemen II"');
    expect(html).not.toContain('aria-label="Amandemen I"');
  });
});
