"use client";

import { getAggregatedAttackers } from "@/lib/agg-precalculated-data";
import { GenericTreemapChart } from "./generic-treemap-chart";

interface AttackersTreemapChartProps {
  type: "All" | "Daily";
  selectedDay?: string;
  sortBy: "sol" | "tx";
}

export default function AttackersTreemapChart({
  type = "All",
  selectedDay,
  sortBy,
}: AttackersTreemapChartProps) {
  const { attackers } = getAggregatedAttackers(type, selectedDay);

  const mappedData = attackers.map((attacker) => ({
    id: attacker.attacker_address,
    label: attacker.attacker_address,
    value:
      sortBy === "sol" ? attacker.victim_real_sol_extracted : attacker.tx_count,
    percentage: attacker.percentage ?? 0,
  }));

  const title =
    sortBy === "sol"
      ? "Top Attackers by SOL Extracted"
      : "Top Attackers by TX Count";

  const description =
    sortBy === "sol"
      ? "Top attackers ranked by total SOL extracted."
      : "Top attackers ranked by transaction count.";

  return (
    <GenericTreemapChart
      title={title}
      description={description}
      data={mappedData}
      idKey="id"
      valueKey="value"
      solValues={sortBy === "sol"}
    />
  );
}
