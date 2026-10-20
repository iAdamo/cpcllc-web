import { describe, expect, it } from "vitest";
import {
  contentSecurityPolicy,
  imageRemotePatterns,
  securityHeaders,
} from "./securityHeaders.mjs";

/**
 * 2026-10-20: the website sent no security headers (any site could frame it,
 * scripts could load from anywhere), and its image optimizer fetched from any
 * https host. These are the rules next.config.mjs applies to every page.
 */
const prod = { apiUrl: "https://api.companiescenter.com/v1", socketUrl: undefined, dev: false };
const csp = (o = prod) =>
  Object.fromEntries(
    contentSecurityPolicy(o)
      .split("; ")
      .map((d) => {
        const [k, ...v] = d.split(" ");
        return [k, v];
      }),
  );

describe("content policy", () => {
  it("closes what the site never uses", () => {
    const c = csp();
    expect(c["object-src"]).toEqual(["'none'"]);
    expect(c["base-uri"]).toEqual(["'self'"]);
    expect(c["form-action"]).toEqual(["'self'"]);
    expect(c["frame-ancestors"]).toEqual(["'self'"]);
    expect(c["frame-src"]).toEqual(["'self'"]); // the Terms page frames our own policies
    expect(c["script-src"]).not.toContain("'unsafe-eval'");
    expect(c["script-src"]).not.toContain("https:");
    expect(c["upgrade-insecure-requests"]).toEqual([]);
  });

  it("lets the site reach the API, its socket and the map, and nothing else", () => {
    const c = csp();
    expect(c["connect-src"]).toEqual([
      "'self'",
      "https://api.companiescenter.com",
      "wss://api.companiescenter.com",
      "https://maps.googleapis.com",
      "https://maps.gstatic.com",
      "https://places.googleapis.com",
    ]);
    const s = csp({ ...prod, socketUrl: "https://rt.companiescenter.com" });
    expect(s["connect-src"]).toContain("wss://rt.companiescenter.com");
  });

  it("development adds what next dev and the tunnel need, and only there", () => {
    const d = csp({ ...prod, dev: true });
    expect(d["script-src"]).toContain("'unsafe-eval'");
    expect(d["connect-src"]).toContain("https://*.devtunnels.ms");
    expect(csp()["connect-src"]).not.toContain("https://*.devtunnels.ms");
  });
});

describe("headers on every page", () => {
  it("no framing by other sites, no sniffing, HTTPS only in production", () => {
    const h = Object.fromEntries(securityHeaders(prod).map((x) => [x.key, x.value]));
    expect(h["X-Frame-Options"]).toBe("SAMEORIGIN");
    expect(h["X-Content-Type-Options"]).toBe("nosniff");
    expect(h["Strict-Transport-Security"]).toMatch(/max-age=\d+; includeSubDomains/);
    expect(h["Permissions-Policy"]).toContain("camera=()");
    const dev = Object.fromEntries(securityHeaders({ ...prod, dev: true }).map((x) => [x.key, x.value]));
    expect(dev["Strict-Transport-Security"]).toBeUndefined();
  });
});

describe("image optimizer hosts", () => {
  it("the API and our domains only (it took any https host)", () => {
    const hosts = imageRemotePatterns(prod).map((p) => `${p.protocol}://${p.hostname}`);
    expect(hosts).toEqual([
      "https://api.companiescenter.com",
      "https://companiescenter.com",
      "https://*.companiescenter.com",
    ]);
    expect(hosts.some((h) => h.includes("**"))).toBe(false);
  });
});
