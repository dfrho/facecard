import { expect, test } from '@playwright/test';

/**
 * Checks the deployed site's sign-in setup without signing in: NextAuth must build a
 * provider URL with a client ID and the site's own callback, and the provider must accept
 * it (no redirect_uri_mismatch, invalid_client, etc.).
 */
const BROWSER_USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) ' +
  'Chrome/130.0.0.0 Safari/537.36';

const PROVIDER_ERRORS =
  /redirect_uri_mismatch|invalid_client|deleted_client|disabled_client|unauthorized_client|Bummer, something went wrong|The redirect_uri does not match/i;

test('site and auth API are up', async ({ request }) => {
  expect((await request.get('/')).ok()).toBe(true);

  const providers = await request.get('/api/auth/providers');
  expect(providers.ok()).toBe(true);
  expect(Object.keys(await providers.json()).sort()).toEqual(['google', 'linkedin']);
});

for (const provider of ['google', 'linkedin']) {
  test(`${provider} accepts the site's sign-in request`, async ({ request, baseURL }) => {
    const { csrfToken } = await (await request.get('/api/auth/csrf')).json();
    const signIn = await request.post(`/api/auth/signin/${provider}`, {
      form: { csrfToken, callbackUrl: '/create-profile', json: 'true' },
    });
    const { url } = await signIn.json();

    expect(url, 'NextAuth could not start sign-in (check the env vars)').not.toContain(
      '/api/auth/error'
    );
    const authorizeUrl = new URL(url);
    expect(authorizeUrl.searchParams.get('client_id')).toBeTruthy();
    expect(authorizeUrl.searchParams.get('redirect_uri')).toBe(
      `${baseURL}/api/auth/callback/${provider}`
    );

    const providerPage = await request.get(url, { headers: { 'User-Agent': BROWSER_USER_AGENT } });
    expect(providerPage.url(), 'provider showed an OAuth error page').not.toContain(
      '/signin/oauth/error'
    );
    expect(await providerPage.text()).not.toMatch(PROVIDER_ERRORS);
  });
}
