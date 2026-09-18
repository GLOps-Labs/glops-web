import { describe, expect, it } from "vitest";
import { NEED_MAX_LENGTH, WizardStateSchema, buildContactLinks } from "./contact";

describe("WizardStateSchema (parse, don't validate)", () => {
  it("accepts a complete valid state", () => {
    const result = WizardStateSchema.safeParse({ need: "Landing para mi clínica", category: "medio" });
    expect(result.success).toBe(true);
  });

  it("rejects need shorter than the minimum", () => {
    const result = WizardStateSchema.safeParse({ need: "abc", category: "medio" });
    expect(result.success).toBe(false);
  });

  it("rejects need longer than the maximum", () => {
    const tooLong = "x".repeat(NEED_MAX_LENGTH).concat("x");
    const result = WizardStateSchema.safeParse({ need: tooLong, category: "medio" });
    expect(result.success).toBe(false);
  });

  it("rejects category outside the enum", () => {
    const result = WizardStateSchema.safeParse({ need: "Landing válida", category: "express" });
    expect(result.success).toBe(false);
  });
});

describe("buildContactLinks (single mutation gate)", () => {
  it("prefills whatsapp with category + floor + need", () => {
    const links = buildContactLinks({ need: "Landing", category: "medio" });
    expect(links.whatsapp).toContain("wa.me/");
    const decoded = decodeURIComponent(links.whatsapp);
    expect(decoded).toContain("quiero pedir");
    expect(decoded).toContain("medio desde $200 — Landing");
  });

  it("prefills mailto subject + styled body", () => {
    const links = buildContactLinks({ need: "Menú QR", category: "rapido" });
    expect(links.email.startsWith("mailto:")).toBe(true);
    const decoded = decodeURIComponent(links.email);
    expect(decoded).toContain("Nuevo proyecto web");
    expect(decoded).toContain("rapido desde $50 — Menú QR");
    expect(decoded).toContain("Mis datos:");
  });

  it("takes cal.com from siteConfig", () => {
    const links = buildContactLinks({ need: "Corporativo", category: "core" });
    expect(links.calcom).toContain("cal.com/");
  });
});
