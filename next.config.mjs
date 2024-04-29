/** @type {import('next').NextConfig} */
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

export default nextConfig;
