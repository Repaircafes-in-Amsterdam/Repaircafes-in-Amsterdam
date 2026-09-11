// Pre-baking the map style to prevent runtime style tree invalidation and main-thread recomputations.
import { NextResponse } from "next/server";
import type { StyleSpecification, LayerSpecification } from "maplibre-gl";
import versatilesWaterSource from "@/app/components/map/versatilesWaterSource";
import extraCanalLinesLayer from "@/app/components/map/extraCanalLinesLayer";

export const dynamic = "force-static";
export const revalidate = 604800; // 1 week

export async function GET() {
  const res = await fetch("https://tiles.openfreemap.org/styles/positron", {
    next: { revalidate: 604800 },
  });

  if (!res.ok) {
    return new NextResponse("Failed to fetch map style", { status: 502 });
  }

  const style: StyleSpecification = await res.json();

  // Add versatiles-water source
  style.sources["versatiles-water"] = versatilesWaterSource;

  // Insert extra canal lines layer before waterway
  const waterwayIndex = style.layers.findIndex((l) => l.id === "waterway");
  if (waterwayIndex !== -1) {
    style.layers.splice(
      waterwayIndex,
      0,
      extraCanalLinesLayer as LayerSpecification,
    );
  } else {
    style.layers.push(extraCanalLinesLayer as LayerSpecification);
  }

  for (const layer of style.layers) {
    // Show highway shield on higher zoom level
    if (layer.id === "highway-shield-non-us") {
      layer.minzoom = 13;
      layer.maxzoom = 24;
    }

    // Making text labels more blue
    if (layer.id === "label_city_capital") {
      layer.paint = {
        ...layer.paint,
        "text-color": "#2D2E82",
      };
    }

    if (layer.id === "label_village" || layer.id === "label_other") {
      layer.paint = {
        ...layer.paint,
        "text-color": "#1F205A",
      };
    }

    // Making water more blue
    if (layer.id === "water") {
      layer.paint = {
        ...layer.paint,
        "fill-color": "#bdbfc6",
      };
    }
  }

  return NextResponse.json(style, {
    headers: {
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
