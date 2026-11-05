import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    // Unit tests live next to the code they cover. Playwright specs in e2e/ are excluded.
    include: ['src/**/*.test.{ts,tsx}'],
    // Node by default; files that need browser storage opt into jsdom with a docblock comment.
    environment: 'node',
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
  },
});
