import { portfolioCosts } from "../lib/math/dca";

// Add tools here and their matching panels in ToolsWorkspace.
export const toolCatalog = [
  {
    id: "dca",
    title: "DCA simulator",
    description: "Explore monthly investing through real market history.",
    status: "available",
  },
  {
    id: "retirement",
    title: "Retirement planner",
    description: "Explore how saving today could support life after work.",
    status: "available",
  },
  {
    id: "emergency",
    title: "Emergency fund",
    description:
      "Find a cash cushion for your income, household and essential costs.",
    status: "available",
  },
  {
    id: "rent-buy",
    title: "Rent or buy?",
    description:
      "Compare owning a home with renting it and investing the difference.",
    status: "available",
  },
  {
    id: "fees",
    title: "Investment fees",
    description:
      "Compare investment charges and the growth they cost over time.",
    status: "available",
  },
] as const;

// Monthly source observations are in dca-history.json; no editable growth assumptions.
export const dcaDefaults = {
  starting: 0,
  monthly: 1500,
  age: 23,
  targetAge: 50,
};
export const dcaAssets = [
  {
    id: "sp500",
    label: "S&P 500",
    color: "#8bb6f1",
    dash: "",
    basis: "Dividends reinvested",
    details:
      "US large-company equities. Dividends reinvested; history from January 1960. No personal taxes or trading fees on this benchmark.",
  },
  {
    id: "gold",
    label: "Gold",
    color: "#d6b56e",
    dash: "8 5",
    basis: "Gold price in USD",
    details:
      "Gold price in USD, from January 1968. No dividends; storage costs and personal taxes are excluded.",
  },
  {
    id: "world",
    label: "MSCI World",
    color: "#94c7b7",
    dash: "2 5",
    basis: "Price only · excludes dividends",
    details:
      "Developed-market equities in USD, from January 1985. Price only: dividends are excluded, unlike the S&P 500 total-return line.",
  },
  {
    id: "bonds",
    label: "US bonds",
    color: "#bf9bd9",
    dash: "12 4 2 4",
    basis: "VBMFX · distributions reinvested · fund expenses embedded",
    details:
      "Vanguard Total Bond Market (VBMFX), from December 1986. Distributions reinvested; fund expenses already embedded. Bonds can lose value.",
  },
  {
    id: "portfolio",
    label: "Diversified portfolio",
    color: "#ed9b83",
    dash: "5 3",
    basis: "60/30/10 · net of modeled trading costs and rebalancing gains tax",
    details: `60% S&P 500 · 30% US bonds · 10% gold. Restored to these weights every month. Bond distributions are reinvested; fund expenses are embedded. Includes ${(portfolioCosts.tradingFee * 100).toFixed(2)}% on traded amounts and ${(portfolioCosts.realizedGainTax * 100).toFixed(0)}% tax on modeled positive gains realized by rebalancing. Illustrative assumptions.`,
  },
] as const;
export const dcaCash = {
  id: "cash",
  label: "Leaving it in the bank",
  color: "var(--color-smoke)",
  dash: "10 4 2 4",
  basis: "No interest",
} as const;
export const dcaSources = [
  {
    title: "Investor.gov · rebalancing, fees and tax consequences",
    url: "https://www.investor.gov/additional-resources/general-resources/publications-research/info-sheets/beginners-guide-asset",
    description:
      "SEC investor guidance notes that selling to rebalance can trigger transaction costs and tax consequences, and that new contributions can help restore weights. Our 0.10% trade fee and 20% modeled realized-gains tax are illustrative inputs, not statutory rates or broker quotes.",
  },
  {
    title: "US bonds · Vanguard Total Bond Market (VBMFX)",
    url: "https://finance.yahoo.com/quote/VBMFX/history/",
    description:
      "Monthly adjusted closes from December 1986. Yahoo’s adjusted-close series accounts for dividends and capital-gain distributions. This is a fund proxy for US bonds, not a pure index: fund expenses are already embedded. Retrieved 4 October 2026.",
  },
  {
    title: "Vanguard · fund description",
    url: "https://investor.vanguard.com/investment-products/mutual-funds/profile/vbmfx",
    description:
      "Vanguard Total Bond Market Index Fund Investor Shares. Used here to add a broad US bond comparison alongside equity indices and gold.",
  },
  {
    title: "US consumer prices · BLS CPI-U",
    url: "https://www.bls.gov/cpi/",
    description:
      "US CPI from Shiller’s monthly dataset through June 2023, then BLS CPI-U (CUUR0000SA0, not seasonally adjusted), chained at the overlap. DCA aligns both countries to January 1960–June 2025; no fixed inflation rate or missing-month interpolation.",
  },
  {
    title: "S&P 500 · dividends reinvested",
    url: "https://datahub.io/core/s-and-p-500",
    description:
      "Monthly Shiller prices and annualized dividends, starting January 1960. Dividends are reinvested monthly. After June 2023, returns are chained from Yahoo Finance’s S&P 500 Total Return Index (^SP500TR). This joins monthly average prices to month-end index returns.",
  },
  {
    title: "S&P 500 Total Return Index",
    url: "https://finance.yahoo.com/quote/%5ESP500TR/history/",
    description:
      "Observed monthly total-return index changes used from July 2023; no dividend yield is assumed for the extension.",
  },
  {
    title: "MSCI World · price only",
    url: "https://finance.yahoo.com/quote/%5E990100-USD-STRD/history/",
    description:
      "The USD MSCI World price index (^990100-USD-STRD), with monthly closes from January 1985. It is the index itself, not an ETF. Dividends are excluded, so this understates a holding that reinvests them and is not directly comparable to the S&P 500 total-return series.",
  },
  {
    title: "Gold · USD per troy ounce",
    url: "https://datahub.io/core/gold-prices",
    description:
      "World Bank monthly gold prices, distributed by DataHub. The calculator starts in January 1968 and uses recorded price changes. Gold pays no dividends.",
  },
  {
    title: "Moroccan consumer prices",
    url: "https://db.nomics.world/IMF/IFS/M.MA.PCPI_IX",
    description:
      "IMF International Financial Statistics, monthly Moroccan CPI (M.MA.PCPI_IX), via DBnomics. The available monthly observations cover the entire period used here, so annual interpolation and a fixed 4% inflation assumption are unnecessary.",
  },
];
