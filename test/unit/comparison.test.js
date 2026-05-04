/**
 * @file test/unit/comparison.test.js
 * @description Unit tests untuk src/utils/comparison.js
 *
 * Mencakup:
 *   TASK-022 — parseAmandemenFromText: semua 4 label, null jika tidak ada label
 *   TASK-023 — stripAmandemenLabel: hapus suffix label, teks tanpa label tidak berubah
 *   TASK-024 — buildPasalComparison: pasal normal, pasal baru, pasal dihapus, nomor invalid
 */

import { describe, expect, it } from 'vitest';
import {
  buildPasalComparison,
  parseAmandemenFromText,
  stripAmandemenLabel,
} from '../../src/utils/comparison.js';

// =============================================================================
// TASK-022: parseAmandemenFromText
// =============================================================================

describe('parseAmandemenFromText', () => {
  it('mengembalikan 1 untuk label (Amendemen Pertama)', () => {
    expect(parseAmandemenFromText('Teks ayat. (Amendemen Pertama)')).toBe(1);
  });

  it('mengembalikan 2 untuk label (Amendemen Kedua)', () => {
    expect(parseAmandemenFromText('Teks ayat. (Amendemen Kedua)')).toBe(2);
  });

  it('mengembalikan 3 untuk label (Amendemen Ketiga)', () => {
    expect(parseAmandemenFromText('Teks ayat. (Amendemen Ketiga)')).toBe(3);
  });

  it('mengembalikan 4 untuk label (Amendemen Keempat)', () => {
    expect(parseAmandemenFromText('Teks ayat. (Amendemen Keempat)')).toBe(4);
  });

  it('mengembalikan null jika tidak ada label amandemen', () => {
    expect(parseAmandemenFromText('Negara Indonesia ialah Negara Kesatuan.')).toBeNull();
  });

  it('mengembalikan null untuk string kosong', () => {
    expect(parseAmandemenFromText('')).toBeNull();
  });

  it('mengembalikan null untuk string undefined-like (null)', () => {
    // @ts-ignore — test intentionally passing null
    expect(parseAmandemenFromText(null)).toBeNull();
  });

  it('mengembalikan angka tertinggi untuk label gabungan (Amendemen Ketiga dan Keempat)', () => {
    expect(parseAmandemenFromText('Teks. (Amendemen Ketiga dan Keempat)')).toBe(4);
  });

  it('case-insensitive: mengenali label dengan huruf kecil', () => {
    expect(parseAmandemenFromText('Teks. (amendemen pertama)')).toBe(1);
  });

  it('teks yang mengandung label di tengah kalimat', () => {
    expect(
      parseAmandemenFromText(
        'Presiden berhak mengajukan rancangan undang-undang. (Amendemen Pertama)'
      )
    ).toBe(1);
  });
});

// =============================================================================
// TASK-023: stripAmandemenLabel
// =============================================================================

describe('stripAmandemenLabel', () => {
  it('menghapus label (Amendemen Pertama) dari teks', () => {
    const result = stripAmandemenLabel(
      'Presiden berhak mengajukan rancangan undang-undang. (Amendemen Pertama)'
    );
    expect(result).toBe('Presiden berhak mengajukan rancangan undang-undang.');
  });

  it('menghapus label (Amendemen Kedua) dari teks', () => {
    const result = stripAmandemenLabel('Negara Kesatuan berbentuk Republik. (Amendemen Kedua)');
    expect(result).toBe('Negara Kesatuan berbentuk Republik.');
  });

  it('menghapus label (Amendemen Ketiga) dari teks', () => {
    const result = stripAmandemenLabel('Presiden dipilih langsung. (Amendemen Ketiga)');
    expect(result).toBe('Presiden dipilih langsung.');
  });

  it('menghapus label (Amendemen Keempat) dari teks', () => {
    const result = stripAmandemenLabel('Dewan Perwakilan Rakyat. (Amendemen Keempat)');
    expect(result).toBe('Dewan Perwakilan Rakyat.');
  });

  it('tidak mengubah teks yang tidak mengandung label amandemen', () => {
    const original = 'Negara Indonesia ialah Negara Kesatuan yang berbentuk Republik.';
    expect(stripAmandemenLabel(original)).toBe(original);
  });

  it('menghapus label (Amendemen Ketiga dan Keempat)', () => {
    const result = stripAmandemenLabel(
      'Majelis Permusyawaratan Rakyat melantik Presiden. (Amendemen Ketiga dan Keempat)'
    );
    expect(result).toBe('Majelis Permusyawaratan Rakyat melantik Presiden.');
  });

  it('hasil tidak memiliki whitespace ekstra di awal atau akhir', () => {
    const result = stripAmandemenLabel('Teks ayat.   (Amendemen Pertama)   ');
    expect(result).toBe('Teks ayat.');
  });

  it('string kosong mengembalikan string kosong', () => {
    expect(stripAmandemenLabel('')).toBe('');
  });
});

// =============================================================================
// TASK-024: buildPasalComparison
// =============================================================================

/** Fixture minimal pasaluud45noamandemen.json */
const noAmandemenFixture = [
  {
    namapasal: 'Pasal 1',
    babpasal: 'Bab I Bentuk dan Kedaulatan',
    arrayisi: [
      { isi: 'Negara Indonesia ialah Negara Kesatuan yang berbentuk Republik.' },
      { isi: 'Kedaulatan adalah di tangan rakyat.' },
    ],
  },
  {
    namapasal: 'Pasal 6',
    babpasal: 'Bab III Kekuasaan Pemerintahan Negara',
    arrayisi: [{ isi: 'Presiden ialah orang Indonesia asli.' }],
  },
  {
    namapasal: 'Pasal 16',
    babpasal: 'Bab IV Dewan Pertimbangan Agung',
    arrayisi: [{ isi: 'Susunan Dewan Pertimbangan Agung ditetapkan dengan undang-undang.' }],
  },
];

/** Fixture minimal pasaluud45_ket_amandemen.json */
const ketAmandemenFixture = [
  {
    namapasal: 'Pasal 1',
    babpasal: 'Bab I Bentuk dan Kedaulatan',
    amandemen: '3',
    arrayisi: [
      { isi: 'Negara Indonesia ialah Negara Kesatuan yang berbentuk Republik.' },
      { isi: 'Kedaulatan berada di tangan rakyat. (Amendemen Ketiga)' },
      { isi: 'Negara Indonesia adalah negara hukum. (Amendemen Ketiga)' },
    ],
  },
  {
    namapasal: 'Pasal 6',
    babpasal: 'Bab III Kekuasaan Pemerintahan Negara',
    amandemen: '1',
    arrayisi: [
      { isi: 'Calon Presiden harus warga negara Indonesia. (Amendemen Pertama)' },
    ],
  },
  {
    namapasal: 'Pasal 6A',
    babpasal: 'Bab III Kekuasaan Pemerintahan Negara',
    amandemen: '3/4',
    arrayisi: [
      { isi: 'Presiden dan Wakil Presiden dipilih langsung. (Amendemen Ketiga)' },
    ],
  },
  {
    namapasal: 'Pasal Dihapus',
    babpasal: 'Bab IV Dewan Pertimbangan Agung',
    amandemen: '4',
    arrayisi: [
      { isi: 'Pasal sudah dihapus pada Amendemen keempat Undang-Undang Dasar' },
    ],
  },
];

describe('buildPasalComparison', () => {
  // ── Kasus: Pasal normal (ada di kedua sumber) ────────────────────────────

  it('mengembalikan PasalComparisonView untuk pasal normal (Pasal 1)', () => {
    const result = buildPasalComparison('1', noAmandemenFixture, ketAmandemenFixture);

    expect(result).not.toBeNull();
    expect(result?.namapasal).toBe('Pasal 1');
    expect(result?.isNewPasal).toBe(false);
    expect(result?.isDeletedPasal).toBe(false);
    expect(result?.amandemenNumber).toBe(3);
  });

  it('Pasal 1: menghasilkan 3 baris ayat (max dari 2 asli vs 3 amandemen)', () => {
    const result = buildPasalComparison('1', noAmandemenFixture, ketAmandemenFixture);
    expect(result?.ayatComparisons).toHaveLength(3);
  });

  it('Pasal 1 ayat 1: status unchanged (teks sama)', () => {
    const result = buildPasalComparison('1', noAmandemenFixture, ketAmandemenFixture);
    const ayat1 = result?.ayatComparisons[0];
    expect(ayat1?.status).toBe('unchanged');
    expect(ayat1?.index).toBe(1);
  });

  it('Pasal 1 ayat 2: status modified (teks berbeda)', () => {
    const result = buildPasalComparison('1', noAmandemenFixture, ketAmandemenFixture);
    const ayat2 = result?.ayatComparisons[1];
    expect(ayat2?.status).toBe('modified');
    expect(ayat2?.amandemenNumber).toBe(3);
  });

  it('Pasal 1 ayat 3: status added (tidak ada di asli)', () => {
    const result = buildPasalComparison('1', noAmandemenFixture, ketAmandemenFixture);
    const ayat3 = result?.ayatComparisons[2];
    expect(ayat3?.status).toBe('added');
    expect(ayat3?.originalText).toBeNull();
    expect(ayat3?.amandemenNumber).toBe(3);
  });

  it('teks ayat pasca-amandemen sudah dibersihkan dari label', () => {
    const result = buildPasalComparison('1', noAmandemenFixture, ketAmandemenFixture);
    // Ayat 2 amandemen: 'Kedaulatan berada di tangan rakyat. (Amendemen Ketiga)'
    // Setelah strip → 'Kedaulatan berada di tangan rakyat.'
    expect(result?.ayatComparisons[1].amendedText).not.toContain('Amendemen');
    expect(result?.ayatComparisons[1].amendedText).toBe('Kedaulatan berada di tangan rakyat.');
  });

  // ── Kasus: Pasal baru (isNewPasal = true) ────────────────────────────────

  it('mengembalikan isNewPasal: true untuk pasal yang tidak ada di asli (Pasal 6A)', () => {
    const result = buildPasalComparison('6A', noAmandemenFixture, ketAmandemenFixture);

    expect(result).not.toBeNull();
    expect(result?.namapasal).toBe('Pasal 6A');
    expect(result?.isNewPasal).toBe(true);
    expect(result?.isDeletedPasal).toBe(false);
    expect(result?.amandemenNumber).toBe(4); // tertinggi dari "3/4"
  });

  it('Pasal 6A: semua ayat berstatus added', () => {
    const result = buildPasalComparison('6A', noAmandemenFixture, ketAmandemenFixture);
    expect(result?.ayatComparisons.every((a) => a.status === 'added')).toBe(true);
    expect(result?.ayatComparisons.every((a) => a.originalText === null)).toBe(true);
  });

  // ── Kasus: Pasal dihapus (isDeletedPasal = true) ─────────────────────────

  it('mengembalikan isDeletedPasal: true untuk pasal Bab IV Dewan Pertimbangan Agung', () => {
    // Pasal Dihapus di Bab IV — namapasal mengandung "Dihapus"
    const result = buildPasalComparison('Dihapus', noAmandemenFixture, ketAmandemenFixture);

    expect(result).not.toBeNull();
    expect(result?.isDeletedPasal).toBe(true);
    expect(result?.isNewPasal).toBe(false);
    expect(result?.ayatComparisons).toHaveLength(0);
  });

  // ── Kasus: Nomor tidak valid → return null ───────────────────────────────

  it('mengembalikan null jika nomor pasal tidak ditemukan di manapun', () => {
    const result = buildPasalComparison('999', noAmandemenFixture, ketAmandemenFixture);
    expect(result).toBeNull();
  });

  it('mengembalikan null untuk nomor pasal kosong', () => {
    const result = buildPasalComparison('', noAmandemenFixture, ketAmandemenFixture);
    expect(result).toBeNull();
  });

  it('case-insensitive: "6a" sama dengan "6A"', () => {
    const lower = buildPasalComparison('6a', noAmandemenFixture, ketAmandemenFixture);
    const upper = buildPasalComparison('6A', noAmandemenFixture, ketAmandemenFixture);
    expect(lower?.namapasal).toBe(upper?.namapasal);
  });
});
