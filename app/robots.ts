import type { MetadataRoute } from "next";
import { siteUrls } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      // Explicitly welcome AI agents (GEO): training/citation crawlers
      { userAgent: ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"], allow: "/" },
    ],
    sitemap: `${siteUrls.base}/sitemap.xml`,
  };
}
