import { cookies } from "next/headers";
import { HomeClient } from "@/components/HomeClient";
import { JsonLd, faqJsonLd, orgJsonLd, websiteJsonLd } from "@/components/JsonLd";
import { LOCALE_COOKIE, resolveLocale } from "@/lib/locale";
import { dict } from "@/lib/dict";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const query = (await searchParams).lang ?? null;
  const store = await cookies();
  const saved = store.get(LOCALE_COOKIE)?.value ?? null;
  const initialLocale = resolveLocale({ query, cookie: saved, browser: null });
  return (
    <>
      <JsonLd data={orgJsonLd} />
      <JsonLd data={websiteJsonLd} />
      <JsonLd data={faqJsonLd(dict.es.faqs.items)} />
      <JsonLd data={faqJsonLd(dict.en.faqs.items)} />
      <HomeClient initialLocale={initialLocale} />
    </>
  );
}
