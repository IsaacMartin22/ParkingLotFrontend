import { expect, test } from '@playwright/test';

test('home page matches the stored baseline screenshot', async ({ page }) => {
  await page.goto('/');
  await page.emulateMedia({ reducedMotion: 'reduce' });

  await expect(page).toHaveScreenshot('home-page.png', {
    animations: 'disabled',
    fullPage: true,
    maxDiffPixels: 0,
  });
});
