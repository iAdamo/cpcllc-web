"use client"
import StyledJsxRegistry from "./registry";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { SessionProvider } from "@/context/AuthContext";
import NavBar from "@/components/layout/NavBar";
import PreFooter from "@/components/layout/PreFooter";
import Footer from "@/components/layout/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-screen m-0 p-0">
        <StyledJsxRegistry>
          <GluestackUIProvider mode="light">
            <SessionProvider>
              <NavBar />
              {children}
              <PreFooter />
              <Footer />
              </SessionProvider>
          </GluestackUIProvider>
        </StyledJsxRegistry>
      </body>
    </html>
  );
}
