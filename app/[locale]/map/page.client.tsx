"use client";
import MapPanel from "./MapPanel";
import { MapRC } from "@/app/types";
import useMap from "@/app/utils/useMap";
import useActive from "./useActive";
import { useTranslations } from "next-intl";

export default function ClientPage({ data }: { data: MapRC[] }) {
  const { value, setValue } = useActive();
  const activeData = data.find((rc) => rc.slug === value);
  const Map = useMap();
  const t = useTranslations("map");

  return (
    <div className="relative flex h-full w-full flex-col">
      <h1 className="sr-only">{t("title")}</h1>
      <Map data={data} active={value} onSelect={setValue} />
      {activeData && (
        <MapPanel active={activeData} onClose={() => setValue("")} />
      )}
    </div>
  );
}
