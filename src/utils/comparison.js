/**
 * @file src/utils/comparison.js
 * @description Fungsi utilitas untuk membangun view model perbandingan pasal
 * UUD 1945 side-by-side: teks asli (sebelum amandemen) vs. teks pasca-amandemen.
 *
 * Tiga fungsi utama (sesuai spec-data-schema §7.4):
 *   1. parseAmandemenFromText(text)     — ekstrak nomor amandemen dari label inline
 *   2. stripAmandemenLabel(text)        — hapus label inline dari teks ayat
 *   3. buildPasalComparison(...)        — bangun PasalComparisonView lengkap
 *
 * Keterbatasan data (REQ-009):
 *   Hanya tersedia dua snapshot: pasaluud45noamandemen.json (asli) dan
 *   pasaluud45_ket_amandemen.json (pasca-amandemen terakhir).
 *   Perbandingan per-step amandemen TIDAK dapat dilakukan.
 *
 * Referensi: planning TASK-013, TASK-022, TASK-023, TASK-024
 * Layer: Adapter (src/utils/) — hanya boleh mengimpor dari src/types/
 */

/**
 * Peta dari label amandemen (muncul di teks ayat) ke nomor amandemen.
 * Urutan penting: lebih spesifik dahulu untuk menghindari false-match.
 *
 * @type {Array<{ pattern: RegExp; number: import('../types/comparison').AmandemenNumber }>}
 */
const AMANDEMEN_LABEL_MAP = [
  // Variasi gabungan — harus diperiksa sebelum yang tunggal
  { pattern: /\(Amendemen Ketiga dan Keempat\)/i, number: /** @type {4} */ (4) },
  { pattern: /\(Amendemen Pertama dan Kedua\)/i, number: /** @type {2} */ (2) },
  // Label tunggal standar
  { pattern: /\(Amendemen Pertama\)/i, number: /** @type {1} */ (1) },
  { pattern: /\(Amendemen Kedua\)/i, number: /** @type {2} */ (2) },
  { pattern: /\(Amendemen Ketiga\)/i, number: /** @type {3} */ (3) },
  { pattern: /\(Amendemen Keempat\)/i, number: /** @type {4} */ (4) },
  // Variasi tambahan yang ditemukan di data aktual
  { pattern: /\(Pasal ditambahkan di Amendemen Kedua.*?\)/i, number: /** @type {2} */ (2) },
];

/** Pattern untuk menghapus semua label amandemen dari teks */
const AMANDEMEN_LABEL_STRIP_PATTERN =
  /\s*\((?:Amendemen (?:Pertama|Kedua|Ketiga|Keempat)(?:\s*dan\s*Keempat)?|Pasal ditambahkan di Amendemen.*?)\)\s*\.?/gi;

/**
 * Ekstrak nomor amandemen dari label inline di teks ayat.
 * Mengembalikan nomor amandemen TERTINGGI jika ada lebih dari satu label.
 *
 * @param {string} text - Teks ayat yang mungkin mengandung label amandemen
 * @returns {import('../types/comparison').AmandemenNumber | null}
 *   Nomor amandemen (1–4), atau null jika tidak ada label
 *
 * @example
 * parseAmandemenFromText('Teks ayat. (Amendemen Pertama)') // → 1
 * parseAmandemenFromText('Teks ayat.') // → null
 * parseAmandemenFromText('Teks. (Amendemen Ketiga dan Keempat)') // → 4
 */
export function parseAmandemenFromText(text) {
  if (!text || typeof text !== 'string') return null;

  /** @type {import('../types/comparison').AmandemenNumber | null} */
  let highest = null;

  for (const { pattern, number } of AMANDEMEN_LABEL_MAP) {
    if (pattern.test(text)) {
      if (highest === null || number > highest) {
        highest = number;
      }
      // Reset lastIndex untuk regex dengan flag /g
      pattern.lastIndex = 0;
    }
  }

  return highest;
}

/**
 * Hapus semua label amandemen inline dari teks ayat.
 * Digunakan untuk menampilkan teks bersih tanpa label di kolom perbandingan.
 *
 * @param {string} text - Teks ayat yang mungkin mengandung label amandemen
 * @returns {string} Teks bersih tanpa label amandemen, whitespace dipangkas
 *
 * @example
 * stripAmandemenLabel('Presiden berhak mengajukan rancangan. (Amendemen Pertama)')
 *   // → 'Presiden berhak mengajukan rancangan.'
 * stripAmandemenLabel('Teks tanpa label')
 *   // → 'Teks tanpa label' (tidak berubah)
 */
export function stripAmandemenLabel(text) {
  if (!text || typeof text !== 'string') return '';
  return text.replace(AMANDEMEN_LABEL_STRIP_PATTERN, '').trim();
}

/**
 * Bangun view model perbandingan untuk satu pasal.
 *
 * Logika:
 *   1. Cari pasal di `ketAmandemenData` berdasarkan `namapasal` (case-insensitive)
 *   2. Cari pasal di `noAmandemenData` berdasarkan `namapasal` (case-insensitive)
 *   3. Jika tidak ditemukan di kedua sumber → return null
 *   4. Jika hanya ada di ketAmandemen → isNewPasal: true
 *   5. Jika pasal ketAmandemen memiliki namapasal "Pasal Dihapus" (dari Bab IV)
 *      atau tidak ada di ketAmandemen tetapi ada di noAmandemen → isDeletedPasal: true
 *   6. Jika ada di kedua → bangun ayatComparisons side-by-side
 *
 * @param {string} nomor
 *   Nomor pasal tanpa prefix "Pasal " — contoh: "7", "7A", "28C"
 * @param {readonly import('../types/data').PasalUUDNoAmandemenItem[]} noAmandemenData
 *   Data dari pasaluud45noamandemen.json
 * @param {readonly import('../types/data').PasalUUDKetAmandemenItem[]} ketAmandemenData
 *   Data dari pasaluud45_ket_amandemen.json
 * @returns {import('../types/comparison').PasalComparisonView | null}
 *   View model perbandingan, atau null jika pasal tidak ditemukan di manapun
 */
export function buildPasalComparison(nomor, noAmandemenData, ketAmandemenData) {
  const searchName = `Pasal ${nomor}`.toLowerCase().trim();

  const ketItem = _findPasalByName(ketAmandemenData, searchName);
  const noAmItem = _findPasalByName(noAmandemenData, searchName);

  // Pasal tidak ditemukan di manapun → return null (404)
  if (!ketItem && !noAmItem) return null;

  // Pasal ada di KetAmandemen tetapi namapasal-nya "Pasal Dihapus"
  // Ini adalah representasi Bab IV yang dihapus
  if (ketItem && ketItem.namapasal.toLowerCase().includes('dihapus')) {
    return {
      namapasal: `Pasal ${nomor}`,
      amandemenNumber: _parseAmandemenField(ketItem.amandemen),
      isNewPasal: false,
      isDeletedPasal: true,
      ayatComparisons: [],
    };
  }

  // Pasal ada di KetAmandemen tetapi TIDAK ada di NoAmandemen → pasal baru
  if (ketItem && !noAmItem) {
    const amandemenNumber = _parseAmandemenField(ketItem.amandemen);
    return {
      namapasal: ketItem.namapasal,
      amandemenNumber,
      isNewPasal: true,
      isDeletedPasal: false,
      ayatComparisons: _buildNewPasalAyatComparisons(ketItem.arrayisi),
    };
  }

  // Pasal ada di NoAmandemen tetapi TIDAK ada di KetAmandemen → pasal dihapus
  if (noAmItem && !ketItem) {
    return {
      namapasal: noAmItem.namapasal,
      amandemenNumber: null,
      isNewPasal: false,
      isDeletedPasal: true,
      ayatComparisons: [],
    };
  }

  // Pasal ada di kedua sumber → bangun perbandingan normal
  if (ketItem && noAmItem) {
    const amandemenNumber = _parseAmandemenField(ketItem.amandemen);
    const ayatComparisons = _buildAyatComparisons(noAmItem.arrayisi, ketItem.arrayisi);

    return {
      namapasal: ketItem.namapasal,
      amandemenNumber,
      isNewPasal: false,
      isDeletedPasal: false,
      ayatComparisons,
    };
  }

  return null;
}

// =============================================================================
// Private helpers
// =============================================================================

/**
 * Cari pasal dalam array berdasarkan nama (case-insensitive).
 *
 * @template T
 * @param {readonly (T & { namapasal: string })[]} list
 * @param {string} searchNameLower - Nama pasal dalam lowercase
 * @returns {(T & { namapasal: string }) | null}
 */
function _findPasalByName(list, searchNameLower) {
  return list.find((item) => item.namapasal.toLowerCase().trim() === searchNameLower) ?? null;
}

/**
 * Parse field `amandemen` dari KetAmandemen data menjadi AmandemenNumber.
 * Untuk nilai gabungan seperti "3/4", ambil angka tertinggi.
 *
 * @param {string} amandemenField - Nilai field amandemen: "0", "1", "2", "3", "4", "1/2", dll.
 * @returns {import('../types/comparison').AmandemenNumber | null}
 */
function _parseAmandemenField(amandemenField) {
  if (!amandemenField || amandemenField === '0') return null;

  const parts = amandemenField.split('/').map(Number).filter((n) => n >= 1 && n <= 4);
  if (parts.length === 0) return null;

  const max = Math.max(...parts);
  if (max < 1 || max > 4) return null;

  return /** @type {import('../types/comparison').AmandemenNumber} */ (max);
}

/**
 * Bangun daftar AyatComparisonItem untuk pasal baru (isNewPasal = true).
 * Semua ayat dianggap berstatus 'added'.
 *
 * @param {readonly import('../types/data').AyatPasal[]} amendedAyatList
 * @returns {import('../types/comparison').AyatComparisonItem[]}
 */
function _buildNewPasalAyatComparisons(amendedAyatList) {
  return amendedAyatList.map((ayat, i) => ({
    index: i + 1,
    originalText: null,
    amendedText: stripAmandemenLabel(ayat.isi),
    status: /** @type {import('../types/comparison').AyatStatus} */ ('added'),
    amandemenNumber: parseAmandemenFromText(ayat.isi),
  }));
}

/**
 * Bangun daftar AyatComparisonItem untuk pasal normal (ada di kedua sumber).
 *
 * Strategi perbandingan (sederhana, position-based):
 * - Pasangkan ayat berdasarkan urutan (index ke-i di asli dengan index ke-i di amandemen)
 * - Ayat pasca-amandemen lebih banyak → ayat tambahan berstatus 'added'
 * - Ayat asli lebih banyak → ayat ekstra berstatus 'deleted'
 * - Teks sama (setelah strip label) → 'unchanged', berbeda → 'modified'
 *
 * @param {readonly import('../types/data').AyatPasal[]} originalAyatList
 * @param {readonly import('../types/data').AyatPasal[]} amendedAyatList
 * @returns {import('../types/comparison').AyatComparisonItem[]}
 */
function _buildAyatComparisons(originalAyatList, amendedAyatList) {
  const maxLen = Math.max(originalAyatList.length, amendedAyatList.length);
  /** @type {import('../types/comparison').AyatComparisonItem[]} */
  const result = [];

  for (let i = 0; i < maxLen; i++) {
    const origAyat = originalAyatList[i] ?? null;
    const amndAyat = amendedAyatList[i] ?? null;

    const origText = origAyat?.isi ?? null;
    const amndTextRaw = amndAyat?.isi ?? null;
    const amndTextClean = amndTextRaw ? stripAmandemenLabel(amndTextRaw) : null;

    /** @type {import('../types/comparison').AyatStatus} */
    let status;
    /** @type {import('../types/comparison').AmandemenNumber | null} */
    let amandemenNumber = null;

    if (origText !== null && amndTextRaw !== null) {
      // Kedua ayat ada — bandingkan teks bersih
      const origClean = origText.trim().toLowerCase();
      const amndClean = (amndTextClean ?? '').trim().toLowerCase();
      status = origClean === amndClean ? 'unchanged' : 'modified';
      amandemenNumber = parseAmandemenFromText(amndTextRaw);
    } else if (origText === null && amndTextRaw !== null) {
      // Ayat baru di versi amandemen
      status = 'added';
      amandemenNumber = parseAmandemenFromText(amndTextRaw);
    } else {
      // Ayat hanya ada di versi asli — dihapus
      status = 'deleted';
    }

    result.push({
      index: i + 1,
      originalText: origText,
      amendedText: amndTextClean,
      status,
      amandemenNumber,
    });
  }

  return result;
}
