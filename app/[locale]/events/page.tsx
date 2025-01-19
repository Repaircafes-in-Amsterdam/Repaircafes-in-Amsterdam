import data from "@/data/data/cafes.json";
import BasePage from "@/app/components/BasePage";
import { Metadata } from "next";
import { BASE_URL } from "@/app/constants";
import { EventRC } from "@/app/types";
import ListItem from "./ListItem";
import { Suspense, use } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  const { locale } = params;

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

export default function Page(props: { params: Promise<{ locale: string }> }) {
  const params = use(props.params);

  const { locale } = params;

  setRequestLocale(locale);
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
