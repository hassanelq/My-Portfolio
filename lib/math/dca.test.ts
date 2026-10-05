import { describe, expect, it } from "vitest";
import {
  monthIndex,
  replayAsset,
  replayHistory,
  portfolioWindow,
  type HistoricalData,
} from "./dca";
import history from "../../content/dca-history.json";
const metadata = { id: "sp500" as const, start: "2000-01", end: "2001-02" };
const inputs = { starting: 100, monthly: 10, age: 23, targetAge: 24 };

describe("historical monthly investing", () => {
  it("matches an independent units-bought calculation across rolling windows", () => {
    const prices = [
      100, 96, 108, 105, 90, 110, 120, 111, 115, 121, 119, 135, 140, 132,
    ];
    const cpi = prices.map((_, i) => 100 + i / 2);
    const direct = [0, 1]
      .map((start) => {
        let units = inputs.starting / prices[start];
        for (let m = 1; m <= 12; m++)
          units += inputs.monthly / prices[start + m];
        return (units * prices[start + 12] * cpi[start]) / cpi[start + 12];
      })
      .sort((a, b) => a - b);
    const result = replayAsset(inputs, prices, cpi, metadata)!;
    expect(result.windows).toBe(2);
    expect(result.median).toBeCloseTo((direct[0] + direct[1]) / 2, 9);
    expect(result.low).toBeCloseTo(direct[0] * 0.9 + direct[1] * 0.1, 9);
    expect(result.high).toBeCloseTo(direct[0] * 0.1 + direct[1] * 0.9, 9);
    expect(result.points[0].value).toBe(100);
    expect(result.points.at(-1)!.value).toBe(result.median);
  });
  it("adds deposits at month-end and uses observed inflation rather than a fixed rate", () => {
    const prices = Array.from({ length: 13 }, (_, i) => 100 * 1.01 ** i);
    const cpi = Array.from({ length: 13 }, (_, i) => 100 * 1.002 ** i);
    const result = replayAsset(inputs, prices, cpi, metadata)!;
    const expected =
      (100 * 1.01 ** 12 + (10 * (1.01 ** 12 - 1)) / 0.01) / 1.002 ** 12;
    expect(result.windows).toBe(1);
    expect(result.median).toBeCloseTo(expected, 8);
    expect(result.low).toBe(result.high);
    const bank = replayAsset(
      inputs,
      prices.map(() => 1),
      cpi,
      { ...metadata, id: "cash" },
    )!;
    expect(bank.median).toBeCloseTo(220 / 1.002 ** 12, 9);
  });
  it("requires a complete window and rejects invalid observations and inputs", () => {
    expect(
      replayAsset(inputs, Array(12).fill(100), Array(12).fill(100), metadata),
    ).toBeNull();
    expect(() =>
      replayAsset({ ...inputs, targetAge: 23 }, [1], [1], metadata),
    ).toThrow();
    expect(() => replayAsset(inputs, [1, 0], [1, 1], metadata)).toThrow();
    expect(() => replayAsset(inputs, [1, 2], [1], metadata)).toThrow();
  });
  it("handles zero savings without invented gains", () => {
    const result = replayAsset(
      { ...inputs, starting: 0, monthly: 0 },
      Array(25).fill(100),
      Array(25).fill(100),
      metadata,
    )!;
    expect(result.windows).toBe(13);
    expect(result.points.every((p) => p.value === 0)).toBe(true);
  });
});

describe("pinned market data", () => {
  it("contains consecutive positive monthly levels with a common cutoff", () => {
    expect(history.cpi.length).toBe(
      monthIndex(history.end) - monthIndex(history.start) + 1,
    );
    expect(history.cpi.every((v) => Number.isFinite(v) && v > 0)).toBe(true);
    for (const asset of Object.values(history.assets)) {
      expect(asset.levels.length).toBe(
        monthIndex(history.end) - monthIndex(asset.start) + 1,
      );
      expect(asset.levels.every((v) => Number.isFinite(v) && v > 0)).toBe(true);
    }
  });
  it("uses each series actual coverage and preserves percentile ordering", () => {
    const result = replayHistory(
      { ...inputs, starting: 0, monthly: 1500, targetAge: 50 },
      history,
    );
    expect(result.assets.map((item) => item?.windows)).toEqual([
      462, 366, 162, 139, 139,
    ]);
    for (const item of [...result.assets, result.cash]) {
      expect(item!.points).toHaveLength(28);
      expect(item!.low).toBeLessThanOrEqual(item!.median);
      expect(item!.median).toBeLessThanOrEqual(item!.high);
    }
  });
  it("does not substitute a synthetic MSCI history for unsupported horizons", () => {
    const result = replayHistory({ ...inputs, targetAge: 68 }, history);
    expect(result.assets[0]).not.toBeNull();
    expect(result.assets[1]).not.toBeNull();
    expect(result.assets[2]).toBeNull();
  });
});

describe("portfolio cash accounting", () => {
  function fixture(
    sp = Array(13).fill(100),
    gold = Array(13).fill(100),
  ): HistoricalData {
    const series = (levels: number[]) => ({ start: "2000-01", levels });
    return {
      start: "2000-01",
      end: "2001-01",
      cpi: Array(13).fill(100),
      usCpi: Array(13).fill(200),
      assets: {
        sp500: series(sp),
        gold: series(gold),
        bonds: series(Array(13).fill(100)),
        world: series(Array(13).fill(100)),
      },
    };
  }
  it("conserves flat-market deposits after purchase costs, with no gains tax", () => {
    const rows = portfolioWindow(
      { ...inputs, starting: 1000, monthly: 100 },
      fixture(),
      0,
      12,
    );
    expect(rows.at(-1)!.nominal).toBeCloseTo(2200 / 1.001, 5);
    expect(
      rows.reduce((s, r) => s + r.fees, 0) + rows.at(-1)!.nominal,
    ).toBeCloseTo(2200, 5);
    expect(rows.reduce((s, r) => s + r.tax, 0)).toBeLessThan(1e-7);
  });
  it("matches an independently solved taxable sale and fees equation", () => {
    // Stocks double, gold halves: only stocks are sold to restore 60/30/10.
    const data = fixture(
      [100, ...Array(12).fill(200)],
      [100, ...Array(12).fill(50)],
    );
    const rows = portfolioWindow(
      { ...inputs, starting: 1001, monthly: 0 },
      data,
      0,
      1,
    );
    // Initial investment = 1000; post-return holdings = 1200, 300, 50.
    // F=.001*(850-.2*N), T=.20*.5*(1200-.6*N).
    const expected = (1550 - 0.85 - 120) / (1 - 0.0002 - 0.06);
    const sold = 1200 - 0.6 * expected;
    expect(rows[0].fees).toBeCloseTo(1, 9);
    expect(rows[1].nominal).toBeCloseTo(expected, 6);
    expect(rows[1].tax).toBeCloseTo(0.2 * 0.5 * sold, 6);
    expect(rows[1].nominal + rows[1].fees + rows[1].tax).toBeCloseTo(1550, 6);
  });
  it("preserves zero balances and uses the chosen CPI after portfolio deductions", () => {
    const data = fixture();
    data.usCpi = Array.from({ length: 13 }, (_, i) => 100 * 1.01 ** i);
    const zero = replayHistory(
      { ...inputs, starting: 0, monthly: 0 },
      data,
      "us",
    );
    expect([...zero.assets, zero.cash].every((r) => r!.median === 0)).toBe(
      true,
    );
    const ma = replayHistory(inputs, data, "morocco").assets.find(
      (r) => r?.id === "portfolio",
    )!;
    const us = replayHistory(inputs, data, "us").assets.find(
      (r) => r?.id === "portfolio",
    )!;
    expect(us.median).toBeCloseTo(ma.median / 1.01 ** 12, 7);
    expect(us.windows).toBe(ma.windows);
  });
});
