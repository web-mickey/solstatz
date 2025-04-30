// chartDataUtils.ts
// Generic utilities to aggregate and transform time series data for pie and stacked-area charts

import { aggregatedMevData } from "@/lib/aggregated-mev-data";

// Generic types
export type PieData = { name: string; value: number };
export type ChartDataPoint = { [key: string]: any };

export interface ProcessResult {
  /** Unique dimension values (seriesKeys), ordered optionally by a metric */
  seriesKeys: string[];
  /** X-axis field key for area charts */
  xDataKey: string;
  /** For each metric, aggregated pie chart data */
  pieDataByMetric: Record<string, PieData[]>;
  /** For each metric, time-series data for stacked area charts */
  areaDataByMetric: Record<string, ChartDataPoint[]>;
}

/**
 * Process any raw time-series array where each entry contains a date and an array of items.
 * Optionally orders the series by a specified metric.
 *
 * @param rawData - Array of records containing date and items array
 * @param dateField - Key for the date string in each record
 * @param itemsField - Key for the array of items in each record
 * @param itemKeyField - Field name within each item to group by (e.g. provider name)
 * @param metricFields - List of numeric fields on each item to aggregate
 * @param nullLabel - Label to use when itemKeyField is null or undefined
 * @param sortMetricField - If provided, seriesKeys (and pieData for that metric) are sorted by this metric
 * @param sortDesc - Whether to sort descending (default: true)
 */
export function processDimensionData<T, U extends Record<string, any>>(
  rawData: T[],
  dateField: keyof T,
  itemsField: keyof T,
  itemKeyField: keyof U,
  metricFields: (keyof U)[],
  nullLabel = "Unknown",
  sortMetricField?: keyof U,
  sortDesc = true
): ProcessResult {
  // Normalize and extract items
  type RecordWithItems = { date: string; items: U[] };
  const normalized: RecordWithItems[] = rawData.map((rec: any) => ({
    date: rec[dateField] as string,
    items: (rec[itemsField] as U[]).map((item) => ({
      ...item,
      [itemKeyField]: item[itemKeyField] ?? nullLabel,
    })),
  }));

  // Extract all unique series keys (dimension values)
  let seriesKeys = Array.from(
    normalized.reduce<Set<string>>((set, { items }) => {
      items.forEach((i) => set.add(String(i[itemKeyField])));
      return set;
    }, new Set<string>())
  ).sort();

  // Sort dates
  const dates = normalized.map((d) => d.date).sort();

  // Temporary storage for pie data
  const rawPieData: Record<string, PieData[]> = {};
  // Final containers
  const pieDataByMetric: Record<string, PieData[]> = {};
  const areaDataByMetric: Record<string, ChartDataPoint[]> = {};

  // Compute raw pie data and area data
  metricFields.forEach((metric) => {
    const metricKey = String(metric);

    // Pie data: total per series across all dates
    rawPieData[metricKey] = seriesKeys.map((name) => ({
      name,
      value: normalized.reduce((sum, day) => {
        const match = day.items.find((i) => String(i[itemKeyField]) === name);
        return (
          sum + (match && typeof match[metric] === "number" ? match[metric] : 0)
        );
      }, 0),
    }));

    // Area data: time series per date and series
    const areaPoints: ChartDataPoint[] = dates.map((date) => {
      const day = normalized.find((d) => d.date === date);
      const point: any = { [String(dateField)]: date };
      seriesKeys.forEach((name) => {
        const match = day?.items.find((i) => String(i[itemKeyField]) === name);
        point[name] =
          match && typeof match[metric] === "number" ? match[metric] : 0;
      });
      return point;
    });
    areaDataByMetric[metricKey] = areaPoints;
  });

  // If a sortMetricField is provided, reorder seriesKeys and pie data
  if (sortMetricField) {
    const key = String(sortMetricField);
    // Sort the raw pie data for that metric
    const sorted = [...rawPieData[key]].sort((a, b) =>
      sortDesc ? b.value - a.value : a.value - b.value
    );
    // Update seriesKeys to this new order
    seriesKeys = sorted.map((d) => d.name);
    // Rebuild pieDataByMetric arrays in seriesKeys order
    Object.entries(rawPieData).forEach(([metricKey, list]) => {
      const map = list.reduce<Record<string, number>>(
        (acc, { name, value }) => {
          acc[name] = value;
          return acc;
        },
        {}
      );
      pieDataByMetric[metricKey] = seriesKeys.map((name) => ({
        name,
        value: map[name] ?? 0,
      }));
    });
  } else {
    // No sorting, use raw order
    Object.assign(pieDataByMetric, rawPieData);
  }

  return {
    seriesKeys,
    xDataKey: String(dateField),
    pieDataByMetric,
    areaDataByMetric,
  };
}

// -- Example default export for MEV data --
export const mevProcessResult = processDimensionData(
  aggregatedMevData,
  "date",
  "agg_victim_priv_mempool_provider",
  "victim_priv_mempool_provider",
  ["tx_count", "victim_real_sol_extracted"],
  "No protection",
  "tx_count", // sort series by total tx_count
  true // descending order
);

export const sourceResult = processDimensionData(
  aggregatedMevData,
  "date",
  "df_agg_source",
  "source",
  ["tx_count", "victim_real_sol_extracted"],
  "No source",
  "tx_count", // sort series by total tx_count
  true // descending order
);
