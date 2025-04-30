"use client";

import { Card, CardContent } from "@/components/ui/card";
import { aggregatedMevData } from "@/lib/aggregated-mev-data";
import { CHART_COLORS } from "@/lib/constants";
import { dayFormatter } from "@/lib/utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Header } from "../header";
import { SolValueWrapper } from "../sol-value-wrapper";

interface SourceStackedBarChartProps {
  solValues?: boolean;
}

type ChartDataPoint = {
  key: string;
  date: string;
  source: string;
  attackerSol: number;
  protocolFee: number;
  lpFee: number;
};

export default function SourceStackedBarChart({
  solValues = false,
}: SourceStackedBarChartProps) {
  const barChartData: ChartDataPoint[] = aggregatedMevData
    .flatMap((dayData) =>
      dayData.df_agg_source.map((sourceData) => ({
        key: `${dayData.date}-${sourceData.source}`,
        date: dayData.date,
        source: sourceData.source,
        attackerSol: sourceData.attacker_sol_extracted_new,
        protocolFee: sourceData.protocol_fee_earned,
        lpFee: sourceData.lp_fee_earned,
      }))
    )
    .sort((a, b) => a.key.localeCompare(b.key));

  const CustomTick = ({ x, y, payload, index }: any) => {
    const sourcesPerDay = 3;
    const positionInGroup = index % sourcesPerDay;
    if (positionInGroup === 1) {
      const parts = payload.value.split("-");
      const date = parts.slice(0, 3).join("-");
      const formattedDate = new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      });
      return (
        <text x={x} y={y} dy={16} textAnchor="middle" fill="#666" fontSize="16">
          {formattedDate}
        </text>
      );
    }
    return null;
  };

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: any;
    label?: string;
  }) => {
    if (!active || !payload || payload.length === 0) return null;

    const [datePart, sourcePart] = label!.split(/-(?=[^-]+$)/);
    const total = payload.reduce(
      (sum: number, entry: any) => sum + entry.value,
      0
    );

    return (
      <div className="bg-black p-3 rounded-md shadow text-white space-y-2 text-sm min-w-[220px]">
        <div className="font-semibold text-base text-[hsl(var(--brand))]">
          {dayFormatter(datePart ?? "")}
        </div>

        <div className="text-md mb-2">
          Source: {sourcePart.charAt(0).toUpperCase() + sourcePart.slice(1)}
        </div>

        <div className="flex justify-between">
          <span>Total</span>
          <span>
            {solValues ? (
              <SolValueWrapper value={total.toFixed(2)} size={12} />
            ) : (
              `${total.toFixed(2)} SOL`
            )}
          </span>
        </div>

        <div className="border-t border-white/20 my-2" />

        {payload.map((entry: any, idx: number) => {
          const percentage =
            total > 0 ? ((entry.value / total) * 100).toFixed(2) : "0.00";
          const valueText = `${entry.value.toFixed(2)} (${percentage}%)`;

          return (
            <div key={idx} className="flex justify-between gap-4">
              <span style={{ color: entry.fill }}>
                {entry.name.charAt(0).toUpperCase() + entry.name.slice(1)}
              </span>
              <span>
                {solValues ? (
                  <SolValueWrapper value={valueText} size={12} />
                ) : (
                  valueText
                )}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <Header
        title="MEV Metrics by Source"
        description="Daily MEV metrics (attacker SOL extracted, protocol fees, LP fees) stacked per source."
      />
      <Card>
        <CardContent className="px-4 py-2">
          <div style={{ width: "100%", height: "400px" }}>
            <ResponsiveContainer>
              <BarChart
                data={barChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="key" tick={<CustomTick />} interval={0} />
                <YAxis
                  label={{ value: "SOL", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "#2A2E35" }}
                />
                <Legend />
                <Bar
                  dataKey="attackerSol"
                  name="Attacker SOL Extracted"
                  stackId="a"
                  stroke={CHART_COLORS[0]}
                  fill={CHART_COLORS[0]}
                  fillOpacity={0.5}
                />
                <Bar
                  dataKey="lpFee"
                  name="LP Fee Earned"
                  stackId="a"
                  stroke={CHART_COLORS[2]}
                  fill={CHART_COLORS[2]}
                  fillOpacity={0.5}
                />
                <Bar
                  dataKey="protocolFee"
                  name="Protocol Fee Earned"
                  stackId="a"
                  stroke={CHART_COLORS[1]}
                  fill={CHART_COLORS[1]}
                  fillOpacity={0.5}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
