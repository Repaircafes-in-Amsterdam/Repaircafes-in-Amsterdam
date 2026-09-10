"use client";
import { useMemo, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { Map as MapLibreMap } from "@vis.gl/react-maplibre";
import { LngLatBounds, setWorkerUrl } from "maplibre-gl";
import { MapRC } from "../../types";
import MapMarker from "./MapMarker";
import MapZoomControl from "./MapZoomControl";
import classes from "../../utils/classes";
import versatilesWaterSource from "./versatilesWaterSource";
import extraCanalLinesLayer from "./extraCanalLinesLayer";

// Next.js bundling breaks maplibre-gl's default worker URL resolution (import.meta.url), so self-host it.
setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

export default function Map({
  data,
  active,
  onSelect,
  className,
}: {
  data: MapRC[];
  active?: string;
  onSelect?: (slug: string) => void;
  className?: string;
}) {
  // MapRC.coordinate is [lat, lng]; MapLibre expects [lng, lat].
  const bounds = data.reduce(
    (bounds, rc) => bounds.extend([rc.coordinate[1], rc.coordinate[0]]),
    new LngLatBounds(),
  );
  const [zoomLevel, setZoomLevel] = useState<number>(0);
  console.log("zoomLevel: ", zoomLevel);
  // Render north-to-south so southern markers paint on top for the 3D stacking effect.
  const sortedData = useMemo(
    () => data.slice().sort((a, b) => b.coordinate[0] - a.coordinate[0]),
    [data],
  );
  const mapStyleUrl = `https://basemaps.cartocdn.com/gl/positron-gl-style/style.json?key=${process.env.NEXT_PUBLIC_MAP_TILE_API_KEY}`;

  return (
    <div
      className={classes(
        "attrib-link:text-blue! attrib:bg-white! relative flex h-full w-full flex-col",
        className,
      )}
    >
      <MapLibreMap
        id="map-container"
        initialViewState={{ bounds, fitBoundsOptions: { padding: 40 } }}
        mapStyle={mapStyleUrl}
        attributionControl={{ compact: false }}
        onLoad={(event) => {
          const map = event.target;

          if (!map.getSource("versatiles-water")) {
            map.addSource("versatiles-water", versatilesWaterSource);
          }

          if (!map.getLayer("extra-canal-lines")) {
            map.addLayer(extraCanalLinesLayer, "water_shadow");
          }
          // Show minor road layer earlier
          if (map.getLayer("road_minor_case")) {
            map.setLayerZoomRange("road_minor_case", 0, 24);
          }
        }}
        onZoom={(event) => setZoomLevel(event.viewState.zoom)}
        onClick={() => onSelect && onSelect("")}
      >
        {sortedData.map((rc) => (
          <MapMarker
            key={rc.slug}
            position={rc.coordinate as [number, number]}
            onClick={() => onSelect && onSelect(rc.slug)}
            active={rc.slug === active}
            label={rc.name}
            slug={rc.slug}
            showLabel={zoomLevel > 13}
          />
        ))}
        <MapZoomControl />
      </MapLibreMap>
    </div>
  );
}
