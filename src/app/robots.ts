import type { MetadataRoute } from "next";
import config from "@/config/portfolio.config";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${config.meta.siteUrl}/sitemap.xml`,
  };
}
