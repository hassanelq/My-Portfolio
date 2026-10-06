import { describe, expect, it } from "vitest";
import { convertMoneyFields, fromDirhams, roundContribution } from "./currency";
import { formatMoney } from "./format";
import { rentBuyDefaults } from "../content/rent-buy";
import { compareRentBuy } from "./math/rent-buy";

describe("fixed currency conversion", () => {
  it("preserves blank amounts, zero, fractions and nonmonetary fields", () => {
    const mad = { spending: "", saved: "555", salary: 0, age: 23, rate: 5.18 };
    const keys = ["spending", "saved", "salary"] as const;
    const usd = convertMoneyFields(mad, keys, "DH", "USD");
    expect(usd).toEqual({ ...mad, saved: "55.5" });
    expect(convertMoneyFields(usd, keys, "USD", "DH")).toEqual(mad);
    expect(mad.saved).toBe("555");
    expect(fromDirhams(300, "USD")).toBe(30);
  });

  it("shows currency symbols and preserves contribution rounding across units", () => {
    expect(formatMoney(30, "USD")).toBe("30 $");
    expect(formatMoney(300, "DH")).toBe("300 DH");
    expect(formatMoney(55.5, "USD")).toBe("55,5 $");
    expect(roundContribution(5952.2, "DH")).toBe(5953);
    expect(roundContribution(595.22, "USD")).toBeCloseTo(595.3);
  });

  it("scales the entire housing path including fees, tax, loans and invested differences", () => {
    const mad = {
      ...rentBuyDefaults,
      rentSetupCosts: 555,
      saleGainTaxPercent: 20,
    };
    const usd = convertMoneyFields(
      mad,
      ["homePrice", "monthlyRent", "ownerMonthlyCosts", "rentSetupCosts"],
      "DH",
      "USD",
    );
    const original = compareRentBuy(mad);
    const converted = compareRentBuy(usd, 0.1);
    expect(converted.winner).toBe(original.winner);
    expect(converted.sustainedBreakEvenMonth).toBe(
      original.sustainedBreakEvenMonth,
    );
    for (const key of [
      "payment",
      "down",
      "loan",
      "buyingFees",
      "deposit",
      "startingCash",
      "advantage",
    ] as const)
      expect(converted[key]).toBeCloseTo(original[key] / 10, 6);
    original.records.forEach((month, i) => {
      for (const [key, value] of Object.entries(month))
        if (key !== "month")
          expect(converted.records[i][key as keyof typeof month]).toBeCloseTo(
            value / 10,
            6,
          );
    });
  });
});
