"use client";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { dcaAssets, dcaDefaults } from "@/content/tools";
import { compound } from "@/lib/math/finance";
import { money, number } from "@/lib/utils";
import { NumberField } from "@/components/lab/shared";
import { ChartLegend, LineChart } from "@/components/ui/chart";
export default function DCA() {
  const [draft, setDraft] = useState(dcaDefaults),
    [rates, setRates] = useState(dcaAssets.map((a) => a.rate)),
    [calculated, setCalculated] = useState({
      inputs: dcaDefaults,
      rates: dcaAssets.map((a) => a.rate),
    });
  const invalid = draft.targetAge <= draft.age;
  const results = dcaAssets.map((a, i) => ({
    ...a,
    ...compound(calculated.inputs, calculated.rates[i]),
  }));
  const years = calculated.inputs.targetAge - calculated.inputs.age;
  const dirty =
    JSON.stringify({ inputs: draft, rates }) !== JSON.stringify(calculated);
  function field(key: keyof typeof draft, value: number) {
    setDraft({ ...draft, [key]: value });
  }
  return (
    <>
      <div className="tool-tabs">
        <span className="active">DCA simulator</span>
        <span>
          More tools <small>IN TIME</small>
        </span>
      </div>
      <div className="dca-layout">
        <div>
          <p className="dca-description">
            A little, every month.
            <br />
            Then let time do its thing.
          </p>
          <p className="muted">
            Dollar cost averaging means investing regularly, whatever the price.
            Explore a fixed-return scenario and see what inflation leaves
            behind.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!invalid)
                setCalculated({ inputs: { ...draft }, rates: [...rates] });
            }}
          >
            <div className="dca-inputs">
              <NumberField
                label="STARTING AMOUNT (MAD)"
                value={draft.starting}
                min={0}
                max={100000000}
                step={100}
                onChange={(v) => field("starting", v)}
              />
              <NumberField
                label="PER MONTH (MAD)"
                value={draft.monthly}
                min={0}
                max={1000000}
                step={100}
                onChange={(v) => field("monthly", v)}
              />
              <NumberField
                label="YOUR AGE"
                value={draft.age}
                min={18}
                max={99}
                onChange={(v) => field("age", Math.round(v))}
              />
              <NumberField
                label="UNTIL AGE"
                value={draft.targetAge}
                min={19}
                max={100}
                onChange={(v) => field("targetAge", Math.round(v))}
              />
            </div>
            <details className="disclosure">
              <summary>Edit assumptions</summary>
              <div className="dca-assumptions">
                {dcaAssets.map((a, i) => (
                  <NumberField
                    key={a.id}
                    label={`${a.label.toUpperCase()} RETURN (%)`}
                    value={rates[i]}
                    min={-30}
                    max={30}
                    step={0.1}
                    onChange={(v) =>
                      setRates(rates.map((r, j) => (j === i ? v : r)))
                    }
                  />
                ))}
                <NumberField
                  label="ANNUAL INFLATION (%)"
                  value={draft.inflation}
                  min={-5}
                  max={25}
                  step={0.1}
                  onChange={(v) => field("inflation", v)}
                />
              </div>
            </details>
            <div className="dca-calculate">
              <button type="submit" className="button" disabled={invalid}>
                Calculate <ArrowUpRight size={16} />
              </button>
              <span className="mono muted">
                {invalid
                  ? "TARGET AGE MUST BE HIGHER"
                  : dirty
                    ? "CHANGES NOT YET APPLIED"
                    : "SCENARIO UP TO DATE"}
              </span>
            </div>
          </form>
          <details className="disclosure">
            <summary>How this works</summary>
            <p>
              These are illustrative constant annual returns, compounded
              monthly. They are editable assumptions, not historical replay or
              forecasts. The starting amount is invested immediately; the same
              nominal contribution is added at the end of every month.
            </p>
            <p>
              Each balance is divided by cumulative inflation to show purchasing
              power in today’s MAD. “Bank cash” starts at a 0% return
              assumption. Fees, taxes, and currency movements are excluded. Real
              markets fluctuate; a smooth curve cannot show that risk.
            </p>
          </details>
        </div>
        <div className="dca-outcome" aria-live="polite">
          <span className="eyebrow">
            AT AGE {calculated.inputs.targetAge} / S&P 500 SCENARIO
          </span>
          <h2>{money(results[0].real, "MAD")}</h2>
          <p>
            in today’s money. The same payments into gold would be{" "}
            <strong>{money(results[1].real, "MAD")}</strong>. Kept as bank cash:{" "}
            <strong>{money(results[2].real, "MAD")}</strong>.
          </p>
          <div className="dca-chart">
            <LineChart
              label="Projected inflation-adjusted savings by age"
              series={results.map((a) => ({
                label: a.label,
                color: a.color,
                points: a.points,
              }))}
              yDomain={[
                0,
                Math.max(
                  1,
                  ...results.flatMap((a) => a.points.map((p) => p.y)),
                ) * 1.06,
              ]}
              xLabel="age"
              yLabel="today’s MAD"
            />
            <ChartLegend series={results} />
          </div>
          <p className="chart-caption">
            {years} years · {number(calculated.inputs.inflation, 1)}% inflation
            · Fixed nominal monthly contributions
          </p>
        </div>
      </div>
      <section className="breakdown-section">
        <div className="section-topline">
          <span className="eyebrow">THE NUMBERS</span>
          <h2>Over {years} years.</h2>
        </div>
        <p className="muted">
          Total cash contributed: {money(results[0].contributed, "MAD")}.
          Nominal balances are future amounts; today’s values adjust for
          inflation.
        </p>
        <div className="table-scroll">
          <table className="breakdown-table">
            <caption className="sr-only">Projected savings breakdown</caption>
            <thead>
              <tr>
                <th scope="col">Scenario</th>
                <th scope="col">Annual return</th>
                <th scope="col">Nominal balance</th>
                <th scope="col">In today’s MAD</th>
              </tr>
            </thead>
            <tbody>
              {results.map((a, i) => (
                <tr key={a.id}>
                  <th scope="row">
                    <i style={{ background: a.color }} />
                    {a.label}
                  </th>
                  <td>{number(calculated.rates[i], 1)}%</td>
                  <td>{money(a.nominal, "MAD")}</td>
                  <td>{money(a.real, "MAD")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
