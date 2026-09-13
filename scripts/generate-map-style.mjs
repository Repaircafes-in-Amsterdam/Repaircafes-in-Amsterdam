import path from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { colors, mapWaterColor } from "../colors.mjs";

const STYLE_URL = "https://tiles.openfreemap.org/styles/positron";
const outputPath = path.join(
  process.cwd(),
  "app",
  "components",
  "map",
  "mapStyle.generated.json",
);

const versatilesWaterSource = {
  type: "vector",
  tiles: ["https://tiles.versatiles.org/tiles/osm/{z}/{x}/{y}"],
  minzoom: 0,
  maxzoom: 14,
};

const extraCanalLinesLayer = {
  id: "extra-canal-lines",
  type: "line",
  source: "versatiles-water",
  "source-layer": "water_lines",
  minzoom: 9,
  maxzoom: 12,
  filter: ["==", ["get", "kind"], "canal"],
  layout: {
    "line-cap": "round",
    "line-join": "round",
  },
  paint: {
    "line-color": mapWaterColor,
    "line-width": [
      "interpolate",
      ["linear"],
      ["zoom"],
      9,
      0.3,
      10,
      0.5,
      11,
      0.8,
      12,
      1.2,
    ],
  },
};

function bakeMapStyle(style) {
  style.sources["versatiles-water"] = versatilesWaterSource;

  if (!style.layers.some((layer) => layer.id === extraCanalLinesLayer.id)) {
    const waterwayIndex = style.layers.findIndex(
      (layer) => layer.id === "waterway",
    );

    if (waterwayIndex === -1) {
      style.layers.push(extraCanalLinesLayer);
    } else {
      style.layers.splice(waterwayIndex, 0, extraCanalLinesLayer);
    }
  }

  for (const layer of style.layers) {
    // Show highway shields a bit later on higher zoom level
    if (layer.id === "highway-shield-non-us") {
      layer.minzoom = 13;
      layer.maxzoom = 24;
    }

    // Make text labels blue
    if (layer.paint && "text-color" in layer.paint) {
      layer.paint = {
        ...layer.paint,
        "text-color": colors.blue[600],
      };
    }

    if (layer.id === "label_city_capital") {
      layer.paint = {
        ...layer.paint,
        "text-color": colors.blue.DEFAULT,
      };
    }

    // Make water more blue
    if (layer.id === "water") {
      layer.paint = {
        ...layer.paint,
        "fill-color": mapWaterColor,
      };
    }
  }

  return style;
}

async function hasExistingOutput() {
  try {
    await readFile(outputPath, "utf8");
    return true;
  } catch {
    return false;
  }
}

try {
  const response = await fetch(STYLE_URL, {
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch map style: ${response.status}`);
  }

  const style = await response.json();
  const bakedStyle = bakeMapStyle(style);

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(
    outputPath,
    JSON.stringify(bakedStyle, null, 2) + "\n",
    "utf8",
  );

  console.log(`Generated ${outputPath}`);
} catch (error) {
  if (await hasExistingOutput()) {
    console.warn(`Could not refresh ${outputPath}; keeping existing file.`);
    console.warn(error instanceof Error ? error.message : String(error));
    process.exit(0);
  }

  throw error;
}
