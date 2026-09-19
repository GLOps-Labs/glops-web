import { describe, expect, it } from "vitest";
import { dict } from "./dict";
import { services } from "./services";

const ENGLISH_LEFT = ["invoice", "deploy", "staging", "password"];
const SPANISH_LEFT = ["desde", "Qué incluye", "mensual", "días"];

describe("locale purity (no leaked words)", () => {
  it("keeps Spanish copy free of English leftovers", () => {
    const blob = JSON.stringify([dict.es.process, dict.es.work, dict.es.faqs, dict.es.wizard]);
    for (const word of ENGLISH_LEFT) {
      expect(blob).not.toContain(word);
    }
  });

  it("keeps English copy free of Spanish leftovers", () => {
    const blob = JSON.stringify([dict.en.process, dict.en.work, dict.en.faqs, dict.en.wizard]);
    for (const word of SPANISH_LEFT) {
      expect(blob).not.toContain(word);
    }
  });

  it("keeps service times localized per locale", () => {
    for (const service of services) {
      expect(service.timeEn).not.toContain("días");
      expect(service.timeEn).not.toContain("mensual");
    }
  });
});
