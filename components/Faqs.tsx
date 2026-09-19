"use client";

import { useState } from "react";
import { getDict } from "@/lib/dict";
import type { SupportedLocale } from "@/config/site";

export function Faqs({ locale }: { locale: SupportedLocale }) {
  const copy = getDict(locale).faqs;
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faqs" className="w-full bg-bgsoft">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-center font-display font-bold leading-tight tracking-tight sm:text-left" style={{ fontSize: "var(--section-size)" }}>{copy.title}</h2>
        <div className="mt-6 divide-y divide-line overflow-hidden rounded-[20px] border border-line bg-bg">
          {copy.items.map((item, index) => {
            const isOpen = open === index;
            const answerId = `faq-answer-${index}`;
            return (
              <div key={item.question}>
                <button
                  onClick={() => setOpen(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  className="flex min-h-16 w-full cursor-pointer items-center justify-between gap-4 p-5 text-left font-semibold transition hover:bg-bgsoft focus-visible:bg-bgsoft focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
                >
                  <span>{item.question}</span>
                  <span aria-hidden="true" className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-lg leading-none transition ${isOpen ? "border-accent bg-accent text-accentink" : "border-line text-accent"}`}>{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen ? <p id={answerId} className="px-5 pb-5 text-sm leading-6 text-muted">{item.answer}</p> : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
