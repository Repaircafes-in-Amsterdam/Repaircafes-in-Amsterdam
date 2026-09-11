import { VectorSourceSpecification } from "maplibre-gl";

const versatilesWaterSource: VectorSourceSpecification = {
  type: "vector",
  tiles: ["https://tiles.versatiles.org/tiles/osm/{z}/{x}/{y}"],
  minzoom: 0,
  maxzoom: 14,
};
export default versatilesWaterSource;
