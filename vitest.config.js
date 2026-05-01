import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['test/unit/**/*.test.js', 'test/component/**/*.test.js'],
    coverage: {
      provider: 'v8',
      // Cakupan coverage hanya untuk file yang di-unit/component test
      // Pages dan routes diuji via E2E Playwright, tidak via unit test
      include: [
        'src/components/**/*.js',
        'src/data/loader.js',
        'src/router/router.js',
        'src/utils/**/*.js',
      ],
      exclude: ['src/data/fixture/**'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
      reporter: ['text', 'lcov', 'html'],
    },
  },
});
