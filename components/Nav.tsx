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
      <div className="mx-auto flex max-w-5xl items-center justify-between px-3 py-2 sm:px-4 sm:py-3">
        <a href="#top" aria-label="GLOps Labs — top" className="flex w-fit items-center gap-1.5 rounded-full bg-brand py-1 pl-1 pr-3 shadow-md transition hover:brightness-110 active:scale-95 sm:py-1.5 sm:pl-1.5 sm:pr-4 sm:gap-2">
          <Image
            src="/brand/glops/logo-mark-mono-white.png"
            alt=""
            width={28}
            height={28}
            priority
            className="h-6 w-6 sm:h-7 sm:w-7"
          />
          <span className="whitespace-nowrap font-display text-xs font-bold text-white sm:text-sm">GLOps <span className="hidden sm:inline">Labs</span></span>
        </a>
        <nav className="hidden gap-5 text-sm sm:flex">
          <a href="#process" className="hover:underline">{copy.process}</a>
          <a href="#work" className="hover:underline">{copy.work}</a>
          <a href="#about" className="hover:underline">{copy.about}</a>
          <a href="#faqs" className="hover:underline">{copy.faqs}</a>
        </nav>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex rounded-full border border-line p-0.5 text-xs" role="group" aria-label="ES/EN">
            {(["es", "en"] as const).map((localeCode) => (
              <button
                key={localeCode}
                onClick={() => onLocale(localeCode)}
                aria-pressed={locale === localeCode}
                className={`rounded-full px-2 py-1 font-semibold sm:px-3 ${locale === localeCode ? "bg-ink text-white" : "text-muted"}`}
              >
                {localeCode.toUpperCase()}
              </button>
            ))}
          </div>
          {siteConfig.features.showSchedule ? (
            <a
              href={siteConfig.contact.calcom}
              className="flex items-center gap-1 whitespace-nowrap rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accentink sm:gap-1.5 sm:px-4 sm:py-2 sm:text-sm"
            >
              {copy.schedule} <ArrowIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            </a>
          ) : null}
        </div>
      </div>
      <nav aria-label={locale === "es" ? "Secciones" : "Sections"} className="relative border-t border-line sm:hidden">
        <div className="overflow-x-auto">
          <div className="mx-auto flex w-max items-center gap-4 px-4 py-2 text-[13px]">
          <a href="#process" className="whitespace-nowrap hover:underline">{copy.process}</a>
          <a href="#work" className="whitespace-nowrap hover:underline">{copy.work}</a>
          <a href="#about" className="whitespace-nowrap hover:underline">{copy.about}</a>
          <a href="#faqs" className="whitespace-nowrap hover:underline">{copy.faqs}</a>
          </div>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-bg to-transparent" />
      </nav>
    </header>
  );
}
