import { describe, expect, it } from "vitest";
import { siteConfig, siteUrls } from "../config/site";

const HTTPS_PREFIX = "https://";
const EMAIL_SEPARATOR = "@";
const GITHUB_HOST = "github.com/";

describe("site config", () => {
  it("exposes absolute https urls", () => {
    const urls = [siteUrls.base, siteUrls.homeEn, siteUrls.serviciosEs, siteUrls.serviciosEn];
    for (const url of urls) {
      expect(url.startsWith(HTTPS_PREFIX)).toBe(true);
    }
  });

  it("exposes brand contact channels", () => {
    expect(siteConfig.brand.email).toContain(EMAIL_SEPARATOR);
    expect(siteConfig.brand.github).toContain(GITHUB_HOST);
  });
});
