/**
 * Apple App Site Association (AASA) — required by iOS Universal Links.
 *
 * iOS fetches this file from
 *   https://companiescenter.com/.well-known/apple-app-site-association
 * to verify that the app is authorized to handle links on this domain.
 * Must be served over HTTPS with `content-type: application/json` and
 * **no redirects**.
 *
 * App ID format: `<TEAM_ID>.<BUNDLE_ID>`
 *   - TEAM_ID: 10-char Apple Developer Team ID (e.g. "A1B2C3D4E5"). Found
 *     at https://developer.apple.com/account → Membership.
 *   - BUNDLE_ID: from app.json → ios.bundleIdentifier
 *     = "com.sanuxtech.companiescenterllc"
 *
 * Paths: matched against the URL path Apple intercepts. We claim `/c/*`
 * (provider profile shares — mnemonic: company) and `/t/*` (task shares).
 *
 * To update without redeploying everything, change the constants below.
 * iOS only re-fetches the AASA when the app is reinstalled or via the
 * `CFBundleAssociatedDomains` CDN cache (typically 24h).
 */
import { NextResponse } from "next/server";

// TODO(ops): replace with the real Apple Team ID from the Apple Developer
// portal once provisioned. Until then, Universal Links won't activate.
const APPLE_TEAM_ID =
  process.env.APPLE_TEAM_ID || "REPLACE_WITH_APPLE_TEAM_ID";
const BUNDLE_ID = "com.sanuxtech.companiescenterllc";

export const dynamic = "force-static";
export const revalidate = 3600; // 1h — Apple caches anyway, this is the floor

export async function GET() {
  const body = {
    applinks: {
      apps: [],
      details: [
        {
          appID: `${APPLE_TEAM_ID}.${BUNDLE_ID}`,
          paths: ["/c/*", "/t/*"],
        },
      ],
    },
    // webcredentials: omitted — enable later if you implement Sign in with
    //   Apple or Password AutoFill from this domain.
  };

  return NextResponse.json(body, {
    headers: {
      "Content-Type": "application/json",
      // Cache aggressively at the CDN edge; iOS uses its own internal cache.
      "Cache-Control": "public, max-age=3600",
    },
  });
}
