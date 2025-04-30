import {
  aggregatedFullMevData,
  aggregatedMevData,
} from "./aggregated-mev-data";
import { getValidatorData, shortenAddress } from "./utils";

// Normalize data: replace null/undefined provider names with "No MEV protection"
const normalizedMevData = aggregatedMevData.map((d) => ({
  ...d,
  agg_victim_priv_mempool_provider: d.agg_victim_priv_mempool_provider.map(
    (p) => ({
      ...p,
      victim_priv_mempool_provider:
        p.victim_priv_mempool_provider ?? "No MEV protection",
    })
  ),
}));
// Extract all unique providers
export const allProviders = [
  ...new Set(
    normalizedMevData.flatMap((d) =>
      d.agg_victim_priv_mempool_provider.map(
        (p) => p.victim_priv_mempool_provider
      )
    )
  ),
];
// Extract all unique providers
export const allSourcee = [
  ...new Set(
    aggregatedMevData.flatMap((d) => d.df_agg_source.map((p) => p.source))
  ),
];

// Calculate total transactions for each provider across all days
export const providerTotals = allProviders.map((provider) => {
  const totalTx = normalizedMevData.reduce((sum, day) => {
    const providerData = day.agg_victim_priv_mempool_provider.find(
      (p) => p.victim_priv_mempool_provider === provider
    );
    return sum + (providerData ? providerData.tx_count : 0);
  }, 0);
  return {
    name: provider,
    value: totalTx,
  };
});

// Calculate total transactions for each provider across all days
export const providerExtractionTotals = allProviders.map((provider) => {
  const totalExtracted = normalizedMevData.reduce((sum, day) => {
    const providerData = day.agg_victim_priv_mempool_provider.find(
      (p) => p.victim_priv_mempool_provider === provider
    );
    return sum + (providerData ? providerData.victim_real_sol_extracted : 0);
  }, 0);
  return {
    name: provider,
    value: totalExtracted,
  };
});

// Calculate total transactions for each provider across all days
export const dexTotals = allSourcee.map((provider) => {
  const totalTx = normalizedMevData.reduce((sum, day) => {
    const providerData = day.df_agg_source.find((p) => p.source === provider);
    return sum + (providerData ? providerData.tx_count : 0);
  }, 0);
  return {
    name: provider,
    value: totalTx,
  };
});

export const tipAttacksTotals = (() => {
  const totals = normalizedMevData.reduce(
    (acc, day) => {
      day.agg_victim_priv_mempool_provider.forEach((provider) => {
        acc.notPaid += provider.tx_count - provider.attacker_priv_mempool_count;
        acc.paid += provider.attacker_priv_mempool_count;
      });
      return acc;
    },
    { notPaid: 0, paid: 0 }
  );

  return [
    { name: "not paid", value: totals.notPaid },
    { name: "paid", value: totals.paid },
  ];
})();
// Calculate total transactions for each provider across all days
export const dexExtractionTotals = allSourcee.map((provider) => {
  const totalExtracted = normalizedMevData.reduce((sum, day) => {
    const providerData = day.df_agg_source.find((p) => p.source === provider);
    return sum + (providerData ? providerData.victim_real_sol_extracted : 0);
  }, 0);
  return {
    name: provider,
    value: totalExtracted,
  };
});

// total SOL drained
export const totalMevDrained = aggregatedFullMevData.reduce((acc, day) => {
  const dayTotal = (day.df_agg_source ?? []).reduce((sum, source) => {
    return sum + (source.victim_real_sol_extracted || 0);
  }, 0);
  return acc + dayTotal;
}, 0);

// total number of attacks
export const totalAttackCount = aggregatedFullMevData.reduce((acc, day) => {
  const dayTotalAttacks = (day.df_agg_source ?? []).reduce((sum, source) => {
    return sum + (source.tx_count || 0);
  }, 0);
  return acc + dayTotalAttacks;
}, 0);

// top sandwicher
const allAttackers = aggregatedMevData.flatMap(
  (day) => day.top_attacker_address_extracted ?? []
);
export const topSandwicher = allAttackers.sort(
  (a, b) => b.victim_real_sol_extracted - a.victim_real_sol_extracted
)[0];

// biggest attack
const allAttacks = aggregatedMevData.flatMap((day) => day.top_attacks ?? []);
export const biggestAttackProfit = allAttacks.sort(
  (a, b) => b.attacker_sol_extracted - a.attacker_sol_extracted
)[0];

// Helper to get total SOL extracted on a given day
export function getDayTotalExtracted(day: string) {
  const found = aggregatedMevData.find((d) => d.date === day);
  if (!found) return 0;

  return (found.df_agg_source ?? []).reduce(
    (sum, source) => sum + (source.victim_real_sol_extracted || 0),
    0
  );
}

export function getDayTotalAttacks(day: string) {
  const found = aggregatedMevData.find((d) => d.date === day);
  if (!found) return 0;

  return (found.df_agg_source ?? []).reduce(
    (sum, source) => sum + (source.tx_count || 0),
    0
  );
}

// Dynamic total depending on All / Daily
export function getProperTotal(
  type: "All" | "Daily",
  isSol: boolean,
  selectedDay?: string
) {
  return isSol
    ? type === "All"
      ? totalMevDrained
      : getDayTotalExtracted(selectedDay ?? "")
    : type === "All"
    ? totalAttackCount
    : getDayTotalAttacks(selectedDay ?? "");
}

// -----------------
// TOP SANDWICHERS DATA
// -----------------
export function getAggregatedAttackers(
  type: "All" | "Daily",
  selectedDay?: string
) {
  const selectedData =
    type === "All"
      ? aggregatedFullMevData
      : aggregatedMevData.filter((d) => d.date === selectedDay);

  const allAttackers = selectedData.flatMap(
    (day) => day.top_attacker_address_tx ?? []
  );

  const attackerMap: Record<
    string,
    { tx_count: number; victim_real_sol_extracted: number }
  > = {};

  for (const attacker of allAttackers) {
    if (!attacker.attacker_address) continue;

    if (!attackerMap[attacker.attacker_address]) {
      attackerMap[attacker.attacker_address] = {
        tx_count: 0,
        victim_real_sol_extracted: 0,
      };
    }
    attackerMap[attacker.attacker_address].tx_count += attacker.tx_count;
    attackerMap[attacker.attacker_address].victim_real_sol_extracted +=
      attacker.victim_real_sol_extracted;
  }

  const total = getProperTotal(type, true, selectedDay);

  const attackers = Object.entries(attackerMap).map(([address, stats]) => ({
    attacker_address: address,
    tx_count: stats.tx_count,
    victim_real_sol_extracted: stats.victim_real_sol_extracted,
    percentage: total ? (stats.victim_real_sol_extracted / total) * 100 : 0,
  }));

  return {
    attackers, // ✅ attackers array
    totalExtracted: total, // ✅ total value
  };
}

// -----------------
// TOP POOLS DATA
// -----------------
export function getAggregatedPools(
  type: "All" | "Daily",
  selectedDay?: string
) {
  const selectedData =
    type === "All"
      ? aggregatedFullMevData
      : aggregatedMevData.filter((d) => d.date === selectedDay);

  const allPools = selectedData.flatMap((day) => day.top_lp_tx ?? []);

  const poolMap: Record<
    string,
    { tx_count: number; victim_real_sol_extracted: number }
  > = {};

  for (const pool of allPools) {
    if (!pool.lp) continue;

    if (!poolMap[pool.lp]) {
      poolMap[pool.lp] = { tx_count: 0, victim_real_sol_extracted: 0 };
    }
    poolMap[pool.lp].tx_count += pool.tx_count;
    poolMap[pool.lp].victim_real_sol_extracted +=
      pool.victim_real_sol_extracted;
  }

  const total = getProperTotal(type, true, selectedDay);

  return Object.entries(poolMap).map(([lp, stats]) => ({
    lp,
    tx_count: stats.tx_count,
    victim_real_sol_extracted: stats.victim_real_sol_extracted,
    percentage: total ? (stats.victim_real_sol_extracted / total) * 100 : 0,
  }));
}

// -----------------
// TOP TOKENS DATA
// -----------------
export function getAggregatedTokens(
  type: "All" | "Daily",
  selectedDay?: string
) {
  const selectedData =
    type === "All"
      ? aggregatedFullMevData
      : aggregatedMevData.filter((d) => d.date === selectedDay);

  const allTokens = selectedData.flatMap(
    (day) => day.top_token_address_tx ?? []
  );

  const tokenMap: Record<
    string,
    { tx_count: number; victim_real_sol_extracted: number }
  > = {};

  for (const token of allTokens) {
    if (!token.token_address) continue;

    if (!tokenMap[token.token_address]) {
      tokenMap[token.token_address] = {
        tx_count: 0,
        victim_real_sol_extracted: 0,
      };
    }
    tokenMap[token.token_address].tx_count += token.tx_count;
    tokenMap[token.token_address].victim_real_sol_extracted +=
      token.victim_real_sol_extracted;
  }

  const total = getProperTotal(type, true, selectedDay);

  return Object.entries(tokenMap).map(([token_address, stats]) => ({
    token_address,
    tx_count: stats.tx_count,
    victim_real_sol_extracted: stats.victim_real_sol_extracted,
    percentage: total ? (stats.victim_real_sol_extracted / total) * 100 : 0,
  }));
}

// -----------------
// TOP VICTIMS DATA
// -----------------
export function getAggregatedVictims(
  type: "All" | "Daily",
  selectedDay?: string
) {
  const selectedData =
    type === "All"
      ? aggregatedFullMevData
      : aggregatedMevData.filter((d) => d.date === selectedDay);

  const allVictims = selectedData.flatMap(
    (day) => day.top_victim_wallet_address_tx ?? []
  );

  const victimMap: Record<
    string,
    { tx_count: number; victim_real_sol_extracted: number }
  > = {};

  for (const victim of allVictims) {
    if (!victim.victim_wallet_address) continue;

    if (!victimMap[victim.victim_wallet_address]) {
      victimMap[victim.victim_wallet_address] = {
        tx_count: 0,
        victim_real_sol_extracted: 0,
      };
    }
    victimMap[victim.victim_wallet_address].tx_count += victim.tx_count;
    victimMap[victim.victim_wallet_address].victim_real_sol_extracted +=
      victim.victim_real_sol_extracted;
  }

  const total = getProperTotal(type, true, selectedDay);

  return Object.entries(victimMap).map(([victim_wallet_address, stats]) => ({
    victim_wallet_address,
    tx_count: stats.tx_count,
    victim_real_sol_extracted: stats.victim_real_sol_extracted,
    percentage: total ? (stats.victim_real_sol_extracted / total) * 100 : 0,
  }));
}

// -----------------
// TOP VALIDATORS DATA
// -----------------
export function getAggregatedValidators(
  type: "All" | "Daily",
  selectedDay?: string
) {
  const selectedData =
    type === "All"
      ? aggregatedMevData
      : aggregatedMevData.filter((d) => d.date === selectedDay);

  const allValidatorsRaw = selectedData.flatMap(
    (day) => day.top_validator_extracted ?? []
  );

  const validatorMap: Record<
    string,
    { solExtracted: number; txCount: number }
  > = {};

  for (const v of allValidatorsRaw) {
    if (!validatorMap[v.validator]) {
      validatorMap[v.validator] = { solExtracted: 0, txCount: 0 };
    }
    validatorMap[v.validator].solExtracted += v.victim_real_sol_extracted;
    validatorMap[v.validator].txCount += v.tx_count;
  }

  const totalSol = getProperTotal(type, true, selectedDay);
  const totalTx = getProperTotal(type, false, selectedDay);

  return Object.entries(validatorMap).map(([validator, stats]) => ({
    validator,
    name: getValidatorData(validator)?.name ?? shortenAddress(validator),
    solExtracted: stats.solExtracted,
    txCount: stats.txCount,
    solExtractedPercentage: totalSol
      ? (stats.solExtracted / totalSol) * 100
      : 0,
    txPercentage: totalTx ? (stats.txCount / totalTx) * 100 : 0,
  }));
}
