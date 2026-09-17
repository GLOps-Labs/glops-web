import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { siteUrls } from "@/config/site";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#F97316",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrls.base),
  title: "GLOps Labs — Webs profesionales en días",
  description:
    "Landings, sitios corporativos y menús QR para PYMEs y profesionales de LatAm. Sabes qué recibes y cuánto pagas antes de empezar.",
  alternates: {
    canonical: siteUrls.base,
    languages: {
      es: siteUrls.base,
      en: siteUrls.homeEn,
    },
  },
  openGraph: {
    title: "GLOps Labs — Webs profesionales listas en días",
    description:
      "Landings, corporativos y menú QR para PYMEs y profesionales de LatAm. Precio cerrado, 50% para iniciar.",
    url: siteUrls.base,
    siteName: "GLOps Labs",
    locale: "es_ES",
    alternateLocale: ["en_US"],
    type: "website",
    images: [{ url: "/og/es.png", width: 1200, height: 1200, alt: "GLOps Labs — Webs profesionales" }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
