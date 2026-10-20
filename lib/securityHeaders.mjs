/**
 * The website's security headers (next.config.mjs). Before 2026-10-20 it
 * sent none: any site could frame it (clickjacking), the browser could load
 * scripts from anywhere, and the image optimizer fetched from any https host.
 *
 * The content policy names every outside origin the site uses: the API and
 * its socket (from the env), Google Maps (script, tiles, fonts), and Places
 * API (New) for address search (lib/googlePlaces). Next's own inline
 * bootstrap scripts need 'unsafe-inline' without per-request nonces;
 * everything else is closed:
 * no plugins, no <base> rewrite, forms post only here, frames only from here.
 * A new outside service is added here, or the browser blocks it.
 */

/** "https://api.x.com/v1" -> "https://api.x.com"; null when unset or bad. */
export function originOf(url) {
  try {
    return url ? new URL(url).origin : null;
  } catch {
    return null;
  }
}

/** The socket's ws(s) origin for an http(s) one. */
export function wsOf(origin) {
  return origin ? origin.replace(/^http/, "ws") : null;
}

export function contentSecurityPolicy({ apiUrl, socketUrl, dev = false }) {
  const api = originOf(apiUrl);
  const socket = originOf(socketUrl) ?? api;
  const devHosts = dev
    ? ["http://localhost:*", "ws://localhost:*", "https://*.devtunnels.ms", "wss://*.devtunnels.ms"]
    : [];
  const maps = ["https://maps.googleapis.com", "https://maps.gstatic.com"];
  const directives = {
    "default-src": ["'self'"],
    "script-src": ["'self'", "'unsafe-inline'", ...(dev ? ["'unsafe-eval'"] : []), ...maps],
    "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    "img-src": ["'self'", "data:", "blob:", "https:", ...(dev ? ["http://localhost:*"] : [])],
    "media-src": ["'self'", "blob:", "https:", ...(dev ? ["http://localhost:*"] : [])],
    "font-src": ["'self'", "data:", "https://fonts.gstatic.com"],
    "connect-src": [
      "'self'",
      api,
      socket,
      wsOf(socket),
      ...maps,
      "https://places.googleapis.com",
      ...devHosts,
    ],
    "worker-src": ["'self'", "blob:"],
    "frame-src": ["'self'"],
    "frame-ancestors": ["'self'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    ...(dev ? {} : { "upgrade-insecure-requests": [] }),
  };
  return Object.entries(directives)
    .map(([k, v]) => [k, ...new Set(v.filter(Boolean))].join(" "))
    .join("; ");
}

export function securityHeaders({ apiUrl, socketUrl, dev = false }) {
  return [
    { key: "Content-Security-Policy", value: contentSecurityPolicy({ apiUrl, socketUrl, dev }) },
    { key: "X-Frame-Options", value: "SAMEORIGIN" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), payment=(), usb=(), geolocation=(self), browsing-topics=()",
    },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
    ...(dev
      ? []
      : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }]),
  ];
}

/**
 * Where next/image may fetch from: the API's uploads, our own domains, and
 * localhost in development. It took any https host, so the site's image
 * optimizer would fetch and resize anything anyone pointed it at.
 */
export function imageRemotePatterns({ apiUrl, dev = false }) {
  const host = (() => {
    try {
      return apiUrl ? new URL(apiUrl) : null;
    } catch {
      return null;
    }
  })();
  return [
    ...(host ? [{ protocol: host.protocol.replace(":", ""), hostname: host.hostname }] : []),
    { protocol: "https", hostname: "companiescenter.com" },
    { protocol: "https", hostname: "*.companiescenter.com" },
    ...(dev
      ? [
          { protocol: "https", hostname: "*.devtunnels.ms" },
          { protocol: "http", hostname: "localhost" },
          { protocol: "http", hostname: "127.0.0.1" },
        ]
      : []),
  ];
}
