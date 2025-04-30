"use client";

import ValidatorAggregatedChart from "@/components/charts/validators-aggregated-chart";
import ValidatorTable from "@/components/tables/validators-table";
import { TopEntitiesPageLayout } from "@/components/layouts/entities-grid";
import { aggregatedMevData } from "@/lib/aggregated-mev-data";
import { useState } from "react";

export default function ValidatorsPage() {
  const [dataType, setDataType] = useState<"All" | "Daily">("All");
  const [selectedDay, setSelectedDay] = useState<string>(
    aggregatedMevData[0].date
  );

  return (
    <TopEntitiesPageLayout
      title="Top Validators"
      description="Top validators by extracted SOL and TX count."
      dataType={dataType}
      setDataType={setDataType}
      selectedDay={selectedDay}
      setSelectedDay={setSelectedDay}
      leftChart={
        <ValidatorAggregatedChart
          type={dataType}
          selectedDay={selectedDay}
          sortBy="sol"
        />
      }
      leftTable={
        <ValidatorTable
          selectedDay={selectedDay}
          type={dataType}
          sortBy="sol"
        />
      }
      rightChart={
        <ValidatorAggregatedChart
          type={dataType}
          selectedDay={selectedDay}
          sortBy="tx"
        />
      }
      rightTable={
        <ValidatorTable selectedDay={selectedDay} type={dataType} sortBy="tx" />
      }
    />
  );
}
