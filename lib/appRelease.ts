/**
 * The app's store links and version numbers, edited in Admin > Settings >
 * App release. Mirrors the API's rules (modules/app-config/app-release.ts) so
 * the form can say what's wrong before saving; the API checks again, and its
 * message wins. Store buttons on the website come from `shownStoreLinks`: a
 * store with no link set gets no button (a listing that doesn't exist yet is
 * a dead link).
 */

/** The app's Android package (companiescenterllc app.json `android.package`). */
export const ANDROID_PACKAGE = "com.sanuxtech.companiescenterllc";

export const STORE_LINK_FIELDS = ["iosStoreUrl", "androidStoreUrl"] as const;
export type StoreLinkField = (typeof STORE_LINK_FIELDS)[number];

export const VERSION_FIELDS = ["minVersionIOS", "latestVersionIOS", "minVersionAndroid", "latestVersionAndroid"] as const;
export type VersionField = (typeof VERSION_FIELDS)[number];

export type AppRelease = Partial<Record<StoreLinkField | VersionField, string>>;

export const RELEASE_LABELS: Record<StoreLinkField | VersionField, string> = {
  iosStoreUrl: "App Store link",
  androidStoreUrl: "Google Play link",
  minVersionIOS: "iPhone minimum version",
  latestVersionIOS: "iPhone latest version",
  minVersionAndroid: "Android minimum version",
  latestVersionAndroid: "Android latest version",
};

export const PLAY_EXAMPLE = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;
export const APPLE_EXAMPLE = "https://apps.apple.com/us/app/companies-center/id1234567890";

/** Why `url` can't be that store's link, or null when it can (empty: none). */
export function storeLinkProblem(field: StoreLinkField, url: string): string | null {
  const value = url.trim();
  if (!value) return null;
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return "Enter the full address, starting with https://";
  }
  const host = parsed.hostname.toLowerCase();
  if (field === "iosStoreUrl") {
    return parsed.protocol === "https:" && host === "apps.apple.com" && /\/id\d+(\/|$)/.test(parsed.pathname)
      ? null
      : "Use the app's page on https://apps.apple.com (it ends in /id followed by numbers).";
  }
  const id = parsed.searchParams.get("id");
  if (parsed.protocol !== "https:" || host !== "play.google.com" || parsed.pathname !== "/store/apps/details" || !id) {
    return `Use ${PLAY_EXAMPLE}`;
  }
  return id === ANDROID_PACKAGE ? null : `That link is for another app (${id}); this app is ${ANDROID_PACKAGE}.`;
}

/** Why `value` isn't a version the app can compare, or null. */
export function versionProblem(value: string): string | null {
  return /^\d+(\.\d+){0,3}$/.test(value.trim()) ? null : "Use numbers separated by dots, like 1.4.0.";
}

/** -1, 0 or 1, number by number, missing parts as 0 (as the app compares). */
export function compareVersions(a: string, b: string): number {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const x = pa[i] ?? 0;
    const y = pb[i] ?? 0;
    if (x !== y) return x > y ? 1 : -1;
  }
  return 0;
}

/** Every problem in the form, by field, or an empty object. */
export function releaseProblems(form: Record<StoreLinkField | VersionField, string>): Partial<Record<StoreLinkField | VersionField, string>> {
  const out: Partial<Record<StoreLinkField | VersionField, string>> = {};
  for (const f of STORE_LINK_FIELDS) {
    const p = storeLinkProblem(f, form[f]);
    if (p) out[f] = p;
  }
  for (const f of VERSION_FIELDS) {
    const p = versionProblem(form[f]);
    if (p) out[f] = p;
  }
  for (const [min, latest] of [
    ["minVersionIOS", "latestVersionIOS"],
    ["minVersionAndroid", "latestVersionAndroid"],
  ] as const) {
    if (!out[min] && !out[latest] && compareVersions(form[min].trim(), form[latest].trim()) > 0) {
      out[min] = "Can't be above the latest version.";
    }
  }
  return out;
}

/** The store links to show buttons for: only ones set and valid. */
export function shownStoreLinks(config: AppRelease | null | undefined): { appStore?: string; googlePlay?: string } {
  const ios = config?.iosStoreUrl?.trim() ?? "";
  const android = config?.androidStoreUrl?.trim() ?? "";
  return {
    ...(ios && !storeLinkProblem("iosStoreUrl", ios) ? { appStore: ios } : {}),
    ...(android && !storeLinkProblem("androidStoreUrl", android) ? { googlePlay: android } : {}),
  };
}

/** The App Store id in a valid App Store link ("6475066332"), or null. */
export function appStoreId(url: string | null | undefined): string | null {
  const value = url?.trim() ?? "";
  if (!value || storeLinkProblem("iosStoreUrl", value)) return null;
  return new URL(value).pathname.match(/\/id(\d+)(\/|$)/)?.[1] ?? null;
}
