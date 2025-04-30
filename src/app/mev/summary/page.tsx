"use client";
import GenericStackedAreaChart from "@/components/charts/generic-stacked-area-chart";
import SourceStackedBarChart from "@/components/charts/source-stacked-bar-chart";
import { Header } from "@/components/header";
import { MevSummary } from "@/components/mev-summary";
import { sourceResult } from "@/lib/agg-data-utils";
import { aggregatedMevData } from "@/lib/aggregated-mev-data";
import { dayFormatter, getSolanaPrice } from "@/lib/utils";
import { useEffect, useState } from "react";

const MevPage = () => {
  const [solanaPrice, setSolanaPrice] = useState<number>(0);

  useEffect(() => {
    getSolanaPrice().then((price) => {
      setSolanaPrice(price);
    });

    setInterval(() => {
      getSolanaPrice().then((price) => {
        setSolanaPrice(price);
      });
    }, 10000);
  }, []);

  const days = `${dayFormatter(
    aggregatedMevData[aggregatedMevData.length - 1].date
  )} - ${dayFormatter(aggregatedMevData[0].date)}`;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col justify-start lg:flex-row lg:justify-between">
        <Header
          title={
            <div>
              MEV Sandwich Summary
              <div>{days}</div>
            </div>
          }
          description="Summary of MEV Sandwiches for the time period during which we collected data."
        />
      </div>
      <MevSummary solanaPrice={solanaPrice} />

      <GenericStackedAreaChart
        data={sourceResult.areaDataByMetric["victim_real_sol_extracted"]}
        xDataKey={sourceResult.xDataKey}
        seriesKeys={sourceResult.seriesKeys}
        title="Sol Extracted"
        description="SOL extracted trends by dex."
        solValues
      />

      <GenericStackedAreaChart
        data={sourceResult.areaDataByMetric["tx_count"]}
        xDataKey={sourceResult.xDataKey}
        seriesKeys={sourceResult.seriesKeys}
        title="Number of attacks"
        description="Attacks count trends by dex."
      />

      <SourceStackedBarChart solValues />
    </div>
  );
};

export default MevPage;
