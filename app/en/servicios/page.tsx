import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { JsonLd, orgJsonLd, serviciosBreadcrumbJsonLd } from "@/components/JsonLd";
import { ArrowIcon } from "@/components/ArrowIcon";
import { Catalog } from "@/components/Catalog";
import { Wizard } from "@/components/Wizard";
import { siteConfig, siteUrls } from "@/config/site";

export const metadata: Metadata = {
  title: "Services — GLOps Labs",
  description:
    "Landing pages from $250, corporate sites, digital QR menus, corporate email and more. Clear timelines, 50% to start. Fixed scope.",
  alternates: {
    canonical: siteUrls.serviciosEn,
    languages: { es: siteUrls.serviciosEs, en: siteUrls.serviciosEn },
  },
  openGraph: {
    title: "GLOps Labs Services — Fixed scope, delivered in days",
    description: "Landings, corporate sites, QR menus and more for SMBs and independents.",
    url: siteUrls.serviciosEn,
    siteName: "GLOps Labs",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og/cover.png", width: 1200, height: 1200, alt: "GLOps Labs Services" }],
  },
  twitter: { card: "summary_large_image" },
};

export default function EnServicios() {
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-line bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-2">
          <Link
            href="/en"
            aria-label="Back to home — GLOps Labs"
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg px-4 py-2 text-sm font-semibold shadow-sm transition hover:border-ink hover:bg-ink hover:text-white active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <ArrowIcon flip className="h-4 w-4" /> GLOps Labs
          </Link>
          {siteConfig.features.showSchedule ? (
            <a
              href={siteConfig.contact.calcom}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accentink shadow-sm transition hover:brightness-110 hover:shadow-md active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:gap-1.5 sm:px-4 sm:py-2 sm:text-sm"
            >
              Schedule <ArrowIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            </a>
          ) : null}
        </div>
      </header>
    <main id="top" className="mx-auto flex w-full max-w-5xl flex-1 scroll-mt-20 flex-col gap-10 px-4 py-12">
      <JsonLd data={orgJsonLd} />
      <JsonLd data={serviciosBreadcrumbJsonLd("en")} />
      <div>
        <h1 className="mt-2 text-center font-display font-bold leading-tight tracking-tight sm:text-left" style={{ fontSize: "var(--section-size)" }}>
          Fixed-scope services for SMBs and professionals
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted sm:text-lg">
          Eleven standardized products: you know exactly what you get, when and
          for how much before paying. 50% to start, the balance before deploy.
          The clock starts when you deliver copy, photos and logo.
        </p>
      </div>

      <Catalog locale="en" catalogPath="/en/servicios" />

      <section className="rounded-[20px] bg-carddark p-5 text-white sm:p-7">
        <h2 className="text-center font-display text-xl font-bold leading-tight tracking-tight sm:text-left sm:text-2xl">How we work</h2>
        <ol className="mt-3 flex list-decimal flex-col gap-2 pl-5 text-sm leading-6 text-white/80">
          <li>We scope in a 15-minute form or a call, your choice.</li>
          <li>We sign a closed checklist. Off-list gets re-quoted.</li>
          <li>You pay 50% to start. The balance before migrating to your final domain.</li>
          <li>We deliver on password staging; final deploy ships with full payment.</li>
        </ol>
      </section>

    </main>
      <Suspense>
        <Wizard locale="en" />
      </Suspense>

      <div className="mx-auto flex w-full max-w-5xl justify-center px-4 pb-12">
        <a
          href="#top"
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg px-5 py-2.5 text-sm font-semibold shadow-sm transition hover:border-ink hover:bg-ink hover:text-white active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <span aria-hidden="true" className="text-base leading-none">↑</span> Back to top
        </a>
      </div>
    </>
  );
}
