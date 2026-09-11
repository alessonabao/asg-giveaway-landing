# asg-giveaway-landing

Responsive giveaway landing page for the Andrew Simms Group event giveaway, built with plain HTML, CSS, and JavaScript on Vite. The page is intentionally hidden from search engines, so it will not show up in Google. That is a requirement from the brief.

**Live page:** https://alessonabao.github.io/asg-giveaway-landing/

## What this is

The brief asked for a single landing page with marketing copy, a prize pack section, and a strictly-validated entry form. Form entries need to reach two inboxes and the website needs to be responsive.

## My process

I started by scaffolding the project with Vite (HTML, CSS, JS) then set up linting, Vitest, and Playwright early on. CI came next followed by CD to deploy to GitHub Pages. Getting this in place first meant every feature after that had tests and a deploy pipeline behind it from day one.

For most features, I wrote the test files first and pushed them to a testing branch then switched to a feature branch and worked until the tests passed. Partway through, this shifted slightly: I'd write tests on the testing branch, pull them into the feature branch, then make changes there until they passed before merging to main. Email routing followed the same pattern. I set up EmailJS partway through the project, wrote a test file for it, and first pointed submissions at my own email to confirm delivery worked before switching over to the two addresses mentioned in the brief using a repo variable.

I used Claude throughout, but always as a second pair of hands rather than the one deciding what to build. For the styling, I pulled the CSS from the live Andrew Simms Group site's reference elements and asked Claude to narrow it down to only what the project needed. For tests, I described what I wanted to test and had Claude draft the file then read through it myself and pushed it only once it made sense to me. Any generated file also had to be commented so it stayed readable. When I got stuck implementing EmailJS partway through a tutorial, I asked Claude to help me past that point.

Once everything worked locally, I updated the config so it would also work in the deployed version, tested it there, then flipped the repo variable to send to the two real email addresses. I finished with a README documenting the project.

## Use of AI

I used Claude as a coding partner throughout the project. It helped most with:

- Setting up the Vite project and the config files for ESLint, Stylelint, HTMLHint, Vitest, and Playwright.
- Writing a first draft of the New Zealand phone number regex.
- Figuring out the timezone logic for the giveaway closing date, so it always cuts off at midnight NZ time no matter where the code runs.
- Writing the GitHub Actions workflows and explaining how the `workflow_run` trigger works.
- Talking through tricky edge cases in the form, like resetting the floating labels after `form.reset()`.

### How I worked with it

Instead of asking for the whole page at once, I worked on one small feature at a time. Smaller pieces are easier to keep track of, easier to check, and easier for the AI to get right.

My process for each feature:

1. **Explain.** I described the feature in plain language, including anything that should not change.
2. **Plan first.** Before any code, I asked for a plan. This let me catch bad ideas early, before they turned into bad code.
3. **Write the code.** I read every line before adding it. If I did not fully understand something, I rewrote it or removed it.
4. **Add tests.** I wrote or updated tests so the new behaviour stayed locked in.
5. **Check everything.** I ran the linters and the full test suite locally then opened the pull request.

This is close to the "Explore, Plan, Code, Commit" approach described in Anthropic's own guide for Claude Code. I skipped most of the explore step, since the project started from scratch. I also added a clear testing step before committing, which matches the test-first approach I used.

The planning step mattered most. If a plan is wrong, I can see that by reading a few sentences and ask for a different approach. If the same mistake only shows up after the code is written, fixing it means rewriting the code, which takes much longer. Small pull requests matter for the same reason. A small change is something I can actually read closely and understand, and so can anyone reviewing it. A large change is easier to skim and easier for mistakes to slip through.

I treated anything Claude wrote as a first draft, not a final answer. If I did not fully understand it, it either got rewritten or left out. I also kept the comments in the code in plain English, so the reasoning behind each part stays easy to follow later.

## Tech stack

| Choice                            | Why                                                                              |
| --------------------------------- | -------------------------------------------------------------------------------- |
| **Vite**                          | Fast dev server, simple build, easy GitHub Pages setup.                          |
| **EmailJS**                       | Sends form emails without needing a backend server.                              |
| **Vitest + jsdom**                | Fast unit tests for validation, dates, and email data.                           |
| **Playwright**                    | Tests across multiple browsers and screen sizes, including no horizontal scroll. |
| **ESLint, Stylelint, HTMLHint**   | Catches code and style mistakes before they're merged.                           |
| **GitHub Actions + GitHub Pages** | Free CI and hosting. Deploys only after tests pass.                              |

## Project structure

```
index.html              Entry HTML, loads the module script
public/                  Static files copied as-is (favicon, logo, robots.txt)
src/
  css/style.css          Single stylesheet, brand values pulled from the ASG site
  scripts/
    main.js              Renders the page, wires up the form
    submitEntry.js       Builds the EmailJS payload and sends it
    giveawayStatus.js    Closing-date logic and the form lockout
    config.js            EmailJS credentials and recipient routing
  assets/images/prizes/  Placeholder prize images
tests/
  unit/                  Vitest specs for form, closing date, email, noindex
  e2e/                   Playwright specs for load, viewports, banner
.github/workflows/       frontend-ci.yml and frontend-cd.yml
```

## Running it locally

1. **Clone the repo** and install dependencies.

```bash
   git clone <repo-url>
   cd <project-folder>
   npm install
```

2. **Set up environment variables.** A `.env.example` file is included in the repo. Copy it to `.env`, then fill in your own EmailJS values (service ID, template ID, public key).

```bash
   cp .env.example .env
```

3. **Start the dev server.**

```bash
   npm run dev
```

The site will be available at the local URL shown in the terminal (usually `http://localhost:5173`).

4. **Run the tests** (optional but recommended).

```bash
   npm run test        # unit tests (Vitest)
   npm run test:e2e     # end-to-end tests (Playwright)
```

Note: in local dev, form submissions are routed to a test inbox rather than the client's real addresses, so it's safe to submit test entries while developing.

## Environment variables

All four are Vite variables, so they are bundled into the shipped site. That is expected for EmailJS, where the public key is meant to be public.

| Variable                   | Purpose                                                                                                                                     |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_EMAILJS_SERVICE_ID`  | EmailJS service                                                                                                                             |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS template                                                                                                                            |
| `VITE_EMAILJS_PUBLIC_KEY`  | EmailJS public key                                                                                                                          |
| `VITE_SEND_TO_CLIENT`      | Set to `"true"` only on the verified production deploy to route entries to the client inboxes. Anything else routes to the developer inbox. |

On the deployed site these come from GitHub repository variables, passed into the build step in both workflows.

## Deployment

Every pull request into `main` runs the CI workflow: lint, unit tests, a production build, and the Playwright suite. E2E only runs after the first three pass.

When CI succeeds on `main`, the CD workflow builds the site again with the correct GitHub Pages base path and publishes it. You can also trigger a deploy by hand from the Actions tab.

## References

These were genuinely helpful while building this:

- [Linting HTML, CSS, and JS in VS Code](https://dev.to/gerryleonugroho/no-more-messy-code-how-to-master-html-css-and-js-linting-in-vs-code-like-a-pro-1nim) for setting up ESLint, Stylelint, and HTMLHint together.
- [Vitest: testing in practice](https://main.vitest.dev/guide/learn/testing-in-practice) for structuring the unit tests.
- [Playwright best practices](https://playwright.dev/docs/best-practices) for writing e2e tests that are not flaky.
- [Send emails from a static site with EmailJS](https://medium.com/@aashisrijal252/send-emails-from-a-static-website-for-free-using-emailjs-no-backend-needed-by-aashis-rijal-80c9cb892221) for the no-backend form delivery.
- [Structuring an HTML/CSS project](https://blog.mikecodeur.com/en/post/structure-your-htmlcss-project-best-practices) for the folder layout.

```

```
