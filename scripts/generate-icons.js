#!/usr/bin/env node
/**
 * @file scripts/generate-icons.js
 * @description Menyalin aset ikon sumber dari public/images ke public/icons.
 *
 * Script ini menjaga pipeline prebuild tetap konsisten: vite-plugin-pwa membaca
 * ikon dari folder public/icons, sementara desainer menaruh ikon final di
 * public/images.
 */

import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT_DIR = join(__dirname, '..');
const SOURCE_DIR = join(ROOT_DIR, 'public', 'images');
const OUTPUT_DIR = join(ROOT_DIR, 'public', 'icons');

const ICON_FILE_MAP = [
  { source: 'favicon-32x32.png', target: 'icon-32.png' },
  { source: 'apple-touch-icon.png', target: 'icon-180.png' },
  { source: 'android-chrome-192x192.png', target: 'icon-192.png' },
  { source: 'android-chrome-512x512.png', target: 'icon-512.png' },
];

console.log('\n🧩 Syncing icon assets to public/icons...\n');
mkdirSync(OUTPUT_DIR, { recursive: true });

for (const { source, target } of ICON_FILE_MAP) {
  const sourcePath = join(SOURCE_DIR, source);
  const targetPath = join(OUTPUT_DIR, target);

  if (!existsSync(sourcePath)) {
    throw new Error(`Missing source icon: ${sourcePath}`);
  }

  copyFileSync(sourcePath, targetPath);
  console.log(`  ✅ ${target}  <-  images/${source}`);
}

console.log(`\n📁 Output: ${OUTPUT_DIR}`);
console.log('✨ Icon sync completed.\n');
