"use client";
import { useMemo, useState } from "react";
import { binomial, blackScholes, type OptionType } from "@/lib/math/options";
import { money, number } from "@/lib/utils";
import { LineChart } from "@/components/ui/chart";
import { Instrument, RangeField, SelectField, Metric } from "./shared";
export default function Binomial() {
  const [steps, setSteps] = useState(10),
    [strike, setStrike] = useState(100),
    [vol, setVol] = useState(20),
    [type, setType] = useState<OptionType>("call"),
    [style, setStyle] = useState("european");
  const inputs = {
    spot: 100,
    strike,
    vol: vol / 100,
    rate: 0.04,
    time: 1,
    type,
  };
  const result = binomial(inputs, steps, style === "american"),
    benchmark = blackScholes(inputs).price;
  const convergence = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        x: i + 1,
        y: binomial(
          { spot: 100, strike, vol: vol / 100, rate: 0.04, time: 1, type },
          i + 1,
          style === "american",
        ).price,
      })),
    [strike, vol, type, style],
  );
  const shown = Math.min(steps, 5),
    X = (i: number) => 35 + i * 102,
    Y = (i: number, j: number) => 160 + (i - 2 * j) * 25;
  return (
    <Instrument
      id="binomial"
      number="07"
      title="Binomial tree pricer"
      subtitle="ONE STEP CLOSER"
      footnote="Cox–Ross–Rubinstein lattice. Spot $100, maturity 1 year, rate 4%, no dividends. The lattice shows the first 5 levels of the selected tree; node labels are option values. Black-Scholes is the European benchmark, so an American put may remain above it."
    >
      <div className="controls">
        <RangeField
          label="STEPS"
          min={2}
          max={60}
          value={steps}
          onChange={setSteps}
        />
        <RangeField
          label="STRIKE"
          min={60}
          max={140}
          value={strike}
          onChange={setStrike}
          suffix=" $"
        />
        <RangeField
          label="VOLATILITY"
          min={10}
          max={80}
          value={vol}
          onChange={setVol}
          suffix="%"
        />
        <SelectField
          label="OPTION TYPE"
          value={type}
          options={[
            { label: "Call", value: "call" },
            { label: "Put", value: "put" },
          ]}
          onChange={(v) => setType(v as OptionType)}
        />
        <SelectField
          label="EXERCISE"
          value={style}
          options={[
            { label: "European", value: "european" },
            { label: "American", value: "american" },
          ]}
          onChange={setStyle}
        />
      </div>
      <div className="instrument-grid equal">
        <div>
          <svg
            className="chart"
            viewBox="0 0 600 320"
            role="img"
            aria-label={`First ${shown} levels of a ${steps}-step binomial option tree`}
          >
            {Array.from({ length: shown + 1 }, (_, i) =>
              Array.from({ length: i + 1 }, (_, j) => (
                <g key={`${i}-${j}`}>
                  {i < shown && (
                    <>
                      <line
                        x1={X(i)}
                        y1={Y(i, j)}
                        x2={X(i + 1)}
                        y2={Y(i + 1, j)}
                        stroke="#393333"
                      />
                      <line
                        x1={X(i)}
                        y1={Y(i, j)}
                        x2={X(i + 1)}
                        y2={Y(i + 1, j + 1)}
                        stroke="#354038"
                      />
                    </>
                  )}
                  <circle
                    cx={X(i)}
                    cy={Y(i, j)}
                    r={i === 0 ? 4 : 2.5}
                    fill={
                      i === 0 ? "#f3f3f3" : j >= i / 2 ? "#a2af89" : "#b18787"
                    }
                  />
                  <text x={X(i)} y={Y(i, j) - 8} textAnchor="middle">
                    {number(result.levels[i][j], 1)}
                  </text>
                </g>
              )),
            )}
          </svg>
          <p className="chart-caption">
            Risk-neutral up probability: {number(result.probability * 100, 1)}%
            · {steps} steps
          </p>
        </div>
        <div>
          <LineChart
            label="Binomial convergence against European Black-Scholes value"
            series={[
              {
                label: "Binomial price",
                color: "#f3f3f3",
                points: convergence,
              },
            ]}
            references={[
              {
                y: benchmark,
                label: `BS ${money(benchmark, "USD", 2)}`,
                color: "#bca577",
              },
              { x: steps, label: `N = ${steps}` },
            ]}
            xLabel="number of steps"
            yLabel="option value ($)"
          />
          <div className="metric-grid">
            <Metric
              label="Binomial price"
              value={money(result.price, "USD", 4)}
            />
            <Metric label="Black-Scholes" value={money(benchmark, "USD", 4)} />
            <Metric
              label="Difference"
              value={number(result.price - benchmark, 4)}
            />
          </div>
        </div>
      </div>
    </Instrument>
  );
}
