"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type SetStateAction,
} from "react";
import { formatMoney, type Currency } from "@/lib/format";
import {
  convertMoneyFields,
  currencySymbol,
  fromDirhams,
} from "@/lib/currency";

export type InflationRegion = "morocco" | "us";
const CurrencyContext = createContext<{
  currency: Currency;
  revision: number;
  setCurrency: (currency: Currency) => void;
} | null>(null);

export function ToolsSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [setting, setSetting] = useState({
    currency: "DH" as Currency,
    revision: 0,
  });
  function setCurrency(currency: Currency) {
    setSetting((current) =>
      current.currency === currency
        ? current
        : { currency, revision: current.revision + 1 },
    );
  }
  return (
    <CurrencyContext.Provider value={{ ...setting, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useToolCurrency() {
  const setting = useContext(CurrencyContext);
  const currency = setting?.currency ?? "DH";
  const amount = useCallback(
    (dirhams: number) => fromDirhams(dirhams, currency),
    [currency],
  );
  if (!setting) throw new Error("ToolsSettingsProvider is missing");
  return {
    ...setting,
    symbol: currencySymbol(setting.currency),
    amount,
    money: (value: number) => formatMoney(value, setting.currency),
  };
}

/** Keep money in MAD internally so switches never discard an amount or an edit. */
export function useCurrencyInputs<T extends object>(
  defaults: T,
  moneyKeys: readonly (keyof T)[],
) {
  const { currency } = useToolCurrency();
  const [base, setBase] = useState(defaults);
  const inputs = useMemo(
    () => convertMoneyFields(base, moneyKeys, "DH", currency),
    [base, moneyKeys, currency],
  );
  const setInputs = useCallback(
    (action: SetStateAction<T>) => {
      setBase((current) => {
        const displayed = convertMoneyFields(
          current,
          moneyKeys,
          "DH",
          currency,
        );
        const next = typeof action === "function" ? action(displayed) : action;
        const converted = convertMoneyFields(next, moneyKeys, currency, "DH");
        // Editing an age or a rate should not round-trip untouched money fields.
        if (currency === "USD")
          for (const key of moneyKeys)
            if (next[key] === displayed[key]) converted[key] = current[key];
        return converted;
      });
    },
    [moneyKeys, currency],
  );
  return [inputs, setInputs] as const;
}

// A new currency selection restores its default CPI; overrides belong to each tool.
export function useInflationReference() {
  const { currency, revision } = useToolCurrency();
  const [override, setOverride] = useState<{
    revision: number;
    region: InflationRegion;
  } | null>(null);
  const region =
    override?.revision === revision
      ? override.region
      : currency === "USD"
        ? "us"
        : "morocco";
  const setRegion = (next: InflationRegion) =>
    setOverride({ revision, region: next });
  return [region, setRegion] as const;
}
