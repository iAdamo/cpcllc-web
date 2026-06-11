# CompaniesCenter — Web Client (`cpc-web`)

> The Next.js 15 web client for CompaniesCenter. Hosts the public marketing surfaces, the authenticated client/provider portals, and the **enterprise-grade admin console** at `/admin` — a Fixora-style back-office for Trust & Safety, Finance, Support, Growth and System Operations.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript 5 · Tailwind CSS 3 · gluestack-ui · Apollo Client 4 · TanStack Query 5 · Zustand 5 · Socket.IO Client 4 · Recharts 3 · React Hook Form + Zod · Framer Motion · NativeWind (Tailwind for RN-on-web)

---

## Highlights — what makes this codebase worth reading

- **Full enterprise admin console.** 20+ back-office views (Users, Providers, Clients, Tasks, Support, Disputes, Fraud, Moderation, Subscriptions, Roles, Audit, Feature Flags, System Health, plus stubs for Payments/Wallets/Withdrawals/Escrow/CMS/Marketing/Integrations). Each view is paginated, searchable, filterable, and drawer-driven.
- **REST + GraphQL hybrid.** Apollo Client 4 powers the four high-traffic admin tables (Users, Providers, Clients, Tasks) with `TypedDocumentNode<TData, TVars>` for full type-safety without codegen. The rest of the surface uses a typed axios singleton against the REST API. Same auth cookie, same business logic backend.
- **Real-time without polling.** A single Socket.IO singleton + a `useSubscription(channel)` hook subscribes views to scope channels (`scope:marketplace:users`, `scope:admin:stats`) on mount and tears them down on unmount. The admin layout's sidebar badges and the dashboard counters update live as users register, tickets file, disputes open, fraud events fire.
- **Cache bridge pattern.** A `useAdminCacheBridge` hook listens for typed `domain:event` envelopes, dispatches by `payload.type` (`user.registered`, `stats.invalidated`, etc.) to Zustand updaters — invalidating only the affected scope, not the whole dashboard.
- **Apollo 4 idioms.** New React-bindings split (`@apollo/client/react`), new `ErrorLink` + `CombinedGraphQLErrors.is(error)` pattern, `credentials: "include"` for cookie auth.
- **gluestack-ui across the consumer surface, Tailwind for the admin shell.** Two distinct visual systems coexist intentionally — admin uses Tailwind directly for design-system independence; the rest leans on gluestack primitives.
- **Form-driven UX.** React Hook Form + `@hookform/resolvers` + Zod 4 across every mutation surface.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Next.js 15 App Router                         │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────────────┐  │
│  │ Public surfaces │  │  Client portal   │  │  Admin console     │  │
│  │ (marketing,     │  │  (browse, book,  │  │  (/admin/*)        │  │
│  │  signup, etc.)  │  │   manage tasks)  │  │                    │  │
│  └─────────────────┘  └──────────────────┘  └─────────┬──────────┘  │
└────────────────────────────────────────────────────────┼────────────┘
                                                        │
        ┌───────────────────────┬───────────────────────┴────┐
        ▼                       ▼                            ▼
  ┌──────────────┐      ┌──────────────┐           ┌──────────────────┐
  │ axios        │      │ Apollo 4     │           │ Socket.IO client │
  │ (REST)       │      │ (GraphQL)    │           │ (live updates)   │
  │              │      │              │           │                  │
  │ Most of the  │      │ High-traffic │           │ useSubscription  │
  │ surface.     │      │ admin tables.│           │ + cache bridge.  │
  └──────────────┘      └──────────────┘           └──────────────────┘
        │                       │                            │
        └───────────────────────┴────────────┬───────────────┘
                                             ▼
                            ┌──────────────────────────────┐
                            │  cpcllc-backend (NestJS 11)  │
                            │  cookies forwarded on all 3  │
                            └──────────────────────────────┘
```

---

## The admin console

### Layout & navigation

- [`components/layout/admin/index.tsx`](components/layout/admin/index.tsx) — collapsible sidebar (Tailwind, dark-mode toggle, search bar, notification badge, user chip). Accepts a `badges` prop mapping `openTickets | openDisputes | fraudAlerts | moderationQueue | openTasks` to counters.
- [`components/layout/admin/sidebar-config.ts`](components/layout/admin/sidebar-config.ts) — source of truth for navigation groups: **Overview · Marketplace · Trust & Safety · Finance · Support · Growth · System**.

### Shared admin primitives — [`components/admin/`](components/admin/)

- `KpiCard.tsx` — icon, value, delta % chip, brand-palette tones.
- `PanelCard.tsx` — boxed section with title + action slot.
- `StatusPill.tsx` + `statusToTone(status)` — consistent status chips across every view.
- `Drawer.tsx` — reusable side-drawer for detail panels + mutations.

### Screens — [`screens/admin/`](screens/admin/)

- **`index.tsx`** — switchboard. Mounts auth gate (`getMyAdminUser()` → redirect to `/signin?next=/admin` on null/error), loads aggregate stats once, passes badge counts to the layout, renders the active view, subscribes to live updates.
- **`dashboard-view/`** — KPI strip (Users / Providers / Tasks / Open Tasks / Active Subs / MRR), trust strip (Tickets / Disputes / Fraud / Rating), Platform Overview area chart, Task Status donut, Recent Tasks table, System Health panel, Top Providers, Recent Activities feed.
- **`views/`** — hand-built views:
  - **Marketplace**: `UsersView` · `ProvidersView` · `ClientsView` · `TasksView` (GraphQL-backed, paginated, drawer-driven, full mutation support).
  - **Trust & Safety**: `SupportView` · `DisputesView` · `FraudView` · `ModerationView`.
  - **Finance**: `SubscriptionsView`.
  - **Growth**: `FeatureFlagsView`.
  - **System**: `AuditView` · `RolesView` · `SystemHealthView`.

Every other sidebar key (providers, clients, tasks, bookings, projects, messages, payments, wallets, withdrawals, escrow, reviews, reports, notifications, marketing, analytics, compliance, cms, settings, api, integrations) routes to `PlaceholderView` with the intended feature checklist — the next round of builds.

---

## Data flow patterns

### REST — typed axios client

- [`axios/admin.ts`](axios/admin.ts) — one typed client function per endpoint, all using the existing `ApiClientSingleton`. Legacy `getMetrics` preserved.
- [`axios/conf.ts`](axios/conf.ts) — base URL, dev tunnel for non-prod, `NEXT_PUBLIC_API_URL` for production. Cookies always forwarded.

### GraphQL — Apollo Client 4 with full type-safety

- [`lib/apollo.ts`](lib/apollo.ts) — client setup. v4-specific: new `ErrorLink`, `CombinedGraphQLErrors.is(error)` pattern, `credentials: "include"`.
- [`graphql/admin.ts`](graphql/admin.ts) — operations typed via `TypedDocumentNode<TData, TVars>` so `useQuery` returns properly-typed `data` without codegen. **The pattern to copy** for future modules.
- [`app/providers.tsx`](app/providers.tsx) — wires `ApolloProvider` alongside `QueryClientProvider` + `ThemeProvider`.

### Sockets — single primitive + cache bridge

- [`lib/socket.ts`](lib/socket.ts) — Socket.IO singleton (`withCredentials: true`, path matches backend's `/sanuxsocket/socket.io`). Mirrors the backend's `SocketEvents` enum byte-for-byte.
- [`hooks/useSubscription.ts`](hooks/useSubscription.ts) — primitive. `useSubscription<T>(channel, { onEvent })` sends `SUBSCRIPTION_SUBSCRIBE` on mount, `SUBSCRIPTION_UNSUBSCRIBE` on unmount. Returns `{ lastEvent, isSubscribed }`. Pass `null` to opt out.
- [`hooks/useAdminCacheBridge.ts`](hooks/useAdminCacheBridge.ts) — listens on `scope:marketplace:users` for `user.registered` (→ `prependAdminUser`), on `scope:admin:stats` for `stats.invalidated` (→ `invalidateAdminScope`), plus presence heartbeat. Phase 3 retired the old `useAdminLiveUpdates` raw-event hook in favour of this typed-channel pattern.

### State — Zustand

- [`stores/dashboardState.ts`](stores/dashboardState.ts) — dashboard data.
- [`stores/adminCacheState.ts`](stores/adminCacheState.ts) — admin list caches with `prependAdminUser`, `invalidateAdminScope`, etc.
- [`stores/authState.ts`](stores/authState.ts) · [`stores/userState.ts`](stores/userState.ts) — session + profile.

---

## Type system

- [`types/admin.d.ts`](types/admin.d.ts) — `AdminView` union covering the full sidebar; types for dashboard overview, ticket/dispute/fraud/subscription stats, system health.
- [`types/admin-marketplace.ts`](types/admin-marketplace.ts) — `AdminScope` union (`'users' | 'providers' | 'tasks' | 'admin:stats' | 'presence'`) — drives the cache-invalidation flow.
- [`types/domain-events.ts`](types/domain-events.ts) — `DomainEventPayload<T>` mirror of the backend type.

---

## Project layout

```
app/                       ← Next.js App Router pages, layouts, providers
axios/
  ├── admin.ts             ← typed REST client for the admin surface
  └── conf.ts              ← base URL, cookie config
components/
  ├── admin/               ← KpiCard, PanelCard, StatusPill, Drawer, MetricCard, InsightCard
  ├── layout/admin/        ← sidebar, top bar, sidebar-config
  └── ui/                  ← shared form, layout, feedback primitives
graphql/
  └── admin.ts             ← TypedDocumentNode operations for the GraphQL surface
hooks/
  ├── useSubscription.ts   ← primitive socket subscription hook
  └── useAdminCacheBridge  ← typed scope-channel listener
lib/
  ├── apollo.ts            ← Apollo Client 4 setup
  └── socket.ts            ← Socket.IO singleton + event enums
screens/
  └── admin/
      ├── index.tsx        ← switchboard + auth gate + badge polling
      ├── dashboard-view/  ← KPI strips, charts, panels
      └── views/           ← Users, Providers, Clients, Tasks, Support, Disputes,
                             Fraud, Moderation, Subscriptions, FeatureFlags, Audit,
                             Roles, SystemHealth, Placeholder
stores/                    ← Zustand stores
types/                     ← domain types
public/                    ← static assets
```

---

## Engineering notes worth knowing

- **Admin uses Tailwind directly. Everything else uses gluestack-ui.** This is intentional. The admin design system is independent so it can evolve toward enterprise density without dragging the consumer surface with it.
- **`next/font` + Geist** auto-optimized.
- **Apollo 4 + TanStack Query 5 coexist.** Apollo for the typed GraphQL paths; TanStack for the rest. They share the same auth cookie.
- **Server Components-first** under the App Router; client components are scoped to interactive subtrees.
- **Path aliases** via `tsconfig.json`.
- **NativeWind** lets a subset of React Native components render in this Next.js app, keeping the mobile (`companiescenterllc/`) and web component vocabularies aligned where it matters.

---

## Local development

```bash
# install
npm install     # or yarn / pnpm / bun

# dev (next dev)
npm run dev

# production build
npm run build

# preview build
npm run build:preview

# start production server
npm run start

# lint
npm run lint
```

Open <http://localhost:3000>.

API base URL is hard-coded in [`axios/conf.ts`](axios/conf.ts) for non-prod (currently a dev tunnel). Production reads `NEXT_PUBLIC_API_URL`.

---

## What's next

- Real-time chat UI (the backend chat sockets are ready; this client is the missing consumer).
- Detail drawers for Disputes + Tickets (list views are live; click-row to open evidence viewer + action panel is the next sprint).
- Charts in `/analytics` wired into the existing `AdminMetricService`.
- CMS, Marketing, Integrations views (currently `PlaceholderView` with the intended feature checklist).
- Seed-data flow for demos.

---

*Built by Adam Sanusi Babatunde — the patterns above reflect production decisions, not template scaffolding.*
