"use client";

import { usePathname } from "next/navigation";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import StyledJsxRegistry from "@/app/registry";
import { TranslationProvider } from "@/context/TranslationContext";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import GlobalLoadingOverlay from "@/components/GlobalLoadingOverlay";
import MobileGate from "@/components/MobileGate";
import AiAssistantFab from "@/components/AiAssistantFab";
import { Providers } from "@/app/providers";
import { SessionProvider } from "@/context/SessionContext";

const hideNavRoutes = [
  "/onboarding",
  "/admin",
  "/settings/account-control/deletion",
  "/i",
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
  (route) => new RegExp(`^${route}(?:/|$)`),
);
const hideFooterRoutesRegex = hideFooterRoutes.map(
  (route) => new RegExp(`^${route}(?:/|$)`),
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

  // The NavBar is `fixed`, so it sits out of flow. On the home page it is a
  // transparent overlay on top of the hero (no spacer wanted). Everywhere else
  // it is solid, so the shell reserves its exact height once here — pages never
  // add their own top padding to clear it. Height must match NavBar (h-16 md:h-20).
  const isHome = pathname === "/";
  const reserveNavSpace = !shouldHideNav && !isHome;

  return (
    <StyledJsxRegistry>
      <SessionProvider>
        <Providers>
          <GluestackUIProvider mode="system">
            <TranslationProvider>
              <GlobalLoadingOverlay />
              {/* data-chrome marks marketing/web-only chrome so embedded
                  (mobile-app WebView) pages can strip it via CSS — see
                  html.cc-embedded in globals.css. */}
              <div data-chrome>
                <MobileGate />
              </div>
              {!shouldHideNav && (
                <div data-chrome>
                  <NavBar />
                </div>
              )}
              {reserveNavSpace && (
                <div
                  aria-hidden
                  data-chrome
                  className="h-16 md:h-20 flex-shrink-0"
                />
              )}
              {children}
              {!shouldHideFooter && (
                <div data-chrome>
                  <Footer />
                </div>
              )}
              <div data-chrome>
                <AiAssistantFab />
              </div>
            </TranslationProvider>
          </GluestackUIProvider>
        </Providers>
      </SessionProvider>
    </StyledJsxRegistry>
  );
}
