import { normalCDF, normalPDF } from "./normal";
export type OptionType = "call" | "put";
export interface OptionInputs {
  type: OptionType;
  spot: number;
  strike: number;
  time: number;
  rate: number;
  vol: number;
}
export interface Greeks {
  price: number;
  delta: number;
  gamma: number;
  vega: number;
  theta: number;
  rho: number;
}
export function intrinsic(type: OptionType, spot: number, strike: number) {
  return Math.max(0, type === "call" ? spot - strike : strike - spot);
}
export function blackScholes({
  type,
  spot: S,
  strike: K,
  time: T,
  rate: r,
  vol: sigma,
}: OptionInputs): Greeks {
  if (
    ![S, K, T, r, sigma].every(Number.isFinite) ||
    S <= 0 ||
    K <= 0 ||
    T < 0 ||
    sigma < 0
  )
    throw new RangeError(
      "Use positive prices and nonnegative time and volatility.",
    );
  if (T === 0)
    return {
      price: intrinsic(type, S, K),
      delta:
        type === "call"
          ? S > K
            ? 1
            : S === K
              ? 0.5
              : 0
          : S < K
            ? -1
            : S === K
              ? -0.5
              : 0,
      gamma: 0,
      vega: 0,
      theta: 0,
      rho: 0,
    };
  const discount = Math.exp(-r * T);
  if (sigma === 0) {
    const itm = type === "call" ? S > K * discount : S < K * discount;
    const sign = type === "call" ? 1 : -1;
    return {
      price: intrinsic(type, S, K * discount),
      delta: itm ? sign : 0,
      gamma: 0,
      vega: 0,
      theta: itm ? (-sign * r * K * discount) / 365 : 0,
      rho: itm ? sign * K * T * discount * 0.01 : 0,
    };
  }
  const sqrtT = Math.sqrt(T),
    d1 = (Math.log(S / K) + (r + (sigma * sigma) / 2) * T) / (sigma * sqrtT),
    d2 = d1 - sigma * sqrtT;
  const call = type === "call";
  return {
    price: call
      ? S * normalCDF(d1) - K * discount * normalCDF(d2)
      : K * discount * normalCDF(-d2) - S * normalCDF(-d1),
    delta: call ? normalCDF(d1) : normalCDF(d1) - 1,
    gamma: normalPDF(d1) / (S * sigma * sqrtT),
    vega: S * normalPDF(d1) * sqrtT * 0.01,
    theta:
      ((-S * normalPDF(d1) * sigma) / (2 * sqrtT) +
        (call
          ? -r * K * discount * normalCDF(d2)
          : r * K * discount * normalCDF(-d2))) /
      365,
    rho:
      (call
        ? K * T * discount * normalCDF(d2)
        : -K * T * discount * normalCDF(-d2)) * 0.01,
  };
}
export function binomial(
  inputs: OptionInputs,
  steps: number,
  american = false,
) {
  const { spot: S, strike: K, time: T, vol: sigma, rate: r, type } = inputs;
  if (!Number.isInteger(steps) || steps < 1 || steps > 1000)
    throw new RangeError("Steps must be an integer from 1 to 1,000.");
  if (T <= 0 || sigma <= 0) {
    let price = blackScholes(inputs).price;
    if (american)
      for (let i = 0; i <= steps; i++)
        price = Math.max(
          price,
          Math.exp((-r * T * i) / steps) *
            intrinsic(type, S * Math.exp((r * T * i) / steps), K),
        );
    return { price, levels: [[price]], probability: 1 };
  }
  const dt = T / steps,
    u = Math.exp(sigma * Math.sqrt(dt)),
    d = 1 / u,
    p = (Math.exp(r * dt) - d) / (u - d),
    discount = Math.exp(-r * dt);
  if (p < 0 || p > 1)
    throw new RangeError(
      "Increase the step count for a valid risk-neutral probability.",
    );
  const levels: number[][] = Array.from({ length: steps + 1 }, () => []);
  levels[steps] = Array.from({ length: steps + 1 }, (_, j) =>
    intrinsic(type, S * Math.pow(u, j) * Math.pow(d, steps - j), K),
  );
  for (let i = steps - 1; i >= 0; i--)
    for (let j = 0; j <= i; j++) {
      const continuation =
        discount * (p * levels[i + 1][j + 1] + (1 - p) * levels[i + 1][j]);
      levels[i][j] = american
        ? Math.max(
            continuation,
            intrinsic(type, S * Math.pow(u, j) * Math.pow(d, i - j), K),
          )
        : continuation;
    }
  return { price: levels[0][0], levels, probability: p };
}
export interface Leg {
  type: OptionType;
  side: 1 | -1;
  strike: number;
}
export function optionStrategy(
  legs: Leg[],
  inputs: Omit<OptionInputs, "strike" | "type">,
) {
  const premiums = legs.map(
    (leg) =>
      blackScholes({ ...inputs, type: leg.type, strike: leg.strike }).price,
  );
  const netPremium = premiums.reduce((sum, p, i) => sum + p * legs[i].side, 0);
  const payoff = (spot: number) =>
    legs.reduce(
      (sum, leg) => sum + leg.side * intrinsic(leg.type, spot, leg.strike),
      0,
    ) - netPremium;
  const knots = [0, ...new Set(legs.map((leg) => leg.strike))].sort(
    (a, b) => a - b,
  );
  const rightSlope = legs
    .filter((leg) => leg.type === "call")
    .reduce((sum, leg) => sum + leg.side, 0);
  const values = knots.map(payoff),
    roots: number[] = [];
  for (let i = 0; i < knots.length - 1; i++) {
    const a = values[i],
      b = values[i + 1];
    if (Math.abs(a) < 1e-8) roots.push(knots[i]);
    if (a * b < 0)
      roots.push(knots[i] - (a * (knots[i + 1] - knots[i])) / (b - a));
  }
  const last = knots.at(-1)!,
    lastValue = values.at(-1)!;
  if (Math.abs(lastValue) < 1e-8) roots.push(last);
  if (rightSlope && -lastValue / rightSlope > 0)
    roots.push(last - lastValue / rightSlope);
  return {
    premiums,
    netPremium,
    payoff,
    breakevens: [...new Set(roots.map((v) => Math.round(v * 10000) / 10000))],
    maxProfit: rightSlope > 0 ? Infinity : Math.max(...values),
    minProfit: rightSlope < 0 ? -Infinity : Math.min(...values),
  };
}
