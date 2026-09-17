import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, orgJsonLd, serviciosBreadcrumbJsonLd } from "@/components/JsonLd";
import { ArrowIcon } from "@/components/ArrowIcon";
import { Wizard } from "@/components/Wizard";
import { siteUrls } from "@/config/site";
import { CATEGORY_META, services } from "@/lib/services";
import type { ServiceCategory } from "@/lib/services";

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

const ORDER: readonly ServiceCategory[] = ["rapido", "medio", "core"];

export default function EnServicios() {
  return (
    <main className="mx-auto flex max-w-5xl flex-1 flex-col gap-10 px-4 py-12">
      <JsonLd data={orgJsonLd} />
      <JsonLd data={serviciosBreadcrumbJsonLd("en")} />
      <div>
        <Link href="/en" className="flex w-fit items-center gap-1.5 text-sm text-muted underline">
          <ArrowIcon flip className="h-3.5 w-3.5" /> GLOps Labs
        </Link>
        <h1 className="mt-2 font-display font-bold" style={{ fontSize: "var(--section-size)" }}>
          Fixed-scope services for SMBs and professionals
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          Eleven standardized products: you know exactly what you get, when and
          for how much before paying. 50% to start, the balance before deploy.
          The clock starts when you deliver copy, photos and logo.
        </p>
      </div>

      {ORDER.map((category) => {
        const meta = CATEGORY_META[category];
        return (
          <section key={category}>
            <h2 className="font-display text-xl font-bold sm:text-2xl">
              {meta.titleEn} · {meta.timeEn} · from ${meta.floor}
            </h2>
            <div className="mt-4 flex flex-col gap-6">
              {services
                .filter((service) => service.category === category)
                .map((service) => (
                  <article key={service.slug} className="rounded-[20px] border border-line bg-bgsoft p-5 sm:p-7">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-bold text-accent">{service.slug}</span>
                      <span className="text-sm font-bold">from ${service.priceFrom}{service.recurring ? "/mo" : null} · {service.time}</span>
                    </div>
                    <h3 className="mt-2 font-display text-xl font-bold sm:text-2xl">{service.titleEn}</h3>
                    <p className="mt-2 text-sm text-muted"><strong className="text-ink">What&apos;s included:</strong> {service.includesEn}</p>
                  </article>
                ))}
            </div>
          </section>
        );
      })}

      <section className="rounded-[20px] bg-carddark p-5 text-white sm:p-7">
        <h2 className="font-display text-xl font-bold sm:text-2xl">How we work</h2>
        <ol className="mt-3 flex list-decimal flex-col gap-2 pl-5 text-sm text-white/80">
          <li>We scope in a 15-minute form or a call, your choice.</li>
          <li>We sign a closed checklist. Off-list gets re-quoted.</li>
          <li>You pay 50% to start. The balance before migrating to your final domain.</li>
          <li>We deliver on password staging; final deploy ships with full payment.</li>
        </ol>
      </section>

      <Wizard locale="en" />
    </main>
  );
}
