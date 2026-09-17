import type { SupportedLocale } from "@/config/site";

export const dict = {
  es: {
    nav: { process: "Proceso", work: "Servicios", about: "Nosotros", faqs: "FAQs", schedule: "Agendar" },
    hero: {
      h1a: "Webs profesionales",
      accent: "listas en días",
      h1b: "a precio cerrado",
      sub: "Landings, sitios corporativos y menús QR para PYMEs y profesionales de LatAm: sabes qué recibes y cuánto pagas antes de empezar.",
      schedule: "Agendar llamada",
      whatsapp: "WhatsApp",
    },
    process: {
      title: "Proceso",
      steps: [
        { code: "01", label: "Llamada inicial" },
        { code: "02", label: "Contrato e invoice" },
        { code: "03", label: "Construcción" },
        { code: "04", label: "Launch y saldo" },
      ],
      notes: [
        "Metas claras por formulario de 15 min o llamada, como prefieras.",
        "Entregables, deadlines, método de pago y bienvenida por escrito. Nada por hecho hasta la firma.",
        "Desarrollo con revisiones y avances antes de cada entrega.",
        "Deploy final al cancelar el saldo.",
      ],
    },
    work: {
      title: "Servicios",
      from: "desde",
      details: "Ver servicios",
      more: "más",
    },
    faqs: {
      title: "FAQs",
      items: [
        { question: "¿Cómo se paga?", answer: "50% para iniciar por Payoneer, Facebank o Binance, con invoice y método de pago claros desde el día uno. El resto antes del deploy o la migración a tu dominio." },
        { question: "¿Cuándo empieza a correr el tiempo?", answer: "Cuando entregas textos, fotos y logo. Si te falta algo, se coordina en la llamada inicial y el tiempo corre desde ese acuerdo." },
        { question: "¿Tienen mantenimiento?", answer: "Plan desde $50/mes: respaldos semanales, updates, monitoreo uptime y 1 hora de ajustes menores al mes." },
        { question: "¿Trabajan fuera de Venezuela?", answer: "Sí: base en Venezuela y operación remota en toda LatAm. Cobramos por adelantado y entregamos en staging con password hasta el pago final." },
      ],
    },
    wizard: {
      title: "Pide tu proyecto",
      step1: "Cuéntanos qué necesitas",
      step2: "Elige el ritmo",
      step3: "Elige canal",
      next: "Siguiente",
      back: "Atrás",
      needPlaceholder: "Ej: landing para mi negocio o consulta con botón de WhatsApp…",
      budgetNote: "Precio y tiempo fijos por checklist. El conteo corre desde que entregas textos, fotos y logo, o desde que lo coordinemos.",
      schedule: "Agendar",
      whatsapp: "WhatsApp",
      email: "Email",
    },
    footer: { built: "built by GLOps Labs", rights: "Precio cerrado · 50% para iniciar." },
  },
  en: {
    nav: { process: "Process", work: "Services", about: "About", faqs: "FAQs", schedule: "Schedule" },
    hero: {
      h1a: "Professional websites",
      accent: "ready in days",
      h1b: "at a fixed price",
      sub: "Landings, corporate sites and QR menus for LatAm SMBs: know what you get and what you pay before we start.",
      schedule: "Schedule a call",
      whatsapp: "WhatsApp",
    },
    process: {
      title: "Process",
      steps: [
        { code: "01", label: "Intro call" },
        { code: "02", label: "Contract & invoice" },
        { code: "03", label: "Build" },
        { code: "04", label: "Launch & balance" },
      ],
      notes: [
        "Clear goals via 15-min form or call, your choice.",
        "Deliverables, deadlines, payment method and welcome doc in writing. Nothing counts until signed.",
        "Development with reviews and progress before each delivery.",
        "Final deploy once the balance is paid.",
      ],
    },
    work: {
      title: "Services",
      from: "from",
      details: "See services",
      more: "more",
    },
    faqs: {
      title: "FAQs",
      items: [
        { question: "How do payments work?", answer: "50% to start via Payoneer, Facebank or Binance, with invoice and payment method clear from day one. The balance before deploy or migration to your domain." },
        { question: "When does the clock start?", answer: "When you deliver copy, photos and logo. If anything is missing, it gets sorted on the intro call and the clock starts from that agreement." },
        { question: "Do you offer maintenance?", answer: "Care plan from $50/mo: weekly backups, updates, uptime monitoring and 1 hour of minor tweaks monthly." },
        { question: "Do you work outside Venezuela?", answer: "Yes: based in Venezuela, operating remotely across LatAm. We charge upfront and deliver on password staging until final payment." },
      ],
    },
    wizard: {
      title: "Request your project",
      step1: "Tell us what you need",
      step2: "Pick the pace",
      step3: "Pick a channel",
      next: "Next",
      back: "Back",
      needPlaceholder: "E.g.: landing for my business with a WhatsApp button…",
      budgetNote: "Fixed price and timeline per checklist. The clock starts when you deliver copy, photos and logo, or from when we coordinate it.",
      schedule: "Schedule",
      whatsapp: "WhatsApp",
      email: "Email",
    },
    footer: { built: "built by GLOps Labs", rights: "Fixed scope · 50% to start." },
  },
} as const;

export type Dict = (typeof dict)[SupportedLocale];
export function getDict(locale: SupportedLocale): Dict {
  return dict[locale];
}
