import "../css/style.css";

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

    <a class="btn btn-primary" href="#entry-form" data-scroll>Enter Competition</a>
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
        <input class="form-control empty" type="tel" id="phone" name="phone" required />
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

/* Floating labels — mirrors the andrewsimms.co.nz behaviour: each <label> sits
   inside its field like a placeholder until the control holds a value, then
   animates up to the border. The CSS keys off an `empty` class we keep in sync. */
document.querySelectorAll("#giveaway-form .form-control").forEach((control) => {
  const syncEmpty = () =>
    control.classList.toggle("empty", control.value === "");
  syncEmpty();
  control.addEventListener("input", syncEmpty);
  control.addEventListener("blur", syncEmpty);
});
