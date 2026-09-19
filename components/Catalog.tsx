import Link from "next/link";
import { getDict } from "@/lib/dict";
import type { SupportedLocale } from "@/config/site";
import { ArrowIcon } from "@/components/ArrowIcon";
import { CATEGORY_META, services } from "@/lib/services";
import type { ServiceCategory } from "@/lib/services";

const CATEGORY_ORDER: readonly ServiceCategory[] = ["rapido", "medio", "core"];
const SINGLE_CARD_COUNT = 1;

const CHIP_CLASS =
  "rounded-full border border-line bg-bg px-4 py-2 text-sm font-semibold shadow-sm transition hover:border-accent hover:text-accentdeep active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const SECTION_TITLE_CLASS =
  "text-center font-display text-xl font-bold leading-tight tracking-tight sm:text-left sm:text-2xl";
const PRIMARY_CTA_CLASS =
  "inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accentink shadow-sm transition hover:brightness-110 hover:shadow-md active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function Catalog({ locale, catalogPath }: { locale: SupportedLocale; catalogPath: string }) {
  const copy = getDict(locale).work;
  return (
    <>
      <nav aria-label={copy.paceNav} className="flex flex-wrap gap-2">
        {CATEGORY_ORDER.map((category) => {
          const meta = CATEGORY_META[category];
          const paceTitle = locale === "es" ? meta.titleEs : meta.titleEn;
          const paceTime = locale === "es" ? meta.timeEs : meta.timeEn;
          return (
            <a key={category} href={`#pace-${category}`} className={CHIP_CLASS}>
              {paceTitle} · {paceTime}
            </a>
          );
        })}
      </nav>
      {CATEGORY_ORDER.map((category) => {
        const meta = CATEGORY_META[category];
        const items = services.filter((service) => service.category === category);
        const paceTitle = locale === "es" ? meta.titleEs : meta.titleEn;
        const paceTime = locale === "es" ? meta.timeEs : meta.timeEn;
        const gridClass = items.length > SINGLE_CARD_COUNT ? "mt-4 grid gap-4 sm:grid-cols-2" : "mt-4 grid gap-4";
        return (
          <section key={category} id={`pace-${category}`} className="scroll-mt-20">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className={SECTION_TITLE_CLASS}>
                {paceTitle} · {paceTime} · {copy.from} ${meta.floor}
              </h2>
              <Link href={`${catalogPath}?pace=${category}#contact`} className={PRIMARY_CTA_CLASS}>
                {copy.choose} {paceTitle} <ArrowIcon className="h-4 w-4" />
              </Link>
            </div>
            <div className={gridClass}>
              {items.map((service) => (
                <article key={service.slug} className="rounded-[20px] border border-line bg-bgsoft p-5 transition hover:shadow-md sm:p-7">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-bold text-accentdeep">{service.slug}</span>
                    <span className="text-sm font-bold">
                      {copy.from} ${service.priceFrom}
                      {service.recurring ? copy.perMonth : null} · {service.time}
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-lg font-bold leading-snug sm:text-xl">
                    {locale === "es" ? service.titleEs : service.titleEn}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    <strong className="text-ink">{copy.includes}</strong> {locale === "es" ? service.includesEs : service.includesEn}
                  </p>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
