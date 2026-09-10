import { test, expect } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(
    /WIN Everything You Need for the Journey Home/,
  );
  await expect(page.locator(".banner")).toHaveText("Coming soon");
});

test("no horizontal scroll at any viewport", async ({ page }) => {
  await page.goto("/");
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);
});

test("banner is visible", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".banner")).toBeVisible();
});
