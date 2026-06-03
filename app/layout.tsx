"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import StyledJsxRegistry from "./registry";
import { TranslationProvider } from "@/context/TranslationContext";
import NavBar from "@/components/layout/NavBar";
// import PreFooter from "@/components/layout/PreFooter";
import Footer from "@/components/layout/Footer";
import { usePathname } from "next/navigation";
import { Providers } from "./providers";
import { SessionProvider } from "@/context/SessionContext";
// import { MapProvider } from "@/context/MapContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const hideLayoutForRoutes = [
    "/onboarding",
    "/admin",
    "/privacy-policy",
    "/terms-of-service",
  ];

  const hideLayoutForRoutesRegex = hideLayoutForRoutes.map(
    (route) => new RegExp(`^${route}(?:/|$)`)
  );
  const shouldHideLayout = hideLayoutForRoutesRegex.some((regex) =>
    regex.test(pathname)
  );

  return (
    <html lang="en">
      <body
        className={`flex-1  antialiased h-screen w-screen overflow-hidden overflow-y-scroll`}
      >
        <StyledJsxRegistry>
          <SessionProvider>
            <Providers>
              <GluestackUIProvider mode="light">
                <TranslationProvider>
                  {!shouldHideLayout && <NavBar />}
                  {children}
                  {/* {!shouldHideLayout && <PreFooter />} */}
                  {!shouldHideLayout && <Footer />}
                </TranslationProvider>
              </GluestackUIProvider>
            </Providers>
          </SessionProvider>
        </StyledJsxRegistry>
      </body>
    </html>
  );
}
