export const siteConfig = {
  brand: {
    name: "GLOps Labs",
    email: "ops.glopslabs@gmail.com",
    github: "https://github.com/GLOps-Labs",
    instagram: "https://instagram.com/glopslabs",
  },
  contact: {
    calcom:
      process.env.NEXT_PUBLIC_CALCOM_URL ??
      "https://cal.com/TU-USUARIO/30min",
    whatsapp:
      process.env.NEXT_PUBLIC_WHATSAPP_URL ??
      "https://wa.me/58XXXXXXXXXX?text=Hola%20GLOps%20Labs%2C%20quiero%20un%20proyecto",
  },
  locales: { default: "es" as const, supported: ["es", "en"] as const },
} as const;

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://glopslabs.com";

export const siteUrls = {
  base: baseUrl,
  homeEn: `${baseUrl}/en`,
  serviciosEs: `${baseUrl}/servicios`,
  serviciosEn: `${baseUrl}/en/servicios`,
} as const;

export type SupportedLocale = (typeof siteConfig.locales.supported)[number];
