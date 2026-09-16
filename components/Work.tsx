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
        <h2 className="font-display font-bold" style={{ fontSize: "var(--section-size)" }}>{copy.title}</h2>
        <div className="mt-6 grid items-stretch gap-4 sm:grid-cols-3">
          {CATEGORY_ORDER.map((category) => {
            const meta = CATEGORY_META[category];
            const sample = servicesByCategory(category).slice(START_INDEX, SAMPLE_COUNT);
            const remaining = servicesByCategory(category).length - sample.length;
            return (
              <article key={category} className="flex h-full flex-col rounded-[20px] border border-line bg-bgsoft p-5">
                <h3 className="font-display text-xl font-bold">
                  {locale === "es" ? meta.titleEs : meta.titleEn}
                </h3>
                <p className="mt-1 text-sm font-bold text-accent">
                  {locale === "es" ? meta.timeEs : meta.timeEn} · {copy.from} ${meta.floor}
                </p>
                <ul className="mt-3 flex flex-col gap-1.5 text-sm text-muted">
                  {sample.map((service) => (
                    <li key={service.slug} className="flex items-center gap-1.5">
                      <ArrowIcon className="h-3.5 w-3.5 shrink-0 text-accent" />
                      {locale === "es" ? service.titleEs : service.titleEn}
                    </li>
                  ))}
                  {remaining > START_INDEX ? <li className="pl-5 text-xs">+{remaining} {copy.more}…</li> : null}
                </ul>
                <div className="mt-auto pt-4">
                  <Link
                    href={catalogPath}
                    className="inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accentink"
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
