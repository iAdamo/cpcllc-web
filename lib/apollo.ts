"use client";

import { ApolloClient, HttpLink, InMemoryCache, from } from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { persistCache, LocalStorageWrapper } from "apollo3-cache-persist";

const baseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_URL
    : "https://9qc99pwv-3333.uks1.devtunnels.ms/";

const httpLink = new HttpLink({
  uri: `${baseUrl?.replace(/\/$/, "")}/graphql`,
  credentials: "include",
});

const errorLink = new ErrorLink(({ error, operation }) => {
  if (CombinedGraphQLErrors.is(error)) {
    for (const err of error.errors) {
      console.error("[GraphQL error]", err.message, err.path, "in", operation.operationName);
    }
  } else {
    console.error("[Network error]", error);
  }
});

let client: ApolloClient | null = null;
let persistPromise: Promise<void> | null = null;

/** Returns a promise that resolves when the cache has been rehydrated from
 *  localStorage. Components that want to wait for cached data before rendering
 *  can `await getApolloPersistor()` on mount. */
export function getApolloPersistor(): Promise<void> {
  return persistPromise ?? Promise.resolve();
}

export function getApolloClient(): ApolloClient {
  if (!client) {
    const cache = new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            adminUsers: { keyArgs: ["filter", ["search", "role", "isActive"]] },
            adminProviders: { keyArgs: ["filter", ["search", "isVerified"]] },
            adminTasks: { keyArgs: ["filter", ["search", "status"]] },
          },
        },
      },
    });

    // Persist the cache to localStorage so reloads keep marketplace data warm
    // — matches the "fetch once, refresh via socket only" model.
    if (typeof window !== "undefined") {
      persistPromise = persistCache({
        cache,
        storage: new LocalStorageWrapper(window.localStorage),
        debug: false,
        maxSize: 4 * 1024 * 1024, // 4 MB cap, plenty for the admin shell
        // Wipe stale entries automatically if persisted cache schema changes.
        key: "apollo-cache-cpc-v1",
      }).catch((err) => {
        console.warn("[apollo] persist failed:", err);
      });
    }

    client = new ApolloClient({
      link: from([errorLink, httpLink]),
      cache,
      defaultOptions: {
        // ── Cache-first by default ───────────────────────────────────────────
        // useQuery() returns cached data immediately and DOES NOT re-fetch.
        // Updates come exclusively via the websocket bridge in
        // hooks/useAdminLiveUpdates (which calls refetchQueries on relevant
        // admin:stats_invalidated events). Initial fetch happens only when
        // the cache is empty for that query — that's the "no data was
        // gotten" fallback the user asked for.
        watchQuery: { fetchPolicy: "cache-first" },
        query: { fetchPolicy: "cache-first" },
      },
    });
  }
  return client;
}
