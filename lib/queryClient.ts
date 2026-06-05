import { QueryClient } from "@tanstack/react-query";

// Singleton QueryClient shared between React components (via Provider)
// and Zustand actions (via direct import), enabling TanStack caching
// inside store actions without needing a hook context.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export { queryClient };
