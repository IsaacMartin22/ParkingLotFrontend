import { expect, test } from '@playwright/test';

for (const path of ['/', '/projects', '/contact', '/gubb', '/infrastructure']) {
  test(`top nav stays usable when resizing ${path}`, async ({ page }) => {
    await page.goto(path);
    const nav = page.getByRole('navigation', { name: 'Portfolio sections' });
    const links = nav.getByRole('link');
    await expect(links).toHaveCount(5);

    for (const viewport of [
      { width: 1280, height: 900 },
      { width: 900, height: 500 },
      { width: 769, height: 600 },
      { width: 768, height: 600 },
      { width: 500, height: 600 },
      { width: 320, height: 500 },
      { width: 1280, height: 900 },
    ]) {
      await page.setViewportSize(viewport);
      const navBox = await nav.boundingBox();
      expect(navBox).not.toBeNull();
      if (!navBox) {
        throw new Error('Top nav has no layout box');
      }

      const boxes = [];
      for (const link of await links.all()) {
        await expect(link).toBeVisible();
        const box = await link.boundingBox();
        expect(box).not.toBeNull();
        if (!box) {
          throw new Error('Nav link has no layout box');
        }
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
        expect(box.y).toBeGreaterThanOrEqual(navBox.y);
        expect(box.y + box.height).toBeLessThanOrEqual(navBox.y + navBox.height);
        for (const previous of boxes) {
          const overlaps = box.x < previous.x + previous.width
            && box.x + box.width > previous.x
            && box.y < previous.y + previous.height
            && box.y + box.height > previous.y;
          expect(overlaps).toBe(false);
        }
        boxes.push(box);
      }

      const contentBox = await nav.locator('xpath=following-sibling::*[1]').boundingBox();
      expect(contentBox).not.toBeNull();
      if (!contentBox) {
        throw new Error('Content below nav has no layout box');
      }
      expect(contentBox.y).toBeGreaterThanOrEqual(navBox.y + navBox.height);
    }

    await page.setViewportSize({ width: 320, height: 500 });
    await nav.getByRole('link', { name: 'Contact', exact: true }).click();
    await expect(page).toHaveURL('/contact');
  });
}
