import { z } from "zod";
import { siteConfig } from "@/config/site";
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

/** Single mutation gate: the only builder for outbound links (SPEC §8 Cat2). */
export function buildContactLinks(state: WizardState): {
  whatsapp: string;
  email: string;
  calcom: string;
} {
  const meta = CATEGORY_META[state.category];
  const summary = `${state.category} desde $${meta.floor} — ${state.need}`;
  const [whatsappBase] = siteConfig.contact.whatsapp.split("?text=");
  const whatsapp = `${whatsappBase}?text=${encodeURIComponent(`Hola GLOps Labs, quiero pedir: ${summary}. Mis datos — Nombre: Teléfono:`)}`;
  const emailSubject = "Nuevo proyecto web — GLOps Labs";
  const emailBody = [
    "Hola GLOps Labs,",
    "",
    "Quiero pedir este proyecto:",
    `Ritmo: ${summary}`,
    "",
    "Mis datos:",
    "Nombre:",
    "Teléfono:",
    "Mejor horario:",
    "",
    "Gracias.",
  ].join("\n");
  const email = `mailto:ops.glopslabs+beta1@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  return { whatsapp, email, calcom: siteConfig.contact.calcom };
}

export type ContactLinks = ReturnType<typeof buildContactLinks>;
