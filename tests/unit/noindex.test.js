import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, test } from "vitest";

// ===========================================================================
// WHAT THIS TESTS
// The brief requires the page be configured so search engines do not index
// or crawl it. Two things enforce that and both are easy to break with an
// unrelated edit:
//   1. a `robots` meta tag in index.html   (works on any host / path)
//   2. public/robots.txt disallowing all   (works when served from the root)
// ===========================================================================

// vitest runs from the project root, so paths resolve against process.cwd().
const read = (relPath) => readFileSync(join(process.cwd(), relPath), "utf8");

describe("search engines are told not to index the page", () => {
  test("index.html has a robots meta tag with noindex and nofollow", () => {
    const html = read("index.html");
    const robotsMeta = html.match(/<meta\s+name=["']robots["'][^>]*>/i)?.[0];

    expect(robotsMeta).toBeTruthy();
    expect(robotsMeta).toMatch(/content=["'][^"']*\bnoindex\b/i);
    expect(robotsMeta).toMatch(/content=["'][^"']*\bnofollow\b/i);
  });

  test("public/robots.txt exists and disallows every path for all crawlers", () => {
    const path = join(process.cwd(), "public/robots.txt");
    expect(existsSync(path), "public/robots.txt is missing").toBe(true);

    const robotsTxt = readFileSync(path, "utf8");
    expect(robotsTxt).toMatch(/^\s*User-agent:\s*\*\s*$/im);
    expect(robotsTxt).toMatch(/^\s*Disallow:\s*\/\s*$/im);
  });
});
