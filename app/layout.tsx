"use client";

import StyledJsxRegistry from "./registry";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { SessionProvider } from "@/context/AuthContext";
import NavBar from "@/components/layout/NavBar";
import PreFooter from "@/components/layout/PreFooter";
import Footer from "@/components/layout/Footer";
import { usePathname } from "next/navigation";
// import { MapProvider } from "@/context/MapContext";
import AiChat from "@/components/AiChatFab";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const hideLayoutForRoutes = ["/onboarding", "/another-route"];

  const shouldHideLayout = hideLayoutForRoutes.includes(pathname);

  return (
    <html lang="en">
      <body className="h-screen min-h-screen m-0 p-0">
        <StyledJsxRegistry>
          <GluestackUIProvider mode="light">
              <SessionProvider>
                {!shouldHideLayout && <NavBar />}
                {children}
                {!shouldHideLayout && <PreFooter />}
                {!shouldHideLayout && <Footer />}
                <AiChat />
              </SessionProvider>
          </GluestackUIProvider>
        </StyledJsxRegistry>
      </body>
    </html>
  );
}
