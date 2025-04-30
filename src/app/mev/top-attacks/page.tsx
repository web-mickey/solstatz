"use client";

import { DaySelect } from "@/components/day-select";
import { Header } from "@/components/header";
import TopSandwichAttacksTable from "@/components/tables/top-sandwich-attacks-table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { aggregatedMevData } from "@/lib/aggregated-mev-data";
import { useState } from "react";

const MevTopAttacksPage = () => {
  const [dataType, setDataType] = useState<"All" | "Daily">("All");
  const [mevSelectedDay, setMevSelectedDay] = useState<string>(
    aggregatedMevData[0].date
  );

  return (
    <div className="flex flex-col gap-14 md:gap-10">
      <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
        <Header
          title="Top Attacks"
          description="Top Attacks for the selected day or all time."
          noMargin
        />
        <div className="flex flex-col gap-4 items-end">
          <div className="flex flex-row gap-4 items-center">
            <div className="text-lg">Data Type</div>
            <Tabs
              value={dataType}
              onValueChange={(value) => setDataType(value as "All" | "Daily")}
            >
              <TabsList>
                <TabsTrigger value="All">All</TabsTrigger>
                <TabsTrigger value="Daily">Daily</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          {dataType === "Daily" && (
            <DaySelect
              selectedDay={mevSelectedDay}
              setSelectedDay={setMevSelectedDay}
            />
          )}
        </div>
      </div>

      <TopSandwichAttacksTable selectedDay={mevSelectedDay} type={dataType} />
    </div>
  );
};

export default MevTopAttacksPage;
