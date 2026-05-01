/**
 * @file src/types/data.ts
 * @description TypeScript interfaces untuk seluruh 7 file JSON data aplikasi.
 *
 * File ini adalah Domain Contracts layer — tidak boleh diimport oleh src/data/ ke
 * lapisan di atasnya. Semua interfaces bersifat readonly untuk immutability.
 *
 * Sumber: spec-data-schema-pasaluud1945.md §4
 */

// ---------------------------------------------------------------------------
// Shared Base Types
// ---------------------------------------------------------------------------

/**
 * Representasi satu ayat atau butir teks.
 * Digunakan oleh PasalUUDItem, PasalUUDNoAmandemenItem, PasalUUDKetAmandemenItem.
 */
export interface AyatPasal {
  readonly isi: string;
}

// ---------------------------------------------------------------------------
// §4.2 — silapancasila.json
// ---------------------------------------------------------------------------

/**
 * @file silapancasila.json
 * @description Daftar 5 teks Sila Pancasila.
 * Field `data` berisi 5 elemen teks sila (index 0 = Sila 1, index 4 = Sila 5).
 */
export interface SilaPancasilaData {
  readonly data: readonly string[];
}

// ---------------------------------------------------------------------------
// §4.3 — butir_pancasila.json
// ---------------------------------------------------------------------------

/** Satu butir pengamalan Pancasila */
export interface ButirItem {
  readonly isi: string;
}

/** Kumpulan butir untuk satu sila */
export interface ButirSila {
  /** Format: "Sila 1" s.d. "Sila 5" */
  readonly namasila: string;
  readonly arrayisi: readonly ButirItem[];
}

/**
 * @file butir_pancasila.json
 * @description Butir-butir pengamalan Pancasila per sila.
 * Field `data` berisi 5 elemen ButirSila (satu per sila).
 */
export interface ButirPancasilaData {
  readonly data: readonly ButirSila[];
}

// ---------------------------------------------------------------------------
// §4.4 — pembukaanuud.json
// ---------------------------------------------------------------------------

/**
 * @file pembukaanuud.json
 * @description 4 Alinea Pembukaan UUD 1945.
 * Field `data` berisi 4 elemen teks alinea (index 0 = Alinea Pertama).
 */
export interface PembukaanUUDData {
  readonly data: readonly string[];
}

// ---------------------------------------------------------------------------
// §4.5 — pasaluud45.json (Pasca-Amandemen)
// ---------------------------------------------------------------------------

/**
 * Satu pasal UUD 1945 pasca-amandemen.
 * `namapasal` format: "Pasal {nomor}" — nomor bisa alfanumerik ("Pasal 6A").
 */
export interface PasalUUDItem {
  readonly namapasal: string;
  readonly arrayisi: readonly AyatPasal[];
}

/**
 * @file pasaluud45.json
 * @description Seluruh pasal UUD 1945 versi pasca-amandemen (berlaku).
 */
export interface PasalUUDData {
  readonly data: readonly PasalUUDItem[];
}

// ---------------------------------------------------------------------------
// §4.6 — pasaluud45noamandemen.json (Asli Sebelum Amandemen)
// ---------------------------------------------------------------------------

/**
 * Satu pasal UUD 1945 versi asli sebelum amandemen.
 * Memiliki field `babpasal` yang tidak ada di versi pasca-amandemen.
 */
export interface PasalUUDNoAmandemenItem {
  readonly namapasal: string;
  /** Nama bab lengkap tempat pasal berada, contoh: "Bab I Bentuk dan Kedaulatan" */
  readonly babpasal: string;
  readonly arrayisi: readonly AyatPasal[];
}

/**
 * @file pasaluud45noamandemen.json
 * @description Pasal UUD 1945 versi asli sebelum amandemen.
 */
export interface PasalUUDNoAmandemenData {
  readonly data: readonly PasalUUDNoAmandemenItem[];
}

// ---------------------------------------------------------------------------
// §4.7 — pasaluud45_ket_amandemen.json (Keterangan Amandemen)
// ---------------------------------------------------------------------------

/**
 * Satu pasal dengan keterangan amandemen.
 *
 * Nilai field `amandemen`:
 * - "0"   = Tidak diamandemen
 * - "1"   = Amandemen I (1999)
 * - "2"   = Amandemen II (2000)
 * - "3"   = Amandemen III (2001)
 * - "4"   = Amandemen IV (2002)
 * - "1/2" = Amandemen I dan II (kombinasi dengan separator "/")
 */
export interface PasalUUDKetAmandemenItem {
  readonly namapasal: string;
  readonly babpasal: string;
  readonly amandemen: string;
  readonly arrayisi: readonly AyatPasal[];
}

/**
 * @file pasaluud45_ket_amandemen.json
 * @description Pasal UUD 1945 dengan keterangan amandemen I–IV.
 */
export interface PasalUUDKetAmandemenData {
  readonly data: readonly PasalUUDKetAmandemenItem[];
}

// ---------------------------------------------------------------------------
// §4.8 — babpasal.json
// ---------------------------------------------------------------------------

/**
 * Detail satu bab: nama singkat dan daftar nama pasal di dalamnya.
 *
 * Catatan: format `nama_bab` tidak konsisten di data sumber —
 * ada "Bab I" dan ada "BAB II". Normalisasi dilakukan di layer Presentation.
 */
export interface BabPasalItem {
  /** Nama bab singkat, format tidak konsisten: "Bab I", "BAB II", dll. */
  readonly nama_bab: string;
  /** Daftar nama pasal dalam bab ini, contoh: ["Pasal 1", "Pasal 2"] */
  readonly isi_bab: readonly string[];
}

/**
 * @file babpasal.json
 * @description Struktur hierarki 21 Bab UUD 1945 dengan mapping pasal.
 */
export interface BabPasalData {
  /** Nama bab lengkap, contoh: "Bab I Bentuk dan Kedaulatan" — 21 elemen */
  readonly bab_pasal: readonly string[];
  /** Keterangan singkat bab, contoh: "Bentuk dan Kedaulatan" — 21 elemen */
  readonly keterangan_bab_pasal: readonly string[];
  /** Detail struktur setiap bab — 21 elemen */
  readonly isi_bab_pasal: readonly BabPasalItem[];
}
