import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    environment: "jsdom",
  },
});
