"use client";

import { Card, CardContent } from "@/components/ui/card";
import { getAggregatedValidators } from "@/lib/agg-precalculated-data";
import { getValidatorData, shortenAddress } from "@/lib/utils";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import { Header } from "../header";
import { SolValueWrapper } from "../sol-value-wrapper";

interface ValidatorAggregatedChartProps {
  selectedDay: string;
  type: "All" | "Daily";
  sortBy: "sol" | "tx";
}

const getGreenShade = (percentage: number, max: number) => {
  const normalized = percentage / max;
  const lightness = 30 + normalized * 40;
  return `hsl(140, 70%, ${lightness}%)`;
};

export default function ValidatorAggregatedChart({
  selectedDay,
  type,
  sortBy,
}: ValidatorAggregatedChartProps) {
  const { chartData, maxPercent } = useMemo(() => {
    const allValidators = getAggregatedValidators(type, selectedDay);

    const allProcessed = allValidators.map((v) => ({
      ...v,
      value: sortBy === "sol" ? v.solExtracted : v.txCount,
      percentage: sortBy === "sol" ? v.solExtractedPercentage : v.txPercentage,
    }));

    const sortedTop25 = allProcessed
      .sort((a, b) => b.value - a.value)
      .slice(0, 25);

    const maxPercent = Math.max(...sortedTop25.map((v) => v.percentage), 0);

    return { chartData: sortedTop25, maxPercent };
  }, [selectedDay, type, sortBy]);

  const chartTitle =
    sortBy === "sol"
      ? "Top Validators by SOL Extracted"
      : "Top Validators by TX Count";

  const chartDescription =
    sortBy === "sol"
      ? "Top validators ranked by total extracted SOL."
      : "Top validators ranked by total transaction count.";

  return (
    <div className="flex flex-col gap-4">
      <Header title={chartTitle} description={chartDescription} noMargin />
      <Card>
        <CardContent className="p-4">
          <ResponsiveContainer width="100%" height={650}>
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 20, right: 20, bottom: 20, left: 120 }}
              barCategoryGap="23%"
            >
              <XAxis
                type="number"
                domain={[0, Math.ceil(maxPercent + 2)]}
                tickFormatter={(v) => `${v}%`}
              />
              <YAxis
                dataKey="name"
                type="category"
                width={150}
                tick={<CustomYAxisTick />}
                interval={0}
              />
              <Tooltip
                content={<CustomBarChartTooltip sortBy={sortBy} />}
                cursor={{ fill: "#2A2E35" }}
              />
              <Bar dataKey="percentage" isAnimationActive={false}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getGreenShade(entry.percentage, maxPercent)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

const CustomBarChartTooltip = ({
  active,
  payload,
  sortBy,
}: TooltipProps<any, any> & { sortBy: "sol" | "tx" }) => {
  if (!active || !payload || !payload.length) return null;

  const { validator, solExtracted, txCount, percentage } = payload[0].payload;
  const validatorData = getValidatorData(validator);

  return (
    <div className="bg-black p-3 rounded-md shadow text-white space-y-2 text-sm min-w-[160px]">
      <div className="font-semibold text-base text-[hsl(var(--brand))]">
        {validatorData?.name ?? shortenAddress(validator)}
      </div>
      <div className="flex justify-between">
        <span>{shortenAddress(validator)}</span>
      </div>

      {sortBy === "sol" ? (
        <div className="flex justify-between">
          <span>Extracted</span>
          <SolValueWrapper value={solExtracted?.toFixed(2)} size={12} />
        </div>
      ) : (
        <div className="flex justify-between">
          <span>TX Count</span>
          <span>{txCount}</span>
        </div>
      )}

      <div className="flex justify-between">
        <span>% of Total</span>
        <span>{percentage?.toFixed(2)}%</span>
      </div>
    </div>
  );
};

const truncateLabel = (label: string, maxLength: number) => {
  return label.length > maxLength ? label.slice(0, maxLength) + "…" : label;
};

const CustomYAxisTick = ({ x, y, payload }: any) => {
  return (
    <text
      x={x}
      y={y}
      dy={4}
      dx={-10}
      textAnchor="end"
      fill="#fff"
      fontSize={14}
    >
      {truncateLabel(payload.value, 16)}
    </text>
  );
};
