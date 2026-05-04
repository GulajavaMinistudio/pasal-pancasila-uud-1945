/**
 * @file src/utils/pasal.js
 * @description Helper functions untuk halaman-halaman Pasal UUD 1945.
 *
 * Layer: Adapter (src/utils/) — hanya boleh mengimpor src/types/
 * Referensi: planning TASK-004, TASK-003
 */

/** @type {Record<string, string>} */
const AMANDEMEN_LABEL_MAP = {
  1: 'Amandemen I',
  2: 'Amandemen II',
  3: 'Amandemen III',
  4: 'Amandemen IV',
};

/**
 * Konversi URL parameter pasal ke nama pasal yang sesuai di JSON.
 * Case-insensitive: '7a' → 'Pasal 7A', '28c' → 'Pasal 28C'.
 *
 * @param {string} param - URL parameter (mis. '7', '7A', '28C')
 * @returns {string} Nama pasal dalam format 'Pasal X' (mis. 'Pasal 7', 'Pasal 7A')
 */
export function parsePasalNomor(param) {
  if (!param || typeof param !== 'string') return '';
  const normalized = param.trim().toUpperCase();
  return `Pasal ${normalized}`;
}

/**
 * Bangun Map dari namapasal → data amandemen untuk lookup O(1).
 *
 * @param {Array<{ namapasal: string; amandemen: string; babpasal: string }>} ketAmandemenList
 * @returns {Map<string, { amandemen: string; babpasal: string }>}
 */
export function buildAmandemenMap(ketAmandemenList) {
  /** @type {Map<string, { amandemen: string; babpasal: string }>} */
  const map = new Map();
  for (const item of ketAmandemenList) {
    map.set(item.namapasal, { amandemen: item.amandemen, babpasal: item.babpasal });
  }
  return map;
}

/**
 * Kembalikan label singkat amandemen untuk ditampilkan di badge.
 * Jika pasal diamandemen lebih dari satu kali (mis. "1/2"), tampilkan amandemen terakhir.
 *
 * @param {string | undefined} amandemen - Nilai field amandemen (mis. "0", "1", "3/4")
 * @returns {string | null} Label badge (mis. 'Amandemen I') atau null jika tidak ada amandemen
 */
export function getAmandemenBadgeLabel(amandemen) {
  if (!amandemen || amandemen === '0') return null;
  const parts = amandemen.split('/');
  const last = parts[parts.length - 1];
  return AMANDEMEN_LABEL_MAP[last] ?? null;
}

/**
 * Build HTML badge amandemen.
 *
 * @param {string | undefined} amandemen - Nilai field amandemen
 * @returns {string} HTML string badge, atau string kosong jika tidak ada amandemen
 */
export function buildAmandemenBadgeHtml(amandemen) {
  const label = getAmandemenBadgeLabel(amandemen);
  if (!label) return '';
  return `<span class="badge-amandemen" aria-label="${label}"><i class="bi bi-clock-history" aria-hidden="true"></i>${label}</span>`;
}
