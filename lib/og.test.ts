import { readFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";

const COVER_WIDTH = 1200;
const COVER_HEIGHT = 1200;
const MIN_COVER_BYTES = 10000;
const EQUAL_BUFFERS = 0;
const LOCALES = ["es", "en"] as const;

function coverPath(locale: (typeof LOCALES)[number]): string {
  return join(process.cwd(), "public", "og", `${locale}.png`);
}

// Guards the WhatsApp/IG square thumbnail: square PNG, real content,
// and ES/EN actually different. Taste is still verified by eye.
describe("og covers (public/og/*.png)", () => {
  it.each(LOCALES)("serves a %s square cover with real content", async (locale) => {
    const buffer = readFileSync(coverPath(locale));
    expect(buffer.byteLength).toBeGreaterThan(MIN_COVER_BYTES);
    const meta = await sharp(buffer).metadata();
    expect(meta.format).toBe("png");
    expect(meta.width).toBe(COVER_WIDTH);
    expect(meta.height).toBe(COVER_HEIGHT);
  });

  it("keeps ES and EN covers different", () => {
    const spanish = readFileSync(coverPath("es"));
    const english = readFileSync(coverPath("en"));
    expect(Buffer.compare(spanish, english)).not.toBe(EQUAL_BUFFERS);
  });
});
