"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { LabeledBucket } from "./types";

const BAR_COLOR = "#2D2E82";

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

export default function DistrictChart({
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
              cursor={false}
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
