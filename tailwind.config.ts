import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import { colors } from "./colors.mjs";

// based on 65ch, but font loading caused layout shift
const bodyWidth = "calc(41rem + 0.75rem)";

const scrollbarColorUtilities = plugin(({ addUtilities }) => {
  addUtilities({
    ".scrollbar-default": {
      "--tw-scrollbar-thumb": colors.orange.DEFAULT,
      "--tw-scrollbar-track": colors.white,
      "scrollbar-color": "var(--tw-scrollbar-thumb) var(--tw-scrollbar-track)",
    },
  });
});

const mapControlVariants = plugin(({ addVariant }) => {
  addVariant("popup-content", "& .maplibregl-popup-content");
  addVariant("popup-tip", "& .maplibregl-popup-tip");
  addVariant("attrib", "& .maplibregl-ctrl-attrib");
  addVariant("attrib-link", "& .maplibregl-ctrl-attrib a");
});

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
        body: bodyWidth,
      },
      maxWidth: {
        body: bodyWidth,
        side: "calc(30.6rem + 0.75rem)",
      },
      screens: {
        body: bodyWidth,
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
      },
      typography: {
        DEFAULT: {
          css: {
            // Theme the typography plugin through its color variables,
            // so all prose elements (bold, headings, links, etc.) use brand colors.
            "--tw-prose-body": colors.blue.DEFAULT,
            "--tw-prose-headings": colors.blue.DEFAULT,
            "--tw-prose-lead": colors.blue.DEFAULT,
            "--tw-prose-links": colors.blue.DEFAULT,
            "--tw-prose-bold": colors.blue.DEFAULT,
            "--tw-prose-counters": colors.blue.DEFAULT,
            "--tw-prose-quotes": colors.blue.DEFAULT,
            "--tw-prose-captions": colors.blue.DEFAULT,
            "--tw-prose-code": colors.blue.DEFAULT,
            a: {
              "&:hover": {
                color: colors.orange[600],
              },
            },
            h3: {
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
    scrollbarColorUtilities,
    mapControlVariants,
  ],
};
export default config;
