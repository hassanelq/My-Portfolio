import { quantile } from "./normal";

export type HistoricalAssetId = "sp500" | "gold" | "world";
export interface SavingsInputs {
  starting: number;
  monthly: number;
  age: number;
  targetAge: number;
}
export interface HistoricalData {
  start: string;
  end: string;
  cpi: number[];
  assets: Record<HistoricalAssetId, { start: string; levels: number[] }>;
}
export interface HistoricalResult {
  id: HistoricalAssetId | "cash";
  start: string;
  end: string;
  windows: number;
  maxYears: number;
  median: number;
  low: number;
  high: number;
  points: { age: number; value: number }[];
}
export function monthIndex(month: string) {
  const [year, number] = month.split("-").map(Number);
  return year * 12 + number - 1;
}
/** All complete, monthly-start windows; pointwise median of that same cohort. */
export function replayAsset(
  inputs: SavingsInputs,
  levels: number[],
  cpi: number[],
  metadata: { id: HistoricalResult["id"]; start: string; end: string },
): HistoricalResult | null {
  const years = inputs.targetAge - inputs.age;
  if (
    ![inputs.starting, inputs.monthly, inputs.age, inputs.targetAge].every(
      Number.isFinite,
    ) ||
    inputs.starting < 0 ||
    inputs.monthly < 0 ||
    !Number.isInteger(years) ||
    years < 1
  ) {
    throw new RangeError(
      "Use nonnegative savings and a positive whole-year horizon.",
    );
  }
  if (
    levels.length !== cpi.length ||
    levels.some((n) => !Number.isFinite(n) || n <= 0) ||
    cpi.some((n) => !Number.isFinite(n) || n <= 0)
  )
    throw new RangeError(
      "Historical levels and CPI must be aligned, finite and positive.",
    );
  const months = years * 12,
    windows = levels.length - months;
  if (windows < 1) return null;
  const checkpoints = Array.from({ length: years + 1 }, () => [] as number[]);
  for (let start = 0; start < windows; start++) {
    let nominal = inputs.starting;
    checkpoints[0].push(nominal);
    for (let step = 1; step <= months; step++) {
      const index = start + step;
      nominal = (nominal * levels[index]) / levels[index - 1] + inputs.monthly;
      if (step % 12 === 0)
        checkpoints[step / 12].push((nominal * cpi[start]) / cpi[index]);
    }
  }
  const sorted = checkpoints.map((values) => values.sort((a, b) => a - b));
  const terminal = sorted.at(-1)!;
  return {
    ...metadata,
    windows,
    maxYears: Math.floor((levels.length - 1) / 12),
    median: quantile(terminal, 0.5),
    low: quantile(terminal, 0.1),
    high: quantile(terminal, 0.9),
    points: sorted.map((values, year) => ({
      age: inputs.age + year,
      value: quantile(values, 0.5),
    })),
  };
}
export function replayHistory(inputs: SavingsInputs, data: HistoricalData) {
  const results = (Object.keys(data.assets) as HistoricalAssetId[]).map(
    (id) => {
      const asset = data.assets[id],
        offset = monthIndex(asset.start) - monthIndex(data.start);
      return replayAsset(
        inputs,
        asset.levels,
        data.cpi.slice(offset, offset + asset.levels.length),
        { id, start: asset.start, end: data.end },
      );
    },
  );
  const cash = replayAsset(
    inputs,
    data.cpi.map(() => 1),
    data.cpi,
    { id: "cash", start: data.start, end: data.end },
  );
  return { assets: results, cash };
}
