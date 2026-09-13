// Dependency-free reimplementation of MapLibre's fitBounds camera math
// (bearing/pitch assumed 0), using plain Web Mercator arithmetic. Lets
// MapPreview compute the exact zoom/center the real map will pick for a
// given container size, without loading maplibre-gl itself.

const TILE_SIZE = 512;

export interface LngLatBoundsLike {
  west: number;
  south: number;
  east: number;
  north: number;
}

export interface Camera {
  centerLng: number;
  centerLat: number;
  zoom: number;
}

export function lngToMercatorX(lng: number): number {
  return (180 + lng) / 360;
}

export function latToMercatorY(lat: number): number {
  const rad = (lat * Math.PI) / 180;
  return (
    (180 - (180 / Math.PI) * Math.log(Math.tan(Math.PI / 4 + rad / 2))) / 360
  );
}

export function mercatorYToLat(y: number): number {
  const y2 = 180 - y * 360;
  return (360 / Math.PI) * Math.atan(Math.exp((y2 * Math.PI) / 180)) - 90;
}

export function worldSize(zoom: number): number {
  return TILE_SIZE * 2 ** zoom;
}

export function boundsFromCoordinates(
  coordinates: readonly (readonly [number, number])[], // [lat, lng] pairs
): LngLatBoundsLike {
  let west = Infinity;
  let south = Infinity;
  let east = -Infinity;
  let north = -Infinity;
  for (const [lat, lng] of coordinates) {
    if (lng < west) west = lng;
    if (lng > east) east = lng;
    if (lat < south) south = lat;
    if (lat > north) north = lat;
  }
  return { west, south, east, north };
}

// Matches MapLibre's Map#fitBounds camera calculation for a symmetric
// padding: the zoom that fits `bounds` into `containerWidth`x`containerHeight`
// (minus padding on every side), and the bounds' geographic center.
export function fitBoundsCamera(
  bounds: LngLatBoundsLike,
  containerWidth: number,
  containerHeight: number,
  padding: number,
): Camera {
  const westX = lngToMercatorX(bounds.west);
  const eastX = lngToMercatorX(bounds.east);
  const northY = latToMercatorY(bounds.north);
  const southY = latToMercatorY(bounds.south);

  const spanX = Math.abs(eastX - westX);
  const spanY = Math.abs(southY - northY);

  const availWidth = Math.max(containerWidth - padding * 2, 1);
  const availHeight = Math.max(containerHeight - padding * 2, 1);

  const zoomX = Math.log2(availWidth / (spanX * TILE_SIZE));
  const zoomY = Math.log2(availHeight / (spanY * TILE_SIZE));

  return {
    centerLng: ((westX + eastX) / 2) * 360 - 180,
    centerLat: mercatorYToLat((northY + southY) / 2),
    zoom: Math.min(zoomX, zoomY),
  };
}
