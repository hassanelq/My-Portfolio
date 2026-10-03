import { describe, expect, it } from "vitest";
import { rentBuyDefaults } from "../../content/rent-buy";
import {
  compareRentBuy,
  mortgagePayment,
  type RentBuyInputs,
} from "./rent-buy";

const simple: RentBuyInputs = {
  homePrice: 120000,
  monthlyRent: 1000,
  downPercent: 20,
  mortgageRate: 0,
  mortgageYears: 1,
  horizonYears: 1,
  homeGrowth: 0,
  rentGrowth: 0,
  investmentReturn: 0,
  inflation: 0,
  purchaseCostsPercent: 0,
  saleCostsPercent: 0,
  maintenancePercent: 0,
  ownerMonthlyCosts: 0,
  mortgageInsurancePercent: 0,
  rentDepositMonths: 0,
  rentSetupCosts: 0,
  saleGainTaxPercent: 0,
};

describe("rent versus buy on equal resources", () => {
  it("matches a mortgage benchmark and handles zero interest and cash purchases", () => {
    expect(mortgagePayment(100000, 6, 360)).toBeCloseTo(599.550525, 6);
    expect(mortgagePayment(120000, 0, 240)).toBe(500);
    expect(mortgagePayment(0, 5, 240)).toBe(0);
    const cash = compareRentBuy({ ...simple, downPercent: 100 });
    expect(cash.loan).toBe(0);
    expect(cash.payment).toBe(0);
    expect(cash.final.buyerPortfolio).toBe(12000);
    expect(cash.final.buyerWealth).toBe(132000);
    expect(cash.final.renterWealth).toBe(120000);
  });
  it("builds equity from principal and invests the full monthly saving on the other path", () => {
    const plan = compareRentBuy(simple);
    expect(plan.payment).toBe(8000);
    expect(plan.principalTotal).toBe(96000);
    expect(plan.interestTotal).toBe(0);
    expect(plan.final.loanBalance).toBe(0);
    expect(plan.final.buyerWealth).toBe(120000);
    expect(plan.final.renterWealth).toBe(24000 + 12 * 7000);
    expect(plan.advantage).toBe(12000);
  });
  it("matches independent closed-form loan and investment balances", () => {
    const input = {
      ...simple,
      homePrice: 1000000,
      mortgageRate: 6,
      mortgageYears: 20,
      horizonYears: 10,
      investmentReturn: 5,
    };
    const plan = compareRentBuy(input);
    const r = 0.06 / 12,
      n = 120;
    const expectedLoan =
      800000 * (1 + r) ** n - plan.payment * (((1 + r) ** n - 1) / r);
    const g = 1.05 ** (1 / 12);
    const expectedInvestments =
      200000 * g ** n + (plan.payment - 1000) * ((g ** n - 1) / (g - 1));
    expect(plan.final.loanBalance).toBeCloseTo(expectedLoan, 5);
    expect(plan.final.renterPortfolio).toBeCloseTo(expectedInvestments, 5);
    expect(plan.final.buyerWealth).toBeCloseTo(1000000 - expectedLoan, 5);
    expect(plan.interestTotal).toBeCloseTo(
      plan.payment * n - (800000 - expectedLoan),
      5,
    );
  });
  it("charges transaction fees once and locks then refunds the rental deposit", () => {
    const plan = compareRentBuy({
      ...simple,
      purchaseCostsPercent: 7,
      saleCostsPercent: 3,
      rentDepositMonths: 2,
      rentSetupCosts: 1000,
    });
    expect(plan.startingCash).toBe(32400);
    expect(plan.records[0].buyerWealth).toBe(20400);
    expect(plan.records[0].renterPortfolio).toBe(29400);
    expect(plan.records[0].renterWealth).toBe(31400);
    expect(plan.final.renterWealth).toBe(31400 + 12 * 7000);
    expect(plan.final.buyerWealth).toBe(116400);
    const largerRentalUpfront = compareRentBuy({
      ...simple,
      downPercent: 0,
      rentDepositMonths: 2,
      rentSetupCosts: 1000,
    });
    expect(largerRentalUpfront.startingCash).toBe(3000);
    expect(largerRentalUpfront.records[0].buyerPortfolio).toBe(3000);
    expect(largerRentalUpfront.records[0].renterWealth).toBe(2000);
  });
  it("stops the loan and its insurance at payoff, then lets the owner invest savings", () => {
    const plan = compareRentBuy({
      ...simple,
      horizonYears: 2,
      mortgageInsurancePercent: 1.2,
    });
    expect(plan.records[12].ownerCost).toBe(8096);
    expect(plan.records[13].ownerCost).toBe(0);
    expect(plan.final.buyerPortfolio).toBe(12000);
    expect(plan.principalTotal).toBe(96000);
    expect(plan.final.loanBalance).toBe(0);
  });
  it("increases rent and recurring costs only on anniversaries", () => {
    const plan = compareRentBuy({
      ...simple,
      horizonYears: 2,
      ownerMonthlyCosts: 100,
      rentGrowth: 10,
      inflation: 10,
    });
    expect(plan.records[12].rentCost).toBe(1000);
    expect(plan.records[13].rentCost).toBe(1100);
    expect(plan.records[12].ownerCost).toBe(8100);
    expect(plan.records[13].ownerCost).toBeCloseTo(110);
  });
  it("deflates both outcomes consistently and does not turn mortgage debt into zero wealth", () => {
    const plan = compareRentBuy({ ...simple, inflation: 10 });
    expect(plan.final.buyerReal).toBeCloseTo(120000 / 1.1);
    expect(plan.final.renterReal).toBeCloseTo(108000 / 1.1);
    const loss = compareRentBuy({
      ...simple,
      downPercent: 0,
      mortgageYears: 50,
      homeGrowth: -20,
    });
    expect(loss.final.homeValue).toBeCloseTo(96000, 7);
    expect(loss.final.loanBalance).toBe(117600);
    expect(loss.final.buyerPortfolio).toBe(9600);
    expect(loss.final.buyerReal).toBeCloseTo(-21600 + 9600, 7);
  });
  it("applies the optional tax allowance to net gains and never credits a tax loss", () => {
    const input = {
      ...simple,
      purchaseCostsPercent: 7,
      saleCostsPercent: 3,
      saleGainTaxPercent: 20,
    };
    const gain = compareRentBuy({ ...input, homeGrowth: 20 });
    expect(gain.final.gainTax).toBeCloseTo((144000 - 4320 - 128400) * 0.2, 6);
    expect(compareRentBuy({ ...input, homeGrowth: -10 }).final.gainTax).toBe(0);
  });
  it("identifies only a lead that holds to the chosen horizon and supports a tie", () => {
    const plan = compareRentBuy(simple);
    expect(plan.winner).toBe("buy");
    const month = plan.sustainedBreakEvenMonth!;
    expect(
      plan.records.slice(month).every((p) => p.buyerWealth >= p.renterWealth),
    ).toBe(true);
    if (month > 0)
      expect(plan.records[month - 1].buyerWealth).toBeLessThan(
        plan.records[month - 1].renterWealth,
      );
    const tie = compareRentBuy({ ...simple, downPercent: 100, monthlyRent: 0 });
    expect(tie.winner).toBe("tie");
    expect(tie.sustainedBreakEvenMonth).toBeNull();
    const rent = compareRentBuy({ ...simple, homeGrowth: -20, monthlyRent: 0 });
    expect(rent.winner).toBe("rent");
    expect(rent.sustainedBreakEvenMonth).toBeNull();
  });
  it("supports falling investment returns and rejects invalid rates and horizons", () => {
    const falling = compareRentBuy({
      ...simple,
      downPercent: 100,
      monthlyRent: 0,
      investmentReturn: -20,
    });
    expect(falling.final.renterPortfolio).toBeCloseTo(96000, 7);
    for (const change of [
      { downPercent: 101 },
      { homePrice: 0 },
      { mortgageRate: -1 },
      { investmentReturn: -100 },
      { inflation: NaN },
      { horizonYears: 1.5 },
      { mortgageYears: 0 },
      { monthlyRent: -1 },
      { saleGainTaxPercent: 101 },
    ])
      expect(() => compareRentBuy({ ...simple, ...change })).toThrow();
    const defaultPlan = compareRentBuy(rentBuyDefaults);
    expect(defaultPlan.annual).toHaveLength(11);
    expect(
      defaultPlan.records.every((p) => Object.values(p).every(Number.isFinite)),
    ).toBe(true);
  });
});
