/**
 * Settings shared by the Playwright config and the end-to-end tests.
 * The OAuth credentials are fake: the tests stop at the provider's door and never sign in for real.
 */
export const E2E_PORT = 3100;
export const E2E_BASE_URL = `http://localhost:${E2E_PORT}`;
export const E2E_NEXTAUTH_SECRET = 'e2e-only-nextauth-secret-do-not-use-in-production';
export const E2E_GOOGLE_CLIENT_ID = 'e2e-google-client-id';
export const E2E_LINKEDIN_CLIENT_ID = 'e2e-linkedin-client-id';

/**
 * Environment for the app under test. These override anything in .env.local,
 * and CLAUDE_API_KEY is blanked so script generation uses the built-in template instead of Claude.
 */
export const E2E_SERVER_ENV: Record<string, string> = {
  NEXTAUTH_URL: E2E_BASE_URL,
  NEXTAUTH_SECRET: E2E_NEXTAUTH_SECRET,
  GOOGLE_CLIENT_ID: E2E_GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: 'e2e-google-client-secret',
  LINKEDIN_CLIENT_ID: E2E_LINKEDIN_CLIENT_ID,
  LINKEDIN_CLIENT_SECRET: 'e2e-linkedin-client-secret',
  CLAUDE_API_KEY: '',
};
