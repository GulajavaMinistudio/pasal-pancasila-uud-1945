import { defineConfig } from 'vite';

export default defineConfig({
  // GitHub Pages: https://gulajavaministudio.github.io/pasal-pancasila-uud-1945/
  // Ganti ke base: '/' jika menggunakan custom domain
  base: '/pasal-pancasila-uud-1945/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Bootstrap SCSS overrides dikonfigurasi di Phase 1.4
      },
    },
  },
});
