import data from "@/data/data/cafes.json";
import BasePage from "@/app/components/BasePage";
import { Metadata } from "next";
import { BASE_URL } from "@/app/constants";
import { Event, RC } from "@/app/types";
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
import StatsCharts from "./StatsCharts";
import type { LabeledBucket, Stats } from "./types";

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
  const dailyCoverage = numDaysWithEvents / periodDays;

  return (
    <BasePage title={t("title")}>
      <div className="text-blue space-y-3 px-3 pb-6">
        <section className="space-y-3">
          <div className="border-blue bg-blue-250 border-2 px-3 py-2 text-sm">
            {trimTrailingColon(t("period", { periodMonths }))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              value={stats.numRepairCafes.toLocaleString(locale)}
              description={t("rcs", { numRepairCafes: stats.numRepairCafes })}
            />
            <StatCard
              value={stats.numEvents.toLocaleString(locale)}
              description={t("events", { numEvents: stats.numEvents })}
            />
            <StatCard
              value={stats.numDaysWithEvents.toLocaleString(locale)}
              description={t("daysWithEvents", { numDaysWithEvents })}
            />
            <StatCard
              value={dailyCoverage.toLocaleString(locale, {
                style: "percent",
                minimumFractionDigits: 1,
              })}
              description={t("dailyCoverage", {
                dailyCoverage: dailyCoverage.toLocaleString(locale, {
                  style: "percent",
                  minimumFractionDigits: 2,
                }),
              })}
            />
          </div>
          <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2 xl:grid-cols-3">
            <InlineStat>
              {t("eventsPerMonth", {
                numEventsPerMonth: (stats.numEvents / periodMonths).toFixed(2),
              })}
            </InlineStat>
            <InlineStat>
              {t("eventsPerDay", {
                numEventsPerDay: (stats.numEvents / periodDays).toFixed(2),
              })}
            </InlineStat>
            <InlineStat>
              {t("daysWithoutEvents", {
                numDaysWithoutEvents: periodDays - numDaysWithEvents,
              })}
            </InlineStat>
          </div>
        </section>

        <StatsCharts
          stats={stats}
          locale={locale}
          titles={{
            frequency: trimTrailingColon(t("frequencyTitle")),
            day: trimTrailingColon(t("dayTitle")),
            dayType: trimTrailingColon(t("dayTypeTitle")),
            officeHours: trimTrailingColon(t("officeHoursTitle")),
            district: trimTrailingColon(t("districtTitle")),
          }}
        />
      </div>
    </BasePage>
  );
}

function trimTrailingColon(value: string) {
  return value.replace(/:\s*$/, "");
}

function StatCard({
  value,
  description,
}: {
  value: string;
  description: string;
}) {
  return (
    <section className="border-blue border-2 bg-white">
      <div className="bg-blue px-3 py-2 text-sm font-bold text-white">
        {value}
      </div>
      <p className="bg-blue-250 px-3 py-3 text-sm">{description}</p>
    </section>
  );
}

function InlineStat({ children }: { children: string }) {
  return (
    <div className="border-blue bg-blue-250 border-2 px-3 py-3">{children}</div>
  );
}
