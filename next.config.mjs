/** @type {import('next').NextConfig} */

import withBundleAnalyzer from "@next/bundle-analyzer";

const analyzeBundle = !!process.env.npm_config_analyzebundle;

const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      // Only when using .svg?react
      // Requires *.svg?react declaration, see global.d.ts
      resourceQuery: /react/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

export default analyzeBundle ? withBundleAnalyzer()(nextConfig) : nextConfig;
