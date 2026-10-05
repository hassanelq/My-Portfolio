"use client";
import { useMemo, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  Check,
  History,
  Info,
  Layers,
} from "lucide-react";
import { ParameterHelp } from "@/components/ui/parameter-help";
import { Dialog } from "@/components/ui/dialog";
import { Tooltip } from "@/components/ui/tooltip";
import { NumberStepper } from "@/components/ui/number-stepper";
import { dcaAssets, dcaCash, dcaDefaults } from "@/content/tools";
import history from "@/content/dca-history.json";
import {
  replayHistory,
  portfolioHistory,
  type HistoricalAssetId,
  type SavingsInputs,
} from "@/lib/math/dca";
import { DCAChart, type SavingsSeries } from "./dca-chart";
import { DCAMethod, getInflationSummary } from "./dca-method";
import { SeriesSwatch } from "./series-swatch";
import { useToolCurrency, useInflationReference } from "./tools-settings";

type Popup = "intro" | "method" | null;
export default function DCA() {
  const { currency, money } = useToolCurrency();
  const [inflationRegion, setInflationRegion] = useInflationReference();
  const inflationLabel = inflationRegion === "us" ? "US" : "Moroccan";
  const [inputs, setInputs] = useState<SavingsInputs>(dcaDefaults);
  const [selected, setSelected] = useState<HistoricalAssetId[]>([
    "sp500",
    "gold",
    "world",
    "portfolio",
  ]);
  const [popup, setPopup] = useState<Popup>(null);
  const result = useMemo(
    () => replayHistory(inputs, history, inflationRegion),
    [inputs, inflationRegion],
  );
  const years = inputs.targetAge - inputs.age;
  const inflation = useMemo(
    () => getInflationSummary(years, inflationRegion),
    [years, inflationRegion],
  );
  const allSeries: SavingsSeries[] = result.assets.flatMap((data) =>
    data
      ? [{ ...data, ...dcaAssets.find((asset) => asset.id === data.id)! }]
      : [],
  );
  const visible = allSeries.filter((item) =>
    selected.includes(item.id as HistoricalAssetId),
  );
  const cash = result.cash ? { ...result.cash, ...dcaCash } : null;
  const series = [...visible, ...(cash ? [cash] : [])];
  const main = visible[0] ?? cash;
  const unavailable = dcaAssets.filter(
    (asset) =>
      selected.includes(asset.id) &&
      !result.assets.some((item) => item?.id === asset.id),
  );
  const popupTitles = {
    intro: "Monthly investing?",
    method: "How this works",
  };
  function field(key: keyof SavingsInputs, value: number) {
    setInputs((current) => {
      const next = { ...current, [key]: value };
      if (key === "age" && next.age >= next.targetAge)
        next.targetAge = next.age + 1;
      return next;
    });
  }
  return (
    <section className="savings-simulator" aria-labelledby="savings-title">
      <header className="savings-heading">
        <p className="eyebrow">01 / MONTHLY INVESTING</p>
        <h1 id="savings-title">
          DCA simulator<span className="muted-heading">.</span>
        </h1>
        <div className="savings-heading-bottom">
          <p>
            A regular habit. A longer view.
            <br />
            See what monthly investing became through history.
          </p>
          <button className="savings-info" onClick={() => setPopup("intro")}>
            <Info size={18} strokeWidth={1.5} /> What is this?
          </button>
        </div>
      </header>
      <div className="savings-controls">
        <div className="savings-section-label">
          <h2>Your starting point</h2>
          <span className="mono">ADJUST & EXPLORE</span>
        </div>
        <div className="savings-fields">
          <NumberStepper
            label="Current savings"
            value={inputs.starting}
            onChange={(value) => field("starting", value)}
            min={0}
            max={100000000}
            step={1000}
            prefix={currency}
            help={
              <ParameterHelp label="Current savings">
                Money you can invest right now. It is invested at the start of
                each historical replay.
              </ParameterHelp>
            }
          />
          <NumberStepper
            label="Per month"
            value={inputs.monthly}
            onChange={(value) => field("monthly", value)}
            min={0}
            max={1000000}
            step={100}
            prefix={currency}
            help={
              <ParameterHelp label="Per month">
                The amount you invest at the end of every month. It stays the
                same in currency terms; it does not increase with inflation.
              </ParameterHelp>
            }
          />
          <NumberStepper
            label="Your age"
            help={
              <ParameterHelp label="Your age">
                Your age today. Together with the end age, it sets how long the
                monthly investing lasts.
              </ParameterHelp>
            }
            value={inputs.age}
            onChange={(value) => field("age", value)}
            min={18}
            max={99}
          />
          <NumberStepper
            label="Until age"
            help={
              <ParameterHelp label="Until age">
                The age when you stop this comparison. Longer horizons use fewer
                complete historical periods.
              </ParameterHelp>
            }
            value={inputs.targetAge}
            onChange={(value) => field("targetAge", value)}
            min={inputs.age + 1}
            max={100}
          />
        </div>
        <div className="savings-inflation-control">
          <div>
            <div className="parameter-label">
              <label htmlFor="dca-inflation">Inflation reference</label>
              <ParameterHelp label="Inflation reference">
                Choose Moroccan or US consumer prices to show what your money
                could buy after inflation. Actual monthly CPI is used, not a
                fixed rate. This does not convert currencies.
              </ParameterHelp>
            </div>
            <p>Adjust purchasing power using recorded consumer prices.</p>
          </div>
          <select
            id="dca-inflation"
            value={inflationRegion}
            onChange={(event) =>
              setInflationRegion(event.target.value as "morocco" | "us")
            }
          >
            <option value="morocco">Morocco CPI</option>
            <option value="us">US CPI</option>
          </select>
        </div>
        <fieldset className="savings-comparisons">
          <legend>
            <span className="parameter-label">
              Compare with
              <ParameterHelp label="Compare with">
                Select the investments you want to compare. The bank baseline
                stays visible. Each investment uses its own available history;
                hover an option for its details.
              </ParameterHelp>
            </span>
          </legend>
          <div className="savings-comparison-options">
            {dcaAssets.map((asset) => (
              <Tooltip key={asset.id} content={asset.details}>
                {(descriptionId) => (
                  <label>
                    <input
                      type="checkbox"
                      aria-describedby={descriptionId}
                      checked={selected.includes(asset.id)}
                      onChange={(event) =>
                        setSelected((current) =>
                          event.target.checked
                            ? [...current, asset.id]
                            : current.filter((id) => id !== asset.id),
                        )
                      }
                    />
                    <span className="savings-checkbox">
                      <Check size={13} strokeWidth={2} aria-hidden="true" />
                    </span>
                    <SeriesSwatch {...asset} />
                    <span>{asset.label}</span>
                  </label>
                )}
              </Tooltip>
            ))}
          </div>
        </fieldset>
      </div>
      {unavailable.length > 0 && (
        <p className="savings-unavailable" role="status">
          {unavailable
            .map(
              (asset) =>
                `${asset.label} has up to ${Math.floor(((asset.id === "portfolio" ? portfolioHistory(history) : history.assets[asset.id]).levels.length - 1) / 12)} complete years of history`,
            )
            .join("; ")}
          . Shorten the horizon to draw{" "}
          {unavailable.length === 1 ? "this line" : "these lines"}.
        </p>
      )}
      {main ? (
        <div className="savings-results">
          <div className="savings-result-heading">
            <div className="savings-outcome" aria-live="polite">
              <p>
                Historical median ·{" "}
                {main.id === "cash" ? "leaving it in the bank" : main.label}
              </p>
              <h2>{money(main.median)}</h2>
              <p>
                At age {inputs.targetAge}, after {inflationLabel} inflation.
              </p>
            </div>
            <div className="savings-horizon">
              <span>
                {years}
                <small>years</small>
              </span>
              <p>
                {inputs.age} → {inputs.targetAge}
              </p>
            </div>
          </div>
          <DCAChart
            currency={currency}
            key={`${inputs.age}-${inputs.targetAge}-${selected.join("-")}-${inflationRegion}`}
            series={series}
            age={inputs.age}
            targetAge={inputs.targetAge}
          />
          <div className="savings-chart-caption">
            <span>Age</span>
            <span>Hover or tap to explore the values</span>
          </div>
          <div className="savings-breakdown">
            <table>
              <caption className="sr-only">
                Historical savings over {years} years, adjusted to each period’s
                starting-month purchasing power
              </caption>
              <thead>
                <tr>
                  <th scope="col">At age {inputs.targetAge}</th>
                  <th scope="col">Median</th>
                  <th
                    scope="col"
                    title="10th percentile of historical outcomes"
                  >
                    Lower outcome<span>10th percentile</span>
                  </th>
                  <th
                    scope="col"
                    title="90th percentile of historical outcomes"
                  >
                    Upper outcome<span>90th percentile</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {series.map((item) => (
                  <tr key={item.id}>
                    <th scope="row">
                      <span>
                        <SeriesSwatch {...item} />
                        {item.label}
                      </span>
                      {item.id === "world" && (
                        <small>Price only · no dividends</small>
                      )}
                    </th>
                    <td className="savings-median">{money(item.median)}</td>
                    <td>{money(item.low)}</td>
                    <td>{money(item.high)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="savings-unavailable" role="status">
          There is not enough recorded history for a {years}-year comparison.
          Choose a shorter horizon.
        </p>
      )}
      <div className="savings-bottom">
        <p>Historical results, adjusted for inflation.</p>
        <button className="savings-info" onClick={() => setPopup("method")}>
          <BookOpen size={18} strokeWidth={1.5} /> How this works
        </button>
      </div>
      <Dialog
        open={popup !== null}
        onClose={() => setPopup(null)}
        title={popup ? popupTitles[popup] : ""}
        size={popup === "method" ? "wide" : "compact"}
        footer={<button onClick={() => setPopup(null)}>Got it</button>}
      >
        {popup === "intro" && (
          <div className="savings-intro-list">
            <div>
              <CalendarDays size={21} />
              <p>
                Put the same amount in every month, whatever the market does.
              </p>
            </div>
            <div>
              <History size={21} />
              <p>
                Replay recorded market history, adjusted for {inflationLabel}{" "}
                inflation.
              </p>
            </div>
            <div>
              <Layers size={21} />
              <p>
                Choose S&P 500, gold, MSCI World, US bonds or the diversified
                portfolio. Compare them with leaving your money in the bank.
              </p>
            </div>
          </div>
        )}
        {popup === "method" && (
          <DCAMethod
            inputs={inputs}
            result={result}
            series={series}
            main={main}
            inflation={inflation}
            inflationRegion={inflationRegion}
            currency={currency}
          />
        )}
      </Dialog>
    </section>
  );
}
