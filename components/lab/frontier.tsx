"use client";
import { useMemo, useState } from "react";
import {
  assets,
  optimize,
  portfolioCloud,
  type Portfolio,
} from "@/lib/math/portfolio";
import { number } from "@/lib/utils";
import { Instrument, RangeField } from "./shared";
function Weights({
  portfolio,
  label,
}: {
  portfolio: Portfolio;
  label: string;
}) {
  return (
    <div>
      <p className="eyebrow">{label}</p>
      <div className="weights">
        {assets.map((asset, i) => (
          <div key={asset.name} className="weight-column">
            <small>{number(portfolio.weights[i] * 100, 1)}%</small>
            <div
              style={{ height: `${Math.max(1, portfolio.weights[i] * 100)}%` }}
            />
            <span>{asset.short}</span>
          </div>
        ))}
      </div>
      <p className="chart-caption">
        Return {number(portfolio.return * 100, 1)}% · Risk{" "}
        {number(portfolio.risk * 100, 1)}% · Sharpe{" "}
        {number(portfolio.sharpe, 2)}
      </p>
    </div>
  );
}
export default function Frontier() {
  const [rf, setRf] = useState(2),
    cloud = useMemo(() => portfolioCloud(), []),
    result = useMemo(() => optimize(rf / 100), [rf]);
  const X = (x: number) => 48 + (x / 0.65) * 520,
    Y = (y: number) => 260 - ((y - 0.025) / 0.15) * 230;
  return (
    <Instrument
      id="frontier"
      number="03"
      title="The efficient frontier"
      subtitle="RISK, WITH A RETURN ADDRESS"
      footnote="Illustrative annual returns, volatilities, and correlations. E = equities, B = bonds, G = gold, C = crypto. Long-only portfolios; weights sum to one. Optima are solved across feasible asset subsets."
    >
      <div className="instrument-grid">
        <div>
          <svg
            viewBox="0 0 600 300"
            className="chart"
            role="img"
            aria-label="2,500 sampled portfolios with the efficient frontier, maximum Sharpe portfolio and minimum variance portfolio"
          >
            {[0.04, 0.08, 0.12, 0.16].map((y) => (
              <g key={y}>
                <line x1="48" x2="570" y1={Y(y)} y2={Y(y)} stroke="#282828" />
                <text x="38" y={Y(y) + 4} textAnchor="end">
                  {Math.round(y * 100)}%
                </text>
              </g>
            ))}
            {[0, 0.15, 0.3, 0.45, 0.6].map((x) => (
              <text key={x} x={X(x)} y="281" textAnchor="middle">
                {Math.round(x * 100)}%
              </text>
            ))}
            {cloud.map((p, i) => (
              <circle
                key={i}
                cx={X(p.risk)}
                cy={Y(p.return)}
                r="1.25"
                fill="#8d7d60"
                opacity=".35"
              />
            ))}
            <path
              d={result.frontier
                .map((p, i) => `${i ? "L" : "M"}${X(p.risk)},${Y(p.return)}`)
                .join(" ")}
              fill="none"
              stroke="#dcd5c7"
              strokeWidth="1.5"
            />
            {[
              { p: result.minVar, color: "#a6b89a", label: "MIN VAR" },
              { p: result.maxSharpe, color: "#f3f3f3", label: "MAX SHARPE" },
            ].map(({ p, color, label }, i) => (
              <g key={label}>
                <circle
                  cx={X(p.risk)}
                  cy={Y(p.return)}
                  r="5"
                  fill="#101010"
                  stroke={color}
                  strokeWidth="1.5"
                />
                <text x={X(p.risk) + 10} y={Y(p.return) + (i ? -10 : 19)}>
                  {label}
                </text>
              </g>
            ))}
            <text x="48" y="13">
              expected annual return
            </text>
            <text x="310" y="299" textAnchor="middle">
              annual volatility
            </text>
          </svg>
          <details className="disclosure">
            <summary>View model assumptions</summary>
            <p>
              {assets
                .map(
                  (a) =>
                    `${a.name}: ${a.mean * 100}% expected return, ${a.vol * 100}% volatility`,
                )
                .join(" · ")}
              . These inputs are educational assumptions, not estimated future
              returns.
            </p>
          </details>
        </div>
        <div>
          <RangeField
            label="RISK-FREE RATE"
            value={rf}
            onChange={setRf}
            min={0}
            max={6}
            step={0.1}
            suffix="%"
          />
          <div style={{ marginTop: 24 }}>
            <Weights portfolio={result.maxSharpe} label="MAXIMUM SHARPE" />
          </div>
          <div style={{ marginTop: 25 }}>
            <Weights portfolio={result.minVar} label="MINIMUM VARIANCE" />
          </div>
        </div>
      </div>
    </Instrument>
  );
}
