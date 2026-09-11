"use client";
import MapPanel from "./MapPanel";
import { MapRC } from "@/app/types";
import useMap from "@/app/utils/useMap";
import useIdle from "@/app/utils/useIdle";
import useActive from "./useActive";
import { useTranslations } from "next-intl";

export default function ClientPage({ data }: { data: MapRC[] }) {
  const { value, setValue } = useActive();
  const activeData = data.find((rc) => rc.slug === value);
  const Map = useMap();
  const isIdle = useIdle();
  const t = useTranslations("map");

  return (
    <div className="relative flex h-full w-full flex-col">
      <h1 className="sr-only">{t("title")}</h1>
      {isIdle && <Map data={data} active={value} onSelect={setValue} />}
      {activeData && (
        <MapPanel active={activeData} onClose={() => setValue("")} />
      )}
    </div>
  );
}
