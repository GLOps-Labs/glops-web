"use client";

import { getDict } from "@/lib/dict";
import { siteConfig } from "@/config/site";
import type { SupportedLocale } from "@/config/site";
import { ArrowIcon } from "@/components/ArrowIcon";

export function Hero({ locale }: { locale: SupportedLocale }) {
  const copy = getDict(locale).hero;
  return (
    <section id="top" className="w-full bg-bg">
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-5 px-4 py-14 sm:py-20">
        <h1
          className="font-display font-bold leading-[1.05] tracking-tight"
          style={{ fontSize: "var(--hero-size)" }}
        >
          {copy.h1a} <span className="text-accent underline decoration-accent/40 underline-offset-8">{copy.accent}</span>{" "}
          {copy.h1b}
        </h1>
        <p className="max-w-xl text-base text-muted sm:text-lg">{copy.sub}</p>
        <div className="flex flex-wrap gap-3">
          {siteConfig.features.showSchedule ? (
            <a
              href={siteConfig.contact.calcom}
              className="flex items-center gap-1.5 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accentink"
            >
              {copy.schedule} <ArrowIcon className="h-4 w-4" />
            </a>
          ) : null}
          {siteConfig.features.showWhatsapp ? (
            <a
              href={siteConfig.contact.whatsapp}
              className="rounded-full border border-ink px-6 py-3 text-sm font-semibold"
            >
              {copy.whatsapp}
            </a>
          ) : null}
          <a
            href={`mailto:${siteConfig.brand.email}`}
            className="rounded-full border border-ink px-6 py-3 text-sm font-semibold"
          >
            {copy.email}
          </a>
        </div>
        <p className="mt-3 text-sm text-muted">{copy.scarcity}</p>
      </div>
    </section>
  );
}
