import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// GitHub Pages: https://gulajavaministudio.github.io/pasal-pancasila-uud-1945/
// Ganti ke base: '/' jika menggunakan custom domain
const BASE_PATH = '/pasal-pancasila-uud-1945/';

export default defineConfig({
  base: BASE_PATH,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // TASK-047: Code splitting — setiap page sebagai chunk terpisah
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/bootstrap')) return 'bootstrap';
          if (id.includes('node_modules/fuse.js')) return 'fuse';
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Bootstrap SCSS overrides dikonfigurasi di Phase 1.4
      },
    },
  },
  plugins: [
    // ==========================================================================
    // VitePWA — Phase 3.1 (TASK-001 s.d. TASK-005)
    // Referensi planning: REQ-001, REQ-002, REQ-003, PAT-001
    // ==========================================================================
    VitePWA({
      // TASK-001: Core PWA config
      strategies: 'generateSW',
      registerType: 'autoUpdate',
      // injectRegister: null karena registerSW() dipanggil manual di main.js (TASK-006)
      // agar SW tidak terdaftar dua kali
      injectRegister: null,
      manifestFilename: 'manifest.json',

      // TASK-002: Web App Manifest
      manifest: {
        name: 'Pancasila & UUD 1945',
        short_name: 'UUD 1945',
        description: 'Referensi lengkap Pancasila dan Undang-Undang Dasar 1945 Republik Indonesia',
        start_url: BASE_PATH,
        scope: BASE_PATH,
        display: 'standalone',
        orientation: 'any',
        theme_color: '#C62828',
        background_color: '#ffffff',
        lang: 'id',
        categories: ['education', 'government'],
        // Icons dibuat oleh scripts/generate-icons.js (TASK-007)
        icons: [
          {
            src: 'icons/icon-32.png',
            sizes: '32x32',
            type: 'image/png',
          },
          {
            src: 'icons/icon-180.png',
            sizes: '180x180',
            type: 'image/png',
          },
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },

      workbox: {
        // TASK-003: Precache HTML, CSS, JS, ikon, dan font statis
        // JSON data dikecualikan dari precache — ditangani oleh runtimeCaching (PAT-001)
        globPatterns: ['**/*.{html,css,js,png,svg,ico,woff2,woff,ttf}'],

        // TASK-004: Runtime caching strategy per PAT-001
        runtimeCaching: [
          {
            // NetworkFirst untuk 7 file JSON data — segar dari network, cache saat offline
            urlPattern: /\/data\/.+\.json(\?.*)?$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'json-data-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 hari
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // StaleWhileRevalidate untuk Google Fonts CSS (cepat + selalu fresh)
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
            },
          },
          {
            // CacheFirst untuk Google Fonts files (jarang berubah, cache 1 tahun)
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],

        // TASK-005: SPA navigateFallback — semua route berfungsi saat offline
        navigateFallback: `${BASE_PATH}index.html`,
        // Kecualikan file dengan ekstensi (aset, JSON) dari navigate fallback
        navigateFallbackDenylist: [/\.[^/?#]+(\?.*)?$/, /^\/api\//],
      },

      // Nonaktifkan di dev mode — hindari konflik HMR dengan Service Worker
      devOptions: {
        enabled: false,
      },
    }),
  ],
});
