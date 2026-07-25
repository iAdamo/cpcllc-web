import type { AdminScope } from "@/types/admin-marketplace";

/**
 * Single source of truth for admin query keys. Everything the back-office
 * caches lives under the ["admin"] prefix so logout can drop it all with
 * one `queryClient.removeQueries({ queryKey: adminKeys.all })`.
 */
export const adminKeys = {
  all: ["admin"] as const,
  overview: ["admin", "overview"] as const,

  users: ["admin", "users"] as const,
  usersView: (filter: Record<string, unknown>) =>
    ["admin", "users", "list", filter] as const,
  userDetail: (id: string) => ["admin", "users", "detail", id] as const,

  providers: ["admin", "providers"] as const,
  providersView: (filter: Record<string, unknown>) =>
    ["admin", "providers", "list", filter] as const,
  providerDetail: (id: string) => ["admin", "providers", "detail", id] as const,

  clients: ["admin", "clients"] as const,
  clientsView: (filter: Record<string, unknown>) =>
    ["admin", "clients", "list", filter] as const,
  clientDetail: (id: string) => ["admin", "clients", "detail", id] as const,

  tasks: ["admin", "tasks"] as const,
  tasksView: (filter: Record<string, unknown>) =>
    ["admin", "tasks", "list", filter] as const,
  taskDetail: (id: string) => ["admin", "tasks", "detail", id] as const,

  // Trust & Safety — service lifecycle oversight + review moderation.
  engagements: ["admin", "engagements"] as const,
  engagementsView: (filter: Record<string, unknown>) =>
    ["admin", "engagements", "list", filter] as const,
  engagementDetail: (id: string) =>
    ["admin", "engagements", "detail", id] as const,

  reviewsMod: ["admin", "reviews-mod"] as const,
  reviewsModView: (filter: Record<string, unknown>) =>
    ["admin", "reviews-mod", "list", filter] as const,
};

/** Maps a websocket invalidation scope to the query keys it dirties. */
export function keysForScope(scope: AdminScope): (readonly unknown[])[] {
  switch (scope) {
    case "users":
      // Clients are a filtered view of users — dirty both.
      return [adminKeys.users, adminKeys.clients, adminKeys.overview];
    case "providers":
      return [adminKeys.providers, adminKeys.overview];
    case "clients":
      return [adminKeys.clients, adminKeys.overview];
    case "tasks":
      return [adminKeys.tasks, adminKeys.overview];
    // tickets/disputes/fraud/moderation only feed the dashboard today.
    default:
      return [adminKeys.overview];
  }
}
