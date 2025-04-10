/** @type {import('next').NextConfig} */
import withBundleAnalyzer from "@next/bundle-analyzer";
import createNextIntlPlugin from "next-intl/plugin";
import createMDX from "@next/mdx";
const withNextIntl = createNextIntlPlugin();

const analyzeBundle = !!process.env.npm_config_analyzebundle;

const withMDX = createMDX({});

const nextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  experimental: {
    staleTimes: {
      dynamic: 30, // default from before v15.0.0
    },
  },
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
        source: "/cafe/:slug/events",
        destination: "/events/:slug",
        permanent: true,
        locale: false,
      },
    ];
  },
};

export default withMDX(
  withNextIntl(analyzeBundle ? withBundleAnalyzer()(nextConfig) : nextConfig),
);
