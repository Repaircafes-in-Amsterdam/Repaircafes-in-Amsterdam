"use client";

import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { LabeledBucket } from "./types";

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

const RADIAN = Math.PI / 180;

type PieLabelProps = {
  cx?: number;
  cy?: number;
  midAngle?: number;
  outerRadius?: number | string;
  percent?: number;
  name?: string;
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

export default function PieChartCard({
  title,
  buckets,
  locale,
}: PieChartCardProps) {
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
      <div className="bg-blue-250 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 16, right: 44, bottom: 16, left: 44 }}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              startAngle={90}
              endAngle={-270}
              outerRadius="60%"
              labelLine={{ stroke: "#2D2E82" }}
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
