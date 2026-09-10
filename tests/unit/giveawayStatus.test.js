import { beforeEach, describe, expect, test } from "vitest";

// ===========================================================================
// WHAT THIS TESTS
// The last moment anyone can enter is 23:59:59.999 on 17 Sep 2026 (NZST, UTC+12).
// From 2026-09-18T00:00:00+12:00 onward the form must be closed.
//
// ===========================================================================
import {
  GIVEAWAY_CLOSES,
  GIVEAWAY_CLOSED_MESSAGE,
  isGiveawayClosed,
  closeGiveawayForm,
} from "../../src/scripts/giveawayStatus.js";

// Form markup mirrors what src/scripts/main.js renders.
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
    <button class="btn btn-primary form-submit" type="submit">Enter Competition</button>
    <p class="form-message" id="formMessage" role="status" hidden></p>
  </form>
`;

describe("giveaway closing date", () => {
  test("closes at the start of 18 Sep 2026 NZ time (UTC+12)", () => {
    expect(GIVEAWAY_CLOSES.toISOString()).toBe("2026-09-17T12:00:00.000Z");
  });

  test("open on 11 Sep 2026, a week before the cutoff", () => {
    expect(isGiveawayClosed(new Date("2026-09-11T09:00:00+12:00"))).toBe(false);
  });

  test("open at the last second of 17 Sep 2026 NZ time", () => {
    expect(isGiveawayClosed(new Date("2026-09-17T23:59:59+12:00"))).toBe(false);
  });

  test("closed exactly at the cutoff instant", () => {
    expect(isGiveawayClosed(new Date("2026-09-18T00:00:00+12:00"))).toBe(true);
  });

  test("closed any time on 18 Sep 2026 NZ time", () => {
    expect(isGiveawayClosed(new Date("2026-09-18T10:30:00+12:00"))).toBe(true);
  });

  test("closed on 19 Sep 2026 and later", () => {
    expect(isGiveawayClosed(new Date("2026-09-19T00:00:00+12:00"))).toBe(true);
  });

  test("defaults `now` to the current time when called with no argument", () => {
    const expected = Date.now() >= GIVEAWAY_CLOSES.getTime();
    expect(isGiveawayClosed()).toBe(expected);
  });
});

describe("closeGiveawayForm", () => {
  let form;
  let formMessage;

  beforeEach(() => {
    document.body.innerHTML = FORM_HTML;
    form = document.querySelector("#giveaway-form");
    formMessage = document.querySelector("#formMessage");
  });

  test("disables every input in the form", () => {
    closeGiveawayForm(form, formMessage);

    const inputs = [...form.querySelectorAll("input")];
    expect(inputs).toHaveLength(6);
    expect(inputs.every((input) => input.disabled)).toBe(true);
  });

  test("disables the submit button so the form cannot be sent", () => {
    closeGiveawayForm(form, formMessage);

    const submit = form.querySelector(".form-submit");
    expect(submit.disabled).toBe(true);
  });

  test("shows the closed message", () => {
    closeGiveawayForm(form, formMessage);

    expect(formMessage.hidden).toBe(false);
    expect(formMessage.textContent).toBe(GIVEAWAY_CLOSED_MESSAGE);
  });

  test("closed message is non-empty and mentions the giveaway is closed", () => {
    expect(GIVEAWAY_CLOSED_MESSAGE).toMatch(/clos/i);
  });
});
