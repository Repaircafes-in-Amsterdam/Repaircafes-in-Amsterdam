"use client";
import { useLayoutEffect, useRef, useState } from "react";
import classes from "../../utils/classes";
import { fitBoundsCamera } from "./mercatorFit";
import {
  PREVIEW_BOUNDS,
  PREVIEW_NARROW,
  PREVIEW_PADDING,
  PREVIEW_SWITCH_WIDTH,
  PREVIEW_WIDE,
  type PreviewBreakpoint,
} from "./mapPreviewMeta";

const NARROW_ZOOM = fitBoundsCamera(
  PREVIEW_BOUNDS,
  PREVIEW_NARROW.width,
  PREVIEW_NARROW.height,
  PREVIEW_PADDING,
).zoom;
const WIDE_ZOOM = fitBoundsCamera(
  PREVIEW_BOUNDS,
  PREVIEW_WIDE.width,
  PREVIEW_WIDE.height,
  PREVIEW_PADDING,
).zoom;

// How much to scale the breakpoint's source image so it shows the same
// camera MapLibre's fitBounds would pick for this container size — matching
// exactly when possible, falling back to an object-fit:cover-style scale
// (still centered on the right point) when the ideal view would need more
// area than the source image contains.
function scaleFor(
  breakpoint: PreviewBreakpoint,
  breakpointZoom: number,
  containerWidth: number,
  containerHeight: number,
) {
  const targetZoom = fitBoundsCamera(
    PREVIEW_BOUNDS,
    containerWidth,
    containerHeight,
    PREVIEW_PADDING,
  ).zoom;
  const idealScale = 2 ** (targetZoom - breakpointZoom);
  const minCoverScale = Math.max(
    containerWidth / breakpoint.width,
    containerHeight / breakpoint.height,
  );
  return Math.max(idealScale, minCoverScale);
}

// Static AVIF snapshots of the basemap (a "narrow" and a "wide" crop, see
// mapPreviewMeta.ts), shown while MapLibre GL JS loads and renders. Scaled
// via fitBoundsCamera so the crop lines up with whatever camera the real map
// will pick for the current container size — see mercatorFit.ts.
export default function MapPreview({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null,
  );

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Read the size synchronously so the first paint is already correct,
    // rather than waiting on ResizeObserver's (sometimes delayed) initial
    // callback.
    const rect = container.getBoundingClientRect();
    setSize({ width: rect.width, height: rect.height });

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const containerWidth = size?.width ?? PREVIEW_WIDE.width;
  const containerHeight = size?.height ?? PREVIEW_WIDE.height;
  const narrow = containerWidth < PREVIEW_SWITCH_WIDTH;
  const breakpoint = narrow ? PREVIEW_NARROW : PREVIEW_WIDE;
  const breakpointZoom = narrow ? NARROW_ZOOM : WIDE_ZOOM;
  const scale = scaleFor(
    breakpoint,
    breakpointZoom,
    containerWidth,
    containerHeight,
  );

  return (
    <div
      ref={containerRef}
      className={classes(
        "flex h-full w-full items-center justify-center overflow-hidden",
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- fixed pre-compressed AVIF, positioned via a computed transform rather than next/image's loader. */}
      <img
        src={breakpoint.src}
        alt=""
        aria-hidden="true"
        style={{
          width: breakpoint.width,
          height: breakpoint.height,
          maxWidth: "none",
          transform: `scale(${scale})`,
        }}
      />
    </div>
  );
}
