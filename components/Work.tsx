import Link from "next/link";
import { CATEGORY_META, servicesByCategory } from "@/lib/services";
import type { ServiceCategory } from "@/lib/services";
import { getDict } from "@/lib/dict";
import type { SupportedLocale } from "@/config/site";
import { ArrowIcon } from "@/components/ArrowIcon";

const CATEGORY_ORDER: readonly ServiceCategory[] = ["rapido", "medio", "core"];
const SAMPLE_COUNT = 3;
const START_INDEX = 0;

export function Work({ locale }: { locale: SupportedLocale }) {
  const copy = getDict(locale).work;
  const catalogPath = locale === "es" ? "/servicios" : "/en/servicios";
  return (
    <section id="work" className="w-full bg-bg">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-center font-display font-bold leading-tight tracking-tight sm:text-left" style={{ fontSize: "var(--section-size)" }}>{copy.title}</h2>
        <div className="mt-6 grid items-stretch gap-4 sm:grid-cols-3">
          {CATEGORY_ORDER.map((category) => {
            const meta = CATEGORY_META[category];
            const sample = servicesByCategory(category).slice(START_INDEX, SAMPLE_COUNT);
            const remaining = servicesByCategory(category).length - sample.length;
            return (
              <article key={category} className="flex h-full flex-col items-center rounded-[20px] border border-line bg-bgsoft p-5 text-center sm:items-stretch sm:text-left">
                <h3 className="font-display text-lg font-bold leading-snug sm:text-xl">
                  {locale === "es" ? meta.titleEs : meta.titleEn}
                </h3>
                <p className="mt-1 text-sm font-bold text-accentdeep">
                  {locale === "es" ? meta.timeEs : meta.timeEn} · {copy.from} ${meta.floor}
                </p>
                <ul className="mt-3 flex flex-col items-center gap-1.5 text-sm leading-6 text-muted sm:items-stretch">
                  {sample.map((service) => (
                    <li key={service.slug} className="flex items-center justify-center gap-1.5 sm:justify-start">
                      <ArrowIcon className="h-3.5 w-3.5 shrink-0 text-accent" />
                      {locale === "es" ? service.titleEs : service.titleEn}
                    </li>
                  ))}
                  {remaining > START_INDEX ? <li className="text-xs sm:pl-5">+{remaining} {copy.more}…</li> : null}
                </ul>
                <div className="mt-auto flex justify-center pt-4 sm:justify-start">
                  <Link
                    href={catalogPath}
                    className="inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accentink shadow-sm transition hover:brightness-110 hover:shadow-md active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {copy.details} <ArrowIcon className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
