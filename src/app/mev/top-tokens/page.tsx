"use client";

import TopTokensTreemapChart from "@/components/charts/top-tokens-treemap-chart";
import { TopEntitiesPageLayout } from "@/components/layouts/entities-grid";
import TopTokensTable from "@/components/tables/top-tokens-table";
import { aggregatedMevData } from "@/lib/aggregated-mev-data";
import { useState } from "react";

export default function TopTokensPage() {
  const [dataType, setDataType] = useState<"All" | "Daily">("All");
  const [selectedDay, setSelectedDay] = useState<string>(
    aggregatedMevData[0].date
  );

  return (
    <TopEntitiesPageLayout
      title="Top Tokens"
      description="Top Tokens for the selected day or all time."
      dataType={dataType}
      setDataType={setDataType}
      selectedDay={selectedDay}
      setSelectedDay={setSelectedDay}
      leftChart={
        <TopTokensTreemapChart
          type={dataType}
          selectedDay={selectedDay}
          sortBy="sol"
          solValues
        />
      }
      leftTable={<TopTokensTable type={dataType} selectedDay={selectedDay} />}
      rightChart={
        <TopTokensTreemapChart
          type={dataType}
          selectedDay={selectedDay}
          sortBy="tx"
        />
      }
      rightTable={
        <TopTokensTable type={dataType} selectedDay={selectedDay} sortBy="tx" />
      }
    />
  );
}
