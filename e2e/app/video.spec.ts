import { expect, test } from '@playwright/test';

test('video page shows the script and explains when recording is not set up', async ({ page }) => {
  await page.goto(`/create-profile/video?script=${encodeURIComponent('Hi, I am Ada.')}`);

  await expect(page.getByRole('heading', { name: 'Record Your Video' })).toBeVisible();
  await expect(page.getByText('Hi, I am Ada.')).toBeVisible();
  await expect(page.getByText("Video recording isn't set up for this site yet.")).toBeVisible();
  await expect(page.getByRole('button', { name: 'Recording unavailable' })).toBeDisabled();
});
