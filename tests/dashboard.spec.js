const { test, expect } = require('@playwright/test');

test.describe('Dashboard tests', () => {
  test('should load dashboard page', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('should create new dashboard', async ({ page }) => {
    await page.goto('/dashboard/new');
    await page.click('button[data-testid="new-dashboard"]');
    await expect(page.locator('.dashboard-title')).toBeVisible();
  });
});