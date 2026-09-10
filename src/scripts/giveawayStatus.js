// Giveaway closes at midnight NZST (UTC+12) on 18 Sep 2026.
// Last valid entry: 23:59:59.999 NZ time on 17 Sep 2026.
// Constructed directly in UTC so it doesn't depend on the machine's local timezone
export const GIVEAWAY_CLOSES = new Date("2026-09-17T12:00:00.000Z");

export const GIVEAWAY_CLOSED_MESSAGE =
  "This giveaway is now closed. Thanks for your interest!";

/**
 * Returns true once the current time has reached or passed the closing instant.
 * @param {Date} now - defaults to the current time.
 */
export function isGiveawayClosed(now = new Date()) {
  return now.getTime() >= GIVEAWAY_CLOSES.getTime();
}

/**
 * Locks the form: disables every input and the submit button,
 * then reveals the closed-status message.
 * @param {HTMLFormElement} form
 * @param {HTMLElement} formMessage
 */
export function closeGiveawayForm(form, formMessage) {
  const inputs = form.querySelectorAll("input");
  inputs.forEach((input) => {
    input.disabled = true;
  });

  const submitButton = form.querySelector(".form-submit");
  if (submitButton) {
    submitButton.disabled = true;
  }

  formMessage.textContent = GIVEAWAY_CLOSED_MESSAGE;
  formMessage.hidden = false;
}
