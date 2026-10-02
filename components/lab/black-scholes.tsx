"use client";
import { useState } from "react";
import { blackScholes, intrinsic, type OptionType } from "@/lib/math/options";
import { money, number } from "@/lib/utils";
import { LineChart } from "@/components/ui/chart";
import {
  Instrument,
  NumberField,
  SelectField,
  Metric,
  Formula,
} from "./shared";
export default function BlackScholes() {
  const [spot, setSpot] = useState(100),
    [strike, setStrike] = useState(105),
    [time, setTime] = useState(0.5),
    [vol, setVol] = useState(22),
    [rate, setRate] = useState(4.5),
    [type, setType] = useState<OptionType>("call");
  const result = blackScholes({
    spot,
    strike,
    time,
    vol: vol / 100,
    rate: rate / 100,
    type,
  });
  const low = Math.min(spot, strike) * 0.55,
    high = Math.max(spot, strike) * 1.45;
  const points = Array.from({ length: 101 }, (_, i) => {
    const x = low + ((high - low) * i) / 100;
    return { x, y: intrinsic(type, x, strike) - result.price };
  });
  return (
    <Instrument
      id="black-scholes"
      number="01"
      title="Black-Scholes engine"
      subtitle="EST. 1973, STILL USEFUL"
      footnote="European options without dividends. Vega and rho are per 1 percentage point; theta is per calendar day. At expiry or zero volatility, Greeks use limiting conventions."
    >
      <div className="controls">
        <NumberField
          label="SPOT ($)"
          value={spot}
          onChange={setSpot}
          min={1}
          max={10000}
        />
        <NumberField
          label="STRIKE ($)"
          value={strike}
          onChange={setStrike}
          min={1}
          max={10000}
        />
        <NumberField
          label="TIME (YEARS)"
          value={time}
          onChange={setTime}
          min={0}
          max={10}
          step={0.05}
        />
        <NumberField
          label="VOLATILITY (%)"
          value={vol}
          onChange={setVol}
          min={0}
          max={150}
          step={0.5}
        />
        <NumberField
          label="RATE (%)"
          value={rate}
          onChange={setRate}
          min={-10}
          max={30}
          step={0.25}
        />
        <SelectField
          label="OPTION TYPE"
          value={type}
          onChange={(v) => setType(v as OptionType)}
          options={[
            { value: "call", label: "Call" },
            { value: "put", label: "Put" },
          ]}
        />
      </div>
      <div className="instrument-grid equal">
        <div>
          <Metric label="Fair value" value={money(result.price, "USD", 2)} />
          <div className="metric-grid">
            {(["delta", "gamma", "vega", "theta", "rho"] as const).map(
              (key) => (
                <Metric
                  key={key}
                  label={key === "theta" ? "Theta / day" : key}
                  value={number(result[key], key === "gamma" ? 4 : 3)}
                />
              ),
            )}
          </div>
          <Formula
            tex={
              type === "call"
                ? "C = SN(d_1)-Ke^{-rT}N(d_2)"
                : "P = Ke^{-rT}N(-d_2)-SN(-d_1)"
            }
          />
        </div>
        <div>
          <LineChart
            label="Option profit and loss at expiry"
            series={[{ label: "P&L at expiry", color: "#e8e3d9", points }]}
            xLabel="underlying price at expiry ($)"
            yLabel="P&L ($)"
            references={[
              { x: strike, label: `K = ${strike}` },
              { x: spot, label: "spot", color: "#a2af89" },
            ]}
          />
          <p className="chart-caption">
            Breakeven:{" "}
            {money(
              type === "call" ? strike + result.price : strike - result.price,
              "USD",
              2,
            )}{" "}
            · Premium included in expiry P&L.
          </p>
        </div>
      </div>
    </Instrument>
  );
}
