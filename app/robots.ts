import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/account", "/account/", "/admin", "/admin/", "/api/", "/book/confirmation", "/login", "/signup"],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
