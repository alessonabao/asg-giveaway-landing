import "../css/style.css";

import { submitEntry } from "./submitEntry.js";

import logo from "/logo.png";
import carSeat from "../assets/images/prizes/car-seat.png";
import nappyBag from "../assets/images/prizes/nappy-bag.png";
import carAccessory from "../assets/images/prizes/car-accessory.png";
import plushToy from "../assets/images/prizes/plush-toy.png";

const prizes = [
  { name: "Premium Convertible Car Seat", image: carSeat },
  { name: "Travel Nappy Bag", image: nappyBag },
  { name: "Car Accessory Kit", image: carAccessory },
  { name: "Plush Soft Toy", image: plushToy },
];

document.querySelector("#app").innerHTML = `
<header class="banner">Coming soon</header>

<section class="giveaway-intro black-bg t-center">
  <div class="wrapper">
    <img class="brand-logo" src="${logo}" alt="Andrew Simms Group" />
    <h1 class="white-txt">WIN Everything You Need for the Journey Home</h1>
    <h2 class="subtitle white-txt">Andrew Simms Group Event Giveaway</h2>

    <div class="body-copy">
      <p class="white-txt t-left">We're celebrating this year's event with a giveaway designed to make those precious first journeys with your family even more special.</p>
      <p class="white-txt t-left">Simply complete the form below to go in the draw to win an amazing prize pack featuring essential family gear and everyday favourites.</p>
      <p class="white-txt t-left">At Andrew Simms Group, we've helped families get on the road with confidence for decades. Whether you're preparing for a new arrival, upgrading to a larger family vehicle, or simply planning for the adventures ahead, we're here to help make every journey a little easier.</p>
      <p class="cta-text">Enter now for your chance to win this fantastic prize pack.</p>
    </div>

    <a class="btn btn-primary" href="#entry-form">Enter Competition</a>
  </div>
</section>

<section class="prizes grey-bg">
  <div class="wrapper t-center">
    <h2>The Prize Pack</h2>
    <ul class="prize-grid">
      ${prizes
        .map(
          (prize) => `
        <li class="prize-card">
          <img src="${prize.image}" alt="${prize.name}" />
          <h3>${prize.name}</h3>
        </li>`,
        )
        .join("")}
    </ul>
  </div>
</section>

<section id="entry-form" class="entry-form black-bg">
  <div class="sml-wrapper">
    <h2 class="white-txt t-center">Enter the Giveaway</h2>

    <form id="giveaway-form" novalidate>
      <h3 class="form-section-label">Your Details</h3>

      <div class="form-row">
        <div class="form-group">
          <input class="form-control empty" type="text" id="firstName" name="firstName" required />
          <label for="firstName">First Name*</label>
        </div>

        <div class="form-group">
          <input class="form-control empty" type="text" id="lastName" name="lastName" required />
          <label for="lastName">Last Name*</label>
        </div>
      </div>

      <div class="form-group">
        <input class="form-control empty" type="email" id="email" name="email" required />
        <label for="email">Email*</label>
      </div>

      <div class="form-group">
        <input class="form-control empty" type="tel" id="phone" name="phone" inputmode="numeric" required />
        <label for="phone">Phone Number*</label>
      </div>

      <h3 class="form-section-label">About You</h3>

      <fieldset class="form-group vehicle-question">
        <legend>Are you currently in the market for a new vehicle?</legend>
        <div class="radio-container">
          <input class="radio-hidden" type="radio" id="vehicleYes" name="inMarket" value="Yes" required />
          <label class="radio-labels" for="vehicleYes">Yes</label>

          <input class="radio-hidden" type="radio" id="vehicleNo" name="inMarket" value="No" required />
          <label class="radio-labels" for="vehicleNo">No</label>
        </div>
      </fieldset>

      <button class="btn btn-primary form-submit" type="submit">Enter Competition</button>

      <p class="form-message" id="formMessage" role="status" hidden></p>
    </form>
  </div>
</section>
`;

/* Smooth scroll for the "Enter Competition" anchor link is handled in CSS
   (html { scroll-behavior: smooth }), gated on prefers-reduced-motion. */

/* Floating labels: each label starts inside its input like a placeholder.
   Once the input has text, CSS moves the label up to the border.
   The CSS does this by looking for the "empty" class, so our job here
   is just to add "empty" when the input is blank and remove it when it isn't. */
document.querySelectorAll("#giveaway-form .form-control").forEach((input) => {
  // Add or remove the "empty" class based on whether the input is blank
  function updateEmptyClass() {
    const isBlank = input.value === "";
    input.classList.toggle("empty", isBlank);
  }

  updateEmptyClass(); // set the correct class when the page loads
  input.addEventListener("input", updateEmptyClass); // ...while the user types
  input.addEventListener("blur", updateEmptyClass); // ...when they leave the field
});

/* Phone field: it must be a valid New Zealand phone number.
  1. While the user types, strip out anything that isn't a digit or a space,
    so the field never holds letters or symbols.
  2. Check the number against the NZ formats below. setCustomValidity() feeds
    the result into the same form.checkValidity() call used on submit, so an
    invalid number blocks submission and shows this message. */
const phoneInput = document.querySelector("#phone");

// Returns true if `value` looks like a real NZ phone number.
function isNewZealandPhone(value) {
  // Keep digits only, then treat a "+64" / "64" country code as the local "0".
  let digits = value.replace(/[^0-9]/g, "");
  if (digits.startsWith("64")) {
    digits = "0" + digits.slice(2);
  }

  const mobile = /^02\d{7,9}$/; // 021/022/027... then 7-9 more digits
  const landline = /^0[34679]\d{7}$/; // 03/04/06/07/09 area code + 7 digits
  const tollFree = /^0(800|508)\d{6,7}$/; // 0800 / 0508 numbers

  return mobile.test(digits) || landline.test(digits) || tollFree.test(digits);
}

// Show an error on the phone field if it has a value that isn't a valid
// NZ number. An empty field is left to the "required" check instead.
function updatePhoneValidity() {
  if (phoneInput.value !== "" && !isNewZealandPhone(phoneInput.value)) {
    phoneInput.setCustomValidity(
      "Please enter a valid New Zealand phone number.",
    );
  } else {
    phoneInput.setCustomValidity("");
  }
}

phoneInput.addEventListener("input", () => {
  // Allow digits and spaces only, then re-check the number.
  const cleaned = phoneInput.value.replace(/[^0-9 ]/g, "");
  if (phoneInput.value !== cleaned) {
    phoneInput.value = cleaned;
  }
  updatePhoneValidity();
});

/* Form submission: instead of the browser reloading the page on submit,
  stop it and send the entry ourselves (via submitEntry) */
const form = document.querySelector("#giveaway-form");
const formMessage = document.querySelector("#formMessage");
const submitButton = form.querySelector(".form-submit");

// Show a status line under the form.
// Pass isError = true for an error (CSS shows it red),
// or false for a normal/success message (CSS shows it white).
function showMessage(text, isError) {
  formMessage.textContent = text;
  formMessage.classList.toggle("is-success", isError === false);
  formMessage.hidden = false;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault(); // stop the normal page reload

  // Re-check the phone number in case it was autofilled (no "input" event).
  updatePhoneValidity();

  // The form tag has "novalidate", so the browser won't check the fields
  // on its own. Do that check here and show its built-in error bubbles.
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Disable the button so the user can't submit twice while waiting
  submitButton.disabled = true;
  showMessage("Sending your entry…", false);

  try {
    await submitEntry(form); // send the entry and wait for it to finish
    form.reset(); // clear all the fields

    // form.reset() empties the inputs but doesn't fire an "input" event,
    // so add the "empty" class back ourselves to reset the floating labels.
    form
      .querySelectorAll(".form-control")
      .forEach((input) => input.classList.add("empty"));

    showMessage("Thanks for your submission", false);
  } catch (error) {
    // submitEntry threw, so the send failed.
    console.error("Giveaway entry failed to send:", error);
    showMessage(
      "Sorry, something went wrong. Please try again in a moment.",
      true,
    );
  } finally {
    // Runs whether it succeeded or failed: let the user try again.
    submitButton.disabled = false;
  }
});
