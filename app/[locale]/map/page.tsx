import { Suspense } from "react";
import { Metadata } from "next";
import { BASE_URL } from "@/app/constants";
import getMapData from "@/app/utils/getMapData";
import ClientPage from "./page.client";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  const { locale } = params;

  const t = await getTranslations({ locale, namespace: "map.metadata" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: BASE_URL + "map",
    },
  };
}

export default async function Page(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const { locale } = params;

  setRequestLocale(locale);
  const mapData = getMapData();
  return (
    <Suspense>
      <ClientPage data={mapData} />
    </Suspense>
  );
}
