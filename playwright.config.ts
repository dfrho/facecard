import { defineConfig, devices } from '@playwright/test';
import { E2E_BASE_URL, E2E_PORT, E2E_SERVER_ENV } from './e2e/support/env';

const isCI = !!process.env.CI;

/**
 * End-to-end tests against a local copy of the app (`npm run test:e2e`).
 * Locally this starts `next dev`; in CI it tests a production build.
 * Checks against the deployed site live in playwright.live.config.ts.
 */
export default defineConfig({
  testDir: './e2e/app',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: E2E_BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: isCI
      ? `npm run build && npm run start -- -p ${E2E_PORT}`
      : `npm run dev -- -p ${E2E_PORT}`,
    url: E2E_BASE_URL,
    env: E2E_SERVER_ENV,
    // Always start a fresh server so it runs with the test credentials above.
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
