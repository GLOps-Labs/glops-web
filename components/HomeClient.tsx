"use client";

import { Suspense, useEffect, useState } from "react";
import type { SupportedLocale } from "@/config/site";
import { writeLocaleCookie } from "@/lib/locale";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Process } from "@/components/Process";
import { Work } from "@/components/Work";
import { Faqs } from "@/components/Faqs";
import { Wizard } from "@/components/Wizard";
import { Footer } from "@/components/Footer";

export function Site({
  locale,
  onLocale,
}: {
  locale: SupportedLocale;
  onLocale: (nextLocale: SupportedLocale) => void;
}) {
  return (
    <>
      <Nav locale={locale} onLocale={onLocale} />
      <main className="flex flex-1 flex-col">
        <Hero locale={locale} />
        <Process locale={locale} />
        <Work locale={locale} />
        <Faqs locale={locale} />
        <Suspense>
          <Wizard locale={locale} />
        </Suspense>
      </main>
      <Footer locale={locale} />
    </>
  );
}

export function HomeClient({ initialLocale }: { initialLocale: SupportedLocale }) {
  const [locale, setLocale] = useState<SupportedLocale>(initialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const changeLocale = (nextLocale: SupportedLocale) => {
    setLocale(nextLocale);
    writeLocaleCookie(nextLocale);
  };

  return <Site locale={locale} onLocale={changeLocale} />;
}
