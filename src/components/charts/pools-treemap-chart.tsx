"use client";

import {
  getAggregatedPools,
  getProperTotal,
} from "@/lib/agg-precalculated-data";
import { GenericTreemapChart } from "./generic-treemap-chart";

interface PoolsTreemapChartProps {
  solValues?: boolean;
  type: "All" | "Daily";
  selectedDay?: string;
  sortBy: "sol" | "tx";
}

export default function PoolsTreemapChart({
  solValues = false,
  type = "All",
  selectedDay,
  sortBy,
}: PoolsTreemapChartProps) {
  const rawData = getAggregatedPools(type, selectedDay);
  const total = getProperTotal(type, solValues, selectedDay);

  const mappedData = rawData.map((pool) => ({
    id: pool.lp,
    label: pool.lp,
    value: sortBy === "sol" ? pool.victim_real_sol_extracted : pool.tx_count,
    percentage:
      total > 0
        ? ((sortBy === "sol" ? pool.victim_real_sol_extracted : pool.tx_count) /
            total) *
          100
        : 0,
  }));

  const title =
    sortBy === "sol" ? "Top Pools by SOL Extracted" : "Top Pools by TX Count";
  const description =
    sortBy === "sol"
      ? "Top pools ranked by total SOL extracted."
      : "Top pools ranked by transaction count.";

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
