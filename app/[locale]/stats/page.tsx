import data from "@/data/data/cafes.json";
import BasePage from "@/app/components/BasePage";
import { Metadata } from "next";
import { BASE_URL } from "@/app/constants";
import { Event, RC } from "@/app/types";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import getEvents from "@/app/actions/getEvents";
import groupBy from "lodash/groupBy";
import getCafeFrequencyStats, {
  type FrequencyBucketCount,
} from "../../utils/getCafeFrequencyStats";

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
  numDaysWithEvents: number;
  frequencyBuckets: { label: string; value: number }[];
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
  const events: Event[] = await getEvents({
    numMonths: periodMonths,
    locale,
  });
  const eventsByDate = groupBy(events, (event: Event) => event.dateString);
  const numDaysWithEvents = Object.keys(eventsByDate).length;
  const frequencyBuckets = getCafeFrequencyStats(data as RC[]).map(
    ({ id, value }: FrequencyBucketCount) => ({
      label: t(`frequencyBuckets.${id}`),
      value,
    }),
  );
  const stats: Stats = {
    numRepairCafes: data.length,
    periodMonths,
    periodDays,
    numEvents: events.length,
    numDaysWithEvents,
    frequencyBuckets,
  };
  return (
    <BasePage title={t("title")}>
      <Suspense>
        <ClientPage stats={stats} locale={locale} />
      </Suspense>
    </BasePage>
  );
}

async function ClientPage(props: { stats: Stats; locale: string }) {
  const {
    numRepairCafes,
    periodMonths,
    periodDays,
    numEvents,
    numDaysWithEvents,
    frequencyBuckets,
  } = props.stats;
  const { locale } = props;
  const t = await getTranslations({ locale, namespace: "stats" });
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
            <li>{t("daysWithEvents", { numDaysWithEvents })}</li>
            <li>
              {t("dailyCoverage", {
                dailyCoverage: (numDaysWithEvents / periodDays).toLocaleString(
                  locale,
                  { style: "percent", minimumFractionDigits: 2 },
                ),
              })}
            </li>
            <li>
              {t("daysWithoutEvents", {
                numDaysWithoutEvents: periodDays - numDaysWithEvents,
              })}
            </li>
            <li>
              {t("frequencyTitle")}
              <ul>
                {frequencyBuckets.map((bucket) => (
                  <li key={bucket.label}>
                    {bucket.label}: {bucket.value}
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
}
