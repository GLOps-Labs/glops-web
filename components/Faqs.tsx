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
        <h2 className="font-display font-bold" style={{ fontSize: "var(--section-size)" }}>{copy.title}</h2>
        <div className="mt-6 divide-y divide-line rounded-[20px] border border-line bg-bg">
          {copy.items.map((item, index) => (
            <div key={item.question} className="p-5">
              <button
                onClick={() => setOpen(open === index ? null : index)}
                aria-expanded={open === index}
                className="flex w-full items-center justify-between text-left font-semibold"
              >
                {item.question}
                <span className="text-accent">{open === index ? "−" : "+"}</span>
              </button>
              {open === index ? <p className="mt-2 text-sm text-muted">{item.answer}</p> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
