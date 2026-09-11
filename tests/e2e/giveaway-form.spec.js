import { test, expect } from "@playwright/test";

// Fills in whichever fields are provided, leaving the rest untouched.
async function fillForm(
  page,
  { firstName, lastName, email, phone, inMarket } = {},
) {
  if (firstName !== undefined) await page.locator("#firstName").fill(firstName);
  if (lastName !== undefined) await page.locator("#lastName").fill(lastName);
  if (email !== undefined) await page.locator("#email").fill(email);
  if (phone !== undefined) await page.locator("#phone").fill(phone);
  if (inMarket !== undefined) {
    // The radio input is visually hidden behind a styled label (users click the label,
    // which triggers the input via its `for` attribute).
    const id = await page
      .locator(`input[name="inMarket"][value="${inMarket}"]`)
      .getAttribute("id");
    await page.locator(`label[for="${id}"]`).click();
  }
}

const VALID_ENTRY = {
  firstName: "Andrew",
  lastName: "Simms",
  email: "developeralesson@gmail.com",
  phone: "021 123 4567",
  inMarket: "Yes",
};

test.describe("Enter Competition navigation", () => {
  test("clicking 'Enter Competition' scrolls to the Enter the Giveaway section", async ({
    page,
  }) => {
    await page.goto("/");
    await page.locator('a.btn-primary[href="#entry-form"]').click();
    await expect(page).toHaveURL(/#entry-form$/);
    await expect(
      page.locator("#entry-form h2", { hasText: "Enter the Giveaway" }),
    ).toBeInViewport();
  });
});

test.describe("Giveaway form validation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#entry-form");
  });

  test("submitting an empty form requires every field", async ({ page }) => {
    const form = page.locator("#giveaway-form");
    await form.locator(".form-submit").click();

    // Native constraint validation blocks submission; nothing gets sent and
    // the first invalid control (firstName) is the one the browser focuses.
    const firstNameValid = await page
      .locator("#firstName")
      .evaluate((el) => el.checkValidity());
    expect(firstNameValid).toBe(false);

    const formValid = await form.evaluate((el) => el.checkValidity());
    expect(formValid).toBe(false);

    // The success/sending message must never appear.
    await expect(page.locator("#formMessage")).toBeHidden();
  });

  test("email field rejects incorrect addresses", async ({ page }) => {
    await fillForm(page, { ...VALID_ENTRY, email: "not-an-email" });
    const valid = await page
      .locator("#email")
      .evaluate((el) => el.checkValidity());
    expect(valid).toBe(false);
  });

  test("email field accepts a properly formed address", async ({ page }) => {
    await fillForm(page, { ...VALID_ENTRY, email: "example@test.com" });
    const valid = await page
      .locator("#email")
      .evaluate((el) => el.checkValidity());
    expect(valid).toBe(true);
  });

  test.describe("NZ phone number validation", () => {
    const invalidNumbers = [
      "123",
      "12345",
      "0211234", // mobile, too short
      "0512345678", // "05" isn't a recognised NZ prefix
      "1234567890", // missing leading 0
      "0800", // toll-free, too short
    ];

    for (const phone of invalidNumbers) {
      test(`rejects invalid number "${phone}"`, async ({ page }) => {
        await fillForm(page, { ...VALID_ENTRY, phone });
        const valid = await page
          .locator("#phone")
          .evaluate((el) => el.checkValidity());
        expect(valid).toBe(false);
      });
    }

    const validNumbers = [
      "021 123 4567", // mobile
      "0211234567",
      "09 123 4567", // landline
      "0800 123 456", // toll-free
      "+64 21 123 4567",
    ];

    for (const phone of validNumbers) {
      test(`accepts valid number "${phone}"`, async ({ page }) => {
        await fillForm(page, { ...VALID_ENTRY, phone });
        const valid = await page
          .locator("#phone")
          .evaluate((el) => el.checkValidity());
        expect(valid).toBe(true);
      });
    }
  });

  test("requires a selection in the vehicle-interest radio group", async ({
    page,
  }) => {
    await fillForm(page, {
      firstName: VALID_ENTRY.firstName,
      lastName: VALID_ENTRY.lastName,
      email: VALID_ENTRY.email,
      phone: VALID_ENTRY.phone,
    });
    const formValid = await page
      .locator("#giveaway-form")
      .evaluate((el) => el.checkValidity());
    expect(formValid).toBe(false);
  });

  test("current behaviour: firstName has no letters-only restriction", async ({
    page,
  }) => {
    await fillForm(page, { ...VALID_ENTRY, firstName: "Andrew123" });
    const valid = await page
      .locator("#firstName")
      .evaluate((el) => el.checkValidity());
    expect(valid).toBe(true);
  });

  test("current behaviour: lastName has no letters-only restriction", async ({
    page,
  }) => {
    await fillForm(page, { ...VALID_ENTRY, lastName: "Simms456" });
    const valid = await page
      .locator("#lastName")
      .evaluate((el) => el.checkValidity());
    expect(valid).toBe(true);
  });
});

test.describe("Giveaway form submission", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#entry-form");
  });

  test("shows the thank-you message and emails developeralesson@gmail.com on success", async ({
    page,
  }) => {
    let capturedBody = null;

    // Intercept the EmailJS API call instead of hitting the real service:
    // confirms the app tries to send, and what it sends, without spending
    // EmailJS quota or delivering a live email.
    await page.route(
      "https://api.emailjs.com/api/v1.0/email/send",
      async (route) => {
        capturedBody = route.request().postDataJSON();
        await route.fulfill({ status: 200, body: "OK" });
      },
    );

    await fillForm(page, VALID_ENTRY);
    await page.locator(".form-submit").click();

    const message = page.locator("#formMessage");
    await expect(message).toHaveText("Thanks for your submission");
    await expect(message).toHaveClass(/is-success/);

    expect(capturedBody).not.toBeNull();
    expect(capturedBody.template_params.to_email).toBe(
      "developeralesson@gmail.com",
    );
    expect(capturedBody.template_params.firstName).toBe(VALID_ENTRY.firstName);
    expect(capturedBody.template_params.email).toBe(VALID_ENTRY.email);
  });

  test("shows an error message when the send fails", async ({ page }) => {
    await page.route(
      "https://api.emailjs.com/api/v1.0/email/send",
      async (route) => {
        await route.fulfill({ status: 500, body: "Internal Server Error" });
      },
    );

    await fillForm(page, VALID_ENTRY);
    await page.locator(".form-submit").click();

    const message = page.locator("#formMessage");
    await expect(message).toHaveText(
      "Sorry, something went wrong. Please try again in a moment.",
    );
    await expect(message).not.toHaveClass(/is-success/);
  });
});
