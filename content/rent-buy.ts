import { currencySymbol, fromDirhams } from "../lib/currency";
import { formatMoney, type Currency } from "../lib/format";

// Percentages are annual unless stated otherwise. Rates are editable scenarios.
export const rentBuyDefaults = {
  homePrice: 1000000,
  monthlyRent: 5000,
  downPercent: 20,
  mortgageRate: 5.18,
  mortgageYears: 20,
  horizonYears: 10,
  homeGrowth: 1.5,
  rentGrowth: 2,
  investmentReturn: 5,
  inflation: 2,
  purchaseCostsPercent: 7,
  saleCostsPercent: 3,
  maintenancePercent: 1,
  ownerMonthlyCosts: 300,
  mortgageInsurancePercent: 0.3,
  rentDepositMonths: 1,
  rentSetupCosts: 0,
  saleGainTaxPercent: 0,
};

export function rentBuyParameterHelp(
  key: string,
  help: string,
  currency: Currency,
) {
  if (key === "maintenancePercent")
    return `A yearly budget for repairs, spread across the months. At 1%, a ${formatMoney(fromDirhams(1000000, currency), currency)} home costs about ${formatMoney(fromDirhams(10000, currency), currency)} a year to maintain.`;
  return help.replace(/DH/g, currencySymbol(currency));
}

export const rentBuySources = [
  {
    title: "Zillow Research · rent vs. buy methodology",
    url: "https://www.zillow.com/research/rent-vs-buy-methodology/",
    description:
      "June 2026. Reference for comparing equal-budget households, investing unused cash and measuring wealth after a hypothetical sale. Our implementation uses its own inputs and inflation adjustment, not Zillow’s US market defaults.",
  },
  {
    title: "CFPB · deciding whether to rent or buy",
    url: "https://www.consumerfinance.gov/archive/blog/making-decision-rent-or-buy/",
    description:
      "Explains equity, transaction costs and recurring ownership expenses beyond the mortgage. Its US tax rules are not applied here.",
  },
  {
    title: "Bank Al-Maghrib · lending rates, Q1 2025",
    url: "https://www.bkam.ma/content/download/824404/9005178/Taux%20d%C3%A9biteurs%20T1-2025.pdf",
    description:
      "The report dated 9 May 2025 records a 5.18% average real-estate lending rate. This dated, broad market reference seeds the example; it is not a current offer, an APR or a borrower-specific housing quote.",
  },
  {
    title: "BAM / ANCFCC · residential prices, Q3 2025",
    url: "https://www.ancfcc.gov.ma/media/ipai/ipai-t3-2025-fr.pdf",
    description:
      "Residential prices increased 1.5% year-on-year in this bulletin. The example starts at 1.5%; extending that pace is a scenario assumption, not a forecast or a replay of an individual property’s history.",
  },
  {
    title: "ANCFCC · land-registration tariffs",
    url: "https://www.ancfcc.gov.ma/media/8632/formalitefr.pdf",
    description:
      "Primary reference for land-registration cost categories. The 7% purchase allowance in the example is editable and is not an official all-in tariff. Use a notary and lender’s itemized quote for your transaction.",
  },
];

export const rentBuyAssumptions = [
  {
    title: "Prices over time",
    fields: [
      {
        key: "homeGrowth",
        label: "Home value change (% / year)",
        min: -20,
        max: 20,
        step: 0.1,
        help: "How much the home’s price rises or falls each year. Use a minus sign for a fall. 1.5% is an example based on an older national figure.",
      },
      {
        key: "rentGrowth",
        label: "Rent increase (% / year)",
        min: -10,
        max: 20,
        step: 0.1,
        help: "How much the rent changes each year. Applied on each anniversary; check what your rental agreement allows.",
      },
      {
        key: "investmentReturn",
        label: "Investment growth (% / year)",
        min: -20,
        max: 25,
        step: 0.1,
        help: "How much invested savings grow each year, after investment fees and taxes but before inflation. Both choices use this rate.",
      },
      {
        key: "inflation",
        label: "Rise in everyday prices (% / year)",
        min: -5,
        max: 20,
        step: 0.1,
        help: "Inflation means everyday prices rise. This shows what your future money could buy at today’s prices. 2% is an example.",
      },
    ],
  },
  {
    title: "Costs of buying and owning",
    fields: [
      {
        key: "purchaseCostsPercent",
        label: "Buying fees (% of home price)",
        min: 0,
        max: 25,
        step: 0.1,
        help: "Fees paid when you buy: registration, notary and bank fees. Separate from the part of the home price you pay yourself.",
      },
      {
        key: "saleCostsPercent",
        label: "Selling fees (% of sale price)",
        min: 0,
        max: 25,
        step: 0.1,
        help: "Agent fees and other costs when you sell, including any fee to repay the loan early. Enter sale-profit tax separately below.",
      },
      {
        key: "maintenancePercent",
        label: "Repairs and upkeep (% of home value / year)",
        min: 0,
        max: 10,
        step: 0.1,
        help: "A yearly budget for repairs, spread across the months. At 1%, a 1,000,000 DH home costs about 10,000 DH a year to maintain.",
      },
      {
        key: "ownerMonthlyCosts",
        label: "Other home bills (DH / month)",
        min: 0,
        max: 100000,
        step: 100,
        help: "Extra bills you pay as the owner: home insurance, property taxes or building fees. Do not include repairs, loan insurance or bills already included in rent.",
      },
      {
        key: "mortgageInsurancePercent",
        label: "Loan insurance (% of original loan / year)",
        min: 0,
        max: 5,
        step: 0.05,
        help: "Yearly insurance cost as a share of the amount first borrowed. Spread across the months and stops when the loan is paid off.",
      },
      {
        key: "saleGainTaxPercent",
        label: "Tax on profit when selling (%)",
        min: 0,
        max: 50,
        step: 1,
        help: "0 means no sale-profit tax is included. Otherwise, this percentage is taken from a positive profit after buying and selling fees. This is an estimate, not a local tax calculation.",
      },
    ],
  },
  {
    title: "Moving into the rental",
    fields: [
      {
        key: "rentDepositMonths",
        label: "Rental deposit (months of rent)",
        min: 0,
        max: 12,
        step: 1,
        help: "Money the landlord holds and returns when you leave. This example assumes you get all of it back, with no interest.",
      },
      {
        key: "rentSetupCosts",
        label: "One-time rental fees (DH)",
        min: 0,
        max: 100000,
        step: 500,
        help: "Agent or other moving-in fees you do not get back. Both choices start with enough money to cover their initial costs.",
      },
    ],
  },
] as const;
