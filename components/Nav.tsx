"use client";

import Image from "next/image";
import type { SupportedLocale } from "@/config/site";
import { ArrowIcon } from "@/components/ArrowIcon";
import { getDict } from "@/lib/dict";
import { siteConfig } from "@/config/site";

export function Nav({
  locale,
  onLocale,
}: {
  locale: SupportedLocale;
  onLocale: (nextLocale: SupportedLocale) => void;
}) {
  const copy = getDict(locale).nav;
  return (
    <header className="sticky top-0 z-50 w-full border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <a href="#top" aria-label="GLOps Labs — top" className="flex items-center gap-2 rounded-full bg-brand py-1.5 pl-1.5 pr-4 shadow-md transition hover:brightness-110 active:scale-95">
          <Image
            src="/brand/glops/logo-mark-mono-white.png"
            alt=""
            width={28}
            height={28}
            priority
          />
          <span className="text-sm font-bold text-white">GLOps Labs</span>
        </a>
        <nav className="hidden gap-5 text-sm sm:flex">
          <a href="#process" className="hover:underline">{copy.process}</a>
          <a href="#work" className="hover:underline">{copy.work}</a>
          <a href="#about" className="hover:underline">{copy.about}</a>
          <a href="#faqs" className="hover:underline">{copy.faqs}</a>
        </nav>
        <div className="flex items-center gap-2">
          <div className="flex rounded-full border border-line p-0.5 text-xs" role="group" aria-label="ES/EN">
            {(["es", "en"] as const).map((localeCode) => (
              <button
                key={localeCode}
                onClick={() => onLocale(localeCode)}
                aria-pressed={locale === localeCode}
                className={`rounded-full px-3 py-1 font-semibold ${locale === localeCode ? "bg-ink text-white" : "text-muted"}`}
              >
                {localeCode.toUpperCase()}
              </button>
            ))}
          </div>
          <a
            href={siteConfig.contact.calcom}
            className="flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accentink"
          >
            {copy.schedule} <ArrowIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
