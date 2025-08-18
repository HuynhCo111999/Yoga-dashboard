/* eslint-disable */
// @ts-nocheck

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

// PWA configuration - disabled linting due to next-pwa compatibility issues
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

export default withPWA(nextConfig);
