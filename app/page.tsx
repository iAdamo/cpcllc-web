import type { Metadata } from "next";
import HomePage from "@/screens/homepage";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://companiescenter.com";

export const metadata: Metadata = {
  title: "Companiescenter | Find the Best Businesses in Your Area",
  description:
    "Discover top-rated service providers near you with Companiescenter. Explore reviews, ratings, and locations to make informed decisions.",
  alternates: { canonical: "/" },
};

// Organization + WebSite structured data — helps search engines show the brand
// and knowledge-panel details. Kept to fields we can state truthfully.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Companies Center",
      url: SITE_URL,
      image: `${SITE_URL}/opengraph-image`,
      description:
        "Marketplace connecting people with verified local service providers — plumbers, electricians, cleaners, movers and more.",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Companies Center",
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePage />
    </>
  );
}
