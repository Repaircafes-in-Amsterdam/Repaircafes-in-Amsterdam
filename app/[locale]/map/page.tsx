import { Suspense } from "react";
import { Metadata } from "next";
import { BASE_URL } from "@/app/constants";
import getMapData from "@/app/utils/getMapData";
import ClientPage from "./page.client";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "map.metadata" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: BASE_URL + "map",
    },
  };
}

export default function Page() {
  const mapData = getMapData();
  return (
    <Suspense>
      <ClientPage data={mapData} />
    </Suspense>
  );
}
