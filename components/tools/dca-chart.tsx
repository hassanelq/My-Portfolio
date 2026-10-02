"use client";
import type { HistoricalResult } from "@/lib/math/dca";
import { AgeChart, type AgeSeries } from "@/components/ui/age-chart";
export { dirhams } from "@/lib/format";
export type SavingsSeries = HistoricalResult & AgeSeries;

export function DCAChart(props: {
  series: SavingsSeries[];
  age: number;
  targetAge: number;
}) {
  return <AgeChart {...props} />;
}
