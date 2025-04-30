"use client";

import {
  getAggregatedVictims,
  getProperTotal,
} from "@/lib/agg-precalculated-data";
import { GenericTreemapChart } from "./generic-treemap-chart";

interface VictimsTreemapChartProps {
  solValues?: boolean;
  limit?: number;
  type: "All" | "Daily";
  selectedDay?: string;
  sortBy: "sol" | "tx";
}

export default function VictimsTreemapChart({
  solValues = false,
  type = "All",
  selectedDay,
  sortBy,
}: VictimsTreemapChartProps) {
  const rawData = getAggregatedVictims(type, selectedDay);
  const total = getProperTotal(type, solValues, selectedDay);

  const mappedData = rawData.map((victim) => ({
    id: victim.victim_wallet_address,
    label: victim.victim_wallet_address,
    value:
      sortBy === "sol" ? victim.victim_real_sol_extracted : victim.tx_count,
    percentage:
      total > 0
        ? ((sortBy === "sol"
            ? victim.victim_real_sol_extracted
            : victim.tx_count) /
            total) *
          100
        : 0,
  }));

  const title =
    sortBy === "sol" ? "Top Victims by SOL Lost" : "Top Victims by TX Count";
  const description =
    sortBy === "sol"
      ? "Top victims ranked by total SOL lost."
      : "Top victims ranked by transaction count.";

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
