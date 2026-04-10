import data from "@/data/data/cafes.json";
import BasePage from "@/app/components/BasePage";
import { Metadata } from "next";
import { BASE_URL } from "@/app/constants";
import { EventRC } from "@/app/types";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import getEvents from "@/app/actions/getEvents";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  const { locale } = params;

  const t = await getTranslations({
    locale,
    namespace: "stats.metadata",
  });

  return {
    title: t("title"),
    alternates: {
      canonical: BASE_URL + "stats",
    },
  };
}

type Stats = {
  numRepairCafes: number;
  periodMonths: number;
  periodDays: number;
  numEvents: number;
};

export default async function Page(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "stats" });

  const periodMonths = 12;
  const periodDays = 365;
  const events: EventRC[] = await getEvents({
    numMonths: periodMonths,
    locale,
  });
  const stats: Stats = {
    numRepairCafes: data.length,
    periodMonths,
    periodDays,
    numEvents: events.length,
  };
  return (
    <BasePage title={t("title")}>
      <Suspense>
        <ClientPage stats={stats} params={props.params} />
      </Suspense>
    </BasePage>
  );
}

async function ClientPage(props: {
  stats: Stats;
  params: Promise<{ locale: string }>;
}) {
  const { numRepairCafes, periodMonths, periodDays, numEvents } = props.stats;
  const t = useTranslations("stats");
  return (
    <div className="prose px-3 pb-3">
      <ul>
        <li>{t("rcs", { numRepairCafes })}</li>
        <li>
          {t("period", { periodMonths })}
          <ul>
            <li>{t("events", { numEvents })}</li>
            <li>
              {t("eventsPerMonth", {
                numEventsPerMonth: (numEvents / periodMonths).toFixed(2),
              })}
            </li>
            <li>
              {t("eventsPerDay", {
                numEventsPerDay: (numEvents / periodDays).toFixed(2),
              })}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
}
