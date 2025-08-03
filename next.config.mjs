import { withNextVideo } from "next-video/process";
import { withGluestackUI } from "@gluestack/ui-next-adapter";
/** @type {import('next').NextConfig} */
const remotePatterns =
  process.env.NODE_ENV === "production"
    ? [
        {
          protocol: "https",
          hostname: process.env.NEXT_PUBLIC_IMAGE_DOMAIN || "localhost",
        },
      ]
    : [
        {
          protocol: "http",
          hostname: "localhost",
        },
      ];

const nextConfig = {
  transpilePackages: ["nativewind", "react-native-css-interop"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns,
  },
};

export default withNextVideo(withGluestackUI(nextConfig));
