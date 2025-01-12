import type { Config } from "tailwindcss";

const colors = {
  blue: {
    250: "#E8E8FF",
    DEFAULT: "#2D2E82",
    600: "#1F205A",
  },
  orange: {
    450: "#EF8565", // AA orange on blue
    DEFAULT: "#ED6A42",
  },
  white: "#ffffff",
};

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors,
    extend: {
      width: {
        // based on 65ch, but font loading caused layout shift
        body: "calc(41rem + 0.75rem)",
      },
      maxWidth: {
        body: "calc(41rem + 0.75rem)",
        side: "calc(30rem + 0.75rem)",
      },
      screens: {
        body: "calc(41rem + 0.75rem)",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
      },
      typography: {
        DEFAULT: {
          css: {
            color: colors.blue.DEFAULT,
            a: {
              color: colors.blue.DEFAULT,
              "&:hover": {
                color: colors.orange,
              },
            },
            h3: {
              color: colors.blue.DEFAULT,
              fontSize: "inherit",
            },
          },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
export default config;
