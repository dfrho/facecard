import { defineConfig } from '@playwright/test';

/**
 * Smoke checks against the deployed site (`npm run test:live`).
 * Point them at another deployment with LIVE_URL=https://... npm run test:live
 */
export default defineConfig({
  testDir: './e2e/live',
  retries: 1,
  reporter: process.env.CI ? [['github'], ['list']] : [['list']],
  use: {
    baseURL: process.env.LIVE_URL || 'https://facecard-david-rhodes-projects.vercel.app',
  },
});
