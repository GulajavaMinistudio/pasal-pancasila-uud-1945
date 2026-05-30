#!/usr/bin/env node
/**
 * @file scripts/generate-og-banner.js
 * @description Menyalin aset ikon utama menjadi OG image.
 *
 * Catatan: platform sosial idealnya memakai rasio 1200x630. Untuk saat ini,
 * permintaan user adalah mengganti OG banner menggunakan ikon baru.
 */

import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT_DIR = join(__dirname, '..');
const OUTPUT_DIR = join(ROOT_DIR, 'public', 'images');
const OUTPUT_FILE = join(OUTPUT_DIR, 'og-banner.png');

const SOURCE_CANDIDATES = [
  join(OUTPUT_DIR, 'ic_large_pancasila_uud_web.png'),
  join(OUTPUT_DIR, 'android-chrome-512x512.png'),
];

const sourceFile = SOURCE_CANDIDATES.find((filePath) => existsSync(filePath));

if (!sourceFile) {
  throw new Error('Cannot generate og-banner.png: source icon not found in public/images');
}

console.log('\n🖼️  Syncing OG banner from icon asset...\n');
mkdirSync(OUTPUT_DIR, { recursive: true });
copyFileSync(sourceFile, OUTPUT_FILE);

console.log(`  ✅ og-banner.png  <-  ${sourceFile.replace(ROOT_DIR + '\\', '')}`);
console.log(`\n📁 Output: ${OUTPUT_FILE}`);
console.log('✨ OG banner sync completed.\n');
