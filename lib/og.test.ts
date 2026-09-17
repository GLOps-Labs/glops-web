import { readFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";

const COVER_WIDTH = 1200;
const COVER_HEIGHT = 1200;
const MIN_COVER_BYTES = 10000;

// Guards the WhatsApp/IG square thumbnail: single shared brand cover,
// square PNG with real content. Taste is still verified by eye.
describe("og cover (public/og/cover.png)", () => {
  it("serves a square cover with real content", async () => {
    const buffer = readFileSync(join(process.cwd(), "public", "og", "cover.png"));
    expect(buffer.byteLength).toBeGreaterThan(MIN_COVER_BYTES);
    const meta = await sharp(buffer).metadata();
    expect(meta.format).toBe("png");
    expect(meta.width).toBe(COVER_WIDTH);
    expect(meta.height).toBe(COVER_HEIGHT);
  });
});
