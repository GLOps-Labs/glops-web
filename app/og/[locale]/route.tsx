import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Square cover (Spotify-style): WhatsApp crops og:image to a square thumb,
// X/Facebook crop the 1.91:1 center band. Centered composition survives both.
const COPY = {
  es: {
    tagline: "Webs profesionales en días",
    sub: "Precio cerrado · 50% para iniciar",
  },
  en: {
    tagline: "Professional websites in days",
    sub: "Fixed price · 50% to start",
  },
} as const;

const COVER = { width: 1200, height: 1200 } as const;
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
          alignItems: "center",
          justifyContent: "center",
          padding: "100px",
          background: NAVY,
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "300px",
            height: "300px",
            borderRadius: "72px",
            background: "#FFFFFF",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse (OG) has no next/image runtime; data-URL img is the documented pattern */}
          <img src={logoSrc} width={220} height={220} alt="GLOps Labs" />
        </div>
        <div style={{ fontSize: 72, fontWeight: 800, color: "#FFFFFF", marginTop: "48px" }}>
          GLOps Labs
        </div>
        <div style={{ fontSize: 44, fontWeight: 600, color: "#FFFFFF", opacity: 0.9, marginTop: "16px" }}>
          {copy.tagline}
        </div>
        <div style={{ fontSize: 36, color: ACCENT, fontWeight: 700, marginTop: "16px" }}>{copy.sub}</div>
      </div>
    ),
    { width: COVER.width, height: COVER.height, headers },
  );
}
