import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, orgJsonLd, serviciosBreadcrumbJsonLd } from "@/components/JsonLd";
import { ArrowIcon } from "@/components/ArrowIcon";
import { Wizard } from "@/components/Wizard";
import { siteUrls } from "@/config/site";
import { CATEGORY_META, services } from "@/lib/services";
import type { ServiceCategory } from "@/lib/services";

export const metadata: Metadata = {
  title: "Servicios web — GLOps Labs",
  description:
    "Landing pages desde $250, sitios corporativos, menú QR digital, email corporativo y más. Tiempos claros, 50% para iniciar. Alcance blindado.",
  alternates: {
    canonical: siteUrls.serviciosEs,
    languages: { es: siteUrls.serviciosEs, en: siteUrls.serviciosEn },
  },
  openGraph: {
    title: "Servicios GLOps Labs — Alcance blindado, entrega en días",
    description: "Landings, corporativos, menú QR y más para PYMEs y profesionales.",
    url: siteUrls.serviciosEs,
    siteName: "GLOps Labs",
    locale: "es_ES",
    alternateLocale: ["en_US"],
    type: "website",
    images: [{ url: "/og/cover.png", width: 1200, height: 1200, alt: "Servicios GLOps Labs" }],
  },
  twitter: { card: "summary_large_image" },
};

const ORDER: readonly ServiceCategory[] = ["rapido", "medio", "core"];

export default function Servicios() {
  return (
    <main className="mx-auto flex max-w-5xl flex-1 flex-col gap-10 px-4 py-12">
      <JsonLd data={orgJsonLd} />
      <JsonLd data={serviciosBreadcrumbJsonLd("es")} />
      <div>
        <Link href="/" className="flex w-fit items-center gap-1.5 text-sm text-muted underline">
          <ArrowIcon flip className="h-3.5 w-3.5" /> GLOps Labs
        </Link>
        <h1 className="mt-2 text-center font-display font-bold sm:text-left" style={{ fontSize: "var(--section-size)" }}>
          Servicios web para PYMEs y profesionales
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          Once productos estandarizados: sabes exactamente qué recibes, en cuánto
          tiempo y por cuánto antes de pagar. 50% para iniciar, el resto antes del
          deploy. El tiempo corre desde que entregas textos, fotos y logo.
        </p>
      </div>

      {ORDER.map((category) => {
        const meta = CATEGORY_META[category];
        return (
          <section key={category}>
            <h2 className="text-center font-display text-xl font-bold sm:text-left sm:text-2xl">
              {meta.titleEs} · {meta.timeEs} · desde ${meta.floor}
            </h2>
            <div className="mt-4 flex flex-col gap-6">
              {services
                .filter((service) => service.category === category)
                .map((service) => (
                  <article key={service.slug} className="rounded-[20px] border border-line bg-bgsoft p-5 sm:p-7">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-bold text-accent">{service.slug}</span>
                      <span className="text-sm font-bold">desde ${service.priceFrom}{service.recurring ? "/mes" : null} · {service.time}</span>
                    </div>
                    <h3 className="mt-2 font-display text-xl font-bold sm:text-2xl">{service.titleEs}</h3>
                    <p className="mt-2 text-sm text-muted"><strong className="text-ink">Qué incluye:</strong> {service.includesEs}</p>
                  </article>
                ))}
            </div>
          </section>
        );
      })}

      <section className="rounded-[20px] bg-carddark p-5 text-white sm:p-7">
        <h2 className="text-center font-display text-xl font-bold sm:text-left sm:text-2xl">Cómo trabajamos</h2>
        <ol className="mt-3 flex list-decimal flex-col gap-2 pl-5 text-sm text-white/80">
          <li>Levantamos el requerimiento en un formulario de 15 minutos o una llamada, como prefieras.</li>
          <li>Firmamos checklist cerrada. Lo fuera de lista se re-cotiza.</li>
          <li>Pagas 50% para iniciar. El resto antes de migrar a tu dominio final.</li>
          <li>Entregamos en staging con password; el deploy final va con el pago completo.</li>
        </ol>
      </section>

      <Wizard locale="es" />
    </main>
  );
}
