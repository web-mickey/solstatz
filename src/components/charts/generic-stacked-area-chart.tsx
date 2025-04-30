import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";
import { dayFormatter } from "@/lib/utils";
import { SolValueWrapper } from "../sol-value-wrapper";
import { CHART_COLORS } from "@/lib/constants";

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color?: string }>;
  label?: string;
}

const DefaultTooltip: React.FC<TooltipProps & { solValues?: boolean }> = ({
  active,
  payload,
  label,
  solValues,
}) => {
  if (!active || !payload || payload.length === 0) return null;

  const total = payload.reduce((sum, entry) => sum + (entry.value || 0), 0);

  return (
    <div className="bg-black p-3 rounded-md shadow text-white space-y-2 text-sm min-w-[220px]">
      <div className="font-semibold text-base text-[hsl(var(--brand))]">
        {dayFormatter(label ?? "")}
      </div>

      <div className="flex justify-between">
        <span>Total</span>
        <span>
          {solValues ? (
            <SolValueWrapper value={total.toFixed(2)} size={12} />
          ) : (
            total.toFixed(2)
          )}
        </span>
      </div>

      <div className="border-t border-white/20 my-2"></div>

      {payload.map((entry, idx) => {
        const percentage =
          total > 0 ? ((entry.value / total) * 100).toFixed(2) : "0.00";
        const valueText = `${entry.value.toFixed(2)} (${percentage}%)`;

        return (
          <div key={idx} className="flex justify-between gap-4">
            <span style={{ color: entry.color }}>
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

export interface GenericStackedAreaChartProps {
  data: Array<Record<string, any>>;
  xDataKey: string;
  seriesKeys: string[];
  title: string;
  description?: string;
  colors?: string[];
  customTooltip?: React.ComponentType<TooltipProps>;
  showLegend?: boolean;
  solValues?: boolean;
}

export default function GenericStackedAreaChart({
  data,
  xDataKey,
  seriesKeys,
  title,
  description,
  colors = CHART_COLORS,
  customTooltip,
  showLegend = true,
  solValues = false,
}: GenericStackedAreaChartProps) {
  const chartColors = seriesKeys.map((_, idx) => colors[idx % colors.length]);
  const TooltipComponent = customTooltip ?? DefaultTooltip;

  return (
    <div className="flex flex-col gap-4 w-full">
      {title && (
        <div>
          <Header title={title} description={description} />
        </div>
      )}
      <Card>
        <CardContent>
          <div style={{ width: "100%", height: "400px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis
                  dataKey={xDataKey}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                    });
                  }}
                />
                <YAxis
                  label={{
                    value: solValues ? "SOL" : "Transactions",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip content={<TooltipComponent solValues={solValues} />} />
                {showLegend && (
                  <Legend
                    formatter={(value) =>
                      value.charAt(0).toUpperCase() + value.slice(1)
                    }
                  />
                )}
                {seriesKeys.map((key, idx) => (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stackId="1"
                    stroke={chartColors[idx]}
                    fill={chartColors[idx]}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
