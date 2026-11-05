import { expect, test } from '@playwright/test';

test('home page shows the pitch and sign-in options', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Make your introduction unforgettable.'
  );
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
});

for (const { name, path } of [
  { name: 'Features', path: '/features' },
  { name: 'Pricing', path: '/pricing' },
]) {
  test(`header link opens the ${name} page`, async ({ page }) => {
    await page.goto('/');

    await page.getByRole('navigation').getByRole('link', { name, exact: true }).click();

    await expect(page).toHaveURL(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
}
