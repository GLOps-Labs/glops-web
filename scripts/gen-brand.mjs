// GLOps Labs brand pipeline.
// Usage: drop the master into public/brand/glops/logo-master.png (hi-res PNG,
// white background like the chat file) and run: pnpm brand
// It generates every derivative. Never edit derivatives by hand: regenerate.
// If you get the original vector (SVG/AI/EPS), save it as logo-master.svg and
// flag it: the pipeline switches to vector-first (infinite sharpness for icon.svg/og).

import { copyFile, mkdir, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const brandDir = join(root, "public", "brand", "glops");

const MASTER = "logo-master.png";
const MARK = "logo-mark.png";
const ISOTIPO = "isotipo.jpeg";
const MAX_LOGO_WIDTH = 1200;
const DEFAULT_SIDE = 512;
const CENTER_DIVISOR = 2;
const MARK_CANVAS = 1024;
const MARK_CONTENT = 870;
// Tab favicons (option C): tight crop + contrast/saturation boost on a white
// tile. The bare mark is unreadable at 16px; the white tile gives it edges.
const FAVICON_CROP_MARGIN = 51;
const FAVICON_CROP_SIZE = 922;
const FAVICON_LARGE = 32;
const FAVICON_SMALL = 16;
const FAVICON_SIZES = [FAVICON_LARGE, FAVICON_SMALL];
const BOOST_SLOPE = 1.25;
const BOOST_OFFSET = -20;
const BOOST_SATURATION = 1.4;
const RGBA_CHANNELS = 4;
const ALPHA_CHANNEL = 3;
const FIRST_INDEX = 0;
const LAST_OFFSET = 1;
const MAX_ALPHA = 255;
// Background removal thresholds (JPEG near-whites). Pixels at/above
// BG_TRANSPARENT_ABOVE turn fully transparent, between the two they fade.
const BG_OPAQUE_BELOW = 215;
const BG_TRANSPARENT_ABOVE = 245;
const MONO_LUMINANCE_MAX = 200;

// Square derivatives (contain on white: the master already has a white background).
// The mark comes from isotipo.jpeg when present (preferred: pure rocket, no text);
// otherwise it falls back to logo-mark.png, then to the full lockup.
const SQUARES = [
  { file: "icon-512.png", size: 512 },
  { file: "icon-192.png", size: 192 },
  // Apple requires opaque icons (transparent pixels render black on iOS).
  { file: "apple-touch-icon.png", size: 180, opaque: true },
];

async function loadMaster() {
  const files = await readdir(brandDir);
  if (!files.includes(MASTER)) {
    throw new Error(
      `Missing public/brand/glops/${MASTER}: save the chat logo there (hi-res PNG) and retry.`,
    );
  }
  if (files.includes(ISOTIPO)) {
    await buildMark();
    return MARK;
  }
  const mark = files.includes(MARK) ? MARK : MASTER;
  if (mark === MASTER) {
    console.warn(
      "Heads-up: without logo-mark.png (standalone rocket) the favicons at 32px and below will use the full lockup, which reads poorly. Crop the mark, save it as logo-mark.png, and regenerate.",
    );
  }
  return mark;
}

// Rebuilds logo-mark.png from isotipo.jpeg: white background cut via flood
// fill from the borders (interior whites inside the rings are never reached),
// then art fitted inside MARK_CONTENT, centered on a transparent MARK_CANVAS.
async function buildMark() {
  const cut = await cutWhiteBackground(join(brandDir, ISOTIPO));
  const { data, info } = await cut
    .resize(MARK_CONTENT, MARK_CONTENT, { fit: "inside" })
    .toBuffer({ resolveWithObject: true });
  const padTop = Math.floor((MARK_CANVAS - info.height) / CENTER_DIVISOR);
  const padLeft = Math.floor((MARK_CANVAS - info.width) / CENTER_DIVISOR);
  await sharp(data, { raw: { width: info.width, height: info.height, channels: RGBA_CHANNELS } })
    .extend({
      top: padTop,
      bottom: MARK_CANVAS - info.height - padTop,
      left: padLeft,
      right: MARK_CANVAS - info.width - padLeft,
      background: "#FFFFFF00",
    })
    .png()
    .toFile(join(brandDir, MARK));
  console.log(`OK ${MARK} ${MARK_CANVAS}x${MARK_CANVAS} (from ${ISOTIPO}, transparent)`);
}

function backgroundAlpha(lightest) {
  if (lightest >= BG_TRANSPARENT_ABOVE) return FIRST_INDEX;
  const span = BG_TRANSPARENT_ABOVE - BG_OPAQUE_BELOW;
  return Math.round(((BG_TRANSPARENT_ABOVE - lightest) * MAX_ALPHA) / span);
}

function borderSeeds(width, height) {
  const seeds = [];
  for (let edge = FIRST_INDEX; edge < width; edge += LAST_OFFSET) {
    seeds.push(edge, (height - LAST_OFFSET) * width + edge);
  }
  for (let edge = FIRST_INDEX; edge < height; edge += LAST_OFFSET) {
    seeds.push(edge * width, edge * width + (width - LAST_OFFSET));
  }
  return seeds;
}

function pixelLightest(data, offset) {
  let lightest = MAX_ALPHA;
  for (let channel = FIRST_INDEX; channel < ALPHA_CHANNEL; channel += LAST_OFFSET) {
    lightest = Math.min(lightest, data[offset + channel]);
  }
  return lightest;
}

// One-color white version of the mark for dark overlays (social covers,
// video watermarks). Every visible stroke goes white, transparency stays.
async function buildMonoWhite() {
  const { data, info } = await sharp(join(brandDir, MARK)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const height = info.height ?? DEFAULT_SIDE;
  const pixels = info.width * height;
  for (let index = FIRST_INDEX; index < pixels; index += LAST_OFFSET) {
    const offset = index * RGBA_CHANNELS;
    if (data[offset + ALPHA_CHANNEL] > FIRST_INDEX && pixelLightest(data, offset) < MONO_LUMINANCE_MAX) {
      for (let channel = FIRST_INDEX; channel < ALPHA_CHANNEL; channel += LAST_OFFSET) {
        data[offset + channel] = MAX_ALPHA;
      }
    }
  }
  await sharp(data, { raw: { width: info.width, height, channels: RGBA_CHANNELS } })
    .png()
    .toFile(join(brandDir, "logo-mark-mono-white.png"));
  console.log("OK logo-mark-mono-white.png (one-color, dark overlays only)");
}

function floodCut(data, width, height, seeds) {
  const seen = new Set(seeds);
  const stack = [...seeds];
  const push = (index) => {
    if (!seen.has(index)) {
      seen.add(index);
      stack.push(index);
    }
  };
  while (stack.length > FIRST_INDEX) {
    const index = stack.pop() ?? FIRST_INDEX;
    const px = index % width;
    const py = Math.floor(index / width);
    const offset = index * RGBA_CHANNELS;
    const lightest = pixelLightest(data, offset);
    if (lightest < BG_OPAQUE_BELOW) continue;
    data[offset + ALPHA_CHANNEL] = backgroundAlpha(lightest);
    if (px > FIRST_INDEX) push(index - LAST_OFFSET);
    if (px < width - LAST_OFFSET) push(index + LAST_OFFSET);
    if (py > FIRST_INDEX) push(index - width);
    if (py < height - LAST_OFFSET) push(index + width);
  }
}

// Cuts border-connected near-white background, pixel by pixel. Interior
// whites (node holes enclosed by strokes) survive because the fill never
// reaches them. Edge pixels fade smoothly instead of a hard cut.
async function cutWhiteBackground(input) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const width = info.width;
  const height = info.height ?? DEFAULT_SIDE;
  floodCut(data, width, height, borderSeeds(width, height));
  return sharp(data, { raw: { width, height, channels: RGBA_CHANNELS } });
}

function squareCrop(meta) {
  const sourceWidth = meta.width ?? DEFAULT_SIDE;
  const sourceHeight = meta.height ?? DEFAULT_SIDE;
  const side = Math.min(sourceWidth, sourceHeight);
  return {
    left: Math.floor((sourceWidth - side) / CENTER_DIVISOR),
    top: Math.floor((sourceHeight - side) / CENTER_DIVISOR),
    width: side,
    height: side,
  };
}

async function writeLockup() {
  const cut = await cutWhiteBackground(join(brandDir, MASTER));
  const { data, info } = await cut.toBuffer({ resolveWithObject: true });
  const targetWidth = Math.min(MAX_LOGO_WIDTH, info.width);
  await sharp(data, { raw: { width: info.width, height: info.height, channels: RGBA_CHANNELS } })
    .resize({ width: targetWidth, withoutEnlargement: true })
    .png()
    .toFile(join(brandDir, "logo.png"));
}

async function writeSquare({ mark, crop, file, size, opaque = false }) {
  let image = sharp(join(brandDir, mark)).extract(crop).resize(size, size, { fit: "contain" });
  if (opaque) {
    image = image.flatten({ background: "#FFFFFF" });
  }
  await image.png().toFile(join(brandDir, file));
  console.log(`OK ${file} ${size}x${size}`);
}

async function buildFavicons() {
  const boosted = sharp(join(brandDir, MARK)).extract({
    left: FAVICON_CROP_MARGIN,
    top: FAVICON_CROP_MARGIN,
    width: FAVICON_CROP_SIZE,
    height: FAVICON_CROP_SIZE,
  }).linear(BOOST_SLOPE, BOOST_OFFSET).modulate({ saturation: BOOST_SATURATION });
  for (const size of FAVICON_SIZES) {
    const flat = boosted.clone().resize(size, size, { fit: "contain" }).flatten({ background: "#FFFFFF" });
    await flat.clone().png().toFile(join(brandDir, `favicon-${size}.png`));
    await flat.png().toFile(join(brandDir, `icon-${size}.png`));
    console.log(`OK favicon-${size}.png + icon-${size}.png (white tile)`);
  }
}

async function wireApp() {
  const appDir = join(root, "app");
  await copyFile(join(brandDir, "favicon-32.png"), join(appDir, "icon.png"));
  await copyFile(join(brandDir, "apple-touch-icon.png"), join(appDir, "apple-icon.png"));
  console.log("OK app/icon.png + app/apple-icon.png");
}

async function main() {
  const mark = await loadMaster();
  await mkdir(brandDir, { recursive: true });
  await buildMonoWhite();

  const meta = await sharp(join(brandDir, MASTER)).metadata();
  console.log(`Master: ${meta.width}x${meta.height} ${meta.format}`);
  await writeLockup();

  const markMeta = await sharp(join(brandDir, mark)).metadata();
  const crop = squareCrop(markMeta);
  for (const { file, size, opaque = false } of SQUARES) {
    await writeSquare({ mark, crop, file, size, opaque });
  }

  await buildFavicons();
  await wireApp();
  console.log("OK favicons (white tile) + logo.png + app icons");
}

await main();
