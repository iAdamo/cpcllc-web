"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { queryClient } from "@/lib/queryClient";
import { AuthGate } from "@/components/AuthGate";
import { AppToaster } from "@/components/error/AppToaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <AuthGate>{children}</AuthGate>
        <AppToaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
