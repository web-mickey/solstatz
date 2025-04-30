"use client";

import AttackersTreemapChart from "@/components/charts/attackers-treemap-chart";
import { TopEntitiesPageLayout } from "@/components/layouts/entities-grid";
import TopSandwichersTable from "@/components/tables/top-sandwichers-table";
import { aggregatedMevData } from "@/lib/aggregated-mev-data";
import { useState } from "react";

const MevTopSandwichersPage = () => {
  const [dataType, setDataType] = useState<"All" | "Daily">("All");
  const [mevSelectedDay, setMevSelectedDay] = useState<string>(
    aggregatedMevData[0].date
  );

  return (
    <TopEntitiesPageLayout
      title="Top Attacker Wallets"
      description="Top attacker wallets ranked by SOL extracted or transaction count."
      dataType={dataType}
      setDataType={setDataType}
      selectedDay={mevSelectedDay}
      setSelectedDay={setMevSelectedDay}
      leftChart={
        <AttackersTreemapChart
          type={dataType}
          selectedDay={mevSelectedDay}
          sortBy="sol"
        />
      }
      leftTable={
        <TopSandwichersTable selectedDay={mevSelectedDay} type={dataType} />
      }
      rightChart={
        <AttackersTreemapChart
          type={dataType}
          selectedDay={mevSelectedDay}
          sortBy="tx"
        />
      }
      rightTable={
        <TopSandwichersTable
          selectedDay={mevSelectedDay}
          type={dataType}
          sortBy="tx"
        />
      }
    />
  );
};

export default MevTopSandwichersPage;
