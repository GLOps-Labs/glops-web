import type { MetadataRoute } from "next";
import { siteUrls } from "@/config/site";

const WEEKLY = "weekly" as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const homeEs = `${siteUrls.base}/`;
  return [
    {
      url: homeEs,
      lastModified: new Date(),
      changeFrequency: WEEKLY,
      priority: 1,
      alternates: {
        languages: { es: homeEs, en: siteUrls.homeEn },
      },
    },
    {
      url: siteUrls.homeEn,
      lastModified: new Date(),
      changeFrequency: WEEKLY,
      priority: 0.9,
      alternates: {
        languages: { es: homeEs, en: siteUrls.homeEn },
      },
    },
    {
      url: siteUrls.serviciosEs,
      lastModified: new Date(),
      changeFrequency: WEEKLY,
      priority: 0.8,
      alternates: {
        languages: { es: siteUrls.serviciosEs, en: siteUrls.serviciosEn },
      },
    },
    {
      url: siteUrls.serviciosEn,
      lastModified: new Date(),
      changeFrequency: WEEKLY,
      priority: 0.8,
      alternates: {
        languages: { es: siteUrls.serviciosEs, en: siteUrls.serviciosEn },
      },
    },
  ];
}
