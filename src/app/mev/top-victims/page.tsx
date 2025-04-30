"use client";

import VictimsTreemapChart from "@/components/charts/victims-treemap-chart";
import { TopEntitiesPageLayout } from "@/components/layouts/entities-grid";
import TopVictimsTable from "@/components/tables/top-victims-table";
import { aggregatedMevData } from "@/lib/aggregated-mev-data";
import { useState } from "react";

export default function MevTopVictimsPage() {
  const [dataType, setDataType] = useState<"All" | "Daily">("All");
  const [selectedDay, setSelectedDay] = useState<string>(
    aggregatedMevData[0].date
  );

  return (
    <TopEntitiesPageLayout
      title="Top Victim Wallets"
      description="Top wallets ranked by total SOL lost and transactions."
      dataType={dataType}
      setDataType={setDataType}
      selectedDay={selectedDay}
      setSelectedDay={setSelectedDay}
      leftChart={
        <VictimsTreemapChart
          type={dataType}
          selectedDay={selectedDay}
          sortBy="sol"
          solValues
        />
      }
      leftTable={
        <TopVictimsTable
          selectedDay={selectedDay}
          type={dataType}
          sortBy="sol"
        />
      }
      rightChart={
        <VictimsTreemapChart
          type={dataType}
          selectedDay={selectedDay}
          sortBy="tx"
        />
      }
      rightTable={
        <TopVictimsTable
          selectedDay={selectedDay}
          type={dataType}
          sortBy="tx"
        />
      }
    />
  );
}
