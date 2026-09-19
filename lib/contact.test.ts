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
  it("prefills whatsapp in Spanish with localized pace", () => {
    const links = buildContactLinks({ need: "Landing", category: "medio" }, "es");
    expect(links.whatsapp).toContain("wa.me/");
    const decoded = decodeURIComponent(links.whatsapp);
    expect(decoded).toContain("quiero pedir");
    expect(decoded).toContain("Medio");
    expect(decoded).toContain("desde $200");
  });

  it("prefills whatsapp in English with localized pace", () => {
    const links = buildContactLinks({ need: "Landing", category: "medio" }, "en");
    const decoded = decodeURIComponent(links.whatsapp);
    expect(decoded).toContain("I want to order");
    expect(decoded).toContain("Standard");
    expect(decoded).toContain("from $200");
    expect(decoded).not.toContain("quiero pedir");
  });

  it("prefills mailto subject + styled body in Spanish", () => {
    const links = buildContactLinks({ need: "Menú QR", category: "rapido" }, "es");
    expect(links.email.startsWith("mailto:")).toBe(true);
    const decoded = decodeURIComponent(links.email);
    expect(decoded).toContain("Nuevo proyecto web");
    expect(decoded).toContain("Rápido");
    expect(decoded).toContain("Mis datos:");
    expect(decoded).toContain("Mejor horario:");
  });

  it("prefills mailto subject + styled body in English", () => {
    const links = buildContactLinks({ need: "QR menu", category: "rapido" }, "en");
    expect(links.email.startsWith("mailto:")).toBe(true);
    const decoded = decodeURIComponent(links.email);
    expect(decoded).toContain("New website project");
    expect(decoded).toContain("Hello");
    expect(decoded).toContain("My details:");
    expect(decoded).toContain("Best time:");
    expect(decoded).not.toContain("Hola");
  });

  it("prefills calcom notes line by line in Spanish without contact rows", () => {
    const links = buildContactLinks({ need: "Corporativo", category: "core" }, "es");
    expect(links.calcom).toContain("cal.com/");
    expect(links.calcom).toContain("notes=");
    const decoded = decodeURIComponent(links.calcom);
    expect(decoded).toContain("Quiero pedir:");
    expect(decoded).toContain("Ritmo: Core");
    expect(decoded).toContain("Pedido: Corporativo");
    expect(decoded).not.toContain("Nombre:");
  });

  it("prefills calcom notes line by line in English without contact rows", () => {
    const links = buildContactLinks({ need: "Corporate", category: "core" }, "en");
    expect(links.calcom).toContain("notes=");
    const decoded = decodeURIComponent(links.calcom);
    expect(decoded).toContain("I want to order:");
    expect(decoded).toContain("Pace: Core");
    expect(decoded).toContain("Request: Corporate");
    expect(decoded).not.toContain("Name:");
    expect(decoded).not.toContain("Quiero");
  });
});
