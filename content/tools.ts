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
    color: "#f3f3f3",
    basis: "Dividends reinvested",
  },
  { id: "gold", label: "Gold", color: "#edb939", basis: "Gold price in USD" },
  {
    id: "world",
    label: "MSCI World",
    color: "#28bd72",
    basis: "Price only · excludes dividends",
  },
] as const;
export const dcaCash = {
  id: "cash",
  label: "Leaving it in the bank",
  color: "#808b9b",
  basis: "No interest",
} as const;
export const dcaSources = [
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
