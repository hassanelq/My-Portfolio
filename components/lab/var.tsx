"use client";
import { useState } from "react";
import { valueAtRisk } from "@/lib/math/finance";
import { normalPDF } from "@/lib/math/normal";
import { money, number } from "@/lib/utils";
import {
  Instrument,
  NumberField,
  RangeField,
  Segmented,
  Metric,
  Readouts,
} from "./shared";
export default function VaR() {
  const [value, setValue] = useState(1000000),
    [vol, setVol] = useState(15),
    [days, setDays] = useState(1),
    [confidence, setConfidence] = useState(0.95);
  const result = valueAtRisk(value, vol / 100, days, confidence),
    X = (z: number) => 40 + ((z + 4) / 8) * 520,
    Y = (p: number) => 245 - (p / 0.42) * 215;
  const curve = Array.from({ length: 161 }, (_, i) => {
      const z = -4 + i * 0.05;
      return [z, normalPDF(z)];
    }),
    tail = curve.filter(([z]) => z <= -result.z);
  return (
    <Instrument
      id="value-at-risk"
      number="04"
      title="Value at risk"
      subtitle="LOOKING INTO THE LEFT TAIL"
      footnote="Parametric Gaussian risk with zero mean, 252 trading days per year, and square-root-of-time scaling. Losses beyond VaR can be larger; expected shortfall measures the average in that tail."
    >
      <div className="controls">
        <NumberField
          label="PORTFOLIO VALUE ($)"
          value={value}
          onChange={setValue}
          min={1}
          max={1000000000}
          step={1}
        />
        <RangeField
          label="ANNUAL VOLATILITY"
          value={vol}
          onChange={setVol}
          min={1}
          max={80}
          suffix="%"
        />
        <div className="field">
          <span>HORIZON</span>
          <Segmented
            label="Risk horizon"
            value={String(days)}
            onChange={(v) => setDays(Number(v))}
            options={[
              { value: "1", label: "1D" },
              { value: "10", label: "10D" },
              { value: "21", label: "1M" },
            ]}
          />
        </div>
        <div className="field">
          <span>CONFIDENCE</span>
          <Segmented
            label="Confidence level"
            value={String(confidence)}
            onChange={(v) => setConfidence(Number(v))}
            options={[
              { value: ".9", label: "90%" },
              { value: ".95", label: "95%" },
              { value: ".99", label: "99%" },
            ].map((o) => ({ ...o, value: String(Number(o.value)) }))}
          />
        </div>
      </div>
      <div className="instrument-grid">
        <div>
          <svg
            viewBox="0 0 600 290"
            className="chart"
            role="img"
            aria-label={`Normal return distribution with ${100 - confidence * 100}% loss tail shaded`}
          >
            <line x1="40" x2="560" y1="245" y2="245" stroke="#444" />
            <path
              d={`M${X(-4)},245 ${tail.map(([z, p]) => `L${X(z)},${Y(p)}`).join(" ")} L${X(-result.z)},${Y(normalPDF(result.z))} L${X(-result.z)},245Z`}
              fill="#ae7066"
              fillOpacity=".27"
            />
            <path
              d={curve
                .map(([z, p], i) => `${i ? "L" : "M"}${X(z)},${Y(p)}`)
                .join(" ")}
              stroke="#d6d0c6"
              fill="none"
              strokeWidth="2"
            />
            <line
              x1={X(-result.z)}
              x2={X(-result.z)}
              y1="38"
              y2="245"
              stroke="#c98c82"
              strokeDasharray="4 4"
            />
            <text x={X(-result.z) - 8} y="28" textAnchor="end">
              VaR {money(result.varValue)}
            </text>
            {[-3, -1, 0, 1, 3].map((z) => (
              <text key={z} x={X(z)} y="264" textAnchor="middle">
                {number(z * result.horizonVol * 100, 1)}%
              </text>
            ))}
            <text x="300" y="287" textAnchor="middle">
              portfolio return over the horizon
            </text>
          </svg>
        </div>
        <div>
          <Metric
            label={`VaR (${confidence * 100}%, ${days} trading days)`}
            value={money(result.varValue)}
          />
          <Readouts
            items={[
              {
                label: "Expected shortfall",
                value: money(result.expectedShortfall),
              },
              {
                label: "VaR / portfolio",
                value: `${number((result.varValue / value) * 100)}%`,
              },
              {
                label: "Horizon volatility",
                value: `${number(result.horizonVol * 100)}%`,
              },
              { label: "Normal quantile (z)", value: number(result.z, 3) },
            ]}
          />
        </div>
      </div>
    </Instrument>
  );
}
