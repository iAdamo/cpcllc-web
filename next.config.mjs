import { withGluestackUI } from "@gluestack/ui-next-adapter";
import {
  imageRemotePatterns,
  securityHeaders,
} from "./lib/securityHeaders.mjs";

const dev = process.env.NODE_ENV !== "production";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;

// Uploaded media (provider logos, galleries) is served from the API host's
// /uploads path: only that host and our own domains (lib/securityHeaders).
const remotePatterns = imageRemotePatterns({ apiUrl, dev });

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emit a self-contained server bundle (.next/standalone) so the Docker image
  // ships only the traced runtime deps instead of the whole node_modules.
  output: "standalone",
  // No "X-Powered-By: Next.js".
  poweredByHeader: false,
  // Every page: content policy, no framing by other sites, HTTPS only
  // (lib/securityHeaders.mjs).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders({ apiUrl, socketUrl, dev }),
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: [],
  images: {
    remotePatterns,
  },
  compiler: {
    // Strip console noise from production bundles; keep errors and warnings.
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },
};

export default withGluestackUI(nextConfig);
