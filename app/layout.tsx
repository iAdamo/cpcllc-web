"use client";

import StyledJsxRegistry from "./registry";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { SessionProvider } from "@/context/AuthContext";
import NavBar from "@/components/layout/NavBar";
// import PreFooter from "@/components/layout/PreFooter";
import Footer from "@/components/layout/Footer";
import { usePathname } from "next/navigation";
// import { MapProvider } from "@/context/MapContext";
import AiChat from "@/components/AiChatFab";
import { TranslationProvider } from "@/context/TranslationContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const hideLayoutForRoutes = ["/onboarding", "/admin"];
  const hideAiChatForRoutes = ["/onboarding", "/admin", "/profile", "/service"];

  const hideAiChatForRoutesRegex = hideAiChatForRoutes.map(
    (route) => new RegExp(`^${route}(?:/|$)`)
  );
  const shouldHideAiChat = hideAiChatForRoutesRegex.some((regex) =>
    regex.test(pathname)
  );

  const hideLayoutForRoutesRegex = hideLayoutForRoutes.map(
    (route) => new RegExp(`^${route}(?:/|$)`)
  );
  const shouldHideLayout = hideLayoutForRoutesRegex.some((regex) =>
    regex.test(pathname)
  );

  return (
    <html lang="en">
      <body className="h-screen min-h-screen m-0 p-0">
        <StyledJsxRegistry>
          <GluestackUIProvider mode="light">
            <SessionProvider>
              <TranslationProvider>
                {!shouldHideLayout && <NavBar />}
                {children}
                {/* {!shouldHideLayout && <PreFooter />} */}
                {!shouldHideLayout && <Footer />}
                {!shouldHideAiChat && <AiChat />}
              </TranslationProvider>
            </SessionProvider>
          </GluestackUIProvider>
        </StyledJsxRegistry>
      </body>
    </html>
  );
}
