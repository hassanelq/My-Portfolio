import { describe, expect, it } from "vitest";
import { monthIndex, replayAsset, replayHistory } from "./dca";
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
    expect(result.assets.map((item) => item?.windows)).toEqual([462, 366, 162]);
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
