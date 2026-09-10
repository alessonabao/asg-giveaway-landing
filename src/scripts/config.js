// Central config for the giveaway form's EmailJS send.

const env = import.meta.env ?? {};

export const EMAILJS_SERVICE_ID = env.VITE_EMAILJS_SERVICE_ID;
export const EMAILJS_TEMPLATE_ID = env.VITE_EMAILJS_TEMPLATE_ID;
export const EMAILJS_PUBLIC_KEY = env.VITE_EMAILJS_PUBLIC_KEY;

// Only a production build emails the client (from the brief)
// dev and tests always go to the developer inbox, so running the
// suite can never email the client
const CLIENT_EMAILS = ["matthew@adtorqueedge.com", "josh.day@adtorqueedge.com"];
const DEVELOPER_EMAILS = ["developeralesson@gmail.com"];

export const RECIPIENT_EMAILS = env.PROD ? CLIENT_EMAILS : DEVELOPER_EMAILS;
