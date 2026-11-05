import { expect, test } from '@playwright/test';
import { signIn } from '../support/session';

// Long values on purpose: they are what pushes narrow layouts past the screen edge.
const PROFILE = {
  firstName: 'Alexandra',
  lastName: 'Montgomery-Fitzgerald',
  jobTitle: 'Senior Solutions Engineer',
  company: 'Analytical Engines International',
  email: 'alexandra.montgomery-fitzgerald@example.com',
  toneValue: 5,
  superpower: 'problems',
  industry: 'Fintech',
  mainValue: 'Shortening enterprise sales cycles',
  interests: ['Payments', 'Security', 'Open source'],
  completedSteps: ['basic', 'interests'],
};

const PAGES = [
  '/',
  '/features',
  '/pricing',
  '/auth/error?error=OAuthCallback',
  '/create-profile',
  '/create-profile/interests',
  '/create-profile/script',
  '/create-profile/video?script=Hi%2C%20I%27m%20Alexandra.',
  '/create-profile/share',
  '/create-profile/profile',
];

test.describe('on a 320px-wide phone', () => {
  test.use({ viewport: { width: 320, height: 800 } });

  test.beforeEach(async ({ context }) => {
    await signIn(context, {
      name: 'Alexandra Montgomery-Fitzgerald',
      email: 'alexandra.montgomery-fitzgerald@example.com',
    });
    await context.addInitScript(profile => {
      localStorage.setItem('profileFormData', JSON.stringify(profile));
      sessionStorage.setItem('profileFormData', JSON.stringify(profile));
    }, PROFILE);
  });

  for (const path of PAGES) {
    test(`${path.split('?')[0]} fits without sideways scrolling`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth, `page is ${scrollWidth}px wide on a ${clientWidth}px screen`).toBeLessThanOrEqual(
        clientWidth
      );
    });
  }

  test('feature checklists use the full text column', async ({ page }) => {
    await page.goto('/features');

    const checklist = await page.locator('section ul').first().boundingBox();
    expect(checklist?.width).toBeGreaterThan(150);
  });
});

test('the View Pricing button on the features page is readable', async ({ page }) => {
  await page.goto('/features');

  const { color, background } = await page
    .getByRole('button', { name: 'View Pricing' })
    .evaluate(el => {
      const style = getComputedStyle(el);
      return { color: style.color, background: style.backgroundColor };
    });
  expect(color).not.toBe(background);
});
