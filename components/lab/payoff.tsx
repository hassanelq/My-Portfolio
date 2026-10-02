"use client";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { optionStrategy, type Leg, type OptionType } from "@/lib/math/options";
import { money } from "@/lib/utils";
import { LineChart } from "@/components/ui/chart";
import {
  Instrument,
  NumberField,
  SelectField,
  Metric,
  Segmented,
} from "./shared";
const presets: Record<string, Leg[]> = {
  call: [{ type: "call", side: 1, strike: 100 }],
  spread: [
    { type: "call", side: 1, strike: 95 },
    { type: "call", side: -1, strike: 110 },
  ],
  straddle: [
    { type: "call", side: 1, strike: 100 },
    { type: "put", side: 1, strike: 100 },
  ],
  condor: [
    { type: "put", side: 1, strike: 80 },
    { type: "put", side: -1, strike: 90 },
    { type: "call", side: -1, strike: 110 },
    { type: "call", side: 1, strike: 120 },
  ],
};
export default function Payoff() {
  const [legs, setLegs] = useState<Leg[]>(presets.call),
    [preset, setPreset] = useState("call");
  const result = optionStrategy(legs, {
    spot: 100,
    time: 0.5,
    vol: 0.2,
    rate: 0.04,
  });
  const lo = Math.max(0, Math.min(...legs.map((l) => l.strike)) - 35),
    hi = Math.max(...legs.map((l) => l.strike)) + 35;
  const xs = [
    ...new Set([
      ...Array.from({ length: 101 }, (_, i) => lo + ((hi - lo) * i) / 100),
      ...legs.map((l) => l.strike),
    ]),
  ].sort((a, b) => a - b);
  function update(i: number, patch: Partial<Leg>) {
    setPreset("custom");
    setLegs(
      legs.map((leg, index) => (index === i ? { ...leg, ...patch } : leg)),
    );
  }
  return (
    <Instrument
      id="payoff"
      number="06"
      title="Option payoff builder"
      subtitle="A STRATEGY, LEG BY LEG"
      footnote="European premiums from Black-Scholes: spot $100, 6 months, volatility 20%, rate 4%. One unit per leg. P&L includes premiums, excludes fees and financing. Max profit/loss considers all nonnegative expiry prices."
    >
      <Segmented
        label="Strategy preset"
        value={preset}
        options={[
          { value: "call", label: "Long call" },
          { value: "spread", label: "Bull call spread" },
          { value: "straddle", label: "Straddle" },
          { value: "condor", label: "Iron condor" },
          { value: "custom", label: "Custom" },
        ]}
        onChange={(v) => {
          setPreset(v);
          if (presets[v]) setLegs(presets[v].map((l) => ({ ...l })));
        }}
      />
      <div className="payoff-legs">
        {legs.map((leg, i) => (
          <div className="leg-row" key={i}>
            <span className="mono">0{i + 1}</span>
            <SelectField
              label={`LEG ${i + 1} TYPE`}
              value={leg.type}
              options={[
                { value: "call", label: "Call" },
                { value: "put", label: "Put" },
              ]}
              onChange={(v) => update(i, { type: v as OptionType })}
            />
            <SelectField
              label={`LEG ${i + 1} POSITION`}
              value={String(leg.side)}
              options={[
                { value: "1", label: "Long" },
                { value: "-1", label: "Short" },
              ]}
              onChange={(v) => update(i, { side: Number(v) as 1 | -1 })}
            />
            <NumberField
              label={`LEG ${i + 1} STRIKE ($)`}
              min={1}
              max={250}
              value={leg.strike}
              onChange={(strike) => update(i, { strike })}
            />
            <span className="mono leg-premium">
              {money(result.premiums[i], "USD", 2)}
            </span>
            <button
              className="icon-button"
              aria-label={`Remove leg ${i + 1}`}
              disabled={legs.length === 1}
              onClick={() => {
                setPreset("custom");
                setLegs(legs.filter((_, index) => index !== i));
              }}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
      <button
        className="button button-secondary button-small"
        disabled={legs.length >= 4}
        onClick={() => {
          setPreset("custom");
          setLegs([...legs, { type: "call", side: 1, strike: 100 }]);
        }}
      >
        <Plus size={15} /> Add leg{" "}
        <span className="muted">{legs.length}/4</span>
      </button>
      <LineChart
        label="Combined option strategy profit at expiry"
        series={[
          {
            label: "Strategy P&L",
            color: "#f3f3f3",
            points: xs.map((x) => ({ x, y: result.payoff(x) })),
          },
        ]}
        xLabel="underlying price at expiry ($)"
        yLabel="P&L ($)"
        references={[
          { x: 100, label: "spot", color: "#a2af89" },
          ...result.breakevens.map((x) => ({
            x,
            label: `b/e ${x.toFixed(1)}`,
            color: "#bca577",
          })),
        ]}
      />
      <div className="payoff-summary">
        <Metric
          label={`Net premium ${result.netPremium < 0 ? "received" : "paid"}`}
          value={money(Math.abs(result.netPremium), "USD", 2)}
        />
        <Metric
          label="Breakeven(s)"
          value={
            result.breakevens.length
              ? result.breakevens.map((v) => money(v, "USD", 2)).join(" / ")
              : "None"
          }
        />
        <Metric
          label="Max profit"
          value={
            Number.isFinite(result.maxProfit)
              ? money(result.maxProfit, "USD", 2)
              : "Unlimited"
          }
        />
        <Metric
          label="Max loss"
          value={
            Number.isFinite(result.minProfit)
              ? money(Math.max(0, -result.minProfit), "USD", 2)
              : "Unlimited"
          }
        />
      </div>
    </Instrument>
  );
}
