import { BASE_URL } from "@/app/constants";
import { Metadata } from "next";
import data from "@/data/data/cafes.json";
import { RC, Event } from "@/app/types";
import getEvents from "@/app/actions/getEvents";
import EventsClient from "./page.client";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

const NUM_MONTHS = 12;

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "cafe-events" });
  const rc = data.find((rc) => rc.slug === slug);
  const name = rc?.name || t("unknown.title");
  return {
    title: t("metadata.title", { name }),
    alternates: {
      canonical: BASE_URL + "cafe/" + slug + "/events",
    },
  };
}

export default async function EventsServer({
  params: { slug, locale },
}: {
  params: { slug: string; locale: string };
}) {
  unstable_setRequestLocale(locale);
  const rc = data.find((rc) => rc.slug === slug) as RC;
  if (!rc) notFound();

  const events: Event[] = await getEvents({
    slug: rc.slug,
    numMonths: NUM_MONTHS,
    debug: true,
    locale,
  });

  return (
    <EventsClient
      rc={rc}
      initialEvents={events}
      numMonths={NUM_MONTHS}
      locale={locale}
    />
  );
}
