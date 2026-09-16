import { describe, expect, it } from "vitest";
import { CATEGORY_META, ServiceSchema, services, servicesByCategory } from "./services";

const EMPTY = 0;

describe("ServiceSchema", () => {
  it("accepts the full catalog at build time (misconfig fails the build, not the user)", () => {
    for (const service of services) {
      expect(ServiceSchema.safeParse(service).success).toBe(true);
    }
  });

  it("rejects category outside the union", () => {
    expect(
      ServiceSchema.safeParse({
        slug: "x",
        category: "express",
        priceFrom: 10,
        time: "24h",
        titleEs: "x",
        titleEn: "y",
        includesEs: "x",
        includesEn: "y",
        recurring: false,
      }).success,
    ).toBe(false);
  });
});

describe("catalog coverage", () => {
  it("covers every category with fixed entry prices", () => {
    expect(servicesByCategory("rapido").length).toBeGreaterThan(EMPTY);
    expect(servicesByCategory("medio").length).toBeGreaterThan(EMPTY);
    expect(servicesByCategory("core").length).toBeGreaterThan(EMPTY);
    for (const service of services) {
      expect(service.priceFrom).toBeGreaterThan(EMPTY);
      expect(service.time.length).toBeGreaterThan(EMPTY);
    }
  });

  it("keeps category floors below every service price", () => {
    for (const service of services) {
      expect(service.priceFrom).toBeGreaterThanOrEqual(CATEGORY_META[service.category].floor);
    }
  });
});
