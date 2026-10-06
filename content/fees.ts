import type { FeeInputs, FeeSchedule } from "../lib/math/fees";

export const feeDefaults: FeeInputs = {
  starting: 10000,
  monthly: 1500,
  years: 25,
  growth: 6,
};
// Illustrative, editable schedules. These are not quotes or country averages.
export const feeSchedules: readonly FeeSchedule[] = [
  {
    fundAnnual: 0.2,
    accountAnnual: 0,
    accountFixedAnnual: 0,
    tradePercent: 0,
    tradeMinimum: 0,
    fxPercent: 0,
  },
  {
    fundAnnual: 1.5,
    accountAnnual: 0.25,
    accountFixedAnnual: 0,
    tradePercent: 0.5,
    tradeMinimum: 10,
    fxPercent: 0,
  },
];
export const feeFields = [
  {
    key: "fundAnnual",
    label: "Fund fee / year (%)",
    max: 10,
    step: 0.01,
    monetary: false,
    help: "The yearly cost inside the fund, often called ongoing charges or the expense ratio. It reduces the fund’s value. Enter the total fund fee once; do not add its management fee again if already included.",
  },
  {
    key: "accountAnnual",
    label: "Account fee / year (%)",
    max: 10,
    step: 0.01,
    monetary: false,
    help: "A yearly percentage charged by your broker, bank, adviser or investment account. Use 0 if there is none. This is separate from the fee inside the fund.",
  },
  {
    key: "accountFixedAnnual",
    label: "Fixed account fee / year (DH)",
    max: 100000,
    step: 100,
    monetary: true,
    help: "A flat account charge each year. A monthly charge of 10 means 120 per year. The model spreads it across 12 months and pays it from your cash first, then investments.",
  },
  {
    key: "tradePercent",
    label: "Fee per buy (%)",
    max: 25,
    step: 0.01,
    monetary: false,
    help: "The percentage charged on each purchase, including any entry fee you want to model. The minimum fee below is a floor, not an extra charge. Both are paid from the money you put in.",
  },
  {
    key: "tradeMinimum",
    label: "Minimum fee per buy (DH)",
    max: 100000,
    step: 10,
    monetary: true,
    help: "The smallest trading charge for one purchase. For a flat charge, enter it here and set Fee per buy to 0. If your cash cannot cover this charge, it waits without interest until a later month.",
  },
  {
    key: "fxPercent",
    label: "Currency exchange fee / buy (%)",
    max: 25,
    step: 0.01,
    monetary: false,
    help: "A currency-conversion charge on each purchase, as a percentage of the amount invested. Use 0 if you invest in the account’s currency. This models the charge, not changes in exchange rates.",
  },
] as const;

export const feeSources = [
  {
    country: "Morocco",
    title: "AMMC · OPCVM investor guide",
    url: "https://www.ammc.ma/fr/espace-epargnants/guide-pratique-opcvm",
    description:
      "Look for frais de gestion, commissions de souscription and commissions de rachat in the fund’s note d’information, plus your bank’s account and transaction schedule. Use the actual fees charged, including any applicable tax on those fees. This calculator does not establish access to foreign investments.",
  },
  {
    country: "France",
    title: "AMF · Understanding investment fees",
    url: "https://www.amf-france.org/fr/espace-epargnants/les-frais-des-placements-financiers",
    description:
      "Read the fund’s document d’informations clés (DIC) and the broker or account fee schedule. Separate the fund’s ongoing costs from brokerage and account charges. This comparison does not model PEA or assurance-vie tax treatment.",
  },
  {
    country: "United States",
    title: "SEC Investor.gov · Mutual fund and ETF fees",
    url: "https://www.investor.gov/introduction-investing/investing-basics/glossary/mutual-fund-fees-and-expenses",
    description:
      "Read the prospectus fee table for the expense ratio and the broker’s pricing for account, advisory and trading charges. The fund’s management fee is usually part of its total operating expenses; do not count it twice.",
  },
];
