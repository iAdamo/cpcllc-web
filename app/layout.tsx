"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import StyledJsxRegistry from "./registry";
import { TranslationProvider } from "@/context/TranslationContext";
import NavBar from "@/components/layout/NavBar";
// import PreFooter from "@/components/layout/PreFooter";
import Footer from "@/components/layout/Footer";
import GlobalLoadingOverlay from "@/components/GlobalLoadingOverlay";
import MobileGate from "@/components/MobileGate";
import { usePathname } from "next/navigation";
import { Providers } from "./providers";
import { SessionProvider } from "@/context/SessionContext";
// import { MapProvider } from "@/context/MapContext";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const hideNavRoutes = [
    "/onboarding",
    "/admin",
    "/settings/account-control/deletion",
  ];
  const hideFooterRoutes = [
    "/onboarding",
    "/admin",
    "/tasks",
    "/providers",
    "/privacy-policy",
    "/terms-of-service",
    "/settings/account-control/deletion",
  ];
  const hideNavBarRoutesRegex = hideNavRoutes.map(
    (route) => new RegExp(`^${route}(?:/|$)`)
  );
  const shouldHideNav = hideNavBarRoutesRegex.some((regex) =>
    regex.test(pathname)
  );

  const hideFooterRoutesRegex = hideFooterRoutes.map(
    (route) => new RegExp(`^${route}(?:/|$)`)
  );
  const shouldHideFooter = hideFooterRoutesRegex.some((regex) =>
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
                  <GlobalLoadingOverlay />
                  <MobileGate />
                  {!shouldHideNav && <NavBar />}
                  {children}
                  {/* {!shouldHideLayout && <PreFooter />} */}
                  {!shouldHideFooter && <Footer />}
                </TranslationProvider>
              </GluestackUIProvider>
            </Providers>
          </SessionProvider>
        </StyledJsxRegistry>
      </body>
    </html>
  );
}
