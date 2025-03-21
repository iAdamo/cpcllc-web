"use client"
import StyledJsxRegistry from "./registry";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { AuthHandler } from "@/components/AuthHandler";

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
            <AuthHandler />
            {children}
          </GluestackUIProvider>
        </StyledJsxRegistry>
      </body>
    </html>
  );
}
