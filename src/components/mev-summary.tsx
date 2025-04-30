"use client";

import { formatNumber, formatNumberWithCommas } from "@/lib/utils";
import { SolValueWrapper } from "./sol-value-wrapper";
import StatBlock from "./stat-block";
import {
  totalMevDrained,
  totalAttackCount,
  topSandwicher,
  biggestAttackProfit,
} from "@/lib/agg-precalculated-data";
import { aggregatedFullMevData } from "@/lib/aggregated-mev-data";

interface MevSummaryProps {
  solanaPrice: number;
}

export const MevSummary = ({ solanaPrice }: MevSummaryProps) => {
  if (!topSandwicher || !biggestAttackProfit) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBlock
          title="Number Of Attacks"
          value={formatNumberWithCommas(totalAttackCount)}
          description="Transactions"
        />
        <StatBlock
          title="Total SOL Drained"
          value={
            <SolValueWrapper
              value={formatNumberWithCommas(totalMevDrained)}
              size={18}
            />
          }
          description={`$${formatNumber(totalMevDrained * solanaPrice)}`}
        />
        <StatBlock
          title="Top Sandwicher Profit"
          value={
            <SolValueWrapper
              value={aggregatedFullMevData[0].top_attacker_address_extracted[0].victim_real_sol_extracted.toFixed(
                2
              )}
              size={18}
            />
          }
          description={`$${formatNumber(
            aggregatedFullMevData[0].top_attacker_address_extracted[0]
              .victim_real_sol_extracted * solanaPrice
          )}`}
        />
        <StatBlock
          title="Biggest Attack Profit"
          value={
            <SolValueWrapper
              value={biggestAttackProfit.attacker_sol_extracted.toFixed(2)}
              size={18}
            />
          }
          description={`$${formatNumber(
            biggestAttackProfit.attacker_sol_extracted * solanaPrice
          )}`}
        />
      </div>
    </div>
  );
};
