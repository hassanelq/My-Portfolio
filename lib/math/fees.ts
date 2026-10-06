export interface FeeInputs {
  starting: number;
  monthly: number;
  years: number;
  growth: number;
}

export interface FeeSchedule {
  fundAnnual: number;
  accountAnnual: number;
  accountFixedAnnual: number;
  tradePercent: number;
  tradeMinimum: number;
  fxPercent: number;
}

export interface FeeMonth {
  month: number;
  invested: number;
  cash: number;
  balance: number;
  baseline: number;
  fundFee: number;
  accountFee: number;
  tradingFee: number;
  fxFee: number;
  paid: number;
}

/** Same monthly budget and gross return; all charges come out of that budget. */
export function compareFees(
  inputs: FeeInputs,
  schedules: readonly FeeSchedule[],
) {
  if (
    !Object.values(inputs).every(Number.isFinite) ||
    inputs.starting < 0 ||
    inputs.monthly < 0 ||
    !Number.isInteger(inputs.years) ||
    inputs.years < 1 ||
    inputs.years > 50 ||
    inputs.growth <= -100 ||
    inputs.growth > 100 ||
    schedules.length !== 2 ||
    schedules.some(
      (schedule) =>
        !Object.values(schedule).every((n) => Number.isFinite(n) && n >= 0) ||
        schedule.fundAnnual > 10 ||
        schedule.accountAnnual > 10 ||
        schedule.tradePercent > 25 ||
        schedule.fxPercent > 25,
    )
  )
    throw new RangeError(
      "Use finite, nonnegative amounts, valid fees and a whole-year horizon from 1 to 50.",
    );

  const months = inputs.years * 12;
  const growth = (1 + inputs.growth / 100) ** (1 / 12);
  const paths = schedules.map((fees) => {
    let invested = 0,
      cash = inputs.starting,
      baseline = inputs.starting;
    let fundPaid = 0,
      accountPaid = 0,
      tradingPaid = 0,
      fxPaid = 0;
    let unpaidAccountFees = 0,
      delayedPurchases = 0;
    const records: FeeMonth[] = [];

    function buy() {
      if (cash <= 0) return { tradingFee: 0, fxFee: 0 };
      // A minimum commission is a floor, not an extra fee on top of the percentage.
      if (cash <= fees.tradeMinimum) {
        delayedPurchases++;
        return { tradingFee: 0, fxFee: 0 };
      }
      const q = fees.tradePercent / 100,
        x = fees.fxPercent / 100;
      const proportionalOrder = cash / (1 + q + x);
      const order =
        q * proportionalOrder >= fees.tradeMinimum
          ? proportionalOrder
          : (cash - fees.tradeMinimum) / (1 + x);
      const tradingFee = Math.max(fees.tradeMinimum, q * order);
      const fxFee = order * x;
      invested += order;
      cash = 0;
      tradingPaid += tradingFee;
      fxPaid += fxFee;
      return { tradingFee, fxFee };
    }

    function record(
      month: number,
      fundFee: number,
      accountFee: number,
      purchase: { tradingFee: number; fxFee: number },
    ) {
      records.push({
        month,
        invested,
        cash,
        balance: invested + cash,
        baseline,
        fundFee,
        accountFee,
        ...purchase,
        paid: fundPaid + accountPaid + tradingPaid + fxPaid,
      });
    }
    record(0, 0, 0, buy());
    for (let month = 1; month <= months; month++) {
      const gross = invested * growth;
      const fundFee = (gross * fees.fundAnnual) / 1200;
      const percentageAccountFee = (gross * fees.accountAnnual) / 1200;
      invested = gross - fundFee - percentageAccountFee;
      cash += inputs.monthly;
      const fixedAccountFee = Math.min(
        invested + cash,
        fees.accountFixedAnnual / 12,
      );
      unpaidAccountFees += fees.accountFixedAnnual / 12 - fixedAccountFee;
      const fromCash = Math.min(cash, fixedAccountFee);
      cash -= fromCash;
      invested = Math.max(0, invested - (fixedAccountFee - fromCash));
      const accountFee = percentageAccountFee + fixedAccountFee;
      fundPaid += fundFee;
      accountPaid += accountFee;
      baseline = baseline * growth + inputs.monthly;
      record(month, fundFee, accountFee, buy());
    }
    const final = records.at(-1)!;
    const gap = final.baseline - final.balance;
    return {
      records,
      annual: records.filter((point) => point.month % 12 === 0),
      final,
      fundPaid,
      accountPaid,
      tradingPaid,
      fxPaid,
      paid: final.paid,
      gap,
      growthDifference: gap - final.paid,
      unpaidAccountFees,
      delayedPurchases,
    };
  });
  return {
    paths,
    contributed: inputs.starting + inputs.monthly * months,
    baseline: paths[0].final.baseline,
    difference: paths[0].final.balance - paths[1].final.balance,
  };
}
