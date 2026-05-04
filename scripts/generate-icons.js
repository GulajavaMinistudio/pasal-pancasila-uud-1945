#!/usr/bin/env node
/**
 * @file scripts/generate-icons.js
 * @description Generator app icons untuk PWA — menghasilkan PNG di public/icons/.
 *
 * Menggunakan pure Node.js (node:zlib, node:fs) tanpa dependensi eksternal.
 * Desain: background merah (#C62828) dengan ring putih konsentris (emblem-style).
 * Ukuran yang dihasilkan: 32x32, 180x180, 192x192, 512x512 (maskable).
 *
 * Referensi planning: TASK-007 (Phase 3.1)
 * Jalankan: node scripts/generate-icons.js
 */

import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT_DIR = join(__dirname, '..');
const OUTPUT_DIR = join(ROOT_DIR, 'public', 'icons');

// =============================================================================
// Brand Colors (RGB)
// =============================================================================
const COLOR_RED = [0xc6, 0x28, 0x28]; // #C62828 — merah primer aplikasi
const COLOR_WHITE = [0xff, 0xff, 0xff]; // #FFFFFF — putih
const COLOR_RED_DARK = [0xb7, 0x1c, 0x1c]; // #B71C1C — merah lebih gelap

// =============================================================================
// Pure Node.js PNG Writer
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
 * @param {string} type  - Tipe chunk (4 huruf, ASCII)
 * @param {Buffer} data  - Data payload
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
 * Hasilkan PNG dari fungsi pixel renderer.
 * Format: IHDR (RGB, 8-bit) + IDAT (deflated scanlines) + IEND.
 *
 * @param {number} size       - Ukuran sisi (width = height)
 * @param {(x: number, y: number, size: number) => number[]} pixelFn
 *   - Mengembalikan [r, g, b] untuk koordinat (x, y)
 * @returns {Buffer}
 */
function buildPNG(size, pixelFn) {
  // PNG file signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR: width, height, bit depth=8, color type=2 (RGB), compression=0, filter=0, interlace=0
  const ihdrData = Buffer.allocUnsafe(13);
  ihdrData.writeUInt32BE(size, 0);
  ihdrData.writeUInt32BE(size, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // color type: RGB (truecolor)
  ihdrData[10] = 0; // compression method
  ihdrData[11] = 0; // filter method
  ihdrData[12] = 0; // interlace method

  // IDAT: scanlines — setiap baris diawali byte filter (0 = None), lalu RGB per pixel
  const rowSize = 1 + size * 3;
  const rawData = Buffer.allocUnsafe(size * rowSize);
  for (let y = 0; y < size; y++) {
    rawData[y * rowSize] = 0; // filter byte: None
    for (let x = 0; x < size; x++) {
      const [r, g, b] = pixelFn(x, y, size);
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
// Icon Design: Emblem dengan ring putih konsentris
//
// Desain (dari luar ke dalam):
//   - Background merah (#C62828) — mengisi seluruh canvas
//   - Ring putih (#FFFFFF) — cincin melingkar (0.38r – 0.68r dari pusat)
//   - Titik merah gelap (#B71C1C) di tengah — aksen
//
// Desain ini:
//   - Terlihat jelas di semua ukuran (32px s.d. 512px)
//   - Memenuhi kriteria maskable (safe zone: lingkaran 80% canvas)
//   - Konsisten dengan palet merah-putih brand aplikasi
// =============================================================================

/**
 * Pixel renderer untuk ikon utama (semua ukuran).
 * @param {number} x
 * @param {number} y
 * @param {number} size
 * @returns {number[]} [r, g, b]
 */
function iconPixelRenderer(x, y, size) {
  const cx = (size - 1) / 2;
  const cy = (size - 1) / 2;

  // Jarak normalized dari pusat [0.0 = pusat, 1.0 = sudut]
  const nx = (x - cx) / (size / 2);
  const ny = (y - cy) / (size / 2);
  const dist = Math.sqrt(nx * nx + ny * ny);

  // Ring putih antara r=0.38 dan r=0.68
  if (dist >= 0.38 && dist <= 0.68) return COLOR_WHITE;

  // Titik merah gelap di pusat (r <= 0.18)
  if (dist <= 0.18) return COLOR_RED_DARK;

  // Background merah
  return COLOR_RED;
}

// =============================================================================
// Generate Icons
// =============================================================================

const ICON_SIZES = [32, 180, 192, 512];

console.log('\n🎨 Generating PWA app icons...\n');
mkdirSync(OUTPUT_DIR, { recursive: true });

for (const size of ICON_SIZES) {
  const pngBuffer = buildPNG(size, iconPixelRenderer);
  const outputPath = join(OUTPUT_DIR, `icon-${size}.png`);
  writeFileSync(outputPath, pngBuffer);
  console.log(`  ✅ icon-${size}.png  (${size}×${size}px, ${pngBuffer.length} bytes)`);
}

console.log(`\n📁 Output: ${OUTPUT_DIR}`);
console.log('✨ Icons generated successfully!\n');
console.log('💡 Tip: Ganti dengan ikon berdesain profesional sebelum production launch.');
