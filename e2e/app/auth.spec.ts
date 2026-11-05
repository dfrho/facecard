import { expect, test } from '@playwright/test';
import { E2E_BASE_URL, E2E_GOOGLE_CLIENT_ID, E2E_LINKEDIN_CLIENT_ID } from '../support/env';

const providers = [
  {
    label: 'Google',
    id: 'google',
    authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    clientId: E2E_GOOGLE_CLIENT_ID,
  },
  {
    label: 'LinkedIn',
    id: 'linkedin',
    authorizeUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    clientId: E2E_LINKEDIN_CLIENT_ID,
  },
];

test('auth API lists Google and LinkedIn', async ({ request }) => {
  const response = await request.get('/api/auth/providers');

  expect(response.ok()).toBe(true);
  expect(Object.keys(await response.json()).sort()).toEqual(['google', 'linkedin']);
});

for (const provider of providers) {
  test(`"Sign in with ${provider.label}" sends the user to ${provider.label} with the right callback`, async ({
    page,
  }) => {
    // Stand in for the provider's page so the test never talks to the real one.
    let authorizeRequest: URL | undefined;
    await page.route(`${provider.authorizeUrl}**`, route => {
      authorizeRequest = new URL(route.request().url());
      return route.fulfill({ contentType: 'text/html', body: `<h1>${provider.label} stub</h1>` });
    });

    await page.goto('/');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('menuitem', { name: `Sign in with ${provider.label}` }).click();

    await expect(page.getByRole('heading', { name: `${provider.label} stub` })).toBeVisible();
    expect(authorizeRequest?.searchParams.get('client_id')).toBe(provider.clientId);
    expect(authorizeRequest?.searchParams.get('redirect_uri')).toBe(
      `${E2E_BASE_URL}/api/auth/callback/${provider.id}`
    );
    expect(authorizeRequest?.searchParams.get('scope')).toContain('email');
  });
}

test('signed-out visitors are sent home from the profile flow', async ({ page }) => {
  await page.goto('/create-profile');

  await expect(page).toHaveURL('/');
});

test.describe('sign-in error page', () => {
  for (const { error, heading } of [
    { error: 'OAuthSignin', heading: 'Sign-in failed.' },
    { error: 'OAuthCallback', heading: 'Sign-in could not complete.' },
    { error: 'OAuthAccountNotLinked', heading: 'Sign in with your original account.' },
    { error: 'SomethingUnexpected', heading: 'Something went wrong.' },
  ]) {
    test(`explains ${error}`, async ({ page }) => {
      await page.goto(`/auth/error?error=${error}`);

      await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
    });
  }
});
