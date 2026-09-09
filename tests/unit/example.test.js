import { describe, it, expect } from "vitest";

describe("smoke", () => {
  it("runs a basic assertion", () => {
    expect(1 + 1).toBe(2);
  });

  it("has a DOM available", () => {
    document.body.innerHTML = "<div id=\"app\"></div>";
    expect(document.querySelector("#app")).not.toBeNull();
  });
});
