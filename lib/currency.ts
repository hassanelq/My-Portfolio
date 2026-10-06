import type { Currency } from "./format";

// Fixed comparison rate requested for the tools, not a live exchange-rate feed.
export const MAD_PER_USD = 10;
export const currencySymbol = (currency: Currency) =>
  currency === "USD" ? "$" : "DH";
export const fromDirhams = (value: number, currency: Currency) =>
  currency === "USD" ? value / MAD_PER_USD : value;
export const roundContribution = (value: number, currency: Currency) => {
  const unit = fromDirhams(1, currency);
  return Math.ceil(value / unit) * unit;
};

export function convertMoneyFields<T extends object>(
  values: T,
  keys: readonly (keyof T)[],
  from: Currency,
  to: Currency,
): T {
  if (from === to) return values;
  const convert = (value: number) =>
    to === "USD" ? value / MAD_PER_USD : value * MAD_PER_USD;
  const converted = { ...values };
  for (const key of keys) {
    const value = values[key];
    // Blank questionnaire fields stay blank; only monetary fields are converted.
    if (value === "") continue;
    if (typeof value === "number")
      converted[key] = convert(value) as T[keyof T];
    else if (typeof value === "string" && Number.isFinite(Number(value)))
      converted[key] = String(convert(Number(value))) as T[keyof T];
  }
  return converted;
}
