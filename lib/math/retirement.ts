import { monthIndex } from "./dca";

export type RetirementMode = "historical" | "average";
export interface RetirementSeries {
  start: string;
  end: string;
  levels: number[];
  cpi: number[];
}
export interface RetirementInputs {
  livingCost: number;
  starting: number;
  age: number;
  retireAt: number;
  untilAge: number;
}
export interface WithdrawalHistory {
  years: number;
  windows: number;
  worstStart: string;
  worstIndex: number;
  capitalPerMonth: number;
  withdrawalRate: number;
  windowCapital: number[];
}
const monthText = (index: number) =>
  `${Math.floor(index / 12)}-${String((index % 12) + 1).padStart(2, "0")}`;

/** A withdrawal at the START of each month, held constant in purchasing power.
 * Capital / monthly spending = sum of inverse cumulative real growth factors.
 * Prefix sums make each historical window exact and inexpensive to evaluate.
 */
export function createRetirementHistory(series: RetirementSeries) {
  const { levels, cpi, start, end } = series;
  if (
    levels.length < 2 ||
    levels.length !== cpi.length ||
    levels.length !== monthIndex(end) - monthIndex(start) + 1 ||
    [...levels, ...cpi].some((value) => !Number.isFinite(value) || value <= 0)
  )
    throw new RangeError(
      "Retirement data must contain aligned, positive monthly levels and CPI.",
    );
  const real = levels.map((level, i) => level / levels[0] / (cpi[i] / cpi[0]));
  const prefix = [0];
  real.forEach((level) => prefix.push(prefix.at(-1)! + 1 / level));
  const monthlyFactor = (real.at(-1)! / real[0]) ** (1 / (real.length - 1));
  const cache = new Map<number, WithdrawalHistory>();
  return {
    series,
    real,
    monthlyFactor,
    realAnnualReturn: monthlyFactor ** 12 - 1,
    inflationAnnualRate: (cpi.at(-1)! / cpi[0]) ** (12 / (cpi.length - 1)) - 1,
    maxYears: Math.floor((real.length - 1) / 12),
    getWindows(years: number): WithdrawalHistory | null {
      if (!Number.isInteger(years) || years < 1)
        throw new RangeError("Use a positive whole-year retirement horizon.");
      if (cache.has(years)) return cache.get(years)!;
      const months = years * 12,
        windows = real.length - months;
      if (windows < 1) return null;
      const windowCapital = Array.from(
        { length: windows },
        (_, s) => real[s] * (prefix[s + months] - prefix[s]),
      );
      let worstIndex = 0;
      for (let i = 1; i < windows; i++)
        if (windowCapital[i] > windowCapital[worstIndex]) worstIndex = i;
      const capitalPerMonth = windowCapital[worstIndex];
      const result = {
        years,
        windows,
        worstIndex,
        capitalPerMonth,
        windowCapital,
        worstStart: monthText(monthIndex(start) + worstIndex),
        withdrawalRate: 12 / capitalPerMonth,
      };
      cache.set(years, result);
      return result;
    },
  };
}
export type RetirementHistory = ReturnType<typeof createRetirementHistory>;

/** Overrides affect smooth estimates; the historical withdrawal windows stay intact. */
function growthFactor(history: RetirementHistory, annualGrowthRate?: number) {
  if (annualGrowthRate === undefined) return history.monthlyFactor;
  if (!Number.isFinite(annualGrowthRate) || annualGrowthRate <= -1)
    throw new RangeError(
      "Annual real growth must be finite and greater than -100%.",
    );
  return (1 + annualGrowthRate) ** (1 / 12);
}

/** Equal beginning-of-month withdrawals at one constant real growth factor. */
export function averageCapitalPerMonth(months: number, factor: number) {
  let capital = 0;
  for (let i = 0; i < months; i++) capital = 1 + capital / factor;
  return capital;
}
/** End-of-month contributions. Handles flat and negative real growth too. */
export function futureSavings(
  starting: number,
  monthly: number,
  months: number,
  factor: number,
) {
  const growth = factor ** months;
  const annuity =
    Math.abs(factor - 1) < 1e-12
      ? months
      : Math.expm1(months * Math.log(factor)) / (factor - 1);
  return starting * growth + monthly * annuity;
}
export function requiredMonthlyContribution(
  target: number,
  starting: number,
  months: number,
  factor: number,
) {
  const shortfall = target - futureSavings(starting, 0, months, factor);
  if (shortfall <= 1e-8) return 0;
  if (months === 0) return null;
  return shortfall / futureSavings(0, 1, months, factor);
}
function validate(inputs: RetirementInputs) {
  if (
    ![
      inputs.livingCost,
      inputs.starting,
      inputs.age,
      inputs.retireAt,
      inputs.untilAge,
    ].every(Number.isFinite) ||
    inputs.livingCost < 0 ||
    inputs.starting < 0 ||
    ![inputs.age, inputs.retireAt, inputs.untilAge].every(Number.isInteger) ||
    inputs.age < 0 ||
    inputs.retireAt < inputs.age ||
    inputs.untilAge <= inputs.retireAt
  )
    throw new RangeError(
      "Use nonnegative amounts and ordered whole-year ages.",
    );
}
export interface RetirementPoint {
  age: number;
  value: number;
}

export function calculateRetirementPlan(
  inputs: RetirementInputs,
  history: RetirementHistory,
  mode: RetirementMode,
  annualGrowthRate?: number,
) {
  validate(inputs);
  const monthlyFactor = growthFactor(history, annualGrowthRate);
  const { livingCost, starting, age, retireAt, untilAge } = inputs;
  const stats = history.getWindows(untilAge - retireAt);
  if (!stats) return null;
  const capitalPerMonth =
    mode === "historical"
      ? stats.capitalPerMonth
      : averageCapitalPerMonth((untilAge - retireAt) * 12, monthlyFactor);
  const target = livingCost * capitalPerMonth;
  const monthlyContribution = requiredMonthlyContribution(
    target,
    starting,
    (retireAt - age) * 12,
    monthlyFactor,
  );
  const successCount = stats.windowCapital.filter(
    (capital) =>
      livingCost * capital <= target + Math.max(1e-7, target * 1e-10),
  ).length;
  const points: RetirementPoint[] = [{ age, value: starting }];
  let balance = starting;
  if (monthlyContribution !== null) {
    for (let month = 1; month <= (retireAt - age) * 12; month++) {
      balance = balance * monthlyFactor + monthlyContribution;
      if (month % 12 === 0)
        points.push({ age: age + month / 12, value: balance });
    }
    for (let month = 1; month <= (untilAge - retireAt) * 12; month++) {
      const i = stats.worstIndex + month;
      const factor =
        mode === "historical"
          ? history.real[i] / history.real[i - 1]
          : monthlyFactor;
      balance = (balance - livingCost) * factor;
      // Remove round-off at the exact solvency boundary, never hide a material deficit.
      if (Math.abs(balance) < Math.max(1e-7, target * 1e-10)) balance = 0;
      if (month % 12 === 0)
        points.push({ age: retireAt + month / 12, value: balance });
    }
  }
  return {
    target,
    monthlyContribution,
    withdrawalRate: 12 / capitalPerMonth,
    stats,
    successCount,
    successRate: successCount / stats.windows,
    points,
    terminalBalance: balance,
  };
}
export type RetirementPlan = NonNullable<
  ReturnType<typeof calculateRetirementPlan>
>;

/** Recompute the required capital for each candidate retirement duration. */
export function earliestRetirementAge(
  inputs: RetirementInputs,
  monthly: number,
  history: RetirementHistory,
  mode: RetirementMode,
  annualGrowthRate?: number,
) {
  validate(inputs);
  const monthlyFactor = growthFactor(history, annualGrowthRate);
  if (!Number.isFinite(monthly) || monthly < 0)
    throw new RangeError("Monthly investment must be nonnegative.");
  for (let age = inputs.age; age < inputs.untilAge; age++) {
    const stats = history.getWindows(inputs.untilAge - age);
    if (!stats) continue;
    const capital =
      mode === "historical"
        ? stats.capitalPerMonth
        : averageCapitalPerMonth((inputs.untilAge - age) * 12, monthlyFactor);
    const target = inputs.livingCost * capital;
    const balance = futureSavings(
      inputs.starting,
      monthly,
      (age - inputs.age) * 12,
      monthlyFactor,
    );
    if (balance + Math.max(1e-7, target * 1e-10) >= target) return age;
  }
  return null;
}
