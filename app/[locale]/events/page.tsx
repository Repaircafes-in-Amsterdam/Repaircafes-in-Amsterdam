import data from "@/data/data/cafes.json";
import BasePage from "@/app/components/BasePage";
import { Metadata } from "next";
import { BASE_URL } from "@/app/constants";
import { EventRC } from "@/app/types";
import ListItem from "./ListItem";
import { Suspense } from "react";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale,
    namespace: "events.metadata",
  });

  return {
    title: t("title"),
    alternates: {
      canonical: BASE_URL + "events",
    },
  };
}

export default function Page({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const t = useTranslations("events");
  const rcs: EventRC[] = data.map((rc) => ({
    name: rc.name,
    slug: rc.slug,
    district: rc.district,
    verified: rc.verified,
  }));
  return (
    <BasePage title={t("title")}>
      <Suspense>
        {rcs.map((rc) => (
          <ListItem key={rc.slug} rc={rc} />
        ))}
      </Suspense>
    </BasePage>
  );
}
