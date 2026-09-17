import type { Metadata } from "next";
import { EnHome } from "@/components/EnHome";
import { JsonLd, faqJsonLd, orgJsonLd, websiteJsonLd } from "@/components/JsonLd";
import { siteUrls } from "@/config/site";
import { dict } from "@/lib/dict";

export const metadata: Metadata = {
  title: "GLOps Labs — Fixed-scope websites, delivered in days",
  description:
    "Landing pages, corporate sites, QR menus, corporate email and more for SMBs and professionals. Clear timeline, 50% to start.",
  alternates: {
    canonical: siteUrls.homeEn,
    languages: { es: siteUrls.base, en: siteUrls.homeEn },
  },
  openGraph: {
    title: "GLOps Labs — Professional websites in days",
    description: "Landings, corporate sites, QR menus and more for SMBs and independents.",
    url: siteUrls.homeEn,
    siteName: "GLOps Labs",
    locale: "en_US",
    alternateLocale: ["es_ES"],
    type: "website",
    images: [{ url: "/og/cover.png", width: 1200, height: 1200, alt: "GLOps Labs — Professional websites in days" }],
  },
  twitter: { card: "summary_large_image" },
};

export default function EnPage() {
  return (
    <>
      <JsonLd data={orgJsonLd} />
      <JsonLd data={websiteJsonLd} />
      <JsonLd data={faqJsonLd(dict.en.faqs.items)} />
      <EnHome />
    </>
  );
}
