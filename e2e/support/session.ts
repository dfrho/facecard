import { BrowserContext } from '@playwright/test';
import { encode } from 'next-auth/jwt';
import { E2E_BASE_URL, E2E_NEXTAUTH_SECRET } from './env';

export interface TestUser {
  name: string;
  email: string;
}

export const TEST_USER: TestUser = { name: 'Ada Lovelace', email: 'ada@example.com' };

/**
 * Sign the browser in without going through Google or LinkedIn, by setting the same
 * session cookie NextAuth issues after a real sign-in.
 */
export async function signIn(context: BrowserContext, user: TestUser = TEST_USER): Promise<void> {
  const sessionToken = await encode({
    token: { name: user.name, email: user.email, sub: 'e2e-user' },
    secret: E2E_NEXTAUTH_SECRET,
  });

  await context.addCookies([
    { name: 'next-auth.session-token', value: sessionToken, url: E2E_BASE_URL, httpOnly: true },
  ]);
}
