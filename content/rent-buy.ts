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
  ownerMonthlyCosts: 500,
  mortgageInsurancePercent: 0.3,
  rentDepositMonths: 1,
  rentSetupCosts: 0,
  saleGainTaxPercent: 0,
};

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
    title: "Growth & purchasing power",
    fields: [
      {
        key: "homeGrowth",
        label: "Home price growth (% / year)",
        min: -20,
        max: 20,
        step: 0.1,
        help: "1.5% is a dated national observation used as an example, not a forecast for this home.",
      },
      {
        key: "rentGrowth",
        label: "Rent growth (% / year)",
        min: -10,
        max: 20,
        step: 0.1,
        help: "Applied once each year. An editable scenario, not a legal rent-increase rule.",
      },
      {
        key: "investmentReturn",
        label: "Investment return (% / year)",
        min: -20,
        max: 25,
        step: 0.1,
        help: "Nominal return after your investment fees and taxes. The same rate applies to both paths.",
      },
      {
        key: "inflation",
        label: "Inflation (% / year)",
        min: -5,
        max: 20,
        step: 0.1,
        help: "Converts wealth to today’s DH and increases recurring household costs. 2% is illustrative.",
      },
    ],
  },
  {
    title: "Buying, owning & selling",
    fields: [
      {
        key: "purchaseCostsPercent",
        label: "Purchase costs (% of price)",
        min: 0,
        max: 25,
        step: 0.1,
        help: "Registration, notary, lender and buying fees. Paid upfront; excludes the down payment.",
      },
      {
        key: "saleCostsPercent",
        label: "Selling costs (% of value)",
        min: 0,
        max: 25,
        step: 0.1,
        help: "Selling fees and any payoff charges as a combined allowance; excludes the gain-tax field below.",
      },
      {
        key: "maintenancePercent",
        label: "Maintenance (% of value / year)",
        min: 0,
        max: 10,
        step: 0.1,
        help: "Monthly upkeep allowance based on the home’s current modeled value.",
      },
      {
        key: "ownerMonthlyCosts",
        label: "Other ownership costs (DH / month)",
        min: 0,
        max: 100000,
        step: 100,
        help: "Property taxes, home insurance, syndic and costs above the rental equivalent. Excludes loan insurance and maintenance.",
      },
      {
        key: "mortgageInsurancePercent",
        label: "Loan insurance (% / year)",
        min: 0,
        max: 5,
        step: 0.05,
        help: "Allowance on the original loan amount while it is outstanding; stops at payoff. Replace with your policy’s cost.",
      },
      {
        key: "saleGainTaxPercent",
        label: "Effective tax on sale gain (%)",
        min: 0,
        max: 50,
        step: 1,
        help: "Default 0 excludes this tax. Simplified allowance on positive gain after buying/selling costs; local exemptions and minimum levies are not calculated.",
      },
    ],
  },
  {
    title: "Moving into the rental",
    fields: [
      {
        key: "rentDepositMonths",
        label: "Refundable deposit (months of rent)",
        min: 0,
        max: 12,
        step: 1,
        help: "Cash held aside without interest and returned in full when you leave.",
      },
      {
        key: "rentSetupCosts",
        label: "Rental setup costs (DH)",
        min: 0,
        max: 100000,
        step: 500,
        help: "One-off agent or setup fees. Not refundable. Both paths are given enough starting cash for either choice.",
      },
    ],
  },
] as const;
