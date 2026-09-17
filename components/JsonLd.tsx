import { siteConfig, siteUrls } from "@/config/site";
import type { SupportedLocale } from "@/config/site";

const SCHEMA_CONTEXT = "https://schema.org";

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger -- JSON-LD: patrón estándar documentado por Next para structured data, contenido generado por nosotros (no input de usuario)
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export const orgJsonLd = {
  "@context": SCHEMA_CONTEXT,
  "@type": "Organization",
  name: siteConfig.brand.name,
  url: siteUrls.base,
  email: siteConfig.brand.email,
  sameAs: [siteConfig.brand.github, siteConfig.brand.instagram],
  description:
    "Estudio web: webs profesionales listas en días para PYMEs y profesionales. 50% para iniciar.",
};

export const websiteJsonLd = {
  "@context": SCHEMA_CONTEXT,
  "@type": "WebSite",
  name: siteConfig.brand.name,
  url: siteUrls.base,
  inLanguage: ["es", "en"],
};

export function faqJsonLd(items: ReadonlyArray<{ question: string; answer: string }>): unknown {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function serviciosBreadcrumbJsonLd(locale: SupportedLocale): unknown {
  const english = locale === "en";
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: siteConfig.brand.name, item: english ? siteUrls.homeEn : siteUrls.base },
      {
        "@type": "ListItem",
        position: 2,
        name: english ? "Services" : "Servicios",
        item: english ? siteUrls.serviciosEn : siteUrls.serviciosEs,
      },
    ],
  };
}
