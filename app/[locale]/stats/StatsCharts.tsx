"use client";

import { useEffect, useMemo, useState } from "react";
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
  "#2563eb",
  "#ef4444",
  "#f59e0b",
  "#10b981",
  "#8b5cf6",
  "#f97316",
  "#06b6d4",
  "#64748b",
];

const BAR_COLOR = "#2563eb";
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
        fill="#0f172a"
        fontSize={12}
      >
        <tspan x={x} dy="-0.15em">
          {name}
        </tspan>
        <tspan x={x} dy="1.2em" fill="#64748b" fontSize={11}>
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
    <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/60">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {numberFormatter.format(total)}
          </p>
        </div>
      </div>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 16, right: 36, bottom: 16, left: 36 }}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius="68%"
              paddingAngle={data.length > 1 ? 2 : 0}
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
                borderRadius: "16px",
                borderColor: "#cbd5e1",
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </article>
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
    <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/60 lg:col-span-2">
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      <div className="mt-4" style={{ height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 8, right: 32, bottom: 8, left: 8 }}
          >
            <CartesianGrid stroke="#e2e8f0" horizontal={false} />
            <XAxis
              type="number"
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <YAxis
              type="category"
              dataKey="label"
              width={110}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#0f172a", fontSize: 13 }}
            />
            <Tooltip
              formatter={(value) => numberFormatter.format(Number(value))}
              contentStyle={{
                borderRadius: "16px",
                borderColor: "#cbd5e1",
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
              }}
            />
            <Bar dataKey="value" fill={BAR_COLOR} radius={[0, 10, 10, 0]}>
              <LabelList
                dataKey="value"
                position="right"
                formatter={(value) =>
                  numberFormatter.format(Number(value ?? 0))
                }
                fill="#0f172a"
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
    <div className="h-[24rem] animate-pulse rounded-3xl border border-slate-200 bg-slate-100" />
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
      <div className="grid gap-4 lg:grid-cols-2">
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
    <div className="grid gap-4 lg:grid-cols-2">
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
