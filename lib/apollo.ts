"use client";

import { ApolloClient, HttpLink, InMemoryCache, from } from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";
import { CombinedGraphQLErrors } from "@apollo/client/errors";

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

export function getApolloClient(): ApolloClient {
  if (!client) {
    client = new ApolloClient({
      link: from([errorLink, httpLink]),
      cache: new InMemoryCache({
        typePolicies: {
          Query: {
            fields: {
              adminUsers: { keyArgs: ["filter", ["search", "role", "isActive"]] },
              adminProviders: { keyArgs: ["filter", ["search", "isVerified"]] },
              adminTasks: { keyArgs: ["filter", ["search", "status"]] },
            },
          },
        },
      }),
    });
  }
  return client;
}
