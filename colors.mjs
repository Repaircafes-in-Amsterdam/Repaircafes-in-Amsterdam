// Single source of truth for brand colors, shared by tailwind.config.ts,
// plain Node scripts (scripts/*.mjs), and app TS/TSX code.
export const colors = {
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

// Extra tints only used for data visualizations (stats charts), not part of the Tailwind theme.
export const chartColors = [
  colors.blue.DEFAULT,
  colors.orange.DEFAULT,
  "#5A5DB8",
  colors.orange[450],
  "#B7B9FF",
  colors.blue[600],
  "#F4B29D",
  "#7E82D9",
];

// Accent used for canals/water in the generated map style.
export const mapWaterColor = "#bdbfc6";
