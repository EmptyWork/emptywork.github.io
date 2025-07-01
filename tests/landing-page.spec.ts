import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/EmptyWork/);
});

test('find a curriculum vitae and download', async ({ page, browserName }, testInfo) => {
  const isHeaded = testInfo.project.name.includes('headed')

  await page.goto('/');

  if (browserName === 'chromium' && isHeaded) {
    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      await page.getByRole('link', { name: 'Open PDF of my Curriculum' }).click(),
    ]);
    await popup.waitForLoadState('domcontentloaded');
    const url = popup.url();
    return expect(url).toMatch(/\.pdf$/);
  }

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('link', { name: 'Open PDF of my Curriculum' }).click(),
  ]);

  const fileName = download.suggestedFilename();
  expect(fileName).toMatch(/\.pdf$/);

});
