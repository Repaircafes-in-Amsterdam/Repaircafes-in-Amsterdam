"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { LabeledBucket, Stats } from "./types";

const PIE_COLORS = [
  "#2D2E82",
  "#ED6A42",
  "#5A5DB8",
  "#EF8565",
  "#B7B9FF",
  "#1F205A",
  "#F4B29D",
  "#7E82D9",
];

const BAR_COLOR = "#2D2E82";
const RADIAN = Math.PI / 180;

type PieLabelProps = {
  cx?: number;
  cy?: number;
  midAngle?: number;
  outerRadius?: number | string;
  percent?: number;
  name?: string;
};

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

type PieChartCardProps = {
  title: string;
  buckets: LabeledBucket[];
  locale: string;
};

function formatPercent(value: number, locale: string) {
  return value.toLocaleString(locale, {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

function renderPieLabel(locale: string) {
  return function PieSliceLabel({
    cx = 0,
    cy = 0,
    midAngle = 0,
    outerRadius = 0,
    percent = 0,
    name = "",
  }: PieLabelProps) {
    const radius = Number(outerRadius) + 22;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fill="#2D2E82"
        fontSize={12}
      >
        <tspan x={x} dy="-0.15em">
          {name}
        </tspan>
        <tspan x={x} dy="1.2em" fill="#ED6A42" fontSize={11}>
          {formatPercent(percent, locale)}
        </tspan>
      </text>
    );
  };
}

function PieChartCard({ title, buckets, locale }: PieChartCardProps) {
  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(locale),
    [locale],
  );
  const data = useMemo(
    () => buckets.filter((bucket) => bucket.value > 0),
    [buckets],
  );
  const total = useMemo(
    () => data.reduce((sum, bucket) => sum + bucket.value, 0),
    [data],
  );

  return (
    <article className="border-blue border-2 bg-white">
      <div className="bg-blue flex items-center justify-between gap-3 px-3 py-2 text-white">
        <h2 className="font-bold">{title}</h2>
      </div>
      <div className="bg-blue-250 h-72 px-2 py-3">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 16, right: 44, bottom: 16, left: 44 }}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius="68%"
              // paddingAngle={data.length > 1 ? 2 : 0}
              labelLine
              label={renderPieLabel(locale)}
              isAnimationActive={false}
            >
              {data.map((bucket, index) => (
                <Cell
                  key={bucket.id}
                  fill={PIE_COLORS[index % PIE_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => {
                const numericValue = Number(value);

                return [
                  `${numberFormatter.format(numericValue)} (${formatPercent(
                    total === 0 ? 0 : numericValue / total,
                    locale,
                  )})`,
                ];
              }}
              contentStyle={{
                borderRadius: "0",
                border: "2px solid #2D2E82",
                boxShadow: "none",
                color: "#2D2E82",
              }}
              itemStyle={{ color: "#2D2E82" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}

type DistrictTooltipProps = {
  active?: boolean;
  payload?: ReadonlyArray<{ value?: unknown }>;
  label?: string | number;
  locale: string;
};

function DistrictTooltip({
  active,
  payload,
  label,
  locale,
}: DistrictTooltipProps) {
  const t = useTranslations("stats");

  if (!active || !payload?.length) {
    return null;
  }

  const value = Number(payload[0].value ?? 0);
  const district = String(label ?? "");
  const formattedValue = new Intl.NumberFormat(locale).format(value);

  return (
    <div className="border-blue text-blue border-2 bg-white px-3 py-2 text-sm">
      {t("districtTooltip", {
        value: formattedValue,
        district,
      })}
    </div>
  );
}

function DistrictChart({
  title,
  buckets,
  locale,
}: {
  title: string;
  buckets: LabeledBucket[];
  locale: string;
}) {
  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(locale),
    [locale],
  );
  const data = useMemo(
    () =>
      [...buckets].sort(
        (left, right) =>
          right.value - left.value || left.label.localeCompare(right.label),
      ),
    [buckets],
  );
  const chartHeight = Math.max(320, data.length * 44);

  return (
    <article className="border-blue border-2 bg-white lg:col-span-2">
      <div className="bg-blue px-3 py-2 text-white">
        <h2 className="font-bold">{title}</h2>
      </div>
      <div className="bg-blue-250 px-3 py-3" style={{ height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 8, right: 32, bottom: 8, left: 8 }}
          >
            <CartesianGrid stroke="#B7B9FF" horizontal={false} />
            <XAxis
              type="number"
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#2D2E82", fontSize: 12 }}
            />
            <YAxis
              type="category"
              dataKey="label"
              width={110}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#2D2E82", fontSize: 13 }}
            />
            <Tooltip
              content={(props) => (
                <DistrictTooltip {...props} locale={locale} />
              )}
            />
            <Bar dataKey="value" fill={BAR_COLOR} radius={[0, 0, 0, 0]}>
              <LabelList
                dataKey="value"
                position="right"
                formatter={(value) =>
                  numberFormatter.format(Number(value ?? 0))
                }
                fill="#2D2E82"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}

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
