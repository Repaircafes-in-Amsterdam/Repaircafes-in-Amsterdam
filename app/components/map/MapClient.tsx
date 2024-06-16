"use client";
import { useParams, useRouter } from "next/navigation";
import { MapRC } from "@/app/types";
import useDistrict from "@/app/useDistrict";
import useIntersectionObserver from "@/app/utils/useIntersectionObserver";
import { useRef } from "react";
import useMap from "@/app/utils/useMap";

export default function MapClient({ data }: { data: MapRC[] }) {
  const router = useRouter();
  const { value: district } = useDistrict();
  const filteredData = data.filter(
    (item) => district === "any" || district === item.district,
  );
  const { slug } = useParams<{ slug: string }>();
  const Map = useMap();
  const mapRef = useRef(null);
  const isMapVisible = useIntersectionObserver(mapRef, true);

  return (
    <div className="hidden h-full w-full md:flex" ref={mapRef}>
      {isMapVisible && (
        <Map
          data={filteredData}
          active={slug}
          onSelect={(slug: string) => router.push(slug ? `/cafe/${slug}` : "/")}
        />
      )}
    </div>
  );
}
