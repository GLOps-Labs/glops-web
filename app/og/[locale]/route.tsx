import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

const COPY = {
  es: {
    lineOne: "Webs profesionales",
    lineTwo: "en días",
    sub: "Precio cerrado · 50% para iniciar",
  },
  en: {
    lineOne: "Professional websites",
    lineTwo: "in days",
    sub: "Fixed price · 50% to start",
  },
} as const;

const COVER = { width: 1200, height: 630 } as const;
const NAVY = "#112255";
const ACCENT = "#F97316";
const CACHE_CONTROL = "public, max-age=3600, s-maxage=86400";

export const dynamic = "force-static";

export function generateStaticParams(): Array<{ locale: string }> {
  return [{ locale: "es" }, { locale: "en" }];
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  const copy = locale === "en" ? COPY.en : COPY.es;
  const logo = await readFile(join(process.cwd(), "public", "brand", "glops", "logo-mark.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  const headers = new Headers();
  headers.set("Cache-Control", CACHE_CONTROL);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: NAVY,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "96px",
              height: "96px",
              borderRadius: "24px",
              background: "#FFFFFF",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse (OG) has no next/image runtime; data-URL img is the documented pattern */}
            <img src={logoSrc} width={72} height={72} alt="GLOps Labs" />
          </div>
          <div style={{ fontSize: 40, fontWeight: 800, color: "#FFFFFF" }}>GLOps Labs</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 78, fontWeight: 800, color: "#FFFFFF", lineHeight: 1.08, marginTop: "32px" }}>
          {copy.lineOne}
          <br />
          {copy.lineTwo}
        </div>
        <div style={{ fontSize: 34, color: ACCENT, fontWeight: 700, marginTop: "28px" }}>{copy.sub}</div>
      </div>
    ),
    { width: COVER.width, height: COVER.height, headers },
  );
}
