import { BASE_URL } from "@/app/constants";
import { Metadata } from "next";
import data from "@/data/data.json";
import { RC, Event } from "@/app/types";
import BasePage from "@/app/components/BasePage";
import getEvents from "@/app/actions/getEvents";
import EventsClient from "./page.client";
import { getTranslations } from "next-intl/server";

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
  const rc = data.find((rc) => rc.slug === slug) as RC;
  if (!rc) {
    return (
      <BasePage title="Onbekend Repair Café">
        <div className="p-3">
          Helaas, dit Repair Café is niet bekend bij ons.
        </div>
      </BasePage>
    );
  }

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
