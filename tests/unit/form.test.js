import { beforeEach, describe, expect, test } from "vitest";

// Markup mirrors the giveaway form the landing page renders. Every field is
// `required` so validation can lean on the Constraint Validation API.
const FORM_HTML = `
  <form id="giveaway-form">
    <input id="first-name" name="firstName" type="text" required />
    <input id="last-name" name="lastName" type="text" required />
    <input id="email" name="email" type="email" required />
    <input id="phone" name="phone" type="tel" required />
    <fieldset>
      <legend>Are you currently in the market for a new vehicle?</legend>
      <label><input type="radio" name="inMarket" value="yes" required /> Yes</label>
      <label><input type="radio" name="inMarket" value="no" required /> No</label>
    </fieldset>
    <button type="submit">Enter</button>
  </form>
`;

function fillForm({ firstName, lastName, email, phone, inMarket } = {}) {
  const form = document.querySelector("#giveaway-form");
  if (firstName !== undefined) form.elements.firstName.value = firstName;
  if (lastName !== undefined) form.elements.lastName.value = lastName;
  if (email !== undefined) form.elements.email.value = email;
  if (phone !== undefined) form.elements.phone.value = phone;
  if (inMarket !== undefined) {
    form.querySelector(`input[name="inMarket"][value="${inMarket}"]`).checked =
      true;
  }
  return form;
}

describe("Test giveaway form", () => {
  beforeEach(() => {
    document.body.innerHTML = FORM_HTML;
  });

  test("form is invalid when every field is empty", () => {
    const form = document.querySelector("#giveaway-form");
    expect(form.checkValidity()).toBe(false);
  });

  const EMAIL = "developeralesson@gmail.com";

  test.each([
    [
      "first name",
      { lastName: "Simms", email: EMAIL, phone: "0211234567", inMarket: "yes" },
    ],
    [
      "last name",
      {
        firstName: "Andrew",
        email: EMAIL,
        phone: "0211234567",
        inMarket: "yes",
      },
    ],
    [
      "email",
      {
        firstName: "Andrew",
        lastName: "Simms",
        phone: "0211234567",
        inMarket: "yes",
      },
    ],
    [
      "phone number",
      { firstName: "Andrew", lastName: "Simms", email: EMAIL, inMarket: "yes" },
    ],
    [
      "market radio",
      {
        firstName: "Andrew",
        lastName: "Simms",
        email: EMAIL,
        phone: "0211234567",
      },
    ],
  ])("form is invalid when %s is missing", (_field, values) => {
    const form = fillForm(values);
    expect(form.checkValidity()).toBe(false);
  });

  test("form correctly rejects invalid email formats", () => {
    const form = fillForm({
      firstName: "Andrew",
      lastName: "Simms",
      email: "not-an-email",
      phone: "0211234567",
      inMarket: "no",
    });
    expect(form.checkValidity()).toBe(false);
  });

  test("form is valid when all fields have values", () => {
    const form = fillForm({
      firstName: "Andrew",
      lastName: "Simms",
      email: EMAIL,
      phone: "0211234567",
      inMarket: "yes",
    });

    expect(form.checkValidity()).toBe(true);

    const values = Object.fromEntries(new FormData(form));
    expect(values).toEqual({
      firstName: "Andrew",
      lastName: "Simms",
      email: EMAIL,
      phone: "0211234567",
      inMarket: "yes",
    });
  });
});
