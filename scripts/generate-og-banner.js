#!/usr/bin/env node
/**
 * @file scripts/generate-og-banner.js
 * @description Generator Open Graph banner image untuk SEO social sharing.
 *
 * Menghasilkan `public/images/og-banner.png` (1200×630 px) menggunakan
 * pure Node.js (node:zlib, node:fs) tanpa dependensi eksternal.
 *
 * Desain: merah-putih (brand aplikasi) — latar merah (#C62828) dengan
 * band putih di bawah dan emblem ring putih konsentris di tengah.
 *
 * Referensi planning: TASK-025 (Phase 3.3)
 * Jalankan: node scripts/generate-og-banner.js
 */

import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT_DIR = join(__dirname, '..');
const OUTPUT_DIR = join(ROOT_DIR, 'public', 'images');
const OUTPUT_FILE = join(OUTPUT_DIR, 'og-banner.png');

// =============================================================================
// Banner Dimensions
// =============================================================================
const BANNER_WIDTH = 1200;
const BANNER_HEIGHT = 630;

// =============================================================================
// Brand Colors (RGB)
// =============================================================================
const COLOR_RED = [0xc6, 0x28, 0x28]; // #C62828 — merah primer aplikasi
const COLOR_WHITE = [0xff, 0xff, 0xff]; // #FFFFFF — putih
const COLOR_RED_DARK = [0xb7, 0x1c, 0x1c]; // #B71C1C — merah lebih gelap

// =============================================================================
// Pure Node.js PNG Writer (rectangular support)
// =============================================================================

/**
 * Hitung CRC32 checksum untuk validasi chunk PNG.
 * @param {Buffer} buf
 * @returns {number}
 */
function crc32(buf) {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c;
  }
  let crc = 0xffffffff;
  for (const byte of buf) {
    crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

/**
 * Buat PNG chunk lengkap: length (4B) + type (4B) + data + CRC (4B).
 * @param {string} type
 * @param {Buffer} data
 * @returns {Buffer}
 */
function buildChunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.allocUnsafe(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcInput = Buffer.concat([typeBytes, data]);
  const crcBuf = Buffer.allocUnsafe(4);
  crcBuf.writeUInt32BE(crc32(crcInput), 0);
  return Buffer.concat([lenBuf, typeBytes, data, crcBuf]);
}

/**
 * Hasilkan rectangular PNG dari fungsi pixel renderer.
 * Format: IHDR (RGB, 8-bit) + IDAT (deflated scanlines) + IEND.
 *
 * @param {number} width
 * @param {number} height
 * @param {(x: number, y: number, w: number, h: number) => number[]} pixelFn
 *   Mengembalikan [r, g, b] untuk koordinat (x, y)
 * @returns {Buffer}
 */
function buildRectPNG(width, height, pixelFn) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.allocUnsafe(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // color type: RGB truecolor
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;

  // Setiap scanline: 1 byte filter (0=None) + width * 3 bytes RGB
  const rowSize = 1 + width * 3;
  const rawData = Buffer.allocUnsafe(height * rowSize);

  for (let y = 0; y < height; y++) {
    rawData[y * rowSize] = 0; // filter byte: None
    for (let x = 0; x < width; x++) {
      const [r, g, b] = pixelFn(x, y, width, height);
      const offset = y * rowSize + 1 + x * 3;
      rawData[offset] = r;
      rawData[offset + 1] = g;
      rawData[offset + 2] = b;
    }
  }

  const compressed = deflateSync(rawData);

  return Buffer.concat([
    signature,
    buildChunk('IHDR', ihdrData),
    buildChunk('IDAT', compressed),
    buildChunk('IEND', Buffer.alloc(0)),
  ]);
}

// =============================================================================
// Banner Design
//
// Desain merah-putih (bendera Indonesia) bergaya modern:
//   - Latar merah (#C62828) — area atas (68% tinggi)
//   - Band putih (#FFFFFF) — area bawah (32% tinggi)
//   - Garis pemisah merah gelap (#B71C1C) tipis di antara keduanya
//   - Emblem ring putih konsentris di tengah area merah
//     (konsisten dengan desain app icon di generate-icons.js)
//   - Aksen sudut: sudut kiri-atas dan kanan-bawah lebih gelap (merah gelap)
// =============================================================================

/** Batas vertikal pemisah area merah dan putih (rasio dari atas) */
const DIVIDER_RATIO = 0.68;
/** Ketebalan garis pemisah dalam piksel */
const DIVIDER_THICKNESS = 6;
/** Ketebalan border frame putih di pinggir */
const FRAME_WIDTH = 20;

/**
 * Pixel renderer untuk OG banner.
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @returns {number[]} [r, g, b]
 */
function bannerPixelRenderer(x, y, w, h) {
  const dividerY = Math.floor(h * DIVIDER_RATIO);

  // ── Frame putih di pinggir (semua sisi) ──────────────────────────────────
  if (x < FRAME_WIDTH || x >= w - FRAME_WIDTH || y < FRAME_WIDTH || y >= h - FRAME_WIDTH) {
    return COLOR_WHITE;
  }

  // ── Garis pemisah merah gelap ─────────────────────────────────────────────
  if (y >= dividerY && y < dividerY + DIVIDER_THICKNESS) {
    return COLOR_RED_DARK;
  }

  // ── Area putih (bawah) ────────────────────────────────────────────────────
  if (y >= dividerY + DIVIDER_THICKNESS) {
    return COLOR_WHITE;
  }

  // ── Area merah (atas) — tambahkan emblem ring konsentris di tengah ─────────
  const cx = w / 2;
  const cy = (dividerY * DIVIDER_RATIO) / 2 + FRAME_WIDTH / 2; // tengah area merah

  // Radius emblem: 28% dari lebar canvas
  const emblemRadius = w * 0.28;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const normDist = dist / emblemRadius;

  // Ring putih luar (0.72 – 0.85 dari radius emblem)
  if (normDist >= 0.72 && normDist <= 0.85) return COLOR_WHITE;

  // Ring putih tengah (0.50 – 0.58 dari radius emblem)
  if (normDist >= 0.5 && normDist <= 0.58) return COLOR_WHITE;

  // Cincin putih tipis dalam (0.32 – 0.37 dari radius emblem)
  if (normDist >= 0.32 && normDist <= 0.37) return COLOR_WHITE;

  // Titik merah gelap di pusat emblem (0.0 – 0.18)
  if (normDist <= 0.18) return COLOR_RED_DARK;

  // Latar merah
  return COLOR_RED;
}

// =============================================================================
// Generate Banner
// =============================================================================

console.log('\n🖼️  Generating OG banner...\n');
mkdirSync(OUTPUT_DIR, { recursive: true });

const pngBuffer = buildRectPNG(BANNER_WIDTH, BANNER_HEIGHT, bannerPixelRenderer);
writeFileSync(OUTPUT_FILE, pngBuffer);

console.log(`  ✅ og-banner.png  (${BANNER_WIDTH}×${BANNER_HEIGHT}px, ${pngBuffer.length} bytes)`);
console.log(`\n📁 Output: ${OUTPUT_FILE}`);
console.log('✨ OG banner generated successfully!\n');
console.log('💡 Tip: Ganti dengan banner berdesain profesional sebelum production launch.');
