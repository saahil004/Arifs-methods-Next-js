import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin",
    },
    // TODO: replace with the real production domain once one is chosen
    sitemap: "https://example.com/sitemap.xml",
  };
}
