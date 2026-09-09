import { test, expect } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Andrew Simms/);
  await expect(page.locator(".banner")).toHaveText("Coming soon");
});
