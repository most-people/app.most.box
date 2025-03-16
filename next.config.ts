import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  output: "export",
};

const config = withPWA({
  dest: "public",
  register: true,
  workboxOptions: {
    skipWaiting: true,
  },
  disable: process.env.NODE_ENV === "development",
})(nextConfig);

export default config;
