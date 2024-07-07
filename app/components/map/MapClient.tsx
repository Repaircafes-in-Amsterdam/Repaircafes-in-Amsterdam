"use client";
import { useParams, useRouter } from "next/navigation";
import { MapRC } from "@/app/types";
import useDistrict from "@/app/useDistrict";
import useIntersectionObserver from "@/app/utils/useIntersectionObserver";
import { useRef } from "react";
import useMap from "@/app/utils/useMap";
import useLinkPostfix from "@/app/utils/useLinkPostfix";
import useOfficeHours from "@/app/useOfficeHours";

export default function MapClient({ data }: { data: MapRC[] }) {
  const router = useRouter();
  const { value: district } = useDistrict();
  const { value: rawOutsideOfficeHours } = useOfficeHours();
  const outsideOfficeHours = rawOutsideOfficeHours === "true";
  const filteredData = data
    .filter((rc) => district === "any" || district === rc.district)
    .filter(
      (rc) =>
        !outsideOfficeHours || (outsideOfficeHours && rc.someOutOfOfficeHours),
    );
  const { slug } = useParams<{ slug: string }>();
  const Map = useMap();
  const mapRef = useRef(null);
  const isMapVisible = useIntersectionObserver(mapRef, true);
  const linkPostfix = useLinkPostfix();

  return (
    <div className="hidden h-full w-full md:flex" ref={mapRef}>
      {isMapVisible && (
        <Map
          data={filteredData}
          active={slug}
          onSelect={(slug: string) =>
            router.push((slug ? `/cafe/${slug}` : "/") + linkPostfix)
          }
        />
      )}
    </div>
  );
}
