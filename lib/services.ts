import { z } from "zod";

export const ServiceCategorySchema = z.enum(["rapido", "medio", "core"]);
export type ServiceCategory = z.infer<typeof ServiceCategorySchema>;

export const ServiceSchema = z.object({
  slug: z.string(),
  category: ServiceCategorySchema,
  priceFrom: z.number(),
  time: z.string(),
  titleEs: z.string(),
  titleEn: z.string(),
  includesEs: z.string(),
  includesEn: z.string(),
  recurring: z.boolean(),
});
export type Service = z.infer<typeof ServiceSchema>;

export const CATEGORY_META: Readonly<
  Record<ServiceCategory, { floor: number; titleEs: string; titleEn: string; timeEs: string; timeEn: string }>
> = {
  rapido: { floor: 50, titleEs: "Rápido", titleEn: "Fast", timeEs: "48-72h", timeEn: "48-72h" },
  medio: { floor: 200, titleEs: "Medio", titleEn: "Standard", timeEs: "3-5 días", timeEn: "3-5 days" },
  core: { floor: 350, titleEs: "Core", titleEn: "Core", timeEs: "5-7 días", timeEn: "5-7 days" },
};

export const services: readonly Service[] = [
  {
    slug: "menu-qr",
    category: "rapido",
    priceFrom: 150,
    time: "48-72h",
    titleEs: "Menú / Catálogo QR interactivo",
    titleEn: "Interactive QR menu & catalog",
    includesEs: "PWA ligera con filtros por categoría y pedido por WhatsApp con total.",
    includesEn: "Lightweight PWA with category filters and WhatsApp ordering with total.",
    recurring: false,
  },
  {
    slug: "linkbio",
    category: "rapido",
    priceFrom: 120,
    time: "48h",
    titleEs: "Portafolio / Link-in-bio premium",
    titleEn: "Premium portfolio / link-in-bio",
    includesEs: "Dominio propio, bio, servicios y botón para agendar cita.",
    includesEn: "Own domain, bio, services and appointment booking button.",
    recurring: false,
  },
  {
    slug: "email",
    category: "rapido",
    priceFrom: 100,
    time: "24-48h",
    titleEs: "Email corporativo + firma HTML",
    titleEn: "Corporate email + HTML signature",
    includesEs: "Google Workspace, Zoho o MXRoute + firma con logo y WhatsApp.",
    includesEn: "Google Workspace, Zoho or MXRoute + signature with logo and WhatsApp.",
    recurring: false,
  },
  {
    slug: "cuidado",
    category: "rapido",
    priceFrom: 50,
    time: "mensual",
    titleEs: "Mantenimiento mensual (SLA)",
    titleEn: "Monthly care plan (SLA)",
    includesEs: "Respaldos, updates, monitoreo uptime y 1h de ajustes al mes.",
    includesEn: "Backups, updates, uptime monitoring and 1h of tweaks monthly.",
    recurring: true,
  },
  {
    slug: "landing",
    category: "medio",
    priceFrom: 250,
    time: "3-5 días",
    titleEs: "Landing de alta conversión",
    titleEn: "High-conversion landing page",
    includesEs: "Next.js/Tailwind o Astro + formulario/WhatsApp + SEO básico + CRM.",
    includesEn: "Next.js/Tailwind or Astro + form/WhatsApp + basic SEO + CRM.",
    recurring: false,
  },
  {
    slug: "reservas",
    category: "medio",
    priceFrom: 200,
    time: "3-4 días",
    titleEs: "Sistema de reservas integrado",
    titleEn: "Integrated booking system",
    includesEs: "Calendly, Cal.com o SimplyBook: el cliente reserva o paga solo.",
    includesEn: "Calendly, Cal.com or SimplyBook: clients book or pay alone.",
    recurring: false,
  },
  {
    slug: "migracion",
    category: "medio",
    priceFrom: 250,
    time: "3-5 días",
    titleEs: "Migración & rescate web",
    titleEn: "Website migration & rescue",
    includesEs: "De WordPress caído o lento a estático impecable en Vercel/Netlify.",
    includesEn: "From broken or slow WordPress to flawless static on Vercel/Netlify.",
    recurring: false,
  },
  {
    slug: "funnel",
    category: "medio",
    priceFrom: 400,
    time: "4-6 días",
    titleEs: "Funnel + chatbot de leads",
    titleEn: "Lead funnel + chatbot",
    includesEs: "Landing + bot de WhatsApp/Telegram que califica y agenda.",
    includesEn: "Landing + WhatsApp/Telegram bot that qualifies and books.",
    recurring: false,
  },
  {
    slug: "optimizacion",
    category: "medio",
    priceFrom: 200,
    time: "3-4 días",
    titleEs: "Optimización & Core Web Vitals",
    titleEn: "Speed optimization & Core Web Vitals",
    includesEs: "Auditoría + refactor: imágenes, caché, scripts, 90+ en Speed.",
    includesEn: "Audit + refactor: images, cache, scripts, 90+ on Speed.",
    recurring: false,
  },
  {
    slug: "corporativo",
    category: "core",
    priceFrom: 500,
    time: "5-7 días",
    titleEs: "Sitio B2B corporativo",
    titleEn: "Corporate B2B website",
    includesEs: "4 secciones fijas + blog o catálogo estático, sin backend pesado.",
    includesEn: "4 fixed sections + static blog or catalog, no heavy backend.",
    recurring: false,
  },
  {
    slug: "woocommerce",
    category: "medio",
    priceFrom: 350,
    time: "4-6 días",
    titleEs: "Tienda WooCommerce",
    titleEn: "WooCommerce store",
    includesEs: "Catálogo, carrito, pago y envíos configurados sobre WordPress.",
    includesEn: "Catalog, cart, payments and shipping configured on WordPress.",
    recurring: false,
  },
] as const;

export function servicesByCategory(category: ServiceCategory): Service[] {
  return services.filter((service) => service.category === category);
}
