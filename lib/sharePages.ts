/**
 * Pages a shared link opens: a job (/j/<id>), a business (/c/<slug>), a
 * post (/post/<id>) and a team invite (/team-invite/<token>). Open to everyone, signed in or not, on a phone or a
 * computer, because whoever receives the link usually has no account yet.
 * The three route guards (SessionContext, AuthGate, MobileGate) each use this
 * list. Regression: none of them listed these pages, so a signed-out visitor
 * opening a shared link was sent to the home page (found by the job-rename
 * live check, 2026-10-09).
 *
 * Each entry is a first path segment; guards match it as a whole segment
 * (`/c/...`), so `/c` never opens `/clients` or `/contact`.
 */
export const SHARE_PAGES = ["/j", "/c", "/post", "/team-invite"] as const;

/** True for a share page itself: `/j/<id>`, `/c/<slug>`, `/post/<id>`,
 *  `/team-invite/<token>` (the link in a team invite email). */
export const isSharePage = (pathname: string): boolean =>
  SHARE_PAGES.some((p) => pathname.startsWith(`${p}/`));

/** The app's custom scheme (companiescenterllc app.json `scheme`). */
export const APP_SCHEME = "companiescenterllc";

/**
 * The same page in the app: the app's routes mirror these paths, so
 * `/j/<id>` opens `companiescenterllc://j/<id>`. Regression: the job page
 * passed `/t/<id>` by hand after the app's route became `/j/<id>`, so "Open
 * in app" opened nothing (found 2026-10-09). The button now derives it.
 */
export const appLink = (pathname: string): string =>
  `${APP_SCHEME}://${pathname.replace(/^\/+/, "")}`;

/**
 * A business's public page, /c/<slug> (the API finds a business by its slug
 * only), or null when it has none, so no link is drawn to a page that 404s.
 * Regression: search, the map and Favorites linked /providers/<id>, which
 * doesn't exist on the website.
 */
export const providerPath = (provider: { slug?: string | null }): string | null =>
  provider.slug ? `/c/${encodeURIComponent(provider.slug)}` : null;
