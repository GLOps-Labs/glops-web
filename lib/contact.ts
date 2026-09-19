import { z } from "zod";
import { siteConfig } from "@/config/site";
import type { SupportedLocale } from "@/config/site";
import { getDict } from "@/lib/dict";
import { CATEGORY_META } from "@/lib/services";
import type { ServiceCategory } from "@/lib/services";

export const NEED_MIN_LENGTH = 4;
export const NEED_MAX_LENGTH = 280;

export const WizardNeedSchema = z.object({
  need: z.string().trim().min(NEED_MIN_LENGTH).max(NEED_MAX_LENGTH),
});

export type NeedForm = z.infer<typeof WizardNeedSchema>;

export const WizardTypeSchema = z.object({
  category: z.enum(["rapido", "medio", "core"]),
});
export const WizardStateSchema = WizardNeedSchema.merge(WizardTypeSchema);
export type WizardState = z.infer<typeof WizardStateSchema>;

export type WizardCategory = ServiceCategory;

const CALCOM_NOTES_PARAM = "notes";
const QUERY_SEPARATOR = "?";
const QUERY_APPENDER = "&";

const LINE_BREAK = "\n";

/** Single mutation gate: the only builder for outbound links (SPEC §8 Cat2). */
export function buildContactLinks(state: WizardState, locale: SupportedLocale): {
  whatsapp: string;
  email: string;
  calcom: string;
} {
  const copy = getDict(locale).wizard.contact;
  const meta = CATEGORY_META[state.category];
  const pace = locale === "es" ? meta.titleEs : meta.titleEn;
  const time = locale === "es" ? meta.timeEs : meta.timeEn;
  const paceLine = `${pace} · ${time} · ${copy.fromWord} $${meta.floor}`;
  const [whatsappBase] = siteConfig.contact.whatsapp.split("?text=");
  const whatsapp = `${whatsappBase}?text=${encodeURIComponent(`${copy.whatsappLead} ${paceLine} — ${state.need}. ${copy.whatsappData}`)}`;
  const calcomBase = siteConfig.contact.calcom;
  const calcomJoiner = calcomBase.includes(QUERY_SEPARATOR) ? QUERY_APPENDER : QUERY_SEPARATOR;
  const calcomNotes = encodeURIComponent(
    [copy.notesTitle, `${copy.notesPace}: ${paceLine}`, `${copy.notesRequest}: ${state.need}`].join(LINE_BREAK),
  );
  const calcom = `${calcomBase}${calcomJoiner}${CALCOM_NOTES_PARAM}=${calcomNotes}`;
  const emailBody = [
    copy.emailGreeting,
    "",
    copy.emailWant,
    `${copy.emailPace} ${paceLine} — ${state.need}`,
    "",
    copy.detailsTitle,
    copy.nameRow,
    copy.phoneRow,
    copy.bestTimeRow,
    "",
    copy.thanksLine,
  ].join(LINE_BREAK);
  const email = `mailto:${siteConfig.brand.email}?subject=${encodeURIComponent(copy.emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  return { whatsapp, email, calcom };
}

export type ContactLinks = ReturnType<typeof buildContactLinks>;
