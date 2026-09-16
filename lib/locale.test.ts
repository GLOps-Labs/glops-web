import { describe, expect, it } from "vitest";
import { isLocale, resolveLocale } from "./locale";

describe("resolveLocale (query → cookie → browser → es, clean URLs)", () => {
  it("prefers an explicit ?lang= override", () => {
    expect(resolveLocale({ query: "en", cookie: "es", browser: "es-VE" })).toBe("en");
  });

  it("ignores an invalid ?lang= and falls through", () => {
    expect(resolveLocale({ query: "fr", cookie: "en", browser: "es-VE" })).toBe("en");
  });

  it("uses the saved cookie next", () => {
    expect(resolveLocale({ query: null, cookie: "en", browser: "es-VE" })).toBe("en");
  });

  it("detects the browser language by prefix", () => {
    expect(resolveLocale({ query: null, cookie: null, browser: "en-US" })).toBe("en");
    expect(resolveLocale({ query: null, cookie: null, browser: "es-VE" })).toBe("es");
  });

  it("defaults to ES when nothing matches", () => {
    expect(resolveLocale({ query: null, cookie: "fr", browser: "pt-BR" })).toBe("es");
    expect(resolveLocale({ query: null, cookie: null, browser: null })).toBe("es");
  });
});

describe("isLocale", () => {
  it("accepts only es/en", () => {
    expect(isLocale("es")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(isLocale(null)).toBe(false);
  });
});
