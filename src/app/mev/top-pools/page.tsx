"use client";

import PoolsTreemapChart from "@/components/charts/pools-treemap-chart";
import { TopEntitiesPageLayout } from "@/components/layouts/entities-grid";
import TopPoolsTable from "@/components/tables/top-pools-table";
import { aggregatedMevData } from "@/lib/aggregated-mev-data";
import { useState } from "react";

const MevTopPoolsPage = () => {
  const [dataType, setDataType] = useState<"All" | "Daily">("All");
  const [mevSelectedDay, setMevSelectedDay] = useState<string>(
    aggregatedMevData[0].date
  );

  return (
    <TopEntitiesPageLayout
      title="Top Pools"
      description="Top pools by MEV activity, ranked by SOL extracted and TX count."
      dataType={dataType}
      setDataType={setDataType}
      selectedDay={mevSelectedDay}
      setSelectedDay={setMevSelectedDay}
      leftChart={
        <PoolsTreemapChart
          type={dataType}
          selectedDay={mevSelectedDay}
          sortBy="sol"
          solValues
        />
      }
      leftTable={<TopPoolsTable selectedDay={mevSelectedDay} type={dataType} />}
      rightChart={
        <PoolsTreemapChart
          type={dataType}
          selectedDay={mevSelectedDay}
          sortBy="tx"
        />
      }
      rightTable={
        <TopPoolsTable
          selectedDay={mevSelectedDay}
          type={dataType}
          sortBy="tx"
        />
      }
    />
  );
};

export default MevTopPoolsPage;
