"use client";

import { useEffect, useState } from "react";
import type { Stats } from "./types";
import PieChartCard from "./PieChartCard";
import DistrictChart from "./DistrictChart";

type StatsChartsProps = {
  stats: Stats;
  locale: string;
  titles: {
    frequency: string;
    day: string;
    dayType: string;
    officeHours: string;
    district: string;
  };
};

function LoadingCard() {
  return (
    <div className="border-blue bg-blue-250 h-[24rem] animate-pulse border-2" />
  );
}

export default function StatsCharts({
  stats,
  locale,
  titles,
}: StatsChartsProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="grid gap-3 lg:grid-cols-2">
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
        <div className="lg:col-span-2">
          <LoadingCard />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <PieChartCard
        title={titles.frequency}
        buckets={stats.frequencyBuckets}
        locale={locale}
      />
      <PieChartCard
        title={titles.day}
        buckets={stats.dayBuckets}
        locale={locale}
      />
      <PieChartCard
        title={titles.dayType}
        buckets={stats.dayTypeBuckets}
        locale={locale}
      />
      <PieChartCard
        title={titles.officeHours}
        buckets={stats.officeHoursBuckets}
        locale={locale}
      />
      <DistrictChart
        title={titles.district}
        buckets={stats.districtBuckets}
        locale={locale}
      />
    </div>
  );
}
