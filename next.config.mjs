import { withGluestackUI } from "@gluestack/ui-next-adapter";
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["nativewind", "react-native-css-interop"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["localhost"], // Add the domain of your external image
  },
};

export default withGluestackUI(nextConfig);
