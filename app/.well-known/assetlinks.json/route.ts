/**
 * Android Asset Links — required by App Links (autoVerify).
 *
 * Android fetches this file from
 *   https://companiescenter.com/.well-known/assetlinks.json
 * to verify that this domain consents to be associated with the app's
 * signing key. When verified, links to companiescenter.com open the app
 * directly with no chooser dialog.
 *
 * Required fields:
 *   - package_name: Android package id. For the Expo app this is
 *     "com.sanuxtech.companiescenterllc" (mirrors iOS bundleIdentifier
 *     unless overridden in app.json → android.package).
 *   - sha256_cert_fingerprints: SHA-256 of the APK signing certificate.
 *     Multiple entries allowed (one per signing key: debug, upload, prod).
 *
 * How to obtain the SHA-256 fingerprint:
 *   - **EAS Build (recommended)**: `eas credentials` → select Android →
 *     view the upload keystore's "SHA256 Fingerprint".
 *   - **Play App Signing** (if enrolled, which you should be for prod):
 *     Play Console → Setup → App Integrity → App signing → copy the
 *     "App signing key certificate" SHA-256.
 *   - **Local keystore**: `keytool -list -v -keystore <path> -alias <alias>`
 *
 * Put BOTH the upload key fingerprint AND the Play app-signing key
 * fingerprint in the array for production. For debug, add the debug
 * keystore fingerprint too if you want App Links to verify during local
 * development.
 */
import { NextResponse } from "next/server";

// TODO(ops): fill these in once EAS credentials / Play Console give you
// the fingerprints. Until then App Links verification will silently fail
// on Android (links will still open the browser instead of the app).
const PACKAGE_NAME = "com.sanuxtech.companiescenterllc";
const SHA256_FINGERPRINTS = (process.env.ANDROID_SHA256_FINGERPRINTS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  const body = [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: PACKAGE_NAME,
        sha256_cert_fingerprints:
          SHA256_FINGERPRINTS.length > 0
            ? SHA256_FINGERPRINTS
            : ["REPLACE_WITH_SHA256_FINGERPRINT"],
      },
    },
  ];

  return NextResponse.json(body, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
