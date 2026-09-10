import emailjs from "@emailjs/browser";

import {
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_PUBLIC_KEY,
  RECIPIENT_EMAILS,
} from "./config.js";

// Send the giveaway entry as an email through EmailJS.
//
// form  - the <form> element, already filled in by the entrant.
// deps  - lets the tests pass in a fake `send`. Real code uses EmailJS.
//
// Returns a promise. It resolves when the email is sent, and rejects
// (throws) when it fails, so the page can show an error message.

export async function submitEntry(form, deps = {}) {
  const send = deps.send || realSend;

  // Read every field the entrant typed: firstName, lastName, email, etc.
  const fields = Object.fromEntries(new FormData(form));

  // These become the {{variables}} in the EmailJS template.
  const templateParams = {
    ...fields,
    to_email: RECIPIENT_EMAILS.join(", "),
  };

  return send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
}

// EmailJS call kept separate so tests can swap it out
function realSend(serviceId, templateId, templateParams) {
  return emailjs.send(serviceId, templateId, templateParams, {
    publicKey: EMAILJS_PUBLIC_KEY,
  });
}
