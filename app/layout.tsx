import type { Metadata, Viewport } from "next";
import "./globals.css";
import AppChrome from "@/components/layout/AppChrome";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://companiescenter.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Companies Center — Find Trusted Local Service Providers",
    template: "%s | Companies Center",
  },
  description:
    "Hire verified plumbers, electricians, cleaners, movers and more near you. Compare reviews, ratings and locations — or grow your business by reaching new clients.",
  applicationName: "Companies Center",
  keywords: [
    "local services",
    "service providers",
    "plumbing",
    "electrical",
    "cleaning",
    "moving",
    "home services",
    "hire professionals",
  ],
  openGraph: {
    type: "website",
    siteName: "Companies Center",
    title: "Companies Center — Find Trusted Local Service Providers",
    description:
      "Hire verified plumbers, electricians, cleaners, movers and more near you. Compare reviews, ratings and locations.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Companies Center — Find Trusted Local Service Providers",
    description:
      "Hire verified local service providers near you. Compare reviews, ratings and locations.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#162660",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex-1 antialiased h-screen w-screen overflow-hidden overflow-y-scroll">
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
