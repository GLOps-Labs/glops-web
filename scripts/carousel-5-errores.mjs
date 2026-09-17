// GLOps Labs carousel generator: "5 errores que matan tu negocio sin web".
// Usage: pnpm carousel:errores
// Renders IG portrait slides (1080x1350) with Playwright and saves PNGs to
// ../glops-content/carrusel-01-5-errores/. Copy lives here as data (same
// pattern as the OG route); text is rendered HTML, never AI image-gen
// (generators mangle Spanish copy). Regenerate, never edit PNGs by hand.

import { mkdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const brandDir = join(root, "public", "brand", "glops");
const outDir = join(root, "..", "glops-content", "carrusel-01-5-errores");

const SLIDE_WIDTH = 1080;
const SLIDE_HEIGHT = 1350;
const DEVICE_SCALE = 2;
const NAVY = "#112255";
const ACCENT = "#F97316";
const WHITE = "#FFFFFF";
const COVER_SLIDE = 1;
const TOTAL_SLIDES = 7;
const LOGO_MARK = "logo-mark.png";

const SLIDES = [
  {
    kind: "cover",
    eyebrow: "PARA NEGOCIOS SIN WEB",
    titleA: "5 errores que matan",
    titleB: "tu negocio",
    hint: "Desliza →",
  },
  {
    kind: "error",
    number: "1",
    title: "Eres invisible en Google",
    body: "Tus clientes te buscan ahí antes de escribirte. Si no sales tú, sale tu competencia.",
  },
  {
    kind: "error",
    number: "2",
    title: "Vives alquilado en Instagram",
    body: "Si te suspenden o hackean la cuenta, empiezas de cero. Tus seguidores no son tuyos.",
  },
  {
    kind: "error",
    number: "3",
    title: "Contactarte cuesta trabajo",
    body: "Sin botón de WhatsApp a 1 toque, el cliente se cansa y se va con otro.",
  },
  {
    kind: "error",
    number: "4",
    title: "Lenta y sin versión móvil",
    body: "El 53% abandona si tarda más de 3 segundos (Google). Y 6 de cada 10 te visitan desde el celular.",
  },
  {
    kind: "error",
    number: "5",
    title: "Escondes precios e info",
    body: "Sin precios, horarios ni ubicación claros, el cliente no pregunta: compra donde sí los ve.",
  },
  {
    kind: "cta",
    title: "¿Cometes el 1, el 3 o el 5?",
    body: "Guárdalo y escríbenos",
    site: "glopslabs.com",
    note: "Webs listas en días · Precio cerrado",
  },
];

const CSS = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: system-ui, sans-serif; background: ${NAVY}; }
  .slide { width: ${SLIDE_WIDTH}px; height: ${SLIDE_HEIGHT}px; background: ${NAVY}; color: ${WHITE}; display: flex; flex-direction: column; justify-content: space-between; padding: 90px; }
  .top { display: flex; align-items: center; justify-content: space-between; }
  .brand { display: flex; align-items: center; gap: 24px; }
  .mark { width: 110px; height: 110px; border-radius: 28px; background: ${WHITE}; display: flex; align-items: center; justify-content: center; }
  .brandname { font-size: 40px; font-weight: 800; }
  .counter { font-size: 34px; font-weight: 700; opacity: 0.55; }
  .middle { display: flex; flex-direction: column; }
  .eyebrow { font-size: 34px; font-weight: 800; letter-spacing: 4px; color: ${ACCENT}; }
  .h1 { font-size: 96px; font-weight: 800; line-height: 1.08; margin-top: 28px; }
  .hint { font-size: 40px; font-weight: 700; margin-top: 36px; opacity: 0.85; }
  .number { font-size: 220px; font-weight: 800; color: ${ACCENT}; line-height: 1; }
  .title { font-size: 68px; font-weight: 800; line-height: 1.12; margin-top: 24px; }
  .body { font-size: 42px; line-height: 1.4; margin-top: 28px; opacity: 0.88; }
  .foot { font-size: 32px; font-weight: 600; opacity: 0.6; }
`;

function escapeHtml(text) {
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function topBar(index) {
  return `<div class="top"><div class="brand"><div class="mark"><img src="LOGO_SRC" width="82" height="82" alt="" /></div><div class="brandname">GLOps Labs</div></div><div class="counter">${index} / ${TOTAL_SLIDES}</div></div>`;
}

function footBar() {
  return `<div class="foot">GLOps Labs · glopslabs.com</div>`;
}

function renderSlide(slide, index, logoSrc) {
  const top = topBar(index).replace("LOGO_SRC", logoSrc);
  const foot = footBar();
  if (slide.kind === "cover") {
    return `<div class="slide" id="slide"><div>${top}</div><div class="middle"><div class="eyebrow">${escapeHtml(slide.eyebrow)}</div><div class="h1">${escapeHtml(slide.titleA)}<br />${escapeHtml(slide.titleB)}</div><div class="hint">${escapeHtml(slide.hint)}</div></div><div>${foot}</div></div>`;
  }
  if (slide.kind === "cta") {
    return `<div class="slide" id="slide"><div>${top}</div><div class="middle"><div class="title">${escapeHtml(slide.title)}</div><div class="body">${escapeHtml(slide.body)}<br /><strong>${escapeHtml(slide.site)}</strong></div><div class="hint">${escapeHtml(slide.note)}</div></div><div>${foot}</div></div>`;
  }
  return `<div class="slide" id="slide"><div>${top}</div><div class="middle"><div class="number">${escapeHtml(slide.number)}</div><div class="title">${escapeHtml(slide.title)}</div><div class="body">${escapeHtml(slide.body)}</div></div><div>${foot}</div></div>`;
}

async function main() {
  const logo = await readFile(join(brandDir, LOGO_MARK));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: SLIDE_WIDTH, height: SLIDE_HEIGHT },
    deviceScaleFactor: DEVICE_SCALE,
  });
  for (const [position, slide] of SLIDES.entries()) {
    const index = position + COVER_SLIDE;
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8" /><style>${CSS}</style></head><body>${renderSlide(slide, index, logoSrc)}</body></html>`;
    await page.setContent(html, { waitUntil: "load" });
    await page.locator("#slide").screenshot({ path: join(outDir, `slide-${index}.png`) });
  }
  await browser.close();
}

await main();
