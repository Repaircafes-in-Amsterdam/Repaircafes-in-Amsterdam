import type { LineLayerSpecification } from "maplibre-gl";

const extraCanalLinesLayer: LineLayerSpecification = {
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
    "line-color": "#d1dbdf",
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
export default extraCanalLinesLayer;
