import { beforeEach, describe, expect, test, vi } from "vitest";

// ===========================================================================
// WHAT THIS TESTS
// When someone submits the giveaway form, their details are turned into an
// EmailJS request with every field and the right recipient.
//
// WHERE THE EMAIL GOES
// config.js picks the recipient by environment. Tests and local dev send to
// developeralesson@gmail.com. Only a production build sends to the client,
// matthew@adtorqueedge.com and josh.day@adtorqueedge.com (from the brief).
// So running this test can never email the client.
//
// HOW
// No real email is sent. We replace EmailJS's `send` with a fake and check
// what our code handed to it.
//
// WHY MOCK, NOT SEND FOR REAL
// A real send needs a paid EmailJS plan to work outside a browser. Checking
// the request catches the mistakes that matter: a missing field, a wrong
// address, a hidden error. To eyeball a real email, run `npm run dev`, submit
// the form, and check developeralesson@gmail.com.
//
// ===========================================================================
import { submitEntry } from "../../src/scripts/submitEntry.js";
import {
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  RECIPIENT_EMAILS,
} from "../../src/scripts/config.js";

// Form markup the page renders (see src/scripts/main.js)
const FORM_HTML = `
  <form id="giveaway-form" novalidate>
    <input id="firstName" name="firstName" type="text" required />
    <input id="lastName" name="lastName" type="text" required />
    <input id="email" name="email" type="email" required />
    <input id="phone" name="phone" type="tel" required />
    <fieldset>
      <legend>Are you currently in the market for a new vehicle?</legend>
      <label><input type="radio" name="inMarket" value="Yes" required /> Yes</label>
      <label><input type="radio" name="inMarket" value="No" required /> No</label>
    </fieldset>
    <button type="submit">Enter Competition</button>
  </form>
`;

// Sample entrant reused by every test
const ENTRANT = {
  firstName: "Andrew",
  lastName: "Simms",
  email: "andrew@example.com",
  phone: "0211234567",
  inMarket: "Yes",
};

// Type the sample values into the form.
function fillForm(values = ENTRANT) {
  const form = document.querySelector("#giveaway-form");
  form.elements.firstName.value = values.firstName;
  form.elements.lastName.value = values.lastName;
  form.elements.email.value = values.email;
  form.elements.phone.value = values.phone;
  form.querySelector(
    `input[name="inMarket"][value="${values.inMarket}"]`,
  ).checked = true;
  return form;
}

describe("giveaway form submission", () => {
  let send;

  beforeEach(() => {
    document.body.innerHTML = FORM_HTML;
    // Fake EmailJS. Acts like the email sent fine.
    send = vi.fn().mockResolvedValue({ status: 200, text: "OK" });
  });

  // Fill the form, submit it, and return what EmailJS was asked to send.
  async function submitForm() {
    await submitEntry(fillForm(), { send });
    const [serviceId, templateId, params] = send.mock.calls[0];
    return { serviceId, templateId, params };
  }

  test("dev: entries go to the developer inbox", async () => {
    expect(RECIPIENT_EMAILS).toEqual(["developeralesson@gmail.com"]);

    const { params } = await submitForm();
    expect(params.to_email).toBe(RECIPIENT_EMAILS.join(", "));
  });

  test("uses the configured EmailJS service and template", async () => {
    const { serviceId, templateId } = await submitForm();
    expect(serviceId).toBe(EMAILJS_SERVICE_ID);
    expect(templateId).toBe(EMAILJS_TEMPLATE_ID);
  });

  test("sends every field the entrant filled in", async () => {
    const { params } = await submitForm();
    expect(params).toMatchObject(ENTRANT);
  });

  test("throws if the send fails, so the page can show an error", async () => {
    send.mockRejectedValue({
      status: 422,
      text: "The recipients address is empty",
    });

    await expect(submitEntry(fillForm(), { send })).rejects.toMatchObject({
      status: 422,
    });
  });
});
