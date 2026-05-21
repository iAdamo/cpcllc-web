"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "../global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import StyledJsxRegistry from "./registry";
import { TranslationProvider } from "@/context/TranslationContext";

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
  return (
    <html lang="en">
      <body
        className={`flex-1  antialiased h-screen w-screen overflow-hidden overflow-y-scroll`}
      >
        <StyledJsxRegistry>
          <GluestackUIProvider mode="light">
            <TranslationProvider>{children}</TranslationProvider>
          </GluestackUIProvider>
        </StyledJsxRegistry>
      </body>
    </html>
  );
}
