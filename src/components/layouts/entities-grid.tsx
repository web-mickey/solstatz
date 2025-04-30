"use client";

import { DaySelect } from "@/components/day-select";
import { Header } from "@/components/header";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

interface TopEntitiesPageLayoutProps {
  title: string;
  description: string;
  dataType: "All" | "Daily";
  setDataType: (value: "All" | "Daily") => void;
  selectedDay: string;
  setSelectedDay: (value: string) => void;
  leftChart: React.ReactNode;
  leftTable: React.ReactNode;
  rightChart: React.ReactNode;
  rightTable: React.ReactNode;
  showDaySelect?: boolean;
}

export function TopEntitiesPageLayout({
  title,
  description,
  dataType,
  setDataType,
  selectedDay,
  setSelectedDay,
  leftChart,
  leftTable,
  rightChart,
  rightTable,
  showDaySelect = true,
}: TopEntitiesPageLayoutProps) {
  return (
    <div className="flex flex-col gap-14 md:gap-10">
      <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
        <Header title={title} description={description} noMargin />
        <div className="flex flex-col gap-4 items-end">
          <div className="flex flex-row gap-4 items-center">
            <div className="text-lg">Data Type</div>
            <Tabs
              value={dataType}
              onValueChange={(v) => setDataType(v as "All" | "Daily")}
            >
              <TabsList>
                <TabsTrigger value="All">All</TabsTrigger>
                <TabsTrigger value="Daily">Daily</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          {showDaySelect && dataType === "Daily" && (
            <DaySelect
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
            />
          )}
        </div>
      </div>

      <Separator />

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex flex-col gap-4 max-w-full">
          {leftChart}
          {leftTable}
        </div>

        <div className="flex-1 flex flex-col gap-4 max-w-full">
          {rightChart}
          {rightTable}
        </div>
      </div>
    </div>
  );
}
