// Central config for the giveaway form's EmailJS send.

const env = import.meta.env ?? {};

export const EMAILJS_SERVICE_ID = env.VITE_EMAILJS_SERVICE_ID;
export const EMAILJS_TEMPLATE_ID = env.VITE_EMAILJS_TEMPLATE_ID;
export const EMAILJS_PUBLIC_KEY = env.VITE_EMAILJS_PUBLIC_KEY;

// Entries reach the client addresses only when VITE_SEND_TO_CLIENT is "true"
// (set as a GitHub repository variable on the deployed build). Everywhere else
// -- local dev, tests, and a production deploy that hasn't been verified yet --
// they go to the developer inbox, so testing can never email the client.
const CLIENT_EMAILS = ["matthew@adtorqueedge.com", "josh.day@adtorqueedge.com"];
const DEVELOPER_EMAILS = ["developeralesson@gmail.com"];

export const RECIPIENT_EMAILS =
  env.VITE_SEND_TO_CLIENT === "true" ? CLIENT_EMAILS : DEVELOPER_EMAILS;
