"use client";

import { createContext, useContext, useState } from "react";
import { formatMoney, type Currency } from "@/lib/format";

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
  if (!setting) throw new Error("ToolsSettingsProvider is missing");
  return {
    ...setting,
    money: (value: number) => formatMoney(value, setting.currency),
  };
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
