"use client";
import { useParams } from "next/navigation";
import { MapRC } from "@/app/types";
import useDistrict from "@/app/useDistrict";
import useIntersectionObserver from "@/app/utils/useIntersectionObserver";
import { useRef } from "react";
import useMap from "@/app/utils/useMap";
import useLinkPostfix from "@/app/utils/useLinkPostfix";
import useOutsideOfficeHours from "@/app/useOutsideOfficeHours";
import { useRouter } from "@/app/navigation";

export default function MapClient({ data }: { data: MapRC[] }) {
  const router = useRouter();
  const { value: district } = useDistrict();
  const { value: rawOutsideOfficeHours } = useOutsideOfficeHours();
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
    <div className="body:flex hidden h-full w-full" ref={mapRef}>
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
