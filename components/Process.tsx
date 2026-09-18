import { getDict } from "@/lib/dict";
import type { SupportedLocale } from "@/config/site";

export function Process({ locale }: { locale: SupportedLocale }) {
  const copy = getDict(locale).process;
  return (
    <section id="process" className="w-full bg-bgsoft">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-center font-display font-bold sm:text-left" style={{ fontSize: "var(--section-size)" }}>{copy.title}</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {copy.steps.map((step, index) => (
            <li key={step.code} className="rounded-[20px] border border-line bg-bg p-5">
              <div className="text-sm font-bold text-accentdeep">{step.code}</div>
              <div className="mt-1 font-semibold">{step.label}</div>
              <p className="mt-1 text-sm text-muted">{copy.notes[index]}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
