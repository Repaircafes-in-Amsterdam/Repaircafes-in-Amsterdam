/** @type {import('next').NextConfig} */
import withBundleAnalyzer from "@next/bundle-analyzer";
import createNextIntlPlugin from "next-intl/plugin";
import createMDX from "@next/mdx";
const withNextIntl = createNextIntlPlugin();

const analyzeBundle = !!process.env.npm_config_analyzebundle;

const withMDX = createMDX({});

const nextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      // Only when using .svg?react
      // Requires *.svg?react declaration, see global.d.ts
      resourceQuery: /react/,
      use: [{ loader: "@svgr/webpack", options: { titleProp: true } }],
    });

    return config;
  },
  async redirects() {
    return [
      {
        source: "/:locale/cafe/:slug/events",
        destination: "/:locale/events/:slug",
        permanent: false,
      },
    ];
  },
};

export default withMDX(
  withNextIntl(analyzeBundle ? withBundleAnalyzer()(nextConfig) : nextConfig),
);
