export interface FeeInputs {
  starting: number;
  monthly: number;
  years: number;
  growth: number;
  dividendYield?: number;
  exit?: "hold" | "sell" | "transfer";
}
export interface CustodyBand {
  upperMAD: number | null;
  annualRate: number;
  minimumAnnual: number;
}
export interface FeeSchedule {
  fundAnnual: number;
  accountAnnual: number;
  accountFixedAnnual: number;
  tradePercent: number;
  tradeMinimum: number;
  fxPercent: number;
  otherTradePercent?: number; // Compatibility with earlier illustrative schedules.
  accountMinimumAnnual?: number;
  settlementPercent?: number;
  settlementMinimum?: number;
  marketPercent?: number;
  collectionPercent?: number;
  buyFixed?: number;
  entryPercent?: number;
  exitPercent?: number;
  dividendPercent?: number;
  dividendMinimum?: number;
  transferPercent?: number;
  transferMinimum?: number;
  vatPercent?: number;
  custodyMonths?: number;
  custodyBands?: readonly CustodyBand[];
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
  dividendFee: number;
  vatFee: number;
  paid: number;
}
const numbers = [
  "fundAnnual",
  "accountAnnual",
  "accountFixedAnnual",
  "tradePercent",
  "tradeMinimum",
  "fxPercent",
  "otherTradePercent",
  "accountMinimumAnnual",
  "settlementPercent",
  "settlementMinimum",
  "marketPercent",
  "collectionPercent",
  "buyFixed",
  "entryPercent",
  "exitPercent",
  "dividendPercent",
  "dividendMinimum",
  "transferPercent",
  "transferMinimum",
  "vatPercent",
] as const;
export type FeeKey = (typeof numbers)[number];
export const zeroFees: FeeSchedule = {
  fundAnnual: 0,
  accountAnnual: 0,
  accountFixedAnnual: 0,
  tradePercent: 0,
  tradeMinimum: 0,
  fxPercent: 0,
};

/** Equal external budgets. moneyScale converts MAD band thresholds, never return rates. */
export function compareFees(
  inputs: FeeInputs,
  schedules: readonly FeeSchedule[],
  moneyScale = 1,
) {
  if (
    ![
      inputs.starting,
      inputs.monthly,
      inputs.years,
      inputs.growth,
      inputs.dividendYield ?? 0,
      moneyScale,
    ].every(Number.isFinite) ||
    inputs.starting < 0 ||
    inputs.monthly < 0 ||
    !Number.isInteger(inputs.years) ||
    inputs.years < 1 ||
    inputs.years > 50 ||
    inputs.growth <= -100 ||
    inputs.growth > 100 ||
    (inputs.dividendYield ?? 0) < 0 ||
    (inputs.dividendYield ?? 0) > 25 ||
    moneyScale <= 0 ||
    ![undefined, "hold", "sell", "transfer"].includes(inputs.exit) ||
    schedules.length < 2 ||
    schedules.length > 3 ||
    schedules.some(
      (s) =>
        numbers.some(
          (key) => !Number.isFinite(s[key] ?? 0) || (s[key] ?? 0) < 0,
        ) ||
        s.fundAnnual > 10 ||
        s.accountAnnual > 10 ||
        [
          s.tradePercent,
          s.fxPercent,
          s.otherTradePercent ?? 0,
          s.settlementPercent ?? 0,
          s.marketPercent ?? 0,
          s.collectionPercent ?? 0,
          s.entryPercent ?? 0,
          s.exitPercent ?? 0,
          s.dividendPercent ?? 0,
          s.transferPercent ?? 0,
        ].some((n) => n > 25) ||
        (s.vatPercent ?? 0) > 30 ||
        ![1, 3, 12].includes(s.custodyMonths ?? 1) ||
        (s.custodyBands &&
          (s.custodyBands.length === 0 ||
            s.custodyBands.some(
              (b, i, bs) =>
                !Number.isFinite(b.annualRate) ||
                b.annualRate < 0 ||
                b.annualRate > 10 ||
                !Number.isFinite(b.minimumAnnual) ||
                b.minimumAnnual < 0 ||
                (b.upperMAD === null
                  ? i !== bs.length - 1
                  : !Number.isFinite(b.upperMAD) ||
                    b.upperMAD <= 0 ||
                    (i > 0 && b.upperMAD <= (bs[i - 1].upperMAD ?? Infinity))),
            ))),
    )
  )
    throw new RangeError(
      "Use valid fees, two or three options, and a whole-year horizon from 1 to 50.",
    );
  const months = inputs.years * 12,
    g = (1 + inputs.growth / 100) ** (1 / 12),
    yieldMonthly = (inputs.dividendYield ?? 0) / 1200;
  const paths = schedules.map((fees) => {
    let invested = 0,
      cash = inputs.starting,
      baseline = inputs.starting;
    let fundPaid = 0,
      accountPaid = 0,
      tradingPaid = 0,
      fxPaid = 0,
      dividendPaid = 0,
      vatPaid = 0,
      exitPaid = 0,
      unpaidAccountFees = 0,
      delayedPurchases = 0;
    const records: FeeMonth[] = [];
    const v = (key: FeeKey) => fees[key] ?? 0;
    const tax = v("vatPercent") / 100;
    const purchaseFees = (order: number) => ({
      tradingFee:
        Math.max(v("tradeMinimum"), (v("tradePercent") * order) / 100) +
        Math.max(
          v("settlementMinimum"),
          (v("settlementPercent") * order) / 100,
        ) +
        ((v("marketPercent") +
          v("collectionPercent") +
          v("entryPercent") +
          v("otherTradePercent")) *
          order) /
          100 +
        v("buyFixed"),
      fxFee: (v("fxPercent") * order) / 100,
    });
    function buy() {
      const empty = { tradingFee: 0, fxFee: 0, vatFee: 0 };
      if (cash <= 0) return empty;
      const minimum = purchaseFees(0);
      if (cash <= (minimum.tradingFee + minimum.fxFee) * (1 + tax)) {
        delayedPurchases++;
        return empty;
      }
      // Monotone budget equation supports multiple independent minimum commissions.
      let lo = 0,
        hi = cash;
      for (let i = 0; i < 55; i++) {
        const mid = (lo + hi) / 2,
          f = purchaseFees(mid);
        if (mid + (f.tradingFee + f.fxFee) * (1 + tax) > cash) hi = mid;
        else lo = mid;
      }
      const order = (lo + hi) / 2,
        f = purchaseFees(order),
        vatFee = (f.tradingFee + f.fxFee) * tax;
      invested += order;
      cash = Math.max(0, cash - order - f.tradingFee - f.fxFee - vatFee);
      tradingPaid += f.tradingFee;
      fxPaid += f.fxFee;
      vatPaid += vatFee;
      return { ...f, vatFee };
    }
    function pay(base: number) {
      const due = base * (1 + tax),
        actual = Math.min(invested + cash, due),
        fromCash = Math.min(cash, actual);
      cash -= fromCash;
      invested = Math.max(0, invested - (actual - fromCash));
      const paid = actual / (1 + tax),
        vat = actual - paid;
      vatPaid += vat;
      return { paid, vat, unpaid: due - actual };
    }
    function record(
      month: number,
      fundFee: number,
      accountFee: number,
      dividendFee: number,
      holdingVAT: number,
      purchase: ReturnType<typeof buy>,
    ) {
      records.push({
        month,
        invested,
        cash,
        balance: invested + cash,
        baseline,
        fundFee,
        accountFee,
        dividendFee,
        tradingFee: purchase.tradingFee,
        fxFee: purchase.fxFee,
        vatFee: holdingVAT + purchase.vatFee,
        paid:
          fundPaid +
          accountPaid +
          tradingPaid +
          fxPaid +
          dividendPaid +
          vatPaid,
      });
    }
    record(0, 0, 0, 0, 0, buy());
    for (let month = 1; month <= months; month++) {
      const grown = invested * g,
        dividend = grown * yieldMonthly;
      invested = grown + dividend;
      const fund = pay((grown * v("fundAnnual")) / 1200);
      fundPaid += fund.paid;
      const divFee =
        dividend > 0
          ? pay(
              Math.max(
                v("dividendMinimum"),
                (dividend * v("dividendPercent")) / 100,
              ),
            )
          : { paid: 0, vat: 0, unpaid: 0 };
      dividendPaid += divFee.paid;
      cash += inputs.monthly;
      const period = fees.custodyMonths ?? 1;
      let custody = 0;
      if (month % period === 0) {
        const band = fees.custodyBands?.find(
          (b) => b.upperMAD === null || grown < b.upperMAD * moneyScale,
        );
        custody = Math.max(
          (((grown * (band?.annualRate ?? v("accountAnnual"))) / 100) *
            period) /
            12,
          ((band?.minimumAnnual !== undefined
            ? band.minimumAnnual * moneyScale
            : v("accountMinimumAnnual")) *
            period) /
            12,
        );
      }
      const account = pay(custody + v("accountFixedAnnual") / 12);
      accountPaid += account.paid;
      unpaidAccountFees += fund.unpaid + divFee.unpaid + account.unpaid;
      baseline = baseline * g * (1 + yieldMonthly) + inputs.monthly;
      record(
        month,
        fund.paid,
        account.paid,
        divFee.paid,
        fund.vat + divFee.vat + account.vat,
        buy(),
      );
    }
    const heldBalance = invested + cash;
    if (inputs.exit === "sell") {
      // Sale excludes entry charges, FX and fixed purchase charges.
      const sell =
        Math.max(v("tradeMinimum"), (v("tradePercent") * invested) / 100) +
        Math.max(
          v("settlementMinimum"),
          (v("settlementPercent") * invested) / 100,
        ) +
        ((v("marketPercent") +
          v("collectionPercent") +
          v("exitPercent") +
          v("otherTradePercent")) *
          invested) /
          100;
      const charged = pay(invested > 0 ? sell : 0);
      exitPaid = charged.paid;
      unpaidAccountFees += charged.unpaid;
      cash += invested;
      invested = 0;
    } else if (inputs.exit === "transfer") {
      const charged = pay(
        invested > 0
          ? Math.max(
              v("transferMinimum"),
              (invested * v("transferPercent")) / 100,
            )
          : 0,
      );
      exitPaid = charged.paid;
      unpaidAccountFees += charged.unpaid;
    }
    const final = {
      ...records.at(-1)!,
      invested,
      cash,
      balance: invested + cash,
      paid:
        fundPaid +
        accountPaid +
        tradingPaid +
        fxPaid +
        dividendPaid +
        vatPaid +
        exitPaid,
    };
    const annual = records
      .filter((p) => p.month % 12 === 0)
      .map((p) => (p.month === months ? final : p));
    const gap = final.baseline - final.balance;
    return {
      records,
      annual,
      final,
      heldBalance,
      fundPaid,
      accountPaid,
      tradingPaid,
      fxPaid,
      dividendPaid,
      vatPaid,
      exitPaid,
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
