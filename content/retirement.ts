import { dcaSources } from "./tools";

export const retirementDefaults = {
  livingCost: 8000,
  age: 25,
  retireAt: 45,
  untilAge: 75,
  starting: 0,
};
export const retirementContributions = [3000, 12000];
export const retirementReferences = [
  {
    title: "Bengen (1994) · historical withdrawal research",
    url: "https://www.financialplanningassociation.org/sites/default/files/2021-04/MAR04%20Determining%20Withdrawal%20Rates%20Using%20Historical%20Data.pdf",
    description:
      "Studies inflation-adjusted withdrawals and stock/bond allocations. Background for the historical approach, not the source of this calculator’s rate.",
  },
  {
    title: "Cooley, Hubbard & Walz (1998) · the Trinity Study",
    url: "https://www.aaii.com/files/pdf/6794_retirement-savings-choosing-a-withdrawal-rate-that-is-sustainable.pdf",
    description:
      "Measures the share of historical periods a withdrawal plan survived. The success percentage here is calculated from our own monthly dataset and all-equity portfolio.",
  },
  {
    title: "US consumer prices · BLS CPI-U",
    url: "https://www.bls.gov/cpi/data.htm",
    description:
      "All urban consumers, all items, US city average, not seasonally adjusted (CUUR0000SA0). Shiller’s CPI column is used through June 2023, followed by observed BLS monthly changes. The snapshot ends in June 2025; no later missing month is interpolated.",
  },
];

export const retirementSources = [
  {
    ...dcaSources[0],
    description:
      "Monthly Shiller prices and annualized dividends, starting January 1960 for the Moroccan reference and January 1928 for the US reference. Dividends are reinvested monthly. After June 2023, returns are chained from Yahoo Finance’s S&P 500 Total Return Index (^SP500TR). This joins monthly average prices to month-end index returns.",
  },
  ...dcaSources.filter(
    (source) =>
      source.title === "S&P 500 Total Return Index" ||
      source.title === "Moroccan consumer prices",
  ),
  ...retirementReferences,
];
