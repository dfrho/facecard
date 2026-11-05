import { expect, test } from '@playwright/test';

test('script API returns a script for a profile', async ({ request }) => {
  const response = await request.post('/api/generate-script', {
    data: {
      firstName: 'Ada',
      lastName: 'Lovelace',
      jobTitle: 'Engineer',
      company: 'Analytical Engines',
      toneValue: 5,
      superpower: 'problems',
    },
  });

  expect(response.ok()).toBe(true);
  const { script } = await response.json();
  expect(script).toContain('Ada Lovelace');
  expect(script).toContain('solving impossible problems');
});

test('avatar upload rejects signed-out requests', async ({ request }) => {
  const response = await request.post('/api/upload-avatar', {
    multipart: {
      avatar: { name: 'avatar.png', mimeType: 'image/png', buffer: Buffer.from('not really a png') },
    },
  });

  expect(response.status()).toBe(401);
});
