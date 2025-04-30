"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Header } from "../header";
import { SolValueWrapper } from "../sol-value-wrapper";
import { shortenAddress } from "@/lib/utils";
import { Treemap, Tooltip } from "recharts";
import React, { useMemo } from "react";

const TREEMAP_COLORS = [
  "#80F28C",
  "#6AC974",
  "#54A05C",
  "#FFFFFF",
  "#E3E3E3",
  "#A8A8A8",
  "#6B7280",
  "#595F6A",
  "#4D525C",
  "#444951",
  "#3B3F48",
  "#33363F",
  "#2B2D36",
  "#24262E",
  "#1E2027",
  "#191A21",
  "#14151B",
  "#101117",
  "#0C0D12",
];

interface GenericTreemapChartProps<T> {
  title: string;
  description: string;
  data: T[];
  idKey: keyof T;
  valueKey: keyof T;
  labelKey?: keyof T;
  solValues?: boolean;
  limit?: number;
}

export function GenericTreemapChart<T>({
  title,
  description,
  data,
  idKey,
  valueKey,
  labelKey,
  solValues = false,
  limit = 10,
}: GenericTreemapChartProps<T>) {
  const processedData = useMemo(() => {
    const filtered = data.filter((item) => item[idKey]);
    const total = filtered.reduce(
      (sum, item) => sum + (item[valueKey] as number),
      0
    );

    const sorted = [...filtered].sort(
      (a, b) => (b[valueKey] as number) - (a[valueKey] as number)
    );

    return sorted.slice(0, limit).map((item, idx) => {
      const value = item[valueKey] as number;
      const percentage = total > 0 ? (value / total) * 100 : 0;

      const fill =
        TREEMAP_COLORS[idx] || TREEMAP_COLORS[TREEMAP_COLORS.length - 1];
      const textColor = idx < 4 ? "#000" : "#fff";

      return {
        id: `${item[idKey] || `unknown-${idx}`}`,
        label: shortenAddress(
          labelKey ? (item[labelKey] as string) : (item[idKey] as string)
        ),
        value,
        fill,
        textColor,
        percentage,
      };
    });
  }, [data, idKey, valueKey, labelKey, limit]);

  return (
    <div className="flex-1 w-full max-w-full flex flex-col gap-4">
      <Header title={title} description={description} />
      <Card>
        <CardContent className="px-4 py-2">
          <ChartContainer config={{}}>
            <Treemap
              data={processedData}
              dataKey="value"
              nameKey="id"
              stroke="#333"
              animationDuration={500}
              type="flat"
              content={<CustomTreemapNode />}
            >
              <Tooltip
                content={
                  <CustomTreemapTooltip
                    solValues={solValues}
                    valueLabel={solValues ? "SOL Extracted" : "Transactions"}
                  />
                }
              />
            </Treemap>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

const CustomTreemapTooltip = ({
  active,
  payload,
  solValues = false,
  valueLabel = "Value",
}: {
  active?: boolean;
  payload?: any;
  solValues?: boolean;
  valueLabel?: string;
}) => {
  if (!active || !payload || !payload.length) return null;

  const { label, value, percentage } = payload[0].payload;

  return (
    <div className="bg-black p-3 rounded-md shadow text-white space-y-2 text-sm min-w-[160px]">
      <div className="font-semibold text-base text-[hsl(var(--brand))]">
        {label}
      </div>
      <div className="flex justify-between gap-4">
        <span>{valueLabel}</span>
        {solValues ? (
          <SolValueWrapper value={value?.toFixed(2)} size={12} />
        ) : (
          <span>{value}</span>
        )}
      </div>
      <div className="flex justify-between">
        <span>% of Total</span>
        <span>{percentage?.toFixed(2)}%</span>
      </div>
    </div>
  );
};

const CustomTreemapNode = React.forwardRef<SVGGElement, any>((props, ref) => {
  const { x, y, width, height, label, fill, textColor, percentage } = props;

  return (
    <g ref={ref}>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{ fill, stroke: "#333" }}
      />
      {width > 60 && height > 40 && (
        <foreignObject x={x} y={y} width={width} height={height}>
          <div
            className="p-1 text-xs leading-tight"
            style={{
              height: "100%",
              width: "100%",
              color: textColor,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              textAlign: "center",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontWeight: 600,
              fontSize: "16px",
            }}
          >
            <span className="truncate px-2">{label}</span>
            <span className="text-[18px] opacity-80">
              {percentage?.toFixed(2)}%
            </span>
          </div>
        </foreignObject>
      )}
    </g>
  );
});
CustomTreemapNode.displayName = "CustomTreemapNode";
