"use client";

import { usePathname } from "next/navigation";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import StyledJsxRegistry from "@/app/registry";
import { TranslationProvider } from "@/context/TranslationContext";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import GlobalLoadingOverlay from "@/components/GlobalLoadingOverlay";
import MobileGate from "@/components/MobileGate";
import { Providers } from "@/app/providers";
import { SessionProvider } from "@/context/SessionContext";

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
const hideFooterRoutesRegex = hideFooterRoutes.map(
  (route) => new RegExp(`^${route}(?:/|$)`)
);

/**
 * Client-side application shell: providers + route-dependent chrome.
 * Split out of app/layout.tsx so the root layout stays a Server Component
 * and can export site-wide metadata.
 */
export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const shouldHideNav = hideNavBarRoutesRegex.some((r) => r.test(pathname));
  const shouldHideFooter = hideFooterRoutesRegex.some((r) => r.test(pathname));

  return (
    <StyledJsxRegistry>
      <SessionProvider>
        <Providers>
          <GluestackUIProvider mode="light">
            <TranslationProvider>
              <GlobalLoadingOverlay />
              <MobileGate />
              {!shouldHideNav && <NavBar />}
              {children}
              {!shouldHideFooter && <Footer />}
            </TranslationProvider>
          </GluestackUIProvider>
        </Providers>
      </SessionProvider>
    </StyledJsxRegistry>
  );
}
