import type { MetadataRoute } from "next";
import config from "@/config/portfolio.config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${config.meta.siteUrl}/sitemap.xml`,
  };
}
