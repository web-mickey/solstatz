"use client";
import GenericPieChart from "@/components/charts/generic-pie-chart";
import GenericStackedAreaChart from "@/components/charts/generic-stacked-area-chart";
import { mevProcessResult } from "@/lib/agg-data-utils";
import {
  providerExtractionTotals,
  providerTotals,
  tipAttacksTotals,
} from "@/lib/agg-precalculated-data";
const ProtectionProvidersPage = () => {
  const { seriesKeys, xDataKey, areaDataByMetric } = mevProcessResult;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <GenericPieChart
            data={providerTotals}
            title="Total Transactions by Provider"
            description="Total transactions by victim's protection provider across all days."
          />
        </div>
        <div className="flex-1">
          <GenericPieChart
            data={providerExtractionTotals}
            title="Total SOL extracted by Provider"
            description="Total SOL extracted by victim's protection provider across all days."
            solValues
          />
        </div>
      </div>

      <GenericStackedAreaChart
        data={areaDataByMetric["tx_count"]}
        xDataKey={xDataKey}
        seriesKeys={seriesKeys}
        title="Number of attacks"
        description="Number of attacks by victim's private mempool provider."
      />
      <GenericStackedAreaChart
        data={areaDataByMetric["victim_real_sol_extracted"]}
        xDataKey={xDataKey}
        seriesKeys={seriesKeys}
        title="SOL extracted"
        description="SOL extracted by victim's private mempool provider."
        solValues
      />
      <GenericPieChart
        data={tipAttacksTotals}
        title={"Tip/No Tip"}
        description="Attacks with and without paid tip."
      />
    </div>
  );
};

export default ProtectionProvidersPage;
