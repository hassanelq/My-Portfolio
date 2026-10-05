"use client";
import type { HistoricalResult } from "@/lib/math/dca";
import { AgeChart, type AgeSeries } from "@/components/ui/age-chart";
import type { Currency } from "@/lib/format";
export type SavingsSeries = HistoricalResult & AgeSeries;

export function DCAChart(props: {
  currency: Currency;
  series: SavingsSeries[];
  age: number;
  targetAge: number;
}) {
  return <AgeChart {...props} chartHeight={{ desktop: 560, mobile: 430 }} />;
}
