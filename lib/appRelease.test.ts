import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  ANDROID_PACKAGE,
  PLAY_EXAMPLE,
  compareVersions,
  releaseProblems,
  shownStoreLinks,
  appStoreId,
  storeLinkProblem,
  versionProblem,
} from "@/lib/appRelease";

/** Store links and versions (Admin > Settings > App release) and the store buttons. */
const near = (p: string) => fileURLToPath(new URL(p, import.meta.url));
const APPLE = "https://apps.apple.com/us/app/companies-center/id6475066332";
const form = (over = {}) => ({
  iosStoreUrl: "",
  androidStoreUrl: "",
  minVersionIOS: "1.0.0",
  latestVersionIOS: "1.0.0",
  minVersionAndroid: "1.0.0",
  latestVersionAndroid: "1.0.0",
  ...over,
});

describe("parity", () => {
  it("the package is the app's own and the API's (when the repos sit next to this one)", () => {
    const appJson = near("../../companiescenterllc/app.json");
    if (existsSync(appJson)) expect(JSON.parse(readFileSync(appJson, "utf8")).expo.android.package).toBe(ANDROID_PACKAGE);
    const api = near("../../cpcllc-backend/src/modules/app-config/app-release.ts");
    if (existsSync(api)) expect(readFileSync(api, "utf8")).toContain(`ANDROID_PACKAGE = '${ANDROID_PACKAGE}'`);
  });
});

describe("store links", () => {
  it("accepts this app's pages and empty", () => {
    expect(storeLinkProblem("androidStoreUrl", PLAY_EXAMPLE)).toBeNull();
    expect(storeLinkProblem("iosStoreUrl", APPLE)).toBeNull();
    expect(storeLinkProblem("iosStoreUrl", "")).toBeNull();
  });

  it("REGRESSION: the banner's old Play id and the placeholder ids are refused", () => {
    expect(storeLinkProblem("androidStoreUrl", "https://play.google.com/store/apps/details?id=com.companiescenterllc")).toContain("another app");
    expect(storeLinkProblem("androidStoreUrl", "https://play.google.com/store/apps/details?id=com.your.app")).toContain("another app");
    expect(storeLinkProblem("iosStoreUrl", "https://apps.apple.com/app/id-your-app-id")).toContain("apps.apple.com");
  });

  it("buttons only for links that are set and valid", () => {
    expect(shownStoreLinks(null)).toEqual({});
    expect(shownStoreLinks({ iosStoreUrl: "", androidStoreUrl: "" })).toEqual({});
    expect(shownStoreLinks({ androidStoreUrl: PLAY_EXAMPLE })).toEqual({ googlePlay: PLAY_EXAMPLE });
    expect(shownStoreLinks({ iosStoreUrl: APPLE, androidStoreUrl: "https://example.com" })).toEqual({ appStore: APPLE });
  });
});

describe("versions", () => {
  it("numbers separated by dots, compared as the app does", () => {
    expect(versionProblem("1.4.0")).toBeNull();
    expect(versionProblem("1.4-beta")).not.toBeNull();
    expect(compareVersions("1.10", "1.9.9")).toBe(1);
    expect(compareVersions("1.2", "1.2.0")).toBe(0);
  });

  it("the form: every problem by field, and a minimum above the latest", () => {
    expect(releaseProblems(form())).toEqual({});
    expect(releaseProblems(form({ minVersionAndroid: "1.3.0", latestVersionAndroid: "1.2.0", iosStoreUrl: "x" }))).toEqual({
      minVersionAndroid: "Can't be above the latest version.",
      iosStoreUrl: "Enter the full address, starting with https://",
    });
  });
});

describe("Safari's App Store banner", () => {
  it("only with a real App Store link", () => {
    expect(appStoreId(APPLE)).toBe("6475066332");
    expect(appStoreId("")).toBeNull();
    expect(appStoreId("https://apps.apple.com/app/id-your-app-id")).toBeNull();
  });
});

describe("no page writes the App Store banner by hand", () => {
  it("only appStoreBannerMeta builds apple-itunes-app (the share pages sent app-id=0000000000)", () => {
    const root = near("..");
    const walk = (d: string, out: string[] = []): string[] => {
      for (const n of readdirSync(d)) {
        const p = join(d, n);
        if (statSync(p).isDirectory()) walk(p, out);
        else if (/\.tsx?$/.test(n)) out.push(p);
      }
      return out;
    };
    const offenders = ["app", "components", "screens"]
      .flatMap((d) => walk(join(root, d)))
      .filter((f) => readFileSync(f, "utf8").includes("apple-itunes-app"));
    expect(offenders).toEqual([]);
  });
});
