import type { Metadata } from "next";
import StyledJsxRegistry from "./registry";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

export const metadata: Metadata = {
  title: "Companies Center",
  description: "Your one-top hub for connecting with top companies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-screen m-0 p-0">
        <StyledJsxRegistry>
          <GluestackUIProvider mode="light">{children}</GluestackUIProvider>
        </StyledJsxRegistry>
      </body>
    </html>
  );
}
