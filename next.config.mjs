/** @type {import('next').NextConfig} */
import withBundleAnalyzer from "@next/bundle-analyzer";
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();

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

export default withNextIntl(
  analyzeBundle ? withBundleAnalyzer()(nextConfig) : nextConfig,
);
