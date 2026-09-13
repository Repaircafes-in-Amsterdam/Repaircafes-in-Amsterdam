// Metadata for the static map preview images (public/map-preview-*.avif),
// used by MapPreview.tsx to reproduce MapLibre's fitBounds camera for the
// current container size. Regenerate the images and update this file
// together if the repair-café bounds drift much or the map style changes
// noticeably — see git history of this file for the capture approach
// (screenshot the live map with `preserveDrawingBuffer` forced on).

// Repair-café coordinate bounds at capture time (see boundsFromCoordinates
// in mercatorFit.ts — this is a frozen snapshot, not derived from live data,
// so the images and the math describing them never disagree).
export const PREVIEW_BOUNDS = {
  west: 4.7963456,
  south: 52.29424,
  east: 5.043302,
  north: 52.4130968,
};

// Matches Map.tsx's `fitBoundsOptions: { padding: 40 }`.
export const PREVIEW_PADDING = 40;

// Below this container width, use the "narrow" image; at or above it, "wide".
export const PREVIEW_SWITCH_WIDTH = 800;

export interface PreviewBreakpoint {
  src: string;
  // CSS pixel size of the viewport the image was captured at — not
  // necessarily the image file's own pixel dimensions (the file may be
  // downsampled from a higher-density capture).
  width: number;
  height: number;
}

export const PREVIEW_NARROW: PreviewBreakpoint = {
  src: "/map-preview-narrow.avif",
  width: 700,
  height: 966,
};

export const PREVIEW_WIDE: PreviewBreakpoint = {
  src: "/map-preview-wide.avif",
  width: 2200,
  height: 1056,
};
