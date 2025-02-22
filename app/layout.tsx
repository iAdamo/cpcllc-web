"use client"
import StyledJsxRegistry from "./registry";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { SessionProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en">
        <body className="h-screen m-0 p-0">
          <StyledJsxRegistry>
            <GluestackUIProvider mode="light">{children}</GluestackUIProvider>
          </StyledJsxRegistry>
        </body>
      </html>
    </SessionProvider>
  );
}
