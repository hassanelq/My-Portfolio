import { quantile } from "./normal";

export type MarketAssetId = "sp500" | "gold" | "world" | "bonds";
export type HistoricalAssetId = MarketAssetId | "portfolio";
export const portfolioWeights = { sp500: 0.6, bonds: 0.3, gold: 0.1 } as const;
// Illustrative scenario rates, not statutory rates or a broker quote.
export const portfolioCosts = {
  tradingFee: 0.001,
  realizedGainTax: 0.2,
} as const;
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
  usCpi: number[];
  assets: Record<MarketAssetId, { start: string; levels: number[] }>;
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
/** Constant target weights, restored monthly. No averaging of standalone medians. */
export function portfolioHistory(data: HistoricalData) {
  const holdings = Object.entries(portfolioWeights) as [
    keyof typeof portfolioWeights,
    number,
  ][];
  const start = holdings
    .map(([id]) => data.assets[id].start)
    .sort()
    .at(-1)!;
  const startMonth = monthIndex(start);
  const months = monthIndex(data.end) - startMonth + 1;
  const levels = [100];
  for (let i = 1; i < months; i++) {
    const factor = holdings.reduce((sum, [id, weight]) => {
      const asset = data.assets[id];
      const index = startMonth + i - monthIndex(asset.start);
      return sum + (weight * asset.levels[index]) / asset.levels[index - 1];
    }, 0);
    levels.push(levels[i - 1] * factor);
  }
  return { start, levels };
}

/** Self-financed trades restore weights after each deposit, net of fees and gains tax.
 * Average-cost basis treats total-return growth as appreciation: a tax proxy,
 * not a personal tax calculation or a tax on distributions.
 */
export function portfolioWindow(
  inputs: SavingsInputs,
  data: HistoricalData,
  startIndex: number,
  months: number,
) {
  const history = portfolioHistory(data);
  const ids = Object.keys(
    portfolioWeights,
  ) as (keyof typeof portfolioWeights)[];
  const weights = ids.map((id) => portfolioWeights[id]);
  const invested = inputs.starting / (1 + portfolioCosts.tradingFee);
  const values = weights.map((weight) => invested * weight);
  const bases = [...values];
  const rows = [
    { nominal: invested, fees: inputs.starting - invested, tax: 0 },
  ];
  for (let step = 1; step <= months; step++) {
    const month = monthIndex(history.start) + startIndex + step;
    for (let i = 0; i < ids.length; i++) {
      const asset = data.assets[ids[i]];
      const index = month - monthIndex(asset.start);
      values[i] *= asset.levels[index] / asset.levels[index - 1];
    }
    const available =
      values.reduce((sum, value) => sum + value, 0) + inputs.monthly;
    const gainFractions = values.map((value, i) =>
      value > 0 ? Math.max(0, 1 - bases[i] / value) : 0,
    );
    // Net capital + cash paid for fees/taxes must equal capital plus the deposit.
    // The piecewise-linear balance is monotone for these rates.
    let low = 0,
      high = available;
    for (let iteration = 0; iteration < 36; iteration++) {
      const net = (low + high) / 2;
      let charge = 0;
      for (let i = 0; i < ids.length; i++) {
        const trade = weights[i] * net - values[i];
        charge +=
          Math.abs(trade) * portfolioCosts.tradingFee +
          Math.max(0, -trade) *
            gainFractions[i] *
            portfolioCosts.realizedGainTax;
      }
      if (net + charge > available) high = net;
      else low = net;
    }
    let fees = 0,
      tax = 0;
    for (let i = 0; i < ids.length; i++) {
      const target = weights[i] * low;
      const trade = target - values[i];
      fees += Math.abs(trade) * portfolioCosts.tradingFee;
      tax +=
        Math.max(0, -trade) * gainFractions[i] * portfolioCosts.realizedGainTax;
      bases[i] =
        trade >= 0
          ? bases[i] + trade
          : values[i] > 0
            ? (bases[i] * target) / values[i]
            : 0;
      values[i] = target;
    }
    rows.push({ nominal: low, fees, tax });
  }
  return rows;
}

function replayPortfolio(
  inputs: SavingsInputs,
  data: HistoricalData,
  cpi: number[],
) {
  const history = portfolioHistory(data);
  const offset = monthIndex(history.start) - monthIndex(data.start);
  const alignedCpi = cpi.slice(offset, offset + history.levels.length);
  const result = replayAsset(inputs, history.levels, alignedCpi, {
    id: "portfolio",
    start: history.start,
    end: data.end,
  });
  if (!result) return null;
  const years = inputs.targetAge - inputs.age;
  const checkpoints = Array.from({ length: years + 1 }, () => [] as number[]);
  for (let start = 0; start < result.windows; start++) {
    const rows = portfolioWindow(inputs, data, start, years * 12);
    for (let year = 0; year <= years; year++)
      checkpoints[year].push(
        (rows[year * 12].nominal * alignedCpi[start]) /
          alignedCpi[start + year * 12],
      );
  }
  const sorted = checkpoints.map((values) => values.sort((a, b) => a - b));
  const terminal = sorted.at(-1)!;
  return {
    ...result,
    median: quantile(terminal, 0.5),
    low: quantile(terminal, 0.1),
    high: quantile(terminal, 0.9),
    points: sorted.map((values, year) => ({
      age: inputs.age + year,
      value: quantile(values, 0.5),
    })),
  };
}

export function replayHistory(
  inputs: SavingsInputs,
  data: HistoricalData,
  inflation: "morocco" | "us" = "morocco",
) {
  const cpi = inflation === "us" ? data.usCpi : data.cpi;
  const assets = { ...data.assets, portfolio: portfolioHistory(data) };
  const results = (Object.keys(assets) as HistoricalAssetId[]).map((id) => {
    if (id === "portfolio") return replayPortfolio(inputs, data, cpi);
    const asset = assets[id];
    const offset = monthIndex(asset.start) - monthIndex(data.start);
    return replayAsset(
      inputs,
      asset.levels,
      cpi.slice(offset, offset + asset.levels.length),
      { id, start: asset.start, end: data.end },
    );
  });
  const cash = replayAsset(
    inputs,
    cpi.map(() => 1),
    cpi,
    { id: "cash", start: data.start, end: data.end },
  );
  return { assets: results, cash };
}
