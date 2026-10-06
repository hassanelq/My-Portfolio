export interface RentBuyInputs {
  homePrice: number;
  monthlyRent: number;
  downPercent: number;
  mortgageRate: number;
  mortgageYears: number;
  horizonYears: number;
  homeGrowth: number;
  rentGrowth: number;
  investmentReturn: number;
  inflation: number;
  purchaseCostsPercent: number;
  saleCostsPercent: number;
  maintenancePercent: number;
  ownerMonthlyCosts: number;
  mortgageInsurancePercent: number;
  rentDepositMonths: number;
  rentSetupCosts: number;
  saleGainTaxPercent: number;
}

export function mortgagePayment(
  principal: number,
  annualPercent: number,
  months: number,
) {
  if (
    ![principal, annualPercent, months].every(Number.isFinite) ||
    principal < 0 ||
    annualPercent < 0 ||
    !Number.isInteger(months) ||
    months < 1
  )
    throw new RangeError(
      "Use nonnegative loan amounts and rates, and a positive whole-month term.",
    );
  const rate = annualPercent / 1200;
  return rate === 0
    ? principal / months
    : (principal * rate) / -Math.expm1(-months * Math.log1p(rate));
}

export interface HousingMonth {
  month: number;
  homeValue: number;
  loanBalance: number;
  buyerPortfolio: number;
  renterPortfolio: number;
  saleCosts: number;
  gainTax: number;
  buyerWealth: number;
  renterWealth: number;
  buyerReal: number;
  renterReal: number;
  ownerCost: number;
  rentCost: number;
  principalPaid: number;
  interestPaid: number;
}

export function compareRentBuy(input: RentBuyInputs, tieThreshold = 1) {
  const nonnegative: (keyof RentBuyInputs)[] = [
    "monthlyRent",
    "downPercent",
    "mortgageRate",
    "purchaseCostsPercent",
    "saleCostsPercent",
    "maintenancePercent",
    "ownerMonthlyCosts",
    "mortgageInsurancePercent",
    "rentDepositMonths",
    "rentSetupCosts",
    "saleGainTaxPercent",
  ];
  if (
    !Object.values(input).every(Number.isFinite) ||
    input.homePrice <= 0 ||
    nonnegative.some((key) => input[key] < 0) ||
    input.downPercent > 100 ||
    input.saleCostsPercent > 100 ||
    input.saleGainTaxPercent > 100 ||
    [
      input.homeGrowth,
      input.rentGrowth,
      input.investmentReturn,
      input.inflation,
    ].some((v) => v <= -100) ||
    ![input.horizonYears, input.mortgageYears].every(
      (n) => Number.isInteger(n) && n >= 1 && n <= 50,
    )
  )
    throw new RangeError(
      "Use finite amounts, valid percentages and whole-year horizons from 1 to 50.",
    );
  const down = (input.homePrice * input.downPercent) / 100;
  const loan = input.homePrice - down;
  const buyingFees = (input.homePrice * input.purchaseCostsPercent) / 100;
  const deposit = input.monthlyRent * input.rentDepositMonths;
  const buyerUpfront = down + buyingFees;
  const renterUpfront = deposit + input.rentSetupCosts;
  const startingCash = Math.max(buyerUpfront, renterUpfront);
  const payment = mortgagePayment(
    loan,
    input.mortgageRate,
    input.mortgageYears * 12,
  );
  const investmentFactor = (1 + input.investmentReturn / 100) ** (1 / 12);
  const homeFactor = (1 + input.homeGrowth / 100) ** (1 / 12);
  let homeValue = input.homePrice,
    loanBalance = loan;
  let buyerPortfolio = startingCash - buyerUpfront,
    renterPortfolio = startingCash - renterUpfront;
  let interestTotal = 0,
    principalTotal = 0,
    ownerCostTotal = 0,
    rentCostTotal = 0;
  let buyerDeposits = buyerPortfolio,
    renterDeposits = renterPortfolio;
  const records: HousingMonth[] = [];

  function record(
    month: number,
    ownerCost: number,
    rentCost: number,
    principalPaid: number,
    interestPaid: number,
  ) {
    const saleCosts = (homeValue * input.saleCostsPercent) / 100;
    const gainTax =
      (Math.max(0, homeValue - saleCosts - input.homePrice - buyingFees) *
        input.saleGainTaxPercent) /
      100;
    const buyerWealth =
      homeValue - saleCosts - gainTax - loanBalance + buyerPortfolio;
    const renterWealth = renterPortfolio + deposit;
    const deflator = (1 + input.inflation / 100) ** (month / 12);
    records.push({
      month,
      homeValue,
      loanBalance,
      buyerPortfolio,
      renterPortfolio,
      saleCosts,
      gainTax,
      buyerWealth,
      renterWealth,
      buyerReal: buyerWealth / deflator,
      renterReal: renterWealth / deflator,
      ownerCost,
      rentCost,
      principalPaid,
      interestPaid,
    });
  }
  record(0, 0, 0, 0, 0);
  for (let month = 1; month <= input.horizonYears * 12; month++) {
    const interest = (loanBalance * input.mortgageRate) / 1200;
    const repayment =
      loanBalance > 0 ? Math.min(payment, loanBalance + interest) : 0;
    const loanInsurance =
      loanBalance > 0 ? (loan * input.mortgageInsurancePercent) / 1200 : 0;
    const principal = Math.min(loanBalance, Math.max(0, repayment - interest));
    loanBalance = Math.max(0, loanBalance - principal);
    if (month >= input.mortgageYears * 12 || loanBalance < 1e-7)
      loanBalance = 0;
    const elapsedYears = Math.floor((month - 1) / 12);
    const maintenance = (homeValue * input.maintenancePercent) / 1200;
    const otherCosts =
      input.ownerMonthlyCosts * (1 + input.inflation / 100) ** elapsedYears;
    const ownerCost = repayment + loanInsurance + maintenance + otherCosts;
    const rentCost =
      input.monthlyRent * (1 + input.rentGrowth / 100) ** elapsedYears;
    const toBuyer = Math.max(0, rentCost - ownerCost);
    const toRenter = Math.max(0, ownerCost - rentCost);
    buyerPortfolio = buyerPortfolio * investmentFactor + toBuyer;
    renterPortfolio = renterPortfolio * investmentFactor + toRenter;
    buyerDeposits += toBuyer;
    renterDeposits += toRenter;
    homeValue *= homeFactor;
    principalTotal += principal;
    interestTotal += interest;
    ownerCostTotal += ownerCost;
    rentCostTotal += rentCost;
    record(month, ownerCost, rentCost, principal, interest);
  }
  const final = records.at(-1)!;
  const advantage = final.buyerReal - final.renterReal;
  const winner =
    Math.abs(advantage) < tieThreshold ? "tie" : advantage > 0 ? "buy" : "rent";
  // Report a lead that holds through the chosen horizon, not a transient crossing.
  let sustainedBreakEvenMonth: number | null = null;
  if (winner === "buy") {
    sustainedBreakEvenMonth = 0;
    for (const point of records)
      if (point.buyerWealth < point.renterWealth)
        sustainedBreakEvenMonth = point.month + 1;
  }
  return {
    records,
    annual: records.filter((point) => point.month % 12 === 0),
    final,
    winner,
    advantage,
    down,
    loan,
    payment,
    buyingFees,
    deposit,
    buyerUpfront,
    renterUpfront,
    startingCash,
    buyerDeposits,
    renterDeposits,
    interestTotal,
    principalTotal,
    ownerCostTotal,
    rentCostTotal,
    sustainedBreakEvenMonth,
  };
}
