import { withGluestackUI } from "@gluestack/ui-next-adapter";
/** @type {import('next').NextConfig} */
const domains =
  process.env.NODE_ENV === "production"
    ? [process.env.NEXT_PUBLIC_IMAGE_DOMAIN || "localhost"]
    : ["localhost"];

const nextConfig = {
  transpilePackages: ["nativewind", "react-native-css-interop"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains,
  },
};

export default withGluestackUI(nextConfig);
