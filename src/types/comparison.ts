/**
 * @file src/types/comparison.ts
 * @description TypeScript interfaces dan konstanta untuk fitur perbandingan
 * pasal UUD 1945 side-by-side (asli vs. pasca-amandemen).
 *
 * Sumber: spec-data-schema §7.4
 * Referensi: planning TASK-014, TASK-017
 */

// ---------------------------------------------------------------------------
// Tipe Primitif
// ---------------------------------------------------------------------------

/** Nomor amandemen sebagai angka literal (1–4) */
export type AmandemenNumber = 1 | 2 | 3 | 4;

/**
 * Label amandemen sebagai string yang muncul di teks ayat JSON.
 * Format persis yang digunakan di data sumber.
 */
export type AmandemenLabel =
  | '(Amendemen Pertama)'
  | '(Amendemen Kedua)'
  | '(Amendemen Ketiga)'
  | '(Amendemen Keempat)';

// ---------------------------------------------------------------------------
// Konstanta Warna Badge
// ---------------------------------------------------------------------------

/**
 * Warna hex per amandemen untuk badge pill di komponen perbandingan.
 * I = biru, II = hijau, III = oranye, IV = ungu.
 */
export const AMANDEMEN_BADGE_COLOR: Readonly<Record<AmandemenNumber, string>> = {
  1: '#1565C0',
  2: '#2E7D32',
  3: '#E65100',
  4: '#4A148C',
} as const;

// ---------------------------------------------------------------------------
// Item Perbandingan Satu Ayat
// ---------------------------------------------------------------------------

/**
 * Status perubahan satu ayat dalam perbandingan.
 * - `unchanged` : ayat ada di kedua versi (teks boleh berbeda sedikit)
 * - `added`     : ayat baru yang tidak ada di versi asli
 * - `modified`  : ayat ada di kedua versi tetapi teksnya berbeda signifikan
 * - `deleted`   : ayat ada di versi asli tetapi dihapus di versi baru
 */
export type AyatStatus = 'unchanged' | 'added' | 'modified' | 'deleted';

/**
 * Representasi satu baris perbandingan ayat dalam tampilan side-by-side.
 * Setiap baris bisa mewakili satu ayat dari sisi kiri, sisi kanan, atau keduanya.
 */
export interface AyatComparisonItem {
  /** Nomor urut baris (1-indexed, untuk tampilan) */
  readonly index: number;
  /** Teks ayat versi asli (null jika ayat ini tidak ada di versi asli) */
  readonly originalText: string | null;
  /** Teks ayat versi pasca-amandemen (null jika ayat ini dihapus) */
  readonly amendedText: string | null;
  /** Status perubahan ayat ini */
  readonly status: AyatStatus;
  /**
   * Nomor amandemen yang mengubah ayat ini.
   * Diambil dari label inline seperti "(Amendemen Pertama)" pada teks.
   * null jika ayat tidak memiliki label amandemen (unchanged/deleted).
   */
  readonly amandemenNumber: AmandemenNumber | null;
}

// ---------------------------------------------------------------------------
// View Model Perbandingan Satu Pasal
// ---------------------------------------------------------------------------

/**
 * View model lengkap untuk satu pasal yang akan dirender oleh PasalComparisonCard.
 * Dihasilkan oleh fungsi `buildPasalComparison` di `src/utils/comparison.js`.
 */
export interface PasalComparisonView {
  /** Nama pasal, contoh: "Pasal 7" atau "Pasal 7A" */
  readonly namapasal: string;
  /**
   * Nomor amandemen tertinggi yang mengubah pasal ini.
   * Diekstrak dari field `amandemen` di `pasaluud45_ket_amandemen.json`.
   * Contoh: "3/4" → 4, "1" → 1.
   */
  readonly amandemenNumber: AmandemenNumber | null;
  /**
   * true jika pasal ini TIDAK ada di `pasaluud45noamandemen.json`
   * (pasal ditambahkan lewat proses amandemen, bukan pasal asli).
   */
  readonly isNewPasal: boolean;
  /**
   * true jika pasal ini ada di `pasaluud45noamandemen.json`
   * tetapi tidak ditemukan di `pasaluud45_ket_amandemen.json`
   * (pasal dihapus melalui proses amandemen).
   * Catatan: dalam data aktual, pasal dihapus direpresentasikan sebagai
   * "Pasal Dihapus" di `babpasal` field.
   */
  readonly isDeletedPasal: boolean;
  /**
   * Daftar baris perbandingan ayat (side-by-side).
   * Kosong jika isNewPasal atau isDeletedPasal.
   */
  readonly ayatComparisons: readonly AyatComparisonItem[];
}
