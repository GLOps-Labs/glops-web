"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useForm } from "react-hook-form";
import type { UseFormRegister } from "react-hook-form";
import { getDict } from "@/lib/dict";
import type { Dict } from "@/lib/dict";
import type { SupportedLocale } from "@/config/site";
import { NEED_MAX_LENGTH, NEED_MIN_LENGTH, WizardNeedSchema, buildContactLinks } from "@/lib/contact";
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

function resolveLinks(need: string, category: WizardCategory, ready: boolean): ContactLinks | null {
  if (!ready) return null;
  return buildContactLinks({ need: need || "…", category });
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
          className="flex items-center gap-1.5 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accentink disabled:opacity-40"
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
              className={`rounded-full border px-4 py-2 text-sm font-semibold ${category === code ? "border-accent bg-accent/10 text-accent" : "border-line bg-bg"}`}
            >
              {locale === "es" ? meta.titleEs : meta.titleEn} · {locale === "es" ? meta.timeEs : meta.timeEn} · ${meta.floor}+
            </button>
          );
        })}
      </div>
      <p className="text-sm text-muted">{copy.budgetNote}</p>
      <div className="flex gap-2">
        <button onClick={onBack} className="rounded-full border border-ink px-5 py-2.5 text-sm font-semibold">
          {copy.back}
        </button>
        <button onClick={onNext} className="flex items-center gap-1.5 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accentink">
          {copy.next} <ArrowIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function StepChannel({
  copy,
  links,
  onBack,
}: {
  copy: WizardCopy;
  links: ContactLinks | null;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <span className="font-semibold">{copy.step3}</span>
      {links ? (
        <div className="flex flex-wrap gap-3">
          <a href={links.calcom} className="flex items-center gap-1.5 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accentink">
            {copy.schedule} <ArrowIcon className="h-4 w-4" />
          </a>
          <a href={links.whatsapp} className="rounded-full border border-ink px-6 py-3 text-sm font-semibold">
            {copy.whatsapp}
          </a>
          <a href={links.email} className="rounded-full border border-ink px-6 py-3 text-sm font-semibold">
            {copy.email}
          </a>
        </div>
      ) : null}
      <div>
        <button onClick={onBack} className="rounded-full border border-ink px-5 py-2.5 text-sm font-semibold">
          {copy.back}
        </button>
      </div>
    </div>
  );
}

export function Wizard({ locale }: { locale: SupportedLocale }) {
  const copy = getDict(locale).wizard;
  const [step, setStep] = useState<WizardStep>(WizardStep.Need);
  const [category, setCategory] = useState<WizardCategory>("rapido");
  const { register, getValues, formState } = useForm<NeedForm>({ mode: "onChange", defaultValues: { need: "" } });

  const rawNeed = getValues("need") ?? "";
  const needValid = formState.isValid;
  const links = resolveLinks(rawNeed, category, needValid || step === WizardStep.Channel);

  return (
    <section id="contact" className="w-full bg-bg">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="font-display font-bold" style={{ fontSize: "var(--section-size)" }}>{copy.title}</h2>
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
          {step === WizardStep.Channel ? <StepChannel copy={copy} links={links} onBack={() => setStep(WizardStep.Budget)} /> : null}
        </div>
      </div>
    </section>
  );
}
