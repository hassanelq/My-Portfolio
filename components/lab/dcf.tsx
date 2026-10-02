"use client";
import { useState } from "react";
import { dcf } from "@/lib/math/finance";
import { compact, number } from "@/lib/utils";
import {
  Instrument,
  NumberField,
  RangeField,
  Metric,
  Readouts,
} from "./shared";
export default function DCF() {
  const [fcf, setFcf] = useState(100),
    [growth, setGrowth] = useState(10),
    [wacc, setWacc] = useState(10),
    [terminal, setTerminal] = useState(3),
    result = dcf(fcf, growth / 100, wacc / 100, terminal / 100);
  const columns = [-1, -0.5, 0, 0.5, 1].map((v) => terminal + v),
    rows = [-1, -0.5, 0, 0.5, 1].map((v) => wacc + v);
  return (
    <Instrument
      id="dcf"
      number="05"
      title="Discounted cash flow"
      subtitle="THE LONG VIEW, DISCOUNTED"
      footnote="Five annual cash flows followed by a Gordon-growth perpetuity. Year 1 FCF is entered directly; years 2–5 grow at the explicit rate. Terminal growth must be below WACC."
    >
      <div className="controls">
        <NumberField
          label="YEAR 1 FREE CASH FLOW ($M)"
          value={fcf}
          onChange={setFcf}
          min={1}
          max={100000}
        />
        <RangeField
          label="GROWTH, YEARS 2–5"
          value={growth}
          onChange={setGrowth}
          min={-20}
          max={40}
          step={0.5}
          suffix="%"
        />
        <RangeField
          label="WACC"
          value={wacc}
          onChange={setWacc}
          min={1}
          max={20}
          step={0.25}
          suffix="%"
        />
        <RangeField
          label="TERMINAL GROWTH"
          value={terminal}
          onChange={setTerminal}
          min={0}
          max={8}
          step={0.25}
          suffix="%"
        />
      </div>
      {!result ? (
        <p role="alert" className="error-message">
          WACC must exceed terminal growth to calculate a finite enterprise
          value.
        </p>
      ) : (
        <div className="instrument-grid equal">
          <div>
            <Metric
              label="Enterprise value"
              value={`$${compact(result.total * 1000000)}`}
            />
            <Readouts
              items={[
                {
                  label: "PV of explicit cash flows",
                  value: `$${compact(result.explicit * 1000000)}`,
                },
                {
                  label: "PV of terminal value",
                  value: `$${compact(result.terminal * 1000000)}`,
                },
                {
                  label: "Terminal value / enterprise value",
                  value: `${number((result.terminal / result.total) * 100, 1)}%`,
                },
              ]}
            />
          </div>
          <div>
            <p className="eyebrow" style={{ marginBottom: 16 }}>
              WACC ROWS / TERMINAL GROWTH COLUMNS
            </p>
            <div className="table-scroll">
              <table className="sensitivity">
                <caption className="sr-only">
                  Enterprise value sensitivity to WACC and terminal growth
                </caption>
                <thead>
                  <tr>
                    <th scope="col">WACC ↓</th>
                    {columns.map((c) => (
                      <th scope="col" key={c}>
                        {number(c, 1)}%
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r}>
                      <th scope="row">{number(r, 1)}%</th>
                      {columns.map((c) => {
                        const cell = dcf(fcf, growth / 100, r / 100, c / 100);
                        return (
                          <td
                            key={c}
                            className={
                              r === wacc && c === terminal ? "active-cell" : ""
                            }
                          >
                            {cell ? `$${compact(cell.total * 1000000)}` : "—"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </Instrument>
  );
}
