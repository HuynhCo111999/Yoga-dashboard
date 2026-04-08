/* eslint-disable */
// @ts-nocheck

import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source:
          "/blog/yoga-buoi-sang-10-phut-khoi-ong-ngay-moi-tran-ay-nang-luong-tich-cuc",
        destination: "/blog/yoga-buoi-sang-10-phut",
        permanent: true,
      },
    ];
  },
};

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

const configWithPWA = withPWA(nextConfig);

const sentryOptions = {
  org: "huynhco",
  project: "yen-yoga",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
};

export default process.env.NODE_ENV === "development"
  ? configWithPWA
  : withSentryConfig(configWithPWA, sentryOptions);
