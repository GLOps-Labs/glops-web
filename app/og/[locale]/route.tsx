import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

const COPY = {
  es: {
    h1: "Webs profesionales en días",
    sub: "Precio cerrado · 50% para iniciar",
  },
  en: {
    h1: "Professional websites in days",
    sub: "Fixed price · 50% to start",
  },
} as const;

const COVER = { width: 1200, height: 630 } as const;
const LOGO = { width: 340, height: 241 } as const;
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
  const logo = await readFile(join(process.cwd(), "public", "brand", "glops", "logo.png"));
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
          background: "#FFFFFF",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse (OG) has no next/image runtime; data-URL img is the documented pattern */}
        <img src={logoSrc} width={LOGO.width} height={LOGO.height} alt="GLOps Labs" />
        <div style={{ fontSize: 84, fontWeight: 800, color: "#0B0B0C", lineHeight: 1.05, marginTop: "24px" }}>
          {copy.h1}
        </div>
        <div style={{ fontSize: 34, color: "#F97316", fontWeight: 700, marginTop: "24px" }}>{copy.sub}</div>
      </div>
    ),
    { width: COVER.width, height: COVER.height, headers },
  );
}
