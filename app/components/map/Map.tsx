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
  // Render north-to-south so southern markers paint on top for the 3D stacking effect.
  const sortedData = useMemo(
    () => data.slice().sort((a, b) => b.coordinate[0] - a.coordinate[0]),
    [data],
  );
  const mapStyleUrl = "https://tiles.openfreemap.org/styles/positron";

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
        dragRotate={false}
        touchPitch={false}
        pitchWithRotate={false}
        touchZoomRotate={true}
        onLoad={(event) => {
          const map = event.target;

          // Keep pinch-zoom but disable the two-finger twist gesture that rotates the map.
          map.touchZoomRotate.disableRotation();
          map.keyboard.disableRotation();

          // There is no data for canals zoom level <12, so pulling in extra one
          if (!map.getSource("versatiles-water")) {
            map.addSource("versatiles-water", versatilesWaterSource);
          }
          // Draw those extra canal lines
          if (!map.getLayer("extra-canal-lines")) {
            // map.addLayer(extraCanalLinesLayer, "water_shadow");
            map.addLayer(extraCanalLinesLayer, "waterway");
          }

          // Show highway shield on higher zoom level
          if (map.getLayer("highway-shield-non-us")) {
            map.setLayerZoomRange("highway-shield-non-us", 13, 24);
          }

          // Making text labels more blue
          if (map.getLayer("label_city_capital")) {
            map.setPaintProperty("label_city_capital", "text-color", "#2D2E82");
          }

          for (const layerId of ["label_village", "label_other"]) {
            if (map.getLayer(layerId)) {
              map.setPaintProperty(layerId, "text-color", "#1F205A");
            }
          }

          // Making water more blue
          if (map.getLayer("water")) {
            map.setPaintProperty("water", "fill-color", "#bdbfc6");
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
