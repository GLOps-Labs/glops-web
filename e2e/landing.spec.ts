import { expect, test } from "@playwright/test";

const EXPECTED = {
  httpOk: 200,
  httpNotFound: 404,
  noElements: 0,
  noOverflow: 0,
  minJsonLd: 4,
  hreflangCount: 1,
  serviceCards: 11,
  paceCards: 3,
  enHeading: "ready in days",
} as const;

const HEADING_ROLE = "heading" as const;
const BUTTON_ROLE = "button" as const;
const NAV_ROLE = "navigation" as const;
const TOP_LINK_NAME = "GLOps Labs — top";
const SERVICIOS_PATH = "/servicios";
const SMALL_MOBILE_WIDTH = 320;
const MOBILE_WIDTH = 360;
const MOBILE_VIEWPORT_HEIGHT = 740;
const MOBILE_WIDTHS = [SMALL_MOBILE_WIDTH, MOBILE_WIDTH];

test("happy: ES/EN toggle switches the hero without touching the URL", async ({ page, context }) => {
  await page.goto("/");
  await expect(page.locator("header")).toHaveCSS("position", "sticky");
  await expect(page.getByText("Exp01")).toHaveCount(EXPECTED.noElements);
  await expect(page.locator("header").getByRole("link", { name: TOP_LINK_NAME })).toBeVisible();
  await expect(page.getByRole(HEADING_ROLE, { level: 1 })).toContainText("listas en días");
  await page.getByRole(BUTTON_ROLE, { name: "EN", exact: true }).click();
  await expect(page.getByRole(HEADING_ROLE, { level: 1 })).toContainText(EXPECTED.enHeading);
  expect(page.url().includes("lang=")).toBe(false);
  const saved = (await context.cookies()).find((cookie) => cookie.name === "glops-locale");
  expect(saved?.value).toBe("en");
  await page.reload();
  await expect(page.getByRole(HEADING_ROLE, { level: 1 })).toContainText(EXPECTED.enHeading);
});

test("happy: ?lang=en starts in English", async ({ page }) => {
  await page.goto("/?lang=en");
  await expect(page.getByRole(HEADING_ROLE, { level: 1 })).toContainText(EXPECTED.enHeading);
});

test.describe("browser locale detection", () => {
  test.use({ locale: "en-US" });

  test("happy: English browser stays on / in ES until explicit choice", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole(HEADING_ROLE, { level: 1 })).toContainText("listas en días");
    await page.goto("/?lang=en");
    await expect(page).toHaveURL(/\/en\/?$/);
    await expect(page.getByRole(HEADING_ROLE, { level: 1 })).toContainText(EXPECTED.enHeading);
  });
});

test("happy: 3-step wizard builds prefilled links", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder(/landing para|landing for/i).fill("Landing para mi clínica");
  const wizard = page.locator("#contact");
  await wizard.getByRole(BUTTON_ROLE, { name: /siguiente/i }).click();
  await wizard.getByRole(BUTTON_ROLE, { name: /medio/i }).click();
  await wizard.getByRole(BUTTON_ROLE, { name: /siguiente/i }).click();
  const whatsapp = wizard.getByRole("link", { name: /whatsapp/i });
  await expect(whatsapp).toHaveAttribute("href", /wa\.me.*200/);
  await expect(whatsapp).toHaveAttribute("target", "_blank");
  const schedule = wizard.getByRole("link", { name: /agendar|schedule/i });
  await expect(schedule).toHaveAttribute("href", /notes=/);
  await expect(schedule).toHaveAttribute("target", "_blank");
});

test("happy: meta/SEO + sitemap + llms are alive", async ({ page, request }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/GLOps Labs/);
  const ldCount = await page.locator('script[type="application/ld+json"]').count();
  expect(ldCount).toBeGreaterThanOrEqual(EXPECTED.minJsonLd); // Organization + WebSite + FAQPage es/en
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(EXPECTED.hreflangCount);
  const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
  expect(ogImage).toMatch(/^https:\/\/glopslabs\.com\/og\/cover\.png/);
  const ogFile = await request.get("/og/cover.png");
  expect(ogFile.headers()["content-type"]).toContain("image/");
  for (const url of ["/sitemap.xml", "/robots.txt", "/llms.txt", "/llms-full.txt", "/og/cover.png", SERVICIOS_PATH, "/en", "/en/servicios", "/manifest.webmanifest", "/icon.png", "/apple-icon.png"]) {
    const response = await request.get(url);
    expect(response.status(), url).toBe(EXPECTED.httpOk);
  }
});

test("error: unknown route renders a friendly 404 in ES/EN", async ({ page }) => {
  const response = await page.goto("/ruta-que-no-existe");
  expect(response?.status()).toBe(EXPECTED.httpNotFound);
  await expect(page.getByText("404")).toBeVisible();
  await expect(page.getByRole("link", { name: /inicio/i })).toBeVisible();
});

test("happy: brand logo scrolls back to top", async ({ page }) => {
  await page.goto("/#contact");
  await page.locator("header").getByRole("link", { name: TOP_LINK_NAME }).click();
  await expect(page).toHaveURL(/#top$/);
});

test("happy: social links are visible", async ({ page }) => {
  await page.goto("/");
  await page.locator("#about").scrollIntoViewIfNeeded();
  await expect(page.locator("#about").getByRole("link", { name: "GitHub" })).toBeVisible();
  await expect(page.locator("#about").getByRole("link", { name: "Instagram" })).toBeVisible();
});

test("happy: catalog renders pace cards at home and every service in detail", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#work article")).toHaveCount(EXPECTED.paceCards);
  await page.goto(SERVICIOS_PATH);
  await expect(page.locator("main article")).toHaveCount(EXPECTED.serviceCards);
});

test.describe("mobile 360 regression", () => {
  test.use({ viewport: { width: 360, height: 740 } });

  test("no horizontal overflow on home, catalog and EN", async ({ page }) => {
    for (const width of MOBILE_WIDTHS) {
      await page.setViewportSize({ width, height: MOBILE_VIEWPORT_HEIGHT });
      for (const url of ["/", SERVICIOS_PATH, "/en"]) {
        await page.goto(url);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, `${width}px ${url}`).toBeLessThanOrEqual(EXPECTED.noOverflow);
      }
    }
  });

  test("header brand and schedule CTA stay visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("header").getByRole("link", { name: TOP_LINK_NAME })).toBeVisible();
    await expect(page.getByRole("link", { name: /agendar|schedule/i }).first()).toBeVisible();
  });

  test("mobile section nav jumps to each section", async ({ page }) => {
    await page.goto("/");
    const sections = page.getByRole(NAV_ROLE, { name: /secciones|sections/i });
    await expect(sections).toBeVisible();
    await sections.getByRole("link", { name: /servicios|services/i }).click();
    await expect(page).toHaveURL(/#work$/);
    await expect(page.locator("#work")).toBeInViewport();
  });
});
