import data from "@/data/data/cafes.json";
import BasePage from "@/app/components/BasePage";
import { Metadata } from "next";
import { BASE_URL } from "@/app/constants";
import { Event, RC } from "@/app/types";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import getEvents from "@/app/actions/getEvents";
import groupBy from "lodash/groupBy";
import type { BucketCount } from "../../utils/stats/countBuckets";
import countBuckets, {
  countDynamicBuckets,
} from "../../utils/stats/countBuckets";
import { FREQUENCY_BUCKET_IDS } from "../../utils/stats/classifyFrequency";
import { DAY_BUCKET_IDS } from "../../utils/stats/classifyDay";
import { DAY_TYPE_BUCKET_IDS } from "../../utils/stats/classifyDayType";
import { OFFICE_HOURS_BUCKET_IDS } from "../../utils/stats/classifyOfficeHours";
import { getCafesStats } from "../../utils/stats/getCafeStats";

type LabeledBucket = {
  id: string;
  label: string;
  value: number;
};

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
  frequencyBuckets: LabeledBucket[];
  dayBuckets: LabeledBucket[];
  dayTypeBuckets: LabeledBucket[];
  officeHoursBuckets: LabeledBucket[];
  districtBuckets: LabeledBucket[];
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
  const districtsT = await getTranslations({ locale, namespace: "districts" });
  const eventsByDate = groupBy(events, (event: Event) => event.dateString);
  const numDaysWithEvents = Object.keys(eventsByDate).length;
  const cafeStats = getCafesStats(data as RC[]);
  const createBuckets = (
    buckets: BucketCount<string>[],
    getLabel: (id: string) => string,
  ): LabeledBucket[] =>
    buckets.map(({ id, value }) => ({
      id,
      label: getLabel(id),
      value,
    }));
  const stats: Stats = {
    numRepairCafes: data.length,
    periodMonths,
    periodDays,
    numEvents: events.length,
    numDaysWithEvents,
    frequencyBuckets: createBuckets(
      countBuckets(cafeStats, FREQUENCY_BUCKET_IDS, (cafe) => cafe.frequency),
      (id) => t(`frequencyBuckets.${id}`),
    ),
    dayBuckets: createBuckets(
      countBuckets(cafeStats, DAY_BUCKET_IDS, (cafe) => cafe.day),
      (id) => t(`dayBuckets.${id}`),
    ),
    dayTypeBuckets: createBuckets(
      countBuckets(cafeStats, DAY_TYPE_BUCKET_IDS, (cafe) => cafe.dayType),
      (id) => t(`dayTypeBuckets.${id}`),
    ),
    officeHoursBuckets: createBuckets(
      countBuckets(
        cafeStats,
        OFFICE_HOURS_BUCKET_IDS,
        (cafe) => cafe.officeHours,
      ),
      (id) => t(`officeHoursBuckets.${id}`),
    ),
    districtBuckets: createBuckets(
      countDynamicBuckets(cafeStats, (cafe) => cafe.district),
      (id) => districtsT(id),
    ),
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
    dayBuckets,
    dayTypeBuckets,
    officeHoursBuckets,
    districtBuckets,
  } = props.stats;
  const { locale } = props;
  const t = await getTranslations({ locale, namespace: "stats" });

  const renderBuckets = (buckets: LabeledBucket[]) => (
    <ul>
      {buckets.map((bucket) => (
        <li key={bucket.id}>
          {bucket.label}: {bucket.value}
        </li>
      ))}
    </ul>
  );

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
              {renderBuckets(frequencyBuckets)}
            </li>
            <li>
              {t("dayTitle")}
              {renderBuckets(dayBuckets)}
            </li>
            <li>
              {t("dayTypeTitle")}
              {renderBuckets(dayTypeBuckets)}
            </li>
            <li>
              {t("officeHoursTitle")}
              {renderBuckets(officeHoursBuckets)}
            </li>
            <li>
              {t("districtTitle")}
              {renderBuckets(districtBuckets)}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
}
