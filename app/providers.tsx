"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { ApolloProvider } from "@apollo/client/react";
import { queryClient } from "@/lib/queryClient";
import { getApolloClient } from "@/lib/apollo";
import { AuthGate } from "@/components/AuthGate";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={getApolloClient()}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <AuthGate>{children}</AuthGate>
        </ThemeProvider>
      </QueryClientProvider>
    </ApolloProvider>
  );
}
