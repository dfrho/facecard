import { expect, test } from '@playwright/test';
import { signIn } from '../support/session';

const PROFILE = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  jobTitle: 'Engineer',
  company: 'Analytical Engines',
  toneValue: 5,
  superpower: 'problems',
};

test('script API refuses signed-out requests', async ({ request }) => {
  const response = await request.post('/api/generate-script', { data: PROFILE });

  expect(response.status()).toBe(401);
  expect((await response.json()).error).toBe('Please sign in to generate a script.');
});

test('script API returns a script for a signed-in user', async ({ context, page }) => {
  await signIn(context);

  const response = await page.request.post('/api/generate-script', { data: PROFILE });

  expect(response.ok()).toBe(true);
  const { script } = await response.json();
  expect(script).toContain('Ada Lovelace');
  expect(script).toContain('solving impossible problems');
});

test('script API rejects oversized profile fields', async ({ context, page }) => {
  await signIn(context);

  const response = await page.request.post('/api/generate-script', {
    data: { ...PROFILE, funFact: 'x'.repeat(5000) },
  });

  expect(response.status()).toBe(400);
  expect((await response.json()).error).toBe('"funFact" is too long (maximum 1000 characters).');
});

test('avatar upload rejects signed-out requests', async ({ request }) => {
  const response = await request.post('/api/upload-avatar', {
    multipart: {
      avatar: { name: 'avatar.png', mimeType: 'image/png', buffer: Buffer.from('not really a png') },
    },
  });

  expect(response.status()).toBe(401);
});
