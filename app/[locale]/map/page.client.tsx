"use client";
import MapPanel from "./MapPanel";
import { MapRC } from "@/app/types";
import useMap from "@/app/utils/useMap";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function ClientPage({ data }: { data: MapRC[] }) {
  const [active, setActive] = useState("");
  const activeData = data.find((rc) => rc.slug === active);
  const Map = useMap();
  const t = useTranslations("map");

  return (
    <div className="relative flex h-full w-full flex-col">
      <h1 className="sr-only">{t("title")}</h1>
      <Map data={data} active={active} onSelect={setActive} />
      {activeData && (
        <MapPanel active={activeData} onClose={() => setActive("")} />
      )}
    </div>
  );
}
