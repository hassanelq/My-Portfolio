export type Currency = "DH" | "USD";
export const formatMoney = (value: number, currency: Currency) =>
  `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: currency === "USD" ? 2 : 0 }).format(value).replace(/\u202f/g, "\u00a0")} ${currency === "USD" ? "$" : "DH"}`;

export const dirhams = (value: number) =>
  `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(value).replace(/\u202f/g, "\u00a0")} DH`;

export const monthLabel = (month: string) =>
  new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${month}-01T00:00:00Z`));
