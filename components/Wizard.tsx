"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import type { UseFormRegister } from "react-hook-form";
import { getDict } from "@/lib/dict";
import type { Dict } from "@/lib/dict";
import { siteConfig } from "@/config/site";
import type { SupportedLocale } from "@/config/site";
import { NEED_MAX_LENGTH, NEED_MIN_LENGTH, WizardNeedSchema, buildContactLinks, resolvePaceParam } from "@/lib/contact";
import type { ContactLinks, NeedForm, WizardCategory } from "@/lib/contact";
import { CATEGORY_META } from "@/lib/services";
import type { ServiceCategory } from "@/lib/services";
import { ArrowIcon } from "@/components/ArrowIcon";

enum WizardStep {
  Need = "need",
  Budget = "budget",
  Channel = "channel",
}

type WizardCopy = Dict["wizard"];

const CATEGORIES: readonly ServiceCategory[] = ["rapido", "medio", "core"];
const NEED_INPUT_ID = "wizard-need";

function resolveLinks(need: string, category: WizardCategory, locale: SupportedLocale, ready: boolean): ContactLinks | null {
  if (!ready) return null;
  return buildContactLinks({ need: need || "…", category }, locale);
}

function StepNeed({
  copy,
  register,
  blocked,
  validate,
  onNext,
}: {
  copy: WizardCopy;
  register: UseFormRegister<NeedForm>;
  blocked: boolean;
  validate: () => boolean;
  onNext: () => void;
}) {
  const submitNeed = (event: FormEvent): void => {
    event.preventDefault();
    if (validate()) onNext();
  };
  return (
    <form onSubmit={submitNeed} className="flex flex-col gap-4">
      <label htmlFor={NEED_INPUT_ID} className="font-semibold">{copy.step1}</label>
      <input
        id={NEED_INPUT_ID}
        {...register("need", { required: true, minLength: NEED_MIN_LENGTH, maxLength: NEED_MAX_LENGTH })}
        maxLength={NEED_MAX_LENGTH}
        placeholder={copy.needPlaceholder}
        className="w-full rounded-[20px] border border-line bg-bg px-4 py-3 text-sm outline-none focus:border-accent"
      />
      <div>
        <button
          type="submit"
          disabled={blocked}
          className="flex items-center gap-1.5 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accentink shadow-sm transition hover:brightness-110 hover:shadow-md active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-40 disabled:hover:brightness-100 disabled:hover:shadow-sm disabled:active:scale-100"
        >
          {copy.next} <ArrowIcon className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}

function StepCategory({
  copy,
  locale,
  category,
  onCategory,
  onBack,
  onNext,
}: {
  copy: WizardCopy;
  locale: SupportedLocale;
  category: WizardCategory;
  onCategory: (code: WizardCategory) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <span className="font-semibold">{copy.step2}</span>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((code) => {
          const meta = CATEGORY_META[code];
          return (
            <button
              key={code}
              onClick={() => onCategory(code)}
              aria-pressed={category === code}
              className={`rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition hover:border-accent hover:text-accentdeep active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${category === code ? "border-accent bg-accent/10 text-accentdeep" : "border-line bg-bg"}`}
            >
              {locale === "es" ? meta.titleEs : meta.titleEn} · {locale === "es" ? meta.timeEs : meta.timeEn} · ${meta.floor}+
            </button>
          );
        })}
      </div>
      <p className="text-sm leading-6 text-muted">{copy.budgetNote}</p>
      <div className="flex flex-wrap gap-2">
        <button onClick={onBack} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg px-5 py-2.5 text-sm font-semibold shadow-sm transition hover:border-ink hover:bg-ink hover:text-white active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
          <ArrowIcon flip className="h-4 w-4" /> {copy.back}
        </button>
        <button onClick={onNext} className="flex items-center gap-1.5 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accentink shadow-sm transition hover:brightness-110 hover:shadow-md active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
          {copy.next} <ArrowIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function StepChannel({
  copy,
  locale,
  need,
  category,
  links,
  onBack,
}: {
  copy: WizardCopy;
  locale: SupportedLocale;
  need: string;
  category: WizardCategory;
  links: ContactLinks | null;
  onBack: () => void;
}) {
  const meta = CATEGORY_META[category];
  const pace = locale === "es" ? meta.titleEs : meta.titleEn;
  return (
    <div className="flex flex-col gap-4">
      <span className="font-semibold">{copy.step3}</span>
      <div className="rounded-2xl border border-line bg-bg p-4 text-sm leading-6">
        <p className="font-semibold">{copy.summary}</p>
        <p className="mt-1 text-muted">{need || "…"} · {pace} · ${meta.floor}+</p>
      </div>
      {links ? (
        <div className="flex flex-wrap gap-3">
          {siteConfig.features.showSchedule ? (
            <a href={links.calcom} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accentink shadow-sm transition hover:brightness-110 hover:shadow-md active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
              {copy.schedule} <ArrowIcon className="h-4 w-4" />
            </a>
          ) : null}
          {siteConfig.features.showWhatsapp ? (
            <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className="rounded-full border border-ink px-6 py-3 text-sm font-semibold transition hover:bg-ink hover:text-white active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
              {copy.whatsapp}
            </a>
          ) : null}
          <a href={links.email} target="_blank" rel="noopener noreferrer" className="rounded-full border border-ink px-6 py-3 text-sm font-semibold transition hover:bg-ink hover:text-white active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
            {copy.email}
          </a>
        </div>
      ) : null}
      {siteConfig.features.showSchedule ? <p className="text-sm leading-6 text-muted">{copy.scheduleNote}</p> : null}
      <div>
        <button onClick={onBack} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg px-5 py-2.5 text-sm font-semibold shadow-sm transition hover:border-ink hover:bg-ink hover:text-white active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
          <ArrowIcon flip className="h-4 w-4" /> {copy.back}
        </button>
      </div>
    </div>
  );
}

export function Wizard({ locale }: { locale: SupportedLocale }) {
  const copy = getDict(locale).wizard;
  const paceParam = useSearchParams().get("pace");
  const [step, setStep] = useState<WizardStep>(WizardStep.Need);
  const [category, setCategory] = useState<WizardCategory>(() => resolvePaceParam(paceParam));
  const [appliedPace, setAppliedPace] = useState<string | null>(paceParam);
  const { register, getValues, formState } = useForm<NeedForm>({ mode: "onChange", defaultValues: { need: "" } });

  if (paceParam !== appliedPace) {
    setAppliedPace(paceParam);
    setCategory(resolvePaceParam(paceParam));
  }

  const rawNeed = getValues("need") ?? "";
  const needValid = formState.isValid;
  const links = resolveLinks(rawNeed, category, locale, needValid || step === WizardStep.Channel);

  return (
    <section id="contact" className="w-full bg-bg">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-center font-display font-bold leading-tight tracking-tight sm:text-left" style={{ fontSize: "var(--section-size)" }}>{copy.title}</h2>
        <div className="mt-6 rounded-[20px] border border-line bg-bgsoft p-5 sm:p-8">
          {step === WizardStep.Need ? (
            <StepNeed
              copy={copy}
              register={register}
              blocked={!needValid}
              validate={() => WizardNeedSchema.safeParse({ need: getValues("need") }).success}
              onNext={() => setStep(WizardStep.Budget)}
            />
          ) : null}
          {step === WizardStep.Budget ? (
            <StepCategory
              copy={copy}
              locale={locale}
              category={category}
              onCategory={setCategory}
              onBack={() => setStep(WizardStep.Need)}
              onNext={() => setStep(WizardStep.Channel)}
            />
          ) : null}
          {step === WizardStep.Channel ? <StepChannel copy={copy} locale={locale} need={rawNeed} category={category} links={links} onBack={() => setStep(WizardStep.Budget)} /> : null}
        </div>
      </div>
    </section>
  );
}
