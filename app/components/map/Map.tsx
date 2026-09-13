"use client";
import { useMemo, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { Map as MapLibreMap } from "@vis.gl/react-maplibre";
import {
  LngLatBounds,
  setWorkerUrl,
  type StyleSpecification,
} from "maplibre-gl";
import { MapRC } from "../../types";
import MapMarker from "./MapMarker";
import MapZoomControl from "./MapZoomControl";
import classes from "../../utils/classes";
import mapStyle from "./mapStyle.generated.json";

const bakedMapStyle = mapStyle as StyleSpecification;

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
  const [showMarkerLabels, setShowMarkerLabels] = useState(false);
  // Render north-to-south so southern markers paint on top for the 3D stacking effect.
  const sortedData = useMemo(
    () => data.slice().sort((a, b) => b.coordinate[0] - a.coordinate[0]),
    [data],
  );

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
        mapStyle={bakedMapStyle}
        attributionControl={{ compact: false }}
        dragRotate={false}
        touchPitch={false}
        pitchWithRotate={false}
        touchZoomRotate={true}
        // Eliminate tile cross-fade rendering loops on initial load.
        fadeDuration={0}
        onLoad={(event) => {
          const map = event.target;

          // Keep pinch-zoom but disable the two-finger twist gesture that rotates the map.
          map.touchZoomRotate.disableRotation();
          map.keyboard.disableRotation();
        }}
        onZoom={(event) => setShowMarkerLabels(() => event.viewState.zoom > 13)}
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
            showLabel={showMarkerLabels}
          />
        ))}
        <MapZoomControl />
      </MapLibreMap>
    </div>
  );
}
