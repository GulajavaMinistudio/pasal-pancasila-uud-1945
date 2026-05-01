/**
 * @file src/data/loader.js
 * @description Layer Infrastructure — satu-satunya titik masuk untuk semua data JSON.
 *
 * Tanggung jawab:
 * - Memanggil fetch() ke file JSON di public/data/
 * - Menyimpan hasil di in-memory cache (fetch sekali per sesi)
 * - Melempar Error jika HTTP response tidak ok
 *
 * Larangan (CS-1):
 * - Tidak boleh mengandung logika UI, formatting teks, atau kondisi rendering
 * - Tidak boleh diimport oleh src/types/ (direction: inward only)
 *
 * URL konstruksi menggunakan import.meta.env.BASE_URL agar konsisten antara:
 * - Dev  (base: '/')                : /data/filename.json
 * - Prod (base: '/nama-repo/')      : /nama-repo/data/filename.json
 */

/**
 * @typedef {import('../types/data').SilaPancasilaData['data']} SilaDataArray
 * @typedef {import('../types/data').ButirPancasilaData['data']} ButirDataArray
 * @typedef {import('../types/data').PembukaanUUDData['data']} PembukaanDataArray
 * @typedef {import('../types/data').PasalUUDData['data']} PasalUUDDataArray
 * @typedef {import('../types/data').PasalUUDNoAmandemenData['data']} PasalNoAmandemenDataArray
 * @typedef {import('../types/data').PasalUUDKetAmandemenData['data']} PasalKetAmandemenDataArray
 * @typedef {import('../types/data').BabPasalData} BabPasalDataObject
 */

/** @type {{ [key: string]: unknown }} */
const _cache = {};

/**
 * Memuat teks 5 Sila Pancasila dari silapancasila.json.
 * @returns {Promise<SilaDataArray>} Array 5 string teks sila (index 0 = Sila 1)
 * @throws {Error} Jika HTTP request gagal
 */
export async function loadSilaPancasila() {
  if (_cache.silaPancasila) return /** @type {SilaDataArray} */ (_cache.silaPancasila);

  const response = await fetch(`${import.meta.env.BASE_URL}data/silapancasila.json`);
  if (!response.ok) {
    throw new Error(`Gagal memuat data sila Pancasila: HTTP ${response.status}`);
  }

  _cache.silaPancasila = (await response.json()).data;
  return /** @type {SilaDataArray} */ (_cache.silaPancasila);
}

/**
 * Memuat butir-butir pengamalan Pancasila dari butir_pancasila.json.
 * @returns {Promise<ButirDataArray>} Array 5 ButirSila (satu per sila)
 * @throws {Error} Jika HTTP request gagal
 */
export async function loadButirPancasila() {
  if (_cache.butirPancasila) return /** @type {ButirDataArray} */ (_cache.butirPancasila);

  const response = await fetch(`${import.meta.env.BASE_URL}data/butir_pancasila.json`);
  if (!response.ok) {
    throw new Error(`Gagal memuat data butir Pancasila: HTTP ${response.status}`);
  }

  _cache.butirPancasila = (await response.json()).data;
  return /** @type {ButirDataArray} */ (_cache.butirPancasila);
}

/**
 * Memuat 4 alinea Pembukaan UUD 1945 dari pembukaanuud.json.
 * @returns {Promise<PembukaanDataArray>} Array 4 string teks alinea (index 0 = Alinea Pertama)
 * @throws {Error} Jika HTTP request gagal
 */
export async function loadPembukaanUUD() {
  if (_cache.pembukaanUUD) return /** @type {PembukaanDataArray} */ (_cache.pembukaanUUD);

  const response = await fetch(`${import.meta.env.BASE_URL}data/pembukaanuud.json`);
  if (!response.ok) {
    throw new Error(`Gagal memuat data Pembukaan UUD 1945: HTTP ${response.status}`);
  }

  _cache.pembukaanUUD = (await response.json()).data;
  return /** @type {PembukaanDataArray} */ (_cache.pembukaanUUD);
}

/**
 * Memuat seluruh pasal UUD 1945 versi pasca-amandemen dari pasaluud45.json.
 * @returns {Promise<PasalUUDDataArray>} Array PasalUUDItem
 * @throws {Error} Jika HTTP request gagal
 */
export async function loadPasalUUD() {
  if (_cache.pasalUUD) return /** @type {PasalUUDDataArray} */ (_cache.pasalUUD);

  const response = await fetch(`${import.meta.env.BASE_URL}data/pasaluud45.json`);
  if (!response.ok) {
    throw new Error(`Gagal memuat data Pasal UUD 1945: HTTP ${response.status}`);
  }

  _cache.pasalUUD = (await response.json()).data;
  return /** @type {PasalUUDDataArray} */ (_cache.pasalUUD);
}

/**
 * Memuat pasal UUD 1945 versi asli sebelum amandemen dari pasaluud45noamandemen.json.
 * @returns {Promise<PasalNoAmandemenDataArray>} Array PasalUUDNoAmandemenItem
 * @throws {Error} Jika HTTP request gagal
 */
export async function loadPasalUUDNoAmandemen() {
  if (_cache.pasalUUDNoAmandemen) {
    return /** @type {PasalNoAmandemenDataArray} */ (_cache.pasalUUDNoAmandemen);
  }

  const response = await fetch(`${import.meta.env.BASE_URL}data/pasaluud45noamandemen.json`);
  if (!response.ok) {
    throw new Error(`Gagal memuat data Pasal UUD 1945 (asli): HTTP ${response.status}`);
  }

  _cache.pasalUUDNoAmandemen = (await response.json()).data;
  return /** @type {PasalNoAmandemenDataArray} */ (_cache.pasalUUDNoAmandemen);
}

/**
 * Memuat pasal UUD 1945 dengan keterangan amandemen dari pasaluud45_ket_amandemen.json.
 * @returns {Promise<PasalKetAmandemenDataArray>} Array PasalUUDKetAmandemenItem
 * @throws {Error} Jika HTTP request gagal
 */
export async function loadPasalUUDKetAmandemen() {
  if (_cache.pasalUUDKetAmandemen) {
    return /** @type {PasalKetAmandemenDataArray} */ (_cache.pasalUUDKetAmandemen);
  }

  const response = await fetch(`${import.meta.env.BASE_URL}data/pasaluud45_ket_amandemen.json`);
  if (!response.ok) {
    throw new Error(
      `Gagal memuat data Pasal UUD 1945 (keterangan amandemen): HTTP ${response.status}`
    );
  }

  _cache.pasalUUDKetAmandemen = (await response.json()).data;
  return /** @type {PasalKetAmandemenDataArray} */ (_cache.pasalUUDKetAmandemen);
}

/**
 * Memuat struktur 21 Bab UUD 1945 dari babpasal.json.
 * Mengembalikan full BabPasalData karena pages membutuhkan semua 3 array top-level.
 * @returns {Promise<BabPasalDataObject>} Objek dengan bab_pasal, keterangan_bab_pasal, isi_bab_pasal
 * @throws {Error} Jika HTTP request gagal
 */
export async function loadBabPasal() {
  if (_cache.babPasal) return /** @type {BabPasalDataObject} */ (_cache.babPasal);

  const response = await fetch(`${import.meta.env.BASE_URL}data/babpasal.json`);
  if (!response.ok) {
    throw new Error(`Gagal memuat data Bab Pasal UUD 1945: HTTP ${response.status}`);
  }

  _cache.babPasal = await response.json();
  return /** @type {BabPasalDataObject} */ (_cache.babPasal);
}
