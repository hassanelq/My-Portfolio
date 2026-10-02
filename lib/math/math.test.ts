import { describe, expect, it } from "vitest";
import {
  blackScholes,
  binomial,
  optionStrategy,
  type OptionInputs,
} from "./options";
import { compound, dcf, valueAtRisk } from "./finance";
import { evaluate, optimize, portfolioCloud } from "./portfolio";
import { simulate } from "./simulation";
import { correlation, inverseNormal, normalCDF } from "./normal";
import { correlationCloud, syntheticMatch, wager } from "./games";
const option: OptionInputs = {
  type: "call",
  spot: 100,
  strike: 100,
  time: 1,
  rate: 0.05,
  vol: 0.2,
};
describe("option prices and Greeks", () => {
  it("matches the standard S=K=100, r=5%, sigma=20%, T=1 benchmark", () => {
    expect(blackScholes(option).price).toBeCloseTo(10.45058, 4);
    expect(blackScholes({ ...option, type: "put" }).price).toBeCloseTo(
      5.57352,
      4,
    );
  });
  it("satisfies put-call parity", () => {
    for (const spot of [50, 100, 175]) {
      const input = { ...option, spot };
      expect(
        blackScholes(input).price -
          blackScholes({ ...input, type: "put" }).price,
      ).toBeCloseTo(spot - 100 * Math.exp(-0.05), 8);
    }
  });
  it("agrees with numerical sensitivity calculations", () => {
    const result = blackScholes(option),
      h = 0.001,
      p = (patch: Partial<OptionInputs>) =>
        blackScholes({ ...option, ...patch }).price;
    expect(result.delta).toBeCloseTo(
      (p({ spot: 100 + h }) - p({ spot: 100 - h })) / (2 * h),
      4,
    );
    expect(result.gamma).toBeCloseTo(
      (p({ spot: 100 + h }) - 2 * result.price + p({ spot: 100 - h })) /
        (h * h),
      4,
    );
    expect(result.vega).toBeCloseTo(
      ((p({ vol: 0.20001 }) - p({ vol: 0.19999 })) / 0.00002) * 0.01,
      4,
    );
    expect(result.rho).toBeCloseTo(
      ((p({ rate: 0.05001 }) - p({ rate: 0.04999 })) / 0.00002) * 0.01,
      4,
    );
    expect(result.theta).toBeCloseTo(
      -(p({ time: 1.00001 }) - p({ time: 0.99999 })) / 0.00002 / 365,
      4,
    );
  });
  it("handles expiry and zero volatility without NaN", () => {
    expect(blackScholes({ ...option, time: 0, spot: 110 }).price).toBe(10);
    expect(blackScholes({ ...option, vol: 0 }).price).toBeCloseTo(
      100 - 100 * Math.exp(-0.05),
      9,
    );
    expect(() => blackScholes({ ...option, spot: 0 })).toThrow();
  });
  it("converges to Black-Scholes and respects the early-exercise bound", () => {
    expect(binomial(option, 500).price).toBeCloseTo(
      blackScholes(option).price,
      2,
    );
    const put = { ...option, type: "put" as const, spot: 65 };
    expect(binomial(put, 200, true).price).toBeGreaterThanOrEqual(35);
    expect(binomial(put, 200, true).price).toBeGreaterThanOrEqual(
      binomial(put, 200, false).price,
    );
    expect(binomial(option, 200, true).price).toBeCloseTo(
      binomial(option, 200, false).price,
      8,
    );
  });
  it("computes exact spread payoff bounds and breakeven", () => {
    const strategy = optionStrategy(
      [
        { type: "call", side: 1, strike: 95 },
        { type: "call", side: -1, strike: 110 },
      ],
      option,
    );
    expect(strategy.minProfit).toBeCloseTo(-strategy.netPremium, 8);
    expect(strategy.maxProfit).toBeCloseTo(15 - strategy.netPremium, 8);
    expect(strategy.payoff(strategy.breakevens[0])).toBeCloseTo(0, 3);
    expect(strategy.payoff(10000)).toBeCloseTo(strategy.maxProfit, 8);
  });
  it("reports naked-call risk as unbounded", () => {
    const long = optionStrategy(
        [{ type: "call", side: 1, strike: 100 }],
        option,
      ),
      short = optionStrategy([{ type: "call", side: -1, strike: 100 }], option);
    expect(long.maxProfit).toBe(Infinity);
    expect(short.minProfit).toBe(-Infinity);
  });
});
describe("portfolio and risk", () => {
  it("computes a standard normal quantile and scales VaR with sqrt(time)", () => {
    expect(inverseNormal(0.95)).toBeCloseTo(1.64485, 4);
    expect(normalCDF(0)).toBe(0.5);
    const day = valueAtRisk(1000000, 0.15, 1, 0.95),
      ten = valueAtRisk(1000000, 0.15, 10, 0.95);
    expect(day.varValue).toBeCloseTo(
      (150000 * 1.6448536269514722) / Math.sqrt(252),
      1,
    );
    expect(ten.varValue / day.varValue).toBeCloseTo(Math.sqrt(10), 10);
    expect(day.expectedShortfall).toBeGreaterThan(day.varValue);
  });
  it("finds feasible portfolios that dominate sampled alternatives", () => {
    const cloud = portfolioCloud();
    for (const rf of [0, 0.02, 0.06]) {
      const { minVar, maxSharpe, frontier } = optimize(rf);
      for (const p of [minVar, maxSharpe, ...frontier]) {
        expect(p.weights.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 7);
        expect(p.weights.every((w) => w >= 0)).toBe(true);
      }
      expect(minVar.risk).toBeLessThanOrEqual(
        Math.min(...cloud.map((p) => p.risk)),
      );
      expect(maxSharpe.sharpe + 1e-9).toBeGreaterThanOrEqual(
        Math.max(...cloud.map((p) => evaluate(p.weights, rf).sharpe)),
      );
      expect(frontier[0].risk).toBeCloseTo(minVar.risk, 7);
      for (let i = 1; i < frontier.length; i++)
        expect(frontier[i].risk + 1e-9).toBeGreaterThanOrEqual(
          frontier[i - 1].risk,
        );
    }
  });
  it("has deterministic zero-volatility simulations and reproducible random runs", () => {
    const input = {
      start: 10000,
      drift: 0.07,
      vol: 0,
      years: 1,
      seed: 42,
      count: 100,
    };
    const result = simulate(input);
    expect(result.mean).toBeCloseTo(10000 * Math.exp(0.07), 6);
    expect(result.p5).toBeCloseTo(result.p95, 8);
    expect(result.var95).toBe(0);
    expect(simulate({ ...input, vol: 0.2 }).p5).toBe(
      simulate({ ...input, vol: 0.2 }).p5,
    );
  });
});
describe("DCF and regular contributions", () => {
  it("values a level perpetuity consistently across the explicit and terminal periods", () => {
    expect(dcf(100, 0, 0.1, 0)!.total).toBeCloseTo(1000, 8);
    expect(dcf(100, 0.1, 0.03, 0.03)).toBeNull();
    expect(dcf(100, 0.1, 0.1, 0.03)!.total).toBeCloseTo(1792.20779, 4);
  });
  it("adds end-of-month contributions and deflates the complete nominal balance", () => {
    const input = {
      starting: 10000,
      monthly: 500,
      age: 30,
      targetAge: 65,
      inflation: 4,
    };
    const cash = compound(input, 0);
    expect(cash.nominal).toBe(220000);
    expect(cash.real).toBeCloseTo(220000 / 1.04 ** 35, 7);
    const monthlyRate = 1.105 ** (1 / 12) - 1,
      n = 420;
    expect(compound(input, 10.5).nominal).toBeCloseTo(
      10000 * (1 + monthlyRate) ** n +
        (500 * ((1 + monthlyRate) ** n - 1)) / monthlyRate,
      5,
    );
  });
  it("handles all-zero deposits and rejects zero horizons", () => {
    expect(
      compound(
        { starting: 0, monthly: 0, age: 30, targetAge: 31, inflation: 0 },
        0,
      ).real,
    ).toBe(0);
    expect(() =>
      compound(
        { starting: 100, monthly: 0, age: 30, targetAge: 30, inflation: 0 },
        0,
      ),
    ).toThrow();
  });
});
describe("arcade math", () => {
  it("generates 80 points at the requested sample correlation", () => {
    for (const rho of [-0.95, -0.3, 0, 0.5, 0.95]) {
      const cloud = correlationCloud(41, rho);
      expect(cloud).toHaveLength(80);
      expect(correlation(cloud)).toBeCloseTo(rho, 10);
    }
  });
  it("creates positive, deterministic matched price paths", () => {
    const prices = [100, 101, 99, 102, 105];
    const path = syntheticMatch(prices, 11);
    expect(path).toHaveLength(prices.length);
    expect(path[0]).toBe(100);
    expect(path.every((p) => p > 0)).toBe(true);
    expect(path).toEqual(syntheticMatch(prices, 11));
  });
  it("compounds fractional bets and preserves ruin at zero", () => {
    expect(wager(1000, 0.2, true)).toBe(1200);
    expect(wager(1000, 0.2, false)).toBe(800);
    expect(wager(wager(1000, 1, false), 1, true)).toBe(0);
  });
});
