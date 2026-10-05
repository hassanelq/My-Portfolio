import { describe, expect, it } from "vitest";
import {
  averageCapitalPerMonth,
  calculateRetirementPlan,
  createRetirementHistory,
  earliestRetirementAge,
  futureSavings,
  requiredMonthlyContribution,
} from "./retirement";
import history from "../../content/dca-history.json";
import usHistory from "../../content/retirement-us-history.json";
import { retirementDefaults } from "../../content/retirement";
import { monthIndex } from "./dca";

function fixture(levels: number[], cpi = levels.map(() => 100)) {
  const last = levels.length - 1;
  return createRetirementHistory({
    start: "2000-01",
    end: `${2000 + Math.floor(last / 12)}-${String((last % 12) + 1).padStart(2, "0")}`,
    levels,
    cpi,
  });
}

// Independent nominal ledger: inflation changes the cash amount withdrawn.
function drawdown(
  capital: number,
  spending: number,
  levels: number[],
  cpi: number[],
  start: number,
  months: number,
) {
  let balance = capital;
  let minimum = balance;
  for (let i = start; i < start + months; i++) {
    balance -= (spending * cpi[i]) / cpi[start];
    minimum = Math.min(minimum, balance);
    balance *= levels[i + 1] / levels[i];
  }
  return { balance: (balance * cpi[start]) / cpi[start + months], minimum };
}

describe("historical retirement withdrawals", () => {
  it("finds the solvency boundary for every window, independently of the real-return formula", () => {
    const prices = [
      100, 95, 72, 85, 110, 130, 112, 120, 110, 135, 141, 132, 149, 152, 147,
    ];
    const cpi = prices.map((_, i) => 100 + i * 0.8);
    const model = fixture(prices, cpi);
    const stats = model.getWindows(1)!;
    expect(stats.windows).toBe(3);
    for (let start = 0; start < stats.windows; start++) {
      const target = stats.windowCapital[start] * 1000;
      const exact = drawdown(target, 1000, prices, cpi, start, 12);
      expect(exact.balance).toBeCloseTo(0, 7);
      expect(exact.minimum).toBeGreaterThan(-1e-7);
      expect(
        drawdown(target - 1, 1000, prices, cpi, start, 12).balance,
      ).toBeLessThan(0);
      expect(
        drawdown(stats.capitalPerMonth * 1000, 1000, prices, cpi, start, 12)
          .minimum,
      ).toBeGreaterThan(-1e-7);
    }
    expect(stats.withdrawalRate).toBeCloseTo(
      12 / Math.max(...stats.windowCapital),
      12,
    );
  });

  it("distinguishes return order even when the compound return is identical", () => {
    const earlyCrash = fixture([100, ...Array(11).fill(50), 100]);
    const lateCrash = fixture([100, ...Array(11).fill(200), 100]);
    expect(earlyCrash.monthlyFactor).toBe(lateCrash.monthlyFactor);
    expect(earlyCrash.getWindows(1)!.capitalPerMonth).toBe(23);
    expect(lateCrash.getWindows(1)!.capitalPerMonth).toBe(6.5);
  });

  it("withdraws at the beginning of each month and cancels equal market growth and inflation", () => {
    const levels = Array.from({ length: 25 }, (_, i) => 100 * 1.01 ** i);
    expect(fixture(levels, levels).getWindows(2)!.capitalPerMonth).toBeCloseTo(
      24,
      10,
    );
    expect(fixture(levels).getWindows(2)!.capitalPerMonth).toBeCloseTo(
      Array.from({ length: 24 }, (_, i) => 1 / 1.01 ** i).reduce(
        (a, b) => a + b,
      ),
      10,
    );
  });

  it("requires a full horizon and rejects invalid or unaligned observations", () => {
    expect(fixture(Array(12).fill(100)).getWindows(1)).toBeNull();
    expect(fixture(Array(13).fill(100)).getWindows(1)!.windows).toBe(1);
    expect(() => fixture([100, 0])).toThrow();
    expect(() => fixture([100, Number.NaN])).toThrow();
    expect(() => fixture([100, 110], [100])).toThrow();
    expect(() => fixture([100, 110]).getWindows(1.5)).toThrow();
    expect(() =>
      createRetirementHistory({
        start: "2000-01",
        end: "2001-01",
        levels: [1, 2],
        cpi: [1, 2],
      }),
    ).toThrow();
  });
});

describe("funding a retirement plan", () => {
  it.each([1, 1.005, 0.995])(
    "solves contributions and spend-down under real growth factor %s",
    (factor) => {
      const model = fixture(
        Array.from({ length: 121 }, (_, i) => 100 * factor ** i),
      );
      const inputs = {
        livingCost: 500,
        starting: 1000,
        age: 25,
        retireAt: 30,
        untilAge: 35,
      };
      const plan = calculateRetirementPlan(inputs, model, "average")!;
      let savings = inputs.starting;
      for (let i = 0; i < 60; i++)
        savings = savings * factor + plan.monthlyContribution!;
      expect(savings).toBeCloseTo(plan.target, 6);
      expect(plan.points.find((p) => p.age === 30)!.value).toBeCloseTo(
        plan.target,
        6,
      );
      expect(plan.terminalBalance).toBeCloseTo(0, 5);
      expect(plan.points.every((p) => p.value >= -1e-5)).toBe(true);
      expect(
        futureSavings(1000, plan.monthlyContribution!, 60, factor),
      ).toBeCloseTo(savings, 6);
    },
  );

  it("handles zero spending, already-funded savings and immediate shortfalls", () => {
    const model = fixture(Array(121).fill(100));
    const inputs = {
      livingCost: 100,
      starting: 0,
      age: 25,
      retireAt: 30,
      untilAge: 35,
    };
    const zero = calculateRetirementPlan(
      { ...inputs, livingCost: 0 },
      model,
      "historical",
    )!;
    expect(zero.target).toBe(0);
    expect(zero.monthlyContribution).toBe(0);
    expect(zero.points.every((p) => p.value === 0)).toBe(true);
    const funded = calculateRetirementPlan(
      { ...inputs, starting: 10000 },
      model,
      "historical",
    )!;
    expect(funded.monthlyContribution).toBe(0);
    expect(funded.terminalBalance).toBe(4000);
    const immediate = calculateRetirementPlan(
      { ...inputs, retireAt: 25 },
      model,
      "historical",
    )!;
    expect(immediate.monthlyContribution).toBeNull();
    expect(immediate.points).toEqual([{ age: 25, value: 0 }]);
    expect(requiredMonthlyContribution(12000, 12000, 0, 1)).toBe(0);
    expect(averageCapitalPerMonth(24, 1)).toBe(24);
  });

  it("recomputes each candidate horizon when finding the earliest retirement age", () => {
    const model = fixture(Array(601).fill(100));
    const inputs = {
      livingCost: 100,
      starting: 0,
      age: 25,
      retireAt: 40,
      untilAge: 75,
    };
    // At zero return with equal savings/spending: years saving = years retired.
    expect(earliestRetirementAge(inputs, 100, model, "historical")).toBe(50);
    expect(earliestRetirementAge(inputs, 300, model, "historical")).toBe(38);
    expect(earliestRetirementAge(inputs, 0, model, "historical")).toBeNull();
    expect(
      earliestRetirementAge(
        { ...inputs, starting: 60000 },
        0,
        model,
        "historical",
      ),
    ).toBe(25);
    expect(() =>
      earliestRetirementAge(inputs, -100, model, "historical"),
    ).toThrow();
  });

  it("rejects invalid ages and returns no invented result beyond data coverage", () => {
    const model = fixture(Array(121).fill(100));
    expect(
      calculateRetirementPlan(retirementDefaults, model, "historical"),
    ).toBeNull();
    for (const change of [
      { livingCost: -1 },
      { starting: Infinity },
      { age: 46 },
      { untilAge: 45 },
      { retireAt: 45.5 },
    ])
      expect(() =>
        calculateRetirementPlan(
          { ...retirementDefaults, ...change },
          model,
          "historical",
        ),
      ).toThrow();
  });
});

describe("pinned retirement history", () => {
  const morocco = createRetirementHistory({
    start: history.start,
    end: history.end,
    levels: history.assets.sp500.levels,
    cpi: history.cpi,
  });
  const us = createRetirementHistory(usHistory);
  it("has aligned positive monthly US observations and consistent market returns across references", () => {
    expect(usHistory.levels).toHaveLength(1170);
    expect(usHistory.end).toBe(history.end);
    const offset = monthIndex(history.start) - monthIndex(usHistory.start);
    for (let i = 1; i < history.cpi.length; i++)
      expect(
        usHistory.levels[offset + i] / usHistory.levels[offset + i - 1],
      ).toBeCloseTo(
        history.assets.sp500.levels[i] / history.assets.sp500.levels[i - 1],
        8,
      );
  });
  it("funds every recorded default window, while smooth average returns do not", () => {
    for (const [model, expectedWindows] of [
      [morocco, 366],
      [us, 750],
    ] as const) {
      const plan = calculateRetirementPlan(
        retirementDefaults,
        model,
        "historical",
      )!;
      expect(plan.stats.windows).toBe(expectedWindows);
      expect(plan.successRate).toBe(1);
      expect(plan.terminalBalance).toBeCloseTo(0, 3);
      expect(plan.points.every((p) => p.value >= -0.001)).toBe(true);
      expect(
        earliestRetirementAge(
          retirementDefaults,
          Math.ceil(plan.monthlyContribution!),
          model,
          "historical",
        ),
      ).toBeLessThanOrEqual(retirementDefaults.retireAt);
      // Replay every historical window in a separate nominal ledger.
      for (let start = 0; start < expectedWindows; start++)
        expect(
          drawdown(
            plan.target,
            retirementDefaults.livingCost,
            model.series.levels,
            model.series.cpi,
            start,
            (retirementDefaults.untilAge - retirementDefaults.retireAt) * 12,
          ).minimum,
        ).toBeGreaterThan(-0.001);
      const average = calculateRetirementPlan(
        retirementDefaults,
        model,
        "average",
      )!;
      expect(average.target).toBeLessThan(plan.target);
      expect(average.successCount).toBeLessThan(expectedWindows);
      expect(average.terminalBalance).toBeCloseTo(0, 3);
    }
  });
});

describe("custom real growth", () => {
  const model = fixture(Array.from({ length: 61 }, (_, i) => 100 * 1.004 ** i));
  const inputs = {
    livingCost: 100,
    starting: 0,
    age: 23,
    retireAt: 25,
    untilAge: 28,
  };
  it("changes accumulation without changing the historical withdrawal test", () => {
    const base = calculateRetirementPlan(inputs, model, "historical")!;
    const flat = calculateRetirementPlan(inputs, model, "historical", 0)!;
    const negative = calculateRetirementPlan(
      inputs,
      model,
      "historical",
      -0.05,
    )!;
    expect(flat.target).toBe(base.target);
    expect(flat.withdrawalRate).toBe(base.withdrawalRate);
    expect(flat.successCount).toBe(base.successCount);
    expect(flat.monthlyContribution).toBeCloseTo(flat.target / 24, 8);
    expect(negative.monthlyContribution!).toBeGreaterThan(
      flat.monthlyContribution!,
    );
    expect(flat.monthlyContribution!).toBeGreaterThan(
      base.monthlyContribution!,
    );
    expect(negative.terminalBalance).toBeCloseTo(0, 5);
  });
  it("uses the same custom growth for average retirement and alternative ages", () => {
    const flat = calculateRetirementPlan(inputs, model, "average", 0)!;
    expect(flat.target).toBe(3600);
    expect(flat.monthlyContribution).toBe(150);
    expect(flat.withdrawalRate).toBeCloseTo(1 / 3);
    expect(flat.terminalBalance).toBeCloseTo(0, 8);
    expect(earliestRetirementAge(inputs, 150, model, "average", 0)).toBe(25);
    const growing = calculateRetirementPlan(inputs, model, "average", 0.08)!;
    expect(growing.target).toBeLessThan(flat.target);
    expect(growing.withdrawalRate).toBeGreaterThan(flat.withdrawalRate);
  });
  it("rejects invalid growth overrides", () => {
    for (const rate of [-1, -2, NaN, Infinity]) {
      expect(() =>
        calculateRetirementPlan(inputs, model, "average", rate),
      ).toThrow(RangeError);
      expect(() =>
        earliestRetirementAge(inputs, 150, model, "historical", rate),
      ).toThrow(RangeError);
    }
  });
});
