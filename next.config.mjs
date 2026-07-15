import { withGluestackUI } from "@gluestack/ui-next-adapter";
/** @type {import('next').NextConfig} */

// Uploaded media (provider logos, galleries) is served from the API host's
// /uploads path, which differs per environment (api subdomain in prod,
// devtunnel locally). Allow any https host plus localhost for dev.
const remotePatterns = [
  { protocol: "https", hostname: "**" },
  { protocol: "http", hostname: "localhost" },
  { protocol: "http", hostname: "127.0.0.1" },
];

const nextConfig = {
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
