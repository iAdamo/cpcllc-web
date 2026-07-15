import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://companiescenter.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/settings", "/onboarding", "/auth", "/favorites"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
