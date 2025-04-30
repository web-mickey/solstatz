"use client";

import {
  getAggregatedTokens,
  getProperTotal,
} from "@/lib/agg-precalculated-data";
import { GenericTreemapChart } from "./generic-treemap-chart";

interface TopTokensTreemapChartProps {
  solValues?: boolean;
  type: "All" | "Daily";
  selectedDay?: string;
  sortBy: "sol" | "tx";
}

export default function TopTokensTreemapChart({
  solValues = false,
  type = "All",
  selectedDay,
  sortBy,
}: TopTokensTreemapChartProps) {
  const rawData = getAggregatedTokens(type, selectedDay);
  const total = getProperTotal(type, solValues, selectedDay);

  const mappedData = rawData.map((token) => ({
    id: token.token_address,
    label: token.token_address,
    value: sortBy === "sol" ? token.victim_real_sol_extracted : token.tx_count,
    percentage:
      total > 0
        ? ((sortBy === "sol"
            ? token.victim_real_sol_extracted
            : token.tx_count) /
            total) *
          100
        : 0,
  }));

  const title =
    sortBy === "sol" ? "Top Tokens by SOL Extracted" : "Top Tokens by TX Count";
  const description =
    sortBy === "sol"
      ? "Top tokens ranked by total SOL extracted."
      : "Top tokens ranked by transaction count.";

  return (
    <GenericTreemapChart
      title={title}
      description={description}
      data={mappedData}
      idKey="id"
      valueKey="value"
      solValues={sortBy === "sol" && solValues}
    />
  );
}
