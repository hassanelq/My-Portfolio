import { describe, expect, it } from "vitest";
import { compareFees, type FeeInputs, type FeeSchedule } from "./fees";

const zero: FeeSchedule = {
  fundAnnual: 0,
  accountAnnual: 0,
  accountFixedAnnual: 0,
  tradePercent: 0,
  tradeMinimum: 0,
  fxPercent: 0,
};
const input: FeeInputs = { starting: 1000, monthly: 100, years: 2, growth: 6 };

describe("investment fee comparison", () => {
  it("matches an independent annuity calculation with no fees", () => {
    const result = compareFees(input, [zero, zero]);
    const g = 1.06 ** (1 / 12),
      n = 24;
    const expected = 1000 * g ** n + (100 * (g ** n - 1)) / (g - 1);
    expect(result.paths[0].final.balance).toBeCloseTo(expected, 8);
    expect(result.paths[0].gap).toBeCloseTo(0, 8);
    expect(result.difference).toBe(0);
    expect(result.contributed).toBe(3400);
  });

  it("pays flat fees from the same budget and keeps the fee/growth identity", () => {
    const result = compareFees(
      { starting: 0, monthly: 100, years: 1, growth: 0 },
      [zero, { ...zero, accountFixedAnnual: 120, tradeMinimum: 2 }],
    );
    const path = result.paths[1];
    expect(path.final.balance).toBe(1056);
    expect(path.accountPaid).toBe(120);
    expect(path.tradingPaid).toBe(24);
    expect(path.paid).toBe(144);
    expect(path.gap).toBe(144);
    expect(path.growthDifference).toBe(0);
  });

  it("matches the closed-form result for proportional holding costs", () => {
    const fees = { ...zero, fundAnnual: 1.2, accountAnnual: 0.6 };
    const path = compareFees(input, [fees, zero]).paths[0];
    const h = 1.06 ** (1 / 12) * (1 - 0.018 / 12);
    const expected = 1000 * h ** 24 + (100 * (h ** 24 - 1)) / (h - 1);
    expect(path.final.balance).toBeCloseTo(expected, 8);
    expect(path.fundPaid).toBeCloseTo(path.accountPaid * 2, 8);
    expect(path.gap).toBeCloseTo(path.paid + path.growthDifference, 8);
  });

  it("solves the purchase budget with commission floors and exchange costs", () => {
    for (const tradePercent of [0.5, 2]) {
      const path = compareFees(
        { ...input, starting: 103, monthly: 0, growth: 0 },
        [{ ...zero, tradePercent, tradeMinimum: 2, fxPercent: 1 }, zero],
      ).paths[0];
      expect(path.records[0].invested).toBeCloseTo(100, 10);
      expect(path.tradingPaid).toBeCloseTo(2, 10);
      expect(path.fxPaid).toBeCloseTo(1, 10);
      expect(path.final.balance + path.paid).toBeCloseTo(103, 10);
    }
  });

  it("holds cash without charging a failed order until a purchase is possible", () => {
    const path = compareFees({ starting: 5, monthly: 5, years: 1, growth: 0 }, [
      { ...zero, tradeMinimum: 10 },
      zero,
    ]).paths[0];
    expect(path.records[0].cash).toBe(5);
    expect(path.records[1].cash).toBe(10);
    expect(path.records[1].paid).toBe(0);
    expect(path.records[2].invested).toBe(5);
    expect(path.records[2].tradingFee).toBe(10);
    expect(path.final.balance + path.paid).toBe(65);
    expect(path.delayedPurchases).toBeGreaterThan(0);
  });

  it("reports account charges that cannot be paid without inventing debt", () => {
    const path = compareFees({ starting: 0, monthly: 0, years: 1, growth: 0 }, [
      { ...zero, accountFixedAnnual: 120 },
      zero,
    ]).paths[0];
    expect(path.final.balance).toBe(0);
    expect(path.paid).toBe(0);
    expect(path.unpaidAccountFees).toBe(120);
    expect(path.records.every((p) => p.balance >= 0)).toBe(true);
  });

  it("allows a negative growth difference when returns are negative", () => {
    const path = compareFees(
      { starting: 1000, monthly: 0, years: 2, growth: -20 },
      [{ ...zero, tradeMinimum: 100 }, zero],
    ).paths[0];
    expect(path.paid).toBe(100);
    expect(path.gap).toBeCloseTo(64, 8);
    expect(path.growthDifference).toBeCloseTo(-36, 8);
  });

  it("scales fixed costs, balances and fee components consistently across currencies", () => {
    const fees = {
      ...zero,
      fundAnnual: 1.5,
      accountAnnual: 0.25,
      accountFixedAnnual: 120,
      tradePercent: 0.5,
      tradeMinimum: 10,
      fxPercent: 1,
    };
    const mad = compareFees(input, [fees, zero]);
    const usd = compareFees({ ...input, starting: 100, monthly: 10 }, [
      { ...fees, accountFixedAnnual: 12, tradeMinimum: 1 },
      zero,
    ]);
    for (const key of [
      "gap",
      "paid",
      "fundPaid",
      "accountPaid",
      "tradingPaid",
      "fxPaid",
      "growthDifference",
    ] as const)
      expect(usd.paths[0][key]).toBeCloseTo(mad.paths[0][key] / 10, 8);
    expect(usd.paths[0].final.balance).toBeCloseTo(
      mad.paths[0].final.balance / 10,
      8,
    );
  });

  it("rejects invalid values and keeps maximum supported scenarios finite", () => {
    for (const bad of [
      { ...input, monthly: -1 },
      { ...input, growth: -100 },
      { ...input, years: 0.5 },
      { ...input, starting: NaN },
    ])
      expect(() => compareFees(bad, [zero, zero])).toThrow(RangeError);
    expect(() =>
      compareFees(input, [{ ...zero, fundAnnual: 11 }, zero]),
    ).toThrow(RangeError);
    expect(() => compareFees(input, [zero])).toThrow(RangeError);
    const result = compareFees(
      { starting: 100000000, monthly: 1000000, years: 50, growth: 25 },
      [{ ...zero, fundAnnual: 10, accountAnnual: 10 }, zero],
    );
    expect(
      result.paths.every((path) =>
        path.records.every((p) => Object.values(p).every(Number.isFinite)),
      ),
    ).toBe(true);
  });
});
