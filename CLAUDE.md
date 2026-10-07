# cpc-web

Repo-specific notes. **The law lives at `Workspace/CLAUDE.md`** and is picked up
automatically from the parent directory. Craft playbooks are in
`Workspace/.claude/standards/`, in particular
[frontend.md](../.claude/standards/frontend.md) before touching UI or client state.

Do not copy the workspace law into this file. It drifts the moment it is duplicated.

---

## What this is

Next.js web app for CompaniesCenter. Tailwind, TanStack Query, Zustand,
gluestack-ui, Recharts, socket.io-client.

**Web is admin plus marketing.** Providers and clients are pushed to the mobile app.
Do not build a user-facing feature here that the app already owns; build the admin
view of it instead.

## Commands

```bash
npm run dev
npm run build
npm run lint
npm test        # vitest, 11 test files; renders components too (vitest.config.ts)
```

API base URL: `NEXT_PUBLIC_API_URL` in production. `axios/conf.ts` logs an explicit
error when it is missing in production and falls back to a dev tunnel otherwise.

## Load-bearing conventions

- **TanStack Query owns all server state. Zustand owns client state only.** This was
  a deliberate migration away from stores-as-cache. Do not put fetched data back in a
  store. Logout calls `queryClient.clear()`.
- **`hooks/admin/adminQueryKeys.ts` is the single source of admin query keys**, all
  under the `["admin"]` prefix so logout can drop the lot with one call. New admin
  queries use the factory.
- **`axios/` is the service layer.** One file per domain. Components import hooks,
  never axios directly.
- **`lib/singleFlight.ts` collapses concurrent refreshes.** Use it for anything that
  must happen once across concurrent callers.
- **`lib/errorService.ts` carries the shared error taxonomy** (code, category,
  severity, source, correlationId, userMessage vs technicalMessage). Render
  `userMessage`, never `technicalMessage`.
- **Socket updates arrive as `domain:event` on scope channels** and are bridged into
  the query cache by `hooks/useAdminCacheBridge.ts`. Subscribe with
  `useSubscription(channel)`; do not add raw socket listeners in views.
- Style gluestack components with `className`. Keep the idiom consistent per file.
- **Terms are accepted by the person, never automatically.** At sign-up, the
  Terms checkbox (`SignUpPage`, `hooks/useTerms.ts`) sends the versions from
  `GET terms/current`. Anything left after that (an older sign-up, a new
  version) goes to `/auth/terms`: the API answers `TERMS_NOT_ACCEPTED` and
  `axios/conf.ts` sends the person there; it shows each policy page in a frame
  and unlocks Accept at the `data-legal-end` marker that
  `components/legal/LegalLayout.tsx` renders after the text. A new legal page
  goes through `LegalLayout`. Every `next` redirect goes through
  `lib/safeNext.ts`. See cpcllc-backend docs/terms-acceptance.md.
- **No made-up numbers, uplifts or credentials in copy** (FTC). A gate test
  (`lib/marketingClaims.test.ts`) scans `app`, `components` and `screens`; a real
  figure comes from the API.

## Known issues

- **11 test files across the largest frontend surface in the workspace.** Every fix
  and feature ships with a test, per the workspace law. That is how the number moves.
- No CI. `lint`, `test` and `build` all work and nothing runs them automatically.
- Pre-existing type noise in gluestack-ui components is not from current work. Do not
  chase it while doing something else.

## History

Session narratives (admin console build, GraphQL removal, data-layer migration,
country isolation, ads, referrals) belong in `docs/` in this repo, not here.
